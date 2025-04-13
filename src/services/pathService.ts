
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where } from "firebase/firestore";
import app from "@/lib/firebase";

// Initialize Firestore
const db = getFirestore(app);

// Collection references
const pathsCollection = collection(db, "learning-paths");

// LocalStorage key
const LOCAL_STORAGE_PATHS_KEY = "pathwise-learning-paths";

export type LearningPath = {
  id?: string;
  userId: string;
  title: string;
  progress: number;
  totalCourses: number;
  completedCourses: number;
  lastAccessed: string;
  deadline: Date;
  createdAt?: Date;
  updatedAt?: Date;
};

// Local Storage Helpers
const getPathsFromLocalStorage = (userId: string): LearningPath[] => {
  try {
    const storedPaths = localStorage.getItem(LOCAL_STORAGE_PATHS_KEY);
    if (!storedPaths) return [];
    
    const allPaths = JSON.parse(storedPaths);
    // Filter by userId and parse dates
    return allPaths
      .filter((path: LearningPath) => path.userId === userId)
      .map((path: LearningPath) => ({
        ...path,
        deadline: new Date(path.deadline),
        createdAt: path.createdAt ? new Date(path.createdAt) : undefined,
        updatedAt: path.updatedAt ? new Date(path.updatedAt) : undefined,
      }));
  } catch (error) {
    console.error("Error reading from localStorage:", error);
    return [];
  }
};

const savePathsToLocalStorage = (paths: LearningPath[]): void => {
  try {
    // Get all existing paths for other users
    const storedPaths = localStorage.getItem(LOCAL_STORAGE_PATHS_KEY);
    let allPaths: LearningPath[] = [];
    
    if (storedPaths) {
      const parsedPaths = JSON.parse(storedPaths);
      // Filter out paths for the current user (we'll replace them)
      allPaths = parsedPaths.filter(
        (path: LearningPath) => !paths.some(p => p.userId === path.userId)
      );
    }
    
    // Add the updated paths
    allPaths = [...allPaths, ...paths];
    
    localStorage.setItem(LOCAL_STORAGE_PATHS_KEY, JSON.stringify(allPaths));
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
};

// Get all paths for a user
export const getUserPaths = async (userId: string): Promise<LearningPath[]> => {
  try {
    // Try Firestore first
    const userPathsQuery = query(pathsCollection, where("userId", "==", userId));
    const snapshot = await getDocs(userPathsQuery);
    
    const paths = snapshot.docs.map(doc => {
      const data = doc.data();
      
      // Convert Firebase Timestamp to Date if present
      const deadline = data.deadline && typeof data.deadline.toDate === 'function'
        ? data.deadline.toDate()
        : new Date(data.deadline);
      
      return {
        ...(data as Omit<LearningPath, 'id' | 'deadline'>),
        id: doc.id,
        deadline: deadline,
      } as LearningPath;
    });
    
    // If successful, also cache in localStorage
    savePathsToLocalStorage(paths);
    return paths;
  } catch (error) {
    console.error("Error getting user paths from Firestore:", error);
    console.log("Falling back to localStorage for paths");
    
    // Fall back to localStorage
    return getPathsFromLocalStorage(userId);
  }
};

// Generate a unique ID for localStorage
const generateLocalId = (): string => {
  return 'local-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
};

// Add a new path
export const addPath = async (path: Omit<LearningPath, "id">): Promise<string> => {
  try {
    const pathWithTimestamps = {
      ...path,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    // Try Firestore first
    const docRef = await addDoc(pathsCollection, pathWithTimestamps);
    
    // If successful, also cache in localStorage
    const newPath = { ...pathWithTimestamps, id: docRef.id };
    const existingPaths = getPathsFromLocalStorage(path.userId);
    savePathsToLocalStorage([...existingPaths, newPath]);
    
    return docRef.id;
  } catch (error) {
    console.error("Error adding path to Firestore:", error);
    console.log("Falling back to localStorage for adding path");
    
    // Fall back to localStorage
    const localId = generateLocalId();
    const newPath = { 
      ...path, 
      id: localId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const existingPaths = getPathsFromLocalStorage(path.userId);
    savePathsToLocalStorage([...existingPaths, newPath]);
    
    return localId;
  }
};

// Update an existing path
export const updatePath = async (id: string, path: Partial<LearningPath>): Promise<void> => {
  try {
    // Try Firestore first
    const pathRef = doc(db, "learning-paths", id);
    await updateDoc(pathRef, {
      ...path,
      updatedAt: new Date(),
    });
    
    // If successful, also update localStorage
    const userId = path.userId as string;
    const existingPaths = getPathsFromLocalStorage(userId);
    const updatedPaths = existingPaths.map(p => 
      p.id === id ? { ...p, ...path, updatedAt: new Date() } : p
    );
    savePathsToLocalStorage(updatedPaths);
  } catch (error) {
    console.error("Error updating path in Firestore:", error);
    console.log("Falling back to localStorage for updating path");
    
    // Fall back to localStorage
    // We need the userId to get the right paths, so ensure it's available
    const userId = path.userId as string;
    if (!userId) {
      const existingPaths = getPathsFromLocalStorage(""); // Get all paths
      const existingPath = existingPaths.find(p => p.id === id);
      if (!existingPath) {
        throw new Error("Path not found in localStorage");
      }
      
      // Get the userId from the existing path
      const pathUserId = existingPath.userId;
      const userPaths = getPathsFromLocalStorage(pathUserId);
      const updatedPaths = userPaths.map(p => 
        p.id === id ? { ...p, ...path, updatedAt: new Date() } : p
      );
      savePathsToLocalStorage(updatedPaths);
    } else {
      // We have the userId, so we can update directly
      const existingPaths = getPathsFromLocalStorage(userId);
      const updatedPaths = existingPaths.map(p => 
        p.id === id ? { ...p, ...path, updatedAt: new Date() } : p
      );
      savePathsToLocalStorage(updatedPaths);
    }
  }
};

// Delete a path
export const deletePath = async (id: string): Promise<void> => {
  try {
    // Try Firestore first
    const pathRef = doc(db, "learning-paths", id);
    await deleteDoc(pathRef);
    
    // If successful, also update localStorage
    // We need to find the path in localStorage to get the userId
    const allPaths = localStorage.getItem(LOCAL_STORAGE_PATHS_KEY);
    if (allPaths) {
      const parsedPaths = JSON.parse(allPaths);
      const updatedPaths = parsedPaths.filter((p: LearningPath) => p.id !== id);
      localStorage.setItem(LOCAL_STORAGE_PATHS_KEY, JSON.stringify(updatedPaths));
    }
  } catch (error) {
    console.error("Error deleting path from Firestore:", error);
    console.log("Falling back to localStorage for deleting path");
    
    // Fall back to localStorage
    const allPaths = localStorage.getItem(LOCAL_STORAGE_PATHS_KEY);
    if (allPaths) {
      const parsedPaths = JSON.parse(allPaths);
      const updatedPaths = parsedPaths.filter((p: LearningPath) => p.id !== id);
      localStorage.setItem(LOCAL_STORAGE_PATHS_KEY, JSON.stringify(updatedPaths));
    }
  }
};

// Update path progress
export const updatePathProgress = async (
  id: string, 
  progress: number, 
  completedCourses: number
): Promise<void> => {
  try {
    // Try Firestore first
    const pathRef = doc(db, "learning-paths", id);
    await updateDoc(pathRef, {
      progress,
      completedCourses,
      lastAccessed: "Just now",
      updatedAt: new Date(),
    });
    
    // If successful, also update localStorage
    const allPaths = localStorage.getItem(LOCAL_STORAGE_PATHS_KEY);
    if (allPaths) {
      const parsedPaths = JSON.parse(allPaths);
      const updatedPaths = parsedPaths.map((p: LearningPath) => 
        p.id === id 
          ? { 
              ...p, 
              progress, 
              completedCourses, 
              lastAccessed: "Just now", 
              updatedAt: new Date() 
            } 
          : p
      );
      localStorage.setItem(LOCAL_STORAGE_PATHS_KEY, JSON.stringify(updatedPaths));
    }
  } catch (error) {
    console.error("Error updating path progress in Firestore:", error);
    console.log("Falling back to localStorage for updating path progress");
    
    // Fall back to localStorage
    const allPaths = localStorage.getItem(LOCAL_STORAGE_PATHS_KEY);
    if (allPaths) {
      const parsedPaths = JSON.parse(allPaths);
      const updatedPaths = parsedPaths.map((p: LearningPath) => 
        p.id === id 
          ? { 
              ...p, 
              progress, 
              completedCourses, 
              lastAccessed: "Just now", 
              updatedAt: new Date()
            } 
          : p
      );
      localStorage.setItem(LOCAL_STORAGE_PATHS_KEY, JSON.stringify(updatedPaths));
    }
  }
};
