export default function CTA() {
  return (
    <section className="py-24 bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 text-white">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-5xl font-bold mb-6">Transform Your Legal Practice Today</h3>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Join over 10,000+ attorneys who have revolutionized their legal research with VeritasAI. 
            Save 85% of research time while finding 3x more relevant cases.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-3xl font-bold text-yellow-400 mb-2">85%</div>
              <div className="text-blue-100">Time Saved</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-3xl font-bold text-yellow-400 mb-2">3x</div>
              <div className="text-blue-100">More Cases Found</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-3xl font-bold text-yellow-400 mb-2">2-5 min</div>
              <div className="text-blue-100">Average Brief Time</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
            <a href="/dashboard" className="bg-white text-blue-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-50 transition-colors shadow-lg">
              Start Free Trial
            </a>
            <button className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-blue-900 transition-colors">
              Schedule Demo
            </button>
          </div>

          <div className="text-blue-200 text-sm">
            <p>✓ No credit card required • ✓ 14-day free trial • ✓ Cancel anytime</p>
          </div>
        </div>
      </div>
    </section>
  )
}
