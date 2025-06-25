from typing import Dict, List, Any
from .base_analyzer import BaseAnalyzer
from sklearn.metrics.pairwise import cosine_similarity


class WorkExperienceAnalyzer(BaseAnalyzer):

    def __init__(self, sentence_model):
        super().__init__(sentence_model)
        self.experience_headers = [
            "Work Experience", "Professional Experience", "Employment History",
            "Career History", "Work History", "Experience", "Professional Background",
            "Employment", "Career Experience", "Previous Positions", "Job Experience",
            "Professional Roles", "Work Background", "Career Background", "Positions Held",
            "Professional History", "Employment Record", "Work Record", "Job History",
            "Professional Work Experience", "Career Progression"
        ]

    def is_experience_header(self, line: str) -> bool:
        return self._is_section_header(line, "experience", self.experience_headers)

    def extract_experience_from_text(self, text: str) -> List[Dict[str, Any]]:
        experience_sections = self._find_experience_sections(text)

        all_experiences = []
        for section_text in experience_sections:
            experiences = self._parse_experience_entries(section_text)
            all_experiences.extend(experiences)

        return all_experiences

    def _find_experience_sections(self, text: str) -> List[str]:
        lines = text.split('\n')
        experience_sections = []
        experience_embeddings = self._get_section_embeddings(
            "experience", self.experience_headers)

        i = 0
        while i < len(lines):
            line = lines[i].strip()
            if not line:
                i += 1
                continue

            line_embedding = self.sentence_model.encode([line])
            similarities = cosine_similarity(
                line_embedding, experience_embeddings)
            max_similarity = similarities.max()

            if max_similarity > 0.6:
                section_content = self._extract_general_section_content(
                    lines, i, [self.is_experience_header])
                if section_content:
                    experience_sections.append(section_content)
                i += len(section_content.split('\n'))
            else:
                i += 1

        return experience_sections

    def _parse_experience_entries(self, section_text: str) -> List[Dict[str, Any]]:
        if not section_text.strip():
            return []

        entries = []
        lines = [line.strip()
                 for line in section_text.split('\n') if line.strip()]

        i = 0
        while i < len(lines):
            line = lines[i]

            if any(year in line for year in ['2020', '2021', '2022', '2023', '2024', '2025']) and \
               any(keyword.lower() in line.lower() for keyword in ['developer', 'engineer', 'manager', 'analyst', 'lead', 'senior', 'junior']):

                cleaned_line = ' '.join(line.split())

                job_title = ""
                duration = ""

                parts = cleaned_line.split()
                year_indices = []
                for j, part in enumerate(parts):
                    if any(year in part for year in ['2020', '2021', '2022', '2023', '2024', '2025']):
                        year_indices.append(j)

                if year_indices:
                    split_idx = year_indices[0]

                    month_names = ['january', 'february', 'march', 'april', 'may', 'june',
                                   'july', 'august', 'september', 'october', 'november', 'december']

                    date_start_idx = split_idx
                    if split_idx > 0 and parts[split_idx - 1].lower() in month_names:
                        date_start_idx = split_idx - 1
                    job_title = ' '.join(parts[:date_start_idx]).strip()
                    duration = ' '.join(parts[date_start_idx:]).strip()

                if not job_title and not duration:
                    job_title = cleaned_line

                company = ""
                if i + 1 < len(lines):
                    next_line = lines[i + 1]
                    if any(indicator in next_line for indicator in [',', 'India', 'Remote', 'INDIA', 'Ltd', 'Inc', 'Corp']) and \
                       not any(action in next_line.lower()[:15] for action in ['developed', 'built', 'designed', 'implemented', 'created']):
                        company = next_line
                        i += 1

                description_lines = []
                i += 1
                while i < len(lines):
                    current_line = lines[i]
                    if any(year in current_line for year in ['2020', '2021', '2022', '2023', '2024', '2025']) and \
                       any(keyword.lower() in current_line.lower() for keyword in ['developer', 'engineer', 'manager', 'analyst', 'lead', 'senior', 'junior']):
                        break
                    if current_line.upper() in ['PROJECTS', 'EDUCATION', 'SKILLS']:
                        break
                    if current_line.lower().startswith('technologies:'):
                        break
                    description_lines.append(current_line)
                    i += 1

                description = ' '.join(description_lines).strip()
                if 'Technologies:' in description:
                    description = description.split('Technologies:')[0].strip()

                entry = {
                    'job_title': job_title.strip(),
                    'company': company.strip(),
                    'duration': duration.strip(),
                    'start_date': '',
                    'end_date': '',
                    'location': '',
                    'description': description,
                    'responsibilities': [],
                    'achievements': []
                }

                entries.append(entry)
                continue

            i += 1

        return entries
