import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/shared/Logo';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <Logo size="md" />
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link href="#features" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Features
            </Link>
            <Link href="#pricing" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Pricing
            </Link>
            <Link href="#about" className="transition-colors hover:text-foreground/80 text-foreground/60">
              About
            </Link>
            <Link href="#contact" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Contact
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Link href="/auth/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link href="/auth/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container flex flex-col items-center justify-center py-20 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Build Smarter Chatbots,<br />
            <span className="text-primary">Faster Than Ever</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            TalkChat Studio helps businesses create, customize, and deploy AI-powered chatbots across multiple channels with ease. 
            Engage customers 24/7 with intelligent automation and human-like conversations.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="/auth/register">
              <Button size="lg">Start Free Trial</Button>
            </Link>
            <Link href="#demo" className="text-sm font-semibold leading-6">
              Watch Demo <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
        
        {/* Hero Image/Illustration */}
        <div className="mt-16 bg-muted/50 p-8 rounded-xl border w-full max-w-4xl mx-auto">
          <div className="aspect-video bg-background rounded-lg border flex items-center justify-center">
            <p className="text-muted-foreground">Dashboard Preview</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-muted/50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Powerful Features for Every Need</h2>
            <p className="mt-4 text-lg text-muted-foreground">Everything you need to build, manage, and scale your chatbot strategy</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Multi-Channel Inbox',
                description: 'Manage all your customer conversations from WhatsApp, Facebook, Instagram, and more in one place.'
              },
              {
                title: 'AI-Powered Chatbots',
                description: 'Create intelligent chatbots that understand and respond to customer queries naturally.'
              },
              {
                title: 'Real-time Analytics',
                description: 'Track performance, customer satisfaction, and agent productivity with detailed insights.'
              },
              {
                title: 'Customizable Widgets',
                description: 'Match the chat widget to your brand with custom colors, messages, and behavior.'
              },
              {
                title: 'Voice & Video Calls',
                description: 'Upgrade conversations with voice and video call capabilities (Pro+ plans).'
              },
              {
                title: 'Team Collaboration',
                description: 'Work together with your team to provide seamless customer support.'
              }
            ].map((feature, index) => (
              <div key={index} className="p-6 bg-background rounded-lg border shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Customer Experience?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Join thousands of businesses using TalkChat Studio to engage customers and grow their business.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" className="bg-background text-foreground hover:bg-background/90">
                Start Free Trial
              </Button>
            </Link>
            <Link href="#demo">
              <Button size="lg" variant="outline" className="border-background text-background hover:bg-background/10">
                Schedule a Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="container py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-sm font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-sm text-muted-foreground hover:underline">Features</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:underline">Pricing</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:underline">Integrations</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:underline">Changelog</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-sm text-muted-foreground hover:underline">Documentation</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:underline">Tutorials</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:underline">Blog</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:underline">API Reference</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-sm text-muted-foreground hover:underline">About Us</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:underline">Careers</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:underline">Contact</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:underline">Press</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-sm text-muted-foreground hover:underline">Privacy Policy</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:underline">Terms of Service</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:underline">Cookie Policy</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:underline">GDPR</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} TalkChat Studio. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <span className="sr-only">Twitter</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <span className="sr-only">GitHub</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
