export type FieldType = 'text' | 'number' | 'date' | 'select' | 'currency' | 'status' | 'rich-text';
export type PersonalityType = 'minimalist' | 'analyst' | 'creative' | 'power';

export interface LiquidField {
    id: string;
    label: string;
    type: FieldType;
    options?: string[]; // For select/status types
    required?: boolean;
}

export type ViewType = 'list' | 'kanban' | 'gallery' | 'stats';

export interface LiquidView {
    id: string;
    name: string;
    type: ViewType;
    groupBy?: string; // Field ID to group by (for Kanban)
    metric?: string; // Logic for stats (e.g., "sum(f3)")
}

export interface LiquidSchema {
    appName: string;
    description: string;
    personality?: PersonalityType;
    fields: LiquidField[];
    views: LiquidView[];
}

export interface LiquidRecord {
    id: string;
    [key: string]: any; // Dynamic fields mapped by Field ID
}

export interface LiquidApp {
    id: string;
    user_id: string;
    name: string;
    description: string;
    schema: LiquidSchema;
    data: {
        records: LiquidRecord[];
    };
    created_at: string;
}
