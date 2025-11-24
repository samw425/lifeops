import { LiquidApp, LiquidRecord } from '@/lib/liquid-engine/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface LiquidViewProps {
    app: LiquidApp;
    viewId: string;
    onRecordClick?: (record: LiquidRecord) => void;
}

export function LiquidRenderer({ app, viewId, onRecordClick }: LiquidViewProps) {
    const view = app.schema.views.find((v) => v.id === viewId) || app.schema.views[0];
    const records = app.data.records;

    if (view.type === 'kanban') {
        const groupFieldId = view.groupBy;
        if (!groupFieldId) return <div>Invalid Kanban Configuration</div>;

        const groupField = app.schema.fields.find(f => f.id === groupFieldId);
        const groups = groupField?.options || ['Uncategorized'];

        return (
            <div className="flex gap-4 overflow-x-auto pb-4 h-[calc(100vh-200px)]">
                {groups.map((group) => (
                    <div key={group} className="min-w-[300px] bg-secondary/30 rounded-lg p-4 flex flex-col gap-3">
                        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-2">{group}</h3>
                        <ScrollArea className="h-full">
                            <div className="flex flex-col gap-3">
                                {records
                                    .filter((r) => r[groupFieldId] === group)
                                    .map((record) => (
                                        <RecordCard key={record.id} app={app} record={record} onClick={() => onRecordClick?.(record)} />
                                    ))}
                            </div>
                        </ScrollArea>
                    </div>
                ))}
            </div>
        );
    }

    // Default List View
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {records.map((record) => (
                <RecordCard key={record.id} app={app} record={record} onClick={() => onRecordClick?.(record)} />
            ))}
        </div>
    );
}

function RecordCard({ app, record, onClick }: { app: LiquidApp; record: LiquidRecord; onClick?: () => void }) {
    // Find the first text field to use as title
    const titleField = app.schema.fields.find((f) => f.type === 'text') || app.schema.fields[0];
    const tags = app.schema.fields.filter((f) => f.type === 'status' || f.type === 'select');

    return (
        <Card
            className="cursor-pointer hover:shadow-md transition-all hover:border-primary/50 group"
            onClick={onClick}
        >
            <CardHeader className="p-4 pb-2">
                <CardTitle className="text-lg font-medium truncate">
                    {record[titleField.id] || 'Untitled'}
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((field) => {
                        const val = record[field.id];
                        if (!val) return null;
                        return (
                            <Badge key={field.id} variant="secondary" className="text-xs font-normal">
                                {val}
                            </Badge>
                        );
                    })}
                </div>
                {/* Show first 2 other fields */}
                <div className="mt-3 space-y-1">
                    {app.schema.fields
                        .filter(f => f.id !== titleField.id && !tags.includes(f))
                        .slice(0, 2)
                        .map(f => (
                            <div key={f.id} className="text-xs text-muted-foreground flex justify-between">
                                <span>{f.label}:</span>
                                <span className="font-medium text-foreground truncate max-w-[150px]">
                                    {record[f.id]?.toString()}
                                </span>
                            </div>
                        ))
                    }
                </div>
            </CardContent>
        </Card>
    );
}
