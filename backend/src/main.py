from fastapi import FastAPI
from .config import settings
from fastapi.middleware.cors import CORSMiddleware
from .routers import document_upload
from .routers import resume_tailor

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    version="0.1.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(document_upload.router)
app.include_router(resume_tailor.router)

@app.get('/')
async def root():
    return {
        "message": "Welcome to TrimFit Resume Tailor API",
        "version": "0.1.0",
        "endpoints": [
            "/api/v1/document/upload",
            "/api/v1/document/health"
        ]
    }


@app.get("/health")
async def health():
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host='0.0.0.0', port=8000)
