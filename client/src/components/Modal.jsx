import { IoCloseOutline } from "react-icons/io5";

function Modal({ setIsModalOpen, children, loading }) {
  return (
    <div
      onClick={() => !loading && setIsModalOpen(false)}
      className="fixed inset-0 z-10 flex items-center justify-center w-full px-2 bg-gray-900/30 backdrop-blur-xl"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full mx-auto max-w-sm p-4 border border-gray-200 rounded-lg shadow-lg sm:max-w-lg sm:p-8 bg-gray-50"
      >
        {children}
        <button
          onClick={() => setIsModalOpen(false)}
          className="absolute p-2 rounded-full hover:bg-primary/10 hover:text-primary top-5 right-5"
        >
          <IoCloseOutline className="size-5" />
        </button>
      </div>
    </div>
  );
}

export default Modal;
