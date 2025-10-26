'use client';

import { useState } from 'react';
import { Plus, Minus, HelpCircle } from 'lucide-react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "How does VeritasAI ensure accuracy in legal research?",
      answer: "VeritasAI uses advanced AI trained on millions of legal cases and employs multiple validation layers including bias detection, cross-reference verification, and real-time fact-checking. Our AI safety protocols ensure 99.7% accuracy in legal analysis."
    },
    {
      question: "Is my legal data secure and confidential?",
      answer: "Absolutely. VeritasAI employs enterprise-grade security with end-to-end encryption, SOC 2 compliance, and strict data privacy protocols. Your legal queries and data are never shared with third parties and are protected by attorney-client privilege standards."
    },
    {
      question: "Can VeritasAI replace traditional legal research methods?",
      answer: "VeritasAI enhances and accelerates traditional legal research rather than replacing it entirely. It provides comprehensive case law analysis, identifies relevant precedents, and generates insights that complement human legal expertise, making research 50x faster while maintaining the highest accuracy standards."
    },
    {
      question: "What types of legal cases can VeritasAI analyze?",
      answer: "VeritasAI can analyze virtually any legal matter including civil litigation, criminal law, corporate law, intellectual property, employment law, family law, and more. Our AI is trained on comprehensive legal databases covering federal, state, and international law."
    },
    {
      question: "How does the pricing work for law firms?",
      answer: "We offer flexible pricing plans starting with a free tier for individual lawyers, professional plans at $29/month for growing firms, and custom enterprise solutions for large law firms. All plans include our core AI safety features and bias detection capabilities."
    },
    {
      question: "Does VeritasAI provide legal advice?",
      answer: "VeritasAI provides legal research and analysis tools but does not provide legal advice. It's designed to assist legal professionals in their research and analysis processes. Users should always consult with qualified attorneys for legal advice specific to their situations."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-gray-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(147,51,234,0.1),transparent_50%)]"></div>
      </div>
      
      <div className="max-w-4xl mx-auto px-6 relative">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 rounded-full mb-4">
            <HelpCircle className="w-5 h-5 text-blue-400" />
            <span className="text-blue-400 font-semibold">FAQs</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in-up">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto animate-fade-in-up animation-delay-200">
            Get answers to common questions about VeritasAI's legal research capabilities, security, and pricing.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="group">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full p-6 text-left bg-gray-800/50 border border-gray-700 rounded-xl hover:border-gray-600 hover:bg-gray-800/70 transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white group-hover:text-gray-100 transition-colors duration-300 pr-4">
                    {faq.question}
                  </h3>
                  <div className="flex-shrink-0">
                    {openIndex === index ? (
                      <Minus className="w-6 h-6 text-blue-400 group-hover:text-blue-300 transition-colors duration-300" />
                    ) : (
                      <Plus className="w-6 h-6 text-gray-400 group-hover:text-gray-300 transition-colors duration-300" />
                    )}
                  </div>
                </div>
              </button>
              
              {openIndex === index && (
                <div className="mt-2 p-6 bg-gray-800/30 border border-gray-700 rounded-xl animate-fade-in">
                  <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex flex-col items-center gap-4 p-8 bg-gradient-to-r from-gray-800 to-gray-700 rounded-2xl border border-gray-600 hover:border-gray-500 transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <h3 className="text-2xl font-bold text-white">Still have questions?</h3>
            <p className="text-gray-300 max-w-2xl">
              Our legal AI experts are here to help you understand how VeritasAI can transform your practice.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25">
                Contact Support
              </button>
              <button className="px-8 py-3 border border-gray-600 text-gray-300 rounded-full font-semibold hover:border-gray-500 hover:bg-gray-700 transition-all duration-300 hover:scale-105">
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}