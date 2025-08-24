import { memo, useState, useCallback, useMemo } from "react";
import { LuUsers } from "react-icons/lu";
import { HiMiniUserCircle } from "react-icons/hi2";
import moment from "moment";

export const ProfileImage = memo(({ profileImageUrl, userName, size = 8 }) => {
  const [isImageBroken, setIsImageBroken] = useState(false);

  const handleImageError = useCallback(() => {
    setIsImageBroken(true);
  }, []);

  if (profileImageUrl && !isImageBroken) {
    return (
      <img
        src={profileImageUrl}
        alt={`${userName}'s profile`}
        className={`w-${size} h-${size} rounded-full bg-cover object-cover`}
        onError={handleImageError}
        loading="lazy"
      />
    );
  }

  return (
    <HiMiniUserCircle
      className={`text-gray-300 rounded-full size-${size}`}
      aria-label={`${userName}'s profile`}
    />
  );
});

export const ClubLink = memo(({ club, onClick }) => (
  <div
    onClick={onClick}
    className="flex items-center gap-1 mb-1 text-sm text-gray-400 transition-colors cursor-pointer w-fit hover:underline sm:text-base"
    role="button"
    tabIndex={0}
    onKeyDown={(e) => e.key === "Enter" && onClick()}
  >
    <LuUsers size={16} />
    <p>{club?.name}</p>
  </div>
));

export const TimeStamp = memo(({ createdAt }) => {
  const timeAgo = useMemo(() => {
    return moment(createdAt).fromNow();
  }, [createdAt]);

  return (
    <p
      className="text-xs text-gray-500"
      title={moment(createdAt).format("LLLL")}
    >
      • {timeAgo}
    </p>
  );
});

export const AuthorInfo = memo(({ author, createdAt }) => {
  return (
    <div className="flex items-center gap-2 mb-2">
      <h3 className="text-sm font-semibold truncate sm:text-base text-black/80">
        {author?.name}
      </h3>
      <TimeStamp createdAt={createdAt} />
    </div>
  );
});