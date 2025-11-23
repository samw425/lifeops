import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <header className="border-b">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/dashboard" className="font-bold text-xl">
                        LifeOps™
                    </Link>
                    <nav className="flex gap-4">
                        <Link href="/dashboard" className="text-sm font-medium hover:text-primary">
                            Dashboard
                        </Link>
                        <Link href="/today" className="text-sm font-medium hover:text-primary">
                            Today
                        </Link>
                        <Link href="/weekly" className="text-sm font-medium hover:text-primary">
                            Weekly
                        </Link>
                        <Link href="/blueprint" className="text-sm font-medium hover:text-primary">
                            Blueprint
                        </Link>
                    </nav>
                </div>
            </header>
            <main className="flex-1 container mx-auto px-4 py-8">
                {children}
            </main>
        </div>
    )
}
