import React from 'react';

interface PanelHeaderButtonsProps {
  showTranslations: boolean;
  showTajweedPanel: boolean;
  onToggleTranslations: () => void;
  onToggleTajweed: () => void;
  variant: 'desktop' | 'mobile';
}

const PanelHeaderButtons: React.FC<PanelHeaderButtonsProps> = ({
  showTranslations,
  showTajweedPanel,
  onToggleTranslations,
  onToggleTajweed,
  variant
}) => {
  if (variant === 'desktop') {
    return (
      <div className="hidden md:flex items-center space-x-6">
        <button 
          onClick={() => {
            if (showTranslations) onToggleTranslations();
            onToggleTajweed();
          }} 
          className="font-didot text-lg text-gray-300 hover:text-white transition-colors"
        >
          Tajweed Rules
        </button>
        <button 
          onClick={() => {
            if (showTajweedPanel) onToggleTajweed();
            onToggleTranslations();
          }}
          className="font-didot text-lg text-gray-300 hover:text-white transition-colors"
        >
          {showTranslations ? 'Hide' : 'Show'} Translation
        </button>
      </div>
    );
  }

  // Mobile variant
  return (
    <div className="md:hidden flex items-center space-x-3">
      <button 
        onClick={onToggleTajweed}
        className="text-sm text-gray-300 hover:text-white transition-colors px-2 py-1"
      >
        Tajweed
      </button>
      <button 
        onClick={onToggleTranslations}
        className="text-sm text-gray-300 hover:text-white transition-colors px-2 py-1"
      >
        {showTranslations ? 'Hide' : 'Show'} Translation
      </button>
    </div>
  );
};

export default PanelHeaderButtons;
