import EventCard from "../EventCard";

function ClubEventsList({ events, onEventDelete }) {
  if (!events?.length) {
    return (
      <div className="py-12 text-center bg-white">
        <p className="text-gray-500">No events yet</p>
      </div>
    );
  } 

  return (
    <div className="">
      {events.map((event) => (
        <EventCard
          key={event._id}
          event={event}
          onDelete={onEventDelete}
        />
      ))}
    </div>
  );
}

export default ClubEventsList