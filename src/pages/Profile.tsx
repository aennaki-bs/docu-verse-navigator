
import { useState, useEffect, ChangeEvent } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge'; // Added import for Badge component
import { Edit, Camera, Save, X, User, Mail, Phone, MapPin, Lock, Building, Globe, AtSign } from 'lucide-react';
import { UpdateProfileRequest } from '@/services/authService';
import authService from '@/services/authService';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import DocuVerseLogo from '@/components/DocuVerseLogo';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

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
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-blue-900/20 to-blue-950/30">
        <Card className="w-[350px] shadow-xl bg-gradient-to-b from-blue-900/10 to-indigo-900/5 backdrop-blur-sm border border-white/10">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl">Not Authenticated</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center p-6">
            <Lock className="h-16 w-16 text-gray-400 mb-4" />
            <p className="text-center text-gray-400 mb-6">Please log in to view your profile</p>
            <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700" asChild>
              <Link to="/login">Go to Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  const getInitials = () => {
    return `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`;
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900/20 to-blue-950/30">
      {/* Header */}
      <header className="bg-gradient-to-r from-gray-900/95 to-blue-900/95 border-b border-white/10 backdrop-blur-md shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Link to="/dashboard" className="flex items-center">
              <DocuVerseLogo className="h-10 w-auto" />
            </Link>
            <div className="hidden md:block h-6 w-px bg-gray-700"></div>
            <h1 className="ml-2 text-xl font-semibold text-white hidden md:block">Profile</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/dashboard">
              <Button variant="ghost" className="text-blue-300 hover:text-white hover:bg-blue-800/50">
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Profile</h1>
          <p className="text-blue-200/80">Manage your personal information and account settings</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Profile Image Section */}
          <motion.div 
            className="md:col-span-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="shadow-xl border-white/10 bg-gradient-to-br from-gray-900/80 to-blue-900/40 backdrop-blur-sm overflow-hidden">
              <CardHeader className="text-center border-b border-white/5 pb-6 bg-gradient-to-r from-blue-800/30 to-purple-800/20">
                <CardTitle className="text-white/90">Profile Picture</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-6 p-8">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-br from-blue-400 to-indigo-500">
                    <Avatar className="h-[120px] w-[120px] border-4 border-gray-900">
                      {profileImage ? (
                        <AvatarImage src={profileImage} alt="Profile" />
                      ) : (
                        <AvatarFallback className="text-3xl bg-gradient-to-br from-blue-600/80 to-indigo-600/80 text-white">
                          {getInitials()}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </div>
                  
                  <label 
                    htmlFor="profile-upload" 
                    className="absolute bottom-0 right-0 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full p-3 cursor-pointer hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 border-4 border-gray-900 shadow-lg"
                  >
                    <Camera className="h-5 w-5" />
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
                  <p className="font-semibold text-xl text-white">{user.firstName} {user.lastName}</p>
                  <p className="text-blue-300/80 mt-1 flex items-center justify-center gap-1">
                    <AtSign className="h-3.5 w-3.5" />
                    {user.username}
                  </p>
                  <Badge className="mt-3 bg-gradient-to-r from-blue-500/80 to-indigo-500/80 hover:from-blue-600/80 hover:to-indigo-600/80 border-0 text-white">
                    {user.role}
                  </Badge>
                </div>
                
                {isUploadingImage && (
                  <div className="text-sm text-blue-300 flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-300 mr-2"></div>
                    Uploading image...
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Profile Details Section */}
          <motion.div 
            className="md:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="mb-6 bg-white/5 backdrop-blur-md border border-white/10 w-full grid grid-cols-2 p-1 h-auto">
                <TabsTrigger 
                  value="profile" 
                  className="py-2.5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600/80 data-[state=active]:to-indigo-600/80 data-[state=active]:text-white"
                >
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </TabsTrigger>
                <TabsTrigger 
                  value="security"
                  className="py-2.5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600/80 data-[state=active]:to-indigo-600/80 data-[state=active]:text-white"
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Security
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="mt-0">
                <Card className="shadow-xl border-white/10 bg-gradient-to-br from-gray-900/80 to-blue-900/40 backdrop-blur-sm overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 bg-gradient-to-r from-blue-800/30 to-purple-800/20">
                    <CardTitle className="text-white/90 flex items-center">
                      <User className="h-5 w-5 mr-2 text-blue-300" />
                      Personal Information
                    </CardTitle>
                    <Button 
                      variant={isEditing ? "destructive" : "outline"} 
                      size="sm" 
                      onClick={() => setIsEditing(!isEditing)}
                      className={isEditing ? "bg-red-500/90 hover:bg-red-600/90 text-white" : "border-blue-400/30 text-blue-300 hover:text-white hover:bg-blue-700/50"}
                    >
                      {isEditing ? (
                        <>
                          <X className="mr-2 h-4 w-4" /> Cancel
                        </>
                      ) : (
                        <>
                          <Edit className="mr-2 h-4 w-4" /> Edit Profile
                        </>
                      )}
                    </Button>
                  </CardHeader>
                  <CardContent className="p-6">
                    {apiError && (
                      <Alert variant="destructive" className="mb-6 bg-red-500/20 text-red-200 border-red-500/50">
                        <AlertDescription>{apiError}</AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="firstName" className="flex items-center gap-2 text-blue-200">
                            <User className="h-4 w-4 text-blue-300" /> First Name
                          </Label>
                          <Input
                            id="firstName"
                            name="firstName"
                            value={profileData.firstName}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className={`bg-blue-950/40 border-blue-400/20 text-white placeholder:text-blue-400/50 ${!isEditing ? 'opacity-70' : 'focus:border-blue-400'}`}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName" className="flex items-center gap-2 text-blue-200">
                            <User className="h-4 w-4 text-blue-300" /> Last Name
                          </Label>
                          <Input
                            id="lastName"
                            name="lastName"
                            value={profileData.lastName}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className={`bg-blue-950/40 border-blue-400/20 text-white placeholder:text-blue-400/50 ${!isEditing ? 'opacity-70' : 'focus:border-blue-400'}`}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="username" className="flex items-center gap-2 text-blue-200">
                          <AtSign className="h-4 w-4 text-blue-300" /> Username
                        </Label>
                        <Input
                          id="username"
                          name="username"
                          value={profileData.username}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className={`bg-blue-950/40 border-blue-400/20 text-white placeholder:text-blue-400/50 ${!isEditing ? 'opacity-70' : 'focus:border-blue-400'}`}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="phoneNumber" className="flex items-center gap-2 text-blue-200">
                            <Phone className="h-4 w-4 text-blue-300" /> Phone Number
                          </Label>
                          <Input
                            id="phoneNumber"
                            name="phoneNumber"
                            value={profileData.phoneNumber}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className={`bg-blue-950/40 border-blue-400/20 text-white placeholder:text-blue-400/50 ${!isEditing ? 'opacity-70' : 'focus:border-blue-400'}`}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email" className="flex items-center gap-2 text-blue-200">
                            <Mail className="h-4 w-4 text-blue-300" /> Email
                          </Label>
                          <div className="flex gap-2">
                            <Input
                              id="email"
                              name="email"
                              value={emailData.email}
                              onChange={handleEmailChange}
                              disabled={!isEditing}
                              className={`bg-blue-950/40 border-blue-400/20 text-white placeholder:text-blue-400/50 ${!isEditing ? 'opacity-70' : 'focus:border-blue-400'}`}
                            />
                            {isEditing && (
                              <Button 
                                type="button"
                                size="sm"
                                onClick={handleUpdateEmail}
                                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                              >
                                Update
                              </Button>
                            )}
                          </div>
                          {isEditing && (
                            <p className="text-xs text-blue-300/70 mt-1">
                              Updating email will require verification and log you out
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address" className="flex items-center gap-2 text-blue-200">
                          <MapPin className="h-4 w-4 text-blue-300" /> Address
                        </Label>
                        <Input
                          id="address"
                          name="address"
                          value={profileData.address}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className={`bg-blue-950/40 border-blue-400/20 text-white placeholder:text-blue-400/50 ${!isEditing ? 'opacity-70' : 'focus:border-blue-400'}`}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="city" className="flex items-center gap-2 text-blue-200">
                            <Building className="h-4 w-4 text-blue-300" /> City
                          </Label>
                          <Input
                            id="city"
                            name="city"
                            value={profileData.city}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className={`bg-blue-950/40 border-blue-400/20 text-white placeholder:text-blue-400/50 ${!isEditing ? 'opacity-70' : 'focus:border-blue-400'}`}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="country" className="flex items-center gap-2 text-blue-200">
                            <Globe className="h-4 w-4 text-blue-300" /> Country
                          </Label>
                          <Input
                            id="country"
                            name="country"
                            value={profileData.country}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className={`bg-blue-950/40 border-blue-400/20 text-white placeholder:text-blue-400/50 ${!isEditing ? 'opacity-70' : 'focus:border-blue-400'}`}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  {isEditing && (
                    <CardFooter className="flex justify-end border-t border-white/5 bg-gradient-to-r from-blue-800/20 to-purple-800/10 py-4">
                      <Button 
                        onClick={handleSaveProfile}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                      >
                        <Save className="mr-2 h-4 w-4" /> Save Changes
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              </TabsContent>

              <TabsContent value="security" className="mt-0">
                <Card className="shadow-xl border-white/10 bg-gradient-to-br from-gray-900/80 to-blue-900/40 backdrop-blur-sm overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 bg-gradient-to-r from-blue-800/30 to-purple-800/20">
                    <CardTitle className="text-white/90 flex items-center">
                      <Lock className="h-5 w-5 mr-2 text-blue-300" />
                      Change Password
                    </CardTitle>
                    <Button 
                      variant={isChangingPassword ? "destructive" : "outline"} 
                      size="sm" 
                      onClick={() => setIsChangingPassword(!isChangingPassword)}
                      className={isChangingPassword ? "bg-red-500/90 hover:bg-red-600/90 text-white" : "border-blue-400/30 text-blue-300 hover:text-white hover:bg-blue-700/50"}
                    >
                      {isChangingPassword ? (
                        <>
                          <X className="mr-2 h-4 w-4" /> Cancel
                        </>
                      ) : (
                        <>
                          <Lock className="mr-2 h-4 w-4" /> Change Password
                        </>
                      )}
                    </Button>
                  </CardHeader>
                  <CardContent className="p-6">
                    {apiError && (
                      <Alert variant="destructive" className="mb-6 bg-red-500/20 text-red-200 border-red-500/50">
                        <AlertDescription>{apiError}</AlertDescription>
                      </Alert>
                    )}

                    {isChangingPassword ? (
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="currentPassword" className="flex items-center gap-2 text-blue-200">
                            <Lock className="h-4 w-4 text-blue-300" /> Current Password
                          </Label>
                          <Input
                            id="currentPassword"
                            name="currentPassword"
                            type="password"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            className="bg-blue-950/40 border-blue-400/20 text-white placeholder:text-blue-400/50 focus:border-blue-400"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="newPassword" className="flex items-center gap-2 text-blue-200">
                            <Lock className="h-4 w-4 text-blue-300" /> New Password
                          </Label>
                          <Input
                            id="newPassword"
                            name="newPassword"
                            type="password"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            className="bg-blue-950/40 border-blue-400/20 text-white placeholder:text-blue-400/50 focus:border-blue-400"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword" className="flex items-center gap-2 text-blue-200">
                            <Lock className="h-4 w-4 text-blue-300" /> Confirm New Password
                          </Label>
                          <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            className="bg-blue-950/40 border-blue-400/20 text-white placeholder:text-blue-400/50 focus:border-blue-400"
                          />
                        </div>
                        <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-500/20">
                          <p className="text-sm text-blue-200">
                            Password must be at least 8 characters long and include uppercase letters, 
                            lowercase letters, numbers, and special characters.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-48">
                        <div className="text-center">
                          <Lock className="h-12 w-12 text-blue-300/50 mx-auto mb-4" />
                          <p className="text-blue-200">
                            To change your password, click the "Change Password" button.
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                  {isChangingPassword && (
                    <CardFooter className="flex justify-end border-t border-white/5 bg-gradient-to-r from-blue-800/20 to-purple-800/10 py-4">
                      <Button 
                        onClick={handleSaveProfile}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white w-full sm:w-auto"
                      >
                        <Save className="mr-2 h-4 w-4" /> Update Password
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
