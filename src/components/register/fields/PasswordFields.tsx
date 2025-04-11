
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, Lock } from 'lucide-react';
import PasswordStrengthIndicator from '../password/PasswordStrengthIndicator';

interface PasswordFieldsProps {
  password: string;
  confirmPassword: string;
  passwordStrength: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  localErrors: Record<string, string>;
}

const PasswordFields: React.FC<PasswordFieldsProps> = ({
  password,
  confirmPassword,
  passwordStrength,
  onChange,
  localErrors
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <div className="space-y-1">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            className={`pl-10 ${localErrors.password ? 'border-red-500' : ''}`}
            value={password}
            onChange={onChange}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {localErrors.password && (
          <p className="text-sm text-red-500">{localErrors.password}</p>
        )}
        
        {/* Password strength indicator */}
        {password && (
          <PasswordStrengthIndicator password={password} passwordStrength={passwordStrength} />
        )}
      </div>
      
      <div className="space-y-1">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            className={`pl-10 ${localErrors.confirmPassword ? 'border-red-500' : ''}`}
            value={confirmPassword}
            onChange={onChange}
          />
        </div>
        {localErrors.confirmPassword && (
          <p className="text-sm text-red-500">{localErrors.confirmPassword}</p>
        )}
      </div>
    </>
  );
};

export default PasswordFields;
