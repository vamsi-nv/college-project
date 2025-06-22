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

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Routes>
        <Route
          path="/"
          element={user ? <HomeLayout /> : <Navigate to="/login" />}
        >
          <Route index element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/clubs" element={<Clubs/>}/>
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route
          path="/register"
          element={!user ? <Signup /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/" />}
        />
      </Routes>
    </div>
  );
}

export default App;
