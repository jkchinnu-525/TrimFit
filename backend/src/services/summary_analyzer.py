from typing import List
from .base_analyzer import BaseAnalyzer
from sklearn.metrics.pairwise import cosine_similarity


class SummaryAnalyzer(BaseAnalyzer):

    def __init__(self, sentence_model):
        super().__init__(sentence_model)
        self.summary_headers = [
            "Professional Summary", "Summary", "Executive Summary", "Profile",
            "Professional Profile", "Career Summary", "Overview", "Professional Overview",
            "About Me", "Summary of Qualifications", "Career Objective", "Objective",
            "Professional Statement", "Summary Statement", "Career Profile", "Introduction",
            "Professional Introduction", "Background", "Career Overview", "Qualifications Summary",
            "Personal Statement", "About", "Bio", "Professional Bio"
        ]

    def is_professional_summary_header(self, line: str) -> bool:
        return self._is_section_header(line, "professional_summary", self.summary_headers)

    def extract_professional_summary_from_text(self, text: str) -> str:
        summary_sections = self._find_professional_summary_sections(text)

        if summary_sections:
            combined_summary = ' '.join(summary_sections)
            return self._clean_summary_text(combined_summary)

        return ""

    def _find_professional_summary_sections(self, text: str) -> List[str]:
        lines = text.split('\n')
        summary_sections = []
        summary_embeddings = self._get_section_embeddings(
            "professional_summary", self.summary_headers)

        i = 0
        while i < len(lines):
            line = lines[i].strip()
            if not line:
                i += 1
                continue

            line_embedding = self.sentence_model.encode([line])
            similarities = cosine_similarity(
                line_embedding, summary_embeddings)
            max_similarity = similarities.max()

            if max_similarity > 0.6:
                def is_any_major_section(line: str) -> bool:
                    return self.is_professional_summary_header(line)

                section_content = self._extract_general_section_content(
                    lines, i, [is_any_major_section])
                if section_content:
                    summary_sections.append(section_content)
                i += len(section_content.split('\n'))
            else:
                i += 1

        return summary_sections

    def _clean_summary_text(self, text: str) -> str:
        if not text.strip():
            return ""

        lines = text.strip().split('\n')
        cleaned_lines = []

        header_variations = [
            'professional summary', 'summary', 'profile', 'about', 'overview',
            'executive summary', 'career summary', 'professional profile',
            'about me', 'professional overview', 'background'
        ]

        for line in lines:
            line = line.strip()
            if line.lower() not in header_variations and line:
                cleaned_lines.append(line)

        return ' '.join(cleaned_lines)
