import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Sparkles, CheckCircle2, TrendingUp, Calendar, ArrowRight } from 'lucide-react'

export default function Home() {
    return (

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
            </div >
        </main >
    )
}
