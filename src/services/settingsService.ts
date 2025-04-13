
import { getFirestore, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import app from "@/lib/firebase";

// Initialize Firestore
const db = getFirestore(app);

// LocalStorage key
const LOCAL_STORAGE_SETTINGS_KEY = "pathwise-user-settings";

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

// Local Storage Helpers
const getSettingsFromLocalStorage = (userId: string): UserSettings | null => {
  try {
    const storedSettings = localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY);
    if (!storedSettings) return null;
    
    const allSettings = JSON.parse(storedSettings);
    // Find settings for this user
    const userSettings = allSettings.find((settings: UserSettings) => settings.userId === userId);
    
    if (!userSettings) return null;
    
    // Parse dates
    return {
      ...userSettings,
      createdAt: userSettings.createdAt ? new Date(userSettings.createdAt) : undefined,
      updatedAt: userSettings.updatedAt ? new Date(userSettings.updatedAt) : undefined,
    };
  } catch (error) {
    console.error("Error reading settings from localStorage:", error);
    return null;
  }
};

const saveSettingsToLocalStorage = (settings: UserSettings): void => {
  try {
    // Get all existing settings
    const storedSettings = localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY);
    let allSettings: UserSettings[] = [];
    
    if (storedSettings) {
      const parsedSettings = JSON.parse(storedSettings);
      // Filter out settings for the current user (we'll replace them)
      allSettings = parsedSettings.filter(
        (s: UserSettings) => s.userId !== settings.userId
      );
    }
    
    // Add the updated settings
    allSettings.push(settings);
    
    localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(allSettings));
  } catch (error) {
    console.error("Error saving settings to localStorage:", error);
  }
};

// Get user settings
export const getUserSettings = async (userId: string): Promise<UserSettings> => {
  try {
    // Try Firestore first
    const settingsRef = doc(db, "user-settings", userId);
    const settingsDoc = await getDoc(settingsRef);
    
    if (settingsDoc.exists()) {
      const data = settingsDoc.data();
      
      // Create settings object
      const settings = {
        ...(data as UserSettings),
        userId,
      };
      
      // Also save to localStorage
      saveSettingsToLocalStorage(settings);
      
      return settings;
    } else {
      // Create default settings for new users
      const newSettings: UserSettings = {
        userId,
        ...defaultSettings,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      await setDoc(settingsRef, newSettings);
      
      // Also save to localStorage
      saveSettingsToLocalStorage(newSettings);
      
      return newSettings;
    }
  } catch (error) {
    console.error("Error getting user settings from Firestore:", error);
    console.log("Falling back to localStorage for settings");
    
    // Fall back to localStorage
    const localSettings = getSettingsFromLocalStorage(userId);
    
    if (localSettings) {
      return localSettings;
    } else {
      // Create new default settings
      const newSettings: UserSettings = {
        userId,
        ...defaultSettings,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      // Save to localStorage
      saveSettingsToLocalStorage(newSettings);
      
      return newSettings;
    }
  }
};

// Update user settings
export const updateUserSettings = async (
  userId: string, 
  settings: Partial<UserSettings>
): Promise<void> => {
  try {
    // Try Firestore first
    const settingsRef = doc(db, "user-settings", userId);
    await updateDoc(settingsRef, {
      ...settings,
      updatedAt: new Date(),
    });
    
    // If successful, also update localStorage
    const existingSettings = getSettingsFromLocalStorage(userId);
    if (existingSettings) {
      const updatedSettings: UserSettings = {
        ...existingSettings,
        ...settings,
        updatedAt: new Date(),
      };
      saveSettingsToLocalStorage(updatedSettings);
    }
  } catch (error) {
    console.error("Error updating user settings in Firestore:", error);
    console.log("Falling back to localStorage for updating settings");
    
    // Fall back to localStorage
    const existingSettings = getSettingsFromLocalStorage(userId);
    if (existingSettings) {
      const updatedSettings: UserSettings = {
        ...existingSettings,
        ...settings,
        updatedAt: new Date(),
      };
      saveSettingsToLocalStorage(updatedSettings);
    } else {
      // If no existing settings, create new ones with the updates
      const newSettings: UserSettings = {
        userId,
        ...defaultSettings,
        ...settings,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      saveSettingsToLocalStorage(newSettings);
    }
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
