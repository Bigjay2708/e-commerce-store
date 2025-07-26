"use client";
import { useParams } from 'next/navigation';
import { useUserStore } from '@/store/user';
import FollowButton from '@/components/user/FollowButton';
import { FaUserFriends, FaCalendarAlt } from 'react-icons/fa';
import Image from 'next/image';

export default function UserProfilePage() {
  const { id } = useParams();
  const { getUserById, getFollowers, getFollowing } = useUserStore();
  const user = getUserById(id as string);
  const followers = getFollowers(id as string);
  const following = getFollowing(id as string);

  if (!user) return (
    <div className="container mx-auto px-4 py-12 text-center">
      <h2 className="text-2xl font-bold mb-4">User not found</h2>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <div className="flex flex-col items-center bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <div className="relative mb-4">
          <Image
            src={user.avatar || '/default-avatar.png'}
            alt={user.username}
            width={96}
            height={96}
            className="rounded-full border-4 border-blue-500"
          />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          {user.name.firstname} {user.name.lastname}
        </h1>
        <p className="text-gray-500 mb-2">@{user.username}</p>
        <p className="text-gray-700 dark:text-gray-300 mb-4 text-center max-w-md">
          {user.bio || 'No bio yet.'}
        </p>
        <div className="flex items-center space-x-4 mb-4">
          <span className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <FaUserFriends className="mr-1" /> {followers.length} Followers
          </span>
          <span className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <FaUserFriends className="mr-1" /> {following.length} Following
          </span>
          <span className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <FaCalendarAlt className="mr-1" /> Joined {user.joined}
          </span>
        </div>
        <FollowButton userId={user.id.toString()} />
      </div>
    </div>
  );
}
