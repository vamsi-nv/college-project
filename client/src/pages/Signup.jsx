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
import { HiMiniUserCircle } from "react-icons/hi2";

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
        navigate("/");
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

  if (loading) return <Loader />;

  return (
    <div className="flex items-center justify-center min-h-screen px-2 bg-gradient-to-t from-primary/90 to-primary/10">
      <div className="w-full max-w-sm p-4 mx-auto border border-gray-200 rounded-lg shadow-lg sm:max-w-lg sm:p-8 bg-gray-50">
        <h2 className="mx-2 my-5 text-xl font-semibold text-center sm:mx-4 sm:text-2xl text-primary ">
          Sign Up
        </h2>
        <form
          onSubmit={handleSignUp}
          className="flex flex-col gap-1 p-2 sm:gap-2 sm:p-4"
        >
          <ProfilePhotoSelector
            image={image}
            setImage={setImage}
            Icon={HiMiniUserCircle}
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

          <p className="mb-2 ml-2 text-xs text-gray-400 sm:text-sm sm:mb-4 sm:ml-4">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="underline cursor-pointer text-neutral-800"
            >
              login
            </span>
          </p>

          <button type="submit" className="w-full form-submit-btn">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
