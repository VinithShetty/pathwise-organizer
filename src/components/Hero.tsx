
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-3/4 h-3/4 bg-primary/5 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-3/4 h-3/4 bg-primary/10 rounded-full blur-3xl transform translate-x-1/3 translate-y-1/3"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative">
        <div className="max-w-4xl mx-auto text-center">
          <span 
            className={`inline-block py-1 px-3 mb-6 text-xs font-medium rounded-full bg-primary/10 text-primary transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0 transform -translate-y-4'}`}
          >
            Organize your learning efficiently
          </span>
          
          <h1 
            className={`text-4xl md:text-5xl lg:text-6xl font-bold leading-tight md:leading-tight lg:leading-tight mb-6 transition-all duration-700 delay-100 ${isVisible ? 'opacity-100' : 'opacity-0 transform -translate-y-4'}`}
          >
            Unlock Your Learning Potential with{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              PathWise
            </span>
          </h1>
          
          <p 
            className={`text-xl text-muted-foreground mb-8 max-w-2xl mx-auto transition-all duration-700 delay-200 ${isVisible ? 'opacity-100' : 'opacity-0 transform -translate-y-4'}`}
          >
            Create personalized learning paths, track your progress, and analyze your performance with our intuitive platform.
          </p>
          
          <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100' : 'opacity-0 transform -translate-y-4'}`}>
            <Link to="/signup">
              <Button size="lg" className="px-8 rounded-full">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/features">
              <Button variant="outline" size="lg" className="px-8 rounded-full">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Hero Image */}
        <div 
          className={`mt-16 max-w-5xl mx-auto relative transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'}`}
        >
          <div className="relative rounded-2xl overflow-hidden border shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent z-10 pointer-events-none"></div>
            <img 
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
              alt="PathWise Dashboard Preview" 
              className="w-full h-auto object-cover"
              style={{ aspectRatio: '16/9' }}
            />
          </div>
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-[90%] h-[100px] bg-gradient-to-t from-background to-transparent z-0 blur-xl"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
