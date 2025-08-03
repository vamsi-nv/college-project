import AnnouncementCard from "../AnnouncementCard";

function ClubAnnouncementsList({
  announcements,
  onAnnouncementDelete,
  onTogglePin,
}) {
  if (!announcements?.length) {
    return (
      <div className="py-12 text-center bg-white">
        <p className="text-gray-500">No announcements yet</p>
      </div>
    );
  }

  return (
    <div>
      {announcements.map((announcement) => (
        <AnnouncementCard
          key={announcement._id}
          announcement={announcement}
          onDelete={onAnnouncementDelete}
          onTogglePin={onTogglePin}
        />
      ))}
    </div>
  );
}

export default ClubAnnouncementsList;
