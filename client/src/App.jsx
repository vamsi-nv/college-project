import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/UserContextProvider";
import Loader from "./components/Loader";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, lazy, Suspense, useMemo } from "react";
import socket, { registerSocket } from "./utils/socket";
import Chat from "./pages/Chat";

const Signup = lazy(() => import("./pages/Signup"));
const Login = lazy(() => import("./pages/Login"));
const HomeLayout = lazy(() => import("./layout/HomeLayout"));
const Home = lazy(() => import("./pages/Home"));
const Notifications = lazy(() => import("./pages/Notifications"));
const Profile = lazy(() => import("./pages/Profile"));
const Explore = lazy(() => import("./pages/Explore"));
const Clubs = lazy(() => import("./pages/Clubs"));
const ClubDetails = lazy(() => import("./pages/ClubDetails"));
const Admin = lazy(() => import("./pages/Admin/Admin"));
const AdminClubsPage = lazy(() => import("./pages/Admin/AdminClubsPage"));
const AdminDashboard = lazy(() => import("./pages/Admin/AdminDashboard"));
const EventDetails = lazy(() => import("./pages/EventDetails"));
const LandingPage = lazy(() => import("./pages/LandingPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

function App() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (user?._id) {
      registerSocket(user._id);

      const handleNotification = (data) => {
        toast(`New event posted on ${data.club}`);
      };

      socket.on("notification", handleNotification);

      return () => socket.off("notification", handleNotification);
    }
  }, [user?._id]);

  const routes = useMemo(() => {
    if (loading) return null;

    return (
      <Routes>
        {!user && (
          <>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Signup />} />
          </>
        )}

        {user && (
          <>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/" element={<HomeLayout />}>
              <Route path="home" element={<Home />} />
              <Route path="explore" element={<Explore />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="clubs" element={<Clubs />} />
              <Route path="chat" element={<Chat />} />
              <Route path="profile" element={<Profile />} />
              <Route path="clubs/:id" element={<ClubDetails />} />
              <Route
                path="clubs/:clubName/events/:id"
                element={<EventDetails />}
              />
            </Route>
          </>
        )}

        {user?.isAdmin ? (
          <>
            <Route
              path="/admin"
              element={<Navigate to="/admin/dashboard" replace />}
            />
            <Route path="/admin" element={<Admin />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="clubs" element={<AdminClubsPage />} />
            </Route>
          </>
        ) : (
          <Route path="/admin/*" element={<Navigate to="/" replace />} />
        )}

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    );
  }, [user, loading]);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50 max-sm:overflow-x-hidden">
      <Toaster position="top-center" reverseOrder={false} />
      <Suspense fallback={<Loader />}>{routes}</Suspense>
    </div>
  );
}

export default App;
