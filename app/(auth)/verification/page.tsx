"use client";

import { Navbar } from "@/src/components/layouts/Navbar";
import { Clock, CheckCircle } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";

interface DocumentStatus {
  name: string;
  status: "verified" | "pending";
}

const documentStatuses: DocumentStatus[] = [
  { name: "Personal information", status: "verified" },
  { name: "Ghana card", status: "pending" },
  { name: "Selfie verification", status: "pending" },
];

export default function VerificationPage() {
  // Mock submission data - in real app this would come from API
  const submissionDate = "Jan, 28th at 8:50pm";
  const estimatedReviewTime = "24 to 48 hours";

  return (
    <div className="min-h-screen bg-[#f8f9fc]">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12 flex justify-center">
        <div className="w-full max-w-[600px] bg-white rounded-2xl border border-gray-200 p-8 md:p-12">
          {/* Clock Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-[#fef3cd] flex items-center justify-center">
              <Clock className="w-10 h-10 text-[#f5a623]" strokeWidth={2} />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-3">
            Verification in Progress
          </h1>

          {/* Subtitle */}
          <p className="text-center text-gray-500 mb-8">
            We're reviewing your documents. This typically takes 24-48 hours.
          </p>

          {/* Submission Info Box */}
          <div className="bg-[#f8f9fc] rounded-xl p-5 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                  <Clock className="w-4 h-4" />
                  <span>Submitted</span>
                </div>
                <p className="text-gray-400 text-sm">Estimated review time</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">{submissionDate}</p>
                <p className="font-semibold text-gray-900">{estimatedReviewTime}</p>
              </div>
            </div>
          </div>

          {/* Document Status */}
          <div className="border border-gray-200 rounded-xl p-5 mb-6">
            <h2 className="font-semibold text-gray-900 mb-4">Document status</h2>
            
            <div className="space-y-4">
              {documentStatuses.map((doc, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                >
                  <span className="text-gray-700">{doc.name}</span>
                  {doc.status === "verified" ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#d4edda] text-[#28a745] text-sm font-medium">
                      <CheckCircle className="w-4 h-4" />
                      Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#fff3e0] text-[#f5a623] text-sm font-medium border border-[#f5a623]">
                      <Clock className="w-4 h-4" />
                      Pending
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Privacy Note */}
          <p className="text-sm text-gray-500 text-center mb-6 leading-relaxed">
            Your selfie is used only for identity verification and will be stored securely. We use
            industry-standard facial recognition to match your selfie with your ID photo.
          </p>

          {/* Go to Dashboard Button */}
          <Button
            asChild
            className="w-full h-14 bg-gradient-to-r from-[#2b3063] to-[#5761c9] hover:opacity-90 text-white rounded-xl text-base font-semibold"
          >
            <Link href="/dashboard">Go to dashboard</Link>
          </Button>

          {/* Email Notification Text */}
          <p className="text-center text-gray-400 text-sm mt-6">
            We'll notify you via email once verification is complete
          </p>
        </div>
      </main>
    </div>
  );
}


