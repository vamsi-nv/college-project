import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSignUp = (e) => {
    e.preventDefault();
    if (!name) {
      setError("Name is required");
      return;
    }
    if (!email) {
      setError("Email is required");
      return;
    }
    if (!password) {
      setError("Password is required");
      return;
    }

    setError("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-4/5 md:w-3/5 lg:w-2/5 max-w-lg shadow-md border border-gray-200 p-8 bg-gray-50 rounded-lg">
        <h2 className="mx-4 my-5 font-semibold text-2xl text-center">
          Sign Up
        </h2>
        <form onSubmit={handleSignUp} className="flex flex-col">
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
          {error && <p className="text-sm text-red-500 mb-3 ml-4">*{error}</p>}

          <p className="text-sm mb-4 ml-4 text-gray-400">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="cursor-pointer text-neutral-800 underline"
            >
              login
            </span>
          </p>

          <button type="submit" className="form-submit-btn">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
