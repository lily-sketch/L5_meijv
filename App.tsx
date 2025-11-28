import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ProblemType, Step } from './types';
import { PROBLEMS } from './problems/configs';
import { generateWaterSteps, generateBPSteps, generateQueueSteps, generatePokerSteps, generateFindThreeSteps } from './problems/engines';
import { CodeViewer } from './components/CodeViewer';
import { ControlPanel } from './components/ControlPanel';
import { VisualizerScreen } from './components/VisualizerScreen';
import { Terminal, BookOpen, Edit2, CheckCircle2 } from 'lucide-react';

const App: React.FC = () => {
  const [activeProblem, setActiveProblem] = useState<ProblemType>(ProblemType.WATER);
  const [inputData, setInputData] = useState<string>(PROBLEMS[ProblemType.WATER].defaultInput);
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(500);
  const [isInputExpanded, setIsInputExpanded] = useState<boolean>(false);

  // Load problem config
  const config = PROBLEMS[activeProblem];

  // Engine Factory
  const recalculateSteps = useCallback(() => {
    let result;
    switch (activeProblem) {
      case ProblemType.WATER: result = generateWaterSteps(inputData); break;
      case ProblemType.BLOOD_PRESSURE: result = generateBPSteps(inputData); break;
      case ProblemType.QUEUE: result = generateQueueSteps(); break;
      case ProblemType.POKER: result = generatePokerSteps(inputData); break;
      case ProblemType.FIND_THREE: result = generateFindThreeSteps(inputData); break;
      default: result = { steps: [] };
    }
    setSteps(result.steps);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [activeProblem, inputData]);

  // Initial load & problem switch
  useEffect(() => {
    setInputData(PROBLEMS[activeProblem].defaultInput);
  }, [activeProblem]);

  useEffect(() => {
    recalculateSteps();
  }, [recalculateSteps]);

  // Playback Loop
  useEffect(() => {
    let interval: number;
    if (isPlaying && currentStepIndex < steps.length - 1) {
      interval = window.setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speed);
    } else {
      setIsPlaying(false);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStepIndex, steps.length, speed]);

  const currentStep = steps[currentStepIndex] || { 
    lineIndex: -1, 
    description: "初始化中...", 
    variables: {}, 
    highlights: [] 
  };

  // Build the accumulated output string for the console simulation
  const accumulatedOutput = useMemo(() => {
      // Find the last step that had output up to current index
      for(let i = currentStepIndex; i >= 0; i--) {
          if (steps[i]?.output) return steps[i].output;
      }
      return "";
  }, [currentStepIndex, steps]);

  const stepWithOutput = { ...currentStep, output: accumulatedOutput };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
            <Terminal size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              C++ 趣味算法
            </h1>
            <p className="text-xs text-slate-400 font-medium tracking-wide">可视化编程学习引擎</p>
          </div>
        </div>
        
        {/* Navigation / Problem Selector */}
        <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0 hide-scrollbar max-w-2xl">
          {Object.values(PROBLEMS).map(p => (
            <button
              key={p.id}
              onClick={() => setActiveProblem(p.id as ProblemType)}
              className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-semibold transition-all
                ${activeProblem === p.id 
                  ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-500/20' 
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'}
              `}
            >
              {p.title.split('(')[0]}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Visualizer & Controls */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Problem Info & Input */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
             <div className="flex justify-between items-start mb-2">
                <div>
                    <h2 className="text-lg font-bold text-slate-800">{config.title}</h2>
                    <p className="text-slate-500 text-sm mt-1">{config.description}</p>
                </div>
                {activeProblem !== ProblemType.QUEUE && (
                    <button 
                        onClick={() => setIsInputExpanded(!isInputExpanded)}
                        className="flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                        <Edit2 size={14} />
                        {isInputExpanded ? '隐藏数据' : '修改数据'}
                    </button>
                )}
             </div>

             {isInputExpanded && activeProblem !== ProblemType.QUEUE && (
                 <div className="mt-4 pt-4 border-t border-slate-100 animate-in fade-in slide-in-from-top-2">
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">输入数据 (空格分隔)</label>
                    <textarea 
                        value={inputData}
                        onChange={(e) => setInputData(e.target.value)}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                        rows={3}
                    />
                    <div className="flex justify-end mt-2">
                         <button 
                            onClick={() => { recalculateSteps(); setIsInputExpanded(false); }}
                            className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-blue-700 shadow-sm flex items-center gap-2"
                         >
                             <CheckCircle2 size={16} />
                             应用并重置
                         </button>
                    </div>
                 </div>
             )}
          </div>

          {/* Visualizer Stage */}
          <div className="flex-1 bg-slate-50 rounded-xl border-4 border-white shadow-lg overflow-hidden flex flex-col min-h-[400px]">
             <div className="bg-white border-b border-slate-100 p-3 flex justify-between items-center">
                 <div className="flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                     <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">实时演示</span>
                 </div>
                 <div className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                    {currentStep.description}
                 </div>
             </div>
             <div className="flex-1 p-4 relative">
                <VisualizerScreen 
                    type={activeProblem} 
                    stepVariables={stepWithOutput.variables}
                    input={inputData}
                    highlights={stepWithOutput.highlights || []}
                />
             </div>
          </div>

          {/* Controls */}
          <ControlPanel 
            currentStep={currentStepIndex}
            totalSteps={steps.length}
            isPlaying={isPlaying}
            onPlayPause={() => setIsPlaying(!isPlaying)}
            onStepForward={() => setCurrentStepIndex(Math.min(steps.length - 1, currentStepIndex + 1))}
            onStepBackward={() => setCurrentStepIndex(Math.max(0, currentStepIndex - 1))}
            onReset={() => { setIsPlaying(false); setCurrentStepIndex(0); }}
            onSpeedChange={setSpeed}
            speed={speed}
          />
        </div>

        {/* Right Column: Code Trace */}
        <div className="lg:col-span-5 h-[500px] lg:h-auto min-h-[500px]">
          <CodeViewer 
            code={config.codeTemplate} 
            activeLine={currentStep.lineIndex} 
          />
        </div>

      </main>
    </div>
  );
};

export default App;