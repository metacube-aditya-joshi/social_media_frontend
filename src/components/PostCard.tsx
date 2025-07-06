
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Bookmark, Share, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { useUserStore } from '../stores/userStore';
import { usePostStore, Post } from '../stores/postStore';
import { useCommentStore } from '../stores/commentStore';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Badge } from './ui/badge';
import { cn } from '../lib/utils';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { currentUser, getUserById } = useUserStore();
  const { likePost, unlikePost, bookmarkPost, unbookmarkPost, deletePost } = usePostStore();
  const { getCommentsByPost } = useCommentStore();
  const [showComments, setShowComments] = useState(false);

  const author = getUserById(post.authorId);
  const comments = getCommentsByPost(post.id);
  const isLiked = currentUser ? post.likes.includes(currentUser.id) : false;
  const isBookmarked = currentUser ? post.bookmarks.includes(currentUser.id) : false;
  const isAuthor = currentUser?.id === post.authorId;

  if (!author || !currentUser) return null;

  const handleLike = () => {
    if (isLiked) {
      unlikePost(post.id, currentUser.id);
    } else {
      likePost(post.id, currentUser.id);
    }
  };

  const handleBookmark = () => {
    if (isBookmarked) {
      unbookmarkPost(post.id, currentUser.id);
    } else {
      bookmarkPost(post.id, currentUser.id);
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      deletePost(post.id);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return `${Math.floor(diffInHours * 60)}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return `${Math.floor(diffInHours / 24)}d ago`;
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-md mb-6 hover:bg-slate-800/70 transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Link to={`/profile/${author.username}`}>
              <Avatar className="h-10 w-10 ring-2 ring-blue-500/20 hover:ring-blue-500/40 transition-all">
                <AvatarImage src={author.avatar} alt={author.username} />
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                  {author.firstName[0]}{author.lastName[0]}
                </AvatarFallback>
              </Avatar>
            </Link>
            <div>
              <Link to={`/profile/${author.username}`} className="flex items-center space-x-1 hover:underline">
                <span className="font-semibold text-white">{author.firstName} {author.lastName}</span>
                {author.isVerified && (
                  <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </Link>
              <div className="flex items-center space-x-2 text-slate-400 text-sm">
                <span>@{author.username}</span>
                <span>•</span>
                <span>{formatDate(post.createdAt)}</span>
              </div>
            </div>
          </div>

          {isAuthor && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                <DropdownMenuItem className="text-slate-200 hover:text-white">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete} className="text-red-400 hover:text-red-300">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-slate-100 leading-relaxed">{post.content}</p>

        {post.images && post.images.length > 0 && (
          <div className="grid grid-cols-1 gap-4">
            {post.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Post image ${index + 1}`}
                className="w-full rounded-lg max-h-96 object-cover cursor-pointer hover:opacity-90 transition-opacity"
              />
            ))}
          </div>
        )}

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="bg-blue-500/20 text-blue-300 hover:bg-blue-500/30">
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
          <div className="flex items-center space-x-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={cn(
                'flex items-center space-x-2 text-slate-400 hover:text-red-400 transition-colors',
                isLiked && 'text-red-400'
              )}
            >
              <Heart className={cn('h-5 w-5', isLiked && 'fill-current')} />
              <span>{post.likes.length}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-2 text-slate-400 hover:text-blue-400 transition-colors"
            >
              <MessageCircle className="h-5 w-5" />
              <span>{comments.length}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleBookmark}
              className={cn(
                'flex items-center space-x-2 text-slate-400 hover:text-yellow-400 transition-colors',
                isBookmarked && 'text-yellow-400'
              )}
            >
              <Bookmark className={cn('h-5 w-5', isBookmarked && 'fill-current')} />
            </Button>
          </div>

          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-300">
            <Share className="h-5 w-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostCard;
