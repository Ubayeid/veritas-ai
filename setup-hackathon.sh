#!/bin/bash

# LegalAI Hackathon Setup Script
# Morgan & Morgan: AI Legal Tender Challenge

echo "🚀 Setting up LegalAI for Hackathon Demo..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

echo "🔧 Setting up environment variables..."
if [ ! -f .env.local ]; then
    cp env.example .env.local
    echo "📝 Created .env.local file. Please add your API keys."
    echo "   Edit .env.local and add:"
    echo "   OPENAI_API_KEY=your_openai_key_here"
    echo "   COURTLISTENER_API_KEY=your_courtlistener_key_here (optional, for real case data)"
    echo "   SEMANTIC_SCHOLAR_API_KEY=your_semantic_scholar_key_here (optional, for academic papers)"
fi

echo "🗄️ Setting up database..."
npx prisma generate
npx prisma db push

echo "🏗️ Building the application..."
npm run build

echo "✅ Setup complete!"
echo ""
echo "🎯 To start the hackathon demo:"
echo "   1. Add your API keys to .env.local (OpenAI required, others optional)"
echo "   2. Run: npm run dev"
echo "   3. Open: http://localhost:3000"
echo ""
echo "📋 Hackathon Features:"
echo "   • AI-powered legal research with multiple data sources"
echo "   • Court Listener API integration (real case data)"
echo "   • Google Scholar Legal integration (academic papers)"
echo "   • Case law analysis and citations"
echo "   • Legal brief generation"
echo "   • Constitutional law precedents"
echo "   • Supreme Court case database"
echo ""
echo "🏆 Good luck with the Morgan & Morgan challenge!"
