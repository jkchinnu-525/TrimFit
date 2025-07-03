import json
import logging
from typing import Dict, Any
from langchain_anthropic import ChatAnthropic
from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage, HumanMessage
from ..config import settings
from langchain_openai import ChatOpenAI
from .ai_jd_extractor import jd_analyzer
from langchain_huggingface import ChatHuggingFace, HuggingFaceEndpoint

logger = logging.getLogger(__name__)


class ResumeTailorService:
    def __init__(self):
        if not settings.HUGGINGFACE_API_KEY:
            raise ValueError(
                "HUGGINGFACE_API_KEY is not set in the environment variables")

        self.client = ChatAnthropic(
            api_key=settings.ANTHROPIC_API_KEY,
            model=settings.ANTHROPIC_MODEL,
        )

        self.client_groq = ChatGroq(
            api_key=settings.GROQ_API_KEY,
            model=settings.GROQ_MODEL,
            max_tokens=settings.GROQ_MAX_TOKENS,
            temperature=0.1
        )
        self.client_openrouter = ChatOpenAI(
            api_key=settings.OPENROUTER_API_KEY,
            base_url=settings.OPENROUTER_BASE_URL,
            model=settings.OPENROUTER_MODEL,
            max_tokens=settings.OPENROUTER_MAX_TOKENS,
            temperature=settings.OPENROUTER_TEMPERATURE,
            extra_headers={
                "HTTP-Referer": "https://trimfit-resume-tailor.com",
                "X-Title": "TrimFit Resume Tailor",
            }
        )

        self.client_huggingface = self._initialize_huggingface()

    def _initialize_huggingface(self):
        try:
            logger.info(
                f"Initializing Hugging Face API client: {settings.HUGGINGFACE_MODEL}")

            llm = HuggingFaceEndpoint(
                repo_id=settings.HUGGINGFACE_MODEL,
                huggingfacehub_api_token=settings.HUGGINGFACE_API_KEY,
                max_new_tokens=settings.HUGGINGFACE_MAX_TOKENS,
                temperature=settings.HUGGINGFACE_TEMPERATURE
            )
            return ChatHuggingFace(llm=llm)

        except Exception as e:
            logger.error(f"Failed to initialize Hugging Face client: {str(e)}")
            logger.warning("Falling back to OpenRouter client")
            return self.client_openrouter

    async def tailor_resume_section(self, section_name: str, section_content: str, job_requirements: Dict[str, Any]) -> Dict[str, Any]:

        section_prompts = {
            "professional_summary": """You are rewriting a professional summary to better align with a specific job opportunity. 

CRITICAL GUIDELINES:
1. **Maintain Natural Flow**: Write in a conversational, professional tone - NOT a keyword list
2. **Lead with Impact**: Start with achievements and value proposition, not just titles  
3. **Subtle Integration**: Weave in relevant skills naturally within context, don't list them
4. **Preserve Voice**: Keep the candidate's personality and writing style from the original
5. **Tell a Story**: Focus on career progression, achievements, and unique value
6. **Quality over Quantity**: Better to mention fewer skills naturally than stuff everything in

APPROACH:
- Use the original summary as your foundation for tone and style
- Highlight relevant experience and achievements that match the role
- Naturally mention 3-5 most important technologies within accomplishment contexts
- Focus on what the candidate has ACHIEVED with these technologies, not just that they know them
- Keep industry focus subtle and integrated, not forced
- Make it sound like the candidate actually wrote it

TARGET ALIGNMENT:
- Industry focus: {industry_domain}  
- Experience level: {experience_level}
- Key technologies: {required_skills}

Write 2-3 sentences that sound natural and compelling.""",

            "experience": """Enhance these work experiences to better align with the job requirements while maintaining authenticity.

GUIDELINES:
1. **Quantify Impact**: Add specific metrics, percentages, or numbers where possible
2. **Highlight Relevant Technologies**: Emphasize experience with: {required_skills}
3. **Match Responsibilities**: Connect past work to target role responsibilities: {responsibilities}
4. **Show Progression**: Demonstrate career growth and increasing responsibilities
5. **Industry Alignment**: Relate experience to {industry_domain} context where relevant

APPROACH:
- Start each bullet with strong action verbs (Developed, Led, Implemented, Optimized, etc.)
- Focus on achievements and results, not just job duties
- Naturally integrate relevant keywords: {keywords}
- Show how your experience prepared you for this specific role
- Maintain chronological accuracy and job titles

Transform the content to be more compelling while staying truthful.""",

            "skills": """Reorganize and enhance this skills section to better match the job requirements.
            
GUIDELINES:
1. **Prioritize Relevance**: Put the most job-relevant skills first in each category
2. **Logical Grouping**: Organize skills into clear, logical categories
3. **Add Strategic Skills**: Include missing relevant skills from: {required_skills}
4. **Remove Clutter**: Remove or de-emphasize less relevant technologies
5. **Create Clear Categories**: Use meaningful category names that make sense

Focus on these key areas: {required_skills}
Keep the structure clean and scannable.""",

            "projects": """Enhance project descriptions to better showcase relevant technical skills and achievements.

GUIDELINES:
1. **Technical Alignment**: Emphasize projects using: {required_skills}
2. **Business Impact**: Show how projects solved real problems or created value
3. **Role Clarity**: Clearly state your specific contributions and responsibilities
4. **Industry Relevance**: Highlight projects relevant to {industry_domain}
5. **Technology Stack**: Prominently feature relevant technologies and tools

APPROACH:
- Lead with project impact and outcomes
- Detail your specific technical contributions
- Include metrics (users served, performance improvements, etc.)
- Highlight collaborative aspects and leadership roles
- Connect projects to business goals and industry needs
- Integrate relevant keywords naturally: {keywords}

Transform descriptions to show technical depth and business value."""
        }

        if section_name not in section_prompts:
            return {"original": section_content, "tailored": section_content, "changes": []}

        return await self._try_with_fallback(section_name, section_content, job_requirements, section_prompts[section_name])

    async def _try_with_fallback(self, section_name: str, section_content: str, job_requirements: Dict[str, Any], prompt_template: str) -> Dict[str, Any]:

        try:
            result = await self._try_model(self.client_huggingface, "HuggingFace", section_name, section_content, job_requirements, prompt_template)
            if result and "JSON parsing failed" not in str(result.get("changes", [])):
                return result
        except Exception as e:
            logger.warning(f"HuggingFace failed for {section_name}: {str(e)}")

        try:
            logger.info(f"Falling back to OpenRouter for {section_name}")
            result = await self._try_model(self.client_openrouter, "OpenRouter", section_name, section_content, job_requirements, prompt_template)
            if result:
                return result
        except Exception as e:
            logger.error(
                f"OpenRouter also failed for {section_name}: {str(e)}")

        return {
            "original": section_content,
            "tailored": section_content,
            "changes": ["Both AI models failed - content preserved unchanged"]
        }

    async def _try_model(self, client, model_name: str, section_name: str, section_content: str, job_requirements: Dict[str, Any], prompt_template: str) -> Dict[str, Any]:
        formatted_prompt = prompt_template.format(
            required_skills=",".join(
                job_requirements.get("required_skills", [])),
            keywords=",".join(job_requirements.get("keywords", [])),
            responsibilities=",".join(
                job_requirements.get("responsibilities", [])[:3]),
            industry_domain=job_requirements.get("industry_domain", ""),
            experience_level=job_requirements.get("experience_level", "")
        )

        messages = [
            SystemMessage(content=f"""You are an expert resume writer who creates compelling, natural-sounding content. 

CORE PRINCIPLES:
- **Human-First Writing**: Write as if you're a skilled professional telling their story, not a robot listing keywords
- **Achievement-Focused**: Emphasize what the candidate has accomplished and delivered
- **Natural Integration**: Weave technical skills into achievement contexts rather than listing them
- **Authentic Voice**: Maintain the candidate's original tone and personality
- **Strategic Relevance**: Align with job requirements through storytelling, not keyword stuffing

{formatted_prompt}
                
RESPONSE FORMAT - Return ONLY a valid JSON object:
{{
    "original": "the original content",
    "tailored": "the improved content that sounds natural and compelling",
    "changes": ["list of key improvements made"]
}}

CRITICAL: Your response must be ONLY the JSON object above. No additional text, no markdown, no explanations.
The 'tailored' content should sound like it was written by a human professional, not an AI."""),
            HumanMessage(
                content=f"Original content: {json.dumps(section_content)}")
        ]

        response = client.invoke(messages)
        content = response.content.strip()

        logger.info(
            f"Raw {model_name} response for {section_name}: {content[:500]}...")

        if content.startswith("```json"):
            content = content[7:-3].strip()
        elif content.startswith("```"):
            start_idx = content.find('{')
            end_idx = content.rfind('}') + 1
            if start_idx != -1 and end_idx != 0:
                content = content[start_idx:end_idx]

        content = content.strip()
        if not content.startswith('{'):
            start_idx = content.find('{')
            end_idx = content.rfind('}') + 1
            if start_idx != -1 and end_idx != 0:
                content = content[start_idx:end_idx]
            else:
                logger.error(
                    f"No valid JSON found in {model_name} response: {content}")
                return {
                    "original": section_content,
                    "tailored": section_content,
                    "changes": [f"Parsing error: No valid JSON found in {model_name}"]
                }

        logger.info(f"Cleaned content for parsing: {content[:200]}...")

        try:
            result = json.loads(content)
            logger.info(
                f"Successfully parsed JSON from {model_name} for {section_name}")
            return result
        except json.JSONDecodeError as json_error:
            logger.error(
                f"JSON decode error from {model_name} for {section_name}: {json_error}")
            logger.error(f"Content that failed to parse: {content}")

            return {
                "original": section_content,
                "tailored": section_content,
                "changes": [f"JSON parsing failed in {model_name}: {str(json_error)}"]
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
            score += 30
            total_weight += 30

        return score / total_weight if total_weight > 0 else 0.0

    async def tailor_complete_resume(self, resume_data: Dict[str, Any], job_description: str) -> Dict[str, Any]:

        job_requirements = await jd_analyzer.extract_job_requirements(job_description)

        initial_score = await self.calculate_match_score(resume_data, job_requirements)

        tailored_sections = {}
        changes_made = {}

        sections_to_tailor = {
            'professional_summary', 'skills'
        }

        sections_to_preserve = {
            'experience', 'education', 'projects', 'certifications', 'achievements'
        }

        sections_to_suggest = {
            'projects', 'experience'
        }

        logger.info(f"Tailoring only these sections: {sections_to_tailor}")
        logger.info(
            f"Preserving these sections unchanged: {sections_to_preserve}")
        logger.info(f"Generating text suggestions for: {sections_to_suggest}")

        if resume_data.get("professional_summary") and "professional_summary" in sections_to_tailor:
            logger.info("Tailoring professional summary section")
            tailored_summary = await self.tailor_resume_section(
                "professional_summary",
                resume_data["professional_summary"],
                job_requirements
            )
            tailored_sections["professional_summary"] = tailored_summary["tailored"]
            changes_made["professional_summary"] = tailored_summary.get(
                "changes", [])

        if resume_data.get("skills") and "skills" in sections_to_tailor:
            logger.info("Tailoring skills section")
            result = await self.tailor_resume_section(
                "skills",
                resume_data["skills"],
                job_requirements
            )
            tailored_sections["skills"] = result["tailored"]
            changes_made["skills"] = result.get("changes", [])

        excluded_sections = []
        for section in ["experience", "education", "projects", "certifications", "achievements"]:
            if resume_data.get(section):
                excluded_sections.append(section)
                logger.info(f"PRESERVING section unchanged: {section}")

        text_suggestions = {}
        for section_name in sections_to_suggest:
            if resume_data.get(section_name):
                logger.info(f"Generating text suggestions for: {section_name}")
                suggestion_result = await self.tailor_resume_section(
                    section_name,
                    resume_data[section_name],
                    job_requirements
                )
                text_suggestions[section_name] = {
                    "original": suggestion_result["original"],
                    "suggested_improvements": suggestion_result["tailored"],
                    "recommended_changes": suggestion_result.get("changes", [])
                }

        if "personal_info" in resume_data:
            tailored_sections["personal_info"] = resume_data["personal_info"]

        logger.info(
            f"Final tailored sections keys: {list(tailored_sections.keys())}")
        logger.info(
            f"Excluded sections (will be preserved): {excluded_sections}")
        logger.info(
            f"Generated text suggestions for: {list(text_suggestions.keys())}")

        scoring_data = {**resume_data}
        for key, value in tailored_sections.items():
            if key in sections_to_tailor:
                scoring_data[key] = value

        final_score = await self.calculate_match_score(scoring_data, job_requirements)

        return {
            "original_resume": resume_data,
            "tailored_resume": tailored_sections,
            "job_analysis": job_requirements,
            "changes_made": changes_made,
            "match_score": final_score,
            "score_improvement": final_score - initial_score,
            "sections_tailored": list(sections_to_tailor),
            "sections_preserved": list(sections_to_preserve),
            "text_suggestions": text_suggestions
        }


resume_tailor = ResumeTailorService()
