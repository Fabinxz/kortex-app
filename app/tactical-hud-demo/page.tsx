"use client";

import React, { useState } from 'react';
import { TacticalHudModal } from '@/components/kortex/tactical-hud-modal';
import { Crosshair } from 'lucide-react';

/**
 * Example usage of the Tactical HUD Modal
 * 
 * This component demonstrates how to integrate the modal into your app.
 * The modal can be triggered by:
 * 1. Clicking the button
 * 2. Pressing Ctrl+J (or Cmd+J on Mac)
 */
export default function TacticalHudExample() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSave = (data: any) => {
    console.log('Study session saved:', data);
    // Here you would typically:
    // 1. Send data to your API
    // 2. Update your database
    // 3. Show a success notification
    alert(`Mission logged!\n\nEfficiency: ${data.efficiency}%\nPace: ${data.pace} min/q`);
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-8">
      <div className="text-center space-y-8">
        {/* Hero Section */}
        <div className="space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#00ff88]/20 border border-[#00ff88]/30">
            <Crosshair className="w-8 h-8 text-[#00ff88]" />
          </div>
          
          <h1 className="text-4xl font-bold text-white tracking-tight">
            Tactical HUD Modal
          </h1>
          
          <p className="text-white/60 max-w-md mx-auto">
            A cyberpunk-themed study session registration interface with keyboard-first UX and real-time analytics.
          </p>
        </div>

        {/* Trigger Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3 bg-[#00ff88]/20 hover:bg-[#00ff88]/30 border border-[#00ff88]/30 text-[#00ff88] rounded-lg font-mono text-sm transition-all inline-flex items-center gap-2"
        >
          <Crosshair className="w-4 h-4" />
          Open Tactical HUD
          <kbd className="ml-2 px-2 py-1 bg-white/10 rounded text-xs">Ctrl+J</kbd>
        </button>

        {/* Features List */}
        <div className="mt-12 max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-white mb-6">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            {[
              { title: '⌨️ Keyboard First', desc: 'Ctrl+J to open, Tab to navigate, 1-4 for error categories' },
              { title: '📊 Real-time Analytics', desc: 'Instant efficiency and pace calculations' },
              { title: '🎯 Error Diagnostics', desc: 'Categorize mistakes to identify patterns' },
              { title: '🧠 Active Recall', desc: 'Debriefing field for knowledge retention' },
              { title: '🎨 Cyberpunk UI', desc: 'Glassmorphism, neon accents, smooth animations' },
              { title: '✅ Smart Validation', desc: 'Must categorize all errors before saving' }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 rounded-lg p-4">
                <div className="font-mono text-sm text-[#00ff88] mb-1">{feature.title}</div>
                <div className="text-xs text-white/60">{feature.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Keyboard Shortcuts Reference */}
        <div className="mt-12 bg-white/5 border border-white/10 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-sm font-mono text-white/60 mb-4">KEYBOARD SHORTCUTS</h3>
          <div className="space-y-2 text-sm">
            {[
              { key: 'Ctrl + J', action: 'Open/Close Modal' },
              { key: 'Tab', action: 'Navigate Fields' },
              { key: '1-4', action: 'Increment Error Categories' },
              { key: 'Ctrl + Enter', action: 'Save Session' },
              { key: 'Esc', action: 'Close Modal' }
            ].map((shortcut, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <kbd className="px-2 py-1 bg-white/10 rounded font-mono text-xs">
                  {shortcut.key}
                </kbd>
                <span className="text-white/60">{shortcut.action}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* The Modal */}
      <TacticalHudModal 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen}
        onSave={handleSave}
      />
    </div>
  );
}
