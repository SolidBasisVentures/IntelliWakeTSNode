import type {TObjectConstraint, TObjectFromFormDataOptions} from '@solidbasisventures/intelliwaketsfoundation'
import {
	CleanNumber,
	ConstrainObject,
	ObjectFromFormData,
	OmitProperty,
	OmitUndefined,
	PickProperty,
	ReduceObjectToOtherKeys,
	ToArray
} from '@solidbasisventures/intelliwaketsfoundation'
import {PGSQL, TConnection} from './PGSQL/PGSQL'
import {PGParams} from './PGSQL/PGParams'

export type TLoadOptions<RECORD extends Record<string, any>> = {
	sortPrimary?: keyof RECORD,
	ascendingPrimary?: boolean,
	sortSecondary?: keyof RECORD,
	ascendingSecondary?: boolean,
	ignoreCustomerCheck?: boolean
}

export abstract class CTableBase<RECORD extends Record<string, any>, TABLES extends string> {
	public record: RECORD
	public readonly recordDefault: RECORD
	public recordBaseline: RECORD
	public updateID: (keyof RECORD) | (keyof RECORD)[]
	public abstract readonly table: TABLES
	protected nullIfFalsey: (keyof RECORD)[]
	protected arrayFormDataItems: (keyof RECORD)[]
	protected excludeColumnsSave: (keyof RECORD)[]
	protected excludeColumnsInsert: (keyof RECORD)[]
	protected excludeColumnsUpdate: (keyof RECORD)[]
	protected constraint: TObjectConstraint<RECORD> | null = null
	public connection: TConnection

	public defaultImportColumns: (keyof RECORD)[] | null = null
	public defaultImportExcludeColumns: (keyof RECORD)[] | null = null

	public ignoreCustomerCheck = false

	protected constructor(connection: TConnection, defaultValues: RECORD, options?: {
		constraint?: TObjectConstraint<RECORD> | null
		nullIfFalsey?: (keyof RECORD)[]
		arrayFormDataItems?: (keyof RECORD)[]
		excludeColumnsSave?: (keyof RECORD)[]
		excludeColumnsInsert?: (keyof RECORD)[]
		excludeColumnsUpdate?: (keyof RECORD)[]
		ignoreCustomerCheck?: boolean
	}) {
		this.connection = connection
		this.record = {...defaultValues}
		this.recordBaseline = {...this.record}
		this.recordDefault = {...defaultValues}
		this.updateID = 'id' as keyof RECORD

		this.constraint = options?.constraint ?? null
		this.nullIfFalsey = options?.nullIfFalsey ?? []
		this.arrayFormDataItems = options?.arrayFormDataItems ?? []
		this.excludeColumnsSave = options?.excludeColumnsSave ?? []
		this.excludeColumnsInsert = options?.excludeColumnsInsert ?? []
		this.excludeColumnsUpdate = options?.excludeColumnsUpdate ?? []
		this.ignoreCustomerCheck = !!options?.ignoreCustomerCheck
	}

	/**
	 * Applies the given constraint to the record, forcing it to conform to most database constraints
	 *
	 * @return {this} The current object, after applying the constraint to the record.
	 */
	public constrainRecord(): this {
		if (this.constraint) {
			this.record = ConstrainObject(this.record, this.constraint)
		}
		return this
	}

	/**
	 * Updates the record object with the provided values.
	 *
	 * @param {Partial<RECORD>} values - The partial values to update the record with.
	 * @return {this} - Returns the instance of the object that called the method.
	 */
	public setFromAny(values: Partial<RECORD>): this {
		this.record = {...this.record, ...ReduceObjectToOtherKeys(values, this.recordDefault)}
		return this.constrainRecord()
	}

	/**
	 * Sets the values of the record object from the provided formData object.
	 *
	 * @param {FormData} formData - The FormData object containing the data to set on the record.
	 * @param {TObjectFromFormDataOptions<RECORD>} [options] - Optional options for converting the data.
	 * @returns {this} - Returns the current instance of the class.
	 */
	public setFromFormData(formData: FormData, options?: TObjectFromFormDataOptions<RECORD>): this {
		this.record = {...this.record, ...ObjectFromFormData(formData, options)}

		return this.constrainRecord()
	}

	/**
	 * Inserts a record into the database table.
	 *
	 * @returns {Promise<this>} A Promise that resolves to the current instance of the object.
	 * @throws {Error} Throws an error if the object cannot be created for insertion.
	 */
	public async insert(): Promise<this> {
		await this.preInsert()

		this.constrainRecord()

		await this.convertToSave()

		const obj = this.objectToInsert()

		if (obj) {
			const results = await PGSQL.InsertAndGetReturning(this.connection, this.table, obj)
			if (results) {
				this.setFromAny(results)

				await this.convertAfterLoad()

				await this.postInsert()

				// await this.reportEachBaselineChanged(async (column, fromValue, toValue) => await this.valueChanged('INSERT', column, fromValue, toValue))

				this.setBaseline()

			}
		} else {
			throw new Error(`Could not create object to insert ${this.table}`)
		}

		return this
	}

	/**
	 * Updates the record in the database.
	 *
	 * @returns {Promise<this>} - A Promise that resolves to this object after the update is complete.
	 * @throws {Error} - Throws an error if the object to update could not be created.
	 */
	public async update(): Promise<this> {
		await this.preUpdate()

		this.constrainRecord()

		await this.convertToSave()

		const obj = this.objectToUpdate()

		if (obj) {
			const results = await PGSQL.UpdateAndGetReturning(
				this.connection,
				this.table,
				ToArray(this.updateID).reduce<any>((result, id) => {
					result[id] = obj[id]
					return result
				}, {}),
				OmitProperty(obj, 'id')
			)
			if (results) {
				this.setFromAny(results)

				await this.convertAfterLoad()

				await this.postUpdate()

				this.setBaseline()
			}
		} else {
			throw new Error(`Could not create object to update ${this.table}`)
		}

		return this
	}

	/**
	 * Checks if the record is saved.
	 *
	 * @returns {Promise<boolean>} A Promise that resolves to true if the record is saved, or false otherwise.
	 */
	public async isSaved(): Promise<boolean> {
		return (this.record as any).id > 0
	}

	/**
	 * Saves the record with either an insert or update, as appropriate.
	 *
	 * @returns {Promise<this>} A promise that resolves to the current instance of the class after saving the record.
	 * @throws {Error} If the record could not be saved.
	 */
	public async save(): Promise<this> {
		await this.preIDCheck()
		if (this.record) {
			if (await this.isSaved()) {
				return this.update()
			} else {
				return this.insert()
			}
		}

		throw new Error('Could not save record')
	}

	/**
	 * Deletes the record from the database table.
	 *
	 * @returns {Promise<this>} A Promise that resolves with the current instance after the deletion is successful.
	 */
	public async delete(): Promise<this> {
		await this.preDelete()

		await PGSQL.Delete(this.connection, this.table, PickProperty(this.record, ...(ToArray(this.updateID) as any)))

		return this
	}

	/**
	 * Loads a record by ID and sets changes.
	 *
	 * @param {Partial<RECORD>} values - The values to set for the record.
	 * @param ignoreCustomerCheck
	 * @returns {Promise<this>} - A promise that resolves with the current instance of the record.
	 */
	public async loadByIDAndSetChanges(values: Partial<RECORD>, ignoreCustomerCheck = false): Promise<this> {
		const id = (values as any)['id']

		if (id) {
			await this.loadByID(id, ignoreCustomerCheck)
		}

		this.setFromAny(values)

		return this
	}

	/**
	 * Loads a record by ID and sets it as the current record.  If invalid value, throws an error.
	 *
	 * @param {number | string | null | undefined} id - The ID of the record to load.
	 *
	 * @param ignoreCustomerCheck
	 * @returns {Promise<this>} - A promise that resolves with the current instance of the method's class.
	 *
	 * @throws {Error} Throws an error if no ID is specified.
	 * @throws {Error} Throws an error if the record is not found.
	 */
	public async loadID(id: number | string | null | undefined, ignoreCustomerCheck = false): Promise<this> {
		if (!id) {
			throw new Error('No ID specified')
		}

		this.ignoreCustomerCheck = this.ignoreCustomerCheck || ignoreCustomerCheck

		const record = await PGSQL.GetByID<RECORD>(this.connection, this.table, CleanNumber(id))

		if (!record) {
			throw new Error(`Record not found ${this.table}`)
		}

		this.record = (record as RECORD) ?? {...this.recordDefault}

		await this.postSelect()

		this.setBaseline()

		return this
	}

	/**
	 * Load an item by its ID.  If no id exists, returns null.
	 *
	 * @param {number | string | null | undefined} id - The ID of the item to load.
	 * @param ignoreCustomerCheck
	 * @returns {Promise<this | null>} A Promise that resolves to the loaded item if successful, otherwise null.
	 */
	public async loadByID(id: number | string | null | undefined, ignoreCustomerCheck = false): Promise<this | null> {
		if (!id) return null

		try {
			// noinspection UnnecessaryLocalVariableJS
			const item = await this.loadID(id, ignoreCustomerCheck)
			return item
		} catch (err) {
			return null
		}
	}

	/**
	 * Reloads the current record by calling the loadByID method.
	 *
	 * @returns {Promise} A Promise that resolves after the record is reloaded.
	 */
	public async reload() {
		if ((this.record as any).id) {
			await this.loadByID((this.record as any).id)
		}
	}

	/**
	 * Loads the values from the database based on the provided options.
	 *
	 * @param {Partial<RECORD>} values - The values used to filter the records.
	 * @param {object} [options] - The options for sorting and filtering the records.
	 * @param {keyof RECORD} [options.sortPrimary] - The primary field used for sorting the records.
	 * @param {boolean} [options.ascendingPrimary=true] - Indicates whether to sort the records in ascending order based on the primary field. Defaults to true.
	 * @param {keyof RECORD} [options.sortSecondary] - The secondary field used for sorting the records.
	 * @param {boolean} [options.ascendingSecondary=true] - Indicates whether to sort the records in ascending order based on the secondary field. Defaults to true.
	 * @param {boolean} [options.ignoreCustomerCheck=false] - Indicates whether to ignore customer check while fetching the records. Defaults to false.
	 *
	 * @returns {Promise<this>} - A Promise that resolves with the updated object.
	 * @throws {Error} If the item could not be fetched from the database.
	 */
	public async loadValues(
		values: Partial<RECORD>,
		options?: {
			sortPrimary?: keyof RECORD,
			ascendingPrimary?: boolean,
			sortSecondary?: keyof RECORD,
			ascendingSecondary?: boolean,
			ignoreCustomerCheck?: boolean
		}
	): Promise<this> {
		this.ignoreCustomerCheck = this.ignoreCustomerCheck || !!options?.ignoreCustomerCheck

		const params = new PGParams()

		let where = ``
		if (Object.keys(values).length > 0) {
			where = 'WHERE ' + PGSQL.BuildWhereComponents(values, params)
		}

		let sort = ''
		if (options?.sortPrimary) {
			sort += ` ORDER BY ${PGSQL.CleanSQL(options.sortPrimary as string)} ${(options?.ascendingPrimary ?? true) ? 'ASC' : 'DESC'}`
			if (options?.sortSecondary) {
				sort += `, ${PGSQL.CleanSQL(options?.sortSecondary as string)} ${(options?.ascendingSecondary ?? true) ? 'ASC' : 'DESC'}`
			}
		}

		const result = await PGSQL.FetchOne<RECORD>(
			this.connection,
			`SELECT *
			 FROM ${this.table} ${where}` + sort,
			params.values
		)

		if (!result) {
			throw new Error(`Could not fetch item ${this.table}`)
		} else {
			this.record = result
		}

		await this.postSelect()

		this.setBaseline()

		return this
	}

	/**
	 * Loads records by their matching values.
	 *
	 * @param {Partial<RECORD>} values - The values to match against the records.
	 * @param {TLoadOptions<RECORD>} [options] - The options for loading the records.
	 * @returns {Promise<this | null>} A Promise that resolves to this object or `null` if an error occurs.
	 */
	public async loadByValues(
		values: Partial<RECORD>,
		options?: TLoadOptions<RECORD>
	): Promise<this | null> {
		try {
			return await this.loadValues(values, options)
		} catch (err) {
			return null
		}
	}

	/**
	 * Checks if the given values exist.
	 *
	 * @param {Partial<RECORD>} values - The values to check for existence.
	 *
	 * @param ignoreCustomerCheck
	 * @return {Promise<boolean>} - A promise that resolves to a boolean value indicating if the values exist.
	 */
	public async existsValues(
		values: Partial<RECORD>, ignoreCustomerCheck = false
	): Promise<boolean> {
		try {
			return !!(await this.loadValues(values, {ignoreCustomerCheck}))
		} catch (err) {
			return false
		}
	}

	/**
	 * Loads the specified values into the object or initializes it if no values are provided.
	 *
	 * @param {Partial<RECORD>} values - The values to load into the object.
	 * @param {Object} [options] - The options for sorting the primary and secondary keys.
	 * @param {keyof RECORD} [options.sortPrimary] - The primary key to sort by.
	 * @param {boolean} [options.ascendingPrimary] - Specifies whether the primary key should be sorted in ascending order.
	 * @param {keyof RECORD} [options.sortSecondary] - The secondary key to sort by.
	 * @param {boolean} [options.ascendingSecondary] - Specifies whether the secondary key should be sorted in ascending order.
	 *
	 * @return {Promise<this>} - The object after loading the values or initializing it.
	 */
	public async loadValuesOrInitial(
		values: Partial<RECORD>,
		options?: {
			sortPrimary?: keyof RECORD,
			ascendingPrimary?: boolean,
			sortSecondary?: keyof RECORD,
			ascendingSecondary?: boolean,
			ignoreCustomerCheck?: boolean
		}
	): Promise<this> {
		try {
			return await this.loadValues(values, options)
		} catch (err) {
			return this
		}
	}

	/**
	 * Loads the ID or initializes the object.
	 *
	 * @param {number | string | null | undefined} id - The ID to load or null/undefined to initialize the object.
	 * @param ignoreCustomerCheck
	 * @return {Promise<this>} - A promise that resolves to the current object.
	 */
	public async loadIDOrInitial(
		id: number | string | null | undefined, ignoreCustomerCheck = false
	): Promise<this> {
		if (!id) return this
		return this.loadValuesOrInitial({id: id} as any, {ignoreCustomerCheck})
	}

	/**
	 * Loads values or sets initial values for the record.
	 *
	 * @param {Partial<RECORD>} values - The values to be loaded or set.
	 * @param {Object} [options] - Optional parameters for sorting the primary and secondary keys.
	 * @param {keyof RECORD} [options.sortPrimary] - The primary key to sort the values by.
	 * @param {boolean} [options.ascendingPrimary] - Indicates whether to sort the primary key in ascending order.
	 * @param {keyof RECORD} [options.sortSecondary] - The secondary key to sort the values by.
	 * @param {boolean} [options.ascendingSecondary] - Indicates whether to sort the secondary key in ascending order.
	 * @returns {Promise<this>} - A Promise that resolves to the current object.
	 */
	public async loadValuesOrInitialSet(
		values: Partial<RECORD>,
		options?: {
			sortPrimary?: keyof RECORD,
			ascendingPrimary?: boolean,
			sortSecondary?: keyof RECORD,
			ascendingSecondary?: boolean,
			ignoreCustomerCheck?: boolean
		}
	): Promise<this> {
		try {
			return await this.loadValues(values, options)
		} catch (err) {
			this.setFromAny(values)
			return this
		}
	}

	/**
	 * Retrieves a list of records based on the specified IDs.
	 *
	 * @param {number[] | null} ids - An array of record IDs to retrieve. If not provided or is empty, an empty array will be returned.
	 * @returns {Promise<RECORD[]>} - A promise that resolves to an array of record objects.
	 */
	public async listRecordsByIDs(ids?: number[] | null): Promise<RECORD[]> {
		if (!ids || ids.length === 0) return []

		// noinspection SqlResolve
		const sql = `SELECT *
		             FROM ${this.table}
		             WHERE id = ANY ($1::INT[]) `

		return await PGSQL.FetchMany<RECORD>(this.connection, sql, [ids])
	}

	/**
	 * Returns a list of records based on the provided values and options.
	 *
	 * @param {Partial<RECORD>} whereValues - The values to filter the records by.
	 * @param {Object} options - The options to customize the query.
	 * @param {keyof RECORD} options.sortPrimary - The primary field to sort the records by.
	 * @param {boolean} options.ascendingPrimary - Specifies whether to sort the records in ascending order by the primary field.
	 * @param {keyof RECORD} options.sortSecondary - The secondary field to sort the records by.
	 * @param {boolean} options.ascendingSecondary - Specifies whether to sort the records in ascending order by the secondary field.
	 * @param {boolean} options.ignoreCustomerCheck - Specifies whether to ignore customer checks in the query.
	 *
	 * @returns {Promise<RECORD[]>} The list of records that match the provided values and options.
	 */
	public async listRecordsByValues(
		whereValues?: Partial<RECORD>,
		options?: {
			sortPrimary?: keyof RECORD,
			ascendingPrimary?: boolean,
			sortSecondary?: keyof RECORD,
			ascendingSecondary?: boolean
		}
	): Promise<RECORD[]> {
		const params = new PGParams()

		let sql = `SELECT *
		           FROM ${this.table}`

		if (whereValues) {
			const useValues = OmitUndefined(whereValues)
			if (Object.keys(useValues).length > 0) {
				sql += ' WHERE ' + PGSQL.BuildWhereComponents(useValues, params)
			}
		}

		if (options?.sortPrimary) {
			sql += ` ORDER BY ${PGSQL.CleanSQL(options?.sortPrimary as string)} ${(options?.ascendingPrimary ?? true) ? 'ASC' : 'DESC'}`
			if (options?.sortSecondary) {
				sql += `, ${PGSQL.CleanSQL(options?.sortSecondary as string)} ${(options?.ascendingSecondary ?? true) ? 'ASC' : 'DESC'}`
			}
		}

		return await PGSQL.FetchMany<RECORD>(this.connection, sql, params.values)
	}

	/**
	 * Lists the IDs of records based on the specified values, and sorts the results.
	 *
	 * @param {Partial<RECORD>} whereValues - Specifies the values to filter the records.
	 * @param {keyof RECORD} sortPrimary - Specifies the primary field to sort the records by.
	 * @param {boolean} ascendingPrimary - Indicates whether the primary field should be sorted in ascending order (true) or descending order (false). Default is true.
	 * @param {keyof RECORD} sortSecondary - Specifies the secondary field to sort the records by.
	 * @param {boolean} ascendingSecondary - Indicates whether the secondary field should be sorted in ascending order (true) or descending order (false). Default is true.
	 * @return {Promise<number[]>} A promise that resolves with an array of IDs of the filtered and sorted records.
	 */
	public async listIDsByValues(
		whereValues?: Partial<RECORD>,
		sortPrimary?: keyof RECORD,
		ascendingPrimary = true,
		sortSecondary?: keyof RECORD,
		ascendingSecondary = true
	): Promise<number[]> {
		const params = new PGParams()

		let sql = `SELECT id
		           FROM ${this.table}`

		if (whereValues) {
			const useWhereValues: Record<string, any> = {}
			for (const key of Object.keys(whereValues)) {
				if ((whereValues as any)[key] !== undefined) {
					useWhereValues[key] = (whereValues as any)[key]
				}
			}
			if (Object.keys(useWhereValues).length > 0) {
				sql += ' WHERE ' + PGSQL.BuildWhereComponents(useWhereValues, params)
			}
		}

		if (sortPrimary) {
			sql += ` ORDER BY ${params.add(sortPrimary)} ${ascendingPrimary ? 'ASC' : 'DESC'}`
			if (sortSecondary) {
				sql += `, ${params.add(sortSecondary)} ${ascendingSecondary ? 'ASC' : 'DESC'}`
			}
		}

		return await PGSQL.FetchArray<number>(this.connection, sql, params.values)
	}

	/**
	 * Retrieves a record from the database table based on the given values.
	 *
	 * @param {Partial<RECORD>} whereValues - An object containing the values used to filter the records.
	 * @param {Object} options - An optional object specifying sorting options.
	 * @param {keyof RECORD} options.sortPrimary - The primary sort column.
	 * @param {boolean} options.ascendingPrimary - Specifies whether to sort the primary column in ascending order. Default is true.
	 * @param {keyof RECORD} options.sortSecondary - The secondary sort column.
	 * @param {boolean} options.ascendingSecondary - Specifies whether to sort the secondary column in ascending order. Default is true.
	 *
	 * @return {Promise<RECORD | null>} - A promise that resolves to the retrieved record or null if no record is found.
	 */
	public async getRecordByValues(
		whereValues?: Partial<RECORD>,
		options?: {
			sortPrimary?: keyof RECORD,
			ascendingPrimary?: boolean,
			sortSecondary?: keyof RECORD,
			ascendingSecondary?: boolean
		}
	): Promise<RECORD | null> {
		const params = new PGParams()

		let sql = `SELECT *
		           FROM ${this.table}`

		if (whereValues) {
			if (Object.keys(whereValues).length > 0) {
				sql += ' WHERE ' + PGSQL.BuildWhereComponents(whereValues, params)
			}
		}

		if (options?.sortPrimary) {
			sql += ` ORDER BY ${PGSQL.CleanSQL(options?.sortPrimary as string)} ${(options?.ascendingPrimary ?? true) ? 'ASC' : 'DESC'}`
			if (options?.sortSecondary) {
				sql += `, ${PGSQL.CleanSQL(options?.sortSecondary as string)} ${(options?.ascendingSecondary ?? true) ? 'ASC' : 'DESC'}`
			}
		}

		return PGSQL.FetchOne<RECORD>(this.connection, sql, params.values)
	}

	/**
	 * Retrieves a record from the database by its ID.
	 *
	 * @param {number} id - The ID of the record to retrieve.
	 * @return {Promise<RECORD>} A promise resolving to the retrieved record.
	 * @throws {Error} If the record could not be found.
	 */
	public async getRecordByID(id: number): Promise<RECORD> {
		// noinspection SqlResolve
		const sql = `SELECT *
		             FROM ${this.table}
		             WHERE id = $1`

		const one = await PGSQL.FetchOne<RECORD>(this.connection, sql, [id])

		if (!one) throw new Error('Could not find record')

		return one
	}

	/**
	 * Supporting functions
	 */

	/**
	 * Performs pre-ID check.
	 *
	 * @returns {Promise<void>} A promise that resolves with no value.
	 */
	public async preIDCheck(): Promise<void> {
	}

	/**
	 * This method is called before saving a record, either insert or update
	 *
	 * @returns {Promise<void>} - A promise that resolves when the pre-save operations are complete.
	 */
	public async preSave() {
	}

	/**
	 * Performs pre-insert operations before inserting data into the database.
	 * This method is asynchronous.
	 *
	 * @returns {Promise<void>} A promise that resolves with no value when the pre-insert operations are completed.
	 */
	public async preInsert() {
		return this.preSave()
	}

	/**
	 * This method is called before updating a record.
	 * It can be overridden in child classes to perform custom logic or validation.
	 *
	 * @return {Promise<void>} - A promise that resolves when the pre-update process is complete.
	 */
	public async preUpdate() {
		return this.preSave()
	}

	/**
	 * Performs actions before deletion.
	 *
	 * @return {Promise<void>} A promise that resolves when the pre-delete actions are completed or rejects with an error.
	 */
	public async preDelete() {
	}

	/**
	 * Performs actions after save (insert or update).
	 *
	 * @return {Promise<void>} A promise that resolves when the save operation is complete.
	 */
	public async postSave() {
	}

	/**
	 * Performs the operations after inserting a record.
	 * Calls the 'postSave' method to handle the post-save operations.
	 *
	 * @return {Promise<void>} A promise that resolves after the post-insert operations are completed.
	 */
	public async postInsert() {
		await this.postSave()
	}

	/**
	 * Updates the post by calling the postSave method asynchronously.
	 *
	 * @return {Promise<void>} A promise that resolves when the update is complete.
	 */
	public async postUpdate() {
		await this.postSave()
	}

	/**
	 * Deletes a post.
	 *
	 * @returns {Promise<void>} A Promise that resolves when the post is deleted.
	 */
	public async postDelete() {
	}

	/**
	 * Executes the postSelect method.
	 *
	 * @returns {Promise} A promise that resolves once the postSelect method is executed.
	 */
	public async postSelect() {
		await this.convertAfterLoad()
	}

	/**
	 * Returns the object to be saved.
	 *
	 * @protected
	 * @returns {any} - The object to be saved, or the original record if no modifications are required.
	 */
	protected objectToSave(): any {
		if (this.record) {
			const obj: any = {...this.record}

			for (const excludeColumnSave of this.excludeColumnsSave) {
				delete obj[excludeColumnSave]
			}

			return obj
		}

		return this.record
	}

	/**
	 * Returns the object to be inserted into the database.
	 *
	 * @protected
	 * @returns {any} The object to be inserted.
	 */
	protected objectToInsert(): any {
		const obj = this.objectToSave()

		if (obj) {
			for (const excludeColumnInsert of this.excludeColumnsInsert) {
				delete obj[excludeColumnInsert]
			}
		}

		return obj
	}

	/**
	 * Returns the object to be updated by removing the excluded columns from the object to be saved.
	 *
	 * @protected
	 * @returns {any} The updated object, or null if the object to be saved is null.
	 */
	protected objectToUpdate(): any {
		const obj = this.objectToSave()

		if (obj) {
			for (const excludeColumnUpdate of this.excludeColumnsUpdate) {
				delete obj[excludeColumnUpdate]
			}
		}

		return obj
	}

	/**
	 * Sets the baseline for the current object.
	 *
	 * @protected
	 * @returns {this} The current object with the baseline set.
	 */
	protected setBaseline(): this {
		if (this.constraint) {
			this.recordBaseline = ConstrainObject(this.record, this.constraint)
		} else {
			this.recordBaseline = {...this.record}
		}
		return this
	}

	/**
	 * Checks if the baseline has changed for the specified column(s) or all columns.
	 *
	 * @param {keyof RECORD | (keyof RECORD)[]} [forColumn] - The column(s) to check for changes.
	 * If not provided, all columns will be checked.
	 * @return {boolean} - Returns true if the baseline has changed for the specified column(s)
	 * or all columns, false otherwise.
	 */
	public hasBaselineChanged(forColumn?: keyof RECORD | (keyof RECORD)[]): boolean {
		if (forColumn) {
			const columns = Array.isArray(forColumn) ? forColumn : [forColumn]
			return !!columns.find(column => (this.record as any)[column] !== (this.recordBaseline as any)[column])
		} else {
			let key: keyof RECORD
			for (key in this.record) {
				// noinspection JSUnfilteredForInLoop
				if (!this.excludeColumnsSave.includes(key)) {
					// noinspection JSUnfilteredForInLoop
					if (this.record[key] !== this.recordBaseline[key]) {
						return true
					}
				}
			}
		}

		return false
	}

	public reportDiffs(comparedTo: any): any {
		const results: any = {}

		let key: keyof RECORD
		for (key in this.record) {
			// noinspection JSUnfilteredForInLoop
			if (!this.excludeColumnsSave.includes(key)) {
				// noinspection JSUnfilteredForInLoop
				if ((this.record as any)[key] !== comparedTo[key]) {
					// noinspection JSUnfilteredForInLoop
					results[key] = (this.record as any)[key]
				}
			}
		}

		return results
	}

	/**
	 * Pipes a CSV stream into the database table.
	 *
	 * @param {Transform} pipeStream - The CSV stream to pipe into the database.
	 * @param {IStreamInCSVOptions<RECORD>} [options] - Optional options for the CSV import.
	 * @returns {void}
	 */
	// public pipeInCSV(pipeStream: Transform, options?: IStreamInCSVOptions<RECORD>) {
	// 	if (!('query' in this.connection)) throw new Error('Could not load query in connection')
	//
	// 	const useColumns = options?.columns ??
	// 		((options?.excludeColumns ?? this.defaultImportExcludeColumns ?? []).length ?
	// 			Object.keys(this.recordDefault)
	// 			      .filter(key => !((options?.excludeColumns ?? this.defaultImportExcludeColumns ?? [])?.includes(key))) :
	// 			this.defaultImportColumns)
	//
	// 	const sql = `
	// 		COPY ${this.table} ${(useColumns ?? []).length > 0 ? `(${useColumns?.join(',')})` : ''} FROM STDIN
	// 		(
	// 		FORMAT ${options?.format ?? 'CSV'},
	// 		DELIMITER '${options?.delimiter ?? ','}'
	// 		${(options?.header ?? true) ? ', HEADER ' : ''}
	// 		)`
	//
	// 	return pipeStream.pipe(this.connection.query(copyStream.from(sql)))
	// }

	/**
	 * Converts the data into a format suitable for saving.  Designed for encrypting data.
	 *
	 * @protected
	 * @returns {Promise} A promise that resolves when the conversion is complete.
	 */
	protected async convertToSave() {
	}

	/**
	 * Converts data after it has been loaded.  Designed for de-crypting data.
	 *
	 * @protected
	 * @return {Promise<void>} A promise that resolves when the data has been converted.
	 */
	protected async convertAfterLoad() {
	}
}
