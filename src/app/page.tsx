import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles } from 'lucide-react'

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-8 text-center relative overflow-hidden">
            {/* Hero Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 blur-[100px] rounded-full pointer-events-none" />

            <div className="max-w-3xl space-y-8 relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-muted-foreground backdrop-blur-md mb-4 animate-fade-in">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>The Operating System for Your Life</span>
                </div>

                <h1 className="text-6xl md:text-8xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white via-white/90 to-white/50 pb-4">
                    LifeOps™
                </h1>

                <p className="text-2xl md:text-3xl font-light text-muted-foreground max-w-xl mx-auto leading-relaxed">
                    Clarity You Can Live In.
                </p>

                <p className="text-lg text-muted-foreground/80 max-w-prose mx-auto">
                    Not a to-do list. A daily operating system that turns chaos into clarity using AI as a thinking partner.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                    <Button asChild size="lg" className="h-12 px-8 text-lg shadow-[0_0_30px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.5)] transition-shadow duration-500">
                        <Link href="/login">
                            Get Started <ArrowRight className="ml-2 w-5 h-5" />
                        </Link>
                    </Button>
                    <Button asChild variant="glass" size="lg" className="h-12 px-8 text-lg">
                        <Link href="/login">Log In</Link>
                    </Button>
                </div>
            </div>
        </main>
    )
}
