import { useCallback, useEffect, useMemo, useState } from "react";
import { Navbar } from "../components/Navbar";
import { BottomNav } from "../components/BottomNav";
import { CommunityView } from "../components/CommunityView";
import type { CommentModalItem } from "../components/CommentModal";
import { HamburgerMenu } from "../components/HamburgerMenu";
import {
  createPostComment,
  getPostComments,
  getPosts,
  type FeedPost,
} from "../lib/api";

function formatRelativeTime(isoString: string) {
  const date = new Date(isoString);
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 1) {
    return "Just now";
  }
  if (diffMinutes < 60) {
    return `${diffMinutes} min ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours} hr ago`;
  }

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
}

function mapPosts(posts: FeedPost[]) {
  return posts.map((post) => {
    const firstImage = post.media.find((mediaItem) => mediaItem.type === "image")?.url;

    return {
      id: post.id,
      userName: post.user.name,
      userAvatar: post.user.avatar,
      location: post.location_text || "Unknown location",
      timestamp: formatRelativeTime(post.created_at),
      content: post.content,
      image: firstImage,
      likes: post.likes_count,
      comments: post.comments_count,
      isLiked: false,
    };
  });
}

function mapComments(items: Awaited<ReturnType<typeof getPostComments>>["data"]): CommentModalItem[] {
  return items.map((item) => ({
    id: item.id,
    userName: item.user.name,
    userAvatar: item.user.avatar,
    comment: item.comment,
    timestamp: formatRelativeTime(item.created_at),
  }));
}

export function CommunityPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getPosts({ pageSize: 30 });
      setPosts(response.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const viewPosts = useMemo(() => mapPosts(posts), [posts]);

  const fetchComments = useCallback(async (postId: string) => {
    const response = await getPostComments(postId, { pageSize: 100 });
    return mapComments(response.data);
  }, []);

  const addComment = useCallback(async (postId: string, comment: string) => {
    await createPostComment(postId, { comment });

    setPosts((previous) =>
      previous.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments_count: post.comments_count + 1,
            }
          : post,
      ),
    );
  }, []);

  return (
    <div className="h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col overflow-hidden">
      <HamburgerMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <Navbar
        currentLocation="Connaught Place, Delhi"
        onMenuClick={() => setMenuOpen(true)}
        notificationCount={0}
      />
      <main className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-6 text-[var(--text-secondary)]">Loading community posts...</div>
        ) : (
          <CommunityView
            posts={viewPosts}
            onFetchComments={fetchComments}
            onAddComment={addComment}
          />
        )}
      </main>
      <BottomNav activeTab="community" />
    </div>
  );
}