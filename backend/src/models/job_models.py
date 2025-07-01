from pydantic import BaseModel
from typing import List, Dict, Any


class JobDescription(BaseModel):
    role: str
    description: str
    required_skills: List[str] = []
    responsibilities: List[str] = []
    qualifications: List[str] = []
    keywords: List[str] = []
    experience_level: str = ""
    industry_domain: str = ""


class TailoringRequest(BaseModel):
    job_role: str
    job_description: str


class TailoredResume(BaseModel):
    original_resume: Dict
    tailored_resume: Dict
    changes_made: Dict[str, List[str]]
    match_score: float
    suggestions: List[str] = []


class ResumeGenerationRequest(BaseModel):
    tailored_data: Dict[str, Any]
    template_name: str = "modern"
    format_type: str = "docx" 


class EnhancementRequest(BaseModel):
    content: str
    content_type: str  
    job_requirements: Dict[str, Any]


class AIEnhancementResponse(BaseModel):
    original: str
    enhanced: str
    improvement_type: str
    confidence_score: float
    suggestions: List[str] = []
