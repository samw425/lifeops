import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function WeeklyPage() {
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Weekly Review</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Coming Soon</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        Your weekly insights and experiments will appear here after you complete your first week.
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
