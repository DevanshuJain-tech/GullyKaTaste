import { useCallback, useEffect, useMemo, useState } from "react";
import { BottomNav } from "../components/BottomNav";
import { ReelsView } from "../components/ReelsView";
import { createReelComment, getReels, type ReelItem } from "../lib/api";

function mapReels(reels: ReelItem[]) {
  return reels.map((reel) => ({
    id: reel.id,
    vendorName: reel.vendorName,
    thumbnail: reel.thumbnailUrl,
    videoUrl: reel.videoUrl,
    likes: reel.likes_count,
    comments: reel.comments_count,
    description: reel.description ?? "",
  }));
}

export function ReelsPage() {
  const [reels, setReels] = useState<ReelItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadReels = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getReels({ pageSize: 30 });
      setReels(response.data);
    } catch {
      setReels([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReels();
  }, [loadReels]);

  const viewReels = useMemo(() => mapReels(reels), [reels]);

  const handleAddComment = useCallback(async (reelId: string, comment: string) => {
    await createReelComment(reelId, { comment });

    setReels((previous) =>
      previous.map((reel) =>
        reel.id === reelId
          ? {
              ...reel,
              comments_count: reel.comments_count + 1,
            }
          : reel,
      ),
    );
  }, []);

  return (
    <div className="h-screen bg-[#1A1A1A] text-white flex flex-col overflow-hidden">
      {loading ? (
        <div className="flex-1 flex items-center justify-center text-gray-400">Loading reels...</div>
      ) : (
        <ReelsView reels={viewReels} onAddComment={handleAddComment} />
      )}
      <BottomNav activeTab="reels" />
    </div>
  );
}
