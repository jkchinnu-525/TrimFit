from typing import Dict, List, Any
from .base_analyzer import BaseAnalyzer
from sklearn.metrics.pairwise import cosine_similarity
import re


class ProjectAnalyzer(BaseAnalyzer):

    def __init__(self, sentence_model):
        super().__init__(sentence_model)
        self.project_headers = [
            "Projects", "Key Projects", "Notable Projects", "Personal Projects",
            "Academic Projects", "Professional Projects", "Project Experience",
            "Selected Projects", "Recent Projects", "Portfolio", "Project Portfolio",
            "Accomplishments", "Major Projects", "Relevant Projects", "Featured Projects",
            "Project Work", "Project Highlights", "Significant Projects", "Project Summary",
            "Technical Projects", "Side Projects", "Open Source Projects", "Research Projects"
        ]

        self.separators = [',', ';', '|', '•', '●', '▪', '/',
                           '\\', '&', ':', ":-", "--", "-", "-->", "->"]

    def is_project_header(self, line: str) -> bool:
        return self._is_section_header(line, "projects", self.project_headers)

    def extract_projects_from_text(self, text: str) -> List[Dict[str, Any]]:
        project_sections = self._find_project_sections(text)

        all_projects = []
        for section_text in project_sections:
            projects = self._parse_project_entries(section_text)
            all_projects.extend(projects)

        return all_projects

    def _find_project_sections(self, text: str) -> List[str]:
        lines = text.split('\n')
        project_sections = []
        project_embeddings = self._get_section_embeddings(
            "projects", self.project_headers)

        i = 0
        while i < len(lines):
            line = lines[i].strip()
            if not line:
                i += 1
                continue

            line_embedding = self.sentence_model.encode([line])
            similarities = cosine_similarity(
                line_embedding, project_embeddings)
            max_similarity = similarities.max()

            if max_similarity > 0.6:
                section_content = self._extract_general_section_content(
                    lines, i, [self.is_project_header])
                if section_content:
                    project_sections.append(section_content)
                i += len(section_content.split('\n'))
            else:
                i += 1

        return project_sections

    def _parse_project_entries(self, section_text: str) -> List[Dict[str, Any]]:
        if not section_text.strip():
            return []

        projects = []
        lines = [line.strip()
                 for line in section_text.split('\n') if line.strip()]

        project_keywords = [
            'chat application', 'sentiment analysis', 'e-commerce', 'platform',
            'website', 'api', 'tool', 'system', 'application', 'project'
        ]

        non_project_words = [
            'skills', 'programming languages', 'web technologies', 'devops tools',
            'databases', 'development tools', 'version control', 'education',
            'work experience', 'technologies:'
        ]

        i = 0
        while i < len(lines):
            line = lines[i]

            if any(non_project in line.lower() for non_project in non_project_words):
                i += 1
                continue

            if any(location in line for location in [', Tamil Nadu, INDIA', ', Remote, INDIA', 'Ltd', 'Inc', 'Corp']):
                i += 1
                continue

            is_project_name = False

            if not any(action_word in line.lower()[:15] for action_word in [
                'developed', 'built', 'designed', 'implemented', 'created', 'worked',
                'used', 'integrated', 'deployed', 'gained', 'technologies:'
            ]):
                if 10 <= len(line) <= 80:
                    if any(keyword in line.lower() for keyword in project_keywords):
                        is_project_name = True
                    elif i + 1 < len(lines):
                        next_line = lines[i + 1]
                        if any(action in next_line.lower()[:15] for action in [
                            'developed', 'built', 'designed', 'implemented', 'created'
                        ]):
                            is_project_name = True

            if is_project_name:
                project_name = line.strip()

                description_lines = []
                i += 1

                while i < len(lines):
                    current_line = lines[i]

                    if not any(action_word in current_line.lower()[:15] for action_word in [
                        'developed', 'built', 'designed', 'implemented', 'created', 'worked',
                        'used', 'integrated', 'deployed', 'gained', 'technologies:'
                    ]) and 10 <= len(current_line) <= 80 and \
                            any(keyword in current_line.lower() for keyword in project_keywords) and \
                            not current_line.lower().startswith(('twitter api', 'api integration')):
                        break

                    if current_line.upper() in ['EDUCATION', 'SKILLS', 'WORK EXPERIENCE', 'EXPERIENCE']:
                        break

                    if 'bachelor of technology' in current_line.lower() or 'vvit' in current_line.lower():
                        break

                    description_lines.append(current_line)
                    i += 1

                if description_lines:
                    project = {
                        'name': project_name,
                        'description': ' '.join(description_lines).strip(),
                        'technologies': [],
                        'duration': '',
                        'role': '',
                        'achievements': [],
                        'links': {}
                    }

                    projects.append(project)
                    continue

            i += 1

        return projects

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
