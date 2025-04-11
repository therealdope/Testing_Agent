"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiMail, FiLock } from "react-icons/fi";
import Link from 'next/link';

export default function SignInPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("authToken");
    if (token) {
      router.push("/dashboard");
    }
  }, [router]); // Add router to dependency array

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("authToken", data.token);
        router.push("/dashboard");
      } else {
        setMessage(data.error || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage("An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900 text-gray-200">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 shadow-lg rounded-lg w-96 border border-gray-700"
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-400">Sign In</h2>

        {/* Email Input */}
        <div className="relative mb-4">
          <FiMail className="absolute left-3 top-3.5 text-gray-400 text-xl" />
          <input
            className="w-full p-3 pl-10 bg-gray-700 text-gray-200 border border-blue-500 rounded focus:outline-none focus:border-blue-300"
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />
        </div>

        {/* Password Input */}
        <div className="relative mb-4">
          <FiLock className="absolute left-3 top-3.5 text-gray-400 text-xl" />
          <input
            className="w-full p-3 pl-10 bg-gray-700 text-gray-200 border border-blue-500 rounded focus:outline-none focus:border-blue-300"
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          {loading ? "Loading..." : "Sign In"}
        </button>

        {message && <p className="mt-3 text-center text-red-400">{message}</p>}

        <p className="mt-4 text-center text-gray-400">
          Don&apos;t have an account?&nbsp;
          <Link href="/sign-up" className="text-blue-400 hover:underline">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
}
