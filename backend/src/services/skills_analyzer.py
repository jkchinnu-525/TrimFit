import chromadb
from typing import Dict, List, Any, Optional
from sentence_transformers import SentenceTransformer
import uuid
import re
from sklearn.metrics.pairwise import cosine_similarity

from .work_experience_analyzer import WorkExperienceAnalyzer
from .summary_analyzer import SummaryAnalyzer
from .project_analyzer import ProjectAnalyzer
from .base_analyzer import BaseAnalyzer


class VectorSkillsAnalyzer(BaseAnalyzer):
    def __init__(self, sentence_model: SentenceTransformer):
        super().__init__(sentence_model)
        self.client = chromadb.PersistentClient(path="chroma_db")
        self.collection = self.client.get_or_create_collection(
            name="Collection",
            metadata={"hnsw:space": "cosine"}
        )

        self.experience_analyzer = WorkExperienceAnalyzer(sentence_model)
        self.summary_analyzer = SummaryAnalyzer(sentence_model)
        self.project_analyzer = ProjectAnalyzer(sentence_model)

        self.skills_headers = [
            "Technical Skills", "Skills", "Core Skills", "Programming Skills",
            "Technical Expertise", "Technologies", "Technical Competencies",
            "Programming Languages", "Languages & Technologies", "Tools & Technologies",
            "Software Skills", "Computer Skills", "IT Skills", "Tech Stack",
            "Technical Proficiencies", "Technology Stack", "Core Competencies"
        ]

        self.skill_sub_headers = {
            "programming_languages": [
                "Programming Languages", "Languages", "Coding Languages",
                "Development Languages", "Programming", "Languages & Frameworks",
                "Programming Technologies", "Coding", "Languages Used"
            ],
            "web_technologies": [
                "Web Technologies", "Web Development", "Frontend", "Backend",
                "Web Frameworks", "Web Tools", "Web Stack", "Frontend Technologies",
                "Backend Technologies", "Web Development Tools", "UI/UX Technologies"
            ],
            "databases": [
                "Databases", "Database Technologies", "Data Storage",
                "Database Management", "DB Technologies", "Data Management",
                "Database Systems", "Database Tools"
            ],
            "devops": [
                "DevOps", "Cloud Technologies", "Infrastructure",
                "Deployment", "Cloud Platforms", "DevOps Tools",
                "Cloud Services", "Infrastructure Tools", "Deployment Tools",
                "Cloud Computing", "Platform Technologies"
            ],
            "data_science": [
                "Data Science", "Machine Learning", "AI/ML", "Analytics",
                "Data Analysis", "ML Frameworks", "Artificial Intelligence",
                "Data Technologies", "ML Tools", "AI Technologies"
            ],
            "version_control": [
                "Version Control", "Source Control", "Git", "VCS",
                "Version Management", "Source Code Management"
            ],
            "testing": [
                "Testing", "Quality Assurance", "QA", "Test Frameworks",
                "Testing Tools", "Testing Technologies", "Quality Control"
            ],
            "development_tools": [
                "Development Tools", "IDEs", "Tools", "Development Environment",
                "Integrated Development Environment", "Code Editors", "Development Software"
            ]
        }

        self.separators = [',', ';', '|', '•', '●', '▪', '/',
                           '\\', '&', ':', ":-", "--", "-", "-->", "->"]

        self._compute_skill_embeddings()
        self._compute_sub_skill_embeddings()

        self.initialize_skill_database()

    # def _compute_skill_embeddings(self):
        self.embeddings_cache["skills"] = self.sentence_model.encode(
            self.skills_headers)

    def _compute_sub_skill_embeddings(self):
        for category, headers in self.skill_sub_headers.items():
            self.embeddings_cache[f"sub_{category}"] = self.sentence_model.encode(
                headers)

    def _is_skill_header(self, line: str) -> bool:
        return self._is_section_header(line, "skills", self.skills_headers)

    def _detect_sub_skill_header(self, line: str, threshold: float = 0.65) -> Optional[str]:
        if not line or len(line.split()) > 6 or len(line) > 40:
            return None

        clean_line = line.strip()
        clean_line = re.sub(r'^[•●▪▫◦‣⁃\-\*\+\d+\.]\s*', '', clean_line)
        clean_line = clean_line.rstrip(':').strip()

        line_embedding = self.sentence_model.encode([clean_line])

        best_category = None
        best_similarity = 0

        for category in self.skill_sub_headers.keys():
            sub_embeddings = self.embeddings_cache[f"sub_{category}"]
            similarities = cosine_similarity(line_embedding, sub_embeddings)
            max_similarity = similarities.max()

            if max_similarity > best_similarity and max_similarity > threshold:
                best_similarity = max_similarity
                best_category = category

        return best_category

    def initialize_skill_database(self):
        self.skill_patterns = {
            "programming_languages": [
                "Python", "JavaScript", "TypeScript", "Java", "C++", "C#", "Go", "Rust",
                "PHP", "Ruby", "Swift", "Kotlin", "Scala", "HTML", "CSS", "SQL", "PL/SQL"
            ],
            "web_technologies": [
                "HTML", "CSS", "React", "React.js", "Next.js", "Next JS", "Vue.js", "Angular",
                "Node.js", "NodeJS", "Express.js", "FastAPI", "Django", "Flask", "REST",
                "RESTful", "GraphQL", "Tailwind CSS", "Bootstrap", "SOAP", "HTML5", "CSS3"
            ],
            "databases": [
                "PostgreSQL", "MySQL", "MongoDB", "Mongo DB", "Redis", "Elasticsearch",
                "SQLite", "Oracle", "Cassandra", "DynamoDB", "SQL", "NoSQL", "Database Design"
            ],
            "devops": [
                "AWS", "Azure", "Google Cloud", "GCP", "Docker", "Kubernetes",
                "CI/CD", "DevOps", "Terraform", "Jenkins", "AWS Lambda",
                "AWS S3", "Grafana", "Prometheus", "Ansible", "Nginx"
            ],
            "data_science": [
                "Pandas", "NumPy", "TensorFlow", "PyTorch", "Scikit-learn",
                "Machine Learning", "Deep Learning", "NLP", "Computer Vision"
            ],
            "version_control": [
                "Git", "GitHub", "GitLab", "Bitbucket", "SVN", "Mercurial"
            ],
            "testing": [
                "Unit Testing", "Integration Testing", "End-to-End Testing", "Selenium", "JUnit", "PyTest"
            ],
            "development_tools": [
                "IntelliJ", "Cursor", "Visual Studio", "VSCode", "PyCharm", "Eclipse",
                "Sublime Text", "Atom", "Vim", "Emacs", "Jupyter", "Postman"
            ],
        }

        for category, skills in self.skill_patterns.items():
            embeddings = self.sentence_model.encode(skills)
            ids = [str(uuid.uuid4()) for _ in skills]
            metadatas = [{"category": category, "skill": skill}
                         for skill in skills]

            self.collection.add(
                embeddings=embeddings.tolist(),
                documents=skills,
                metadatas=metadatas,
                ids=ids
            )

    def extract_skills_from_text(self, text: str, threshold: float = 0.7) -> Dict[str, List[str]]:
        categorized_skills = {category: []
                              for category in self.skill_patterns.keys()}

        skill_sections = self._find_skill_sections(text)

        for section_text in skill_sections:
            sub_header_skills = self._extract_skills_with_sub_headers(
                section_text)

            for category, skills in sub_header_skills.items():
                if category in categorized_skills:
                    categorized_skills[category].extend(skills)

            if not sub_header_skills:
                extracted_skills = self._extract_skills_from_section(
                    section_text)
                vector_categorized = self._categorize_skills(
                    extracted_skills, threshold)

                for category, skills in vector_categorized.items():
                    if category in categorized_skills:
                        categorized_skills[category].extend(skills)

        if not any(categorized_skills.values()):
            all_skills = self._extract_skills_from_section(text)
            vector_categorized = self._categorize_skills(all_skills, threshold)

            for category, skills in vector_categorized.items():
                if category in categorized_skills:
                    categorized_skills[category].extend(skills)

        text_lower = text.lower()

        for category, patterns in self.skill_patterns.items():
            for pattern in patterns:
                pattern_variations = [
                    pattern,
                    pattern.lower(),
                    pattern.replace('.', ''),
                    pattern.replace(' ', ''),
                    pattern.replace('-', ''),
                ]

                for variation in pattern_variations:
                    if variation.lower() in text_lower:
                        if pattern not in categorized_skills[category]:
                            categorized_skills[category].append(pattern)
                        break

        for category in list(categorized_skills.keys()):
            seen = set()
            unique_skills = []
            for skill in categorized_skills[category]:
                if skill.lower() not in seen:
                    seen.add(skill.lower())
                    unique_skills.append(skill)

            categorized_skills[category] = unique_skills

            if not categorized_skills[category]:
                del categorized_skills[category]

        return categorized_skills

    def _extract_skills_with_sub_headers(self, section_text: str) -> Dict[str, List[str]]:
        if not section_text:
            return {}

        lines = section_text.split('\n')
        categorized_skills = {}
        current_category = None
        current_skills = []

        for line in lines:
            line = line.strip()
            if not line:
                continue

            if (self.experience_analyzer.is_experience_header(line) or
                self.project_analyzer.is_project_header(line) or
                    self.summary_analyzer.is_professional_summary_header(line)):
                break

            detected_category = self._detect_sub_skill_header(line)

            if detected_category:
                if current_category and current_skills:
                    if current_category not in categorized_skills:
                        categorized_skills[current_category] = []
                    categorized_skills[current_category].extend(current_skills)

                current_category = detected_category
                current_skills = []
            else:
                line_skills = self._extract_skills_from_line(line)
                current_skills.extend(line_skills)

        if current_category and current_skills:
            if current_category not in categorized_skills:
                categorized_skills[current_category] = []
            categorized_skills[current_category].extend(current_skills)

        return categorized_skills

    def _extract_skills_from_line(self, line: str) -> List[str]:
        if not line:
            return []

        skills = []

        bullet_patterns = [r'[•●▪▫◦‣⁃]', r'^\s*[-*+]\s+', r'^\s*\d+\.\s+']
        for pattern in bullet_patterns:
            line = re.sub(pattern, '', line).strip()

        current_skills = [line]

        for sep in self.separators:
            new_skills = []
            for skill in current_skills:
                new_skills.extend([s.strip()
                                  for s in skill.split(sep) if s.strip()])
            current_skills = new_skills

        for skill in current_skills:
            skill = re.sub(r'\([^)]*\)', '', skill).strip()
            skill = re.sub(r'\d+(\.\d+)*', '', skill).strip()
            skill = skill.strip('.,;:')

            if len(skill) > 1 and not skill.isdigit() and skill.lower() not in ['etc', 'and', 'or']:
                skills.append(skill)

        return list(set(skills))

    def _find_skill_sections(self, text: str) -> List[str]:
        lines = text.split('\n')
        skill_sections = []
        header_embeddings = self.embeddings_cache["skills"]

        i = 0
        while i < len(lines):
            line = lines[i].strip()
            if not line:
                i += 1
                continue

            line_embedding = self.sentence_model.encode([line])

            similarities = cosine_similarity(line_embedding, header_embeddings)
            max_similarity = similarities.max()

            if max_similarity > 0.6:  # Threshold for header similarity
                section_content = self._extract_section_content(lines, i)
                if section_content:
                    skill_sections.append(section_content)
                i += len(section_content.split('\n'))
            else:
                i += 1

        return skill_sections

    def _extract_section_content(self, lines: List[str], start_idx: int) -> str:
        content_lines = []
        i = start_idx + 1

        while i < len(lines):
            line = lines[i].strip()

            if self._is_skill_header(line):
                break

            if not line:
                empty_count = 0
                j = i
                while j < len(lines) and not lines[j].strip():
                    empty_count += 1
                    j += 1
                if empty_count > 2:
                    break

            content_lines.append(line)
            i += 1

        return '\n'.join(content_lines).strip()

    def _extract_skills_from_section(self, section_text: str) -> List[str]:
        if not section_text:
            return []

        potential_skills = []

        bullet_patterns = [r'[•●▪▫◦‣⁃]', r'^\s*[-*+]\s+', r'^\s*\d+\.\s+']
        lines = section_text.split('\n')

        for line in lines:
            line = line.strip()
            if not line:
                continue

            if self._detect_sub_skill_header(line):
                continue

            for pattern in bullet_patterns:
                line = re.sub(pattern, '', line).strip()

            skills = [line]

            for sep in self.separators:
                new_skills = []
                for skill in skills:
                    new_skills.extend([s.strip()
                                      for s in skill.split(sep) if s.strip()])
                skills = new_skills

            for skill in skills:
                skill = re.sub(r'\([^)]*\)', '', skill).strip()
                skill = re.sub(r'\d+(\.\d+)*', '', skill).strip()
                skill = skill.strip('.,;:')

                if len(skill) > 1 and not skill.isdigit():
                    potential_skills.append(skill)

        return list(set(potential_skills))

    def _categorize_skills(self, skills: List[str], threshold: float) -> Dict[str, List[str]]:
        categorized_skills = {}

        for skill in skills:
            query_embedding = self.sentence_model.encode([skill])[0].tolist()

            results = self.collection.query(
                query_embeddings=[query_embedding],
                n_results=3,
                include=["metadatas", "documents", "distances"]
            )

            if results['distances'][0] and results['distances'][0][0] < (1 - threshold):
                category = results['metadatas'][0][0]['category']
                matched_skill = results['documents'][0][0]

                if category not in categorized_skills:
                    categorized_skills[category] = []

                if matched_skill not in categorized_skills[category]:
                    categorized_skills[category].append(matched_skill)

        return categorized_skills

    def detect_all_sections(self, text: str) -> Dict[str, str]:
        lines = [line.strip() for line in text.split("\n") if line.strip()]
        sections = {}
        current_section = None
        current_content = []

        for line in lines:
            detected_section = None

            if self._is_skill_header(line):
                detected_section = "skills"
            elif self.experience_analyzer.is_experience_header(line):
                detected_section = "experience"
            elif self.project_analyzer.is_project_header(line):
                detected_section = "projects"
            elif self.summary_analyzer.is_professional_summary_header(line):
                detected_section = "professional_summary"

            if detected_section:
                if current_section and current_content:
                    sections[current_section] = '\n'.join(current_content)

                current_section = detected_section
                current_content = []
            elif current_section:
                current_content.append(line)

        if current_section and current_content:
            sections[current_section] = '\n'.join(current_content)

        return sections

    def extract_experience_from_text(self, text: str) -> List[Dict[str, Any]]:
        return self.experience_analyzer.extract_experience_from_text(text)

    def extract_projects_from_text(self, text: str) -> List[Dict[str, Any]]:
        return self.project_analyzer.extract_projects_from_text(text)

    def extract_professional_summary_from_text(self, text: str) -> str:
        return self.summary_analyzer.extract_professional_summary_from_text(text)

    def parse_complete_resume(self, text: str) -> Dict[str, Any]:
        sections = self.detect_all_sections(text)

        skills = self.extract_skills_from_text(text)
        experience = self.extract_experience_from_text(text)
        projects = self.extract_projects_from_text(text)
        professional_summary = self.extract_professional_summary_from_text(
            text)

        return {
            "sections": sections,
            "skills": skills,
            "experience": experience,
            "projects": projects,
            "professional_summary": professional_summary,
            "raw_text": text
        }
