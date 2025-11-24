'use client'

import { useState, useEffect } from 'react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { ArrowRight, CheckCircle2, BrainCircuit, Activity, Calendar } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

const STEPS = [
    {
        title: "Welcome to LifeOps™",
        description: "Clarity You Can Live In. This isn't just a todo list; it's an operating system for your life.",
        icon: <BrainCircuit className="w-12 h-12 text-primary" />
    },
    {
        title: "1. Daily Check-in",
        description: "Check in whenever you need clarity—morning, afternoon, or evening. Dump your brain and get AI-sorted priorities.",
        icon: <CheckCircle2 className="w-12 h-12 text-blue-500" />
    },
    {
        title: "2. The Pulse",
        description: "Track your energy and mood over time. See what drains you and what fuels you.",
        icon: <Activity className="w-12 h-12 text-pink-500" />
    },
    {
        title: "3. Weekly Review",
        description: "Every week, look back to move forward. AI finds patterns and suggests experiments.",
        icon: <Calendar className="w-12 h-12 text-purple-500" />
    }
]

export default function OnboardingTour() {
    const [isOpen, setIsOpen] = useState(false)
    const [showNameInput, setShowNameInput] = useState(false)
    const [currentStep, setCurrentStep] = useState(0)
    const [firstName, setFirstName] = useState('')
    const [saving, setSaving] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        const checkOnboarding = async () => {
            const hasSeenTour = localStorage.getItem('lifeops_onboarding_seen')
            if (!hasSeenTour) {
                // Check if user has a profile
                const { data: profile } = await supabase
                    .from('user_profiles')
                    .select('first_name')
                    .single()

                if (!profile) {
                    setIsOpen(true)
                } else {
                    // Has profile, mark as seen
                    localStorage.setItem('lifeops_onboarding_seen', 'true')
                }
            }
        }
        checkOnboarding()
    }, [])

    const handleNext = () => {
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(currentStep + 1)
        } else {
            // Tour complete, show name input
            setIsOpen(false)
            setShowNameInput(true)
        }
    }

    const handleSkipName = async () => {
        // Create profile without name
        await supabase.from('user_profiles').insert({
            first_name: null
        })
        setShowNameInput(false)
        localStorage.setItem('lifeops_onboarding_seen', 'true')
        router.refresh()
    }

    const handleSaveName = async () => {
        if (!firstName.trim()) {
            handleSkipName()
            return
        }

        setSaving(true)
        await supabase.from('user_profiles').insert({
            first_name: firstName.trim()
        })
        setSaving(false)
        setShowNameInput(false)
        localStorage.setItem('lifeops_onboarding_seen', 'true')
        router.refresh()
    }

    const step = STEPS[currentStep]

    return (
        <>
            <Modal isOpen={isOpen} onClose={() => { }} title="">
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

            <Modal isOpen={showNameInput} onClose={() => { }} title="One Last Thing">
                <div className="space-y-6 py-2">
                    <div className="space-y-2 text-center">
                        <p className="text-muted-foreground">
                            What should we call you?
                        </p>
                    </div>

                    <input
                        type="text"
                        placeholder="Your first name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSaveName()}
                        className="w-full p-3 text-center text-lg rounded-md border bg-background"
                        autoFocus
                    />

                    <div className="flex gap-2">
                        <Button variant="outline" onClick={handleSkipName} className="flex-1">
                            Skip
                        </Button>
                        <Button onClick={handleSaveName} disabled={saving} className="flex-1">
                            {saving ? 'Saving...' : 'Continue'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    )
}
