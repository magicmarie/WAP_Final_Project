import React from "react";
import { Link } from "react-router-dom";

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 text-gray-800">
      <h1 className="text-6xl font-bold text-red-500">404</h1>
      <p className="text-xl mt-2">Oops! Page Not Found.</p>
      <Link to="/" className="mt-4 bg-blue-600 text-white px-2  rounded shadow hover:bg-blue-700">
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;
