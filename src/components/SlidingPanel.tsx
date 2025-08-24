import React from 'react';

interface SlidingPanelProps {
  isOpen: boolean;
  onClose?: () => void;
  title: string;
  children: React.ReactNode;
  variant: 'desktop' | 'mobile';
  type: 'translations' | 'tajweed';
}

const SlidingPanel: React.FC<SlidingPanelProps> = ({
  isOpen,
  onClose,
  title,
  children,
  variant,
  type
}) => {
  if (variant === 'desktop') {
    return (
      <aside className={`absolute top-0 right-0 h-full w-1/2 lg:w-1/3 bg-white dark:bg-gray-800 shadow-lg p-6 overflow-y-auto transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0 z-30' : 'translate-x-full z-20'} hidden md:block`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{title}</h2>
          {onClose && (
            <button 
              onClick={onClose}
              className="md:hidden text-gray-500 hover:text-gray-800 text-2xl"
            >
              ×
            </button>
          )}
        </div>
        {children}
      </aside>
    );
  }

  // Mobile variant
  const transformClass = type === 'translations' 
    ? `${isOpen ? 'translate-y-0 z-40' : 'translate-y-full z-30'}`
    : `${isOpen ? 'translate-y-0 z-40' : 'translate-y-full z-30'}`;

  return (
    <aside className={`absolute bottom-0 left-0 right-0 h-3/4 bg-white dark:bg-gray-800 shadow-lg p-6 overflow-y-auto transform transition-transform duration-300 ease-in-out ${transformClass} md:hidden`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        {onClose && (
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-2xl"
          >
            ×
          </button>
        )}
      </div>
      {children}
    </aside>
  );
};

export default SlidingPanel;
