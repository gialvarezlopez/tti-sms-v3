import Link from "next/link";

function NotFoundPage() {
  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-100 text-gray-900">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-red-600">404</h1>
          <h2 className="mt-4 text-2xl font-medium text-gray-800">
            Oops! Page Not Found
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            The page you are looking for doesn’t exist or has been moved.
          </p>
          <div className="mt-6">
            <a
              href="/"
              className="inline-block px-6 py-3 text-lg font-semibold text-white bg-blue-600 rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
            >
              Go Back to Home
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export default NotFoundPage;
