"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/authLayout";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
        setIsLoading(false);
        return;
      }

      // Get session to check role
      const response = await fetch("/api/auth/session");
      const session = await response.json();

      // Redirect based on role
      if (session?.user?.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/home");
      }
    } catch (error) {
      console.error("Login error:", error);
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
      />
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

          <div className="text-sm">
            <span className="text-gray-600">Dont have an account? </span>
            <Link
              href="/auth/signup"
              className="text-[#5A7184] hover:underline font-medium"
            >
              Sign Up
            </Link>
          </div>

          <button
            type="submit"
            className="w-full h-10 rounded-2xl btn-primary bg-[#3A4750] text-white hover:bg-[#2d373e] disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}
