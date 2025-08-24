import { PiUsersThreeThin } from "react-icons/pi";

function ClubCard({ club, user = {} }) {
  return (
    <div
      title={club.name}
      className="group hover:bg-gray-50/50 mx-auto my-3 w-[90%] sm:w-[80%] md:w-6/7 lg:w-3/5 ring-1 ring-gray-300 rounded-2xl shadow-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
    >
      {club.coverImage ? (
        <div className="overflow-hidden rounded-t-2xl aspect-video">
          <img
            src={club.coverImage}
            alt={club.name}
            className="object-cover max-w-full transition-transform duration-500 overflow-clip group-hover:scale-150 aspect-video rounded-t-2xl"
          />
        </div>
      ) : (
        <PiUsersThreeThin className="mx-auto font-light text-gray-300 size-40" />
      )}
      <div className="p-6">
        <h2 className="flex items-center justify-between text-lg font-semibold text-gray-700">
          {club.name}{" "}
          {club.admins.includes(user._id) && (
            <span className="px-3 py-1 text-xs font-medium text-green-500 border border-green-500 rounded-full bg-green-500/10">
              Admin
            </span>
          )}
        </h2>
        <p className="text-sm max-w-[320px] sm:max-w-[350px] truncate text-gray-500">{club.description}</p>
      </div>
    </div>
  );
}

export default ClubCard;
