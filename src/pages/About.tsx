
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-primary/5 to-transparent">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                Our Mission
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                Empowering learners worldwide to organize, optimize, and excel in their educational journeys.
              </p>
            </div>
          </div>
        </section>
        
        {/* Story Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Our Story</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    PathWise was born from a simple observation: while there are countless amazing learning resources available today, there's a lack of tools to help people organize and optimize their learning journeys.
                  </p>
                  <p>
                    Founded in 2023 by a team of educators, engineers, and lifelong learners, PathWise aims to bridge this gap by providing a comprehensive platform that helps you map out your learning path, track your progress, and adapt your strategy based on data-driven insights.
                  </p>
                  <p>
                    What started as a simple tool for personal use has grown into a platform trusted by thousands of learners worldwide, from self-taught professionals to students at leading universities.
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full transform -translate-x-4 translate-y-4"></div>
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80" 
                  alt="Team collaboration" 
                  className="relative z-10 rounded-xl shadow-lg object-cover w-full h-auto"
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Values Section */}
        <section className="py-20 bg-secondary/50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Values</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                The principles that guide everything we do at PathWise
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Value 1 */}
              <div className="bg-background rounded-xl p-6 shadow-sm border">
                <h3 className="text-xl font-semibold mb-2">Learner-Centered Design</h3>
                <p className="text-muted-foreground">
                  We design every feature with the learner's needs at the center. Our platform adapts to different learning styles and goals, not the other way around.
                </p>
              </div>
              
              {/* Value 2 */}
              <div className="bg-background rounded-xl p-6 shadow-sm border">
                <h3 className="text-xl font-semibold mb-2">Data Privacy</h3>
                <p className="text-muted-foreground">
                  We believe your learning data belongs to you. We maintain the highest standards of data privacy and security, giving you full control over your information.
                </p>
              </div>
              
              {/* Value 3 */}
              <div className="bg-background rounded-xl p-6 shadow-sm border">
                <h3 className="text-xl font-semibold mb-2">Continuous Improvement</h3>
                <p className="text-muted-foreground">
                  Just as we encourage lifelong learning for our users, we constantly strive to improve our platform based on research and user feedback.
                </p>
              </div>
              
              {/* Value 4 */}
              <div className="bg-background rounded-xl p-6 shadow-sm border">
                <h3 className="text-xl font-semibold mb-2">Accessibility</h3>
                <p className="text-muted-foreground">
                  We're committed to making education organization accessible to everyone, regardless of background, ability, or resources.
                </p>
              </div>
              
              {/* Value 5 */}
              <div className="bg-background rounded-xl p-6 shadow-sm border">
                <h3 className="text-xl font-semibold mb-2">Community</h3>
                <p className="text-muted-foreground">
                  We believe learning is inherently social. Our platform fosters a supportive community where knowledge and resources can be shared.
                </p>
              </div>
              
              {/* Value 6 */}
              <div className="bg-background rounded-xl p-6 shadow-sm border">
                <h3 className="text-xl font-semibold mb-2">Transparency</h3>
                <p className="text-muted-foreground">
                  We're open about how our platform works, how we use data, and our roadmap for the future. No hidden agendas or black boxes.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Team Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet Our Team</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                The passionate people behind PathWise
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Team Member 1 */}
              <div className="text-center">
                <div className="mb-4 relative mx-auto w-40 h-40 rounded-full overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80" 
                    alt="Sarah Johnson" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold">Sarah Johnson</h3>
                <p className="text-primary font-medium">CEO & Co-Founder</p>
                <p className="text-muted-foreground mt-2">
                  Former education technology researcher with a passion for making learning more accessible.
                </p>
              </div>
              
              {/* Team Member 2 */}
              <div className="text-center">
                <div className="mb-4 relative mx-auto w-40 h-40 rounded-full overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80" 
                    alt="David Chen" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold">David Chen</h3>
                <p className="text-primary font-medium">CTO & Co-Founder</p>
                <p className="text-muted-foreground mt-2">
                  Software engineer with experience building educational platforms at scale.
                </p>
              </div>
              
              {/* Team Member 3 */}
              <div className="text-center">
                <div className="mb-4 relative mx-auto w-40 h-40 rounded-full overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1976&q=80" 
                    alt="Maya Patel" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold">Maya Patel</h3>
                <p className="text-primary font-medium">Head of Product</p>
                <p className="text-muted-foreground mt-2">
                  Former teacher turned product manager with a deep understanding of learner needs.
                </p>
              </div>
              
              {/* Team Member 4 */}
              <div className="text-center">
                <div className="mb-4 relative mx-auto w-40 h-40 rounded-full overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80" 
                    alt="James Wilson" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold">James Wilson</h3>
                <p className="text-primary font-medium">Lead Designer</p>
                <p className="text-muted-foreground mt-2">
                  UX/UI specialist with a background in cognitive psychology and learning design.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-primary/10 to-primary/5">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">
                Join Us on Our Mission
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Whether you're a learner looking to organize your educational journey, an educator seeking better tools for your students, or someone passionate about the future of learning—we'd love to have you join our community.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="px-8 rounded-full">
                  Get Started Free
                </Button>
                <Button variant="outline" size="lg" className="px-8 rounded-full">
                  Join Our Team
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
