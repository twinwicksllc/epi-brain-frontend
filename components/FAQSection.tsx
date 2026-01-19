'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "What is EPI Brain?",
    answer: "EPI Brain is an AI-powered life companion platform featuring 9 distinct AI personalities including Personal Friend, Business Mentor, Psychology Expert, Christian Companion, and more. Available 24/7 to support emotional well-being, business growth, learning, fitness, and personal development."
  },
  {
    question: "How many AI personalities does EPI Brain have?",
    answer: "EPI Brain offers 9 specialized AI personalities: Personal Friend, Sales Agent, Student/Tutor, Kids Learning, Christian Companion, Customer Service, Psychology Expert, Business Mentor, and Weight Loss Coach."
  },
  {
    question: "Is EPI Brain free to use?",
    answer: "Yes, EPI Brain offers a free tier to get started. You can experience the full power of AI companionship with 9 specialized personalities at no initial cost."
  },
  {
    question: "Can EPI Brain help with mental health?",
    answer: "While EPI Brain is not a replacement for professional therapy, it offers a Psychology Expert mode trained in CBT techniques, cognitive distortion analysis, and emotional support. For clinical mental health issues, always consult a licensed professional."
  },
  {
    question: "What makes EPI Brain different from ChatGPT?",
    answer: "EPI Brain offers 9 specialized AI personalities with semantic memory across conversations, accountability systems, goal tracking, habit formation, and personality-based interactions tailored to specific life areas like business, learning, fitness, and faith."
  },
  {
    question: "Is EPI Brain available 24/7?",
    answer: "Yes, all 9 AI personalities in EPI Brain are available 24/7, providing instant support whenever you need it."
  },
  {
    question: "Does EPI Brain remember previous conversations?",
    answer: "Yes, EPI Brain features semantic memory that allows it to remember important information across conversations while maintaining privacy and mode-specific context isolation."
  },
  {
    question: "Can I use EPI Brain for business?",
    answer: "Absolutely. EPI Brain offers a Business Mentor for strategic guidance, a Sales Agent for training, and a Customer Service mode for scenario practice. Perfect for entrepreneurs and professionals."
  },
  {
    question: "Is EPI Brain safe and private?",
    answer: "EPI Brain prioritizes user privacy with secure data handling, semantic memory controls, and safety layers for sensitive topics. Your conversations are protected and you have full control over your data."
  },
  {
    question: "How do I get started with EPI Brain?",
    answer: "Getting started is easy - simply click 'Get Started Free', create your account in seconds, and choose your preferred AI personality. No credit card required for the free tier."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="container mx-auto px-6 py-20" aria-labelledby="faq-heading">
      <h2 id="faq-heading" className="text-4xl font-bold text-white text-center mb-12">
        Frequently Asked Questions
      </h2>
      
      <div className="max-w-3xl mx-auto space-y-4">
        {faqData.map((faq, index) => (
          <details
            key={index}
            className="bg-[#2d1b4e] border border-[#7B3FF2]/20 rounded-lg overflow-hidden"
            open={openIndex === index}
            onToggle={(e) => {
              if (e.currentTarget.open) {
                toggleFAQ(index);
              }
            }}
          >
            <summary className="flex justify-between items-center cursor-pointer p-6 hover:bg-[#7B3FF2]/10 transition-colors list-none">
              <h3 className="text-lg font-semibold text-white pr-4">
                {faq.question}
              </h3>
              <span className="text-[#7B3FF2] flex-shrink-0">
                {openIndex === index ? (
                  <ChevronUp size={24} />
                ) : (
                  <ChevronDown size={24} />
                )}
              </span>
            </summary>
            <div className="p-6 pt-0">
              <p className="text-gray-300 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          </details>
        ))}
      </div>

      {/* Structured Data for FAQPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqData.map(faq => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
              }
            }))
          })
        }}
      />
    </section>
  );
}