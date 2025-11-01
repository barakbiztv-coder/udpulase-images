
import React from 'react';
import { Spinner } from './Spinner';

interface ImageDisplayProps {
  title: string;
  imageUrl: string | null;
  isLoading?: boolean;
  placeholderText?: string;
}

const Placeholder = ({ text }: { text: string }) => (
    <div className="flex flex-col items-center justify-center h-full text-center text-slate-500">
         <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="text-sm">{text}</p>
    </div>
);

export const ImageDisplay: React.FC<ImageDisplayProps> = ({ title, imageUrl, isLoading = false, placeholderText = "אין תמונה להצגה" }) => {
  return (
    <div className="flex flex-col h-full">
      <h3 className="text-lg font-semibold text-center mb-2 text-slate-600">{title}</h3>
      <div className="flex-grow bg-slate-100 rounded-lg flex items-center justify-center min-h-[250px] md:min-h-0 relative overflow-hidden">
        {isLoading ? (
            <div className="flex flex-col items-center text-indigo-600">
                <Spinner />
                <span className="mt-2">מעבד...</span>
            </div>
        ) : imageUrl ? (
          <img src={imageUrl} alt={title} className="object-contain h-full w-full" />
        ) : (
          <Placeholder text={placeholderText} />
        )}
      </div>
    </div>
  );
};
