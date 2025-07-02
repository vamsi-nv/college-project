import { PiUsersThreeThin } from "react-icons/pi";

function ClubCard({ club }) {
  return (
    <div title={club.name} className="hover:bg-gray-50/50 mx-auto my-3 w-[96%] sm:w-[80%] md:w-6/7 lg:w-3/5 border border-gray-300 rounded-2xl shadow-gray-300/80 hover:shadow-[0_0_10px] hover:scale-105 transition-all duration-300 cursor-pointer">
      {club.coverImage ? (
        <img
          src={club.coverImage}
          alt={club.name}
          className="object-cover aspect-video rounded-t-2xl"
        />
      ) : (
        <PiUsersThreeThin className="mx-auto font-light text-gray-300 size-40" />
      )}
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-700">{club.name}</h2>
        <p className="text-sm text-gray-500">{club.description}</p>
      </div>
    </div>
  );
}

export default ClubCard;
