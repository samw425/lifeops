import { Droplets } from 'lucide-react';

export function LiquidLogo({ className = "w-8 h-8" }: { className?: string }) {
    return (
        <div className={`relative flex items-center justify-center ${className}`}>
            <Droplets className="w-full h-full text-blue-500 animate-pulse" />
            <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full" />
        </div>
    );
}
