from fastapi import APIRouter, File, UploadFile, Form, HTTPException
import os, time, logging, tempfile
from typing import Dict, Any, List
from fastapi.responses import FileResponse
from pathlib import Path
from ..services.document_parser import DocumentParser
from ..services.ai_content_extractor import ai_extractor
from ..services.ai_resume_tailor import resume_tailor as ai_resume_tailor_service
from ..config import settings
from ..services.doc_generator import document_generator
import shutil

logger = logging.getLogger(__name__)
router = APIRouter(
    prefix=f"{settings.API_V1_STR}/tailor", tags=["Resume Tailoring"])

document_parser = DocumentParser()


@router.post("/quick-tailor")
async def quick_tailor_existing_resume(
    resume_data: Dict[str, Any],
    job_description: str
):
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


@router.post("/tailor-resume-json-and-docx")
async def tailor_resume_with_both_outputs(
    job_description: str = Form(...),
    resume_file: UploadFile = File(...),
):
    temp_files = []

    try:
        file_extension = Path(resume_file.filename).suffix.lower()
        if file_extension not in ['.docx']:
            raise HTTPException(
                status_code=400,
                detail="Only DOCX files are supported for formatted output"
            )

        content = await resume_file.read()
        with tempfile.NamedTemporaryFile(delete=False, suffix=file_extension) as tmp_file:
            tmp_file.write(content)
            original_file_path = tmp_file.name
            temp_files.append(original_file_path)

        parsed_data = document_parser.parse_document(
            original_file_path, 'docx')
        extracted_resume_data = ai_extractor.extract_resume_sections(
            parsed_data['raw_text'])
        tailored_result = await ai_resume_tailor_service.tailor_complete_resume(
            extracted_resume_data,
            job_description,
        )

        tailored_sections = tailored_result["tailored_resume"]
        logger.info(
            f"Tailored sections received: {list(tailored_sections.keys())}")

        sections_safe_to_modify = {
            'professional_summary', 'skills', 'personal_info'}

        safe_tailored_data = {}
        excluded_sections = []

        for k, v in tailored_sections.items():
            if k in sections_safe_to_modify:
                safe_tailored_data[k] = v
                logger.info(f"✓ Including safe section: {k}")
            else:
                excluded_sections.append(k)
                logger.info(
                    f"✗ EXCLUDING preserved section: {k} (will be preserved from original)")

        logger.info(
            f"Final safe tailored data keys: {list(safe_tailored_data.keys())}")
        logger.info(
            f"Excluded sections (preserved from original): {excluded_sections}")

        output_file_path = document_generator.generate_tailored_resume(
            original_file_path,
            extracted_resume_data,
            safe_tailored_data
        )

        file_id = f"{int(time.time())}_{hash(resume_file.filename)}"
        stored_path = Path(settings.UPLOAD_DIR) / f"tailored_{file_id}.docx"
        shutil.copy2(output_file_path, stored_path)

        os.unlink(output_file_path)


        return {
            "success": True,
            "message": "Resume processed and tailored successfully",
            "data": {
                "text_suggestions": tailored_result.get("text_suggestions", {}),
                "download_info": {
                    "file_id": file_id,
                    "download_url": f"{settings.API_V1_STR}/tailor/download/{file_id}",
                }
            }
        }

    except Exception as e:
        logger.error(f"Resume tailoring failed: {str(e)}")
        for temp_file in temp_files:
            if os.path.exists(temp_file):
                try:
                    os.unlink(temp_file)
                except:
                    pass
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        if os.path.exists(original_file_path):
            try:
                os.unlink(original_file_path)
            except:
                pass


@router.get("/download/{file_id}")
async def download_tailored_resume(file_id: str):

    file_path = Path(settings.UPLOAD_DIR) / f"tailored_{file_id}.docx"

    if not file_path.exists():
        raise HTTPException(
            status_code=404, detail="File not found or expired")

    return FileResponse(
        path=str(file_path),
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        filename=f"tailored_resume_{file_id}.docx"
    )
