"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiUser, FiMail, FiLock } from "react-icons/fi";

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (res.ok) {
      setMessage("Account created! Redirecting to Sign In...");
      setTimeout(() => router.push("/sign-in"), 2000);
    } else {
      setMessage(data.error);
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900 text-gray-200">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 shadow-lg rounded-lg w-96 border border-gray-700"
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-400">Sign Up</h2>

        {/* Username Input */}
        <div className="relative mb-4">
          <FiUser className="absolute left-3 top-3.5 text-gray-400 text-xl" />
          <input
            className="w-full p-3 pl-10 bg-gray-700 text-gray-200 border border-blue-500 rounded focus:outline-none focus:border-blue-300"
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleChange}
            required
          />
        </div>

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
          {loading ? "Loading..." : "Sign Up"}
        </button>

        {message && <p className="mt-3 text-center text-red-400">{message}</p>}

        <p className="mt-4 text-center text-gray-400">
          Already have an account?{" "}
          <a href="/sign-in" className="text-blue-400 hover:underline">
            Sign In
          </a>
        </p>
      </form>
    </div>
  );
}
