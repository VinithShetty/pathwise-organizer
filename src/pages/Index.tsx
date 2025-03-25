
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  BarChart, 
  FileOutput, 
  Palette, 
  Layout, 
  Zap
} from "lucide-react";

const Index = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-16">
        <Hero />
        
        {/* Features Section */}
        <section className="py-20 bg-secondary/50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Powerful Features
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Everything you need to organize your learning journey effectively
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-animation">
              {/* Feature 1 */}
              <div className="bg-background rounded-xl p-6 shadow-sm border">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Learning Paths</h3>
                <p className="text-muted-foreground">
                  Create custom learning paths to organize your courses and resources in a structured way.
                </p>
              </div>
              
              {/* Feature 2 */}
              <div className="bg-background rounded-xl p-6 shadow-sm border">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <BarChart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Analytics Dashboard</h3>
                <p className="text-muted-foreground">
                  Track your progress with detailed analytics and insights about your learning journey.
                </p>
              </div>
              
              {/* Feature 3 */}
              <div className="bg-background rounded-xl p-6 shadow-sm border">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <FileOutput className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Export Analytics</h3>
                <p className="text-muted-foreground">
                  Export your analytics and progress data in PDF format for sharing or archiving.
                </p>
              </div>
              
              {/* Feature 4 */}
              <div className="bg-background rounded-xl p-6 shadow-sm border">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Palette className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Customizable Themes</h3>
                <p className="text-muted-foreground">
                  Personalize your experience with multiple themes and appearance options.
                </p>
              </div>
              
              {/* Feature 5 */}
              <div className="bg-background rounded-xl p-6 shadow-sm border">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Layout className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Responsive Design</h3>
                <p className="text-muted-foreground">
                  Access your learning paths and analytics from any device with our responsive interface.
                </p>
              </div>
              
              {/* Feature 6 */}
              <div className="bg-background rounded-xl p-6 shadow-sm border">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Performance Insights</h3>
                <p className="text-muted-foreground">
                  Get intelligent recommendations and insights based on your learning patterns.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 md:p-12">
              <div className="max-w-2xl">
                <h2 className="text-3xl font-bold mb-4">
                  Ready to Organize Your Learning Journey?
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Join thousands of learners who are already using PathWise to streamline their education and achieve their goals.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="px-8 rounded-full">
                    Get Started Free
                  </Button>
                  <Button variant="outline" size="lg" className="px-8 rounded-full">
                    View Demo
                  </Button>
                </div>
              </div>
              <div className="relative w-full max-w-sm">
                <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full transform translate-x-4 translate-y-4"></div>
                <img 
                  src="https://images.unsplash.com/photo-1513258496099-48168024aec0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                  alt="Learning Journey" 
                  className="relative z-10 rounded-xl shadow-lg object-cover"
                  style={{ aspectRatio: '3/4', objectPosition: 'center' }}
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
