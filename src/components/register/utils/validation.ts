
export const validatePersonalUserInfo = (formData: {
  firstName: string;
  lastName: string;
  cin?: string;
  personalAddress?: string;
  personalPhone?: string;
}) => {
  const errors: Record<string, string> = {};
  
  // Personal user validation
  if (!formData.firstName.trim()) {
    errors.firstName = 'First name is required';
  } else if (formData.firstName.trim().length < 2) {
    errors.firstName = 'First name must be at least 2 characters';
  }
  
  if (!formData.lastName.trim()) {
    errors.lastName = 'Last name is required';
  } else if (formData.lastName.trim().length < 2) {
    errors.lastName = 'Last name must be at least 2 characters';
  }
  
  if (!formData.cin?.trim()) {
    errors.cin = 'CIN is required';
  }
  
  if (!formData.personalAddress?.trim()) {
    errors.personalAddress = 'Address is required';
  }
  
  if (!formData.personalPhone?.trim()) {
    errors.personalPhone = 'Phone number is required';
  }
  
  return errors;
};

export const validateCompanyInfo = (formData: {
  companyName?: string;
  companyIRC?: string;
  companyAddress?: string;
  companyPhone?: string;
  companyEmail?: string;
}) => {
  const errors: Record<string, string> = {};
  
  // Company validation
  if (!formData.companyName?.trim()) {
    errors.companyName = 'Company name is required';
  }
  
  if (!formData.companyIRC?.trim()) {
    errors.companyIRC = 'Company IRC is required';
  }
  
  if (!formData.companyAddress?.trim()) {
    errors.companyAddress = 'Company address is required';
  }
  
  if (!formData.companyPhone?.trim()) {
    errors.companyPhone = 'Company phone is required';
  }
  
  if (formData.companyEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.companyEmail)) {
    errors.companyEmail = 'Please enter a valid email address';
  }
  
  return errors;
};

// Add the missing validateEmailPasswordStep function
export const validateEmailPasswordStep = (formData: {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}) => {
  const errors: Record<string, string> = {};
  
  if (!formData.username.trim()) {
    errors.username = 'Username is required';
  } else if (formData.username.trim().length < 4) {
    errors.username = 'Username must be at least 4 characters';
  }
  
  if (!formData.email.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  if (!formData.password) {
    errors.password = 'Password is required';
  } else if (formData.password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  } else if (!/(?=.*[a-z])/.test(formData.password)) {
    errors.password = 'Password must contain at least one lowercase letter';
  } else if (!/(?=.*[A-Z])/.test(formData.password)) {
    errors.password = 'Password must contain at least one uppercase letter';
  } else if (!/(?=.*\d)/.test(formData.password)) {
    errors.password = 'Password must contain at least one number';
  } else if (!/(?=.*[!@#$%^&*])/.test(formData.password)) {
    errors.password = 'Password must contain at least one special character';
  }
  
  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }
  
  return errors;
};
