
import React, { useState } from 'react';
import { Image, Hash, MapPin, Smile } from 'lucide-react';
import { useUserStore } from '@/store/stores/useUserStore'; 
import { usePostStore } from '@/store/stores/usePostStore'; 
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Card,CardContent } from './ui/card';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Input } from './ui/input';

export const CreatePost = () => {
  const { currentUser } = useUserStore();
  const { createPost } = usePostStore();
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  if (!currentUser) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsPosting(true);
    try {
      createPost(
        content.trim(),
        images,
        tags,
      );
      
      // Clear form
      setContent('');
      setImages([]);
      setTags([]);
      setTagInput('');
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsPosting(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setImages(prev => [...prev, event.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });CreatePost
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-md mb-6">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit}>
          <div className="flex space-x-4">
            <Avatar className="h-12 w-12 ring-2 ring-blue-500/20">
              <AvatarImage src={currentUser.url} alt={currentUser.username} />
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                {currentUser.username}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-4">
              <Textarea
                placeholder="What's happening?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[120px] bg-slate-900/50 border-slate-600 text-white placeholder-slate-400 resize-none focus:border-blue-500"
              />

              {images.length > 0 && (
                <div className="grid grid-cols-2 gap-3">
                  {images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        className="absolute top-2 right-2 h-6 w-6 p-0"
                        onClick={() => setImages(images.filter((_, i) => i !== index))}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Input
                  type="text"
                  placeholder="Add tags..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="bg-slate-900/50 border-slate-600 text-white placeholder-slate-400"
                />
                <Button type="button" size="sm" onClick={addTag} className="bg-blue-500 hover:bg-blue-600">
                  <Hash className="h-4 w-4" />
                </Button>
              </div>

              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 cursor-pointer"
                      onClick={() => removeTag(tag)}
                    >
                      #{tag} ×
                    </Badge>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                <div className="flex items-center space-x-4">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Button type="button" variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">
                      <Image className="h-5 w-5" />
                    </Button>
                  </label>
                  <Button type="button" variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">
                    <Smile className="h-5 w-5" />
                  </Button>
                  <Button type="button" variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">
                    <MapPin className="h-5 w-5" />
                  </Button>
                </div>

                <Button
                  type="submit"
                  disabled={!content.trim() || isPosting}
                  className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50"
                >
                  {isPosting ? 'Posting...' : 'Post'}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

