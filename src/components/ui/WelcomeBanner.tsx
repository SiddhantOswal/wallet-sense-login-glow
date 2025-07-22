"use client";
import { Moon } from "lucide-react";

export default function WelcomeBanner() {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const userName = "User";

  return (
    <div className="w-full bg-white dark:bg-zinc-900 shadow-md px-6 py-4 flex items-center justify-between z-10">
      {/* Left Side: Greeting */}
      <div className="flex items-center gap-4">
        <div className="bg-gradient-to-br from-indigo-400 to-fuchsia-500 rounded-full w-12 h-12 flex items-center justify-center text-white shadow-md">
          <Moon className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <h2 className="text-xl font-extrabold bg-gradient-to-r from-blue-600 to-pink-500 text-transparent bg-clip-text">
            Welcome to WalletSense!
          </h2>
          <p className="text-gray-900 dark:text-white text-sm">
            <span className="font-medium">{getGreeting()}, {userName}</span> <span className="ml-1">👋</span>
          </p>
        </div>
      </div>

      {/* Right Side: Logout Button */}
      <button className="text-sm font-medium bg-gradient-to-r from-blue-600 to-pink-500 hover:from-blue-700 hover:to-pink-600 text-white px-4 py-2 rounded-md transition">
        Logout
      </button>
    </div>
  );
}
