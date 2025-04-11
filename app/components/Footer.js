"use client";
export default function Footer() {
  return (
    <footer className="bg-gray-900 shadow p-4 text-center border-t border-gray-200/20">
      <p className="text-gray-200/40">
        © {new Date().getFullYear()} Hackathon Platform. All rights reserved.
      </p>
    </footer>
  );
}
