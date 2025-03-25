
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
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
  FileCheck 
} from "lucide-react";
import { useTheme } from "@/components/ui/theme-provider";
import { toast } from "@/components/ui/use-toast";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart as ReBarChart,
  Bar,
} from "recharts";

// Mock data for charts
const learningTimeData = [
  { name: "Mon", hours: 2 },
  { name: "Tue", hours: 3.5 },
  { name: "Wed", hours: 1.5 },
  { name: "Thu", hours: 4 },
  { name: "Fri", hours: 2.5 },
  { name: "Sat", hours: 5 },
  { name: "Sun", hours: 1 },
];

const completionData = [
  { name: "Web Development", value: 65 },
  { name: "Data Science", value: 30 },
  { name: "UI/UX Design", value: 45 },
  { name: "Mobile Development", value: 20 },
];

const skillsData = [
  { name: "JavaScript", score: 85 },
  { name: "React", score: 72 },
  { name: "Node.js", score: 63 },
  { name: "Python", score: 45 },
  { name: "UX Design", score: 58 },
];

// Mock data for learning paths
const learningPaths = [
  {
    id: 1,
    title: "Full-Stack Web Development",
    progress: 65,
    totalCourses: 12,
    completedCourses: 8,
    lastAccessed: "2 hours ago",
  },
  {
    id: 2,
    title: "Data Science & Machine Learning",
    progress: 30,
    totalCourses: 10,
    completedCourses: 3,
    lastAccessed: "Yesterday",
  },
  {
    id: 3,
    title: "UI/UX Design Fundamentals",
    progress: 45,
    totalCourses: 8,
    completedCourses: 4,
    lastAccessed: "3 days ago",
  },
];

const COLORS = ["#4f46e5", "#7c3aed", "#2563eb", "#0ea5e9"];

const Dashboard = () => {
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  const handleThemeChange = (selectedTheme: "light" | "dark" | "system") => {
    setTheme(selectedTheme);
    toast({
      title: "Theme Updated",
      description: `Theme changed to ${selectedTheme}.`,
    });
  };

  const handleExportAnalytics = () => {
    toast({
      title: "Exporting Analytics",
      description: "Your analytics are being exported to PDF.",
    });
    
    // Simulate export delay
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: "Your analytics have been exported successfully.",
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-16">
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
              >
                <Settings className="h-4 w-4" />
                Settings
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="overview" className="space-y-6" onValueChange={(value) => setActiveTab(value)}>
            <TabsList className="grid grid-cols-3 md:w-[400px]">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="learning-paths">Learning Paths</TabsTrigger>
              <TabsTrigger value="settings">Customize</TabsTrigger>
            </TabsList>
            
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Analytics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium">Total Learning Hours</CardTitle>
                    <CardDescription>Past 7 days</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">20.5 hrs</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      <span className="text-green-500">↑ 12%</span> vs. previous week
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium">Courses Completed</CardTitle>
                    <CardDescription>All time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">15</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      <span className="text-green-500">↑ 3</span> this month
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium">Average Daily Progress</CardTitle>
                    <CardDescription>Past 30 days</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">3.2 hrs</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      <span className="text-green-500">↑ 8%</span> vs. target
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Charts */}
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
                          data={learningTimeData}
                          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Area
                            type="monotone"
                            dataKey="hours"
                            stroke="#3b82f6"
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
                            data={completionData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {completionData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
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
                        <ReBarChart data={skillsData}>
                          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar
                            dataKey="score"
                            fill="#8884d8"
                            radius={[4, 4, 0, 0]}
                          >
                            {skillsData.map((entry, index) => (
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
            
            {/* Learning Paths Tab */}
            <TabsContent value="learning-paths" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Your Learning Paths</h2>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Path
                </Button>
              </div>
              
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
                      <div className="space-y-2">
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
                        <div className="text-xs text-muted-foreground">
                          Last accessed: {path.lastAccessed}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button variant="outline" size="sm" className="w-full">
                        <FileCheck className="h-4 w-4 mr-2" />
                        Continue Learning
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
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
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

// Workaround for missing lucide icon
const Plus = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </svg>
);

export default Dashboard;
