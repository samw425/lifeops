import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Sparkles, CheckCircle2, TrendingUp, Calendar, ArrowRight } from 'lucide-react'

export default function Home() {
    return (
        <div className="min-h-screen gradient-bg">
            {/* Hero Section */}
            <div className="container mx-auto px-4 py-20">
                <div className="max-w-4xl mx-auto text-center space-y-8 animate-slide-in">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-primary">Clarity You Can Live In</span>
                    </div>

                    <h1 className="text-6xl md:text-7xl font-bold tracking-tight text-foreground">
                        Your Personal <span className="text-primary">Operating System</span>
                    </h1>

                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        LifeOps™ transforms your mental chaos into clear priorities with LifeOps AI—our proprietary intelligence that learns how you work.
                    </p>

                    <div className="flex gap-4 justify-center pt-4">
                        <Button asChild size="lg" className="text-lg h-14 px-8 shadow-xl shadow-primary/25 animate-scale-in">
                            <Link href="/login">
                                Get Started Free <ArrowRight className="ml-2 w-5 h-5" />
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-3 gap-6 mt-24 max-w-5xl mx-auto">
                    <div className="glass p-8 rounded-2xl card-hover">
                        <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4">
                            <CheckCircle2 className="w-6 h-6 text-blue-500" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Daily Clarity</h3>
                        <p className="text-muted-foreground">
                            Brain dump → LifeOps AI sorts → 3 clear priorities. Every single day.
                        </p>
                    </div>

                    <div className="glass p-8 rounded-2xl card-hover">
                        <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4">
                            <TrendingUp className="w-6 h-6 text-purple-500" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Pattern Recognition</h3>
                        <p className="text-muted-foreground">
                            LifeOps AI analyzes your week to find what works and what doesn't.
                        </p>
                    </div>

                    <div className="glass p-8 rounded-2xl card-hover">
                        <div className="w-12 h-12 bg-pink-500/10 rounded-xl flex items-center justify-center mb-4">
                            <Calendar className="w-6 h-6 text-pink-500" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Weekly Evolution</h3>
                        <p className="text-muted-foreground">
                            Continuous improvement through LifeOps AI-suggested experiments.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
