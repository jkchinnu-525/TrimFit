from pydantic import BaseModel
from typing import Optional, List


class PersonalInfo(BaseModel):
    name: Optional[str] = ""
    email: Optional[str] = ""
    phone: Optional[str] = ""
    address: Optional[str] = ""
    linkedin: Optional[str] = ""
    github: Optional[str] = ""


class WorkExperience(BaseModel):
    job_title: Optional[str] = ""
    company: Optional[str] = ""
    duration: Optional[str] = ""
    location: Optional[str] = ""
    responsibilities: List[str] = []
    technologies: List[str] = []


class Education(BaseModel):
    degree: Optional[str] = ""
    institution: Optional[str] = ""
    field: Optional[str] = ""
    year: Optional[str] = ""
    gpa: Optional[str] = ""


class Skills(BaseModel):
    programming_languages: List[str] = []
    web_technologies: List[str] = []
    devops_tools: List[str] = []
    databases: List[str] = []
    development_tools: List[str] = []
    version_control_tools: List[str] = []


class Project(BaseModel):
    name: Optional[str] = ""
    description: Optional[str] = ""
    technologies: List[str] = []
    details: List[str] = []


class ExtractedResumeData(BaseModel):
    personal_info: Optional[PersonalInfo] = None
    professional_summary: Optional[str] = ""
    experience: List[WorkExperience] = []
    education: List[Education] = []
    skills: Optional[Skills] = None
    projects: List[Project] = []
    certifications: List[str] = []
    achievements: List[str] = []
    raw_text: str
    error: Optional[str] = None


class ProcessedResult(BaseModel):
    success: bool
    message: str
    processing_time: float = 0.0
    data: Optional[ExtractedResumeData] = None


class ResumeSection(BaseModel):
    title: str
    content: str
    items: List[str] = []


class Experience(BaseModel):
    job_title: str
    company: str
    duration: str
    start_date: str = ""
    end_date: str = ""
    location: str = ""
    description: str = ""
    responsibilities: List[str] = []
    achievements: List[str] = []


class ParsedResume(BaseModel):
    raw_text: str
