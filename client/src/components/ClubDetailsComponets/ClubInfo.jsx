import { useState } from "react";
import { LuUsers } from "react-icons/lu";
import Modal from "../Modal";

function ClubInfo({ club, user, onJoinClub, onLeaveClub, children }) {
  const isOwner = club?.createdBy?._id === user?._id;
  const isMember = club?.members?.some((member) => member._id === user._id);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAgreedTnC, setIsAgreedTnc] = useState(false);

  const handleJoinClub = () => {
    setIsModalOpen(true);
  };

  const handleConfirmJoin = () => {
    if (isAgreedTnC) {
      onJoinClub(); 
      setIsModalOpen(false);
      setIsAgreedTnc(false);
    }
  };

  return (
    <div className="relative z-10 px-6 py-4">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h1 className="mb-2 text-2xl font-bold text-gray-900 truncate">
            {club?.name}
          </h1>
          <p className="mb-4 leading-relaxed text-gray-600">
            {club?.description}
          </p>
          <div className="flex items-center text-sm text-gray-500">
            <LuUsers className="w-4 h-4 mr-1" />
            <span>{club?.members?.length || 0} members</span>
          </div>
        </div>

        <div className="flex items-center gap-3 ml-4">
          {!isOwner &&
            (isMember ? (
              <button
                onClick={onLeaveClub}
                className="px-6 py-2 text-sm font-medium text-red-500 transition-colors border border-red-500 rounded-full bg-red-50 hover:bg-red-100"
              >
                Leave Club
              </button>
            ) : (
              <button
                onClick={handleJoinClub}
                className="px-6 py-2 text-sm font-medium text-white transition-colors rounded-full bg-primary hover:bg-primary/90"
              >
                Join Club
              </button>
            ))}
          {children}
        </div>
      </div>

      {isModalOpen && (
        <Modal setIsModalOpen={setIsModalOpen}>
          <div className="p-4">
            <h2 className="mb-3 text-lg font-semibold">Club Rules</h2>
            <ul className="mb-4 space-y-2 text-gray-700 list-disc list-inside max-sm:text-xs">
              <li>Respect all members and maintain a positive environment.</li>
              <li>Participate actively in discussions and events.</li>
              <li>Follow the club&apos;s code of conduct and guidelines.</li>
              <li>No spamming, offensive content, or harassment.</li>
              <li>Contribute towards the club&apos;s growth and community.</li>
            </ul>

            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="agree"
                checked={isAgreedTnC}
                onChange={(e) => setIsAgreedTnc(e.target.checked)}
                className="w-4 h-4 border-gray-300 rounded text-primary"
              />
              <label
                htmlFor="agree"
                className="ml-2 text-sm text-gray-600 cursor-pointer"
              >
                I have read and agree to follow the rules
              </label>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm transition-colors bg-gray-200 rounded-full hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmJoin}
                disabled={!isAgreedTnC}
                className={`px-4 py-2 text-sm rounded-full transition-colors ${
                  isAgreedTnC
                    ? "bg-primary text-white hover:bg-primary/90"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Confirm & Join
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default ClubInfo;
