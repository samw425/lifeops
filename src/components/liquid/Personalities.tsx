import { LiquidApp, LiquidRecord } from '@/lib/liquid-engine/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export function AnalystTable({ app, records, onRecordClick }: { app: LiquidApp, records: LiquidRecord[], onRecordClick?: (r: LiquidRecord) => void }) {
    return (
        <div className="border rounded-md">
            <Table>
                <TableHeader>
                    <TableRow>
                        {app.schema.fields.map(f => (
                            <TableHead key={f.id}>{f.label}</TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {records.map(record => (
                        <TableRow key={record.id} onClick={() => onRecordClick?.(record)} className="cursor-pointer hover:bg-muted/50">
                            {app.schema.fields.map(f => (
                                <TableCell key={f.id}>{record[f.id]}</TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

export function CreativeGallery({ app, records, onRecordClick }: { app: LiquidApp, records: LiquidRecord[], onRecordClick?: (r: LiquidRecord) => void }) {
    const titleField = app.schema.fields.find(f => f.type === 'text') || app.schema.fields[0];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {records.map(record => (
                <div
                    key={record.id}
                    onClick={() => onRecordClick?.(record)}
                    className="aspect-square rounded-xl bg-gradient-to-br from-secondary/50 to-background border hover:scale-105 transition-transform cursor-pointer p-6 flex flex-col justify-end group"
                >
                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{record[titleField.id]}</h3>
                    <div className="mt-2 flex flex-wrap gap-1">
                        {/* Tags/Status would go here */}
                    </div>
                </div>
            ))}
        </div>
    );
}
