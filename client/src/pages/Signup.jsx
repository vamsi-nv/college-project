import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import axiosInstance from "../utils/axiosInstance.js";
import { api_paths } from "../utils/apiPaths";
import { validateEmail } from "../utils/helper.js";
import { useAuth } from "../context/UserContextProvider.jsx";
import Loader from "../components/Loader";
import ProfilePhotoSelector from "../components/ProfilePhotoSelector.jsx";
import { LuUser } from "react-icons/lu";

function Signup() {
  const { fetchCurrentUser } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!name) {
      setError("Name is required");
      return;
    }
    if (!email) {
      setError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setError("Invalid email format");
      return;
    }

    if (!password) {
      setError("Password is required");
      return;
    }

    setError("");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      if (image) {
        formData.append("image", image);
      }

      const response = await axiosInstance.post(
        api_paths.auth.register,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const data = response.data;
      if (data.success) {
        localStorage.setItem("college-token", response.data.token);
        await fetchCurrentUser();
        navigate("/home");
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong. Please try again"
      );
      console.log(error);
    } finally {  
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative  bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <h2 className="mx-2 my-5 text-3xl font-bold text-center sm:mx-4 sm:text-3xl text-transparent bg-gradient-to-b from-blue-600 via-primary to-blue-600 bg-clip-text">
        Welcome to CSphere
      </h2>
      <p className="text-gray-500 text-sm mb-4">Create your account</p>

      <div className="p-4 rounded-lg shadow-xl border border-gray-100 w-[90%] sm:max-w-md sm:p-8 bg-white">
        <form
          onSubmit={handleSignUp}
          className="flex flex-col gap-1 p-2 sm:gap-2 "
        >
          <ProfilePhotoSelector
            image={image}
            setImage={setImage}
            Icon={LuUser}
          />
          <Input
            value={name}
            id="name"
            onChange={({ target }) => setName(target.value)}
            type="text"
            label="Name"
            placeholder="Enter your name"
          />
          <Input
            value={email}
            id="email"
            onChange={({ target }) => setEmail(target.value)}
            type="email"
            label="Email"
            placeholder="Enter your email"
          />
          <Input
            value={password}
            id="password"
            onChange={({ target }) => setPassword(target.value)}
            type="password"
            label="Password"
            placeholder="Enter your password"
          />
          {error && (
            <p className="mb-2 ml-2 text-xs text-red-500 sm:text-sm sm:mb-3 sm:ml-4">
              *{error}
            </p>
          )}

          <button
            disabled={loading}
            type="submit"
            className="w-full flex items-center justify-center gap-2  transition-all duration-300 form-submit-btn text-white p-4 rounded-lg"
          >
            {loading && (
              <span className="border-2 animate-spin border-t-transparent border-white size-4 rounded-full "></span>
            )}

            {loading ? "Please wait..." : "Signup"}
          </button>
          <p className="mt-2 text-center ml-2 text-xs text-gray-400 sm:text-sm sm:mb-4 sm:ml-4">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="underline cursor-pointer text-neutral-800"
            >
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;
