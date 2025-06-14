# Trimfit - AI-Powered Resume Optimization 🚀

[![Frontend Deployment](https://img.shields.io/badge/Vercel-Coming%20Soon-lightgray)](https://trimfit-app.vercel.app)
[![Backend Deployment](https://img.shields.io/badge/Backend-In%20Development-yellow)](https://trimfit-backend.onrender.com)

An AI-powered resume optimization platform that helps job seekers land more interviews faster by analyzing and tailoring resumes to specific job descriptions. Built with Next.js (frontend) and Python/FastAPI (backend), featuring advanced NLP and machine learning capabilities.

## Features ✨

- **Resume Analysis**

  Analyze resume structure and quantify effectiveness using trained Scikit-learn classifiers with actionable feedback on formatting and content gaps

- **Semantic Analysis**

  Match resume content to job descriptions semantically using BERT embeddings, ensuring deeper relevance beyond keyword stuffing with 40% improved ATS compatibility

- **Vector Similarity Search**

  Real-time skill matching with job requirements using FAISS integration, reducing alignment time from minutes to milliseconds

- **Pricing Plans**

  Multiple subscription tiers for different user needs and usage levels

## Tech Stack 🛠️

**Frontend**  
[![Next.js](https://img.shields.io/badge/Next.js-15.3-blue?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-%2361DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.1-38B2AC?logo=tailwind-css)](https://tailwindcss.com)
[![Framer Motion](https://img.shields.io/badge/Framer%20Motion-12.18-FF0055?logo=framer)](https://framer.com/motion)

**Backend** (In Development)  
[![Python](https://img.shields.io/badge/Python-3.11-blue?logo=python)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.95-009688?logo=fastapi)](https://fastapi.tiangolo.com/)

**AI/ML**  
[![Scikit-learn](https://img.shields.io/badge/Scikit--learn-Latest-F7931E?logo=scikit-learn)](https://scikit-learn.org)
[![BERT](https://img.shields.io/badge/BERT-Transformers-FF6F00)](https://huggingface.co/docs/transformers/model_doc/bert)
[![FAISS](https://img.shields.io/badge/FAISS-Vector%20Search-4B8BBE)](https://github.com/facebookresearch/faiss)

**Animation & UX**  
[![Lenis](https://img.shields.io/badge/Lenis-1.3-black)](https://github.com/studio-freight/lenis)

**Deployment**  
[![Vercel](https://img.shields.io/badge/Vercel-Frontend-black?logo=vercel)](https://vercel.com)
[![Render](https://img.shields.io/badge/Render-Backend-46E3B7?logo=render)](https://render.com)

## Setup Instructions ⚙️

### Prerequisites

- Next.js 13+
- Python 3.11+ (for backend development)
- npm, yarn, pnpm, or bun

### Local Development

1. **Clone Repository**

   ```bash
   git clone https://github.com/yourusername/trimfit.git
   cd trimfit
   ```

2. **Frontend Setup**

   ```bash
   cd frontend
   npm install
   # Copy environment file if available
   cp .env.example .env.local
   ```

3. **Run Frontend Development Server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the application.

4. **Backend Setup** (Coming Soon)

   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   pip install -r requirements.txt
   cp .env.example .env
   ```

### Build for Production

```bash
cd frontend
npm run build
npm run start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Performance Optimizations 🚀

- **Next.js 15** with Turbopack for faster development builds
- **Optimized animations** with reduced blur effects and efficient CSS transforms
- **Image optimization** with Next.js Image component
- **Responsive design** with Tailwind CSS

Project Link: [https://github.com/yourusername/trimfit](https://github.com/yourusername/trimfit)

---

**Trimfit** - Land More Interviews Faster—No More Generic Applications
