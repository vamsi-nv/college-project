import { useState, useRef, useEffect } from "react";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { LuPen, LuTrash2 } from "react-icons/lu";
import { motion } from "motion/react";

function ClubHeader({ club, user, onEditClub, onDeleteClub }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  const isOwner = club?.createdBy?._id === user?._id;

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
    <div className="flex items-center justify-between p-4 border-b border-gray-300">
      <h1 className="text-xl font-medium text-gray-900 truncate">
        {club?.name}
      </h1>

      {isOwner && (
        <div className="relative">
          <button
            ref={buttonRef}
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Club options"
          >
            <HiOutlineDotsVertical className="w-5 h-5 text-gray-600" />
          </button>

          {isMenuOpen && (
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-md border border-gray-200 p-1 z-50"
            >
              <button
                onClick={() => {
                  onEditClub();
                  setIsMenuOpen(false);
                }}
                className="flex items-center w-full px-4 py-3 rounded text-sm text-gray-700 hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <LuPen className="w-4 h-4 mr-3" />
                Edit Club
              </button>
              <button
                onClick={() => {
                  onDeleteClub();
                  setIsMenuOpen(false);
                }}
                className="flex items-center w-full px-4 py-3 rounded text-sm text-red-500 hover:bg-red-500/10 transition-colors"
              >
                <LuTrash2 className="w-4 h-4 mr-3" />
                Delete Club
              </button>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}

export default ClubHeader;
