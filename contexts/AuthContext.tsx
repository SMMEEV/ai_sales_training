import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  onAuthStateChanged,
  User,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  sendEmailVerification,
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import toast from "react-hot-toast";

interface UserProfile {
  name: string;
  email: string;
  avatarUrl?: string;
  theme: "light" | "dark";
  language: "id" | "en";
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRedirectResult(auth).catch((error: any) => {
      if (error?.code && error.code !== "auth/popup-closed-by-user") {
        console.error("Redirect sign-in error", error);
      }
    });

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (currentUser) {
        const fallbackProfile: UserProfile = {
          name: currentUser.displayName || "Sales Force User",
          email: currentUser.email || "",
          avatarUrl: currentUser.photoURL || "",
          theme: "dark",
          language: "id",
        };
        setProfile((prev) => prev || fallbackProfile);

        // Send email verification if not verified (even though Google accounts usually are)
        if (!currentUser.emailVerified) {
          try {
            await sendEmailVerification(currentUser);
            toast.success(
              "Kami telah mengirimkan email verifikasi ke " + currentUser.email,
            );
          } catch (e) {
            console.log("Could not send email", e);
          }
        }
        // Fetch or create user profile
        try {
          const userRef = doc(db, "users", currentUser.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            setProfile(userSnap.data() as UserProfile);
          } else {
            await setDoc(userRef, {
              ...fallbackProfile,
              createdAt: Date.now(),
              updatedAt: Date.now(),
            });
            setProfile(fallbackProfile);
          }
        } catch (e: any) {
          console.error("Error setting up user profile", e);
          setProfile(fallbackProfile);
        }
      } else {
        setProfile(null);
      }
    });

    return unsubscribe;
  }, []);

  const signIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      if (
        error.code === "auth/popup-closed-by-user" ||
        error.code === "auth/cancelled-popup-request"
      ) {
        toast.error("Proses login dibatalkan.");
      } else if (error.code === "auth/popup-blocked") {
        if (window.self === window.top) {
          await signInWithRedirect(auth, provider);
        } else {
          toast.error(
            "Popup login diblokir browser. Izinkan popup atau buka aplikasi di tab browser utama (Chrome/Safari).",
          );
        }
      } else if (error.code === "auth/unauthorized-domain") {
        console.error("Unauthorized domain:", window.location.hostname);
        toast.error(
          `Domain "${window.location.hostname}" belum terdaftar di Firebase Authorized Domains.`,
        );
      } else if (error.code === "auth/network-request-failed") {
        toast.error("Koneksi jaringan bermasalah. Periksa internet Anda.");
      } else {
        console.error("Sign in failed", error);
        toast.error("Gagal login: " + (error.message || "Unknown error"));
      }
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, { ...updates, updatedAt: Date.now() });
    setProfile((prev) => (prev ? { ...prev, ...updates } : null));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signIn,
        signOut,
        updateProfile: updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
