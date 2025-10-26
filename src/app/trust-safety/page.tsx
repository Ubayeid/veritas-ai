'use client';

import { Shield, Eye, Lock, AlertTriangle, CheckCircle, Brain, Database, Zap, Target, Users, Clock } from 'lucide-react';
import Link from 'next/link';

export default function TrustSafetyPage() {
  const safetyFeatures = [
    {
      icon: Shield,
      title: "AIID Safety Validation",
      description: "Our AI learns from 1,200+ real AI safety incidents to prevent hallucinations, bias, and security issues.",
      color: "blue",
      stats: "1,200+ incidents analyzed"
    },
    {
      icon: Eye,
      title: "Bias Detection & Mitigation",
      description: "Advanced algorithms detect and prevent bias in legal analysis, ensuring fair and balanced recommendations.",
      color: "purple",
      stats: "99.7% accuracy rate"
    },
    {
      icon: Lock,
      title: "Privacy Protection",
      description: "Enterprise-grade security with end-to-end encryption and strict data privacy protocols.",
      color: "green",
      stats: "SOC 2 compliant"
    },
    {
      icon: AlertTriangle,
      title: "Misinformation Prevention",
      description: "Real-time fact-checking and citation validation prevent false or misleading legal information.",
      color: "red",
      stats: "Real-time validation"
    },
    {
      icon: Brain,
      title: "Transparent AI Reasoning",
      description: "Every AI decision is explainable with clear reasoning chains and capability transparency.",
      color: "indigo",
      stats: "100% transparent"
    },
    {
      icon: Database,
      title: "Secure Data Handling",
      description: "All legal data is processed securely with attorney-client privilege standards maintained.",
      color: "yellow",
      stats: "Zero data breaches"
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "text-blue-400 bg-blue-500/20 group-hover:bg-blue-500/30 group-hover:text-blue-300",
      purple: "text-purple-400 bg-purple-500/20 group-hover:bg-purple-500/30 group-hover:text-purple-300",
      green: "text-green-400 bg-green-500/20 group-hover:bg-green-500/30 group-hover:text-green-300",
      red: "text-red-400 bg-red-500/20 group-hover:bg-red-500/30 group-hover:text-red-300",
      indigo: "text-indigo-400 bg-indigo-500/20 group-hover:bg-indigo-500/30 group-hover:text-indigo-300",
      yellow: "text-yellow-400 bg-yellow-500/20 group-hover:bg-yellow-500/30 group-hover:text-yellow-300",
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  const stats = [
    { icon: Shield, value: "1,200+", label: "AI Safety Incidents Analyzed" },
    { icon: Target, value: "99.7%", label: "Bias Detection Accuracy" },
    { icon: Users, value: "10K+", label: "Legal Professionals Protected" },
    { icon: Clock, value: "24/7", label: "Safety Monitoring" }
  ];

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.1),transparent_50%)]"></div>
      </div>

      {/* Navigation */}
      <nav className="relative bg-gray-800/50 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center group">
                <div className="flex-shrink-0">
                  <h1 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">VeritasAI</h1>
                </div>
              </Link>
            </div>
            
            <div className="flex items-center space-x-1">
              <Link 
                href="/dashboard" 
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-all duration-200"
              >
                Legal Research
              </Link>
              <Link 
                href="/dashboard/unique" 
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-all duration-200"
              >
                Unique Features
              </Link>
              <Link 
                href="/trust-safety" 
                className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white shadow-lg transition-all duration-200"
              >
                Trust & Safety
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 rounded-full mb-6">
            <Shield className="w-5 h-5 text-blue-400" />
            <span className="text-blue-400 font-semibold">Trust & Safety</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in-up">
            AI Safety at the
            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent animate-gradient-x">
              Core of Legal AI
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto animate-fade-in-up animation-delay-200">
            VeritasAI is built with AI safety, bias detection, and transparency at its core. 
            Learn how we protect against bias, privacy breaches, misinformation, and security issues.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="group text-center p-6 bg-gray-800/50 rounded-xl backdrop-blur-sm border border-gray-700 hover:border-gray-600 hover:bg-gray-800/70 transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-gray-700/50 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-gray-600/50 transition-colors duration-300">
                <stat.icon className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors duration-300" />
              </div>
              <div className="text-2xl font-bold text-white mb-1 group-hover:text-gray-100 transition-colors duration-300">{stat.value}</div>
              <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Safety Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {safetyFeatures.map((feature, index) => (
            <div key={feature.title} className="group p-8 border border-gray-700 rounded-xl hover:border-gray-600 hover:shadow-2xl hover:shadow-gray-900/50 transition-all duration-300 bg-gray-800/50 backdrop-blur-sm hover:bg-gray-800/70 hover:scale-105">
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 transition-all duration-300 ${getColorClasses(feature.color)}`}>
                <feature.icon className="w-8 h-8 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-gray-100 transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-gray-400 leading-relaxed mb-4 group-hover:text-gray-300 transition-colors duration-300">
                {feature.description}
              </p>
              <div className="text-sm font-semibold text-blue-400 group-hover:text-blue-300 transition-colors duration-300">
                {feature.stats}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="inline-flex flex-col items-center gap-4 p-8 bg-gradient-to-r from-gray-800 to-gray-700 rounded-2xl border border-gray-600 hover:border-gray-500 transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <h3 className="text-2xl font-bold text-white">Ready to Experience Safe AI Legal Research?</h3>
            <p className="text-gray-300 max-w-2xl">
              Join thousands of legal professionals who trust VeritasAI for accurate, safe, and transparent legal research.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/dashboard"
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25"
              >
                Start Legal Research
              </Link>
              <Link 
                href="/dashboard/unique"
                className="px-8 py-3 border border-gray-600 text-gray-300 rounded-full font-semibold hover:border-gray-500 hover:bg-gray-700 transition-all duration-300 hover:scale-105"
              >
                Explore Features
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}