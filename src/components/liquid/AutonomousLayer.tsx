'use client';

import { useState } from 'react';
import { LiquidApp } from '@/lib/liquid-engine/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Bot, Zap } from 'lucide-react';

interface AutonomousLayerProps {
    app: LiquidApp;
}

export function AutonomousLayer({ app }: AutonomousLayerProps) {
    const [emailAutomation, setEmailAutomation] = useState(false);
    const [summaryAutomation, setSummaryAutomation] = useState(false);

    return (
        <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                    <Bot className="w-5 h-5 text-blue-400" />
                    Autonomous Layer
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label className="text-base">Smart Summaries</Label>
                        <p className="text-xs text-muted-foreground">
                            Weekly AI analysis of your {app.name} data
                        </p>
                    </div>
                    <Switch
                        checked={summaryAutomation}
                        onCheckedChange={setSummaryAutomation}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label className="text-base">Action Triggers</Label>
                        <p className="text-xs text-muted-foreground">
                            Auto-email when status changes (Demo)
                        </p>
                    </div>
                    <Switch
                        checked={emailAutomation}
                        onCheckedChange={setEmailAutomation}
                    />
                </div>

                <Button variant="outline" className="w-full text-xs h-8">
                    <Zap className="w-3 h-3 mr-2" />
                    Configure Agents
                </Button>
            </CardContent>
        </Card>
    );
}
