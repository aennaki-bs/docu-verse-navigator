
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Mail } from 'lucide-react';

interface EmailFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  localErrors: Record<string, string>;
  validationErrors: Record<string, string>;
}

const EmailField: React.FC<EmailFieldProps> = ({
  value,
  onChange,
  localErrors,
  validationErrors
}) => {
  return (
    <div className="space-y-1">
      <Label htmlFor="email">Email</Label>
      <div className="relative">
        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="name@example.com"
          className={`pl-10 ${
            localErrors.email || validationErrors.email ? 'border-red-500' : ''
          }`}
          value={value}
          onChange={onChange}
        />
      </div>
      {localErrors.email && (
        <p className="text-xs text-red-500">{localErrors.email}</p>
      )}
      {validationErrors.email && (
        <p className="text-xs text-red-500">{validationErrors.email}</p>
      )}
    </div>
  );
};

export default EmailField;
