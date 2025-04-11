"use client";
import { useState, useEffect } from "react";
import InputSection from "./InputSection";
import OutputSection from "./OutputSection";

export default function MainContent({ selectedSubmission, onClearSelection, userId }) {
  const [output, setOutput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSubmission, setCurrentSubmission] = useState(null);

  useEffect(() => {
    if (selectedSubmission) {
      setOutput(selectedSubmission);
      setCurrentSubmission(selectedSubmission);
    } else {
      setOutput(null);
      setCurrentSubmission(null);
    }
  }, [selectedSubmission]);

  const saveToDatabase = async (outputData, submissionData) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await fetch(`/api/submissions/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          websiteUrl: submissionData.Url,
          figmaId: submissionData.figmaId,
          output: JSON.stringify(outputData)
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save submission');
      }

      return await response.json();
    } catch (error) {
      console.error('Error saving to database:', error);
      throw error;
    }
};

const handleSubmit = async (submission) => {
    try {
      setIsLoading(true);
      setCurrentSubmission(null);

      const res = await fetch(process.env.NEXT_PUBLIC_FLASK_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        mode: "cors",
        credentials: "same-origin",
        body: JSON.stringify({
          websiteurl: submission.Url,
          figmaid: submission.figmaId
        }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || `Server error: ${res.status}`);
      }

      // Save to database and get the saved submission
      const savedData = await saveToDatabase(data, submission);
      
      // Update the output state with the saved submission
      setOutput(savedData.submission);
      setCurrentSubmission(savedData.submission);

    } catch (error) {
      const errorMessage = `Error: ${error.message}\n\nPlease ensure:\n1. The URL is valid and accessible\n2. The Figma ID is correct\n3. The Flask server is running`;
      setOutput({ error: errorMessage });
    } finally {
      setIsLoading(false);
    }
};

  return (
    <div className="p-6">
      <InputSection onSubmit={handleSubmit} />
      <div className="mt-6">
        <OutputSection 
          output={output}
          isLoading={isLoading}
          createdAt={currentSubmission?.createdAt}
          userId={userId}
          isHistoryView={!!selectedSubmission}
        />
      </div>
    </div>
  );
}
