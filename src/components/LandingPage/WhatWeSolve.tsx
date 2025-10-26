'use client';

import { Clock, DollarSign, AlertTriangle, Users, FileX, Search } from 'lucide-react';

export default function WhatWeSolve() {
  const problems = [
    {
      icon: Clock,
      title: "Hours of Manual Research",
      description: "Legal professionals spend 40+ hours per week on research that could be automated",
      stat: "40+ hours/week",
      color: "red"
    },
    {
      icon: DollarSign,
      title: "Expensive Legal Databases",
      description: "Traditional legal research tools cost $500+ per month per user",
      stat: "$500+/month",
      color: "orange"
    },
    {
      icon: AlertTriangle,
      title: "Missed Precedents",
      description: "Critical case law and precedents are often overlooked in manual research",
      stat: "23% missed",
      color: "yellow"
    },
    {
      icon: Users,
      title: "Client Billing Pressure",
      description: "Clients demand faster, more cost-effective legal services",
      stat: "60% faster",
      color: "blue"
    },
    {
      icon: FileX,
      title: "Inconsistent Analysis",
      description: "Human analysis varies in quality and thoroughness across cases",
      stat: "85% accuracy",
      color: "purple"
    },
    {
      icon: Search,
      title: "Outdated Information",
      description: "Legal databases are often not updated with the latest case law",
      stat: "Real-time",
      color: "green"
    }
  ]

  const getColorClasses = (color: string) => {
    const colors = {
      red: "text-red-400 bg-red-500/20 group-hover:bg-red-500/30 group-hover:text-red-300",
      orange: "text-orange-400 bg-orange-500/20 group-hover:bg-orange-500/30 group-hover:text-orange-300",
      yellow: "text-yellow-400 bg-yellow-500/20 group-hover:bg-yellow-500/30 group-hover:text-yellow-300",
      blue: "text-blue-400 bg-blue-500/20 group-hover:bg-blue-500/30 group-hover:text-blue-300",
      purple: "text-purple-400 bg-purple-500/20 group-hover:bg-purple-500/30 group-hover:text-purple-300",
      green: "text-green-400 bg-green-500/20 group-hover:bg-green-500/30 group-hover:text-green-300",
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  return (
    <section id="problems" className="py-24 bg-gray-800 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(239,68,68,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(59,130,246,0.1),transparent_50%)]"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in-up">
            The Legal Research Crisis We Solve
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto animate-fade-in-up animation-delay-200">
            Legal professionals face unprecedented challenges in today's fast-paced world. 
            VeritasAI addresses these critical pain points with revolutionary AI technology.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {problems.map((problem, index) => (
            <div key={problem.title} className="group p-8 border border-gray-700 rounded-xl hover:border-gray-600 hover:shadow-2xl hover:shadow-gray-900/50 transition-all duration-300 bg-gray-800/50 backdrop-blur-sm hover:bg-gray-800/70 hover:scale-105">
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 transition-all duration-300 ${getColorClasses(problem.color)}`}>
                <problem.icon className="w-8 h-8 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="text-xl font-semibold mb-3 text-white group-hover:text-gray-100 transition-colors duration-300">
                {problem.title}
              </div>
              <div className="text-gray-400 leading-relaxed mb-4 group-hover:text-gray-300 transition-colors duration-300">
                {problem.description}
              </div>
              <div className="text-2xl font-bold text-white group-hover:text-gray-100 transition-colors duration-300">
                {problem.stat}
              </div>
            </div>
          ))}
        </div>

        {/* Solution CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex flex-col items-center gap-4 p-8 bg-gradient-to-r from-gray-800 to-gray-700 rounded-2xl border border-gray-600 hover:border-gray-500 transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <h3 className="text-2xl font-bold text-white">Ready to Transform Your Legal Practice?</h3>
            <p className="text-gray-300 max-w-2xl">
              Join thousands of legal professionals who have revolutionized their research process with VeritasAI
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25">
                Start Free Trial
              </button>
              <button className="px-8 py-3 border border-gray-600 text-gray-300 rounded-full font-semibold hover:border-gray-500 hover:bg-gray-700 transition-all duration-300 hover:scale-105">
                View Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}