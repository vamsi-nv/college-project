import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen bg-gray-100">
      <div className="text-center animate-fadeIn">
        <h1 className="font-extrabold text-primary text-8xl sm:text-9xl">
          404
        </h1>
        <h3 className="mt-4 text-2xl font-semibold text-gray-800 sm:text-3xl">
          Oops! Page Not Found
        </h3>
        <p className="max-w-md mx-auto mt-2 text-gray-600">
          The page you're looking for doesn't exist or has been moved. Let's get
          you back on track!
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-3 mt-6 font-medium text-white transition-colors duration-300 rounded-lg shadow-md bg-primary hover:bg-primary/90"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
