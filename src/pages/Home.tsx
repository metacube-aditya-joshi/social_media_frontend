
import React from 'react';
import { useUserStore } from '../stores/userStore';
import { usePostStore } from '../stores/postStore';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';
import { Card, CardContent } from '../components/ui/card';

const Home = () => {
  const { currentUser } = useUserStore();
  const { posts, getFollowingPosts } = usePostStore();

  if (!currentUser) {
    return null;
  }

  // Show posts from followed users, or all posts if not following anyone
  const feedPosts = currentUser.following.length > 0 
    ? getFollowingPosts(currentUser.following).concat(posts.filter(p => p.authorId === currentUser.id))
    : posts;

  // Remove duplicates and sort by date
  const uniquePosts = Array.from(new Map(feedPosts.map(post => [post.id, post])).values())
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Home</h1>
        <p className="text-slate-400">Welcome back, {currentUser.firstName}!</p>
      </div>

      <CreatePost />

      <div>
        {uniquePosts.length > 0 ? (
          uniquePosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        ) : (
          <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-md text-center py-12">
            <CardContent>
              <h3 className="text-xl font-semibold text-white mb-2">No posts in your feed</h3>
              <p className="text-slate-400">Follow some users to see their posts here, or create your first post!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Home;
