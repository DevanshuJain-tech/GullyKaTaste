import { useState } from 'react';
import { X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

interface Comment {
  id: string;
  userName: string;
  userAvatar: string;
  comment: string;
  timestamp: string;
}

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  currentComments: number;
  onAddComment: (comment: string) => void;
}

export function CommentModal({
  isOpen,
  onClose,
  postId,
  currentComments,
  onAddComment
}: CommentModalProps) {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 'c1',
      userName: 'Priya Singh',
      userAvatar: 'PS',
      comment: 'Looks delicious! I need to visit this place!',
      timestamp: '2 hours ago'
    },
    {
      id: 'c2',
      userName: 'Rajesh Kumar',
      userAvatar: 'RK',
      comment: 'The best food in the area! 🔥',
      timestamp: '5 hours ago'
    }
  ]);

  const handleAddComment = () => {
    if (commentText.trim()) {
      const newComment = {
        id: `c${comments.length + 1}`,
        userName: user?.name || 'Current User',
        userAvatar: (user?.name || 'CU').substring(0, 2).toUpperCase(),
        comment: commentText,
        timestamp: 'Just now'
      };
      setComments([newComment, ...comments]);
      onAddComment(commentText);
      setCommentText('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-[var(--bg-primary)] rounded-t-3xl shadow-2xl z-50 max-h-[80vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[var(--border-primary)]">
              <h2 className="text-xl font-bold">
                {language === 'en' ? 'Comments' : 'टिप्पणियाँ'} ({comments.length})
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-[var(--bg-secondary)] rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {comments.map((comment) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3"
                >
                  <div className="size-10 rounded-full bg-gradient-to-br from-[var(--brand-orange)] to-[var(--brand-orange-dark)] flex items-center justify-center font-semibold text-white text-sm flex-shrink-0">
                    {comment.userAvatar}
                  </div>
                  <div className="flex-1">
                    <div className="bg-[var(--bg-secondary)] rounded-2xl p-3">
                      <p className="font-semibold text-sm mb-1">{comment.userName}</p>
                      <p className="text-sm">{comment.comment}</p>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] mt-1 ml-3">
                      {comment.timestamp}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Comment Input */}
            <div className="p-4 border-t border-[var(--border-primary)] bg-[var(--bg-primary)]">
              <div className="flex gap-3 items-end">
                <div className="size-10 rounded-full bg-gradient-to-br from-[var(--brand-orange)] to-[var(--brand-orange-dark)] flex items-center justify-center font-semibold text-white text-sm flex-shrink-0">
                  {(user?.name || 'CU').substring(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 flex gap-2">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={
                      language === 'en'
                        ? 'Add a comment...'
                        : 'एक टिप्पणी जोड़ें...'
                    }
                    rows={1}
                    className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-2xl py-3 px-4 focus:outline-none focus:border-[var(--brand-orange)] transition-colors resize-none"
                  />
                  <button
                    onClick={handleAddComment}
                    disabled={!commentText.trim()}
                    className="size-12 bg-[var(--brand-orange)] text-white rounded-full flex items-center justify-center hover:bg-[var(--brand-orange-dark)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                  >
                    <Send size={20} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
