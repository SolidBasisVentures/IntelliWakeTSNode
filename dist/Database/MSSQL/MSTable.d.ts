import { MSColumn } from './MSColumn';
import { MSForeignKey } from './MSForeignKey';
import { IMSTable } from '@Common/Migration/Chronos/IMSTable';
export declare class MSTable implements IMSTable {
    groupName: string;
    stepNo: number;
    name: string;
    inherits: string[];
    columns: MSColumn[];
    rowCount: number | null;
    newName: string;
    description: string;
    migrationNotes: string;
    originalForeignKeys: MSForeignKey[];
    newForeignKeys: MSForeignKey[];
    skip: boolean;
    redo: boolean;
    ignore: boolean;
    constructor(instanceData?: IMSTable);
    private deserialize;
    calcName(): string;
    populateRowCount(): Promise<number>;
    areCardinalitiesPopulated(): boolean;
    hasFKForColumn(columnName: string): boolean;
    static FindMSTable(tableName: string, msTables: MSTable[]): MSTable | null;
    findMSColumn(columnName: string): MSColumn | null;
    save(): boolean;
    static SaveAll(msTables: MSTable[]): void;
    static Load(fileName: string): MSTable | null;
    /** @return MSTable[] */
    static LoadAll(): MSTable[];
    static ArePermissionsSet: boolean;
    static SetPermissions(): void;
    loadColumns(): Promise<void>;
    static Columns(tableName: string): Promise<MSColumn[]>;
}
