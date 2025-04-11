
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, CreditCard, MapPin, Phone } from 'lucide-react';

interface PersonalUserFieldsProps {
  formData: {
    firstName: string;
    lastName: string;
    cin?: string;
    personalAddress?: string;
    personalPhone?: string;
  };
  localErrors: Record<string, string>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PersonalUserFields: React.FC<PersonalUserFieldsProps> = ({
  formData,
  localErrors,
  handleChange
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* First Name */}
      <div className="space-y-1">
        <Label htmlFor="firstName">First Name</Label>
        <div className="relative">
          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="firstName"
            name="firstName"
            placeholder="First Name"
            className={`pl-10 ${localErrors.firstName ? 'border-red-500' : ''}`}
            value={formData.firstName}
            onChange={handleChange}
          />
        </div>
        {localErrors.firstName && (
          <p className="text-xs text-red-500">{localErrors.firstName}</p>
        )}
      </div>
      
      {/* Last Name */}
      <div className="space-y-1">
        <Label htmlFor="lastName">Last Name</Label>
        <div className="relative">
          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="lastName"
            name="lastName"
            placeholder="Last Name"
            className={`pl-10 ${localErrors.lastName ? 'border-red-500' : ''}`}
            value={formData.lastName}
            onChange={handleChange}
          />
        </div>
        {localErrors.lastName && (
          <p className="text-xs text-red-500">{localErrors.lastName}</p>
        )}
      </div>
      
      {/* CIN */}
      <div className="space-y-1">
        <Label htmlFor="cin">CIN (ID Number)</Label>
        <div className="relative">
          <CreditCard className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="cin"
            name="cin"
            placeholder="National ID Number"
            className={`pl-10 ${localErrors.cin ? 'border-red-500' : ''}`}
            value={formData.cin || ''}
            onChange={handleChange}
          />
        </div>
        {localErrors.cin && (
          <p className="text-xs text-red-500">{localErrors.cin}</p>
        )}
      </div>
      
      {/* Phone Number */}
      <div className="space-y-1">
        <Label htmlFor="personalPhone">Phone Number</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="personalPhone"
            name="personalPhone"
            placeholder="Your Phone Number"
            className={`pl-10 ${localErrors.personalPhone ? 'border-red-500' : ''}`}
            value={formData.personalPhone || ''}
            onChange={handleChange}
          />
        </div>
        {localErrors.personalPhone && (
          <p className="text-xs text-red-500">{localErrors.personalPhone}</p>
        )}
      </div>
      
      {/* Personal Address - Full Width */}
      <div className="space-y-1 col-span-1 md:col-span-2">
        <Label htmlFor="personalAddress">Address</Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="personalAddress"
            name="personalAddress"
            placeholder="Your Address"
            className={`pl-10 ${localErrors.personalAddress ? 'border-red-500' : ''}`}
            value={formData.personalAddress || ''}
            onChange={handleChange}
          />
        </div>
        {localErrors.personalAddress && (
          <p className="text-xs text-red-500">{localErrors.personalAddress}</p>
        )}
      </div>
    </div>
  );
};

export default PersonalUserFields;
