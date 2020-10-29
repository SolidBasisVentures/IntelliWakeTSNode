import {MyColumn} from "./MyColumn";
import {MyIndex} from "./MyIndex";
import {MyForeignKey} from "./MyForeignKey";
import moment from "moment";
import * as path from "path";
import fs from "fs";
import {IsOn} from '@solidbasisventures/intelliwaketsfoundation'

const TS_EOL = '\r\n';

export class MyTable {
    public name = "";
    public description = "";

    public ENGINE = "InnoDB";
    public CHARSET = "utf8mb4";
    public COLLATE = "utf8mb4_unicode_ci";
    public ROW_FORMAT = "COMPACT";

    static readonly DEFINITIONS_DIR = path.resolve("./") + "/src/Assets/Tables";
    static readonly TS_INTERFACE_DIR = path.resolve("./") + "/../app/src/Common/Tables";
    static readonly TS_CLASS_DIR = path.resolve("./") + "/src/Tables";

    public columns: MyColumn[] = [];

    public indexes: MyIndex[] = [];

    public foreignKeys: MyForeignKey[] = [];

    constructor(instanceData?: MyTable) {
        if (instanceData) {
            this.deserialize(instanceData);
        }
    }

    private deserialize(instanceData: MyTable) {
        const keys = Object.keys(this);

        for (const key of keys) {
            if (instanceData.hasOwnProperty(key)) {
                switch (key) {
                    case 'columns':
                        for (const column of ((instanceData as any)[key] as MyColumn[])) {
                            (this as any)[key].push(new MyColumn(column));
                        }
                        break;
                    case 'indexes':
                        for (const index of ((instanceData as any)[key] as MyIndex[])) {
                            (this as any)[key].push(new MyIndex(index));
                        }
                        break;
                    case 'foreignKeys':
                        for (const foreignKey of ((instanceData as any)[key] as MyForeignKey[])) {
                            (this as any)[key].push(new MyForeignKey(foreignKey));
                        }
                        break;
                    default:
                        (this as any)[key] = (instanceData as any)[key];
                        break;
                }
            }
        }
    }

    public indexOfColumn(columnName: string): number {
        return this.columns.findIndex(column => column.COLUMN_NAME === columnName);
    }

    public indexesOfForeignKeyByColumn(columnName: string): number[] {
        let indexes: number[] = [];

        for (let i = 0; i < this.foreignKeys.length; i++) {
            if (this.foreignKeys[i].columnNames.includes(columnName)) {
                indexes.push(i);
            }
        }

        return indexes;
    }

    public getForeignKeysByColumn(columnName: string): MyForeignKey[] {
        let fks: MyForeignKey[] = [];

        const indexes = this.indexesOfForeignKeyByColumn(columnName);

        for (const index of indexes) {
            fks.push(this.foreignKeys[index]);
        }

        return fks;
    }

    public removeForeignKeysByColumn(columnName: string) {
        this.foreignKeys = this.foreignKeys.filter(foreignKey => !foreignKey.columnNames.includes(columnName));
    }

    public addForeignKey(myForeignKey: MyForeignKey) {
        this.foreignKeys.push(myForeignKey);
    }

    public getColumn(columnName: string): MyColumn | null {
        return this.columns.find(column => column.COLUMN_NAME === columnName) ?? null;
    }

    public removeColumn(columnName: string) {
        const column = this.getColumn(columnName);

        if (!!column) {
            this.removeForeignKeysByColumn(columnName);

            this.columns.filter(column => column.COLUMN_NAME !== columnName);

            this.reOrderColumns();
        }
    }

    public addColumn(myColumn: MyColumn) {
        if (!myColumn.ORDINAL_POSITION) {
            myColumn.ORDINAL_POSITION = 999999;
        }

        this.columns = this.columns.filter(column => column.COLUMN_NAME !== myColumn.COLUMN_NAME);

        for (let i = 0; i < this.columns.length; i++) {
            if (this.columns[i].ORDINAL_POSITION >= myColumn.ORDINAL_POSITION) {
                this.columns[i].ORDINAL_POSITION++;
            }
        }

        this.columns.push(myColumn);

        this.reOrderColumns();
    }

    public reOrderColumns() {
        this.columns = this.columns.sort((a, b) =>
            a.ORDINAL_POSITION - b.ORDINAL_POSITION
        );

        let position = 0;

        for (let i = 0; i < this.columns.length; i++) {
            position++;
            this.columns[i].ORDINAL_POSITION = position;
        }
    }

    public addIndex(myIndex: MyIndex) {
        this.indexes.push(myIndex);
    }

    public tableHeaderText(forTableText: string): string {
        let text = "/**" + TS_EOL;
        text += " * Automatically generated: " + moment().format('Y-MM-DD HH:mm:ss') + TS_EOL;
        text += " * © " + moment().format('Y') + ", Solid Basis Ventures, LLC." + TS_EOL; // Must come after generated date so it doesn't keep regenerating
        text += " * DO NOT MODIFY" + TS_EOL;
        text += " *" + TS_EOL;
        text += " * " + forTableText + ": " + this.name + TS_EOL;
        if (!!this.description) {
            text += " *" + TS_EOL;
            text += " * " + MyTable.CleanComment(this.description) + TS_EOL;
        }
        text += " */" + TS_EOL;
        text += TS_EOL;

        return text;
    }

    public tsText(): string {
        let text = this.tableHeaderText("Table Manager for");
        text += `export interface I${this.name} {` + TS_EOL;
        let addComma = false;
        let addComment = "";
        for (const myColumn of this.columns) {
            if (addComma) {
                text += "," + addComment + TS_EOL;
            }
            text += "\t";
            text += myColumn.COLUMN_NAME;
            text += ": ";
            text += myColumn.jsType();
            if (IsOn(myColumn.IS_NULLABLE ?? 'YES')) {
                text += ' | null';
            }
            if (!!myColumn.COLUMN_COMMENT) {
                addComment = " // " + MyTable.CleanComment(myColumn.COLUMN_COMMENT);
            } else {
                addComment = "";
            }
            addComma = true;
        }
        text += addComment + TS_EOL;
        text += "}" + TS_EOL;
        text += TS_EOL;
        text += `export const initial_${this.name}: I${this.name} = {` + TS_EOL;
        addComma = false;
        addComment = "";
        for (const myColumn of this.columns) {
            if (addComma) {
                text += "," + TS_EOL;
            }
            text += "\t";
            text += myColumn.COLUMN_NAME;
            text += ": ";
            if (!myColumn.blobType()) {
                if (myColumn.isAutoIncrement || myColumn.EXTRA === 'auto_increment') {
                    text += "0";
                } else if (!!myColumn.COLUMN_DEFAULT) {
                    if (myColumn.booleanType()) {
                        text += (IsOn(myColumn.COLUMN_DEFAULT) ? 'true' : 'false');
                    } else if (myColumn.dateType()) {
                        text += "''";
                    } else if (myColumn.integerFloatType() || myColumn.dateType()) {
                        text += myColumn.COLUMN_DEFAULT;
                    } else {
                        text += "'" + myColumn.COLUMN_DEFAULT + "'";
                    }
                } else if (IsOn(myColumn.IS_NULLABLE)) {
                    text += "null";
                } else {
                    if (myColumn.booleanType()) {
                        text += "true";
                    } else if (myColumn.integerFloatType()) {
                        text += "0";
                    } else if (myColumn.dateType()) {
                        text += "''";
                    } else {
                        text += "''";
                    }
                }
            } else {
                text += "''";
            }
            addComma = true;
        }
        text += addComment + TS_EOL;
        text += "};" + TS_EOL;

        return text;
    }

    public tsTextTable(): string {
        let text = this.tableHeaderText("Table Class for");
        text += `import {initial_${this.name}, I${this.name}} from "../../../app/src/Common/Tables/${this.name}";` + TS_EOL;
        text += `import {TTables} from "../Database/Tables";` + TS_EOL;
        text += `import {TConnection} from "../Database/mysqlConnection";` + TS_EOL;
        text += `import {_Table} from "./_Table";` + TS_EOL;
        text += TS_EOL;
        text += `export class C${this.name} extends _CTable<I${this.name}> {` + TS_EOL;
        text += `\tpublic readonly table: TTables;` + TS_EOL;
        text += TS_EOL;
        text += `\tconstructor(connection: TConnection, initialValues?: I${this.name} | any) {` + TS_EOL;
        text += `\t\tsuper(connection, initialValues, initial_${this.name});` + TS_EOL;
        text += TS_EOL;
        text += `\t\tthis.table = '${this.name}';` + TS_EOL;
        text += `\t}` + TS_EOL;
        text += `}` + TS_EOL;

        return text;
    }

    // @ts-ignore
	public ddlPrimaryKey(altering: boolean): string | null {
        let found = false;

        let ddl = "PRIMARY KEY (`";

        for (const column of this.columns) {
            if (column.isPK) {
                if (found) {
                    ddl += "`,`";
                }
                ddl += column.COLUMN_NAME;
                found = true;
            }
        }

        if (found) {
            ddl += "`)";

            return ddl;
        }

        return null;
    }

    public async ddlText(process: boolean, includeFKs: boolean, altering = false): Promise<string | null> {
        let ddl = "";

        let shouldProcess = process;

        if (!altering) {
            if (altering) {
                /** @noinspection SqlResolve */
                ddl += `DROP TABLE ${this.name} CASCADE;` + TS_EOL;
            }

            ddl += `CREATE TABLE ${this.name} (` + TS_EOL;

            let prevColumn: MyColumn | null = null;
            for (const myColumn of this.columns) {
                if (prevColumn !== null) {
                    ddl += "," + TS_EOL;
                }

                ddl += "\t" + myColumn.ddlDefinition(this, prevColumn, altering);

                prevColumn = myColumn;
            }
            const pk = this.ddlPrimaryKey(altering);
            if (!!pk) {
                ddl += "," + TS_EOL + "\t" + pk;
            }
            for (const index of this.indexes) {
                ddl += "," + TS_EOL + "\t" + index.ddlDefinition(this, altering);
            }
            if (includeFKs) {
                for (const foreignKey of this.foreignKeys) {
                    ddl += "," + TS_EOL + "\t" + foreignKey.ddlKeyDefinition(this, altering);
                }
                for (const foreignKey of this.foreignKeys) {
                    ddl += "," + TS_EOL + "\t" + foreignKey.ddlConstraintDefinition(this, altering);
                }
            }

            ddl += TS_EOL;
            ddl += ') ';
            ddl += 'ENGINE=' + (this.ENGINE ?? 'InnoDB') + ' ';
            ddl += 'DEFAULT CHARSET=' + (this.CHARSET ?? 'utf8mb4') + ' ';
            ddl += 'COLLATE=' + (this.COLLATE ?? 'utf8mb4_unicode_ci') + ' ';
            ddl += 'ROW_FORMAT=' + (this.ROW_FORMAT ?? 'COMPACT');
            ddl += ';';
        } else {
            let needsComma = false;
            shouldProcess = false;
            ddl += `ALTER TABLE ${this.name}` + TS_EOL;
            if (includeFKs) {
                for (const index of this.indexes) {
                    // if (!await SQL.IndexExists(connection, this.name, index.name(this))) {
                        if (needsComma) {
                            ddl += "," + TS_EOL;
                        }
                        needsComma = true;
                        shouldProcess = process && true;
                        ddl += "\t" + index.ddlDefinition(this, altering);
                    // }
                }
                for (const foreignKey of this.foreignKeys) {
                    // if (!await SQL.IndexExists(connection, this.name, foreignKey.fkName(this, 'idx'))) {
                        if (needsComma) {
                            ddl += "," + TS_EOL;
                        }
                        needsComma = true;
                        shouldProcess = process && true;
                        ddl += "\t" + foreignKey.ddlKeyDefinition(this, altering);
                    // }
                }
                for (const foreignKey of this.foreignKeys) {
                    // if (!await SQL.ConstraintExists(connection, this.name, foreignKey.fkName(this, 'fk'))) {
                        if (needsComma) {
                            ddl += "," + TS_EOL;
                        }
                        needsComma = true;
                        shouldProcess = process && true;
                        ddl += "\t" + foreignKey.ddlConstraintDefinition(this, altering);
                    // }
                }
            }
            if (needsComma) {
                ddl += TS_EOL;
                ddl += ';';
            // } else {
            //     ddl = '';
            }

            shouldProcess = false;
        }

        if (shouldProcess && !!ddl) {
            // if (!await SQL.ExecuteRaw(connection, ddl)) {
            //     return null;
            // }
        }

        return ddl;
    }

    public save() {
        for (let i = 0; i < this.columns.length; i++) {
            this.columns[i].clean();
        }

        MyTable.SetPermissions();

        fs.mkdirSync(MyTable.TS_INTERFACE_DIR + '/New/', {recursive: true});
        fs.mkdirSync(MyTable.TS_CLASS_DIR + '/New/', {recursive: true});
        MyTable.writeFileIfDifferent(MyTable.DEFINITIONS_DIR + '/' + this.name + '.json', JSON.stringify(this), false);
        MyTable.writeFileIfDifferent(MyTable.TS_INTERFACE_DIR + '/New/I' + this.name + '.ts', this.tsText(), true);
        MyTable.writeFileIfDifferent(MyTable.TS_CLASS_DIR + '/New/C' + this.name + '.ts', this.tsTextTable(), true, true);
    }

    static ExistsNewTS(): boolean {
        return (fs.existsSync(MyTable.TS_INTERFACE_DIR + '/New') && ((fs.readdirSync(MyTable.TS_INTERFACE_DIR + '/New') as string[]) ?? []).filter(file => file.endsWith('.ts')).length > 0) || (fs.existsSync(MyTable.TS_CLASS_DIR + '/New') && ((fs.readdirSync(MyTable.TS_CLASS_DIR + '/New') as string[]) ?? []).filter(file => file.endsWith('.ts')).length > 0);
    }

    public moveInNewTS() {
        // Note: this may break the server as it could change the definition of certain files.  Do this AFTER the connections have been closed!
        let fileName = MyTable.TS_INTERFACE_DIR + '/New/I' + this.name + '.ts';

        if (fs.existsSync(fileName)) {
            fs.renameSync(fileName, fileName.replace('/New/', '/'));
        }

        fileName = MyTable.TS_CLASS_DIR + '/New/C' + this.name + '.ts';

        if (fs.existsSync(fileName)) {
            fs.renameSync(fileName, fileName.replace('/New/', '/'));
        }
    }

    public static writeFileIfDifferent(fileName: string, data: string, useSBVCheck: boolean, skipIfExists = false) {
        MyTable.SetPermissions();

        if (skipIfExists && (fs.existsSync(fileName.replace('/New/', '/')) || fs.existsSync(fileName))) {
            return;
        }

        if (useSBVCheck) {
            let newSBVPos = data.indexOf("Solid Basis Ventures");
            if (newSBVPos) {
                if (fs.existsSync(fileName.replace('/New/', '/')) && (!fileName.includes('/New/') || !fs.existsSync(fileName))) {
                    const originalData = fs.readFileSync(fileName.replace('/New/', '/'), 'utf8');
                    const originalSBVPos = originalData.indexOf("Solid Basis Ventures");
                    const originalCheck = originalData.substr(originalSBVPos);
                    const newCheck = data.substr(newSBVPos);
                    if (originalCheck === newCheck) {
                        return true;
                    }
                }
            }
        } else {
            if (fs.existsSync(fileName)) {
                const originalData = fs.readFileSync(fileName, 'utf8');
                if (originalData === data) {
                    return true;
                }
            }
        }

        return fs.writeFileSync(fileName, data);
    }

    public static writeFileIfNotExists(fileName: string, data: string) {
        MyTable.SetPermissions();

        if (!fs.existsSync(fileName)) {
            fs.writeFileSync(fileName, data);
        }
    }

    public async syncToDB(includeFKs: boolean, altering = false): Promise<boolean> {
        const ddl = await this.ddlText(true, includeFKs, altering);

        return !!ddl;
    }

    public static SaveAll(myTables: MyTable[]) {
    	for (let i = 0; i < myTables.length; i++) {
    		myTables[i].save();
    	}
    }

    public static Load(fileName: string): MyTable | null {
        MyTable.SetPermissions();

        let calcFileName = fileName;

        if (!calcFileName.endsWith('.json')) {
            calcFileName += '.json';
        }

        if (!calcFileName.startsWith(MyTable.DEFINITIONS_DIR)) {
            calcFileName = MyTable.DEFINITIONS_DIR + "/" + calcFileName;
        }

        return new MyTable(JSON.parse(fs.readFileSync(calcFileName) as any) as MyTable);
    }

    public static LoadAll(): MyTable[] {
        MyTable.SetPermissions();

        let files = fs.readdirSync(MyTable.DEFINITIONS_DIR);

        let myTables: MyTable[] = [];

        for (const file of files) {
            if (file.endsWith('.json')) {
                const myTable = MyTable.Load(file);
                if (!!myTable) {
                    myTables.push(myTable);
                }
            }
        }

        return myTables;
    }

    // noinspection JSUnusedLocalSymbols
    public static DeleteAll() {
        MyTable.SetPermissions();

        let files = fs.readdirSync(MyTable.DEFINITIONS_DIR) as string[];
        for (const file of files) {
            if (file.endsWith('.json')) {
                fs.unlinkSync(MyTable.DEFINITIONS_DIR + "/" + file);
            }
        }

        files = fs.readdirSync(MyTable.TS_INTERFACE_DIR) as string[];
        for (const file of files) {
            if (file.endsWith('.json')) {
                fs.unlinkSync(MyTable.TS_INTERFACE_DIR + "/" + file);
            }
        }
    }

    // static ArePermissionsSet = false;

    public static SetPermissions() {
        // if (!self::ArePermissionsSet) {
        // 	self::ArePermissionsSet = true;
        //
        // 	exec('chmod a+rwx -R ' + MyTable.TS_INTERFACE_DIR);
        // 	exec('chmod a+rwx -R ' + MyTable.TABLES_DIR);
        // 	exec('chmod a+rwx -R ' + MyTable.TRAITS_DIR);
        // 	exec('chmod a+rwx -R ' + MyTable.DEFINITIONS_DIR);
        // }
    }

    public static CleanComment(comment: string): string {
        if (!comment) {
        	return comment;
        }

        return comment.replace(/[\n\r]/g, ' ');
    }
}
