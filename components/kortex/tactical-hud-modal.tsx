"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Target, 
  Clock, 
  TrendingUp, 
  AlertTriangle,
  Brain,
  Crosshair,
  Activity
} from 'lucide-react';

// Mock topics data
const mockTopics = [
  "Potenciação e Radiciação",
  "Regra de 3",
  "Eletrodinâmica",
  "Estequiometria",
  "Revolução Francesa",
  "Botânica",
  "Geometria Analítica",
  "Cinemática",
  "Termoquímica",
  "Brasil Colônia"
];

const subjects = [
  "Matemática",
  "Natureza",
  "Humanas",
  "Linguagens",
  "Redação"
];

const errorCategories = [
  { id: 1, key: '1', label: 'Lacuna Teórica', color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/30', icon: '🔴' },
  { id: 2, key: '2', label: 'Atenção/Silly', color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', icon: '🟡' },
  { id: 3, key: '3', label: 'Interpretação', color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/30', icon: '🔵' },
  { id: 4, key: '4', label: 'Tempo', color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/30', icon: '🟣' }
];

interface TacticalHudModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (data: any) => void;
}

export function TacticalHudModal({ open, onOpenChange, onSave }: TacticalHudModalProps) {
  // Form State
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [source, setSource] = useState('');
  const [totalQuestions, setTotalQuestions] = useState<number>(0);
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);
  const [timeSpent, setTimeSpent] = useState<number>(0);
  const [debriefing, setDebriefing] = useState('');
  
  // Error categorization state
  const [errorCounts, setErrorCounts] = useState({
    1: 0, // Lacuna Teórica
    2: 0, // Atenção
    3: 0, // Interpretação
    4: 0  // Tempo
  });

  // Topic autocomplete
  const [showTopicSuggestions, setShowTopicSuggestions] = useState(false);
  const filteredTopics = useMemo(() => {
    if (!topic) return mockTopics;
    return mockTopics.filter(t => 
      t.toLowerCase().includes(topic.toLowerCase())
    );
  }, [topic]);

  // Calculations
  const efficiency = useMemo(() => {
    if (totalQuestions === 0) return 0;
    return Math.round((correctAnswers / totalQuestions) * 100);
  }, [correctAnswers, totalQuestions]);

  const pace = useMemo(() => {
    if (totalQuestions === 0) return 0;
    return (timeSpent / totalQuestions).toFixed(1);
  }, [timeSpent, totalQuestions]);

  const efficiencyColor = useMemo(() => {
    if (efficiency >= 80) return 'text-[#00ff88]';
    if (efficiency >= 60) return 'text-yellow-500';
    return 'text-red-500';
  }, [efficiency]);

  // Error diagnosis logic
  const totalErrors = totalQuestions - correctAnswers;
  const showErrorDiagnostics = totalErrors > 0;
  const totalErrorsCategorized = Object.values(errorCounts).reduce((a, b) => a + b, 0);
  const allErrorsCategorized = totalErrorsCategorized === totalErrors;

  // Validation
  const canSave = useMemo(() => {
    const basicFieldsFilled = subject && topic && source && totalQuestions > 0;
    const errorConditionMet = !showErrorDiagnostics || allErrorsCategorized;
    return basicFieldsFilled && errorConditionMet;
  }, [subject, topic, source, totalQuestions, showErrorDiagnostics, allErrorsCategorized]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+J to open modal
      if ((e.ctrlKey || e.metaKey) && e.key === 'j') {
        e.preventDefault();
        onOpenChange(true);
      }

      // Only handle these when modal is open
      if (!open) return;

      // Ctrl+Enter to save
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && canSave) {
        e.preventDefault();
        handleSave();
      }

      // Error category hotkeys (1-4)
      if (showErrorDiagnostics && ['1', '2', '3', '4'].includes(e.key) && !e.ctrlKey && !e.metaKey) {
        const activeElement = document.activeElement as HTMLElement;
        // Only trigger if not typing in an input/textarea
        if (activeElement?.tagName !== 'INPUT' && activeElement?.tagName !== 'TEXTAREA') {
          e.preventDefault();
          incrementErrorCategory(parseInt(e.key));
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, canSave, showErrorDiagnostics]);

  const incrementErrorCategory = (categoryId: number) => {
    setErrorCounts(prev => {
      const newCount = prev[categoryId as keyof typeof prev] + 1;
      const newTotal = Object.values({ ...prev, [categoryId]: newCount }).reduce((a, b) => a + b, 0);
      
      // Don't exceed total errors
      if (newTotal > totalErrors) return prev;
      
      return { ...prev, [categoryId]: newCount };
    });
  };

  const decrementErrorCategory = (categoryId: number) => {
    setErrorCounts(prev => ({
      ...prev,
      [categoryId]: Math.max(0, prev[categoryId as keyof typeof prev] - 1)
    }));
  };

  const handleSave = () => {
    if (!canSave) return;

    const sessionData = {
      subject,
      topic,
      source,
      totalQuestions,
      correctAnswers,
      timeSpent,
      efficiency,
      pace,
      errorDiagnostics: showErrorDiagnostics ? errorCounts : null,
      debriefing
    };

    onSave?.(sessionData);
    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    setSubject('');
    setTopic('');
    setSource('');
    setTotalQuestions(0);
    setCorrectAnswers(0);
    setTimeSpent(0);
    setDebriefing('');
    setErrorCounts({ 1: 0, 2: 0, 3: 0, 4: 0 });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-4xl bg-[#09090b] border border-white/10 text-white p-0 overflow-hidden"
        style={{ backdropFilter: 'blur(20px)' }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Header */}
          <DialogHeader className="bg-gradient-to-r from-[#00ff88]/10 to-cyan-500/10 border-b border-white/10 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#00ff88]/20 border border-[#00ff88]/30 flex items-center justify-center">
                <Crosshair className="w-5 h-5 text-[#00ff88]" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold tracking-tight">
                  TACTICAL HUD
                </DialogTitle>
                <p className="text-xs text-white/60 font-mono mt-1">
                  Study Session Registration Protocol
                </p>
              </div>
              <div className="ml-auto text-xs font-mono text-white/40">
                Press <kbd className="px-2 py-1 bg-white/10 rounded">Ctrl+J</kbd> to toggle
              </div>
            </div>
          </DialogHeader>

          <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
            {/* Context Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-mono text-[#00ff88] mb-3">
                <Target className="w-4 h-4" />
                <span>MISSION CONTEXT</span>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                {/* Subject */}
                <div>
                  <label className="text-xs font-mono text-white/60 mb-2 block">
                    SUBJECT
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00ff88]/50 transition-all"
                  >
                    <option value="">Select...</option>
                    {subjects.map(s => (
                      <option key={s} value={s} className="bg-[#09090b]">{s}</option>
                    ))}
                  </select>
                </div>

                {/* Topic */}
                <div className="relative">
                  <label className="text-xs font-mono text-white/60 mb-2 block">
                    TOPIC
                  </label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    onFocus={() => setShowTopicSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowTopicSuggestions(false), 200)}
                    placeholder="Start typing..."
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00ff88]/50 transition-all"
                  />
                  
                  {/* Autocomplete dropdown */}
                  {showTopicSuggestions && filteredTopics.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-[#09090b] border border-white/10 rounded-lg overflow-hidden shadow-xl">
                      {filteredTopics.slice(0, 5).map((t, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setTopic(t);
                            setShowTopicSuggestions(false);
                          }}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-[#00ff88]/10 transition-colors"
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Source */}
                <div>
                  <label className="text-xs font-mono text-white/60 mb-2 block">
                    SOURCE
                  </label>
                  <input
                    type="text"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    placeholder="e.g., FUVEST 2021"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00ff88]/50 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Metrics Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-mono text-cyan-500 mb-3">
                <Activity className="w-4 h-4" />
                <span>PERFORMANCE METRICS</span>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                {/* Total Questions */}
                <div>
                  <label className="text-xs font-mono text-white/60 mb-2 block">
                    TOTAL QUESTIONS
                  </label>
                  <input
                    type="number"
                    value={totalQuestions || ''}
                    onChange={(e) => setTotalQuestions(Math.max(0, parseInt(e.target.value) || 0))}
                    min="0"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#00ff88]/50 transition-all"
                  />
                </div>

                {/* Correct Answers */}
                <div>
                  <label className="text-xs font-mono text-white/60 mb-2 block">
                    CORRECT ANSWERS
                  </label>
                  <input
                    type="number"
                    value={correctAnswers || ''}
                    onChange={(e) => setCorrectAnswers(Math.min(totalQuestions, Math.max(0, parseInt(e.target.value) || 0)))}
                    min="0"
                    max={totalQuestions}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#00ff88]/50 transition-all"
                  />
                </div>

                {/* Time Spent */}
                <div>
                  <label className="text-xs font-mono text-white/60 mb-2 block">
                    TIME SPENT (min)
                  </label>
                  <input
                    type="number"
                    value={timeSpent || ''}
                    onChange={(e) => setTimeSpent(Math.max(0, parseInt(e.target.value) || 0))}
                    min="0"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#00ff88]/50 transition-all"
                  />
                </div>
              </div>

              {/* Real-time Calculations */}
              <div className="grid grid-cols-2 gap-4 mt-4">
                {/* Efficiency */}
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-white/60" />
                    <span className="text-xs font-mono text-white/60">EFFICIENCY</span>
                  </div>
                  <div className={`text-3xl font-bold font-mono ${efficiencyColor}`}>
                    {efficiency}%
                  </div>
                </div>

                {/* Pace */}
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-white/60" />
                    <span className="text-xs font-mono text-white/60">PACE (RITMO)</span>
                  </div>
                  <div className="text-3xl font-bold font-mono text-cyan-500">
                    {pace} <span className="text-sm text-white/60">min/q</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Error Diagnostics (Conditional) */}
            <AnimatePresence>
              {showErrorDiagnostics && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm font-mono text-red-500">
                        <AlertTriangle className="w-4 h-4" />
                        <span>AUTOPSIA DO ERRO</span>
                      </div>
                      <div className={`text-sm font-mono ${allErrorsCategorized ? 'text-[#00ff88]' : 'text-yellow-500'}`}>
                        Classified: {totalErrorsCategorized} / {totalErrors}
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-3">
                      {errorCategories.map(category => (
                        <div
                          key={category.id}
                          className={`${category.bg} border ${category.border} rounded-lg p-3 space-y-2`}
                        >
                          <div className="text-xs font-mono text-white/60 flex items-center gap-1">
                            <span>{category.icon}</span>
                            <span>{category.label}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => decrementErrorCategory(category.id)}
                              className="w-7 h-7 rounded bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center text-sm"
                            >
                              −
                            </button>
                            <div className={`flex-1 text-center text-xl font-bold font-mono ${category.color}`}>
                              {errorCounts[category.id as keyof typeof errorCounts]}
                            </div>
                            <button
                              onClick={() => incrementErrorCategory(category.id)}
                              className="w-7 h-7 rounded bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center text-sm"
                            >
                              +
                            </button>
                          </div>
                          
                          <div className="text-xs text-white/40 text-center font-mono">
                            Press {category.key}
                          </div>
                        </div>
                      ))}
                    </div>

                    {!allErrorsCategorized && (
                      <div className="text-xs text-yellow-500 font-mono text-center bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-2">
                        ⚠ You must categorize all {totalErrors} errors before saving
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Debriefing */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-mono text-purple-500 mb-3">
                <Brain className="w-4 h-4" />
                <span>PROTOCOLO DE RETENÇÃO</span>
              </div>
              
              <textarea
                value={debriefing}
                onChange={(e) => setDebriefing(e.target.value)}
                placeholder="Explique em 1 frase o conceito chave ou a armadilha dessa lista..."
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00ff88]/50 transition-all resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-white/10">
              <button
                onClick={() => onOpenChange(false)}
                className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-mono transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!canSave}
                className={`flex-1 px-4 py-3 rounded-lg text-sm font-mono transition-all flex items-center justify-center gap-2
                  ${canSave 
                    ? 'bg-[#00ff88]/20 hover:bg-[#00ff88]/30 border border-[#00ff88]/30 text-[#00ff88]' 
                    : 'bg-white/5 border border-white/10 text-white/30 cursor-not-allowed'
                  }`}
              >
                <Zap className="w-4 h-4" />
                SAVE MISSION LOG
                <kbd className="ml-2 px-2 py-1 bg-white/10 rounded text-xs">Ctrl+Enter</kbd>
              </button>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
