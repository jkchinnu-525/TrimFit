import json
from langchain_groq import ChatGroq
from langchain_anthropic import ChatAnthropic
from langchain_openai import ChatOpenAI
from langchain_huggingface import ChatHuggingFace, HuggingFaceEndpoint
import logging
from typing import Dict, Any
from ..config import settings
from langchain_core.messages import SystemMessage, HumanMessage
logger = logging.getLogger(__name__)


class AIExtractor:
    def __init__(self):

        # self.client = ChatAnthropic(
        #     api_key=settings.ANTHROPIC_API_KEY,
        #     model=settings.ANTHROPIC_MODEL
        # )

        # self.client_openai = ChatOpenAI(
        #     api_key=settings.OPENAI_API_KEY,
        #     model=settings.OPENAI_MODEL
        # )

        # self.client_groq = ChatGroq(
        #     api_key=settings.GROQ_API_KEY,
        #     model=settings.GROQ_MODEL,
        #     max_tokens=settings.GROQ_MAX_TOKENS
        # )

        # self.client_openrouter = ChatOpenAI(
        #     api_key=settings.OPENROUTER_API_KEY,
        #     base_url=settings.OPENROUTER_BASE_URL,
        #     model=settings.OPENROUTER_MODEL,
        #     max_tokens=settings.OPENROUTER_MAX_TOKENS,
        #     temperature=settings.OPENROUTER_TEMPERATURE,
        #     model_kwargs={
        #         "extra_headers": {
        #             "HTTP-Referer": "https://trimfit-resume-tailor.com",
        #             "X-Title": "TrimFit Resume Tailor",
        #         }
        #     }
        # )

        self.client_huggingface = self._initialize_huggingface()

    def _initialize_huggingface(self):
        try:
            llm = HuggingFaceEndpoint(
                repo_id=settings.HUGGINGFACE_MODEL,
                huggingfacehub_api_token=settings.HUGGINGFACE_API_KEY,
                max_new_tokens=settings.HUGGINGFACE_MAX_TOKENS,
                temperature=settings.HUGGINGFACE_TEMPERATURE
            )

            return ChatHuggingFace(llm=llm)
        except Exception as e:
            logger.error(f"Failed to initialize Hugging Face client: {str(e)}")
            raise e

    def extract_resume_sections(self, resume_text: str) -> Dict[str, Any]:
        prompt = """You are a professional resume parser. Extract the following sections from the resume text and return them in a clean JSON format:

        1. personal_info: Name, email, phone, address, LinkedIn, etc.
        2. professional_summary: A brief summary/objective
        3. experience: List of work experiences with job_title, company, duration, location, responsibilities
        4. education: Educational background with degree, institution, year, gpa if available
        5. skills: Technical and soft skills categorized
        6. projects: Personal/professional projects with name, description, technologies
        7. certifications: Any certifications or licenses
        8. achievements: Awards, honors, or notable achievements

        Return ONLY a valid JSON object with these sections. If a section is not found, include it as an empty object or array.
        For experience and projects, include as much detail as possible from the text.
        """

        user_prompt = f"""Please extract the following sections from the resume text:
        {resume_text}
        Return the structured data as JSON only.
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
            extracted_data["raw_text"] = resume_text

            return extracted_data

        except Exception as e:
            logger.error(f"AI extraction failed: {str(e)}")
            return {"raw_text": resume_text, "error": str(e)}


ai_extractor = AIExtractor()
