  {/* Company Name */}
  <div className="space-y-1">
    <Label htmlFor="companyName">Company Name</Label>
    <div className="relative">
      <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
      <Input
        id="companyName"
        name="companyName"
        placeholder="Company Name"
        className="pl-10 pr-10"
        error={formData.companyName && !!localErrors.companyName}
        value={formData.companyName || ''}
        onChange={handleChange}
      />
      {isFieldValid('companyName', formData.companyName) && (
        <CheckCircle2 className="absolute right-3 top-3 h-4 w-4 text-green-500" />
      )}
    </div>
    {localErrors.companyName && (
      <p className="text-xs text-red-500">{localErrors.companyName}</p>
    )}
  </div>

  {/* Company RC */}
  <div className="space-y-1">
    <Label htmlFor="companyRc">Company Registration Number</Label>
    <div className="relative">
      <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
      <Input
        id="companyRc"
        name="companyRc"
        placeholder="Registration Number"
        className="pl-10 pr-10"
        error={formData.companyRc && !!localErrors.companyRc}
        value={formData.companyRc || ''}
        onChange={handleChange}
      />
      {isFieldValid('companyRc', formData.companyRc) && (
        <CheckCircle2 className="absolute right-3 top-3 h-4 w-4 text-green-500" />
      )}
    </div>
    {localErrors.companyRc && (
      <p className="text-xs text-red-500">{localErrors.companyRc}</p>
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
        placeholder="Company Phone"
        className="pl-10 pr-10"
        error={formData.companyPhone && !!localErrors.companyPhone}
        value={formData.companyPhone || ''}
        onChange={handleChange}
      />
      {isFieldValid('companyPhone', formData.companyPhone) && (
        <CheckCircle2 className="absolute right-3 top-3 h-4 w-4 text-green-500" />
      )}
    </div>
    {localErrors.companyPhone && (
      <p className="text-xs text-red-500">{localErrors.companyPhone}</p>
    )}
  </div>

  {/* Company Website */}
  <div className="space-y-1">
    <Label htmlFor="companyWebsite">Company Website</Label>
    <div className="relative">
      <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
      <Input
        id="companyWebsite"
        name="companyWebsite"
        placeholder="Company Website"
        className="pl-10 pr-10"
        error={formData.companyWebsite && !!localErrors.companyWebsite}
        value={formData.companyWebsite || ''}
        onChange={handleChange}
      />
      {isFieldValid('companyWebsite', formData.companyWebsite) && (
        <CheckCircle2 className="absolute right-3 top-3 h-4 w-4 text-green-500" />
      )}
    </div>
    {localErrors.companyWebsite && (
      <p className="text-xs text-red-500">{localErrors.companyWebsite}</p>
    )}
  </div> 