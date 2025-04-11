
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { User } from 'lucide-react';

interface UsernameFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  localErrors: Record<string, string>;
  validationErrors: Record<string, string>;
}

const UsernameField: React.FC<UsernameFieldProps> = ({
  value,
  onChange,
  localErrors,
  validationErrors
}) => {
  return (
    <div className="space-y-1">
      <Label htmlFor="username">Username</Label>
      <div className="relative">
        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          id="username"
          name="username"
          placeholder="Choose a unique username"
          className={`pl-10 ${
            localErrors.username || validationErrors.username ? 'border-red-500' : ''
          }`}
          value={value}
          onChange={onChange}
        />
      </div>
      {localErrors.username && (
        <p className="text-xs text-red-500">{localErrors.username}</p>
      )}
      {validationErrors.username && (
        <p className="text-xs text-red-500">{validationErrors.username}</p>
      )}
    </div>
  );
};

export default UsernameField;
