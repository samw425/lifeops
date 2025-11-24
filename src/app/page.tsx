'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Sparkles, ArrowRight, LayoutGrid } from 'lucide-react';
import { LiquidApp } from '@/lib/liquid-engine/types';

export default function LiquidCommandCenter() {
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [myApps, setMyApps] = useState<LiquidApp[]>([]);
    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        const fetchApps = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data } = await supabase
                .from('liquid_apps')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (data) setMyApps(data);
        };

        fetchApps();
    }, [supabase]);

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim()) return;

        setIsGenerating(true);

        try {
            // 1. Generate Schema via AI
            const res = await fetch('/api/liquid/generate', {
                method: 'POST',
                body: JSON.stringify({ prompt }),
            });
            const { schema } = await res.json();

            // 2. Save to Supabase
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                // Handle unauthenticated state (redirect to login)
                router.push('/login');
                return;
            }

            const { data, error } = await supabase
                .from('liquid_apps')
                .insert({
                    user_id: user.id,
                    name: schema.appName,
                    description: schema.description,
                    schema: schema,
                    data: { records: [] }
                })
                .select()
                .single();

            if (error) throw error;

            // 3. Redirect to new App
            router.push(`/app/${data.id}`);

        } catch (error) {
            console.error('Generation failed:', error);
            alert('Failed to generate app. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Hero Section */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-3xl mx-auto w-full">
                <div className="mb-8 space-y-4">
                    <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                        Liquid OS
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        The last app you will ever need. Just describe it, and we build it.
                    </p>
                </div>

                <Card className="w-full shadow-2xl border-primary/20 bg-card/50 backdrop-blur">
                    <CardContent className="p-6">
                        <form onSubmit={handleGenerate} className="flex gap-3">
                            <Input
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="I need an app to track my freelance projects..."
                                className="text-lg p-6 h-14"
                                disabled={isGenerating}
                            />
                            <Button type="submit" size="lg" className="h-14 px-8" disabled={isGenerating}>
                                {isGenerating ? (
                                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                ) : (
                                    <Sparkles className="w-5 h-5 mr-2" />
                                )}
                                Generate
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Examples */}
                <div className="mt-8 flex gap-4 text-sm text-muted-foreground">
                    <span>Try:</span>
                    <button onClick={() => setPrompt("Simple CRM for my bakery")} className="hover:text-primary transition-colors">"CRM for bakery"</button>
                    <span>•</span>
                    <button onClick={() => setPrompt("Track my daily mood and sleep")} className="hover:text-primary transition-colors">"Mood Tracker"</button>
                    <span>•</span>
                    <button onClick={() => setPrompt("Wedding guest list manager")} className="hover:text-primary transition-colors">"Wedding Planner"</button>
                </div>
            </div>

            {/* My Apps Grid */}
            {myApps.length > 0 && (
                <div className="bg-secondary/20 p-10 border-t">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <LayoutGrid className="w-6 h-6" />
                            Your Apps
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {myApps.map((app) => (
                                <Card
                                    key={app.id}
                                    className="hover:shadow-lg transition-all cursor-pointer hover:border-primary/50 group"
                                    onClick={() => router.push(`/app/${app.id}`)}
                                >
                                    <CardHeader>
                                        <CardTitle className="flex items-center justify-between">
                                            {app.name}
                                            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </CardTitle>
                                        <CardDescription className="line-clamp-2">{app.description}</CardDescription>
                                    </CardHeader>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
