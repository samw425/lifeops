'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { LiquidApp, LiquidRecord } from '@/lib/liquid-engine/types';
import { LiquidRenderer } from '@/components/liquid/LiquidRenderer';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { LiquidInput } from '@/components/liquid/LiquidInput';
import { useRouter } from 'next/navigation';

export default function AppRendererPage({ params }: { params: { id: string } }) {
    const [app, setApp] = useState<LiquidApp | null>(null);
    const [loading, setLoading] = useState(true);
    const [isNewRecordOpen, setIsNewRecordOpen] = useState(false);
    const [newRecordData, setNewRecordData] = useState<any>({});
    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        const fetchApp = async () => {
            const { data, error } = await supabase
                .from('liquid_apps')
                .select('*')
                .eq('id', params.id)
                .single();

            if (error) {
                console.error('Error fetching app:', error);
            } else {
                setApp(data);
            }
            setLoading(false);
        };

        fetchApp();
    }, [params.id, supabase]);

    const handleCreateRecord = async () => {
        if (!app) return;

        const newRecord: LiquidRecord = {
            id: crypto.randomUUID(),
            ...newRecordData,
            created_at: new Date().toISOString(),
        };

        const updatedRecords = [...app.data.records, newRecord];

        // Optimistic update
        const updatedApp = { ...app, data: { ...app.data, records: updatedRecords } };
        setApp(updatedApp);
        setIsNewRecordOpen(false);
        setNewRecordData({});

        // Persist to DB
        const { error } = await supabase
            .from('liquid_apps')
            .update({ data: { records: updatedRecords } })
            .eq('id', app.id);

        if (error) {
            console.error('Failed to save record:', error);
            // Revert on error (could be handled better)
        }
    };

    if (loading) return <div className="flex items-center justify-center h-screen">Loading Liquid App...</div>;
    if (!app) return <div className="flex items-center justify-center h-screen">App not found</div>;

    return (
        <div className="min-h-screen bg-background p-6">
            <header className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{app.name}</h1>
                    <p className="text-muted-foreground">{app.description}</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => router.push('/')}>Back to Hub</Button>
                    <Dialog open={isNewRecordOpen} onOpenChange={setIsNewRecordOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                Add Item
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New Item</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                {app.schema.fields.map((field) => (
                                    <LiquidInput
                                        key={field.id}
                                        field={field}
                                        value={newRecordData[field.id]}
                                        onChange={(val) => setNewRecordData({ ...newRecordData, [field.id]: val })}
                                    />
                                ))}
                                <Button onClick={handleCreateRecord} className="w-full mt-4">Save Item</Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </header>

            <main>
                {/* Default to the first view for now */}
                <LiquidRenderer app={app} viewId={app.schema.views[0].id} />
            </main>
        </div>
    );
}
