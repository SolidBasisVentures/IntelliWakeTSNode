import { MyTable } from '../MySQL/MyTable';
import { MyColumn } from '../MySQL/MyColumn';
import { PGColumn } from '../PGSQL/PGColumn';
import { MyForeignKey } from '../MySQL/MyForeignKey';
import { PGForeignKey } from '../PGSQL/PGForeignKey';
import { MyIndex } from '../MySQL/MyIndex';
import { PGIndex } from '../PGSQL/PGIndex';
import { PGTable } from '../PGSQL/PGTable';
export declare class PGTableMy extends PGTable {
    myTable?: MyTable;
    constructor(instanceData?: PGTable, myTable?: MyTable);
}
export declare namespace MyToPG {
    const GetPGTable: (myTable: MyTable) => PGTableMy;
    const GetPGColumn: (myColumn: MyColumn) => PGColumn;
    const GetPGForeignKey: (myForeignKey: MyForeignKey) => PGForeignKey;
    const GetPGIndex: (myIndex: MyIndex) => PGIndex;
    const UDTNameFromDataType: (columnName: string) => string;
}
