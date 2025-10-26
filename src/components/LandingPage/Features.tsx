'use client';

import { Search, Brain, FileText, Zap, BookOpen, Scale, Shield, Target, TrendingUp, Users, Clock, CheckCircle } from 'lucide-react';

export default function Features() {
  const items = [
    { 
      title: "AI-Powered Case Law Search", 
      desc: "Search through millions of legal cases, statutes, and regulations with natural language queries. Find exactly what you need in seconds.",
      icon: Search,
      color: "blue"
    },
    { 
      title: "Intelligent Legal Analysis", 
      desc: "Advanced AI analyzes case patterns, identifies legal trends, and provides strategic insights for your specific legal matter.",
      icon: Brain,
      color: "purple"
    },
    { 
      title: "Automated Legal Brief Generation", 
      desc: "Generate comprehensive legal briefs with proper citations, case summaries, and legal arguments tailored to your case.",
      icon: FileText,
      color: "green"
    },
    { 
      title: "Real-Time Legal Updates", 
      desc: "Stay current with the latest legal developments, new case law, and regulatory changes relevant to your practice areas.",
      icon: Zap,
      color: "yellow"
    },
    { 
      title: "Multi-Document Analysis", 
      desc: "Upload and analyze multiple legal documents simultaneously to identify patterns, contradictions, and key legal points.",
      icon: BookOpen,
      color: "indigo"
    },
    { 
      title: "Bias Detection & Transparency", 
      desc: "Our AI identifies potential biases in legal analysis and provides transparent explanations for all recommendations.",
      icon: Scale,
      color: "red"
    },
  ]

  const stats = [
    { label: "Legal Cases Analyzed", value: "2M+", icon: BookOpen },
    { label: "Accuracy Rate", value: "99.7%", icon: Target },
    { label: "Time Saved", value: "85%", icon: Clock },
    { label: "Active Users", value: "10K+", icon: Users },
  ]

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "text-blue-400 bg-blue-500/20 group-hover:bg-blue-500/30 group-hover:text-blue-300",
      purple: "text-purple-400 bg-purple-500/20 group-hover:bg-purple-500/30 group-hover:text-purple-300",
      green: "text-green-400 bg-green-500/20 group-hover:bg-green-500/30 group-hover:text-green-300",
      yellow: "text-yellow-400 bg-yellow-500/20 group-hover:bg-yellow-500/30 group-hover:text-yellow-300",
      indigo: "text-indigo-400 bg-indigo-500/20 group-hover:bg-indigo-500/30 group-hover:text-indigo-300",
      red: "text-red-400 bg-red-500/20 group-hover:bg-red-500/30 group-hover:text-red-300",
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  return (
    <section id="features" className="py-24 bg-gray-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.1),transparent_50%)]"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in-up">
            Revolutionary Legal AI Features
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto animate-fade-in-up animation-delay-200">
            Built specifically for legal professionals, VeritasAI combines cutting-edge artificial intelligence with comprehensive legal databases to transform how you practice law.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div key={stat.label} className="group text-center p-6 bg-gray-800/50 rounded-xl backdrop-blur-sm border border-gray-700 hover:border-gray-600 hover:bg-gray-800/70 transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-gray-700/50 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-gray-600/50 transition-colors duration-300">
                <stat.icon className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors duration-300" />
              </div>
              <div className="text-2xl font-bold text-white mb-1 group-hover:text-gray-100 transition-colors duration-300">{stat.value}</div>
              <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, index) => (
            <div key={item.title} className="group p-8 border border-gray-700 rounded-xl hover:border-gray-600 hover:shadow-2xl hover:shadow-gray-900/50 transition-all duration-300 bg-gray-800/50 backdrop-blur-sm hover:bg-gray-800/70 hover:scale-105">
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 transition-all duration-300 ${getColorClasses(item.color)}`}>
                <item.icon className="w-8 h-8 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="text-xl font-semibold mb-3 text-white group-hover:text-gray-100 transition-colors duration-300">{item.title}</div>
              <div className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">{item.desc}</div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25">
            <CheckCircle className="w-5 h-5" />
            <span>Experience the Future of Legal Research</span>
          </div>
        </div>
      </div>
    </section>
  );
}