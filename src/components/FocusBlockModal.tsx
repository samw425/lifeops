'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Clock, Zap, Coffee, Battery, XCircle } from 'lucide-react'

interface FocusBlockModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: (block: FocusBlockData) => Promise<void>
    focusAreas: any[]
}

export interface FocusBlockData {
    focus_area_id: string | null
    mode: 'deep' | 'admin' | 'recovery' | 'distraction'
    start_time: string
    end_time: string
    notes: string
}

const MODES = [
    { value: 'deep', label: 'Deep Focus', icon: Zap, color: 'bg-blue-500' },
    { value: 'admin', label: 'Admin', icon: Coffee, color: 'bg-amber-500' },
    { value: 'recovery', label: 'Recovery', icon: Battery, color: 'bg-green-500' },
    { value: 'distraction', label: 'Distraction', icon: XCircle, color: 'bg-red-500' },
] as const

export default function FocusBlockModal({ isOpen, onClose, onSave, focusAreas }: FocusBlockModalProps) {
    const [mode, setMode] = useState<'deep' | 'admin' | 'recovery' | 'distraction'>('deep')
    const [focusAreaId, setFocusAreaId] = useState<string | null>(null)
    const [startTime, setStartTime] = useState('')
    const [endTime, setEndTime] = useState('')
    const [notes, setNotes] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSave = async () => {
        if (!startTime || !endTime) return

        setLoading(true)
        try {
            await onSave({
                mode,
                focus_area_id: focusAreaId,
                start_time: startTime,
                end_time: endTime,
                notes
            })

            // Reset form
            setStartTime('')
            setEndTime('')
            setNotes('')
            setMode('deep')
            setFocusAreaId(null)
            onClose()
        } catch (error) {
            console.error('Failed to save focus block:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Log Focus Block">
            <div className="space-y-6">
                {/* Mode Selection */}
                <div className="space-y-2">
                    <label className="text-sm font-medium">Mode</label>
                    <div className="grid grid-cols-2 gap-2">
                        {MODES.map(({ value, label, icon: Icon, color }) => (
                            <button
                                key={value}
                                onClick={() => setMode(value)}
                                className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all ${mode === value
                                        ? `${color} border-transparent text-white`
                                        : 'border-border hover:bg-accent'
                                    }`}
                            >
                                <Icon className="h-4 w-4" />
                                <span className="text-sm font-medium">{label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Time Inputs */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Start Time</label>
                        <input
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="w-full p-2 rounded-md border bg-background"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">End Time</label>
                        <input
                            type="time"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            className="w-full p-2 rounded-md border bg-background"
                        />
                    </div>
                </div>

                {/* Focus Area (if available) */}
                {focusAreas && focusAreas.length > 0 && (
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Focus Area (Optional)</label>
                        <select
                            value={focusAreaId || ''}
                            onChange={(e) => setFocusAreaId(e.target.value || null)}
                            className="w-full p-2 rounded-md border bg-background"
                        >
                            <option value="">None</option>
                            {focusAreas.map((area) => (
                                <option key={area.id} value={area.id}>
                                    {area.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Notes */}
                <div className="space-y-2">
                    <label className="text-sm font-medium">Notes (Optional)</label>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="What did you work on?"
                        className="w-full min-h-[80px] p-3 rounded-md border bg-background resize-none"
                    />
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                    <Button variant="outline" onClick={onClose} className="flex-1">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={!startTime || !endTime || loading}
                        className="flex-1"
                    >
                        {loading ? 'Saving...' : 'Save Block'}
                    </Button>
                </div>
            </div>
        </Modal>
    )
}
