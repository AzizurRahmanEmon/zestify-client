"use client";
import Image from "next/image";
import { avatarColors } from "@/data";

interface CommentAvatarProps {
  name: string;
  avatar?: string;
  size?: "sm" | "md";
}

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const getAvatarColor = (name: string) => {
  const index = name.charCodeAt(0) % avatarColors.length;
  return avatarColors[index];
};

const CommentAvatar = ({ name, avatar, size = "md" }: CommentAvatarProps) => {
  const isSmall = size === "sm";
  return (
    <div className="shrink-0">
      {avatar ? (
        <Image
          src={avatar}
          alt={`${name}'s avatar`}
          width={isSmall ? 32 : 48}
          height={isSmall ? 32 : 48}
          className={`${isSmall ? "w-8 h-8" : "w-12 h-12"} rounded-full object-cover ${isSmall ? "shadow-sm" : "shadow-md ring-2 ring-white"}`}
        />
      ) : (
        <div
          className={`${isSmall ? "w-8 h-8 text-xs" : "w-12 h-12 text-lg"} rounded-full flex items-center justify-center text-white font-bold ${getAvatarColor(name)} ${isSmall ? "shadow-sm" : "shadow-md"}`}
        >
          {getInitials(name)}
        </div>
      )}
    </div>
  );
};

export default CommentAvatar;
