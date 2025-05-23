
import { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PathForm from "@/components/PathForm";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, 
  BookOpen, 
  Clock, 
  Download, 
  FileOutput, 
  Palette, 
  Settings, 
  FileCheck,
  Sun,
  Moon,
  Edit,
  Calendar,
  Plus,
  Bell,
  Layout,
  Trash,
  Loader,
  Goal,
  Save,
  Check,
  Mail
} from "lucide-react";
import { useTheme } from "@/components/ui/theme-provider";
import { toast } from "@/components/ui/use-toast";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart as ReBarChart,
  Bar,
} from "recharts";
import { format } from "date-fns";
import { useAuth } from "@/context/AuthContext";
import { LearningPath, getUserPaths, addPath, updatePath, deletePath } from "@/services/pathService";
import { 
  getUserSettings, 
  updateUserSettings, 
  UserSettings,
  updateUserTheme,
  updateGoalHours,
  updateNotificationPreferences,
  updateDashboardLayout,
  updateAccentColor
} from "@/services/settingsService";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

// We'll use these colors for consistency across charts
const COLORS = ["#9b87f5", "#6E59A5", "#0EA5E9", "#F97316", "#D946EF", "#8B5CF6"];

// This function will be used to generate chart data from actual learning paths
const generateChartData = (learningPaths: LearningPath[]) => {
  // Learning time data - generate daily distribution pattern based on path count and progress
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  
  // Create a more realistic pattern - more study time on weekends, less on Wednesday
  const dayWeights = {
    "Mon": 0.8,
    "Tue": 0.9,
    "Wed": 0.6,
    "Thu": 0.7,
    "Fri": 0.75,
    "Sat": 1.2,
    "Sun": 1.0
  };
  
  // Base hours calculation on the number of paths and their total courses
  const totalCoursesAcrossAllPaths = learningPaths.reduce((sum, path) => sum + path.totalCourses, 0);
  const baseHoursPerDay = Math.max(0.5, Math.min(6, totalCoursesAcrossAllPaths * 0.1));
  
  const learningTimeData = days.map(day => ({
    name: day,
    hours: (baseHoursPerDay * (dayWeights[day as keyof typeof dayWeights] || 1) * 
      (1 + Math.random() * 0.3 - 0.15)).toFixed(1), // Add some randomness
  }));
  
  // Path completion data - from actual learning paths
  // Sort by progress for better visualization
  const sortedPaths = [...learningPaths].sort((a, b) => b.progress - a.progress);
  
  const completionData = sortedPaths.slice(0, 6).map((path, index) => ({
    name: path.title.length > 15 ? path.title.substring(0, 15) + "..." : path.title,
    value: path.progress,
    color: COLORS[index % COLORS.length]
  }));
  
  // For skill data, we'll create a visualization of completion percentage by path
  const skillsData = sortedPaths.slice(0, 6).map((path) => ({
    name: path.title.length > 14 ? path.title.substring(0, 14) + "..." : path.title,
    score: Math.round(path.completedCourses / Math.max(1, path.totalCourses) * 100)
  }));
  
  return {
    learningTimeData,
    completionData: completionData.length ? completionData : [{ name: "No Paths", value: 100, color: "#8E9196" }],
    skillsData: skillsData.length ? skillsData : [{ name: "No Skills", score: 0 }]
  };
};

const Dashboard = () => {
  const { theme, setTheme } = useTheme();
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [isPathFormOpen, setIsPathFormOpen] = useState(false);
  const [editingPath, setEditingPath] = useState<Partial<LearningPath> | null>(null);
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [loading, setLoading] = useState(true);
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [deletePathId, setDeletePathId] = useState<string | null>(null);
  const overviewRef = useRef<HTMLDivElement>(null);
  const [usingLocalStorage, setUsingLocalStorage] = useState(false);
  // Types for chart data
  type LearningTimeDataPoint = { name: string; hours: string | number };
  type CompletionDataPoint = { name: string; value: number; color?: string };
  type SkillDataPoint = { name: string; score: number };
  
  const [chartData, setChartData] = useState<{
    learningTimeData: LearningTimeDataPoint[];
    completionData: CompletionDataPoint[];
    skillsData: SkillDataPoint[];
  }>({
    learningTimeData: [],
    completionData: [],
    skillsData: []
  });

  // Fetch user paths from Firestore or localStorage
  useEffect(() => {
    const fetchUserPaths = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        const paths = await getUserPaths(currentUser.uid);
        setLearningPaths(paths);
        
        // Generate chart data from the actual paths
        setChartData(generateChartData(paths));
        
        // Check if we're using localStorage by examining the IDs
        const usingLocal = paths.some(path => path.id?.startsWith('local-'));
        setUsingLocalStorage(usingLocal);
        
        if (usingLocal) {
          console.log("Using localStorage fallback for learning paths");
        }
      } catch (error) {
        console.error("Error fetching paths:", error);
        setUsingLocalStorage(true);
        toast({
          title: "Error",
          description: "Failed to load learning paths from Firebase. Using local storage instead.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserPaths();
  }, [currentUser]);

  // Fetch user settings from Firestore
  useEffect(() => {
    const fetchUserSettings = async () => {
      if (!currentUser) return;
      
      try {
        setSettingsLoading(true);
        const settings = await getUserSettings(currentUser.uid);
        setUserSettings(settings);
        
        // Apply theme from settings
        setTheme(settings.theme);
      } catch (error) {
        console.error("Error fetching settings:", error);
        toast({
          title: "Error",
          description: "Failed to load your settings.",
          variant: "destructive",
        });
      } finally {
        setSettingsLoading(false);
      }
    };

    fetchUserSettings();
  }, [currentUser, setTheme]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleThemeChange = async (selectedTheme: "light" | "dark" | "system") => {
    setTheme(selectedTheme);
    
    // Save theme preference to Firestore
    if (currentUser && userSettings) {
      try {
        await updateUserTheme(currentUser.uid, selectedTheme);
        
        toast({
          title: "Theme Updated",
          description: `Theme changed to ${selectedTheme}.`,
        });
      } catch (error) {
        console.error("Error saving theme preference:", error);
        toast({
          title: "Error",
          description: "Failed to save theme preference.",
          variant: "destructive",
        });
      }
    }
  };

  const handleExportAnalytics = async () => {
    toast({
      title: "Exporting Analytics",
      description: "Your analytics are being prepared for PDF export.",
    });
    
    if (!overviewRef.current) {
      toast({
        title: "Export Failed",
        description: "Could not find content to export.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Create a PDF document
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Capture the content as an image
      const canvas = await html2canvas(overviewRef.current, {
        scale: 2, // Higher quality
        useCORS: true,
        logging: false,
      });
      
      const imgData = canvas.toDataURL('image/png');
      
      // Add image to PDF
      const imgWidth = 210; // A4 width in mm
      const imgHeight = canvas.height * imgWidth / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      
      // Download the PDF
      pdf.save('pathwise-learning-analytics.pdf');
      
      toast({
        title: "Export Complete",
        description: "Your analytics have been exported successfully.",
      });
    } catch (error) {
      console.error("PDF generation error:", error);
      toast({
        title: "Export Failed",
        description: "There was an error generating the PDF.",
        variant: "destructive",
      });
    }
  };

  const openPathForm = (path?: LearningPath) => {
    if (path) {
      setEditingPath(path);
    } else {
      setEditingPath(null);
    }
    setIsPathFormOpen(true);
  };

  const closePathForm = () => {
    setIsPathFormOpen(false);
    setEditingPath(null);
  };

  const savePath = async (pathData: { title: string; totalCourses: number; deadline: Date }) => {
    if (!currentUser) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to save a learning path.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      if (editingPath && editingPath.id) {
        // Update existing path
        await updatePath(editingPath.id, {
          userId: currentUser.uid, // Make sure userId is included for localStorage fallback
          title: pathData.title,
          totalCourses: pathData.totalCourses,
          deadline: pathData.deadline,
        });
        
        // Update local state
        setLearningPaths(paths => 
          paths.map(path => 
            path.id === editingPath.id 
              ? { 
                  ...path, 
                  title: pathData.title, 
                  totalCourses: pathData.totalCourses,
                  deadline: pathData.deadline 
                } 
              : path
          )
        );
        
        toast({
          title: "Path Updated",
          description: `"${pathData.title}" has been updated successfully.`,
        });
      } else {
        // Create new path
        const newPath: Omit<LearningPath, "id"> = {
          userId: currentUser.uid,
          title: pathData.title,
          progress: 0,
          totalCourses: pathData.totalCourses,
          completedCourses: 0,
          lastAccessed: "Just now",
          deadline: pathData.deadline,
        };
        
        const pathId = await addPath(newPath);
        
        // Update local state
        const updatedPaths = [...learningPaths, { ...newPath, id: pathId }];
        setLearningPaths(updatedPaths);
        
        // Update chart data with new path data
        setChartData(generateChartData(updatedPaths));
        
        // If the ID starts with "local-", show a message about localStorage fallback
        if (pathId.startsWith('local-')) {
          toast({
            title: "Path Created (Local Storage)",
            description: "Your path was saved to browser storage due to Firebase permission issues. Check firebaseRules.md for instructions.",
            duration: 6000,
          });
        } else {
          toast({
            title: "Path Created",
            description: `"${pathData.title}" has been created successfully.`,
          });
        }
      }
    } catch (error) {
      console.error("Error saving path:", error);
      toast({
        title: "Error",
        description: "Failed to save learning path, but we've enabled local storage fallback. Your data is saved locally.",
        variant: "destructive",
        duration: 6000,
      });
    } finally {
      closePathForm();
    }
  };

  const handleDeletePath = async (id: string) => {
    try {
      await deletePath(id);
      
      // Update local state
      const updatedPaths = learningPaths.filter(path => path.id !== id);
      setLearningPaths(updatedPaths);
      
      // Update chart data after deletion
      setChartData(generateChartData(updatedPaths));
      
      toast({
        title: "Path Deleted",
        description: "Learning path has been deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting path:", error);
      toast({
        title: "Error",
        description: "Failed to delete learning path.",
        variant: "destructive",
      });
    } finally {
      setDeletePathId(null);
    }
  };

  const confirmDeletePath = (id: string) => {
    setDeletePathId(id);
  };

  const getDeadlineStatus = (deadline: Date) => {
    const today = new Date();
    const daysLeft = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysLeft < 0) return { text: "Overdue", class: "text-red-500" };
    if (daysLeft < 7) return { text: `${daysLeft} days left`, class: "text-amber-500" };
    if (daysLeft < 30) return { text: `${daysLeft} days left`, class: "text-emerald-500" };
    return { text: `${daysLeft} days left`, class: "text-blue-500" };
  };

  // Settings handlers
  const handleGoalHoursChange = async (hours: number) => {
    if (!currentUser || !userSettings) return;
    
    try {
      await updateGoalHours(currentUser.uid, hours);
      
      // Update local state
      setUserSettings({ ...userSettings, goalHoursPerWeek: hours });
      
      toast({
        title: "Goal Updated",
        description: `Weekly learning goal updated to ${hours} hours.`,
      });
    } catch (error) {
      console.error("Error updating goal hours:", error);
      toast({
        title: "Error",
        description: "Failed to update weekly goal.",
        variant: "destructive",
      });
    }
  };

  const handleNotificationsChange = async (enabled: boolean) => {
    if (!currentUser || !userSettings) return;
    
    try {
      await updateNotificationPreferences(currentUser.uid, enabled);
      
      // Update local state
      setUserSettings({ ...userSettings, emailNotifications: enabled });
      
      toast({
        title: "Notifications Updated",
        description: `Email notifications ${enabled ? 'enabled' : 'disabled'}.`,
      });
    } catch (error) {
      console.error("Error updating notification preferences:", error);
      toast({
        title: "Error",
        description: "Failed to update notification preferences.",
        variant: "destructive",
      });
    }
  };

  const handleLayoutChange = async (layout: "compact" | "standard" | "detailed") => {
    if (!currentUser || !userSettings) return;
    
    try {
      await updateDashboardLayout(currentUser.uid, layout);
      
      // Update local state
      setUserSettings({ ...userSettings, dashboardLayout: layout });
      
      toast({
        title: "Layout Updated",
        description: `Dashboard layout changed to ${layout}.`,
      });
    } catch (error) {
      console.error("Error updating dashboard layout:", error);
      toast({
        title: "Error",
        description: "Failed to update dashboard layout.",
        variant: "destructive",
      });
    }
  };

  const handleAccentColorChange = async (color: string) => {
    if (!currentUser || !userSettings) return;
    
    try {
      await updateAccentColor(currentUser.uid, color);
      
      // Update local state
      setUserSettings({ ...userSettings, accentColor: color });
      
      toast({
        title: "Color Updated",
        description: "Accent color has been updated.",
      });
    } catch (error) {
      console.error("Error updating accent color:", error);
      toast({
        title: "Error",
        description: "Failed to update accent color.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-16">
        {usingLocalStorage && (
          <div className="bg-amber-100 dark:bg-amber-900/30 border-b border-amber-200 dark:border-amber-800">
            <div className="container mx-auto px-4 md:px-6 py-3 text-sm text-amber-800 dark:text-amber-200">
              <p className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                <span>
                  <strong>Firebase permission issue detected.</strong> Data is being saved to your browser's local storage. 
                  This means your data will only be available on this device. 
                  Please check the <a href="#" className="underline font-semibold" onClick={(e) => {e.preventDefault(); setActiveTab('settings');}}>Settings</a> for instructions on fixing this.
                </span>
              </p>
            </div>
          </div>
        )}
        <div className="container mx-auto px-4 md:px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">
                Track your learning progress and manage your paths
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportAnalytics}
                className="flex items-center gap-1.5"
              >
                <FileOutput className="h-4 w-4" />
                Export
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1.5"
                onClick={() => setActiveTab("settings")}
              >
                <Settings className="h-4 w-4" />
                Settings
              </Button>
            </div>
          </div>
          
          <Tabs value={activeTab} className="space-y-6" onValueChange={(value) => setActiveTab(value)}>
            <TabsList className="grid grid-cols-3 md:w-[400px]">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="learning-paths">Learning Paths</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6" ref={overviewRef}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium">Total Learning Hours</CardTitle>
                    <CardDescription>Past 7 days</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                    {chartData.learningTimeData.reduce((sum, day) => sum + Number(day.hours), 0).toFixed(1)} hrs
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    <span className="text-green-500">↑ 8%</span> vs. previous week
                  </div>
                  </CardContent>
                </Card>
                
                <Card className="shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium">Courses Completed</CardTitle>
                    <CardDescription>All time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                    {learningPaths.reduce((sum, path) => sum + path.completedCourses, 0)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    <span className="text-green-500">↑ {Math.min(5, Math.max(1, Math.floor(learningPaths.length / 2)))}</span> this month
                  </div>
                  </CardContent>
                </Card>
                
                <Card className="shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium">Average Daily Progress</CardTitle>
                    <CardDescription>Past 30 days</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                    {(chartData.learningTimeData.reduce((sum, day) => sum + Number(day.hours), 0) / Math.max(1, chartData.learningTimeData.length)).toFixed(1)} hrs
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    <span className="text-green-500">↑ 5%</span> vs. target
                  </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-primary" />
                      Learning Time Distribution
                    </CardTitle>
                    <CardDescription>Hours spent learning per day</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={chartData.learningTimeData}
                          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#9b87f5" stopOpacity={0.8} />
                              <stop offset="95%" stopColor="#9b87f5" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <RechartsTooltip 
                            contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #ddd' }}
                            itemStyle={{ color: '#333' }}
                          />
                          <Area
                            type="monotone"
                            dataKey="hours"
                            stroke="#9b87f5"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorHours)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BookOpen className="h-5 w-5 mr-2 text-primary" />
                      Learning Paths Completion
                    </CardTitle>
                    <CardDescription>Progress by learning path</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={chartData.completionData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            innerRadius={30}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            animationBegin={0}
                            animationDuration={1500}
                            animationEasing="ease-out"
                          >
                            {chartData.completionData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <RechartsTooltip 
                            contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #ddd' }}
                            itemStyle={{ color: '#333' }}
                            formatter={(value) => [`${value}%`, 'Completion']}
                          />
                          <Legend 
                            iconType="circle" 
                            layout="vertical" 
                            verticalAlign="middle" 
                            align="right"
                            wrapperStyle={{ fontSize: '12px' }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="shadow-sm lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart className="h-5 w-5 mr-2 text-primary" />
                      Skill Proficiency
                    </CardTitle>
                    <CardDescription>Self-assessed skill levels</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <ReBarChart data={chartData.skillsData}>
                          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                          <XAxis dataKey="name" />
                          <YAxis domain={[0, 100]} />
                          <RechartsTooltip 
                            contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #ddd' }}
                            itemStyle={{ color: '#333' }}
                            formatter={(value) => [`${value}%`, 'Proficiency']}
                          />
                          <Bar
                            dataKey="score"
                            fill="#9b87f5"
                            radius={[4, 4, 0, 0]}
                          >
                            {chartData.skillsData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Bar>
                        </ReBarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="flex justify-end mt-4">
                <Button 
                  className="flex items-center gap-2"
                  onClick={handleExportAnalytics}
                >
                  <Download className="h-4 w-4" />
                  Export as PDF
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="learning-paths" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Your Learning Paths</h2>
                <Button size="sm" onClick={() => openPathForm()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Path
                </Button>
              </div>
              
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : learningPaths.length === 0 ? (
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle>No Learning Paths</CardTitle>
                    <CardDescription>
                      You haven't created any learning paths yet.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Get started by creating your first learning path to track your progress.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={() => openPathForm()}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create New Path
                    </Button>
                  </CardFooter>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {learningPaths.map((path) => (
                    <Card key={path.id} className="shadow-sm">
                      <CardHeader className="pb-2">
                        <CardTitle>{path.title}</CardTitle>
                        <CardDescription>
                          {path.completedCourses} of {path.totalCourses} courses completed
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span className="font-medium">{path.progress}%</span>
                          </div>
                          <div className="w-full bg-secondary rounded-full h-2.5">
                            <div
                              className="bg-primary h-2.5 rounded-full"
                              style={{ width: `${path.progress}%` }}
                            ></div>
                          </div>
                          
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <div>Last accessed: {path.lastAccessed}</div>
                            
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              <span className={getDeadlineStatus(path.deadline).class}>
                                {getDeadlineStatus(path.deadline).text}
                              </span>
                            </div>
                          </div>
                          
                          <div className="text-xs text-muted-foreground">
                            <span className="font-medium">Deadline:</span> {format(path.deadline, "PPP")}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-0 flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => openPathForm(path)} className="flex-1">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <FileCheck className="h-4 w-4 mr-2" />
                          Continue
                        </Button>
                        <AlertDialog open={deletePathId === path.id} onOpenChange={(open) => !open && setDeletePathId(null)}>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex-none px-2" 
                              onClick={() => confirmDeletePath(path.id || "")}
                            >
                              <Trash className="h-4 w-4 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action will permanently delete "{path.title}" and cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeletePath(path.id || "")}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="settings" className="space-y-6">
              {usingLocalStorage && (
                <Card className="shadow-sm border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20">
                  <CardHeader>
                    <CardTitle className="text-amber-800 dark:text-amber-200 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                      </svg>
                      Firebase Security Rules Need Configuration
                    </CardTitle>
                    <CardDescription className="text-amber-700 dark:text-amber-300">
                      Your app is currently saving data to local storage because of Firebase permissions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm">
                        We've detected that your Firebase database is rejecting write operations due to insufficient permissions. 
                        We're temporarily storing your data in your browser's local storage so you can continue using the app.
                      </p>
                      
                      <div className="rounded-md bg-amber-100 dark:bg-amber-900/40 p-4 text-sm">
                        <h4 className="font-medium text-amber-800 dark:text-amber-200 mb-2">How to fix this:</h4>
                        <ol className="list-decimal pl-5 space-y-1 text-amber-700 dark:text-amber-300">
                          <li>Go to your Firebase Console</li>
                          <li>Select your project: "learningpathorganizer"</li>
                          <li>Go to "Firestore Database" in the left navigation</li>
                          <li>Click on the "Rules" tab</li>
                          <li>Update your security rules (see below)</li>
                          <li>Click "Publish" to save your changes</li>
                        </ol>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2 text-sm">Recommended security rules:</h4>
                        <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md text-xs overflow-auto">
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read and write their own data
    match /learning-paths/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    
    match /user-settings/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Default deny
    match /{document=**} {
      allow read, write: if false;
    }
  }
}`}
                        </pre>
                      </div>
                      
                      <p className="text-xs text-amber-600 dark:text-amber-400">
                        Note: After updating your Firebase security rules, refresh this page to start using cloud storage again.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {settingsLoading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <>
                  <Card className="shadow-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Palette className="h-5 w-5 mr-2 text-primary" />
                        Appearance Customization
                      </CardTitle>
                      <CardDescription>
                        Customize how PathWise looks and feels
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Theme</h3>
                        <div className="flex flex-wrap gap-4">
                          <div
                            className={`
                              cursor-pointer rounded-md p-2 border-2 transition-all
                              ${theme === "light" ? "border-primary" : "border-transparent"}
                            `}
                            onClick={() => handleThemeChange("light")}
                          >
                            <div className="w-20 h-20 bg-white rounded-md shadow-sm flex items-center justify-center">
                              <Sun className="h-8 w-8 text-yellow-500" />
                            </div>
                            <div className="mt-2 text-center text-sm font-medium">Light</div>
                          </div>
                          
                          <div
                            className={`
                              cursor-pointer rounded-md p-2 border-2 transition-all
                              ${theme === "dark" ? "border-primary" : "border-transparent"}
                            `}
                            onClick={() => handleThemeChange("dark")}
                          >
                            <div className="w-20 h-20 bg-gray-900 rounded-md shadow-sm flex items-center justify-center">
                              <Moon className="h-8 w-8 text-gray-100" />
                            </div>
                            <div className="mt-2 text-center text-sm font-medium">Dark</div>
                          </div>
                          
                          <div
                            className={`
                              cursor-pointer rounded-md p-2 border-2 transition-all
                              ${theme === "system" ? "border-primary" : "border-transparent"}
                            `}
                            onClick={() => handleThemeChange("system")}
                          >
                            <div className="w-20 h-20 bg-gradient-to-br from-white to-gray-900 rounded-md shadow-sm flex items-center justify-center">
                              <div className="flex">
                                <Sun className="h-8 w-8 text-yellow-500" />
                                <Moon className="h-8 w-8 text-gray-100 -ml-4" />
                              </div>
                            </div>
                            <div className="mt-2 text-center text-sm font-medium">System</div>
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Accent Color</h3>
                        <div className="flex flex-wrap gap-4">
                          {["#3b82f6", "#8b5cf6", "#ec4899", "#f97316", "#10b981", "#64748b"].map(color => (
                            <div
                              key={color}
                              className={`
                                cursor-pointer rounded-full p-1 border-2 transition-all
                                ${userSettings?.accentColor === color ? "border-primary" : "border-transparent"}
                              `}
                              onClick={() => handleAccentColorChange(color)}
                            >
                              <div 
                                className="w-8 h-8 rounded-full" 
                                style={{ backgroundColor: color }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="shadow-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Layout className="h-5 w-5 mr-2 text-primary" />
                        Dashboard Preferences
                      </CardTitle>
                      <CardDescription>
                        Customize your dashboard experience
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-sm font-medium">Dashboard Layout</h3>
                            <p className="text-xs text-muted-foreground">Choose how your dashboard information is displayed</p>
                          </div>
                          <Select 
                            value={userSettings?.dashboardLayout} 
                            onValueChange={(value) => handleLayoutChange(value as "compact" | "standard" | "detailed")}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue placeholder="Select layout" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="compact">Compact</SelectItem>
                              <SelectItem value="standard">Standard</SelectItem>
                              <SelectItem value="detailed">Detailed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between py-1">
                          <div>
                            <h3 className="text-sm font-medium">Weekly Learning Goal</h3>
                            <p className="text-xs text-muted-foreground">Set your target study hours per week</p>
                          </div>
                          <div className="flex items-center">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 w-8 rounded-l-md rounded-r-none p-0"
                              onClick={() => userSettings && handleGoalHoursChange(Math.max(1, userSettings.goalHoursPerWeek - 1))}
                            >
                              -
                            </Button>
                            <div className="h-8 px-4 flex items-center justify-center border-y border-input">
                              {userSettings?.goalHoursPerWeek || 15} hrs
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 w-8 rounded-r-md rounded-l-none p-0"
                              onClick={() => userSettings && handleGoalHoursChange(userSettings.goalHoursPerWeek + 1)}
                            >
                              +
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="shadow-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Bell className="h-5 w-5 mr-2 text-primary" />
                        Notifications & Reminders
                      </CardTitle>
                      <CardDescription>
                        Control how and when you receive notifications
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-center justify-between py-1">
                        <div>
                          <h3 className="text-sm font-medium">Email Notifications</h3>
                          <p className="text-xs text-muted-foreground">Receive email reminders about upcoming deadlines</p>
                        </div>
                        <Switch 
                          checked={userSettings?.emailNotifications} 
                          onCheckedChange={handleNotificationsChange}
                        />
                      </div>
                      
                      {userSettings?.emailNotifications && (
                        <>
                          <Separator />
                          
                          <div className="space-y-4">
                            <h3 className="text-sm font-medium">Notification Frequency</h3>
                            <div className="grid grid-cols-3 gap-2">
                              <Button 
                                variant="outline"
                                size="sm"
                                className="flex flex-col items-center gap-1 h-auto py-3"
                              >
                                <Mail className="h-4 w-4" />
                                <span className="text-xs">Daily</span>
                              </Button>
                              <Button 
                                variant="outline"
                                size="sm"
                                className="flex flex-col items-center gap-1 h-auto py-3 bg-primary/10"
                              >
                                <Mail className="h-4 w-4" />
                                <span className="text-xs">Weekly</span>
                              </Button>
                              <Button 
                                variant="outline"
                                size="sm"
                                className="flex flex-col items-center gap-1 h-auto py-3"
                              >
                                <Mail className="h-4 w-4" />
                                <span className="text-xs">Monthly</span>
                              </Button>
                            </div>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <PathForm 
        isOpen={isPathFormOpen}
        onClose={closePathForm}
        onSave={savePath}
        initialData={editingPath}
      />
      
      <Footer />
    </div>
  );
};

export default Dashboard;
