
import React from 'react';

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const PromptInput: React.FC<PromptInputProps> = ({ value, onChange }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2 text-slate-700">2. תאר את השינוי</h2>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="לדוגמה: הוסף כובע ליצן על הראש שלו, שנה את הרקע לחוף ים, הפוך את התמונה לשחור לבן..."
        rows={4}
        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
      />
    </div>
  );
};
