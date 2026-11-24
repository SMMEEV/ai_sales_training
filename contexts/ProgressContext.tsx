import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

interface TrainingProgress {
  academyProgress: number;
  lastWatchedChapter: string;
  hasVisitedAcademy?: boolean;
  updatedAt: number;
}

interface ProgressContextType {
  progress: TrainingProgress | null;
  updateProgress: (updates: Partial<TrainingProgress>) => Promise<void>;
}

const defaultProgress: TrainingProgress = {
  academyProgress: 0,
  lastWatchedChapter: "",
  updatedAt: Date.now(),
};

const ProgressContext = createContext<ProgressContextType>(
  {} as ProgressContextType,
);

export const useProgress = () => useContext(ProgressContext);

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [progress, setProgress] = useState<TrainingProgress | null>(null);

  useEffect(() => {
    const loadProgress = async () => {
      let localData: TrainingProgress | null = null;
      try {
        const stored = localStorage.getItem("training_progress");
        if (stored) localData = JSON.parse(stored);
      } catch (e) {
        console.error("Local storage load error", e);
      }

      if (user) {
        try {
          const docRef = doc(db, "users", user.uid, "progress", "training");
          const docSnap = await getDoc(docRef);

          let fbData: TrainingProgress | null = null;
          if (docSnap.exists()) {
            fbData = docSnap.data() as TrainingProgress;
          }

          // Merge keeping the newest data
          if (fbData && localData) {
            if (fbData.updatedAt > localData.updatedAt) {
              setProgress(fbData);
              try {
                localStorage.setItem("training_progress", JSON.stringify(fbData));
              } catch {}
            } else {
              setProgress(localData);
              await setDoc(docRef, localData, { merge: true });
            }
          } else if (fbData) {
            setProgress(fbData);
            try {
              localStorage.setItem("training_progress", JSON.stringify(fbData));
            } catch {}
          } else if (localData) {
            setProgress(localData);
            await setDoc(docRef, localData, { merge: true });
          } else {
            setProgress(defaultProgress);
          }
        } catch (e) {
          console.error("Failed to load progress from Firebase", e);
          setProgress(localData || defaultProgress);
        }
      } else {
        // Not logged in, rely solely on local state
        setProgress(localData || defaultProgress);
      }
    };
    loadProgress();
  }, [user]);

  const updateProgress = async (updates: Partial<TrainingProgress>) => {
    const newProgress: TrainingProgress = {
      ...(progress || defaultProgress),
      ...updates,
      updatedAt: Date.now(),
    };
    setProgress(newProgress);
    try {
      localStorage.setItem("training_progress", JSON.stringify(newProgress));
    } catch (e) {
      console.error("Local storage save error", e);
    }

    if (user) {
      try {
        const docRef = doc(db, "users", user.uid, "progress", "training");
        await setDoc(docRef, newProgress, { merge: true });
      } catch (e) {
        console.error("Failed to sync progress to Firebase", e);
      }
    }
  };

  return (
    <ProgressContext.Provider value={{ progress, updateProgress }}>
      {children}
    </ProgressContext.Provider>
  );
};
