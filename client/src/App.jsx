import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import { useAuth } from "./context/UserContextProvider";
import Loader from "./components/Loader";
import HomeLayout from "./layout/HomeLayout";
import Home from "./pages/Home";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import Explore from "./pages/Explore";
import Clubs from "./pages/Clubs";
import ClubDetails from "./pages/ClubDetails";
import toast, { Toaster } from "react-hot-toast";
import Admin from "./pages/Admin/Admin";
import AdminClubsPage from "./pages/Admin/AdminClubsPage";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import EventDetails from "./pages/EventDetails";
import LandingPage from "./pages/LandingPage";
import { useEffect } from "react";
import socket, { registerSocket } from "./utils/socket";

function App() {
  const { user, loading } = useAuth();

  if (loading) return <Loader />;

  useEffect(() => {
    if (user?._id) {
      registerSocket(user._id);

      socket.on("notification", (data) => {
        toast(`New event posted on ${data.club}`);
      });

      return () => socket.off("notification");
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 max-sm:overflow-x-hidden">
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        {!user && (
          <>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Signup />} />
          </>
        )}

        {user && (
          <Route path="/" element={<HomeLayout />}>
            <Route index element={<Home />} />
            <Route path="explore" element={<Explore />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="clubs" element={<Clubs />} />
            <Route path="profile" element={<Profile />} />
            <Route path="clubs/:id" element={<ClubDetails />} />
            <Route
              path="clubs/:clubName/events/:id"
              element={<EventDetails />}
            />
          </Route>
        )}

        <Route
          path="/admin"
          element={user?.isAdmin ? <Admin /> : <Navigate to="/" />}
        >
          <Route index element={<AdminDashboard />} />
          <Route path="clubs" element={<AdminClubsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;
