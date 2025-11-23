import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function BlueprintPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { data: focusAreas } = await supabase
        .from('focus_areas')
        .select('*, goals(*)')
        .eq('user_id', user?.id)

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Blueprint</h1>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {focusAreas?.map((area) => (
                    <Card key={area.id}>
                        <CardHeader>
                            <CardTitle>{area.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2">
                                {area.goals.map((goal: any) => (
                                    <li key={goal.id} className="p-2 border rounded-md text-sm">
                                        {goal.title}
                                    </li>
                                ))}
                                {area.goals.length === 0 && (
                                    <li className="text-muted-foreground text-sm italic">No active goals</li>
                                )}
                            </ul>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
