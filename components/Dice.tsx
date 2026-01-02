'use client';

interface DiceProps {
  value: number | null;
  onRoll: () => void;
  disabled: boolean;
  rolling: boolean;
}

export default function Dice({ value, onRoll, disabled, rolling }: DiceProps) {
  const getDiceDots = (num: number) => {
    const dotPatterns: Record<number, number[][]> = {
      1: [[1, 1]],
      2: [[0, 0], [2, 2]],
      3: [[0, 0], [1, 1], [2, 2]],
      4: [[0, 0], [0, 2], [2, 0], [2, 2]],
      5: [[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]],
      6: [[0, 0], [0, 2], [1, 0], [1, 2], [2, 0], [2, 2]],
    };
    return dotPatterns[num] || [];
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className={`w-24 h-24 bg-white border-4 border-gray-800 rounded-xl shadow-lg flex items-center justify-center relative ${
          rolling ? 'animate-bounce' : ''
        }`}
      >
        {value ? (
          <div className="grid grid-cols-3 grid-rows-3 gap-2 w-full h-full p-3">
            {Array.from({ length: 9 }).map((_, idx) => {
              const row = Math.floor(idx / 3);
              const col = idx % 3;
              const shouldShow = getDiceDots(value).some(([r, c]) => r === row && c === col);
              return (
                <div
                  key={idx}
                  className={`rounded-full ${
                    shouldShow ? 'bg-gray-800' : 'bg-transparent'
                  }`}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-4xl font-bold text-gray-400">?</div>
        )}
      </div>
      
      <button
        onClick={onRoll}
        disabled={disabled || rolling}
        className={`px-6 py-3 rounded-lg font-bold text-white transition-all ${
          disabled || rolling
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-700 hover:scale-105'
        }`}
      >
        {rolling ? 'Rolling...' : 'Roll Dice'}
      </button>
    </div>
  );
}
