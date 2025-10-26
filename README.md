# VeritasAI - Truth in Legal Intelligence

<div align="center">

**AI-Powered Legal Research Intelligence Platform**

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![OpenAI](https://img.shields.io/badge/OpenAI-6.1-green)](https://openai.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Transform legal research with AI-powered case analysis and intelligent document understanding.

[Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [Demo](#-demo) • [Contributing](#-contributing)

</div>

---

## 🎯 Overview

VeritasAI revolutionizes legal research by providing attorneys and legal professionals with AI-powered access to case law, legal precedents, and strategic insights. What traditionally takes hours of research can now be accomplished in minutes through intelligent conversational AI.

### Built for the Hackathon: **Morgan & Morgan AI Legal Tender Challenge**

This project demonstrates cutting-edge AI capabilities in legal technology, showcasing how machine learning and natural language processing can transform legal workflows.

---

## ✨ Features

### 🤖 **AI-Powered Research**
- Natural language query interface
- Intelligent case law analysis
- Automated legal brief generation
- Context-aware document understanding

### 📚 **Comprehensive Data Integration**
- Real-time access to Court Listener API
- Google Scholar Legal integration
- Academic research paper analysis
- AI Safety Database (AIID) for incident tracking

### 🎨 **Modern User Experience**
- Intuitive dashboard interface
- Real-time chat with citations
- Sidebar navigation
- Responsive design

### 🔒 **Enterprise-Ready**
- Prisma ORM for robust data management
- TypeScript for type safety
- API route architecture
- Secure environment configuration

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenAI API key

### Installation

```bash
# Clone the repository
git clone https://github.com/Ubayeid/veritas-ai.git
cd veritas-ai

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Configuration

Create a `.env.local` file:

```env
# Required for AI responses
OPENAI_API_KEY=your_openai_key_here

# Optional: For real case data
COURTLISTENER_API_KEY=your_courtlistener_key_here

# Optional: For academic research
SEMANTIC_SCHOLAR_API_KEY=your_semantic_scholar_key_here

# Database
DATABASE_URL="file:./dev.db"
```

### Run Development Server

```bash
# Start the development server
npm run dev

# Open http://localhost:3000 in your browser
```

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

---

## 📖 Usage

### Basic Workflow

1. **Start a Chat Session**
   - Navigate to the dashboard
   - Enter your legal query in natural language
   - AI analyzes your question against legal databases

2. **Review Results**
   - View AI-generated responses with citations
   - Examine relevant case law
   - Access full document references

3. **Generate Documents**
   - Use the chat interface to request legal briefs
   - Export results for use in case preparation
   - Save research sessions for later

### Example Queries

```
"Find cases related to product liability in automotive industry"
"What are the precedents for copyright infringement in software?"
"Show me recent rulings on data privacy regulations"
```

---

## 🏗️ Architecture

### Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **AI/ML**: OpenAI GPT Models
- **Database**: SQLite with Prisma ORM
- **APIs**: Court Listener, Google Scholar, Semantic Scholar

### Project Structure

```
veritas-ai/
├── src/
│   ├── app/              # Next.js app router
│   ├── components/       # React components
│   ├── lib/              # Utilities and services
│   └── types/            # TypeScript definitions
├── prisma/              # Database schema
├── public/              # Static assets
└── ...config files
```

### Key Features

- **Adaptive Learning**: AI improves responses based on context
- **Bias Detection**: Identifies potential bias in legal analysis
- **Explainable AI**: Provides reasoning for legal conclusions
- **Multi-Document Analysis**: Processes multiple documents simultaneously
- **Predictive Legal**: Forecasts potential case outcomes

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

---

## 📝 API Routes

| Route | Description |
|-------|-------------|
| `/api/chats` | Chat message handling |
| `/api/legal` | Legal analysis services |
| `/api/bias-detection` | Bias identification |
| `/api/multi-document` | Document processing |
| `/api/predictive-legal` | Case outcome prediction |

---

## 🔐 Security

- Environment variables for sensitive data
- Secure API key management
- Input validation and sanitization
- Rate limiting on API endpoints

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

- **Ubayeid U.** - [GitHub](https://github.com/Ubayeid)

---

## 🙏 Acknowledgments

- Morgan & Morgan for the hackathon challenge
- OpenAI for GPT API access
- Court Listener for legal data
- The open-source community

---

## 📬 Contact

For questions or support, please open an issue on GitHub or contact the maintainers.

---

<div align="center">

**Made with ❤️ for the legal community**

[⭐ Star this repo](https://github.com/Ubayeid/veritas-ai) | [🐛 Report Bug](https://github.com/Ubayeid/veritas-ai/issues) | [💡 Request Feature](https://github.com/Ubayeid/veritas-ai/issues)

</div>


