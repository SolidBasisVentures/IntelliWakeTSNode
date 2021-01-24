import { IMSForeignKey } from '@Common/Migration/Chronos/IMSForeignKey';
export declare class MSForeignKey implements IMSForeignKey {
    primaryTable: string;
    primaryColumn: string;
    foreignTable: string;
    foreignColumn: string;
    deleteAction: string;
    updateAction: string;
    originalFK: boolean;
    noIssues: number | null;
    constructor(instanceData?: IMSForeignKey);
    private deserialize;
    clean(): void;
    missingFKCounts(): Promise<number>;
}
