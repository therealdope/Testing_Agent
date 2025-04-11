"use client";
import { useState, useEffect } from 'react';
import { FiMenu, FiClock, FiChevronRight } from 'react-icons/fi';

export default function SideHistory({ userId, onSelectSubmission, isCollapsed, onCollapse }) {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        console.log('Fetching submissions for userId:', userId);
        const response = await fetch(`/api/submissions/${userId}`);
        const data = await response.json();
        console.log('Raw API response:', data);

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch submissions');
        }

        if (data.submissions && Array.isArray(data.submissions)) {
          // Parse the stringified output back to object
          const processedSubmissions = data.submissions.map(sub => ({
            ...sub,
            output: sub.output ? JSON.parse(sub.output) : null
          }));
          console.log('Processed submissions:', processedSubmissions);
          setSubmissions(processedSubmissions);
          setError(null);
        } else {
          throw new Error('Invalid data format received');
        }
      } catch (error) {
        console.error('Error fetching submissions:', error);
        setError(error.message);
        setSubmissions([]);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchSubmissions();
    }
  }, [userId]);

  if (error) {
    return (
      <div className="w-72 bg-gray-800 h-screen p-6">
        <div className="text-red-400 text-center py-4">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-900">
      <div className="flex-shrink-0 sticky top-0 bg-gray-900 px-4 py-5 mt-2 z-10">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <h2 className="text-xl font-semibold text-blue-300">History</h2>
          )}
          <button 
            onClick={() => onCollapse(!isCollapsed)}
            className="p-0 hover:bg-gray-700 rounded-lg transition-colors ml-auto"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <FiMenu className={`text-blue-300 ${isCollapsed ? 'text-3xl' : 'text-3xl'}`} />
          </button>

        </div>
      </div>

      <div className={`flex-1 overflow-y-auto border-t border-gray-100/5 ${isCollapsed ? 'px-2' : 'px-4'} py-4`}>
        {loading ? (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-300"></div>
            </div>
          ) : submissions.length === 0 ? (
            <div className="text-gray-400 text-center py-4">
              {!isCollapsed && 'No submissions yet'}
            </div>
          ) : (
            <div className="space-y-4">
              {submissions.map((submission) => (
                <button
                  key={submission._id}
                  onClick={() => onSelectSubmission(submission)}
                  className={`w-full text-left rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors duration-200 group
                    ${isCollapsed ? 'p-3' : 'p-4'}`}
                >
                  {isCollapsed ? (
                    <div className="flex justify-center">
                      <FiClock className="text-blue-300 text-2xl" />
                    </div>
                  ) : (
                    <div className="flex items-center justify-between space-x-3">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-blue-300 mb-2">
                          {new Date(submission.createdAt).toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-400 truncate mb-2">
                          {submission.websiteUrl || 'No URL provided'}
                        </div>
                        <div className="text-xs text-gray-500">
                          Status: {submission.output?.message === "Success" ? 'Completed' : 'Processing'}
                        </div>
                      </div>
                      <FiChevronRight className="text-gray-400 group-hover:text-blue-300 transition-colors text-lg" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
  );
}
