# AI Features — Skill Gap Intelligence Platform

## Overview
SGIP uses the Groq API (hosted LLM inference) for three AI-powered features. All AI outputs are treated as untrusted input and validated before storage.

## Features

### 1. Resume Skill Extraction
**Endpoint:** `POST /api/resume/parse`  
**Model:** `qwen/qwen3.8-27b`  
**Input:** PDF resume text (after PII redaction and prompt injection sanitization)  
**Output:** JSON array of skill name strings  
**Rate limit:** 4 requests per hour per user  
**Fallback:** Returns empty array `[]` on timeout or parse failure. User sees "No skills extracted" and can add skills manually.  
**Validation:** Output must be a JSON array. Non-array responses are discarded.

### 2. Gap Analysis Explanation
**Endpoint:** `POST /api/gap/analyse`  
**Model:** `qwen/qwen3.8-27b`  
**Input:** List of matched and missing skills, target role title  
**Output:** Plain text explanation (max 300 tokens)  
**Fallback:** Returns `"Unable to generate explanation at this time."` on failure. Gap score is still calculated and saved using the deterministic engine.  
**Note:** The compatibility score is calculated by a deterministic fuzzy matching engine, NOT by the LLM. AI only generates the human-readable explanation.

### 3. Roadmap Generation
**Endpoint:** `POST /api/roadmap/generate`  
**Model:** `qwen/qwen3.8-27b`  
**Input:** List of missing skills with levels and weights, target role title  
**Output:** JSON array of roadmap steps `[{ title, description, resourceUrl, order }]`  
**Rate limit:** Covered by gap analysis rate limit  
**Fallback:** Returns a single default step if JSON parsing fails or timeout occurs.  
**Validation:** Output must be a JSON array. Non-array responses trigger the fallback.

### 4. JD Skill Extraction (Gap Analysis — JD Mode)
**Model:** `openai/gpt-oss-20b`  
**Input:** Job description text (sanitized for prompt injection)  
**Output:** JSON array of `{ skillName, level, weight }` objects  
**Fallback:** Returns empty array. User sees "Could not extract skills from job description."

## Data Sent to Groq
| Feature | Data Sent | PII Redacted |
|---|---|---|
| Resume parsing | Resume text | Yes — email, phone, name patterns replaced |
| Gap explanation | Skill names only | N/A — no personal data |
| Roadmap generation | Skill names only | N/A — no personal data |
| JD extraction | Job description text | Sanitized for injections |

## AI Metadata Storage
Every AI response stores: model name, request timestamp, prompt tokens, completion tokens, total tokens. Stored in `aiMetadata` field on `GapReport` and `Roadmap` documents.

## Evaluation Notes
- Skill extraction accuracy depends on resume text quality. Scanned PDFs produce empty results.
- Fuzzy matching threshold is 0.5 Jaccard similarity. May over-match on short skill names.
- Soft skills are filtered from gap requirements via system prompt instruction. Effectiveness varies by model response.
- Roadmap quality is not evaluated against a ground truth dataset. Steps are plausible but not verified by domain experts.

## Responsible AI Checklist
- [x] User permission confirmed before processing (authentication required)
- [x] PII removed before sending to model
- [x] Structured output schema enforced
- [x] Timeouts applied (15 seconds per request)
- [x] Fallbacks implemented for all failure modes
- [x] AI outputs validated before storage
- [x] Model metadata stored with outputs
- [x] Limitations documented
- [x] Evaluation dataset of 10 test cases created (`docs/ai-evaluation/evaluation_dataset.json`)
- [x] Adversarial input testing implemented in dataset (`docs/ai-evaluation/README.md`)
- [ ] Cost monitoring dashboard (planned)
