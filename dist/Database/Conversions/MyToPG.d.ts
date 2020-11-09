import { MyTable } from '../MySQL/MyTable';
import { PGTable } from '../PGSQL/PGTable';
import { MyColumn } from '../MySQL/MyColumn';
import { PGColumn } from '../PGSQL/PGColumn';
import { MyForeignKey } from '../MySQL/MyForeignKey';
import { PGForeignKey } from '../PGSQL/PGForeignKey';
import { MyIndex } from '../MySQL/MyIndex';
import { PGIndex } from '../PGSQL/PGIndex';
export declare namespace MyToPG {
    const GetPGTable: (myTable: MyTable) => PGTable;
    const GetPGColumn: (myColumn: MyColumn) => PGColumn;
    const GetPGForeignKey: (myForeignKey: MyForeignKey) => PGForeignKey;
    const GetPGIndex: (myIndex: MyIndex) => PGIndex;
    const UDTNameFromDataType: (columnName: string) => string;
}
