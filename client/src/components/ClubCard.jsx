import { PiUsersThreeThin } from "react-icons/pi";

function ClubCard({ club, user = {} }) {
  return (
    <div
      title={club.name}
      className="group hover:bg-gray-50/50 mx-auto my-3 w-[90%] sm:w-[80%] md:w-6/7 lg:w-3/5 ring-1 ring-gray-300 rounded-2xl shadow-gray-300/80 hover:shadow-[0_0_10px] hover:ring-primary transition-all duration-300 cursor-pointer"
    >
      {club.coverImage ? (
        <div className="overflow-hidden rounded-t-2xl aspect-video">
          <img
            src={club.coverImage}
            alt={club.name}
            className="object-cover max-w-full overflow-clip transition-transform duration-500 group-hover:scale-150 aspect-video rounded-t-2xl"
          />
        </div>
      ) : (
        <PiUsersThreeThin className="mx-auto font-light text-gray-300 size-40" />
      )}
      <div className="p-4">
        <h2 className="text-lg flex items-center justify-between font-semibold text-gray-700">
          {club.name}{" "}
          {club.admins.includes(user._id) && (
            <span className="px-3 py-1 text-xs font-medium text-green-500 border border-green-500 rounded-full bg-green-500/10">
              Admin
            </span>
          )}
        </h2>
        <p className="text-sm text-gray-500">{club.description}</p>
      </div>
    </div>
  );
}

export default ClubCard;
