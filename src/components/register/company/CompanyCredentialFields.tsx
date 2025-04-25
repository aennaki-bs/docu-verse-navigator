  {/* Company Email */}
  <div className="space-y-1">
    <Label htmlFor="companyEmail">Company Email <span className="text-xs text-gray-400">(saved as email)</span></Label>
    <div className="relative">
      <AtSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
      <Input
        id="companyEmail"
        name="companyEmail"
        type="email"
        placeholder="Company Email"
        className="pl-10 pr-10"
        error={formData.companyEmail && !!localErrors.companyEmail}
        value={formData.companyEmail || ''}
        onChange={handleChange}
      />
      {isFieldValid('companyEmail', formData.companyEmail) && (
        <CheckCircle2 className="absolute right-3 top-3 h-4 w-4 text-green-500" />
      )}
    </div>
    {localErrors.companyEmail && (
      <p className="text-xs text-red-500">{localErrors.companyEmail}</p>
    )}
  </div>

  {/* Company Username */}
  <div className="space-y-1">
    <Label htmlFor="companyAlias">Company Alias <span className="text-xs text-gray-400">(saved as username)</span></Label>
    <div className="relative">
      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
      <Input
        id="companyAlias"
        name="companyAlias"
        placeholder="Company Alias"
        className="pl-10 pr-10"
        error={formData.companyAlias && !!localErrors.companyAlias}
        value={formData.companyAlias || ''}
        onChange={handleChange}
      />
      {isFieldValid('companyAlias', formData.companyAlias) && (
        <CheckCircle2 className="absolute right-3 top-3 h-4 w-4 text-green-500" />
      )}
    </div>
    {localErrors.companyAlias && (
      <p className="text-xs text-red-500">{localErrors.companyAlias}</p>
    )}
  </div>

  {/* Company Password */}
  <div className="space-y-1">
    <Label htmlFor="companyPassword">Company Password <span className="text-xs text-gray-400">(saved as passwordHash)</span></Label>
    <div className="relative">
      <KeyRound className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
      <Input
        id="companyPassword"
        name="companyPassword"
        type={showPassword ? 'text' : 'password'}
        placeholder="Password"
        className="pl-10 pr-10"
        error={formData.companyPassword && !!localErrors.companyPassword}
        value={formData.companyPassword || ''}
        onChange={handleChange}
      />
      <button
        type="button"
        className="absolute right-3 top-3 text-gray-400"
        onClick={togglePasswordVisibility}
      >
        {showPassword ? (
          <EyeOff className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
      </button>
    </div>
    {localErrors.companyPassword && (
      <p className="text-xs text-red-500">{localErrors.companyPassword}</p>
    )}
  </div>

  {/* Confirm Password */}
  <div className="space-y-1">
    <Label htmlFor="confirmPassword">Confirm Password</Label>
    <div className="relative">
      <KeyRound className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
      <Input
        id="confirmPassword"
        name="confirmPassword"
        type={showConfirmPassword ? 'text' : 'password'}
        placeholder="Confirm Password"
        className="pl-10 pr-10"
        error={formData.confirmPassword && !!localErrors.confirmPassword}
        value={formData.confirmPassword || ''}
        onChange={handleChange}
      />
      <button
        type="button"
        className="absolute right-3 top-3 text-gray-400"
        onClick={toggleConfirmPasswordVisibility}
      >
        {showConfirmPassword ? (
          <EyeOff className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
      </button>
    </div>
    {localErrors.confirmPassword && (
      <p className="text-xs text-red-500">{localErrors.confirmPassword}</p>
    )}
  </div> 