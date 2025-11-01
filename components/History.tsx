import React from 'react';

interface HistoryProps {
  history: { previewUrl: string }[];
  currentIndex: number;
  onSelect: (index: number) => void;
}

export const History: React.FC<HistoryProps> = ({ history, currentIndex, onSelect }) => {
  return (
    <section className="mt-8 bg-white rounded-xl shadow-lg p-6 border border-slate-200">
      <h2 className="text-xl font-semibold mb-4 text-center text-slate-700">היסטוריית עריכה</h2>
      <div className="flex items-center gap-4 overflow-x-auto pb-4 -mb-4">
        {history.map((item, index) => (
          <div
            key={index}
            onClick={() => onSelect(index)}
            aria-label={`בחר גרסה ${index + 1}`}
            className={`relative rounded-lg cursor-pointer flex-shrink-0 w-28 h-28 overflow-hidden transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-400 ${
              currentIndex === index ? 'ring-4 ring-indigo-500 shadow-md' : 'ring-2 ring-transparent hover:ring-indigo-300'
            }`}
            tabIndex={0}
            onKeyPress={(e) => e.key === 'Enter' && onSelect(index)}
          >
            <img src={item.previewUrl} alt={`גרסה ${index + 1}`} className="w-full h-full object-cover" />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs text-center py-1">
              גרסה {index + 1}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
