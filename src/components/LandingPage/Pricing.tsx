'use client';

import { Check, Star, Zap, Shield, Crown } from 'lucide-react';

export default function Pricing() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for individual lawyers and small practices",
      icon: Star,
      color: "gray",
      features: [
        "10 legal queries per month",
        "Basic case law search",
        "Standard AI analysis",
        "Email support",
        "Basic citations"
      ],
      limitations: [
        "Limited to 10 queries",
        "No advanced features",
        "Basic support only"
      ],
      cta: "Get Started Free",
      popular: false
    },
    {
      name: "Professional",
      price: "$29",
      period: "per month",
      description: "Ideal for growing law firms and busy practitioners",
      icon: Zap,
      color: "blue",
      features: [
        "Unlimited legal queries",
        "Advanced case law search",
        "AI-powered legal analysis",
        "Priority support",
        "Advanced citations & references",
        "Multi-document analysis",
        "Bias detection & transparency",
        "Export to legal formats"
      ],
      limitations: [],
      cta: "Start Professional Trial",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "contact us",
      description: "For large law firms and corporate legal departments",
      icon: Crown,
      color: "purple",
      features: [
        "Everything in Professional",
        "Custom AI training",
        "Dedicated account manager",
        "24/7 phone support",
        "Custom integrations",
        "Advanced analytics",
        "Team collaboration tools",
        "API access",
        "White-label options"
      ],
      limitations: [],
      cta: "Contact Sales",
      popular: false
    }
  ]

  const getColorClasses = (color: string, popular: boolean) => {
    if (popular) {
      return "border-blue-500 bg-blue-500/10"
    }
    const colors = {
      gray: "border-gray-700 bg-gray-800/50",
      blue: "border-blue-500/50 bg-blue-500/5",
      purple: "border-purple-500/50 bg-purple-500/5",
    }
    return colors[color as keyof typeof colors] || colors.gray
  }

  const getIconColor = (color: string) => {
    const colors = {
      gray: "text-gray-400 bg-gray-700/50",
      blue: "text-blue-400 bg-blue-500/20",
      purple: "text-purple-400 bg-purple-500/20",
    }
    return colors[color as keyof typeof colors] || colors.gray
  }

  return (
    <section id="pricing" className="py-24 bg-gray-800 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.1),transparent_50%)]"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in-up">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto animate-fade-in-up animation-delay-200">
            Choose the plan that fits your practice. No hidden fees, no surprises. 
            Start free and upgrade as you grow.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div key={plan.name} className={`group relative p-8 rounded-2xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${getColorClasses(plan.color, plan.popular)} ${plan.popular ? 'hover:shadow-blue-500/20' : 'hover:shadow-gray-900/50'}`}>
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-sm font-semibold">
                    <Shield className="w-4 h-4" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 transition-all duration-300 ${getIconColor(plan.color)} group-hover:scale-110`}>
                  <plan.icon className="w-8 h-8" />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-gray-100 transition-colors duration-300">
                  {plan.name}
                </h3>
                
                <div className="mb-2">
                  <span className="text-4xl font-bold text-white group-hover:text-gray-100 transition-colors duration-300">
                    {plan.price}
                  </span>
                  <span className="text-gray-400 ml-2 group-hover:text-gray-300 transition-colors duration-300">
                    {plan.period}
                  </span>
                </div>
                
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                  {plan.description}
                </p>
              </div>

              <div className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                      {feature}
                    </span>
                  </div>
                ))}
                
                {plan.limitations.map((limitation, limitIndex) => (
                  <div key={limitIndex} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full border border-gray-600 flex-shrink-0"></div>
                    <span className="text-gray-500 group-hover:text-gray-400 transition-colors duration-300">
                      {limitation}
                    </span>
                  </div>
                ))}
              </div>

              <button className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 hover:scale-105 ${
                plan.popular 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:shadow-xl hover:shadow-blue-500/25'
                  : 'border border-gray-600 text-gray-300 hover:border-gray-500 hover:bg-gray-700 hover:text-white'
              }`}>
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800/50 rounded-full border border-gray-700 hover:border-gray-600 transition-all duration-300">
            <Shield className="w-5 h-5 text-green-400" />
            <span className="text-gray-300">All plans include AI safety features and bias detection</span>
          </div>
        </div>
      </div>
    </section>
  );
}