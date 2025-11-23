'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function AuthErrorPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md border-destructive/50">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold text-destructive">Authentication Error</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-center">
                    <p className="text-muted-foreground">
                        There was an issue signing you in. This can happen if the login link has expired or was already used.
                    </p>
                    <Button asChild className="w-full">
                        <Link href="/login">Try Logging In Again</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
