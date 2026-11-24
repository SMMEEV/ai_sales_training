import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { LogOut, Settings, User, Check, Edit2, X } from "lucide-react";

export const ProfileMenu: React.FC = () => {
  const { user, profile, signIn, signOut, updateProfile } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [editName, setEditName] = useState("");
  const [editAvatar, setEditAvatar] = useState("");

  const AVATARS = [
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Nala",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Jack",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Mia",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver",
  ];

  if (!user || !profile) {
    return (
      <button
        onClick={signIn}
        className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-bold text-sm transition-all duration-300 px-4 py-2.5 rounded-full hover:bg-indigo-50 active:scale-95 active:bg-indigo-100"
      >
        <svg
          viewBox="0 0 24 24"
          width="18"
          height="18"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
            <path
              fill="#4285F4"
              d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
            />
            <path
              fill="#34A853"
              d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
            />
            <path
              fill="#FBBC05"
              d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"
            />
            <path
              fill="#EA4335"
              d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
            />
          </g>
        </svg>
        Sign In
      </button>
    );
  }

  const handleOpenEdit = () => {
    setEditName(profile.name);
    setEditAvatar(profile.avatarUrl || AVATARS[0]);
    setIsEditing(true);
  };

  const handleSaveProfile = async () => {
    await updateProfile({ name: editName, avatarUrl: editAvatar });
    setIsEditing(false);
  };

  const toggleTheme = async () => {
    await updateProfile({ theme: profile.theme === "dark" ? "light" : "dark" });
  };

  const toggleLanguage = async () => {
    await updateProfile({ language: profile.language === "en" ? "id" : "en" });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 transition-colors focus:ring-2 focus:ring-indigo-500 focus:outline-none"
      >
        <img
          src={profile.avatarUrl || AVATARS[0]}
          alt="Profile"
          className="w-10 h-10 rounded-full border-2 border-slate-200 object-cover"
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden z-50 animate-fade-in origin-top-right !text-left">
          {/* Header */}
          <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
            <img
              src={profile.avatarUrl || AVATARS[0]}
              alt="Profile"
              className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
            />
            <div className="flex flex-col truncate overflow-hidden">
              <span className="font-bold text-slate-900 truncate">
                {profile.name}
              </span>
              <span className="text-sm text-slate-500 truncate">
                {profile.email}
              </span>
            </div>
          </div>

          <div className="p-2 space-y-1">
            {!isEditing ? (
              <>
                <button
                  onClick={handleOpenEdit}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm font-semibold text-slate-700 rounded-xl hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                >
                  <Edit2 className="w-4 h-4" /> Edit Profile
                </button>
                <div className="h-px bg-slate-100 my-1 mx-2"></div>
                <div className="px-3 py-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">
                    Settings
                  </span>
                </div>
                <button
                  onClick={toggleTheme}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm font-semibold text-slate-700 rounded-xl hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  Theme: {profile.theme === "dark" ? "Gelap" : "Terang"}
                </button>
                <button
                  onClick={toggleLanguage}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm font-semibold text-slate-700 rounded-xl hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                >
                  <span className="w-4 h-4 text-center">🌐</span>
                  Language:{" "}
                  {profile.language === "en" ? "English" : "Indonesia"}
                </button>
                <div className="h-px bg-slate-100 my-1 mx-2"></div>
                <button
                  onClick={signOut}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm font-semibold text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Log Out
                </button>
              </>
            ) : (
              <div className="p-2">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-bold text-slate-900 text-sm">
                    Edit Profile
                  </span>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 mb-1 block">
                      Nama
                    </label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full text-sm border-slate-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm border px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 mb-2 block">
                      Pilih Avatar
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {AVATARS.map((av) => (
                        <button
                          key={av}
                          onClick={() => setEditAvatar(av)}
                          className={`rounded-lg overflow-hidden border-2 transition-all ${editAvatar === av ? "border-indigo-500 shadow-md scale-105" : "border-slate-100 hover:border-slate-300"}`}
                        >
                          <img
                            src={av}
                            alt="avatar"
                            className="w-full h-auto bg-slate-50"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={handleSaveProfile}
                    className="w-full flex justify-center items-center gap-2 py-2 bg-indigo-600 text-white text-sm font-bold rounded-xl shadow-sm hover:bg-indigo-700 transition"
                  >
                    Simpan
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
