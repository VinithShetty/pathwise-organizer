
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where } from "firebase/firestore";
import app from "@/lib/firebase";

// Initialize Firestore
const db = getFirestore(app);

// Collection references
const pathsCollection = collection(db, "learning-paths");

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

// Get all paths for a user
export const getUserPaths = async (userId: string): Promise<LearningPath[]> => {
  try {
    const userPathsQuery = query(pathsCollection, where("userId", "==", userId));
    const snapshot = await getDocs(userPathsQuery);
    
    return snapshot.docs.map(doc => {
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
  } catch (error) {
    console.error("Error getting user paths:", error);
    throw error;
  }
};

// Add a new path
export const addPath = async (path: Omit<LearningPath, "id">): Promise<string> => {
  try {
    const pathWithTimestamps = {
      ...path,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const docRef = await addDoc(pathsCollection, pathWithTimestamps);
    return docRef.id;
  } catch (error) {
    console.error("Error adding path:", error);
    throw error;
  }
};

// Update an existing path
export const updatePath = async (id: string, path: Partial<LearningPath>): Promise<void> => {
  try {
    const pathRef = doc(db, "learning-paths", id);
    await updateDoc(pathRef, {
      ...path,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error("Error updating path:", error);
    throw error;
  }
};

// Delete a path
export const deletePath = async (id: string): Promise<void> => {
  try {
    const pathRef = doc(db, "learning-paths", id);
    await deleteDoc(pathRef);
  } catch (error) {
    console.error("Error deleting path:", error);
    throw error;
  }
};

// Update path progress
export const updatePathProgress = async (
  id: string, 
  progress: number, 
  completedCourses: number
): Promise<void> => {
  try {
    const pathRef = doc(db, "learning-paths", id);
    await updateDoc(pathRef, {
      progress,
      completedCourses,
      lastAccessed: "Just now",
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error("Error updating path progress:", error);
    throw error;
  }
};
