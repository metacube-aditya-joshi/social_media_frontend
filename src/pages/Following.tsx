
import React from 'react';
import { useUserStore } from '../stores/userStore';
import { usePostStore } from '../stores/postStore';
import { Card, CardContent } from '../components/ui/card';
import PostCard from '../components/PostCard';
import { Users } from 'lucide-react';

const Following = () => {
  const { currentUser } = useUserStore();
  const { getFollowingPosts } = usePostStore();

  if (!currentUser) return null;

  const followingPosts = getFollowingPosts(currentUser.following);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Following
        </h1>
        <p className="text-slate-400 mt-2">Posts from people you follow</p>
      </div>

      {followingPosts.length > 0 ? (
        <div className="space-y-6">
          {followingPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-md text-center py-12">
          <CardContent>
            <div className="text-slate-400">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No posts from following</h3>
              <p>Follow more users to see their posts here</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Following;
