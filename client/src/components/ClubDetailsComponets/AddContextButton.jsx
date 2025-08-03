import { useState, useRef, useEffect } from "react";
import { LuPlus } from "react-icons/lu";
import { MdEvent, MdAnnouncement } from "react-icons/md";
import { AnimatePresence, motion } from "motion/react";

function AddContentButton({ onCreateEvent, onCreateAnnouncement, isAdmin }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  if (!isAdmin) return null;

  return (
    <div className="relative">
      {isOpen && <div className="fixed z-[80] bg-black/70 inset-0"></div>}
      <motion.button
        ref={buttonRef}
        animate={{ rotate: isOpen ? 45 : 0 }}
        transition={{ duration: 0.1, ease: "easeInOut" }}
        onClick={() => setIsOpen((prev) => !prev)}
        className="p-3 text-white transition-all duration-200 rounded-full shadow-lg bg-primary hover:bg-primary/95 hover:scale-105"
      >
        <LuPlus className="w-5 h-5" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <div
            ref={menuRef}
            className="absolute z-[100] mb-2 space-y-2 bottom-full"
          >
            <motion.button
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              transition={{ duration: 0.2 }}
              onClick={() => {
                onCreateEvent();
                setIsOpen(false);
              }}
              className="flex relative items-center gap-2 p-3 text-white transition-colors rounded-full shadow-lg bg-primary whitespace-nowrap"
            >
              <span className="absolute -left-40 text-sm font-medium">
                Create Event
              </span>
              <MdEvent className="w-5 h-5" />
            </motion.button>

            <motion.button
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              transition={{ duration: 0.2, delay: 0.05 }}
              onClick={() => {
                onCreateAnnouncement();
                setIsOpen(false);
              }}
              className="flex relative items-center gap-2 p-3 text-white transition-colors rounded-full shadow-lg bg-primary whitespace-nowrap"
            >
              <span className="absolute -left-40 text-sm font-medium">
                Create Announcement
              </span>
              <MdAnnouncement className="w-5 h-5" />
            </motion.button>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AddContentButton;
