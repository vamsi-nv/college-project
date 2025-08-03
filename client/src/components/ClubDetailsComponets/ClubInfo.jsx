import { LuUsers } from "react-icons/lu";

function ClubInfo({ club, user, onJoinClub, onLeaveClub, children }) {
  const isOwner = club?.createdBy?._id === user?._id;
  const isMember = club?.members?.some((member) => member._id === user._id);

  return (
    <div className=" py-4 px-6 relative z-10 ">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900 mb-2 truncate">
            {club?.name}
          </h1>
          <p className="text-gray-600 leading-relaxed mb-4">
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
                className="px-6 py-2 text-sm font-medium text-red-500 bg-red-50 border border-red-500 rounded-full hover:bg-red-100 transition-colors"
              >
                Leave Club
              </button>
            ) : (
              <button
                onClick={onJoinClub}
                className="px-6 py-2 text-sm font-medium text-white bg-primary rounded-full hover:bg-primary/90 transition-colors"
              >
                Join Club
              </button>
            ))}
          {children}
        </div>
      </div>
    </div>
  );
}

export default ClubInfo;
