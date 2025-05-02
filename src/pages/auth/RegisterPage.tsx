import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, User, Building2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSettings } from "@/context/SettingsContext";

export function RegisterPage() {
  const [activeStep, setActiveStep] = useState(1);
  const [accountType, setAccountType] = useState<"personal" | "company" | null>(
    null
  );
  const { theme } = useSettings();

  const steps = [
    { step: 1, label: "Account Details" },
    { step: 2, label: "Contact Info" },
    { step: 3, label: "Security" },
    { step: 4, label: "Company Details" },
    { step: 5, label: "Review" },
  ];

  const handleNext = () => {
    if (activeStep < steps.length) {
      setActiveStep((prev) => prev + 1);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full">
      {/* Left side - Form */}
      <div
        className={`w-full md:w-1/2 p-6 md:p-12 overflow-y-auto ${
          theme === "dark" ? "bg-gray-900" : "bg-white"
        }`}
      >
        {/* Step Indicator */}
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-10">
            {steps.map((step, index) => (
              <div key={step.step} className="flex flex-col items-center">
                <div
                  className={`relative flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold mb-2 ${
                    activeStep === step.step
                      ? "bg-blue-600 text-white"
                      : activeStep > step.step
                      ? "bg-green-500 text-white"
                      : theme === "dark"
                      ? "bg-gray-800 text-gray-400"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {activeStep > step.step ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    step.step
                  )}
                  {index < steps.length - 1 && (
                    <div
                      className={`absolute left-full w-full h-0.5 -ml-0.5 ${
                        activeStep > step.step
                          ? "bg-green-500"
                          : theme === "dark"
                          ? "bg-gray-700"
                          : "bg-gray-200"
                      }`}
                    ></div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <h2
            className={`text-2xl font-bold mb-6 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Account Details
          </h2>

          {/* Account Type Selection */}
          <div className="mb-6">
            <label
              className={`block text-sm font-medium mb-2 ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Account Type
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div
                className={`cursor-pointer rounded-lg p-4 border transition-all ${
                  accountType === "personal"
                    ? theme === "dark"
                      ? "border-blue-500 bg-blue-900/30"
                      : "border-blue-500 bg-blue-50"
                    : theme === "dark"
                    ? "border-gray-700 hover:border-gray-600 bg-gray-800/30"
                    : "border-gray-200 hover:border-gray-300 bg-gray-50"
                }`}
                onClick={() => setAccountType("personal")}
              >
                <div className="flex flex-col items-center text-center">
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center mb-2 ${
                      accountType === "personal"
                        ? "bg-blue-600 text-white"
                        : theme === "dark"
                        ? "bg-gray-700 text-gray-300"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    <User className="h-5 w-5" />
                  </div>
                  <h3
                    className={`text-sm font-medium ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Personal
                  </h3>
                </div>
              </div>

              <div
                className={`cursor-pointer rounded-lg p-4 border transition-all ${
                  accountType === "company"
                    ? theme === "dark"
                      ? "border-blue-500 bg-blue-900/30"
                      : "border-blue-500 bg-blue-50"
                    : theme === "dark"
                    ? "border-gray-700 hover:border-gray-600 bg-gray-800/30"
                    : "border-gray-200 hover:border-gray-300 bg-gray-50"
                }`}
                onClick={() => setAccountType("company")}
              >
                <div className="flex flex-col items-center text-center">
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center mb-2 ${
                      accountType === "company"
                        ? "bg-blue-600 text-white"
                        : theme === "dark"
                        ? "bg-gray-700 text-gray-300"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    <Building2 className="h-5 w-5" />
                  </div>
                  <h3
                    className={`text-sm font-medium ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Company
                  </h3>
                </div>
              </div>
            </div>
          </div>

          {/* First Name & Last Name */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label
                className={`block text-sm font-medium mb-1 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                First Name
              </label>
              <Input placeholder="First Name" />
            </div>
            <div>
              <label
                className={`block text-sm font-medium mb-1 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Last Name
              </label>
              <Input placeholder="Last Name" />
            </div>
          </div>

          {/* Optional Fields */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label
                className={`block text-sm font-medium mb-1 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                CIN (ID Number) - Optional
              </label>
              <Input placeholder="National ID Number (Optional)" />
            </div>
            <div>
              <label
                className={`block text-sm font-medium mb-1 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Phone Number - Optional
              </label>
              <Input placeholder="Your Phone Number (Optional)" />
            </div>
          </div>

          {/* Next Button */}
          <Button
            onClick={handleNext}
            className="w-full flex items-center justify-center gap-2"
            disabled={!accountType}
          >
            Next
            <ArrowRight className="h-4 w-4" />
          </Button>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
              Already have an account?{" "}
              <Link
                to="/login"
                className={
                  theme === "dark"
                    ? "text-blue-400 hover:text-blue-300 font-medium"
                    : "text-blue-600 hover:text-blue-500 font-medium"
                }
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Info & Progress */}
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
            className="text-center mb-8"
          >
            <h1
              className={`text-4xl font-bold mb-4 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Create Your Account
              <br />
              and Join Our Business Platform
            </h1>
            <p
              className={`text-lg ${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Create your account to access all features and start managing your
              business
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
                <div className="bg-green-500 text-white h-6 w-6 rounded-full flex items-center justify-center">
                  <Check className="h-4 w-4" />
                </div>
              </div>
              <div>
                <h3
                  className={`text-lg font-medium ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  Select Account Type
                </h3>
                <p
                  className={
                    theme === "dark" ? "text-gray-300" : "text-gray-600"
                  }
                >
                  Choose between personal or company account
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
                <div className="bg-blue-500 text-white h-6 w-6 rounded-full flex items-center justify-center">
                  <Check className="h-4 w-4" />
                </div>
              </div>
              <div>
                <h3
                  className={`text-lg font-medium ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  Provide Your Details
                </h3>
                <p
                  className={
                    theme === "dark" ? "text-gray-300" : "text-gray-600"
                  }
                >
                  Enter contact and identification information
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
                <div className="bg-purple-500 text-white h-6 w-6 rounded-full flex items-center justify-center">
                  <Check className="h-4 w-4" />
                </div>
              </div>
              <div>
                <h3
                  className={`text-lg font-medium ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  Complete Profile
                </h3>
                <p
                  className={
                    theme === "dark" ? "text-gray-300" : "text-gray-600"
                  }
                >
                  Fill in all necessary information to get started
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
