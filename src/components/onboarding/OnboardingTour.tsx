'use client'

import { useState, useEffect } from 'react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { ArrowRight, CheckCircle2, BrainCircuit, Activity, Calendar } from 'lucide-react'

const STEPS = [
    {
        title: "Welcome to LifeOps™",
        description: "Clarity You Can Live In. This isn't just a todo list; it's an operating system for your life.",
        icon: <BrainCircuit className="w-12 h-12 text-primary" />
    },
    {
        title: "1. The Morning Check-in",
        description: "Start every day by dumping your brain. Our AI will sort through the noise and give you 3 clear priorities.",
        icon: <CheckCircle2 className="w-12 h-12 text-blue-500" />
    },
    {
        title: "2. The Pulse",
        description: "Track your energy and mood over time. See what drains you and what fuels you.",
        icon: <Activity className="w-12 h-12 text-pink-500" />
    },
    {
        title: "3. Weekly Review",
        description: "Every Sunday, look back to move forward. Course correct and set intentions for the week ahead.",
        icon: <Calendar className="w-12 h-12 text-purple-500" />
    }
]

export default function OnboardingTour() {
    const [isOpen, setIsOpen] = useState(false)
    const [currentStep, setCurrentStep] = useState(0)

    useEffect(() => {
        const hasSeenTour = localStorage.getItem('lifeops_onboarding_seen')
        if (!hasSeenTour) {
            setIsOpen(true)
        }
    }, [])

    const handleNext = () => {
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(currentStep + 1)
        } else {
            handleClose()
        }
    }

    const handleClose = () => {
        setIsOpen(false)
        localStorage.setItem('lifeops_onboarding_seen', 'true')
    }

    const step = STEPS[currentStep]

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="">
            <div className="flex flex-col items-center text-center space-y-6 py-4">
                <div className="p-4 bg-secondary/50 rounded-full">
                    {step.icon}
                </div>
                <div className="space-y-2">
                    <h3 className="text-2xl font-bold">{step.title}</h3>
                    <p className="text-muted-foreground text-lg">{step.description}</p>
                </div>

                <div className="flex gap-2 w-full pt-4">
                    <div className="flex-1 flex items-center justify-center gap-1">
                        {STEPS.map((_, i) => (
                            <div
                                key={i}
                                className={`h-2 w-2 rounded-full transition-colors ${i === currentStep ? 'bg-primary' : 'bg-secondary'}`}
                            />
                        ))}
                    </div>
                </div>

                <Button onClick={handleNext} className="w-full text-lg h-12">
                    {currentStep === STEPS.length - 1 ? "Let's Go!" : "Next"} <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
            </div>
        </Modal>
    )
}
