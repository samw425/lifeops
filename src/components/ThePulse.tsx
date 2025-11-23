'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ThePulse({ energy = 3, mood = 3 }: { energy?: number, mood?: number }) {
    // Calculate color based on mood (1=blue/sad, 5=gold/happy)
    const getColor = (m: number) => {
        if (m <= 2) return 'bg-blue-400'
        if (m === 3) return 'bg-purple-400'
        return 'bg-amber-400'
    }

    // Calculate speed based on energy (1=slow, 5=fast)
    const getDuration = (e: number) => {
        return 6 - e // 1->5s, 5->1s
    }

    return (
        <Card className="overflow-hidden relative">
            <CardHeader className="relative z-10">
                <CardTitle>Your Pulse</CardTitle>
            </CardHeader>
            <CardContent className="h-48 flex items-center justify-center relative z-10">
                <div className="text-center space-y-2">
                    <div className="text-4xl font-bold">{energy}/5</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-widest">Energy</div>
                </div>
            </CardContent>

            {/* Background Breathing Animation */}
            <motion.div
                className={`absolute inset-0 opacity-20 ${getColor(mood)} blur-3xl`}
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.1, 0.3, 0.1],
                }}
                transition={{
                    duration: getDuration(energy),
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />
        </Card>
    )
}
