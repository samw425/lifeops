import { LiquidField } from '@/lib/liquid-engine/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface LiquidInputProps {
    field: LiquidField;
    value: any;
    onChange: (value: any) => void;
}

export function LiquidInput({ field, value, onChange }: LiquidInputProps) {
    const id = `field-${field.id}`;

    if (field.type === 'select' || field.type === 'status') {
        return (
            <div className="space-y-2">
                <Label htmlFor={id}>{field.label}</Label>
                <Select value={value} onValueChange={onChange}>
                    <SelectTrigger id={id}>
                        <SelectValue placeholder={`Select ${field.label}`} />
                    </SelectTrigger>
                    <SelectContent>
                        {field.options?.map((option) => (
                            <SelectItem key={option} value={option}>
                                {option}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        );
    }

    if (field.type === 'rich-text') {
        return (
            <div className="space-y-2">
                <Label htmlFor={id}>{field.label}</Label>
                <Textarea
                    id={id}
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={`Enter ${field.label}`}
                    className="min-h-[100px]"
                />
            </div>
        );
    }

    // Default to text/number/date/currency
    return (
        <div className="space-y-2">
            <Label htmlFor={id}>{field.label}</Label>
            <Input
                id={id}
                type={field.type === 'number' || field.type === 'currency' ? 'number' : field.type === 'date' ? 'date' : 'text'}
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                placeholder={`Enter ${field.label}`}
            />
        </div>
    );
}
