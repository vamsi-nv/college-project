import { IoCloseOutline } from "react-icons/io5";
import { motion } from "motion/react";

function Modal({ setIsModalOpen, children, loading }) {
  return (
    <div
      onClick={() => !loading && setIsModalOpen(false)}
      className="fixed inset-0 flex items-center justify-center w-full px-2 z-60 bg-gray-700/50 backdrop-blur-xl"
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm p-4 mx-auto border border-gray-200 rounded-lg shadow-lg sm:max-w-lg sm:p-8 bg-gray-50"
      >
        {children}
        <button
          onClick={() => setIsModalOpen(false)}
          className="absolute p-2 rounded-full hover:bg-primary/10 hover:text-primary top-5 right-5"
        >
          <IoCloseOutline className="size-5" />
        </button>
      </motion.div>
    </div>
  );
}

export default Modal;
