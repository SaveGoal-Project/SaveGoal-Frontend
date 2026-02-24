"use client"

import * as React from "react"
import { cn } from "@/src/lib/utils"

interface SliderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'value' | 'onChange'> {
    value?: [number, number];
    defaultValue?: [number, number];
    min?: number;
    max?: number;
    step?: number;
    onValueChange?: (value: [number, number]) => void;
    className?: string;
}

export function Slider({
    value,
    defaultValue,
    min = 0,
    max = 100,
    step = 1,
    onValueChange,
    className,
    ...props
}: SliderProps) {
    const [localValue, setLocalValue] = React.useState<[number, number]>(defaultValue || value || [min, max]);

    React.useEffect(() => {
        if (value) {
            setLocalValue(value);
        }
    }, [value]);

    const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVal = Number(e.target.value);
        const nextValue: [number, number] = [Math.min(newVal, localValue[1] ?? max), localValue[1] ?? max];
        setLocalValue(nextValue);
        onValueChange?.(nextValue);
    };

    const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVal = Number(e.target.value);
        const nextValue: [number, number] = [localValue[0] ?? min, Math.max(newVal, localValue[0] ?? min)];
        setLocalValue(nextValue);
        onValueChange?.(nextValue);
    };

    return (
        <div className={cn("relative flex w-full touch-none select-none items-center gap-4", className)} {...props}>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={localValue[0]}
                onChange={handleMinChange}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
            />
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={localValue[1]}
                onChange={handleMaxChange}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
            />
        </div>
    )
}
