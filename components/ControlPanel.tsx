import React from 'react';
import { Play, Pause, SkipBack, SkipForward, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';

interface ControlPanelProps {
  currentStep: number;
  totalSteps: number;
  isPlaying: boolean;
  onPlayPause: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
  speed: number;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  currentStep,
  totalSteps,
  isPlaying,
  onPlayPause,
  onStepForward,
  onStepBackward,
  onReset,
  onSpeedChange,
  speed,
}) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-md border-b-4 border-blue-200 flex flex-col md:flex-row items-center justify-between gap-4">
      
      {/* Progress Bar */}
      <div className="flex-1 w-full md:w-auto flex flex-col gap-1">
        <div className="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-wide">
          <span>步骤 {currentStep + 1}</span>
          <span>总计: {totalSteps}</span>
        </div>
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 transition-all duration-300 ease-out"
            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-2">
        <button 
          onClick={onReset}
          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          title="重置"
        >
          <RefreshCw size={20} />
        </button>
        
        <div className="flex items-center bg-gray-100 rounded-lg p-1">
          <button 
            onClick={onStepBackward}
            disabled={currentStep === 0}
            className="p-2 disabled:opacity-30 hover:bg-white hover:shadow-sm rounded-md transition-all text-blue-600"
            title="上一步"
          >
            <ChevronLeft size={24} />
          </button>
          
          <button 
            onClick={onPlayPause}
            className={`mx-1 p-3 rounded-md shadow-sm text-white transition-all ${isPlaying ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-500 hover:bg-green-600'}`}
            title={isPlaying ? "暂停" : "播放"}
          >
            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
          </button>

          <button 
            onClick={onStepForward}
            disabled={currentStep >= totalSteps - 1}
            className="p-2 disabled:opacity-30 hover:bg-white hover:shadow-sm rounded-md transition-all text-blue-600"
            title="下一步"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      {/* Speed Control */}
      <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
        <span className="text-xs font-bold text-gray-400 uppercase">速度</span>
        <select 
          value={speed} 
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          className="bg-transparent text-sm font-semibold text-gray-700 focus:outline-none cursor-pointer"
        >
          <option value={1000}>慢速</option>
          <option value={500}>正常</option>
          <option value={100}>快速</option>
        </select>
      </div>
    </div>
  );
};