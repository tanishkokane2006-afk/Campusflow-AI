import React, { useState } from 'react';
import { Sparkles, Bot, CheckCircle2, HelpCircle, ArrowRight, MessageSquareCode, Award } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import { Input, Select, Textarea } from '../../components/common/Input';

const AIAssistant = () => {
  const { user } = useAuth();

  const [copilotMode, setCopilotMode] = useState('eligibility'); // 'eligibility' | 'interview'
  const [targetRole, setTargetRole] = useState('Software Engineer');
  const [targetCompany, setTargetCompany] = useState('TCS / Tech Mahindra');
  const [requiredSkills, setRequiredSkills] = useState('React, Node.js, Java, SQL');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState(null);

  const handleGenerateQuestions = (e) => {
    e.preventDefault();
    setIsGenerating(true);

    // Simulate AI Copilot integration point delay
    setTimeout(() => {
      setGeneratedQuestions([
        {
          question: `Explain how you implemented asynchronous state handling and REST API calls in your recent React/Node.js projects.`,
          topic: 'Technical Depth',
        },
        {
          question: `How would you optimize a database query in PostgreSQL or MongoDB when handling high concurrent student applications?`,
          topic: 'System Design & Databases',
        },
        {
          question: `Describe a situation where you had to adapt quickly to a new tech stack under tight campus placement deadlines.`,
          topic: 'Behavioral & Adaptability',
        },
        {
          question: `What are your core strengths when working in an agile software engineering team?`,
          topic: 'Soft Skills & Leadership',
        },
      ]);
      setIsGenerating(false);
    }, 800);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" /> CampusFlow AI Assistant
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight">Placement AI Copilot</h1>
        <p className="mt-1 text-sm text-slate-300">
          AI-assisted eligibility insights and automated interview preparation customized for your student profile.
        </p>

        {/* Mode Switcher */}
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={() => setCopilotMode('eligibility')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              copilotMode === 'eligibility'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white/10 text-slate-300 hover:bg-white/20'
            }`}
          >
            AI Eligibility Copilot
          </button>
          <button
            onClick={() => setCopilotMode('interview')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              copilotMode === 'interview'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white/10 text-slate-300 hover:bg-white/20'
            }`}
          >
            AI Interview Copilot
          </button>
        </div>
      </div>

      {/* Mode 1: AI Eligibility Copilot */}
      {copilotMode === 'eligibility' && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Bot className="w-5 h-5 text-blue-600" /> Why Am I Eligible?
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Automated profile matching analysis for your registered parameters.</p>
            </div>
          </div>

          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <span className="text-slate-400 font-semibold block uppercase">Academic CGPA</span>
                <span className="text-base font-bold text-slate-900 mt-1 block">{user?.cgpa || '8.5'} / 10.0</span>
                <span className="text-emerald-600 text-[11px] font-semibold flex items-center gap-1 mt-1">
                  <CheckCircle2 className="w-3 h-3" /> Exceeds typical 7.0 cutoff
                </span>
              </div>

              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <span className="text-slate-400 font-semibold block uppercase">Branch Status</span>
                <span className="text-base font-bold text-slate-900 mt-1 block">{user?.branch || 'CSE'}</span>
                <span className="text-emerald-600 text-[11px] font-semibold flex items-center gap-1 mt-1">
                  <CheckCircle2 className="w-3 h-3" /> Core eligible branch
                </span>
              </div>

              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <span className="text-slate-400 font-semibold block uppercase">Skill Match Score</span>
                <span className="text-base font-bold text-blue-600 mt-1 block">85% Match</span>
                <span className="text-slate-500 text-[11px]">4 key skills detected</span>
              </div>
            </div>

            <div className="p-4 bg-blue-50/60 border border-blue-100 rounded-xl space-y-2 text-xs text-blue-900">
              <p className="font-bold flex items-center gap-1.5 text-blue-950">
                <Sparkles className="w-4 h-4 text-blue-600" /> AI Eligibility Insight
              </p>
              <p className="leading-relaxed">
                Your profile demonstrates high alignment for Software Engineer, Fullstack Developer, and Frontend Engineer placement drives. Your CGPA ({user?.cgpa}) places you in the top 20% of eligible candidates for major recruiter drives.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Mode 2: AI Interview Copilot */}
      {copilotMode === 'interview' && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <MessageSquareCode className="w-5 h-5 text-blue-600" /> AI Interview Question Generator
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Generate tailored interview preparation questions based on company role, required skills, and your student profile.
            </p>
          </div>

          <form onSubmit={handleGenerateQuestions} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Target Job Role"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Software Engineer"
                required
              />
              <Input
                label="Company Name"
                value={targetCompany}
                onChange={(e) => setTargetCompany(e.target.value)}
                placeholder="e.g. TCS / Accenture"
                required
              />
            </div>

            <Input
              label="Required Skills"
              value={requiredSkills}
              onChange={(e) => setRequiredSkills(e.target.value)}
              placeholder="e.g. Java, React, SQL"
            />

            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isGenerating}
              icon={Sparkles}
            >
              Generate Practice Questions
            </Button>
          </form>

          {/* Generated Results */}
          {generatedQuestions && (
            <div className="mt-6 pt-6 border-t border-slate-100 space-y-4">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Tailored Interview Questions for {targetRole} at {targetCompany}
              </h3>

              <div className="space-y-3">
                {generatedQuestions.map((q, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
                    <span className="inline-block bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded text-[10px]">
                      {q.topic}
                    </span>
                    <p className="font-bold text-slate-900 text-sm">{q.question}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AIAssistant;
