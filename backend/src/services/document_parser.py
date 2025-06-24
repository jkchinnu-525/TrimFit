import spacy, re, logging
from docx import Document
from typing import List, Dict, Optional, Any

from pdfminer.high_level import extract_text
from pdfminer.layout import LAParams
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from .skills_analyzer import SkillsAnalyzer
from ..config import settings

logger = logging.getLogger(__name__)

class DocumentParser:
    
    def __init__(self):
        try:
            self.nlp = spacy.load(settings.SPACY_MODEL)
        except OSError:
            logger.error(f"NLP Model not found::{settings.SPACY_MODEL}")
            raise
        
        try:
            self.sentence_transformer = SentenceTransformer(settings.SENTENCE_TRANSFORMER_MODEL)
        except Exception as e:
            logger.error(f"Sentence Transformer Model not found::{settings.SENTENCE_TRANSFORMER_MODEL}")
            raise
        
        self.reference_sections = {
            "skills": [
                "technical skills", "skills", "core competencies", "expertise", 
                "programming languages", "technologies", "technical proficiencies",
                "technical expertise", "key skills", "professional skills"
            ],
            "experience": [
                "experience", "work experience", "professional experience", 
                "employment history", "career history", "work history"
            ],
            "education": [
                "education", "academic background", "qualifications", 
                "academic qualifications", "educational background"
            ],
            "projects": [
                "projects", "key projects", "notable projects", "project experience",
                "personal projects", "academic projects", "professional projects"
            ]
        }
        self.compute_section_headers()
    
        
    def compute_section_headers(self):
        self.section_headers = {}
        for section_type, headers in self.reference_sections.items():
            embeddings = self.sentence_transformer.encode(headers)
            self.section_headers[section_type] = embeddings
    
    
    def parse_document(self, file_path: str, file_type: str ) -> Dict[str, Any]:
        try:
            if file_type == "pdf":
                text = self.extract_pdf_text(file_path)
            elif file_type == "docx":
                text = self.extract_docx_text(file_path)
            else:
                raise ValueError(f"Unsupported file type: {file_type}")
            
            return self.parse_text(text)
            
        except Exception as e:
            logger.error(f"Error parsing document::{str(e)}")
            raise
    
    
    def extract_pdf_text(self, file_path: str) -> str:
        try: 
            laparams = LAParams(
                line_margin = 0.5,
                char_margin = 0.1,
                word_margin = 2.0,
                boxes_flow=0.5,
                all_texts=False
            )
            return extract_text(file_path, laparams=laparams)
        except Exception as e:
            logger.error(f"Error extracting PDF text::{str(e)}")
            return ""
        
        
    def extract_docx_text(self, file_path: str) -> str:
        try:
            doc = Document(file_path)
            text_content = []
            cur_heading = None
            buffer = []
            
            for paragraph in doc.paragraphs:
                text = paragraph.text.strip()
                if not text:
                    continue
                text_content.append(text)
            
            return '\n'.join(text_content)
        except Exception as e:
            logger.error(f"Error extracting Docx Text::{str(e)}")
            return ""
        

    def parse_text(self, text: str) -> Dict[str, Any]:
        
        sections = self.detect_sections_semantically(text)
        structured_sections = {}
        for section_name, content in sections.items():
            structured_sections[section_name] = {
                "title": section_name.replace('_', ' ').title(),
                "content": content,
                "items": content.split('\n') if content else []
            }
        
        return {
            "sections": structured_sections,
            "professional_summary": self.extract_professional_summary(sections.get("professional_summary", "")),
            "experience": self.extract_experience(sections.get("experience", "")),
            "skills": self.extract_skills(sections.get("skills", "")),
            "projects": self.extract_projects(sections.get("projects", "")),
            "raw_text": text,
        }
        
    
    def detect_sections_semantically(self, text: str) -> Dict[str,str]:
        lines = [line.strip() for line in text.split("\n") if line.strip()]
        sections = {}
        curr_section = None
        curr_content = []

        for line in lines:
            if self.is_section_header(line):
                if curr_section and curr_content:
                    sections[curr_section] = '\n'.join(curr_content)
                    print(f"DEBUG: Saved section '{curr_section}' with content: {sections[curr_section][:100]}...")
                
                detected_section = self.classify_section_header(line)
                print(f"DEBUG: Found header '{line}', classified as: {detected_section}")
                
                if detected_section:
                    curr_section = detected_section
                    curr_content = []
                else:
                    if curr_section:
                        curr_content.append(line)
            else:
                if curr_section:
                    curr_content.append(line)
        
        if curr_section and curr_content:
            sections[curr_section] = '\n'.join(curr_content)
            print(f"DEBUG: Saved final section '{curr_section}' with content: {sections[curr_section][:100]}...")
        
        print(f"DEBUG: Total sections found: {list(sections.keys())}")
        for section_name, content in sections.items():
            print(f"DEBUG: Section '{section_name}' has {len(content)} characters")
        
        return sections
    
    
    def is_section_header(self, line: str) -> bool:
        word_count = len(line.split())
        if word_count > 3:
            return False
        
        if len(line) > 30:
            return False
        
        indicators = [
            line.isupper() and word_count <= 4,
            bool(re.match(r'^[A-Z][A-Z\s&/-]+$', line)) and word_count <= 4,
        ]
        
        return any(indicators)
    
    
    def classify_section_header(self, header: str) -> Optional[str]:
        header_embedding = self.sentence_transformer.encode([header])
        best_similarity = 0.0
        best_section = None
        for section_type, embeddings in self.section_headers.items():
            similarities = cosine_similarity(header_embedding, embeddings)
            max_similarity = similarities.max()
            
            if max_similarity > 0.6 and max_similarity > best_similarity:
                best_similarity = max_similarity
                best_section = section_type
        return best_section
        
    def extract_experience(self, text: str) -> List[Dict[str, Any]]:
        if not text.strip():
            return []
        
        entries = []
        lines = [line.strip() for line in text.split('\n') if line.strip()]
        
        current_entry = {}
        for line in lines:
            if any(keyword in line.lower() for keyword in ['engineer', 'developer', 'manager', 'analyst']):
                if current_entry:
                    entries.append(current_entry)
                current_entry = {
                    'job_title': line,
                    'company': '',
                    'duration': '',
                    'description': '',
                    'responsibilities': []
                }
            elif current_entry:
                current_entry['description'] += ' ' + line
        
        if current_entry:
            entries.append(current_entry)
        
        return entries

    def extract_skills(self, text: str) -> Dict[str, List[str]]:
        analyzer = SkillsAnalyzer(self.sentence_transformer)
        result = analyzer.extract_skills_with_subsections(text)
        
        if not result:
            print("DEBUG: No skills from section detection, trying fallback")
            return self.extract_skills_fallback(text)
        
        print(f"DEBUG: Found skills: {result}")
        return result

    def extract_skills_fallback(self, text: str) -> Dict[str, List[str]]:
        skills = {}
        lines = text.split('\n')
        
        in_skills_section = False
        for line in lines:
            line = line.strip()
            if line.upper() == "SKILLS":
                in_skills_section = True
                continue
            
            if in_skills_section and line.upper() in ["WORK EXPERIENCE", "PROJECTS", "EDUCATION", "EXPERIENCE"]:
                break
            
            if in_skills_section and ':' in line:
                parts = line.split(':', 1)
                if len(parts) == 2:
                    category = parts[0].strip().lower().replace(' ', '_').replace('/', '_')
                    skills_text = parts[1].strip()
                    
                    separators = [',', ';', '|', '.']
                    skills_list = [skills_text]
                    
                    for sep in separators:
                        new_list = []
                        for item in skills_list:
                            new_list.extend([s.strip() for s in item.split(sep) if s.strip()])
                        skills_list = new_list
                    
                    filtered_skills = [skill for skill in skills_list if len(skill) > 1 and not skill.isdigit()]
                    
                    if filtered_skills:
                        skills[category] = filtered_skills
        
        print(f"DEBUG: Fallback extracted skills: {skills}")
        return skills

    def extract_projects(self, text: str) -> List[Dict[str, Any]]:
        if not text.strip():
            return []
        
        projects = []
        lines = [line.strip() for line in text.split('\n') if line.strip()]
        
        current_project = {}
        for line in lines:
            if line and not current_project:
                current_project = {
                    'name': line,
                    'description': '',
                    'technologies': [],
                    'duration': '',
                    'role': '',
                    'achievements': []
                }
            elif current_project:
                current_project['description'] += ' ' + line
        
        if current_project:
            projects.append(current_project)
        
        return projects
    
    def extract_professional_summary(self, text: str) -> str:
        if not text.strip():
            return ""
        
        summary = text.strip()
        
        lines = summary.split('\n')
        cleaned_lines = []
        
        for line in lines:
            line = line.strip() 
            if line.upper() in ['PROFESSIONAL SUMMARY', 'SUMMARY', 'PROFILE', 'ABOUT', 'OVERVIEW']:
                continue
            if line:
                cleaned_lines.append(line)
        
        return ' '.join(cleaned_lines)