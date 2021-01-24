import { MSTable } from './MSTable';
export declare namespace Process_Analysis {
    const Process: () => Promise<{
        msTables: MSTable[];
        message: string;
    }>;
    const Process_SetHasNullOrZero: (msTables: MSTable[]) => string | null;
    const Process_SetNotNullable: (msTables: MSTable[]) => string | null;
}
