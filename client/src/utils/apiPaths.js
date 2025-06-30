export const base_url = "http://localhost:3000";

export const api_paths = {
  auth: {
    register: "/api/auth/register",
    login: "/api/auth/login",
    get_current_user: "/api/auth/current-user",
    update_current_user: "/api/auth/current-user",
    // logout: "/api/auth/logout",
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
  },

  events: {
    create_event: "/api/events",
    get_all_events: (clubId) => {
      return clubId ? `/api/events?clubId=${clubId}` : `/api/events`;
    },
    get_user_club_events: `/api/events?userOnly=true`,
    get_event: (id) => `/api/events/${id}`,
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
    update_announcement: (id) => `/api/announcements/${id}`,
    delete_announcement: (id) => `/api/announcements/${id}`,
    toggle_pin: (id) => `/api/announcements/${id}/pin`,
  },
};
