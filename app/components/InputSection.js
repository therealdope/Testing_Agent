"use client";
import { useState } from "react";

export default function InputSection({ onSubmit }) {
  const [submission, setSubmission] = useState({ Url: "", figmaId: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(submission);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 rounded-lg shadow-lg bg-gray-800">
      <div className="grid grid-cols-2 gap-6">
        {/* URL Input */}
        <div className="flex flex-col">
          <label className="text-lg font-semibold text-blue-300 mb-1">
            Enter Website URL
          </label>
          <input
            type="url"
            className="w-full p-3 bg-gray-700 text-gray-200 border-2 border-blue-500 rounded focus:outline-none focus:border-blue-300"
            placeholder="Enter Website URL"
            value={submission.Url}
            onChange={(e) =>
              setSubmission({ ...submission, Url: e.target.value })
            }
            required
          />
        </div>

        {/* Figma File ID Input */}
        <div className="flex flex-col">
          <label className="text-lg font-semibold text-blue-300 mb-1">
            Figma File ID
          </label>
          <input
            type="text"
            className="w-full p-2 bg-gray-700 text-gray-200 border-2 border-blue-500 rounded focus:outline-none focus:border-blue-300"
            placeholder="Enter Figma File ID"
            value={submission.figmaId}
            onChange={(e) =>
              setSubmission({ ...submission, figmaId: e.target.value })
            }
            required
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
      >
        Submit
      </button>
    </form>
  );
}
