import Image from 'next/image';

interface UserAvatarProps {
  src?: string;
  alt: string;
  size?: number;
}

export default function UserAvatar({ src, alt, size = 40 }: UserAvatarProps) {
  return (
    <Image
      src={src || '/default-avatar.png'}
      alt={alt}
      width={size}
      height={size}
      className="rounded-full border border-gray-300 dark:border-gray-700"
    />
  );
}
