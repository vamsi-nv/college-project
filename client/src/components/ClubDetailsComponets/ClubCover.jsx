import { PiUsersThreeThin } from "react-icons/pi";

function ClubCover({ coverImage, clubName }) {
  return (
    <div className="relative w-full overflow-hidden h-70">
      {coverImage ? (
        <img
          src={coverImage}
          alt={`${clubName} cover`}
          className="object-cover w-full h-full"
        />
      ) : (
        <div className="flex items-center justify-center h-full">
          <PiUsersThreeThin className="w-32 h-32 text-gray-300" />
        </div>
      )}
      {/* <div className="absolute inset-0 bg-black bg-opacity-20"></div> */}
    </div>
  );
}

export default ClubCover;
