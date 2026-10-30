# Skill Gap Intelligence Platform (SGIP)

<p align="center">
  <h3 align="center">AI-powered career development platform with intelligent skill gap analysis, personalized roadmaps, and a collaborative skill marketplace.</h3>
</p>

<p align="center">
  <a href="https://sgip-pi.vercel.app">
    <img src="https://img.shields.io/badge/%20TRY%20LIVE%20DEMO-Launch%20SGIP-ff4757?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo"/>
  </a>
  &nbsp;
  <a href="https://sgip.onrender.com">
    <img src="https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render" alt="Backend"/>
  </a>
  &nbsp;
  <a href="https://opensource.org/licenses/MIT">
    <img src="https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge" alt="License"/>
  </a>
</p>
<p align="center">
  <img src="https://img.shields.io/badge/Node.js-22-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB"/>
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React"/>
</p>

## About SGIP
The Skill Gap Intelligence Platform (SGIP) is a comprehensive web application designed to bridge the gap between student capabilities and industry requirements. By leveraging AI-powered resume parsing and deterministic skill gap analysis, SGIP generates actionable, personalized learning roadmaps while fostering a collaborative skill-bartering marketplace.

## 📸 Project Preview

> Some Screenshots from the Platform.

### Landing Page
<p align="center">
<img src="./docs/images/Landingpage.png" width="95%" alt="Landing Page"/>
</p>

### Student Dashboard
<p align="center">
<img src="./docs/images/Dashboard.png" width="95%" alt="Dashboard"/>
</p>

### AI Gap Analysis
<p align="center">
<img src="./docs/images/Gapanalysis.png" width="95%" alt="Gap Analysis"/>
</p>

### Skill Marketplace
<p align="center">
<img src="./docs/images/Marketplace.png" width="95%" alt="Marketplace"/>
</p>

---

## Platform Metrics

| Metric | Count |
|--------|-------|
|  Gap Reports Generated | 30 |
|  Roadmaps Created | 13 |
|  Skills in Database | 121 |
|  Career Roles | 5 |
|  Average Compatibility Score | 48.4% |

*Stats fetched live from MongoDB at README generation time — June 26, 2026*

## Features

-  **AI Resume Parsing**: Extracts skills directly from user resumes using Qwen 3.8 27B on Groq.
-  **Gap Analysis (Role + JD mode)**: Calculates skill compatibility against predefined career roles or custom Job Descriptions.
-  **Fuzzy Skill Matching**: Deterministically matches overlapping user skills with industry requirements using Jaccard similarity.
-  **Personalized Roadmap**: Generates detailed, step-by-step learning roadmaps to acquire missing skills.
- **Mentor Discovery**: Connects students with experienced mentors for personalized guidance.
- **Evidence Review**: Allows students to submit proof of skill acquisition for mentor review and verification.
-  **4-Role RBAC**: Secure access controls divided between Student, Mentor, Placement Officer, and Admin.
-  **Audit Trail**: Immutable logging of all state-changing actions across the platform.
-  **Rate Limiting**: Defends endpoints against abuse with intelligent rate limiting.
-  **PII Redaction**: Scrubs Personally Identifiable Information before interacting with LLMs.

## Tech Stack

### Frontend
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-0055FF?style=for-the-badge&logo=framer&logoColor=white)
![React Hook Form](https://img.shields.io/badge/React_Hook_Form-7-EC5990?style=for-the-badge&logo=reacthookform&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-6-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white)

### Backend
![Node.js](https://img.shields.io/badge/Node.js-22-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-4-000000?style=for-the-badge&logo=express&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Helmet](https://img.shields.io/badge/Helmet-Security-333333?style=for-the-badge)
![Morgan](https://img.shields.io/badge/Morgan-Logger-blue?style=for-the-badge)

### Database
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-ODM-880000?style=for-the-badge)
![Cloudinary](https://img.shields.io/badge/Cloudinary-Media-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)

### AI
![Groq](https://img.shields.io/badge/Groq-LPU_Inference-F55036?style=for-the-badge)
![Qwen](https://img.shields.io/badge/Qwen-3.8_27B-615ced?style=for-the-badge)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--OSS_20B-412991?style=for-the-badge&logo=openai&logoColor=white)

### Cloud
![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-Backend-46E3B7?style=for-the-badge&logo=render&logoColor=black)

### DevOps
![Git](https://img.shields.io/badge/Git-VCS-F05032?style=for-the-badge&logo=git&logoColor=white)
![npm](https://img.shields.io/badge/npm-Package-CB3837?style=for-the-badge&logo=npm&logoColor=white)

## 🏗️ Architecture

```text
[Browser] 
   │
   └──► [Vercel (React Frontend)] 
              │
              └──► [Render (Express Backend)] 
                         ├──► [MongoDB Atlas (Database)]
                         ├──► [Cloudinary (Asset Storage)]
                         └──► [Groq API (LLM Inference)]
```

## 👥 User Roles

| Role | Access | Key Features |
|------|--------|--------------|
| **Student** | Marketplace, barter, evidence, gap analysis, roadmap, resume, profile | Explore skills, generate roadmaps, trade skills, and build portfolios. |
| **Mentor** | Evidence review, assigned students | Review student evidence, provide actionable feedback, guide career growth. |
| **Placement Officer** | Analytics and reporting | Monitor overall cohort progress and skill distributions. |
| **Admin** | User management, role catalog, audit logs, full access | System configuration, moderation, log monitoring, role management. |

## AI Pipeline

Resume PDF ──► pdf2json ──► PII Redaction ──► Groq LLM (Qwen 3.8 27B) ──► Skill Array
                                                                             │
                                                                             ▼
                                                                      Fuzzy Gap Engine
                                                                             │
    Roadmap ◄── AI Explanation (GPT-OSS / Qwen) ◄── Compatibility Score ◄────┘


##  Security Features

- JWT authentication with 7-day expiry
- bcrypt password hashing (cost factor 10)
- Role-based access control (Student, Mentor, PlacementOfficer, Admin)
- Helmet.js security headers
- CORS restricted to allowed origins
- Rate limiting on auth routes (10 req / 15 min)
- Rate limiting on resume parser (4 req / hour)
- Rate limiting on gap analysis (10 req / hour)
- Rate limiting on evidence submission (10 req / hour)
- Immutable audit trail for all state-changing actions
- PII redaction before sending data to Groq API
- Prompt injection sanitization on user-supplied text
- File upload validation (MIME type + size limits)
- Cloudinary secure storage for user uploads
- isActive check on every authenticated request
- Password minimum: 8 characters, at least one letter and one number
- Ownership enforcement on all user-scoped resources

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account (or local MongoDB)
- Groq API Key
- Cloudinary Account

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/mohdarsh786/sgip.git
   cd sgip
   ```

2. **Install dependencies:**
   ```bash
   npm install          # Install root dependencies (concurrently)
   cd client && npm install
   cd ../server && npm install
   ```

3. **Environment Setup:**
   - Copy `server/.env.example` to `server/.env` and fill in:
     `MONGODB_URI`, `JWT_SECRET`, `GROQ_API_KEY`, `CLOUDINARY_URL`, etc.
   - Copy `client/.env.example` to `client/.env` and update the `VITE_API_URL`.

4. **Seed Database (Optional):**
   ```bash
   cd server
   npm run seed
   ```

5. **Run Development Servers:**
   ```bash
   # From the project root
   npm run dev
   ```

## 👨‍💻 Team

- **Mohd. Arsh** — [![GitHub Badge](https://img.shields.io/badge/GitHub-mohdarsh786-181717?style=flat&logo=github)](https://github.com/mohdarsh786)
- **Mohd. Faiz** — [![GitHub Badge](https://img.shields.io/badge/GitHub-mdfaizu8941-181717?style=flat&logo=github)](https://github.com/mdfaizu8941)

## 📄 License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).
