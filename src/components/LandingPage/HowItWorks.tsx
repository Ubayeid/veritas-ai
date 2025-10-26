'use client';

import { Search, Brain, FileText, ArrowRight, Clock, Target, CheckCircle } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Ask Your Legal Question",
      description: "Simply type your legal question in natural language. Our AI understands complex legal queries and context.",
      icon: Search,
      color: "blue",
      details: [
        "Natural language processing",
        "Context-aware understanding",
        "Multi-jurisdiction support"
      ]
    },
    {
      number: "02", 
      title: "AI Analyzes & Researches",
      description: "Our advanced AI searches through millions of legal cases, statutes, and regulations in real-time.",
      icon: Brain,
      color: "purple",
      details: [
        "2M+ legal cases analyzed",
        "Real-time database updates",
        "Cross-reference validation"
      ]
    },
    {
      number: "03",
      title: "Get Comprehensive Results",
      description: "Receive detailed legal analysis with citations, precedents, and strategic recommendations.",
      icon: FileText,
      color: "green",
      details: [
        "Detailed case summaries",
        "Proper legal citations",
        "Strategic recommendations"
      ]
    }
  ]

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "text-blue-400 bg-blue-500/20 group-hover:bg-blue-500/30 group-hover:text-blue-300",
      purple: "text-purple-400 bg-purple-500/20 group-hover:bg-purple-500/30 group-hover:text-purple-300",
      green: "text-green-400 bg-green-500/20 group-hover:bg-green-500/30 group-hover:text-green-300",
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  const benefits = [
    { icon: Clock, text: "50x Faster Research", color: "text-yellow-400" },
    { icon: Target, text: "99.7% Accuracy", color: "text-green-400" },
    { icon: CheckCircle, text: "AI Safety Certified", color: "text-blue-400" }
  ]

  return (
    <section id="how-it-works" className="py-24 bg-gray-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(147,51,234,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(34,197,94,0.1),transparent_50%)]"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in-up">
            How VeritasAI Transforms Legal Research
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto animate-fade-in-up animation-delay-200">
            Experience the future of legal research with our revolutionary 3-step process that delivers comprehensive results in minutes, not hours.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {steps.map((step, index) => (
            <div key={step.number} className="group relative">
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-gray-700 to-gray-600 z-0">
                  <ArrowRight className="absolute right-0 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-600 group-hover:text-gray-500 transition-colors duration-300" />
                </div>
              )}
              
              <div className="relative z-10 p-8 border border-gray-700 rounded-xl hover:border-gray-600 hover:shadow-2xl hover:shadow-gray-900/50 transition-all duration-300 bg-gray-800/50 backdrop-blur-sm hover:bg-gray-800/70 hover:scale-105">
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-16 h-16 rounded-xl flex items-center justify-center transition-all duration-300 ${getColorClasses(step.color)}`}>
                    <step.icon className="w-8 h-8 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="text-4xl font-bold text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                    {step.number}
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-gray-100 transition-colors duration-300">
                  {step.title}
                </h3>
                
                <p className="text-gray-400 leading-relaxed mb-4 group-hover:text-gray-300 transition-colors duration-300">
                  {step.description}
                </p>
                
                <ul className="space-y-2">
                  {step.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-center gap-2 text-sm text-gray-500 group-hover:text-gray-400 transition-colors duration-300">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Benefits */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-white mb-8">Why Legal Professionals Choose VeritasAI</h3>
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3 p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:scale-105">
                <benefit.icon className={`w-6 h-6 ${benefit.color}`} />
                <span className="text-white font-semibold">{benefit.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}