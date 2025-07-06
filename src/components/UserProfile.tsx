
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, MapPin, Link as LinkIcon, Edit, Camera } from 'lucide-react';
import { useUserStore } from '../stores/userStore';
import { usePostStore } from '../stores/postStore';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import PostCard from './PostCard';

const UserProfile = () => {
  const { username } = useParams<{ username: string }>();
  const { currentUser, getUserByUsername, followUser, unfollowUser } = useUserStore();
  const { getPostsByAuthor, getBookmarkedPosts } = usePostStore();
  const [activeTab, setActiveTab] = useState('posts');

  const profileUser = username ? getUserByUsername(username) : null;
  const isOwnProfile = currentUser?.id === profileUser?.id;
  const isFollowing = currentUser ? profileUser?.followers.includes(currentUser.id) : false;

  if (!profileUser) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-white mb-4">User Not Found</h2>
        <p className="text-slate-400">The user you're looking for doesn't exist.</p>
      </div>
    );
  }

  const userPosts = getPostsByAuthor(profileUser.id);
  const bookmarkedPosts = currentUser ? getBookmarkedPosts(currentUser.id) : [];

  const handleFollow = () => {
    if (!currentUser) return;
    
    if (isFollowing) {
      unfollowUser(profileUser.id);
    } else {
      followUser(profileUser.id);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Cover Image */}
      <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg mb-4 overflow-hidden">
        {profileUser.coverImage && (
          <img
            src={profileUser.coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        )}
        {isOwnProfile && (
          <Button
            size="sm"
            className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white"
          >
            <Camera className="h-4 w-4 mr-2" />
            Edit Cover
          </Button>
        )}
      </div>

      {/* Profile Info */}
      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-md mb-6">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Avatar className="h-24 w-24 ring-4 ring-slate-700">
                  <AvatarImage src={profileUser.avatar} alt={profileUser.username} />
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-2xl">
                    {profileUser.firstName[0]}{profileUser.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                {isOwnProfile && (
                  <Button
                    size="sm"
                    className="absolute bottom-0 right-0 h-8 w-8 p-0 rounded-full bg-blue-500 hover:bg-blue-600"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl font-bold text-white">
                    {profileUser.firstName} {profileUser.lastName}
                  </h1>
                  {profileUser.isVerified && (
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">✓</span>
                    </div>
                  )}
                </div>
                <p className="text-slate-400">@{profileUser.username}</p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-slate-400">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {new Date(profileUser.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-2">
              {isOwnProfile ? (
                <Button className="bg-slate-700 hover:bg-slate-600 text-white">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <Button
                  onClick={handleFollow}
                  className={
                    isFollowing
                      ? 'bg-slate-700 hover:bg-red-600 text-white'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }
                >
                  {isFollowing ? 'Unfollow' : 'Follow'}
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {profileUser.bio && (
            <p className="text-slate-200 mb-4">{profileUser.bio}</p>
          )}

          <div className="flex space-x-6 text-sm">
            <div className="text-slate-300">
              <span className="font-semibold text-white">{profileUser.following.length}</span> Following
            </div>
            <div className="text-slate-300">
              <span className="font-semibold text-white">{profileUser.followers.length}</span> Followers
            </div>
            <div className="text-slate-300">
              <span className="font-semibold text-white">{userPosts.length}</span> Posts
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-slate-800/50 border-slate-700/50 mb-6">
          <TabsTrigger value="posts" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
            Posts
          </TabsTrigger>
          {isOwnProfile && (
            <TabsTrigger value="bookmarks" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
              Bookmarks
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="posts">
          {userPosts.length > 0 ? (
            <div>
              {userPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-md text-center py-12">
              <CardContent>
                <p className="text-slate-400">No posts yet.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {isOwnProfile && (
          <TabsContent value="bookmarks">
            {bookmarkedPosts.length > 0 ? (
              <div>
                {bookmarkedPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-md text-center py-12">
                <CardContent>
                  <p className="text-slate-400">No bookmarked posts yet.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default UserProfile;
