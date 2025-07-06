
import React from 'react';
import { Bookmark } from 'lucide-react';
import { useUserStore } from '../stores/userStore';
import { usePostStore } from '../stores/postStore';
import { Card, CardContent } from '../components/ui/card';
import PostCard from '../components/PostCard';

const Bookmarks = () => {
  const { currentUser } = useUserStore();
  const { getBookmarkedPosts } = usePostStore();

  if (!currentUser) return null;

  const bookmarkedPosts = getBookmarkedPosts(currentUser.id);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Bookmarks
        </h1>
        <p className="text-slate-400 mt-2">Your saved posts</p>
      </div>

      {bookmarkedPosts.length > 0 ? (
        <div className="space-y-6">
          {bookmarkedPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-md text-center py-12">
          <CardContent>
            <div className="text-slate-400">
              <Bookmark className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No bookmarks yet</h3>
              <p>Start bookmarking posts to see them here</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Bookmarks;
