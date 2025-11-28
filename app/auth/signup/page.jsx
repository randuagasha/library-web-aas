"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/authLayout";
import Image from "next/image";

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nama: formData.fullName,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Registration failed");
        setIsLoading(false);
        return;
      }

      // Registration successful, redirect to login
      router.push("/auth/login?registered=true");
    } catch (error) {
      console.error("Registration error:", error);
      setError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const illustration = (
    <div className="w-full max-w-md">
      <Image
        src="/picture/signup.png"
        alt="illustration"
        width={400}
        height={400}
        className="object-contain"
      ></Image>
    </div>
  );

  return (
    <AuthLayout illustration={illustration}>
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-serif font-bold text-[#2E2E2E] mb-8">
          Welcome to Starbhak Library
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-[#2E2E2E] mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              placeholder="Enter Your Name"
              value={formData.fullName}
              onChange={handleChange}
              className="input-field text-[#2E2E2E] bg-[#FAF6F0] w-full h-10 rounded-md px-3 text-xs"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2E2E2E] mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter Your Email"
              value={formData.email}
              onChange={handleChange}
              className="input-field text-[#2E2E2E] bg-[#FAF6F0] w-full h-10 rounded-md px-3 text-xs"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2E2E2E] mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter Your Password"
              value={formData.password}
              onChange={handleChange}
              className="input-field text-[#2E2E2E] bg-[#FAF6F0] w-full h-10 rounded-md px-3 text-xs"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2E2E2E] mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Your Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="input-field text-[#2E2E2E] bg-[#FAF6F0] w-full h-10 rounded-md px-3 text-xs"
              required
              disabled={isLoading}
            />
          </div>

          <div className="text-sm">
            <span className="text-gray-600">Already have an account? </span>
            <Link href="/auth/login" className="text-[#5A7184] hover:underline font-medium">
              Sign In
            </Link>
          </div>

          <button
            type="submit"
            className="w-full h-10 rounded-2xl btn-primary bg-[#3A4750] text-white hover:bg-[#2d373e] disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}
