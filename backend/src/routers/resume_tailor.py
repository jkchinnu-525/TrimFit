from fastapi import APIRouter, File, UploadFile, Form, HTTPException
import os, time, logging, tempfile
from typing import Dict, Any
from pathlib import Path
from ..services.document_parser import DocumentParser
from ..services.ai_content_extractor import ai_extractor
from ..services.ai_resume_tailor import resume_tailor as ai_resume_tailor_service
from ..config import settings

logger = logging.getLogger(__name__)
router = APIRouter(
    prefix=f"{settings.API_V1_STR}/tailor", tags=["Resume Tailoring"])

document_parser = DocumentParser()

@router.post("/tailor-resume")
async def tailor_resume(
    job_description: str = Form(...),
    resume_file: UploadFile = File(...)
):
    start_time = time.time()
    processing_steps = []

    try:
        file_extension = Path(resume_file.filename).suffix.lower()
        if file_extension not in settings.ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported file type. Allowed: {settings.ALLOWED_EXTENSIONS}"
            )

        content = await resume_file.read()
        processing_steps.append("File uploaded and validated")

        with tempfile.NamedTemporaryFile(delete=False, suffix=file_extension) as tmp_file:
            tmp_file.write(content)
            tmp_file_path = tmp_file.name

        try:
            file_type = file_extension.lstrip('.')
            parsed_data = document_parser.parse_document(
                tmp_file_path, file_type)
            processing_steps.append("Raw text extracted from document")

            logger.info("Starting AI extraction of resume sections...")
            extracted_resume_data = ai_extractor.extract_resume_sections(
                parsed_data['raw_text']
            )
            processing_steps.append("Resume sections extracted using AI")

            logger.info(
                f"Extracted sections: {list(extracted_resume_data.keys())}")

            logger.info("Starting AI tailoring process...")
            tailored_result = await ai_resume_tailor_service.tailor_complete_resume(
                extracted_resume_data,
                job_description
            )
            processing_steps.append("Resume tailored using AI")

            processing_time = time.time() - start_time

            return {
                "success": True,
                "message": "Resume processed and tailored successfully",
                "processing_time": processing_time,
                "processing_steps": processing_steps,
                "data": {
                    "extracted_resume": {
                        "personal_info": extracted_resume_data.get("personal_info", {}),
                        "professional_summary": extracted_resume_data.get("professional_summary", ""),
                        "experience": extracted_resume_data.get("experience", []),
                        "education": extracted_resume_data.get("education", []),
                        "skills": extracted_resume_data.get("skills", {}),
                        "projects": extracted_resume_data.get("projects", []),
                        "certifications": extracted_resume_data.get("certifications", []),
                        "achievements": extracted_resume_data.get("achievements", [])
                    },
                    "tailored_resume": tailored_result["tailored_resume"],
                    "job_analysis": tailored_result["job_analysis"],
                    "changes_made": tailored_result["changes_made"],
                    "match_score": tailored_result["match_score"],
                    "score_improvement": tailored_result.get("score_improvement", 0),
                    "suggestions": tailored_result["suggestions"],
                    "file_info": {
                        "filename": resume_file.filename,
                        "file_type": file_type,
                        "file_size": len(content)
                    }
                }
            }

        finally:
            if os.path.exists(tmp_file_path):
                os.unlink(tmp_file_path)

    except Exception as e:
        logger.error(f"Resume tailoring pipeline failed: {str(e)}")
        processing_time = time.time() - start_time

        return {
            "success": False,
            "message": f"Error in resume tailoring pipeline: {str(e)}",
            "processing_time": processing_time,
            "processing_steps": processing_steps,
            "error_details": str(e),
            "data": None
        }

@router.post("/quick-tailor")
async def quick_tailor_existing_resume(
    resume_data: Dict[str, Any],
    job_description: str
):
    """Tailor an already parsed resume (for faster iterations)."""
    try:
        tailored_result = await ai_resume_tailor_service.tailor_complete_resume(
            resume_data,
            job_description
        )

        return {
            "success": True,
            "data": tailored_result
        }

    except Exception as e:
        logger.error(f"Quick tailoring failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/health")
async def tailor_health():
    return {
        "status": "healthy",
        "service": "Resume Tailoring",
        "endpoints": [
            "/analyze-job",
            "/tailor-resume",
            "/quick-tailor"
        ]
    }
