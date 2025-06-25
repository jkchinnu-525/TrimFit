from fastapi import APIRouter, HTTPException, UploadFile, File
from typing import Dict, Any
import time
import logging
import tempfile
import os
from pathlib import Path

from ..models.resume_models import ParsedResume, ResumeSection, ProcessedResult, Experience, Project
from ..services.document_parser import DocumentParser
from ..config import settings

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/v1/document", tags=["document"])

processor = DocumentParser()

@router.post("/upload", response_model=ProcessedResult)
async def upload_and_process_document(file: UploadFile = File(...)):
    """Upload and process a resume document (PDF or DOCX)."""
    start_time = time.time()
    
    try:
        # Validate file type
        file_extension = Path(file.filename).suffix.lower()
        if file_extension not in settings.ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=400, 
                detail=f"Unsupported file type. Allowed: {settings.ALLOWED_EXTENSIONS}"
            )
        
        # Validate file size
        file_size = 0
        content = await file.read()
        file_size = len(content)
        
        if file_size > settings.MAX_FILE_SIZE:
            raise HTTPException(
                status_code=400,
                detail=f"File too large. Max size: {settings.MAX_FILE_SIZE} bytes"
            )
        
        # Save file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=file_extension) as tmp_file:
            tmp_file.write(content)
            tmp_file_path = tmp_file.name
        
        try:
            # Process the document
            file_type = file_extension.lstrip('.')
            parsed_data = processor.parse_document(tmp_file_path, file_type)
            
            # Structure the response
            resume_data = ParsedResume(
                sections= {},
                skills=parsed_data.get('skills', {}),
                experience=[Experience(**exp) for exp in parsed_data.get('experience', [])],
                projects=[Project(**proj) for proj in parsed_data.get('projects', [])],
                professional_summary=parsed_data.get('professional_summary', ''),
                raw_text=parsed_data.get('raw_text', ''),
                word_count=len(parsed_data.get('raw_text', '').split())
            )
            
            processing_time = time.time() - start_time
            
            return ProcessedResult(
                success=True,
                message="Document processed successfully",
                processing_time=processing_time,
                data=resume_data
            )
            
        finally:
            # Clean up temporary file
            os.unlink(tmp_file_path)
            
    except Exception as e:
        logger.error(f"Error processing document: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/health")
async def text_health():
    return {"status": "healthy"}