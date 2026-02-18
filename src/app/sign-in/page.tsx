"use client";

import React, { useState } from "react";
import Link from "next/link";
import LuxeyLogo from "@/components/LuxeyLogo";

export default function SignInPage() {
    const [mode, setMode] = useState<"signin" | "register" | "forgot">("signin");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [referralCode, setReferralCode] = useState("");

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
            {/* Background bolt */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none">
                <span className="text-[50rem] leading-none">⚡</span>
            </div>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 mb-12 relative z-10">
                <LuxeyLogo size={48} variant="dark" />
                <div className="relative flex items-center h-12">
                    <span className="font-serif text-[2.8rem] tracking-tighter uppercase font-bold leading-none text-white">
                        Luxey
                    </span>
                    <span className="absolute -top-1 -right-4 text-[10px] font-sans font-bold text-white uppercase">
                        ©
                    </span>
                </div>
            </Link>

            {/* Card */}
            <div className="w-full max-w-md bg-white rounded-sm border border-[#E4E4E4] shadow-2xl relative z-10">
                {/* Header */}
                <div className="p-8 pb-0 text-center">
                    <h1 className="font-serif text-3xl uppercase tracking-tight mb-2">
                        {mode === "signin" && "Welcome Back"}
                        {mode === "register" && "Create Account"}
                        {mode === "forgot" && "Reset Password"}
                    </h1>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                        {mode === "signin" && "Sign in to your Luxey account"}
                        {mode === "register" && "Join the fastest precious metals exchange"}
                        {mode === "forgot" && "We'll send you a reset link"}
                    </p>
                </div>

                {/* Form */}
                <div className="p-8 space-y-4">
                    {mode === "register" && (
                        <div>
                            <label className="form-label">Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="John Smith"
                                className="form-input"
                            />
                        </div>
                    )}

                    <div>
                        <label className="form-label">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="form-input"
                        />
                    </div>

                    {mode !== "forgot" && (
                        <div>
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••••"
                                className="form-input"
                            />
                        </div>
                    )}

                    {mode === "register" && (
                        <div>
                            <label className="form-label">
                                Referral Code{" "}
                                <span className="text-gray-300 font-normal">(optional)</span>
                            </label>
                            <input
                                type="text"
                                value={referralCode}
                                onChange={(e) => setReferralCode(e.target.value)}
                                placeholder="FRIEND-CODE"
                                className="form-input"
                            />
                        </div>
                    )}

                    {mode === "signin" && (
                        <div className="flex justify-end">
                            <button
                                onClick={() => setMode("forgot")}
                                className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37] hover:text-black transition-colors"
                            >
                                Forgot Password?
                            </button>
                        </div>
                    )}

                    <button className="w-full bg-black text-white py-4 text-[11px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all mt-2 rounded-sm relative group">
                        <span className="relative z-10">
                            {mode === "signin" && "Sign In"}
                            {mode === "register" && "Create Account"}
                            {mode === "forgot" && "Send Reset Link"}
                        </span>
                        <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#D4AF37] rounded-sm transition-all" />
                    </button>
                </div>

                {/* Footer */}
                <div className="border-t border-[#F5F5F5] p-6 text-center">
                    {mode === "signin" && (
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                            Don&apos;t have an account?{" "}
                            <button
                                onClick={() => setMode("register")}
                                className="text-[#D4AF37] hover:text-black transition-colors font-black"
                            >
                                Create One
                            </button>
                        </p>
                    )}
                    {mode === "register" && (
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                            Already have an account?{" "}
                            <button
                                onClick={() => setMode("signin")}
                                className="text-[#D4AF37] hover:text-black transition-colors font-black"
                            >
                                Sign In
                            </button>
                        </p>
                    )}
                    {mode === "forgot" && (
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                            Remember your password?{" "}
                            <button
                                onClick={() => setMode("signin")}
                                className="text-[#D4AF37] hover:text-black transition-colors font-black"
                            >
                                Sign In
                            </button>
                        </p>
                    )}
                </div>
            </div>

            {/* Sub-footer */}
            <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-600 mt-8 text-center relative z-10">
                By continuing, you agree to the Luxey Terms of Service and Privacy
                Policy
            </p>
        </div>
    );
}
