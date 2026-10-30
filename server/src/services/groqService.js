import Groq from 'groq-sdk';
import { redactPII, sanitizeForLLM } from '../utils/sanitizer.js';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || '' });

/**
 * Creates a promise that rejects after `ms` milliseconds.
 */
const timeout = (ms) =>
  new Promise((_, reject) =>
    setTimeout(() => reject(new Error(`Groq request timed out after ${ms}ms`)), ms)
  );

const TIMEOUT_MS = 30_000;

/**
 * Safely parse a JSON array from raw model text.
 * Recovers truncated JSON if the model runs out of tokens at an object boundary.
 * @param {string} rawText
 * @returns {any[]}
 */
const parseJsonArraySafely = (rawText) => {
  if (!rawText || typeof rawText !== 'string') return [];
  const startIdx = rawText.indexOf('[');
  if (startIdx === -1) return [];
  const textFromBracket = rawText.slice(startIdx);
  const endIdx = textFromBracket.lastIndexOf(']');
  if (endIdx !== -1) {
    try {
      const parsed = JSON.parse(textFromBracket.slice(0, endIdx + 1));
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {}
  }
  // Fallback for truncated outputs: close array after last complete object '}'
  const lastBrace = textFromBracket.lastIndexOf('}');
  if (lastBrace !== -1) {
    try {
      const parsed = JSON.parse(textFromBracket.slice(0, lastBrace + 1) + ']');
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {}
  }
  return [];
};

/**
 * Build a consistent aiMetadata object from a Groq response.
 * @param {object} response - Groq API response object
 * @param {string} modelName - model identifier used in the request
 */
const buildAiMetadata = (response, modelName) => ({
  model: response?.model || modelName || '',
  timestamp: new Date(),
  promptTokens: response?.usage?.prompt_tokens || 0,
  completionTokens: response?.usage?.completion_tokens || 0,
  totalTokens: response?.usage?.total_tokens || 0,
});

/**
 * Extract skills from resume text using Groq LLM.
 * Applies PII redaction and prompt injection sanitization before the API call.
 * @param {string} resumeText - Raw text extracted from a PDF resume
 * @returns {Promise<{ skills: string[], aiMetadata: object }>}
 */
export const extractSkillsFromResume = async (resumeText) => {
  const modelName = process.env.GROQ_MODEL_LARGE || 'qwen/qwen3.8-27b';
  // Security: redact PII then strip injection patterns
  const safeText = sanitizeForLLM(redactPII(resumeText));

  try {
    const response = await Promise.race([
      groq.chat.completions.create({
        model: modelName,
        messages: [
          {
            role: 'system',
            content: 'You are a resume skill extractor. Extract technical and domain-specific skills from the resume text. Focus on programming languages, frameworks, tools, platforms, and technologies. Exclude generic soft skills like communication, teamwork, leadership, and time management. Return ONLY a JSON array of skill name strings. No preamble, no markdown, no explanation.',
          },
          {
            role: 'user',
            content: safeText,
          },
        ],
        temperature: 0.1,
        max_tokens: 1500,
      }),
      timeout(TIMEOUT_MS),
    ]);

    const text = response.choices[0]?.message?.content?.trim() || '[]';
    const skills = parseJsonArraySafely(text);

    return { skills, aiMetadata: buildAiMetadata(response, modelName) };
  } catch (error) {
    console.error('extractSkillsFromResume error:', error.message);
    return { skills: [], aiMetadata: buildAiMetadata(null, modelName) };
  }
};

/**
 * Generate a brief explanation of a student's skill gap relative to a career role.
 * @param {string[]} matchedSkills
 * @param {Array<{skillName: string}>} missingSkills
 * @param {string} careerRoleTitle
 * @returns {Promise<{ explanation: string, aiMetadata: object }>}
 */
export const generateGapExplanation = async (matchedSkills, missingSkills, careerRoleTitle) => {
  const modelName = process.env.GROQ_MODEL_FAST || 'qwen/qwen3.8-27b';

  try {
    const missingNames = missingSkills.map((s) => s.skillName).join(', ');
    const matchedNames = matchedSkills.join(', ');

    // Sanitize role title against injection
    const safeRoleTitle = sanitizeForLLM(careerRoleTitle);

    const response = await Promise.race([
      groq.chat.completions.create({
        model: modelName,
        messages: [
          {
            role: 'system',
            content: 'You are a career advisor. Provide a concise, encouraging explanation.',
          },
          {
            role: 'user',
            content: `A student wants to become a "${safeRoleTitle}". They already have these skills: ${matchedNames || 'none'}. They are missing these skills: ${missingNames || 'none'}. Explain in 3-4 sentences what the student is good at and what they need to learn. Be specific and constructive.`,
          },
        ],
        temperature: 0.5,
        max_tokens: 300,
      }),
      timeout(TIMEOUT_MS),
    ]);

    const explanation = response.choices[0]?.message?.content?.trim() || 'Unable to generate explanation.';
    return { explanation, aiMetadata: buildAiMetadata(response, modelName) };
  } catch (error) {
    console.error('generateGapExplanation error:', error.message);
    return { explanation: 'Unable to generate explanation at this time.', aiMetadata: buildAiMetadata(null, modelName) };
  }
};

/**
 * Generate a learning roadmap for missing skills.
 * @param {Array<{skillName: string, level: string, weight: number}>} missingSkills
 * @param {string} careerRoleTitle
 * @returns {Promise<{ steps: Array, aiMetadata: object }>}
 */
export const generateRoadmap = async (missingSkills, careerRoleTitle) => {
  const modelName = process.env.GROQ_MODEL_LARGE || 'qwen/qwen3.8-27b';
  const defaultStep = [
    {
      title: `Learn fundamentals for ${careerRoleTitle}`,
      description: 'Start by researching the core skills required for this role.',
      resourceUrl: null,
      order: 1,
    },
  ];

  try {
    const skillList = missingSkills
      .map((s) => `${s.skillName} (level: ${s.level}, priority weight: ${s.weight})`)
      .join('\n');

    const safeRoleTitle = sanitizeForLLM(careerRoleTitle);

    const response = await Promise.race([
      groq.chat.completions.create({
        model: modelName,
        messages: [
          {
            role: 'system',
            content:
              'You are a career roadmap generator. Return ONLY a JSON array. Each item must have: title (string), description (string), resourceUrl (string or null), order (number). No preamble, no markdown.',
          },
          {
            role: 'user',
            content: `Generate a step-by-step learning roadmap for a student who wants to become a "${safeRoleTitle}". They need to learn the following skills:\n${skillList}\n\nCreate actionable learning steps ordered by priority.`,
          },
        ],
        temperature: 0.3,
        max_tokens: 2500,
      }),
      timeout(TIMEOUT_MS),
    ]);

    const text = response.choices[0]?.message?.content?.trim() || '[]';
    const parsed = parseJsonArraySafely(text);
    const steps = parsed.length > 0 ? parsed : defaultStep;

    return { steps, aiMetadata: buildAiMetadata(response, modelName) };
  } catch (error) {
    console.error('generateRoadmap error:', error.message);
    return { steps: defaultStep, aiMetadata: buildAiMetadata(null, modelName) };
  }
};

/**
 * Extract structured skills from a job description using Groq LLM.
 * Applies prompt injection sanitization before the API call.
 * @param {string} jdText - Job description or role prompt text
 * @returns {Promise<{ skills: Array<{skillName: string, level: string, weight: number}>, aiMetadata: object }>}
 */
export const extractSkillsFromJD = async (jdText) => {
  const modelName = process.env.GROQ_MODEL_LARGE || 'qwen/qwen3.8-27b';
  // Security: sanitize JD text before sending to LLM
  const safeJdText = sanitizeForLLM(jdText);

  try {
    const response = await Promise.race([
      groq.chat.completions.create({
        model: modelName,
        messages: [
          {
            role: 'system',
            content:
              'You are a skill extractor. Extract required skills from the job description or role prompt. Return ONLY a JSON array of objects with shape { skillName: string, level: "beginner"|"intermediate"|"advanced", weight: number between 1 and 10 }. Focus on technical and domain-specific skills only. Exclude generic soft skills such as communication, teamwork, leadership, time management, adaptability, problem solving, collaboration, and mentorship. No preamble, no markdown.',
          },
          { role: 'user', content: safeJdText },
        ],
        temperature: 0.1,
        max_tokens: 2500,
      }),
      timeout(TIMEOUT_MS),
    ]);

    const rawText = response.choices[0]?.message?.content || '[]';
    const skills = parseJsonArraySafely(rawText);

    return { skills, aiMetadata: buildAiMetadata(response, modelName) };
  } catch (error) {
    console.error('extractSkillsFromJD error:', error.message);
    return { skills: [], aiMetadata: buildAiMetadata(null, modelName) };
  }
};
