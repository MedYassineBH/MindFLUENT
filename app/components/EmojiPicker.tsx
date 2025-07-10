'use client';

import { useState, useRef, useEffect } from 'react';
import { Smile } from 'lucide-react';

const COMMON_EMOJIS = ['👍', '❤️', '😊', '😂', '🎉', '👏', '🤔', '😮'];

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
}

export default function EmojiPicker({ onSelect }: EmojiPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={pickerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
      >
        <Smile size={16} />
      </button>
      
      {isOpen && (
        <div className="absolute bottom-full mb-2 bg-white shadow-lg rounded-lg p-2 grid grid-cols-4 gap-1">
          {COMMON_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => {
                onSelect(emoji);
                setIsOpen(false);
              }}
              className="p-2 hover:bg-gray-100 rounded"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 