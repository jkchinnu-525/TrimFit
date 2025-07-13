import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface TailoredResumeResponse {
  success: boolean;
  message: string;
  processing_time: number;
  data: {
    text_suggestions: {
      experience?: {
        suggested_improvements: string;
        recommended_changes: string[];
      };
      projects?: {
        suggested_improvements: string;
        recommended_changes: string[];
      };
    };
    download_info: {
      file_id: string;
      download_url: string;
      expires_in_seconds: number;
    };
  };
}

export async function tailorResume(
  resumeFile: File,
  jobDescription: string,
  onProgress?: (status: string) => void
): Promise<TailoredResumeResponse> {
  onProgress?.("Uploading resume...");

  const formData = new FormData();
  formData.append("resume_file", resumeFile);
  formData.append("job_description", jobDescription);

  onProgress?.("Processing with AI...(max - 20secs)");

  const response = await axios.post(
    `${API_BASE_URL}/api/v1/tailor/tailor-resume-json-and-docx`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  if (response.status !== 200) {
    throw new Error(
      response.data.detail || response.data.message || "An error occurred"
    );
  }

  onProgress?.("Finalizing results...");
  return response.data;
}

export async function downloadTailoredResume(fileId: string): Promise<Blob> {
  const response = await axios.get(
    `${API_BASE_URL}/api/v1/tailor/download/${fileId}`,
    {
      responseType: "blob",
      headers: {
        Accept:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      },
    }
  );

  if (response.status !== 200) {
    throw new Error("Failed to download file");
  }

  return response.data;
}

export function getDownloadUrl(fileId: string): string {
  return `${API_BASE_URL}/api/v1/tailor/download/${fileId}`;
}
