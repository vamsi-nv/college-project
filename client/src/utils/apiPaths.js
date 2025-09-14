export const base_url = "https://csphere-sever.onrender.com";

export const api_paths = {
  auth: {
    register: "/api/user/register",
    login: "/api/user/login",
    get_current_user: "/api/user/current-user",
    update_current_user: "/api/user/current-user",
    google_auth: "/api/user/auth/google",
  },

  admin: {
    get_all_users: "/api/user",
  },

  clubs: {
    create_club: "/api/clubs",
    join_club: (id) => `/api/clubs/${id}/join`,
    leave_club: (id) => `/api/clubs/${id}/leave`,
    get_all_clubs: "/api/clubs",
    get_user_clubs: "/api/clubs/user",
    get_club: (id) => `/api/clubs/${id}`,
    update_club: (id) => `/api/clubs/${id}`,
    delete_club: (id) => `/api/clubs/${id}`,
    toggle_admin: (id) => `/api/clubs/${id}/admin/toggle`,
    remover_member_from_club: (id) => `/api/clubs/${id}/members`,
  },

  events: {
    create_event: "/api/events",
    get_all_events: (clubId) => {
      return clubId ? `/api/events?clubId=${clubId}` : `/api/events`;
    },
    get_user_club_events: `/api/events?userOnly=true`,
    get_event: (id) => `/api/events/${id}`,
    get_events_createdBy_me: `/api/events?createdByMe=true`,
    update_event: (id) => `/api/events/${id}`,
    delete_event: (id) => `/api/events/${id}`,
    rsvp_event: (id) => `/api/events/${id}/rsvp`,
  },

  announcements: {
    create_announcement: "/api/announcements",
    get_all_announcements: (clubId) => {
      return clubId
        ? `/api/announcements?clubId=${clubId}`
        : "/api/announcements";
    },
    get_user_club_announcements: `/api/announcements?userOnly=true`,
    get_announcement: (id) => `/api/announcements/${id}`,
    get_announcements_createdBy_me: `/api/announcements?postedByMe=true`,
    update_announcement: (id) => `/api/announcements/${id}`,
    delete_announcement: (id) => `/api/announcements/${id}`,
    toggle_pin: (id) => `/api/announcements/${id}/pin`,
  },

  notifications: {
    get_all_notifications: "/api/notifications",
    delete_notification: (notificationId) =>
      `/api/notifications/${notificationId}`,
    delete_all_notifications: `/api/notifications`,
    get_unread_count: "/api/notifications/unread-count",
  },

  messages: {
    send_message: "/api/messages",
    get_messages: "/api/messages",
    get_unread_messages_count: "/api/messages/unread-count",
    mark_read_many: "/api/messages/mark-read-many",
  },
};
