"use client";
// Custom Nucleus SVG Logo
const NucleusLogo = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="28" height="28">
    <defs>
      <linearGradient id="n-gradient" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#6366F1" />
        <stop offset="100%" stop-color="#EC4899" />
      </linearGradient>
    </defs>
    <text x="50%" y="50%" text-anchor="middle" dominant-baseline="central" font-family="Arial Black, Arial, Helvetica, sans-serif" font-size="44" font-weight="bold" fill="#fff">N</text>
  </svg>
);

export default function WelcomeBanner({ onLogout }: { onLogout?: () => void }) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const userName = "Moneyhead..";

  return (
    <div className="fixed top-0 left-0 w-full bg-white dark:bg-zinc-900 shadow-md px-6 py-4 flex items-center justify-between z-30">
      {/* Left Side: Greeting */}
      <div className="flex items-center gap-4">
        <div className="bg-gradient-to-br from-indigo-400 to-fuchsia-500 rounded-full w-12 h-12 flex items-center justify-center text-white shadow-md">
          <NucleusLogo />
        </div>
        <div className="flex flex-col">
          <h2 className="text-xl font-extrabold bg-gradient-to-r from-blue-600 to-pink-500 text-transparent bg-clip-text">
            Welcome to Nucleus!
          </h2>
          <p className="text-gray-900 dark:text-white text-sm">
            <span className="font-medium">{getGreeting()}, {userName}</span> <span className="ml-1">👋</span>
          </p>
        </div>
      </div>

      {/* Right Side: Logout Button */}
      <button
        className="text-sm font-medium bg-gradient-to-r from-blue-600 to-pink-500 hover:from-blue-700 hover:to-pink-600 text-white px-4 py-2 rounded-md transition"
        onClick={() => onLogout && onLogout()}
      >
        Logout
      </button>
    </div>
  );
}
