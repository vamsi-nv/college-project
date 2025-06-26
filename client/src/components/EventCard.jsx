import { LuUsers } from "react-icons/lu";
import { FiClock } from "react-icons/fi";
import moment from "moment";
import { RxDotsHorizontal } from "react-icons/rx";
import { api_paths } from "../utils/apiPaths";
import axiosInstance from "../utils/axiosInstance";

function EventCard({ event }) {
  const handleDelete = async (id) => {
    try {
      const response = await axiosInstance.delete(
        api_paths.events.delete_event(id)
      );
      const data = response.data;
      if (data.success) {
        console.log("Event deleted");
      } else {
        
        
      }
    } catch (error) {
      console.log(error.response?.data?.message);
      
    }
  };

  return (
    <div className="flex flex-col relative border-b border-gray-300 p-6 md:p-8">
      <div className="flex items-center gap-1 text-gray-400 font-medium text-sm">
        <LuUsers />
        <p>{event.club.name}</p>
      </div>
      <div className="flex items-center gap-2 mb-2">
        <p className="text-base font-semibold">{event.createdBy.name}</p>
        <p className="text-xs text-gray-500">
          {" "}
          • {moment(event.createdAt).fromNow()}
        </p>
      </div>
      <div>
        <p>{event.title}</p>
        <p>{event.description}</p>
      </div>
      <div className="absolute top-4 right-4 text-md flex items-center justify-center gap-1 hover:bg-primary/10 hover:text-primary rounded-full p-2 cursor-pointer">
        <RxDotsHorizontal className="" onClick={() => handleDelete(event._id)} />

        {/* <FiClock /> */}
        {/* <div className="flex items-center gap-0.5"> */}
        {/* <span>{moment(event.date).format("MMM Do, YYYY")}</span> */}
        {/* <span>•</span> */}
        {/* <span>{moment(event.date).format("hh:mm A")}</span> */}
        {/* </div> */}
      </div>
    </div>
  );
}

export default EventCard;
