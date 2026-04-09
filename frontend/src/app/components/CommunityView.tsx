import { Heart, MessageCircle, Share2, MapPin, MoreVertical, Flag, UserX, Bookmark } from "lucide-react";
import { useEffect, useState } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { CommentModal, type CommentModalItem } from "./CommentModal";
import { motion, AnimatePresence } from "motion/react";

interface CommunityPost {
  id: string;
  userName: string;
  userAvatar?: string | null;
  location: string;
  timestamp: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  isLiked: boolean;
}

interface CommunityViewProps {
  posts: CommunityPost[];
  onFetchComments: (postId: string) => Promise<CommentModalItem[]>;
  onAddComment: (postId: string, comment: string) => Promise<void>;
}

export function CommunityView({ posts, onFetchComments, onAddComment }: CommunityViewProps) {
  const [postsState, setPostsState] = useState(posts);
  const [activeCommentModal, setActiveCommentModal] = useState<string | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [comments, setComments] = useState<CommentModalItem[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);

  useEffect(() => {
    setPostsState(posts);
  }, [posts]);

  const activePostId = activeCommentModal;

  const toggleLike = (postId: string) => {
    setPostsState((previous) =>
      previous.map((post) =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            }
          : post,
      ),
    );
  };

  const openComments = async (postId: string) => {
    setActiveCommentModal(postId);
    setCommentsLoading(true);
    try {
      const items = await onFetchComments(postId);
      setComments(items);
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleAddComment = async (comment: string) => {
    if (!activePostId) {
      return;
    }

    await onAddComment(activePostId, comment);

    setPostsState((previous) =>
      previous.map((post) =>
        post.id === activePostId
          ? {
              ...post,
              comments: post.comments + 1,
            }
          : post,
      ),
    );

    const refreshed = await onFetchComments(activePostId);
    setComments(refreshed);
  };

  return (
    <div className="pb-24 bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {postsState.map((post) => (
        <div key={post.id} className="border-b border-[var(--border-primary)] bg-[var(--bg-primary)]">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--brand-orange)] to-[var(--brand-orange-dark)] flex items-center justify-center overflow-hidden">
                {post.userAvatar ? (
                  <img src={post.userAvatar} className="size-full object-cover" />
                ) : (
                  <span className="text-sm text-white">{post.userName[0]}</span>
                )}
              </div>

              <div>
                <h4>{post.userName}</h4>
                <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                  <MapPin size={12} />
                  <span>{post.location}</span>
                  <span>•</span>
                  <span>{post.timestamp}</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <button
                onClick={() => setActiveMenu(activeMenu === post.id ? null : post.id)}
                className="p-2 hover:bg-[var(--bg-secondary)] rounded-full transition-colors"
              >
                <MoreVertical size={20} className="text-[var(--text-secondary)]" />
              </button>

              <AnimatePresence>
                {activeMenu === post.id && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setActiveMenu(null)}
                    />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl shadow-xl z-50 overflow-hidden"
                    >
                      <button
                        onClick={() => {
                          alert("Post saved");
                          setActiveMenu(null);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--bg-hover)] transition-colors text-left"
                      >
                        <Bookmark size={18} />
                        <span className="text-sm">Save Post</span>
                      </button>
                      <button
                        onClick={() => {
                          alert("User muted");
                          setActiveMenu(null);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--bg-hover)] transition-colors text-left"
                      >
                        <UserX size={18} />
                        <span className="text-sm">Mute User</span>
                      </button>
                      <button
                        onClick={() => {
                          alert("Post reported");
                          setActiveMenu(null);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--bg-hover)] transition-colors text-left text-red-500"
                      >
                        <Flag size={18} />
                        <span className="text-sm">Report</span>
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="px-4 pb-3">
            <p className="text-sm leading-relaxed">{post.content}</p>
          </div>

          {post.image && (
            <div className="w-full max-h-[500px] overflow-hidden bg-[var(--bg-secondary)] border-y border-[var(--border-primary)]">
              <ImageWithFallback
                src={post.image}
                alt="Post"
                className="w-full h-full object-contain"
              />
            </div>
          )}

          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button
                onClick={() => toggleLike(post.id)}
                className="flex items-center gap-2 hover:text-[var(--brand-orange)] transition-colors"
              >
                <Heart
                  size={22}
                  className={
                    post.isLiked
                      ? "text-[var(--brand-orange)] fill-[var(--brand-orange)]"
                      : "text-[var(--text-primary)]"
                  }
                />
                <span className="text-sm">{post.likes}</span>
              </button>

              <button
                onClick={() => openComments(post.id)}
                className="flex items-center gap-2 hover:text-[var(--brand-orange)] transition-colors"
              >
                <MessageCircle size={22} />
                <span className="text-sm">{post.comments}</span>
              </button>
            </div>

            <button
              onClick={() => {
                navigator
                  .share?.({
                    title: post.userName,
                    text: post.content,
                  })
                  .catch(() => alert("Share is not available here"));
              }}
              className="hover:text-[var(--brand-orange)] transition-colors"
            >
              <Share2 size={22} />
            </button>
          </div>
        </div>
      ))}

      <CommentModal
        isOpen={Boolean(activeCommentModal)}
        onClose={() => {
          setActiveCommentModal(null);
          setComments([]);
        }}
        comments={comments}
        isLoading={commentsLoading}
        onAddComment={handleAddComment}
      />
    </div>
  );
}