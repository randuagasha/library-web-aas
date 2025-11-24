"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/authLayout";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple authentication - redirect to home
    router.push("/home");
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
      src="/picture/signin.png"
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
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <div>
              <span className="text-gray-600">Dont have an account? </span>
              <Link
                href="/auth/signup"
                className="text-[#5A7184] hover:underline font-medium"
              >
                Sign Up
              </Link>
            </div>
            <Link
              href="/forgot-password"
              className="text-[#2E2E2E] hover:underline font-medium"
            >
              Forgot Password?
            </Link>
          </div>  

          <button type="submit" className="w-full h-10 rounded-2xl btn-primary bg-[#3A4750]">
            Sign In
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}
