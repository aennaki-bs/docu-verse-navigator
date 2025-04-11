
import React from 'react';

interface PasswordStrengthIndicatorProps {
  password: string;
  passwordStrength: number;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ 
  password, 
  passwordStrength 
}) => {
  const getStrengthLabel = () => {
    if (passwordStrength === 0) return '';
    if (passwordStrength <= 2) return 'Weak';
    if (passwordStrength <= 4) return 'Medium';
    return 'Strong';
  };

  const getStrengthColor = () => {
    if (passwordStrength === 0) return 'bg-gray-200';
    if (passwordStrength <= 2) return 'bg-red-500';
    if (passwordStrength <= 4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="mt-2">
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className={`h-2.5 rounded-full transition-all ${getStrengthColor()}`}
          style={{ width: `${passwordStrength * 20}%` }}
        ></div>
      </div>
      <p className="text-xs mt-1">
        Strength: <span className="font-medium">{getStrengthLabel()}</span>
        {passwordStrength < 5 && (
          <span className="text-red-500 ml-1">
            (Must be Strong to continue)
          </span>
        )}
      </p>
      {passwordStrength < 5 && password && (
        <ul className="text-xs mt-1 text-gray-600 list-disc pl-4">
          <li className={password.length >= 8 ? "text-green-500" : ""}>At least 8 characters</li>
          <li className={/[A-Z]/.test(password) ? "text-green-500" : ""}>At least one uppercase letter</li>
          <li className={/[a-z]/.test(password) ? "text-green-500" : ""}>At least one lowercase letter</li>
          <li className={/[0-9]/.test(password) ? "text-green-500" : ""}>At least one number</li>
          <li className={/[^A-Za-z0-9]/.test(password) ? "text-green-500" : ""}>At least one special character</li>
        </ul>
      )}
    </div>
  );
};

export default PasswordStrengthIndicator;
