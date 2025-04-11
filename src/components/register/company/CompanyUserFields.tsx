
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2, Briefcase, MapPin, Phone, Mail, Globe } from 'lucide-react';

interface CompanyUserFieldsProps {
  formData: {
    companyName?: string;
    companyIRC?: string;
    companyAddress?: string;
    companyPhone?: string;
    companyEmail?: string;
    companyWebsite?: string;
  };
  localErrors: Record<string, string>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CompanyUserFields: React.FC<CompanyUserFieldsProps> = ({
  formData,
  localErrors,
  handleChange
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Company Name */}
      <div className="space-y-1">
        <Label htmlFor="companyName">Company Name</Label>
        <div className="relative">
          <Building2 className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="companyName"
            name="companyName"
            placeholder="Company Name"
            className={`pl-10 ${localErrors.companyName ? 'border-red-500' : ''}`}
            value={formData.companyName || ''}
            onChange={handleChange}
          />
        </div>
        {localErrors.companyName && (
          <p className="text-xs text-red-500">{localErrors.companyName}</p>
        )}
      </div>
      
      {/* Company IRC */}
      <div className="space-y-1">
        <Label htmlFor="companyIRC">Company IRC</Label>
        <div className="relative">
          <Briefcase className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="companyIRC"
            name="companyIRC"
            placeholder="Company Registration Number"
            className={`pl-10 ${localErrors.companyIRC ? 'border-red-500' : ''}`}
            value={formData.companyIRC || ''}
            onChange={handleChange}
          />
        </div>
        {localErrors.companyIRC && (
          <p className="text-xs text-red-500">{localErrors.companyIRC}</p>
        )}
      </div>
      
      {/* Company Phone */}
      <div className="space-y-1">
        <Label htmlFor="companyPhone">Company Phone</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="companyPhone"
            name="companyPhone"
            placeholder="Company Phone Number"
            className={`pl-10 ${localErrors.companyPhone ? 'border-red-500' : ''}`}
            value={formData.companyPhone || ''}
            onChange={handleChange}
          />
        </div>
        {localErrors.companyPhone && (
          <p className="text-xs text-red-500">{localErrors.companyPhone}</p>
        )}
      </div>
      
      {/* Company Email */}
      <div className="space-y-1">
        <Label htmlFor="companyEmail">Company Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="companyEmail"
            name="companyEmail"
            placeholder="Company Email"
            className={`pl-10 ${localErrors.companyEmail ? 'border-red-500' : ''}`}
            value={formData.companyEmail || ''}
            onChange={handleChange}
          />
        </div>
        {localErrors.companyEmail && (
          <p className="text-xs text-red-500">{localErrors.companyEmail}</p>
        )}
      </div>
      
      {/* Company Address - Full Width */}
      <div className="space-y-1 col-span-1 md:col-span-2">
        <Label htmlFor="companyAddress">Company Address</Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="companyAddress"
            name="companyAddress"
            placeholder="Company Address"
            className={`pl-10 ${localErrors.companyAddress ? 'border-red-500' : ''}`}
            value={formData.companyAddress || ''}
            onChange={handleChange}
          />
        </div>
        {localErrors.companyAddress && (
          <p className="text-xs text-red-500">{localErrors.companyAddress}</p>
        )}
      </div>
      
      {/* Company Website - Full Width */}
      <div className="space-y-1 col-span-1 md:col-span-2">
        <Label htmlFor="companyWebsite">Company Website (Optional)</Label>
        <div className="relative">
          <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="companyWebsite"
            name="companyWebsite"
            placeholder="Company Website"
            value={formData.companyWebsite || ''}
            onChange={handleChange}
            className="pl-10"
          />
        </div>
      </div>
    </div>
  );
};

export default CompanyUserFields;
