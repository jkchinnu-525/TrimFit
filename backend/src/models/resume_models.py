from pydantic import BaseModel
from typing import Optional, List, Dict

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

class Project(BaseModel):
    name: str
    description: str = ""
    technologies: List[str] = []
    duration: str = ""
    role: str = ""
    achievements: List[str] = []
    links: Dict[str, str] = {}

class ParsedResume(BaseModel):
    sections: Dict[str, ResumeSection]
    skills: Dict[str, List[str]]
    experience: List[Experience] = []
    projects: List[Project] = []
    professional_summary: str = ""
    raw_text: str
    word_count: int

class ProcessedResult(BaseModel):
    success: bool
    message: str
    processing_time: float = 0.0
    data: Optional[ParsedResume] = None