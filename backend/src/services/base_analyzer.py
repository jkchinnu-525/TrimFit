from typing import List
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity


class BaseAnalyzer:

    def __init__(self, sentence_model: SentenceTransformer):
        self.sentence_model = sentence_model
        self.embeddings_cache = {}

    def _get_section_embeddings(self, section_type: str, headers: List[str]):
        if section_type not in self.embeddings_cache:
            self.embeddings_cache[section_type] = self.sentence_model.encode(
                headers)
        return self.embeddings_cache[section_type]

    def _is_section_header(self, line: str, section_type: str, headers: List[str], threshold: float = 0.6) -> bool:
        if not line or len(line.split()) > 4 or len(line) > 30:
            return False

        line_embedding = self.sentence_model.encode([line])
        section_embeddings = self._get_section_embeddings(
            section_type, headers)
        similarities = cosine_similarity(line_embedding, section_embeddings)

        return similarities.max() > threshold

    def _extract_general_section_content(self, lines: List[str], start_idx: int,
                                         section_checkers: List[callable]) -> str:
        content_lines = []
        i = start_idx + 1

        major_section_headers = [
            'SKILLS', 'WORK EXPERIENCE', 'EXPERIENCE', 'PROJECTS', 'EDUCATION',
            'PROFESSIONAL SUMMARY', 'SUMMARY', 'CERTIFICATIONS', 'AWARDS'
        ]

        while i < len(lines):
            line = lines[i].strip()

            if any(checker(line) for checker in section_checkers):
                break

            if line.upper() in major_section_headers:
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
