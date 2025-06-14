"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const faqData = [
  {
    id: 1,
    question: "How do you handle my data privacy?",
    answer:
      "We take data privacy seriously and follow industry-standard security practices to protect your personal information. Your data is encrypted and stored securely, and we never share it with third parties without your consent.",
  },
  {
    id: 2,
    question: "Can I revert to previous versions?",
    answer:
      "Yes, you can easily revert to previous versions of your resume. We maintain a version history that allows you to access and restore any previous iteration of your document.",
  },
  {
    id: 3,
    question: "Can I use this for academic/creative roles?",
    answer:
      "Absolutely! Our platform is designed to accommodate various types of resumes, including academic CVs and creative portfolios. You can customize templates to suit your specific field and requirements.",
  },
  {
    id: 4,
    question: "Do you support non-English resumes?",
    answer:
      "Yes, we support multiple languages and international resume formats. You can create resumes in various languages and adapt them to different regional standards and expectations.",
  },
];

export default function FAQ() {
  const [expandedItems, setExpandedItems] = useState<number[]>([]);

  const toggleItem = (id: number) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-6 pt-44">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Left Column */}
        <div className="space-y-8">
          <h2 className="text-teal-600 text-[35px] font-black  font-['Noto_Serif_JP'] tracking-tighter">
            FAQ
          </h2>

          <div className="space-y-6">
            <h1 className="text-[28px] lg:text-5xl font-semibold font-['Inter'] text-gray-900 leading-tight tracking-tight">
              Frequently Asked Questions
            </h1>

            <p className="text-gray-900 text-lg mr-6 text-wrap: balance font-regular font-['Inter'] leading-relaxed">
              For any unanswered questions, reach out to our support team.
              We&apos;ll respond as soon as possible to assist you.
            </p>
          </div>
        </div>

        {/* Right Column - FAQ Items */}
        <div className="space-y-4">
          {faqData.map((item) => (
            <div key={item.id} className="border-b border-gray-200 pb-4">
              <button
                onClick={() => toggleItem(item.id)}
                className="w-full flex items-center justify-between text-left py-4 focus:outline-none group"
              >
                <h3 className="text-lg cursor-pointer font-semibold text-gray-900 group-hover:text-teal-600 transition-colors">
                  {item.question}
                </h3>
                <div className="ml-6 flex-shrink-0">
                  <div
                    className={`w-6 h-6 flex items-center justify-center transition-transform duration-350 ease-out ${
                      expandedItems.includes(item.id) ? "rotate-45" : "rotate-0"
                    }`}
                  >
                    <svg
                      className="w-6 h-6 text-gray-600 cursor-pointer group-hover:text-teal-600 transition-colors"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </div>
                </div>
              </button>

              {expandedItems.includes(item.id) && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="pb-4 pr-8"
                >
                  <p className="text-gray-600 leading-relaxed">{item.answer}</p>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
