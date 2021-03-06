export declare class PGParams {
    lastPosition: number;
    values: any[];
    constructor();
    add(value: any): string;
    addLike(value: string): string;
    addEqualNullable(field: string, value: any): string;
    replaceSQLWithValues(sql: string): string;
}
