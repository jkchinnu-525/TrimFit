import json
import logging
from typing import Dict, Any
from langchain_groq import ChatGroq
from langchain.schema import SystemMessage, HumanMessage
from ..config import settings
from .ai_jd_extractor import jd_analyzer

logger = logging.getLogger(__name__)


class ResumeTailorService:
    def __init__(self):
        self.client = ChatGroq(
            api_key=settings.GROQ_API_KEY,
            model=settings.GROQ_MODEL,
            temperature=0.1
        )

    async def tailor_resume_section(self, section_name: str, section_content: str, job_requirements: Dict[str, Any]) -> Dict[str, Any]:

        section_prompts = {
            "professional_summary": """Rewrite this professional summary to emphasize skills and experience relevant to the job.
            Focus on: {required_skills}, {industry_domain}, and {experience_level}.
            Keep it concise (3-4 sentences) and impactful.""",

            "experience": """Enhance these work experiences to highlight relevant achievements and skills.
            Emphasize: {required_skills} and {keywords}.
            Add quantifiable results where possible.
            Focus on responsibilities that match: {responsibilities}""",

            "skills": """Reorganize and enhance this skills section.
            Prioritize skills matching: {required_skills}.
            Group them logically and add any missing relevant skills from the job description.""",

            "projects": """Enhance project descriptions to emphasize technologies and outcomes relevant to the job.
            Highlight: {required_skills} and {keywords}.
            Focus on projects relevant to: {industry_domain}"""
        }

        if section_name not in section_prompts:
            return {"original": section_content, "tailored": section_content, "changes": []}
        try:
            formatted_prompt = section_prompts[section_name].format(
                required_skills=",".join(
                    job_requirements.get("required_skills", [])),
                keywords=",".join(job_requirements.get("keywords", [])),
                responsibilities=",".join(
                    job_requirements.get("responsibilities", [])[:3]),
                industry_domain=job_requirements.get("industry_domain", ""),
                experience_level=job_requirements.get("experience_level", "")
            )

            messages = [
                SystemMessage(content=f"""You are a professional resume writer. {formatted_prompt}
                Return a JSON object with:
                - original: the original content
                - tailored: the improved content
                - changes: list of key changes made
                
                IMPORTANT: Return ONLY valid JSON. Do not include any markdown formatting or extra text.
                """),
                HumanMessage(
                    content=f"Original content: {json.dumps(section_content)}")
            ]
            response = self.client.invoke(messages)
            content = response.content.strip()
            if content.startswith("```json"):
                content = content[7:-3]
            return json.loads(content)
        except Exception as e:
            logger.error(f"Error tailoring resume section: {str(e)}")
            return {
                "original": section_content,
                "tailored": section_content,
                "changes": [f"Error: {str(e)}"]
            }

    async def calculate_match_score(self, resume_data: Dict[str, Any], job_requirements: Dict[str, Any]) -> float:
        score = 0.0
        total_weight = 0.0

        resume_skills = set()

        if "skills" in resume_data:
            skills_data = resume_data["skills"]
            for category in ["programming_languages", "web_technologies", "databases", "devops_tools"]:
                resume_skills.update([s.lower()
                                     for s in skills_data.get(category, [])])

        required_skills = set(s.lower()
                              for s in job_requirements.get("required_skills", []))
        if required_skills:
            skill_match = len(resume_skills.intersection(
                required_skills))/len(required_skills)
            score += skill_match * 40
            total_weight += 30
        if resume_data.get("experience"):
            score += 30  # Basic score for having experience
            total_weight += 30

        return score / total_weight if total_weight > 0 else 0.0

    async def tailor_complete_resume(self, resume_data: Dict[str, Any], job_description: str) -> Dict[str, Any]:

        job_requirements = await jd_analyzer.extract_job_requirements(job_description)

        initial_score = await self.calculate_match_score(resume_data, job_requirements)

        tailored_sections = {}
        changes_made = {}

        if resume_data.get("professional_summary"):
            tailored_summary = await self.tailor_resume_section(
                "professional_summary",
                resume_data["professional_summary"],
                job_requirements
            )
            tailored_sections["professional_summary"] = tailored_summary["tailored"]
            changes_made["professional_summary"] = tailored_summary.get(
                "changes", [])

        if resume_data.get("experience"):
            tailored_experience = []
            experience_changes = []

            for exp in resume_data["experience"]:
                result = await self.tailor_resume_section(
                    "experience",
                    exp,
                    job_requirements
                )
                tailored_experience.append(result["tailored"])
                experience_changes.extend(result.get("changes", []))

            tailored_sections["experience"] = tailored_experience
            changes_made["experience"] = experience_changes

        if resume_data.get("skills"):
            result = await self.tailor_resume_section(
                "skills",
                resume_data["skills"],
                job_requirements
            )
            tailored_sections["skills"] = result["tailored"]
            changes_made["skills"] = result.get("changes", [])

        if resume_data.get("projects"):
            tailored_projects = []
            project_changes = []

            for project in resume_data["projects"]:
                result = await self.tailor_resume_section(
                    "projects",
                    project,
                    job_requirements
                )
                tailored_projects.append(result["tailored"])
                project_changes.extend(result.get("changes", []))

            tailored_sections["projects"] = tailored_projects
            changes_made["projects"] = project_changes

        for key in ["personal_info", "education", "certifications", "achievements"]:
            if key in resume_data:
                tailored_sections[key] = resume_data[key]

        tailored_data = {**resume_data, **tailored_sections}
        final_score = await self.calculate_match_score(tailored_data, job_requirements)

        return {
            "original_resume": resume_data,
            "tailored_resume": tailored_sections,
            "job_analysis": job_requirements,
            "changes_made": changes_made,
            "match_score": final_score,
            "score_improvement": final_score - initial_score,
        }

resume_tailor = ResumeTailorService()