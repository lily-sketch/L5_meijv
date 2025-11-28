import React from 'react';
import { ProblemType, VariableState } from '../types';
import { Droplet, Heart, User, Layers, Search, AlertCircle } from 'lucide-react';
import { parseInput } from '../problems/utils';

interface VisualizerScreenProps {
  type: ProblemType;
  stepVariables: VariableState;
  input: string;
  highlights: number[];
}

export const VisualizerScreen: React.FC<VisualizerScreenProps> = ({ type, stepVariables, input, highlights }) => {
  
  // --- SUB-COMPONENT: Variables Display ---
  const VarDisplay = () => (
    <div className="flex flex-wrap gap-2 mb-4 p-2 bg-slate-100 rounded-lg border border-slate-200">
      {Object.entries(stepVariables).map(([k, v]) => {
        if (k === 'possible_weights' || k === 'readings') return null; // Skip large objects
        return (
            <div key={k} className="flex items-center gap-2 bg-white px-3 py-1 rounded shadow-sm border border-slate-200">
            <span className="text-xs font-bold text-slate-400 uppercase">{k}</span>
            <span className="font-mono text-blue-600 font-bold">{String(v)}</span>
            </div>
        );
      })}
    </div>
  );

  // --- RENDERERS ---

  const renderWater = () => {
    const total = Number(stepVariables.total) || 0;
    const Y = Number(stepVariables.Y) || 0;
    const consumed = Number(stepVariables.consumed);
    const isValid = consumed >= 0;
    
    return (
      <div className="flex flex-col items-center justify-center h-full gap-8">
        <div className="flex items-end gap-4 relative">
            {/* Total Truck Weight Visualization */}
            <div className="flex flex-col items-center">
                <span className="mb-2 font-bold text-slate-600">出发总重 ({total}kg)</span>
                <div className={`w-24 transition-all duration-500 rounded-lg border-4 flex items-center justify-center
                    ${isValid ? 'bg-blue-100 border-blue-500' : 'bg-red-50 border-red-300'}
                `} style={{ height: `${Math.min(total * 4, 200)}px` }}>
                    <Droplet className={isValid ? "text-blue-500" : "text-red-300"} size={32} />
                </div>
            </div>

            <div className="text-2xl font-bold text-slate-400">-</div>

            {/* Target Weight */}
             <div className="flex flex-col items-center">
                <span className="mb-2 font-bold text-slate-600">到达时重 ({Y}kg)</span>
                <div className="w-24 bg-green-100 border-4 border-green-500 rounded-lg flex items-center justify-center" style={{ height: `${Math.min(Y * 4, 200)}px` }}>
                    <div className="text-green-700 font-bold">{Y}</div>
                </div>
            </div>
             
             <div className="text-2xl font-bold text-slate-400">=</div>

             {/* Result */}
             <div className="flex flex-col items-center">
                <span className="mb-2 font-bold text-slate-600">路上消耗</span>
                {consumed !== undefined && !isNaN(consumed) ? (
                     <div className={`w-24 h-24 rounded-full border-4 flex items-center justify-center text-xl font-bold
                        ${isValid ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-red-400 bg-red-50 text-red-400'}
                     `}>
                         {consumed}
                     </div>
                ) : <div className="w-24 h-24 rounded-full border-4 border-dashed border-gray-300 flex items-center justify-center text-gray-300">?</div>}
            </div>
        </div>
      </div>
    );
  };

  const renderBP = () => {
    const nums = parseInput(input);
    const pairs = [];
    if(nums.length > 0) {
        const n = nums[0];
        for(let i=0; i<n; i++) {
            if(1 + i*2 + 1 < nums.length) {
                pairs.push({s: nums[1+i*2], d: nums[1+i*2+1]});
            }
        }
    }
    const currentIdx = Number(stepVariables.i);

    return (
      <div className="h-full overflow-auto">
        <div className="grid grid-cols-1 gap-2">
            {pairs.map((p, idx) => {
                const isActive = idx === currentIdx;
                const isNormal = (p.s >= 90 && p.s <= 140 && p.d >= 60 && p.d <= 90);
                
                return (
                    <div key={idx} className={`p-3 rounded-lg border-2 flex justify-between items-center transition-all
                        ${isActive ? 'border-blue-500 scale-105 shadow-md bg-blue-50' : 'border-slate-100 bg-white'}
                        ${isActive && isNormal ? 'bg-green-100' : ''}
                        ${isActive && !isNormal ? 'bg-red-100' : ''}
                    `}>
                        <div className="flex items-center gap-4">
                            <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-xs font-bold">{idx+1}</span>
                            <div className="flex flex-col">
                                <span className="text-xs text-slate-500 uppercase">收缩/舒张</span>
                                <span className="font-mono font-bold text-lg">{p.s} / {p.d}</span>
                            </div>
                        </div>
                        {isActive && (
                            <div className={`px-3 py-1 rounded-full text-xs font-bold text-white ${isNormal ? 'bg-green-500' : 'bg-red-500'}`}>
                                {isNormal ? '正常' : '异常'}
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
      </div>
    );
  };

  const renderQueue = () => {
    const x = Number(stepVariables.x);
    // Visualizing modulo visually
    const checks = [
        { mod: 2, val: x % 2, req: 1 },
        { mod: 3, val: x % 3, req: 1 },
        { mod: 4, val: x % 4, req: 1 },
        { mod: 5, val: x % 5, req: 1 },
        { mod: 6, val: x % 6, req: 1 },
        { mod: 7, val: x % 7, req: 0 },
    ];

    return (
      <div className="flex flex-col items-center justify-center h-full">
         <div className="text-6xl font-black text-slate-700 mb-8">{x}</div>
         <div className="text-slate-400 mb-4 font-bold uppercase tracking-wider text-xs">队列总人数</div>
         
         <div className="grid grid-cols-3 gap-4">
            {checks.map(c => {
                const pass = c.val === c.req;
                return (
                    <div key={c.mod} className={`flex flex-col items-center p-3 rounded-xl border-2 transition-colors ${pass ? 'bg-green-50 border-green-400' : 'bg-white border-slate-200 opacity-50'}`}>
                        <span className="text-xs font-bold text-slate-400 uppercase">每行 {c.mod} 人</span>
                        <div className="flex items-baseline mt-1">
                            <span className="text-sm text-slate-500 mr-1">剩余:</span>
                            <span className={`font-mono font-bold text-xl ${pass ? 'text-green-600' : 'text-slate-300'}`}>{c.val}</span>
                        </div>
                    </div>
                )
            })}
         </div>
         <div className="mt-8 flex gap-2">
            {Array.from({length: Math.min(x, 20)}).map((_, i) => (
                <User key={i} size={16} className="text-blue-400" />
            ))}
            {x > 20 && <span className="text-slate-400 font-bold">...</span>}
         </div>
      </div>
    );
  };

  const renderPoker = () => {
    const cards = parseInput(input);
    const sum = Number(stepVariables.sum);
    const currentCardIdx = Number(stepVariables.i);
    const isBust = sum + (stepVariables.card ? Number(stepVariables.card) : 0) > 10; // Visual logic slightly off from engine state, relying on engine 'sum'

    return (
        <div className="h-full flex flex-col">
            {/* Hand Area */}
            <div className="flex-1 flex flex-wrap content-start gap-4 p-4 overflow-auto">
                {cards.map((c, i) => {
                    const status = i < currentCardIdx ? 'taken' : i === currentCardIdx ? 'considering' : 'future';
                    
                    return (
                        <div key={i} className={`
                            w-16 h-24 rounded-lg border-2 flex items-center justify-center text-2xl font-bold shadow-sm transition-all
                            ${status === 'taken' ? 'bg-white border-slate-300 text-slate-700' : ''}
                            ${status === 'considering' ? 'bg-yellow-50 border-yellow-400 text-yellow-700 scale-110 shadow-lg z-10' : ''}
                            ${status === 'future' ? 'bg-slate-100 border-slate-200 text-slate-300' : ''}
                        `}>
                            {c}
                        </div>
                    );
                })}
            </div>

            {/* Sum Bucket */}
            <div className="h-32 bg-slate-100 border-t border-slate-200 p-4 flex items-center justify-between">
                <div>
                    <div className="text-xs font-bold text-slate-400 uppercase mb-1">当前点数总和</div>
                    <div className="text-4xl font-mono font-bold text-slate-700">{sum}</div>
                </div>
                
                <div className="flex-1 mx-8 h-8 bg-gray-200 rounded-full overflow-hidden relative">
                    <div className={`h-full transition-all duration-300 ${sum > 10 ? 'bg-red-500' : 'bg-blue-500'}`} style={{width: `${Math.min((sum/10)*100, 100)}%`}}></div>
                    <div className="absolute top-0 right-0 h-full w-0.5 bg-red-500 z-10" style={{left: '100%'}}></div> 
                    {/* Limit Marker */}
                    <div className="absolute top-0 bottom-0 border-l-2 border-red-500 border-dashed" style={{left: '100%'}}></div>
                </div>

                <div className="text-right">
                     <div className="text-xs font-bold text-slate-400 uppercase mb-1">爆点上限</div>
                     <div className="text-4xl font-mono font-bold text-red-400">10</div>
                </div>
            </div>
        </div>
    )
  };

  const renderFindThree = () => {
    const nums = parseInput(input);
    const currentIndex = Number(stepVariables.i) - 1; // Convert back to 0-based for array access
    
    return (
        <div className="h-full flex flex-col justify-center">
            <div className="flex flex-wrap gap-4 justify-center px-4">
                {nums.map((n, i) => {
                    const isCurrent = i === currentIndex;
                    const isThree = n === 3;
                    const isFound = isCurrent && isThree;

                    return (
                        <div key={i} className="flex flex-col items-center gap-2">
                            <span className="text-xs text-slate-400 font-mono">[{i+1}]</span>
                            <div className={`
                                w-16 h-16 rounded-xl border-4 flex items-center justify-center text-2xl font-bold transition-all
                                ${isCurrent ? 'scale-110 shadow-lg' : 'border-slate-200 bg-white text-slate-400'}
                                ${isCurrent && !isFound ? 'border-blue-400 bg-blue-50 text-blue-600' : ''}
                                ${isFound ? 'border-green-500 bg-green-500 text-white animate-bounce' : ''}
                            `}>
                                {n}
                            </div>
                            {isCurrent && (
                                <div className="text-blue-500">
                                    <Search size={20} />
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <VarDisplay />
      <div className="flex-1 bg-white rounded-lg border-2 border-slate-100 p-4 shadow-inner overflow-hidden relative">
        {type === ProblemType.WATER && renderWater()}
        {type === ProblemType.BLOOD_PRESSURE && renderBP()}
        {type === ProblemType.QUEUE && renderQueue()}
        {type === ProblemType.POKER && renderPoker()}
        {type === ProblemType.FIND_THREE && renderFindThree()}
      </div>
      {/* Console Output */}
      <div className="mt-4 bg-black p-3 rounded-lg font-mono text-sm h-24 overflow-y-auto">
        <span className="text-gray-500 block text-xs border-b border-gray-800 mb-1 pb-1">程序输出</span>
        <div className="text-green-400 whitespace-pre-wrap">
            {stepVariables.output ? (
                <>
                <span className="opacity-50">{String(stepVariables.output).substring(0, String(stepVariables.output).lastIndexOf(' ') + 1)}</span>
                <span className="font-bold">{String(stepVariables.output).split(' ').pop()}</span>
                </>
            ) : <span className="text-gray-600 italic">...</span>}
        </div>
      </div>
    </div>
  );
};