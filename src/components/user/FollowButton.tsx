"use client";
import { useUserStore } from '@/store/user';
import Button from '@/components/ui/Button';

interface FollowButtonProps {
  userId: string;
}

export default function FollowButton({ userId }: FollowButtonProps) {
  const { currentUser, followUser, unfollowUser } = useUserStore();

  if (!currentUser || currentUser.id.toString() === userId) return null;
  const isFollowing = currentUser.following.includes(userId);

  return isFollowing ? (
    <Button size="sm" variant="outline" onClick={() => unfollowUser(userId)}>
      Unfollow
    </Button>
  ) : (
    <Button size="sm" variant="primary" onClick={() => followUser(userId)}>
      Follow
    </Button>
  );
}
