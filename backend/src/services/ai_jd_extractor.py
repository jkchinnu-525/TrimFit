from langchain_groq import ChatGroq
from langchain.schema import SystemMessage, HumanMessage
from ..config import settings
from typing import Dict, Any
import json
import logging

logger = logging.getLogger(__name__)


class JDAnalyzer:
    def __init__(self):
        self.client = ChatGroq(
            api_key=settings.GROQ_API_KEY,
            model=settings.GROQ_MODEL,
            temperature=0.1
        )

    async def extract_job_requirements(self, jd_text: str) -> Dict[str, Any]:
        prompt = """You are an expert job description analyzer. Extract the following information from the job description:

        1. role: The job title/role
        2. required_skills: List of technical skills mentioned (programming languages, frameworks, tools)
        3. responsibilities: Key job responsibilities and duties
        4. qualifications: Required qualifications, education, certifications
        5. experience_level: Years of experience required
        6. keywords: Important keywords and phrases that should appear in a resume
        7. industry_domain: The industry or domain (e.g., fintech, healthcare, e-commerce)
        
        Return ONLY a valid JSON object with these fields. If a field is not found, use empty string or empty array.
        """

        user_prompt = f"""Extract structured information from this job description:
        {jd_text}
        
        Return as JSON only.
        """
        try:
            messages = [
                SystemMessage(content=prompt),
                HumanMessage(content=user_prompt)
            ]
            response = self.client.invoke(messages)
            content = response.content.strip()
            if content.startswith("```json"):
                content = content[7:-3]
            extracted_data = json.loads(content)
            extracted_data["description"] = jd_text
            return extracted_data
        except Exception as e:
            logger.error(f"Error extracting JD: {str(e)}")
            return {
                "role": "",
                "description": jd_text,
                "required_skills": [],
                "responsibilities": [],
                "qualifications": [],
                "keywords": [],
                "experience_level": "",
                "industry_domain": "",
                "error": str(e)
            }


jd_analyzer = JDAnalyzer()
