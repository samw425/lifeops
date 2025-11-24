import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Navbar from '@/components/Navbar'
import { User, Clock, LogOut } from 'lucide-react'

export default async function SettingsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch user profile
    let profile = null
    try {
        const { data } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('user_id', user.id)
            .single()
        profile = data
    } catch (err) {
        console.log('Profile fetch failed:', err)
    }

    return (
        <>
            <Navbar />
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="space-y-2 mb-8">
                    <h1 className="text-4xl font-bold tracking-tight">Settings</h1>
                    <p className="text-muted-foreground text-lg">
                        Manage your LifeOps™ experience
                    </p>
                </div>

                <div className="space-y-6">
                    {/* Profile Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="w-5 h-5" />
                                Profile
                            </CardTitle>
                            <CardDescription>
                                Personalize how LifeOps addresses you
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form action="/api/settings/update-profile" method="POST" className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="first_name">First Name</Label>
                                    <Input
                                        id="first_name"
                                        name="first_name"
                                        type="text"
                                        placeholder="Your first name"
                                        defaultValue={profile?.first_name || ''}
                                        className="max-w-md"
                                    />
                                    <p className="text-sm text-muted-foreground">
                                        This is how we'll greet you throughout the app
                                    </p>
                                </div>
                                <Button type="submit">Save Changes</Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Timezone Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="w-5 h-5" />
                                Timezone
                            </CardTitle>
                            <CardDescription>
                                Set your local timezone for accurate time-based features
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form action="/api/settings/update-timezone" method="POST" className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="timezone">Timezone</Label>
                                    <select
                                        id="timezone"
                                        name="timezone"
                                        className="w-full max-w-md p-2 rounded-md border bg-background"
                                        defaultValue={profile?.timezone || 'America/New_York'}
                                    >
                                        <option value="America/New_York">Eastern Time</option>
                                        <option value="America/Chicago">Central Time</option>
                                        <option value="America/Denver">Mountain Time</option>
                                        <option value="America/Los_Angeles">Pacific Time</option>
                                        <option value="Europe/London">London</option>
                                        <option value="Europe/Paris">Paris</option>
                                        <option value="Asia/Tokyo">Tokyo</option>
                                    </select>
                                </div>
                                <Button type="submit">Save Timezone</Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Account Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Account</CardTitle>
                            <CardDescription>
                                Your account information
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label>Email</Label>
                                <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
                            </div>
                            <div>
                                <Label>Account Created</Label>
                                <p className="text-sm text-muted-foreground mt-1">
                                    {new Date(user.created_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                            <form action="/api/auth/signout" method="POST">
                                <Button type="submit" variant="outline" className="mt-4">
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Sign Out
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    )
}
