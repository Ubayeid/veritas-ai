'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Shield, Brain, Zap } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 overflow-hidden min-h-screen flex items-center">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(147,51,234,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(236,72,153,0.1),transparent_50%)]"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="text-center">
          {/* Logo */}
          <div className="mb-8">
            <div className="relative inline-block">
              <Image 
                src="/logo-1.png" 
                alt="VeritasAI" 
                width={100} 
                height={100} 
                className="mx-auto rounded-2xl shadow-2xl"
              />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
          
          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight animate-fade-in-up">
            Next-Generation
            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient-x">
              Legal AI
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-4xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200">
            Revolutionary AI-powered legal research with bias detection, predictive analytics, 
            and transparent reasoning. Built for the future of legal practice.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link
              href="/dashboard"
              className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 flex items-center gap-2"
            >
              <span>Start Legal Research</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link
              href="/dashboard/unique"
              className="px-8 py-4 border-2 border-gray-600 text-gray-300 rounded-2xl font-semibold text-lg hover:border-gray-500 hover:bg-gray-800/50 transition-all duration-300"
            >
              Explore Features
            </Link>
          </div>
          
              {/* Feature Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                <div className="group text-center p-6 bg-gray-800/50 rounded-2xl backdrop-blur-sm border border-gray-700 hover:border-blue-500/50 hover:bg-gray-800/70 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/10">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-500/30 transition-colors duration-300">
                    <Shield className="w-6 h-6 text-blue-400 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors duration-300">1,200+</div>
                  <div className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">AI Safety Incidents Analyzed</div>
                </div>
                <div className="group text-center p-6 bg-gray-800/50 rounded-2xl backdrop-blur-sm border border-gray-700 hover:border-purple-500/50 hover:bg-gray-800/70 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/10">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-500/30 transition-colors duration-300">
                    <Brain className="w-6 h-6 text-purple-400 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors duration-300">99.7%</div>
                  <div className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">Bias Detection Accuracy</div>
                </div>
                <div className="group text-center p-6 bg-gray-800/50 rounded-2xl backdrop-blur-sm border border-gray-700 hover:border-pink-500/50 hover:bg-gray-800/70 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-pink-500/10">
                  <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-pink-500/30 transition-colors duration-300">
                    <Zap className="w-6 h-6 text-pink-400 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-2 group-hover:text-pink-300 transition-colors duration-300">50x</div>
                  <div className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">Faster Than Traditional Research</div>
                </div>
              </div>
        </div>
      </div>
    </div>
  );
}
