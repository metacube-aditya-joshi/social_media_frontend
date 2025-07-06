
import React, { useState } from 'react';
import { useUserStore } from '../store/stores/useUserStore'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Settings as SettingsIcon, Save, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const { currentUser,updateProfile, logout } = useUserStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    bio: currentUser?.bio || '',
    email: currentUser?.email || '',
  });

  if (!currentUser) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      updateProfile(currentUser.id, formData);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Settings
        </h1>
        <p className="text-slate-400 mt-2">Manage your account settings</p>
      </div>

      <div className="space-y-6">
        {/* Profile Settings */}
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <SettingsIcon className="h-5 w-5 mr-2" />
              Profile Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={currentUser.avatar} alt={currentUser.username} />
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xl">
                  {currentUser.firstName[0]}{currentUser.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-white font-medium">@{currentUser.username}</h3>
                <Button variant="outline" size="sm" className="mt-2">
                  Change Avatar
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="text-slate-200">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="bg-slate-900/50 border-slate-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="lastName" className="text-slate-200">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="bg-slate-900/50 border-slate-600 text-white"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="text-slate-200">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="bg-slate-900/50 border-slate-600 text-white"
              />
            </div>

            <div>
              <Label htmlFor="bio" className="text-slate-200">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Tell us about yourself..."
                className="bg-slate-900/50 border-slate-600 text-white resize-none"
                rows={3}
              />
            </div>

            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="bg-blue-500 hover:bg-blue-600"
            >
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-white">Account Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleLogout}
              variant="destructive"
              className="bg-red-600 hover:bg-red-700"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
