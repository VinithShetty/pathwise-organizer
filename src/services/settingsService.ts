
import { getFirestore, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import app from "@/lib/firebase";

// Initialize Firestore
const db = getFirestore(app);

export interface UserSettings {
  userId: string;
  theme: "light" | "dark" | "system";
  goalHoursPerWeek: number;
  emailNotifications: boolean;
  dashboardLayout: "compact" | "standard" | "detailed";
  accentColor: string;
  reminderTime?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const defaultSettings: Omit<UserSettings, "userId"> = {
  theme: "system",
  goalHoursPerWeek: 15,
  emailNotifications: true,
  dashboardLayout: "standard",
  accentColor: "#3b82f6",
};

// Get user settings
export const getUserSettings = async (userId: string): Promise<UserSettings> => {
  try {
    const settingsRef = doc(db, "user-settings", userId);
    const settingsDoc = await getDoc(settingsRef);
    
    if (settingsDoc.exists()) {
      const data = settingsDoc.data();
      
      // Return with proper date handling
      return {
        ...(data as UserSettings),
        userId,
      };
    } else {
      // Create default settings for new users
      const newSettings: UserSettings = {
        userId,
        ...defaultSettings,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      await setDoc(settingsRef, newSettings);
      return newSettings;
    }
  } catch (error) {
    console.error("Error getting user settings:", error);
    throw error;
  }
};

// Update user settings
export const updateUserSettings = async (
  userId: string, 
  settings: Partial<UserSettings>
): Promise<void> => {
  try {
    const settingsRef = doc(db, "user-settings", userId);
    await updateDoc(settingsRef, {
      ...settings,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error("Error updating user settings:", error);
    throw error;
  }
};

// Update theme setting
export const updateUserTheme = async (
  userId: string, 
  theme: "light" | "dark" | "system"
): Promise<void> => {
  return updateUserSettings(userId, { theme });
};

// Update goal hours
export const updateGoalHours = async (
  userId: string,
  goalHoursPerWeek: number
): Promise<void> => {
  return updateUserSettings(userId, { goalHoursPerWeek });
};

// Update notification preferences
export const updateNotificationPreferences = async (
  userId: string,
  emailNotifications: boolean
): Promise<void> => {
  return updateUserSettings(userId, { emailNotifications });
};

// Update dashboard layout
export const updateDashboardLayout = async (
  userId: string,
  dashboardLayout: "compact" | "standard" | "detailed"
): Promise<void> => {
  return updateUserSettings(userId, { dashboardLayout });
};

// Update accent color
export const updateAccentColor = async (
  userId: string,
  accentColor: string
): Promise<void> => {
  return updateUserSettings(userId, { accentColor });
};
