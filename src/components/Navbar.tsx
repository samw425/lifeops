import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Navbar() {
    return (
        <nav className="border-b bg-white/80 backdrop-blur-lg sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-xl">L</span>
                    </div>
                    <span className="text-xl font-bold tracking-tight">LifeOps™</span>
                </Link>

                <div className="flex items-center gap-6">
                    <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
                        Dashboard
                    </Link>
                    <Link href="/today" className="text-sm font-medium hover:text-primary transition-colors">
                        Today
                    </Link>
                    <Link href="/weekly" className="text-sm font-medium hover:text-primary transition-colors">
                        Weekly
                    </Link>
                    <Link href="/settings" className="text-sm font-medium hover:text-primary transition-colors">
                        Settings
                    </Link>
                </div>
            </div>
        </nav>
    )
}
