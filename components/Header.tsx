import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 shadow-md text-center">
      <h1 className="text-3xl md:text-4xl font-bold">ADPULSE עריכת תמונות</h1>
      <p className="mt-2 text-lg opacity-90">העלו תמונה ותנו ל-AI לערוך אותה עבורכם</p>
    </header>
  );
};