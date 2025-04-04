
import { useState, useEffect, ChangeEvent } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Edit, Camera, Save, X, User, Mail, Phone, MapPin, Lock } from 'lucide-react';
import { UpdateProfileRequest } from '@/services/authService';
import authService from '@/services/authService';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import DocuVerseLogo from '@/components/DocuVerseLogo';
import { Link, useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, logout, refreshUserInfo } = useAuth();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  
  const [profileData, setProfileData] = useState<UpdateProfileRequest>({
    username: user?.username || '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    address: user?.address || '',
    city: user?.city || '',
    country: user?.country || '',
    phoneNumber: user?.phoneNumber || '',
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [emailData, setEmailData] = useState({
    email: user?.email || '',
  });
  
  const [profileImage, setProfileImage] = useState<string | undefined>(user?.profilePicture);
  
  useEffect(() => {
    // Update profile data when user info changes
    if (user) {
      setProfileData({
        username: user.username || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        address: user.address || '',
        city: user.city || '',
        country: user.country || '',
        phoneNumber: user.phoneNumber || '',
      });
      setEmailData({
        email: user.email || '',
      });
      setProfileImage(user.profilePicture);
    }
  }, [user]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
    setApiError(null);
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    setApiError(null);
  };
  
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailData(prev => ({ ...prev, email: e.target.value }));
    setApiError(null);
  };
  
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }
    
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only JPG, JPEG, PNG and GIF images are allowed');
      return;
    }
    
    try {
      setIsUploadingImage(true);
      setApiError(null);
      
      const result = await authService.uploadProfileImage(file);
      setProfileImage(result.filePath);
      
      // Refresh user info to get the updated profile picture
      await refreshUserInfo();
      
      toast.success(result.message);
    } catch (error: any) {
      const errorMessage = error.response?.data || error.message || 'Failed to upload image';
      setApiError(errorMessage);
      toast.error('Failed to upload image');
    } finally {
      setIsUploadingImage(false);
    }
  };
  
  const handleSaveProfile = async () => {
    try {
      setApiError(null);
      
      // If changing password, verify confirmation matches
      if (isChangingPassword) {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
          setApiError('Passwords do not match');
          return;
        }
        
        // Add password data to the update request
        const requestWithPassword: UpdateProfileRequest = {
          ...profileData,
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        };
        
        await authService.updateProfile(requestWithPassword);
      } else {
        // Just update profile without password
        await authService.updateProfile(profileData);
      }
      
      // Refresh user info to get the updated data
      await refreshUserInfo();
      
      toast.success('Profile updated successfully');
      setIsEditing(false);
      setIsChangingPassword(false);
      
      // Reset password fields
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error: any) {
      const errorMessage = error.response?.data || error.message || 'Failed to update profile';
      setApiError(errorMessage);
    }
  };
  
  const handleUpdateEmail = async () => {
    try {
      setApiError(null);
      
      await authService.updateEmail(emailData.email);
      toast.success('Email update request sent. Please check your email to verify.');
      logout(navigate); // Log out user as they need to verify new email
    } catch (error: any) {
      const errorMessage = error.response?.data || error.message || 'Failed to update email';
      setApiError(errorMessage);
    }
  };
  
  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p>Please log in to view your profile</p>
          <Link to="/login" className="text-blue-500 hover:underline mt-4 block">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }
  
  const getInitials = () => {
    return `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`;
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/dashboard">
              <DocuVerseLogo className="h-10 w-auto" />
            </Link>
            <h1 className="ml-4 text-xl font-semibold text-gray-900 dark:text-white">Profile</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/dashboard">
              <Button variant="ghost">Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Profile Image Section */}
          <div className="md:col-span-1">
            <Card className="shadow-md">
              <CardHeader className="text-center">
                <CardTitle>Profile Picture</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Avatar className="h-32 w-32">
                    {profileImage ? (
                      <AvatarImage src={profileImage} alt="Profile" />
                    ) : (
                      <AvatarFallback className="text-2xl">{getInitials()}</AvatarFallback>
                    )}
                  </Avatar>
                  
                  <label 
                    htmlFor="profile-upload" 
                    className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-2 cursor-pointer hover:bg-primary/90 transition-colors"
                  >
                    <Camera className="h-4 w-4" />
                    <input 
                      type="file" 
                      id="profile-upload" 
                      className="hidden" 
                      accept="image/png, image/jpeg, image/gif"
                      onChange={handleFileChange}
                      disabled={isUploadingImage}
                    />
                  </label>
                </div>
                
                <div className="text-center">
                  <p className="font-medium text-lg">{user.firstName} {user.lastName}</p>
                  <p className="text-gray-500 text-sm">{user.role}</p>
                </div>
                
                {isUploadingImage && (
                  <div className="text-sm text-blue-500">Uploading image...</div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Profile Details Section */}
          <div className="md:col-span-2">
            <Tabs defaultValue="profile">
              <TabsList className="mb-4">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>

              <TabsContent value="profile">
                <Card className="shadow-md">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Personal Information</CardTitle>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      {isEditing ? (
                        <>
                          <X className="mr-2 h-4 w-4" /> Cancel
                        </>
                      ) : (
                        <>
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </>
                      )}
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {apiError && (
                      <Alert variant="destructive" className="mb-4">
                        <AlertDescription>{apiError}</AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName" className="flex items-center gap-2">
                            <User className="h-4 w-4" /> First Name
                          </Label>
                          <Input
                            id="firstName"
                            name="firstName"
                            value={profileData.firstName}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName" className="flex items-center gap-2">
                            <User className="h-4 w-4" /> Last Name
                          </Label>
                          <Input
                            id="lastName"
                            name="lastName"
                            value={profileData.lastName}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="mt-1"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="username" className="flex items-center gap-2">
                          <User className="h-4 w-4" /> Username
                        </Label>
                        <Input
                          id="username"
                          name="username"
                          value={profileData.username}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="mt-1"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="phoneNumber" className="flex items-center gap-2">
                            <Phone className="h-4 w-4" /> Phone Number
                          </Label>
                          <Input
                            id="phoneNumber"
                            name="phoneNumber"
                            value={profileData.phoneNumber}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email" className="flex items-center gap-2">
                            <Mail className="h-4 w-4" /> Email
                          </Label>
                          <div className="flex mt-1 gap-2">
                            <Input
                              id="email"
                              name="email"
                              value={emailData.email}
                              onChange={handleEmailChange}
                              disabled={!isEditing}
                            />
                            {isEditing && (
                              <Button 
                                type="button"
                                size="sm"
                                onClick={handleUpdateEmail}
                              >
                                Update
                              </Button>
                            )}
                          </div>
                          {isEditing && (
                            <p className="text-xs text-gray-500 mt-1">
                              Updating email will require verification and log you out
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="address" className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" /> Address
                        </Label>
                        <Input
                          id="address"
                          name="address"
                          value={profileData.address}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="mt-1"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="city" className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" /> City
                          </Label>
                          <Input
                            id="city"
                            name="city"
                            value={profileData.city}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="country" className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" /> Country
                          </Label>
                          <Input
                            id="country"
                            name="country"
                            value={profileData.country}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  {isEditing && (
                    <CardFooter className="flex justify-end">
                      <Button onClick={handleSaveProfile}>
                        <Save className="mr-2 h-4 w-4" /> Save Changes
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              </TabsContent>

              <TabsContent value="security">
                <Card className="shadow-md">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Change Password</CardTitle>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setIsChangingPassword(!isChangingPassword)}
                    >
                      {isChangingPassword ? (
                        <>
                          <X className="mr-2 h-4 w-4" /> Cancel
                        </>
                      ) : (
                        <>
                          <Lock className="mr-2 h-4 w-4" /> Change
                        </>
                      )}
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {apiError && (
                      <Alert variant="destructive" className="mb-4">
                        <AlertDescription>{apiError}</AlertDescription>
                      </Alert>
                    )}

                    {isChangingPassword ? (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="currentPassword" className="flex items-center gap-2">
                            <Lock className="h-4 w-4" /> Current Password
                          </Label>
                          <Input
                            id="currentPassword"
                            name="currentPassword"
                            type="password"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="newPassword" className="flex items-center gap-2">
                            <Lock className="h-4 w-4" /> New Password
                          </Label>
                          <Input
                            id="newPassword"
                            name="newPassword"
                            type="password"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                            <Lock className="h-4 w-4" /> Confirm New Password
                          </Label>
                          <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            className="mt-1"
                          />
                        </div>
                        <p className="text-xs text-gray-500">
                          Password must be at least 8 characters long and include uppercase letters, 
                          lowercase letters, numbers, and special characters.
                        </p>
                        <Button 
                          className="w-full" 
                          onClick={handleSaveProfile}
                        >
                          Update Password
                        </Button>
                      </div>
                    ) : (
                      <p className="text-gray-500">
                        To change your password, click the "Change" button.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
