import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignInLoginPage = () => {
  const [isLoginView, setIsLoginView] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate fields before navigating
    if (
      (!isLoginView && fullName.trim() === "") ||
      email.trim() === "" ||
      password.trim() === ""
    ) {
      alert("Please fill in all fields.");
      return;
    }

    navigate("/index");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-green-950 text-white px-4 py-12">
      <div className="bg-gradient-to-br from-green-900 to-black p-10 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center">
          {isLoginView ? "Login to Your Account" : "Sign In to Get Started"}
        </h2>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {!isLoginView && (
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2 rounded bg-zinc-800 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded bg-zinc-800 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded bg-zinc-800 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-500 py-2 rounded font-semibold transition"
          >
            {isLoginView ? "Login" : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          {isLoginView ? (
            <p>
              Don’t have an account?{' '}
              <button
                className="text-green-400 underline hover:text-green-300"
                onClick={() => setIsLoginView(false)}
              >
                Sign In
              </button>
            </p>
          ) : (
            <p>
              Already a user?{' '}
              <button
                className="text-green-400 underline hover:text-green-300"
                onClick={() => setIsLoginView(true)}
              >
                Go to Login
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignInLoginPage;
