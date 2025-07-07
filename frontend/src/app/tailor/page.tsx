"use client";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Template from "@/Effects/Transition";
import ScrollEffect from "@/Effects/Scroll";
import {
  tailorResume,
  downloadTailoredResume,
  TailoredResumeResponse,
} from "@/lib/api";

export default function TailorPage() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [processingStatus, setProcessingStatus] = useState("");
  const [results, setResults] = useState<TailoredResumeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [useTemplate, setUseTemplate] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (useTemplate) {
      loadTemplateFile();
    }
  }, [useTemplate]);

  const loadTemplateFile = async () => {
    try {
      const response = await fetch("/Template.docx");
      const blob = await response.blob();
      const templateFile = new File([blob], "Template.docx", {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
      setResumeFile(templateFile);
      setError(null);
    } catch (err) {
      setError(
        "Failed to load template resume. Please try uploading your own."
      );
      console.error("Error loading template:", err);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (
      file &&
      file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      setResumeFile(file);
      setError(null);
      setUseTemplate(false);
    } else {
      setError("Please select a valid .docx file");
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (
      file &&
      file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      setResumeFile(file);
      setError(null);
      setUseTemplate(false);
    } else {
      setError("Please select a valid .docx file");
    }
  };

  const handleTemplateToggle = (template: boolean) => {
    setUseTemplate(template);
    if (template) {
      loadTemplateFile();
    } else {
      setResumeFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSubmit = async () => {
    if (!resumeFile || !jobDescription.trim()) {
      setError("Please upload a resume and enter a job description");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setProcessingStatus("Initializing...");

    try {
      const response = await tailorResume(
        resumeFile,
        jobDescription,
        setProcessingStatus
      );
      setResults(response);
      setProcessingStatus("Complete!");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
      setProcessingStatus("");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = async () => {
    if (!results?.data.download_info.file_id) return;

    try {
      const blob = await downloadTailoredResume(
        results.data.download_info.file_id
      );

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `tailored_resume_${results.data.download_info.file_id}.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(
        "Failed to download file: " +
          (err instanceof Error ? err.message : "Unknown error")
      );
    }
  };

  const resetForm = () => {
    setResumeFile(null);
    setJobDescription("");
    setResults(null);
    setError(null);
    setProcessingStatus("");
    setUseTemplate(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <ScrollEffect>
      <Template>
        <Header />

        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-[#3F8F8D]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#4FB3B0]/10 rounded-full blur-3xl" />
        </div>

        <div className="relative min-h-screen pt-32 pb-16">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-[32px] md:text-[45px] lg:text-[55px] font-black font-Noto_Serif_JP text-black mb-4">
              Tailor Your Resume to
            </h1>
            <h1 className="text-[32px] md:text-[45px] lg:text-[55px] font-black font-Noto_Serif_JP text-[#3F8F8D] mb-6">
              Land the Job
            </h1>
            <p className="text-[16px] md:text-[18px] font-medium font-Inter text-gray-600 max-w-2xl mx-auto px-4">
              {useTemplate
                ? "Use our professional template or upload your own resume. Our AI will analyze and optimize it for maximum impact."
                : "Upload your resume and paste the job description. Our AI will analyze and optimize your resume for maximum impact."}
            </p>
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-6xl mx-auto px-4 mb-6"
            >
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {error}
                </div>
              </div>
            </motion.div>
          )}

          {results && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-6xl mx-auto px-4 mb-12"
            >
              <div className="backdrop-blur-sm bg-white/90 rounded-[32px] p-8 shadow-[0px_4px_24px_rgba(63,143,141,0.15)] border border-[#3F8F8D]/10">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-[28px] md:text-[32px] font-bold font-Noto_Serif_JP text-[#1A1A1A]">
                    Your Tailored Resume
                  </h2>
                  <div className="flex gap-4">
                    <button
                      onClick={handleDownload}
                      className="flex cursor-pointer items-center gap-2 px-6 py-3 bg-[#3F8F8D] hover:bg-[#2D7A78] transition-colors rounded-full text-white font-medium shadow-sm hover:shadow-md"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                      Download Resume
                    </button>
                    <button
                      onClick={resetForm}
                      className="flex cursor-pointer items-center gap-2 px-6 py-3 bg-[#F3F4F6] hover:bg-[#E5E7EB] transition-colors rounded-full text-gray-700 font-medium"
                    >
                      Start Over
                    </button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-[#F8FAFA] rounded-2xl p-6 border border-[#3F8F8D]/10"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-full bg-[#3F8F8D]/10 flex items-center justify-center">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#3F8F8D"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect
                            x="2"
                            y="7"
                            width="20"
                            height="14"
                            rx="2"
                            ry="2"
                          />
                          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-[#1A1A1A]">
                        Work Experience
                      </h3>
                      <span className="text-sm font-medium text-[#3F8F8D] bg-[#3F8F8D]/10 px-3 py-1 rounded-full">
                        Suggestions
                      </span>
                    </div>
                    <div className="prose prose-sm max-w-none text-gray-600">
                      {
                        results.data.text_suggestions?.experience
                          ?.suggested_improvements
                      }
                    </div>
                    <div className="mt-6 space-y-2">
                      <h4 className="font-medium text-[#1A1A1A]">
                        Key Recommendations:
                      </h4>
                      <ul className="space-y-2">
                        {results.data.text_suggestions?.experience?.recommended_changes.map(
                          (rec: string, index: number) => (
                            <li
                              key={index}
                              className="flex items-start gap-2 text-sm text-gray-600"
                            >
                              <svg
                                className="w-5 h-5 text-[#3F8F8D] mt-0.5 flex-shrink-0"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              {rec}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-[#F8FAFA] rounded-2xl p-6 border border-[#3F8F8D]/10"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-full bg-[#3F8F8D]/10 flex items-center justify-center">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#3F8F8D"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polygon points="12 2 2 7 12 12 22 7 12 2" />
                          <polyline points="2 17 12 22 22 17" />
                          <polyline points="2 12 12 17 22 12" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-[#1A1A1A]">
                        Projects
                      </h3>
                      <span className="text-sm font-medium text-[#3F8F8D] bg-[#3F8F8D]/10 px-3 py-1 rounded-full">
                        Suggestions
                      </span>
                    </div>
                    <div className="prose prose-sm max-w-none text-gray-600">
                      {
                        results.data.text_suggestions?.projects
                          ?.suggested_improvements
                      }
                    </div>
                    <div className="mt-6 space-y-2">
                      <h4 className="font-medium text-[#1A1A1A]">
                        Key Recommendations:
                      </h4>
                      <ul className="space-y-2">
                        {results.data.text_suggestions?.projects?.recommended_changes.map(
                          (rec: string, index: number) => (
                            <li
                              key={index}
                              className="flex items-start gap-2 text-sm text-gray-600"
                            >
                              <svg
                                className="w-5 h-5 text-[#3F8F8D] mt-0.5 flex-shrink-0"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              {rec}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </motion.div>
                </div>

                <div className="mt-8 p-4 bg-[#3F8F8D]/10 rounded-xl border border-[#F0B429]/20">
                  <div className="flex items-start gap-3">
                    <svg
                      className="w-6 h-6 text-[#3F8F8D] mt-0.5"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 2a1 1 0 0 1 .894.553l2.991 5.657 6.182 1.127a1 1 0 0 1 .55 1.687l-4.435 4.463.977 6.537a1 1 0 0 1-1.471 1.057L12 19.82l-5.688 2.262a1 1 0 0 1-1.471-1.057l.977-6.537-4.435-4.463a1 1 0 0 1 .55-1.687l6.182-1.127 2.991-5.657A1 1 0 0 1 12 2z"
                      />
                    </svg>
                    <p className="text-sm text-[#3F8F8D] font-Inter">
                      <span className="font-medium">Note:</span> The downloaded
                      resume includes the updated Professional Summary and
                      Skills. The Work Experience and Projects suggestions above
                      are for your reference - you can manually incorporate them
                      into future versions.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <div className="max-w-6xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -300 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.2, delay: 0.2 }}
                className="relative"
              >
                <div className="backdrop-blur-sm bg-white/70 rounded-[32px] p-8 shadow-[0px_0px_30px_0px_rgba(63,143,141,0.15)] border border-white/30">
                  <h2 className="text-[24px] md:text-[28px] font-Noto_Serif_JP font-semibold mb-6">
                    {results ? "Try Another Resume" : "Choose Your Resume"}
                  </h2>

                  <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
                    <button
                      onClick={() => handleTemplateToggle(true)}
                      className={`flex-1 py-3 px-4 cursor-pointer rounded-lg font-medium transition-all duration-200 ${
                        useTemplate
                          ? "bg-[#3F8F8D] text-white shadow-sm"
                          : "text-gray-600 hover:text-gray-800"
                      }`}
                    >
                      📄 Use Template
                    </button>
                    <button
                      onClick={() => handleTemplateToggle(false)}
                      className={`flex-1 py-3 px-4 cursor-pointer rounded-lg font-medium transition-all duration-200 ${
                        !useTemplate
                          ? "bg-[#3F8F8D] text-white shadow-sm"
                          : "text-gray-600 hover:text-gray-800"
                      }`}
                    >
                      📂 Upload Your Own
                    </button>
                  </div>

                  {useTemplate ? (
                    <div className="text-center p-8 bg-[#F8FAFA] rounded-2xl border border-[#3F8F8D]/10">
                      <div className="w-16 h-16 mx-auto bg-[#3F8F8D] rounded-full flex items-center justify-center mb-4">
                        <svg
                          className="w-8 h-8 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">
                        Professional Template Ready
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">
                        We&apos;ve loaded our professional resume template for
                        you. This template includes standard sections and
                        formatting that work well with most job applications.
                      </p>
                      <div className="flex items-center justify-center gap-2 text-sm text-[#3F8F8D] bg-[#3F8F8D]/10 px-4 py-2 rounded-full">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Template loaded successfully
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`relative cursor-pointer border-2 border-dashed rounded-[24px] p-8 transition-all duration-300 ${
                        dragActive
                          ? "border-[#3F8F8D] bg-[#3F8F8D]/5"
                          : resumeFile && resumeFile.name !== "Template.docx"
                          ? "border-[#4FB3B0] bg-[#4FB3B0]/5"
                          : "border-gray-300 hover:border-[#3F8F8D] hover:bg-[#3F8F8D]/5"
                      }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".docx"
                        onChange={handleFileSelect}
                        className="hidden"
                      />

                      <div className="text-center">
                        {resumeFile && resumeFile.name !== "Template.docx" ? (
                          <div className="space-y-4">
                            <div className="w-16 h-16 mx-auto bg-[#4FB3B0] rounded-full flex items-center justify-center">
                              <svg
                                className="w-8 h-8 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                            </div>
                            <div>
                              <p className="font-medium text-black">
                                {resumeFile.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                            <button
                              onClick={() => fileInputRef.current?.click()}
                              className="text-[#3F8F8D] hover:text-[#2a6b6a] font-medium"
                            >
                              Choose different file
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                              <svg
                                className="w-8 h-8 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                />
                              </svg>
                            </div>
                            <div>
                              <p className="text-lg font-medium text-black mb-2">
                                Drop your resume here
                              </p>
                              <p className="text-gray-500 mb-4">or</p>
                              <button
                                onClick={() => fileInputRef.current?.click()}
                                className="bg-[#3F8F8D] cursor-pointer hover:bg-[#2a6b6a] text-white px-6 py-3 rounded-xl font-medium transition-colors duration-200"
                              >
                                Browse Files
                              </button>
                              <p className="text-sm text-gray-400 mt-3">
                                Only .docx files are supported
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.2, delay: 0.2 }}
                className="relative"
              >
                <div className="backdrop-blur-sm bg-white/70 rounded-[32px] p-8 shadow-[0px_0px_30px_0px_rgba(63,143,141,0.15)] border border-white/30 h-full flex flex-col">
                  <h2 className="text-[24px] md:text-[28px] font-bold font-Noto_Serif_JP text-black mb-6">
                    Job Description
                  </h2>

                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the job description here..."
                    className="w-full flex-grow p-4 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[#3F8F8D] focus:border-transparent font-Inter text-sm leading-relaxed scrollbar-hide"
                  />
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-center mt-12"
            >
              <button
                onClick={handleSubmit}
                disabled={!resumeFile || !jobDescription.trim() || isProcessing}
                className={`
                px-12 py-4 rounded-xl font-bold text-lg transition-all duration-300 cursor-pointer
                ${
                  !resumeFile || !jobDescription.trim() || isProcessing
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-[#3F8F8D] to-[#4FB3B0] text-white hover:from-[#2a6b6a] hover:to-[#3a9d9a] shadow-[0px_0px_20px_0px_rgba(63,143,141,0.3)] hover:shadow-[0px_0px_30px_0px_rgba(63,143,141,0.4)] transform hover:scale-[1.02]"
                }
              `}
              >
                {isProcessing ? (
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{processingStatus || "Processing..."}</span>
                  </div>
                ) : results ? (
                  "Tailor Another Resume"
                ) : (
                  "Tailor My Resume"
                )}
              </button>

              {(!resumeFile || !jobDescription.trim()) && !isProcessing && (
                <p className="text-sm text-gray-500 mt-3">
                  Please{" "}
                  {useTemplate
                    ? "ensure the template is loaded"
                    : "upload a resume"}{" "}
                  and enter a job description to continue
                </p>
              )}
            </motion.div>

            {!results && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="mt-20 grid md:grid-cols-3 gap-6"
              >
                {[
                  {
                    icon: "🎯",
                    title: "Smart Matching",
                    description:
                      "AI analyzes job requirements and optimizes your resume accordingly",
                  },
                  {
                    icon: "⚡",
                    title: "Instant Results",
                    description:
                      "Get your new tailored resume within seconds, not hours",
                  },
                  {
                    icon: "🔒",
                    title: "Privacy First",
                    description:
                      "Your documents are processed securely and never stored permanently",
                  },
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
                    className="text-center p-6"
                  >
                    <div className="text-4xl mb-4">{feature.icon}</div>
                    <h3 className="font-bold text-black mb-8 font-Noto_Serif_JP">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 font-Inter">
                      {feature.description}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>

        <Footer />
      </Template>
    </ScrollEffect>
  );
}
