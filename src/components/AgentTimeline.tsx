import React from 'react';
import { AgentStatus } from '../lib/types';
import { CheckCircle2, Loader2, Clock, Sparkles } from 'lucide-react';

interface AgentTimelineProps {
  agents: AgentStatus[];
  isGenerating: boolean;
}

export const AgentTimeline: React.FC<AgentTimelineProps> = ({ agents, isGenerating }) => {
  return (
    <div className="bg-brand-card border border-brand-border rounded-2xl p-4 md:p-5 shadow-lg">
      <div className="flex items-center justify-between pb-3 border-b border-brand-border mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-brand-orange" />
          <h3 className="font-bold text-sm text-white">
            Equipe Multi-Agente Innovary Mídia
          </h3>
        </div>
        <span className="text-[11px] font-semibold text-brand-muted">
          5 Agentes Especializados
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
        {agents.map((ag) => {
          const isRunning = ag.status === 'running';
          const isDone = ag.status === 'completed';

          return (
            <div
              key={ag.role}
              className={`relative p-3 rounded-xl border transition-all ${
                isRunning
                  ? 'border-brand-orange bg-brand-orange/10 shadow-glowSm scale-[1.02]'
                  : isDone
                  ? 'border-emerald-500/30 bg-emerald-500/5'
                  : 'border-brand-border bg-brand-bg opacity-70'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-lg">{ag.avatar}</span>
                {isRunning && (
                  <Loader2 className="w-3.5 h-3.5 text-brand-orange animate-spin" />
                )}
                {isDone && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                )}
                {ag.status === 'idle' && (
                  <Clock className="w-3.5 h-3.5 text-zinc-600" />
                )}
              </div>

              <div className="font-bold text-xs text-white truncate">
                {ag.name}
              </div>
              <div className="text-[10px] text-brand-muted truncate mb-1">
                {ag.title.split(' ')[0]}
              </div>

              <p className="text-[10px] line-clamp-2 leading-tight text-zinc-300 font-medium">
                {ag.message}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
