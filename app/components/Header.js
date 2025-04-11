"use client";
import { useState, useEffect, useRef } from "react";
import Image from 'next/image';

export default function Header({ user, handleLogout }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [imageError, setImageError] = useState(false);
  const dropdownRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      window.location.reload();
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const profileImageSrc = user?.profileImage && !imageError 
    ? user.profileImage 
    : '/default-avatar.png';

  return (
    <header className="bg-gray-900 shadow-md p-4 flex justify-between items-center fixed top-0 left-0 w-full z-50 border-b border-gray-200/20">
      <h1 className="text-2xl font-bold space-x-0.5 text-white ml-3">Website | Figma - Tester</h1>

      <div className="relative flex items-center gap-4">
        <span className="text-gray-300 px-3 py-1 rounded-lg bg-gray-800">{user?.username}</span>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
          accept="image/*"
        />
        <button onClick={() => setShowDropdown(!showDropdown)} className="focus:outline-none mr-6">
          <div className="w-11 h-11 relative overflow-hidden rounded-full border-2 border-gray-300">
            <Image
              src={profileImageSrc}
              alt="User Avatar"
              width={44}
              height={44}
              className="object-cover"
              onError={handleImageError}
              priority
            />
          </div>
        </button>

        {showDropdown && (
          <div className="absolute right-0 top-full mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
            <div className="px-4 py-2 text-gray-300 border-b border-gray-700">
              {user?.username || "Guest"}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700"
            >
              Edit Image
            </button>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-red-400 hover:bg-gray-700 rounded-b-lg"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
