import { useState, useRef, useEffect } from "react";
import { HiMiniUserCircle } from "react-icons/hi2";
import { RxDotsHorizontal } from "react-icons/rx";
import { LuUserMinus } from "react-icons/lu";

function MemberItem({ member, club, user, onToggleAdmin, onRemoveMember }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  const isCurrentUserAdmin = club?.admins?.some(
    (admin) => admin._id === user?._id
  );
  const isMemberAdmin = club?.admins?.some((admin) => admin._id === member._id);
  const canManageMember = isCurrentUserAdmin && user._id !== member._id;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <div className="flex items-center justify-between p-4 transition-colors hover:bg-gray-50">
      <div className="flex items-center w-full gap-3">
        <div className="flex-shrink-0 w-10 h-10">
          {member.profileImageUrl ? (
            <img
              src={member.profileImageUrl}
              alt={member.name}
              className="object-cover w-full h-full rounded-full"
            />
          ) : (
            <HiMiniUserCircle className="w-full h-full text-gray-300" />
          )}
        </div>
        <div className="flex items-center justify-between w-full">
          <p className="font-medium text-gray-900">{member.name}</p>
          {isMemberAdmin && (
            <span className="inline-flex items-center px-6 py-2 text-xs font-medium text-green-600 rounded-full bg-green-500/10">
              Admin
            </span>
          )}
        </div>
      </div>

      {canManageMember && (
        <div className="relative">
          <button
            ref={buttonRef}
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="p-2 transition-colors rounded-full hover:bg-gray-200"
          >
            <RxDotsHorizontal className="w-4 h-4 text-gray-500" />
          </button>

          {isMenuOpen && (
            <div
              ref={menuRef}
              className="absolute right-0 z-10 p-1 mt-1 bg-white border border-gray-200 rounded-lg shadow-md w-45"
            >
              <button
                onClick={() => {
                  onToggleAdmin(member._id);
                  setIsMenuOpen(false);
                }}
                className="w-full px-4 py-3 text-sm text-left text-gray-700 transition-colors rounded hover:bg-primary/10 hover:text-primary"
              >
                {isMemberAdmin ? "Remove as admin" : "Make admin"}
              </button>
              <button
                onClick={() => {
                  onRemoveMember(member._id);
                  setIsMenuOpen(false);
                }}
                className="flex items-center w-full px-4 py-3 text-sm text-left text-red-500 transition-colors rounded hover:bg-red-500/10" 
              >
                <LuUserMinus className="w-4 h-4 mr-2" />
                Remove member
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function MembersList({ club, user, onToggleAdmin, onRemoveMember }) {
  if (!club?.members?.length) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500">No members yet</p>
      </div>
    );
  }

  return (
    <div className="">
      {club.members.map((member) => (
        <MemberItem
          key={member._id}
          member={member}
          club={club}
          user={user}
          onToggleAdmin={onToggleAdmin}
          onRemoveMember={onRemoveMember}
        />
      ))}
    </div>
  );
}

export default MembersList;
