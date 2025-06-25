import spacy
import logging
from docx import Document
from typing import Dict, Any

from pdfminer.high_level import extract_text
from pdfminer.layout import LAParams
from sentence_transformers import SentenceTransformer
from .skills_analyzer import VectorSkillsAnalyzer
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
            self.sentence_transformer = SentenceTransformer(
                settings.SENTENCE_TRANSFORMER_MODEL)
        except Exception as e:
            logger.error(
                f"Sentence Transformer Model not found::{settings.SENTENCE_TRANSFORMER_MODEL}")
            raise

        self.analyzer = VectorSkillsAnalyzer(self.sentence_transformer)

    def parse_document(self, file_path: str, file_type: str) -> Dict[str, Any]:
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
                line_margin=0.5,
                char_margin=0.1,
                word_margin=2.0,
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

            for paragraph in doc.paragraphs:
                text = paragraph.text.strip()
                if text:
                    text_content.append(text)

            return '\n'.join(text_content)
        except Exception as e:
            logger.error(f"Error extracting Docx Text::{str(e)}")
            return ""

    def parse_text(self, text: str) -> Dict[str, Any]:
        parsed_data = self.analyzer.parse_complete_resume(text)

        structured_sections = {}
        for section_name, content in parsed_data["sections"].items():
            structured_sections[section_name] = {
                "title": section_name.replace('_', ' ').title(),
                "content": content,
                "items": content.split('\n') if content else []
            }

        return {
            "sections": structured_sections,
            "professional_summary": parsed_data["professional_summary"],
            "experience": parsed_data["experience"],
            "skills": parsed_data["skills"],
            "projects": parsed_data["projects"],
            "raw_text": parsed_data["raw_text"],
        }
