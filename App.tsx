import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { PromptInput } from './components/PromptInput';
import { ImageDisplay } from './components/ImageDisplay';
import { Spinner } from './components/Spinner';
import { History } from './components/History';
import { editImageWithPrompt } from './services/geminiService';
import { fileToGenerativePart, base64ToFile } from './utils/fileUtils';
import type { Part } from '@google/genai';

interface ImageHistoryItem {
  file: File;
  previewUrl: string;
}

const App: React.FC = () => {
  const [imageHistory, setImageHistory] = useState<ImageHistoryItem[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [prompt, setPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (file: File | null) => {
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImageHistory([{ file, previewUrl }]);
      setActiveIndex(0);
      setPrompt('');
      setError(null);
    }
  };

  const handleSelectVersion = (index: number) => {
    setActiveIndex(index);
  };

  const handleSubmit = useCallback(async () => {
    if (activeIndex === -1 || !prompt) {
      setError('יש לבחור תמונה ולכתוב הנחיה.');
      return;
    }

    const sourceImage = imageHistory[activeIndex];
    if (!sourceImage) {
        setError('שגיאה: לא נמצאה תמונת מקור.');
        return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const imagePart: Part = await fileToGenerativePart(sourceImage.file);
      const resultBase64 = await editImageWithPrompt(imagePart, prompt);
      
      const newFile = await base64ToFile(
        resultBase64,
        `edit-${Date.now()}.${sourceImage.file.type.split('/')[1] || 'png'}`,
        sourceImage.file.type
      );
      const newPreviewUrl = URL.createObjectURL(newFile);
      const newHistoryItem = { file: newFile, previewUrl: newPreviewUrl };

      const newHistory = [...imageHistory.slice(0, activeIndex + 1), newHistoryItem];

      setImageHistory(newHistory);
      setActiveIndex(newHistory.length - 1);
      setPrompt('');

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'אירעה שגיאה לא צפויה. נסה שוב.');
    } finally {
      setIsLoading(false);
    }
  }, [activeIndex, imageHistory, prompt]);

  const previousImage = activeIndex > 0 ? imageHistory[activeIndex - 1] : null;
  const currentImage = activeIndex > -1 ? imageHistory[activeIndex] : null;

  return (
    <div className="min-h-screen font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col gap-6 border border-slate-200">
            <ImageUploader onImageChange={handleImageChange} preview={imageHistory[0]?.previewUrl} />
            <PromptInput value={prompt} onChange={setPrompt} />
            
            {error && <p className="text-red-500 text-center">{error}</p>}
            
            <button
              onClick={handleSubmit}
              disabled={isLoading || activeIndex === -1 || !prompt}
              className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Spinner />
                  <span>יוצר...</span>
                </>
              ) : (
                'שנה את התמונה'
              )}
            </button>
          </div>

          {/* Output Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
              <ImageDisplay title="תמונה קודמת" imageUrl={previousImage?.previewUrl} placeholderText="זוהי הגרסה הראשונה" />
              <ImageDisplay 
                title="תמונה נוכחית" 
                imageUrl={currentImage?.previewUrl} 
                isLoading={isLoading} 
                placeholderText="התמונה החדשה תופיע כאן..."
              />
            </div>
          </div>
        </div>

        {imageHistory.length > 1 && (
            <History 
                history={imageHistory}
                currentIndex={activeIndex}
                onSelect={handleSelectVersion}
            />
        )}
      </main>
    </div>
  );
};

export default App;
