'use client'

import { createClient } from '@/utils/supabase/client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [emailSent, setEmailSent] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleEmailLogin = async () => {
        if (!email) return

        setLoading(true)
        setError(null)

        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
        })

        if (error) {
            setError(error.message)
            setLoading(false)
        } else {
            setEmailSent(true)
            setLoading(false)
        }
    }

    const handleAnonymousLogin = async () => {
        setLoading(true)
        setError(null)

        // Create unique anonymous user
        const { error } = await supabase.auth.signInAnonymously()

        if (error) {
            setError(error.message)
            setLoading(false)
        } else {
            router.push('/dashboard')
        }
    }

    if (emailSent) {
        return (
            <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
                <Card className="w-full max-w-md glass">
                    <CardHeader className="text-center">
                        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                            <Sparkles className="w-6 h-6 text-primary" />
                        </div>
                        <CardTitle className="text-2xl">Check Your Email</CardTitle>
                        <CardDescription className="text-base mt-2">
                            We sent a magic link to <strong>{email}</strong>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground text-center">
                            Click the link in the email to sign in. You can close this window.
                        </p>
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => setEmailSent(false)}
                        >
                            Try Different Email
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
            <Card className="w-full max-w-md glass">
                <CardHeader className="text-center space-y-2">
                    <div className="mx-auto w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-2">
                        <span className="text-white font-bold text-2xl">L</span>
                    </div>
                    <CardTitle className="text-3xl font-bold">Welcome to LifeOps™</CardTitle>
                    <CardDescription className="text-base">
                        Clarity You Can Live In
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Email Login - Primary Option */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm font-medium text-primary">
                            <Sparkles className="w-4 h-4" />
                            <span>Recommended</span>
                        </div>
                        <Input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleEmailLogin()}
                            className="h-12 text-base"
                        />
                        <Button
                            onClick={handleEmailLogin}
                            disabled={loading || !email}
                            className="w-full h-12 text-base shadow-lg shadow-primary/25"
                        >
                            {loading ? 'Sending Magic Link...' : 'Continue with Email'}
                        </Button>
                        <p className="text-xs text-muted-foreground text-center">
                            No password needed • Your data syncs across devices
                        </p>
                    </div>

                    {/* Divider */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            }
                        }}
                            disabled={loading}
                    >
                            Guest Login (No Email Required)
                        </Button>
                </CardContent>
            </Card>
        </div>
    )
}
