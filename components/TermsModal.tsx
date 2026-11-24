import React from "react";
import { X } from "lucide-react";

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TermsModal({ isOpen, onClose }: TermsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div
        className="bg-white rounded-3xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-2xl font-bold text-slate-900">
            Terms of Service
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <div className="prose prose-slate max-w-none">
            <p className="font-semibold mb-4">Last Updated: May 2026</p>

            <h3 className="text-lg font-bold mt-6 mb-3 text-slate-800">
              1. Acceptance of Terms
            </h3>
            <p className="text-slate-600 mb-4">
              By accessing and using SalesForce.ai, you agree to be bound by
              these Terms of Service. If you do not agree to these terms, please
              do not use our platform.
            </p>

            <h3 className="text-lg font-bold mt-6 mb-3 text-slate-800">
              2. Description of Service
            </h3>
            <p className="text-slate-600 mb-4">
              SalesForce.ai provides AI-powered sales training, roleplay
              simulations, and analytics. We reserve the right to modify,
              suspend, or discontinue any aspect of the service at any time
              without notice.
            </p>

            <h3 className="text-lg font-bold mt-6 mb-3 text-slate-800">
              3. User Conduct
            </h3>
            <p className="text-slate-600 mb-4">
              You agree to use the platform only for lawful purposes. You are
              strictly prohibited from using the service to generate
              unauthorized content, harass others, or reverse-engineer our AI
              models.
            </p>

            <h3 className="text-lg font-bold mt-6 mb-3 text-slate-800">
              4. Privacy & Data Usage
            </h3>
            <p className="text-slate-600 mb-4">
              Your use of SalesForce.ai is also governed by our Privacy Policy.
              By participating in AI roleplays, you consent to the analysis of
              your interactions for training and improvement purposes.
            </p>

            <h3 className="text-lg font-bold mt-6 mb-3 text-slate-800">
              5. Limitation of Liability
            </h3>
            <p className="text-slate-600 mb-4">
              SalesForce.ai is provided "as is" without any warranties. We shall
              not be liable for any direct, indirect, incidental, or
              consequential damages resulting from your use of the service.
            </p>
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
}
