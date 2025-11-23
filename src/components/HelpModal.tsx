'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { HelpCircle, BookOpen, MessageSquare } from 'lucide-react'

export default function HelpModal() {
    const [isOpen, setIsOpen] = useState(false)

    const handleResetTour = () => {
        localStorage.removeItem('lifeops_onboarding_seen')
        window.location.reload()
    }

    return (
        <>
            <Button
                variant="outline"
                size="icon"
                className="fixed bottom-4 right-4 h-10 w-10 rounded-full shadow-lg bg-background/80 backdrop-blur-sm border-primary/20 hover:border-primary/50 z-40"
                onClick={() => setIsOpen(true)}
            >
                <HelpCircle className="h-5 w-5 text-muted-foreground" />
            </Button>

            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Help & Guidance">
                <div className="space-y-4">
                    <div className="p-4 border rounded-lg bg-secondary/20 space-y-2">
                        <h3 className="font-semibold flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-primary" /> How LifeOps Works
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            LifeOps is designed to clear your mind and help you focus.
                        </p>
                        <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1 ml-1">
                            <li><strong>Morning:</strong> Check-in to set priorities.</li>
                            <li><strong>Day:</strong> Execute on your top 3 tasks.</li>
                            <li><strong>Evening:</strong> Review and recharge.</li>
                        </ul>
                    </div>

                    <div className="grid gap-2">
                        <Button variant="outline" onClick={handleResetTour} className="w-full justify-start">
                            <MessageSquare className="mr-2 h-4 w-4" /> Replay Onboarding Tour
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    )
}
