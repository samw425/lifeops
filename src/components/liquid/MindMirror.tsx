'use client';

import { LiquidApp } from '@/lib/liquid-engine/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BrainCircuit, TrendingUp, Activity } from 'lucide-react';

interface MindMirrorProps {
    app: LiquidApp;
}

export function MindMirror({ app }: MindMirrorProps) {
    // Mock data for MVP - In real version, this would query cross-app stats
    const recordCount = app.data.records.length;
    const activityLevel = recordCount > 5 ? 'High' : 'Low';

    return (
        <Card className="border-purple-500/20 bg-purple-500/5">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                    <BrainCircuit className="w-5 h-5 text-purple-400" />
                    Mind Mirror
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                    <div className="bg-background/40 p-3 rounded-lg border border-white/5">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                            <TrendingUp className="w-3 h-3" />
                            Growth
                        </div>
                        <div className="text-xl font-bold">+{recordCount * 10}%</div>
                    </div>
                    <div className="bg-background/40 p-3 rounded-lg border border-white/5">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                            <Activity className="w-3 h-3" />
                            Flow
                        </div>
                        <div className="text-xl font-bold">{activityLevel}</div>
                    </div>
                </div>

                <div className="text-xs text-muted-foreground bg-background/40 p-3 rounded-lg border border-white/5">
                    <span className="font-semibold text-purple-300">Insight:</span> Your usage of {app.name} correlates with higher productivity on Tuesdays.
                </div>
            </CardContent>
        </Card>
    );
}
