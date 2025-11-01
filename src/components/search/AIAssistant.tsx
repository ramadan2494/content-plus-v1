// src/components/search/AIAssistant.tsx
'use client';

import { useState } from 'react';
import { Sparkles, Send, Settings, Bot, MessageCircle, Zap, BookOpen, ThumbsUp, ThumbsDown, FileStack, Mic, Search, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RAGResult, SearchResult } from '@/types';
import { RAGResults } from './RAGResults';
import { SearchResults } from './SearchResults';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface AIAssistantProps {
  query: string;
  onQueryChange: (query: string) => void;
  onSearch: () => void;
  isLoading: boolean;
  ragResult: RAGResult | null;
  papers?: SearchResult[];
}

type AIModel = 'gpt-4' | 'claude-3' | 'gemini-pro' | 'rag-default';

const AI_MODELS: Array<{ id: AIModel; name: string; shortName: string; description: string }> = [
  {
    id: 'rag-default',
    name: 'RAG Default Model',
    shortName: 'RAG',
    description: 'Retrieval-augmented generation for research papers'
  },
  {
    id: 'gpt-4',
    name: 'GPT-4',
    shortName: 'GPT-4',
    description: 'Advanced reasoning and analysis'
  },
  {
    id: 'claude-3',
    name: 'Claude 3',
    shortName: 'Claude',
    description: 'Balanced performance and accuracy'
  },
  {
    id: 'gemini-pro',
    name: 'Gemini Pro',
    shortName: 'Gemini',
    description: 'Fast and efficient responses'
  },
];

const EXAMPLE_QUESTIONS = [
  "What are the latest advancements in neural networks?",
  "Explain quantum computing in simple terms",
  "What are the key findings about climate change mitigation?",
  "Summarize recent research on machine learning",
];

export const AIAssistant: React.FC<AIAssistantProps> = ({
  query,
  onQueryChange,
  onSearch,
  isLoading,
  ragResult,
  papers = [],
}) => {
  const [selectedModel, setSelectedModel] = useState<AIModel>('rag-default');
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [feedback, setFeedback] = useState<'positive' | 'negative' | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch();
    }
  };

  const handleExampleClick = (example: string) => {
    onQueryChange(example);
    setIsInputFocused(true);
    setTimeout(() => {
      onSearch();
    }, 100);
  };

  const selectedModelInfo = AI_MODELS.find(m => m.id === selectedModel);

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* AI Assistant Header - Only show when no results */}
      {!ragResult && papers.length === 0 && (
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-full mb-6">
            <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
              AI Assistant
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-5 leading-tight">
            Automate Everyday
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Research Tasks
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
            Ask questions about research papers, get instant AI-powered answers with citations, and discover relevant academic papers.
          </p>
        </div>
      )}

      {/* AI Conversation Area */}
      {ragResult && (
        <div className="mb-6 bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 mt-1">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                <Bot className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-gray-900 dark:text-gray-100 leading-relaxed whitespace-pre-wrap text-[15px]">
                {ragResult.answer}
              </div>
              
              {/* Feedback Section */}
              <div className="mt-5 flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Feedback:
                </span>
                <button
                  onClick={() => setFeedback(feedback === 'positive' ? null : 'positive')}
                  className={`p-1.5 rounded transition-colors ${
                    feedback === 'positive'
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
                  }`}
                  title="Helpful"
                >
                  <ThumbsUp className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setFeedback(feedback === 'negative' ? null : 'negative')}
                  className={`p-1.5 rounded transition-colors ${
                    feedback === 'negative'
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
                  }`}
                  title="Not helpful"
                >
                  <ThumbsDown className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Search Box */}
      <div className="mb-6">
        <div className="relative max-w-4xl mx-auto">
          {/* Model Selector */}
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowModelSelector(!showModelSelector)}
                className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md hover:border-gray-300 dark:hover:border-gray-600 transition-all text-xs font-medium text-gray-700 dark:text-gray-300 shadow-sm"
              >
                <Bot className="h-3 w-3" />
                <span>{selectedModelInfo?.shortName || selectedModelInfo?.name}</span>
                <Settings className="h-3 w-3" />
              </button>

              {/* Model Dropdown */}
              {showModelSelector && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setShowModelSelector(false)}
                  />
                  <div className="absolute top-full left-0 mt-1.5 w-72 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-30 overflow-hidden">
                    <div className="px-3 py-2 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                      <div className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                        Select AI Model
                      </div>
                    </div>
                    <div className="py-1">
                      {AI_MODELS.map((model) => (
                        <button
                          key={model.id}
                          onClick={() => {
                            setSelectedModel(model.id);
                            setShowModelSelector(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 transition-colors ${
                            selectedModel === model.id
                              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                          }`}
                        >
                          <div className="font-medium text-sm">{model.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            {model.description}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Search Input */}
          <form onSubmit={handleSubmit} className="relative">
            <div className={`relative transition-all rounded-xl border ${
              isInputFocused 
                ? 'border-blue-500 dark:border-blue-600 shadow-md' 
                : 'border-gray-200 dark:border-gray-700 shadow-sm'
            }`}>
              <Input
                type="text"
                placeholder="Ask anything or give follow up task..."
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
                className="pl-[130px] pr-[180px] h-14 text-[15px] border-0 rounded-xl focus:ring-0 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                disabled={isLoading}
              />
              
              {/* Paper Count & Icons */}
              <div className="absolute right-[90px] top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                {papers.length > 0 && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md text-xs font-medium">
                    <FileStack className="h-3.5 w-3.5" />
                    <span>{papers.length}</span>
                  </div>
                )}
                <button
                  type="button"
                  className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                  title="Voice input"
                >
                  <Mic className="h-4 w-4" />
                </button>
              </div>
              
              {/* Deep Search Button */}
              <Button
                type="submit"
                disabled={isLoading || !query.trim()}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-10 px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Searching
                  </>
                ) : (
                  'Deep Search'
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Example Questions */}
        {!query && !ragResult && !isLoading && (
          <div className="mt-5 max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-3">
              <MessageCircle className="h-4 w-4 text-gray-400 dark:text-gray-500" />
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Try asking:
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {EXAMPLE_QUESTIONS.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleExampleClick(question)}
                  className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs text-gray-600 dark:text-gray-400 hover:border-blue-500 dark:hover:border-blue-600 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Related Papers */}
      {papers.length > 0 && (
        <div className="mt-6 max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-5">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Related Research Papers
            </h2>
            <span className="px-3 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full text-xs font-medium">
              {papers.length} {papers.length === 1 ? 'paper' : 'papers'}
            </span>
          </div>
          <SearchResults results={papers} isLoading={false} />
        </div>
      )}

      {/* Loading State */}
      {isLoading && !ragResult && papers.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Analyzing research papers and generating answer...
          </p>
        </div>
      )}

    </div>
  );
};

