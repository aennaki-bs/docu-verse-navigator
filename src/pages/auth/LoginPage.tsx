import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { LogIn, Eye, EyeOff, ShieldCheck, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSettings } from "@/context/SettingsContext";
import { useAuth } from "@/context/AuthContext";

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { theme } = useSettings();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setErrorMessage("Please enter both email and password");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      // This would normally communicate with your auth service
      await login({ emailOrUsername: email, password });
      // Redirect will happen in AuthContext after successful login
    } catch (error) {
      setErrorMessage(
        "Cannot connect to server. Please check your network connection or try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full">
      {/* Left side - Login Form */}
      <div
        className={`w-full md:w-1/2 p-6 md:p-12 flex items-center justify-center ${
          theme === "dark" ? "bg-gray-900" : "bg-white"
        }`}
      >
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-block bg-gradient-to-r from-blue-500 to-blue-600 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
              D
            </div>
            <h1
              className={`text-3xl font-bold ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              DocuVerse
            </h1>
            <p
              className={`mt-2 ${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Sign in to your account
            </p>
          </div>

          {errorMessage && (
            <div
              className={`mb-6 p-4 rounded-lg text-sm ${
                theme === "dark"
                  ? "bg-red-900/30 border border-red-800 text-red-200"
                  : "bg-red-50 border border-red-200 text-red-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`h-6 w-6 rounded-full flex items-center justify-center ${
                    theme === "dark" ? "bg-red-800" : "bg-red-100"
                  }`}
                >
                  <ShieldCheck
                    className={`h-4 w-4 ${
                      theme === "dark" ? "text-red-200" : "text-red-600"
                    }`}
                  />
                </div>
                <p>{errorMessage}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="space-y-6">
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Email or username
                </label>
                <div className="relative">
                  <div
                    className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    <Mail className="h-4 w-4" />
                  </div>
                  <Input
                    type="text"
                    placeholder="Enter your email or username"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label
                    className={`block text-sm font-medium ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className={`text-sm ${
                      theme === "dark"
                        ? "text-blue-400 hover:text-blue-300"
                        : "text-blue-600 hover:text-blue-500"
                    }`}
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <div
                    className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    <Lock className="h-4 w-4" />
                  </div>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full flex items-center justify-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    Sign In
                    <LogIn className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
              Don't have an account?{" "}
              <Link
                to="/register"
                className={
                  theme === "dark"
                    ? "text-blue-400 hover:text-blue-300 font-medium"
                    : "text-blue-600 hover:text-blue-500 font-medium"
                }
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Info & Features */}
      <div
        className={`hidden md:flex md:w-1/2 relative items-center justify-center ${
          theme === "dark" ? "bg-gray-950" : "bg-blue-50"
        }`}
      >
        <div className="p-12 max-w-lg z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1
              className={`text-4xl font-bold mb-4 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Welcome to Business
              <br />
              Management Platform
            </h1>
            <p
              className={`text-lg ${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Streamline your business operations with our comprehensive
              management solution
            </p>
          </motion.div>

          {/* Features */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className={`flex items-start gap-3 rounded-lg p-4 ${
                theme === "dark" ? "bg-gray-800/50" : "bg-white"
              }`}
            >
              <div className="mt-1 flex-shrink-0">
                <div className="bg-blue-500 text-white h-10 w-10 rounded-full flex items-center justify-center">
                  <ShieldCheck className="h-5 w-5" />
                </div>
              </div>
              <div>
                <h3
                  className={`text-lg font-medium ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  Secure Authentication
                </h3>
                <p
                  className={
                    theme === "dark" ? "text-gray-300" : "text-gray-600"
                  }
                >
                  Enterprise-grade security for your data
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={`flex items-start gap-3 rounded-lg p-4 ${
                theme === "dark" ? "bg-gray-800/50" : "bg-white"
              }`}
            >
              <div className="mt-1 flex-shrink-0">
                <div className="bg-purple-500 text-white h-10 w-10 rounded-full flex items-center justify-center">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
              </div>
              <div>
                <h3
                  className={`text-lg font-medium ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  Powerful Dashboard
                </h3>
                <p
                  className={
                    theme === "dark" ? "text-gray-300" : "text-gray-600"
                  }
                >
                  Manage documents and workflows efficiently
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className={`flex items-start gap-3 rounded-lg p-4 ${
                theme === "dark" ? "bg-gray-800/50" : "bg-white"
              }`}
            >
              <div className="mt-1 flex-shrink-0">
                <div className="bg-green-500 text-white h-10 w-10 rounded-full flex items-center justify-center">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                    />
                  </svg>
                </div>
              </div>
              <div>
                <h3
                  className={`text-lg font-medium ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  Advanced Workflows
                </h3>
                <p
                  className={
                    theme === "dark" ? "text-gray-300" : "text-gray-600"
                  }
                >
                  Create custom document workflows and circuits
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
