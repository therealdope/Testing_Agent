"use client";
import { useState } from 'react';

export default function OutputSection({ output, isLoading, createdAt, userId, isHistoryView }) {
  const [openSections, setOpenSections] = useState({});

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-gray-800 rounded-lg">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-blue-400">Generating test results...</p>
      </div>
    );
  }

  const parseContent = (content) => {
    if (!content) return null;
    try {
      return typeof content === 'string' ? JSON.parse(content) : content;
    } catch (e) {
      return content;
    }
  };

  const renderSection = (title, content, sectionKey) => {
    if (!content) return null;
    
    const parsedContent = parseContent(content);
    const displayContent = parsedContent?.data || parsedContent;
    
    return (
      <div className="bg-gray-700 p-4 rounded-lg">
        <button 
          onClick={() => toggleSection(sectionKey)}
          className="flex justify-between items-center w-full text-left text-lg font-semibold text-blue-300 hover:text-blue-400"
        >
          <span>{title}</span>
          <span className={`transform transition-transform ${openSections[sectionKey] ? 'rotate-90' : ''}`}>
            →
          </span>
        </button>
        
        {openSections[sectionKey] && (
          <div className="mt-4 text-gray-300 whitespace-pre-wrap font-mono text-sm">
            {typeof displayContent === 'object' ? JSON.stringify(displayContent, null, 2) : displayContent}
          </div>
        )}
      </div>
    );
  };

  const getContent = (field) => {
    if (!output) return null;
    if (isHistoryView) {
      const parsedOutput = parseContent(output.output);
      return parsedOutput?.data?.[field] || parsedOutput?.[field];
    }
    return output.data?.[field];
  };

  const renderScreenshots = (screenshots) => {
    if (!screenshots) return null;
    
    return (
      <div className="bg-gray-700 p-4 rounded-lg">
        <button 
          onClick={() => toggleSection('screenshots')}
          className="flex justify-between items-center w-full text-left text-lg font-semibold text-blue-300 hover:text-blue-400"
        >
          <span>Screenshots</span>
          <span className={`transform transition-transform ${openSections['screenshots'] ? 'rotate-90' : ''}`}>
            →
          </span>
        </button>
        
        {openSections['screenshots'] && (
          <div className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.isArray(screenshots) ? (
                screenshots.map((screenshot, index) => (
                  <div key={index} className="relative bg-gray-800 rounded-lg p-3">
                    <img 
                      src={`data:image/png;base64,${screenshot.data}`}
                      alt={screenshot.name || `Screenshot ${index + 1}`}
                      className="w-full h-auto object-contain rounded-lg"
                      loading="lazy"
                    />
                    <p className="mt-2 text-sm text-gray-300">
                      {screenshot.name || `Screenshot ${index + 1}`}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-gray-400">No screenshots available</div>
              )}
            </div>
          </div>
        )}
      </div>
    );
};

  // Update the existing render function to include screenshots
  return (
    <div className="space-y-4 bg-gray-800 p-6 rounded-lg">
      {output ? (
        <div className="space-y-4">
          {renderSection('Test Results', getContent('test_file'), 'test_results')}
          {renderSection('Components Analysis', getContent('components'), 'components')}
          {renderSection('Test Logs', getContent('logs'), 'logs')}
          {renderSection('Responsive Testing', getContent('responsive_tests'), 'responsive')}
          {renderScreenshots(getContent("screenshots"))}
        </div>
      ) : (
        <div className="text-center text-gray-400 py-8">
          No test results available yet. Submit a new test to see results here.
        </div>
      )}
    </div>
  );
}