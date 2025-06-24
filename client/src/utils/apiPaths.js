export const base_url = "http://localhost:3000";

export const api_paths = {
  auth: {
    register: "/api/auth/register",
    login: "/api/auth/login",
    get_current_user: "/api/auth/current-user",
  },

  clubs : {
    create_club : "/api/clubs",
    join_club : (id) => `/api/clubs/${id}/join`,
    get_all_clubs : "/api/clubs",
    get_club : (id) => `/api/clubs/${id}`,
  }
};
