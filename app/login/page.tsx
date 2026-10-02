"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Mail,
  Lock,
  AlertCircle,
  Loader2,
  Truck,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

// Demo user accounts mapping for prototype testing
const DEMO_ACCOUNTS = [
  {
    role: "Dispatch Manager",
    email: "dispatch@vectologistics.in",
    targetRoute: "/",
  },
  {
    role: "Driver Mobile App",
    email: "driver.rajesh@vectologistics.in",
    targetRoute: "/driver",
  },
  {
    role: "Internal Audit Desk",
    email: "audit.lead@vectologistics.in",
    targetRoute: "/audit",
  },
  {
    role: "Accounts & Billing",
    email: "billing.finance@vectologistics.in",
    targetRoute: "/accounts",
  },
  {
    role: "Client AP Portal",
    email: "ap.payments@metro-wholesale.in",
    targetRoute: "/client-portal",
  },
];

export default function LoginPage() {
  const router = useRouter();

  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Status & Error States (Ready for API / MSW Integration)
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form Submission Handler
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Basic client validation
    if (!email || !password) {
      setErrorMessage("Please enter both email address and password.");
      return;
    }

    setIsLoading(true);

    // Simulated network API authentication latency (800ms)
    setTimeout(() => {
      // Intentional failure test case
      if (password === "error" || email === "locked@test.com") {
        setIsLoading(false);
        setErrorMessage("Account temporarily locked after 5 failed attempts. Please contact IT Security.");
        return;
      }

      if (password.length < 6) {
        setIsLoading(false);
        setErrorMessage("Invalid credentials. The password entered does not match our records.");
        return;
      }

      // Set mock authentication cookie for Next.js Route Guard Middleware
      document.cookie = "vecto_access_token=vecto_mock_jwt_session_token_2026; path=/; max-age=86400; SameSite=Lax";

      // Successful simulated login
      setSuccessMessage("Authentication verified. Redirecting to workspace...");
      
      // Determine destination route based on email context or return to /dispatch
      let destination = "/dispatch";
      const normalizedEmail = email.toLowerCase();
      if (normalizedEmail.includes("driver")) {
        destination = "/driver";
      } else if (normalizedEmail.includes("audit")) {
        destination = "/audit";
      } else if (normalizedEmail.includes("billing") || normalizedEmail.includes("account")) {
        destination = "/accounts";
      } else if (normalizedEmail.includes("metro") || normalizedEmail.includes("client") || normalizedEmail.includes("ap.")) {
        destination = "/client-portal";
      } else if (normalizedEmail.includes("admin")) {
        destination = "/admin";
      }

      setTimeout(() => {
        router.push(destination);
      }, 500);
    }, 850);
  };

  // Quick preset helper for evaluator convenience
  const handleSelectPreset = (presetEmail: string) => {
    setEmail(presetEmail);
    setPassword("Enterprise@2026");
    setErrorMessage(null);
  };

  const handleSimulateLockout = () => {
    setEmail("locked@test.com");
    setPassword("error");
    setErrorMessage("Account temporarily locked after 5 failed attempts. Please contact IT Security.");
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col justify-center items-center p-4 sm:p-6 antialiased font-sans text-slate-800 select-none">
      {/* Centered Login Card */}
      <Card className="w-full max-w-[420px] bg-white border border-slate-200 rounded-md shadow-sm overflow-hidden">
        
        {/* Branding Header inside Card */}
        <CardHeader className="p-6 pb-4 text-center border-b border-slate-100 bg-white">
          <div className="mx-auto h-11 w-11 rounded-md bg-slate-900 flex items-center justify-center text-white mb-3 shadow-xs">
            <Truck className="h-6 w-6" />
          </div>

          <CardTitle className="text-xl font-bold tracking-tight text-slate-900 uppercase">
            VECTO LOGISTICS
          </CardTitle>
          <CardDescription className="text-xs text-slate-500 font-medium tracking-wide mt-1">
            POD-to-Cash Settlement Engine
          </CardDescription>

          <div className="mt-2.5 inline-flex items-center justify-center space-x-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-[10px] font-mono text-slate-600 font-medium border border-slate-200">
            <ShieldCheck className="h-3 w-3 text-blue-800" />
            <span>Enterprise Gateway • SSO Ready</span>
          </div>
        </CardHeader>

        {/* Form Content */}
        <CardContent className="p-6 pt-5 space-y-4">
          
          {/* Conditional Error Alert */}
          {errorMessage && (
            <Alert variant="destructive" className="border-red-200 bg-red-50 text-red-900 animate-in fade-in-50 duration-150">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertTitle className="text-xs font-bold text-red-900">
                Authentication Error
              </AlertTitle>
              <AlertDescription className="text-xs text-red-800">
                {errorMessage}
              </AlertDescription>
            </Alert>
          )}

          {/* Conditional Success Alert */}
          {successMessage && (
            <Alert className="border-emerald-200 bg-emerald-50 text-emerald-900 animate-in fade-in-50 duration-150">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <AlertTitle className="text-xs font-bold text-emerald-900">
                Access Granted
              </AlertTitle>
              <AlertDescription className="text-xs text-emerald-800">
                {successMessage}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSignIn} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold text-slate-700">
                Corporate Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@vectologistics.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                  className="pl-9 h-10 text-xs text-slate-900 placeholder:text-slate-400 border-slate-200 bg-white focus-visible:ring-1 focus-visible:ring-slate-950"
                />
              </div>
            </div>

            {/* Password Field & Forgot Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-semibold text-slate-700">
                  Password
                </Label>
                <button
                  type="button"
                  onClick={() => alert("Password reset link dispatched to authorized enterprise email.")}
                  className="text-[11px] font-medium text-slate-500 hover:text-slate-900 underline-offset-4 hover:underline transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                  className="pl-9 pr-9 h-10 text-xs text-slate-900 placeholder:text-slate-400 border-slate-200 bg-white focus-visible:ring-1 focus-visible:ring-slate-950 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button (Corporate Navy: bg-blue-800) */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 text-xs font-semibold bg-blue-800 hover:bg-blue-900 text-white rounded-md shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:pointer-events-none cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </Button>
          </form>

          {/* Preset Roles Testing Strip (Quick Demo Helper for Evaluators) */}
          <div className="pt-2 border-t border-slate-100">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1.5">
              Quick Role Presets (Click to autofill)
            </span>
            <div className="grid grid-cols-2 gap-1.5 text-[11px]">
              {DEMO_ACCOUNTS.slice(0, 4).map((acc) => (
                <button
                  key={acc.role}
                  type="button"
                  onClick={() => handleSelectPreset(acc.email)}
                  className="text-left px-2 py-1 rounded bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-950 truncate transition-colors"
                >
                  <span className="font-semibold block truncate">{acc.role}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[11px]">
              <button
                type="button"
                onClick={() => handleSelectPreset(DEMO_ACCOUNTS[4].email)}
                className="text-slate-600 hover:text-blue-800 font-medium underline"
              >
                Autofill Client AP Portal
              </button>
              <button
                type="button"
                onClick={handleSimulateLockout}
                className="text-red-600 hover:text-red-700 font-medium underline"
              >
                Simulate Lockout
              </button>
            </div>
          </div>
        </CardContent>

        {/* Card Footer: Enterprise Security Notice */}
        <CardFooter className="px-6 py-3 bg-slate-50 border-t border-slate-100 text-center flex flex-col justify-center items-center text-[11px] text-slate-500">
          <p>Restricted to authorized enterprise logistics stakeholders.</p>
          <p className="font-mono text-[10px] text-slate-400 mt-0.5">
            ISO-27001 Certified • TLS 1.3 End-to-End Encrypted
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
