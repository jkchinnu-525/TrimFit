from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage, HumanMessage
from ..config import settings
from langchain_openai import ChatOpenAI
from typing import Dict, Any
from langchain_anthropic import ChatAnthropic
from langchain_huggingface import ChatHuggingFace, HuggingFaceEndpoint
import json
import logging

logger = logging.getLogger(__name__)


class JDAnalyzer:
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
            response = self.client_huggingface.invoke(messages)
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
