import {ReplaceAll} from '@solidbasisventures/intelliwaketsfoundation'

/**
 * `PGParams` is a class responsible for managing and substituting placeholders in PostgreSQL queries.
 *
 * When "add"ing values, the add() function returns the SQL position, while maintaining an internal array of `values` that then is used as the values of the query, matching the positions injected into the SQL.
 *
 * @remarks
 * This class provides methods for adding values and replacing placeholders in SQL queries. It supports standard and 'LIKE' values for SQL,
 * and also has a provision for nullable fields. It uses the format `$<position>` for placeholders.
 *
 * @example
 * const params = new PGParams()
 * console.log(await PGSQL.FetchOne(connection, `SELECT * FROM employee where id = ${params.add(5)}`, params.values))
 *
 * @public
 */
export class PGParams {
	lastPosition: number
	values: any[]

	constructor() {
		this.lastPosition = 0
		this.values = []
	}

	/**
	 * Resets the state of the component so that it can be cleared and used for another SQL statement.
	 *
	 * @remarks
	 * Call this method when you want to reset
	 * the values stored in the component to their initial state.
	 *
	 * @public
	 */
	public reset() {
		this.lastPosition = 0
		this.values = []
	}

	/**
	 * Adds a new value, returning the position of the value (like $1, $2, etc.) and appending the value to the 'values' array.
	 *
	 * @param value - The value to add to the `values` array.
	 * @returns A string representing the new position of the added value in the format `$<position>`.
	 *
	 * @remarks
	 * This method will increment the `lastPosition` property and then push the new value to the `values` array.
	 * It will then return a string representation of the new position of that value.
	 *
	 * @example
	 * const params = new PGParams()
	 * console.log(await PGSQL.FetchOne(connection, `SELECT * FROM employee where id = ${params.add(5)}`, params.values))
	 *
	 * @public
	 */
	public add(value: any): string {
		this.lastPosition++

		this.values.push(value)

		return `$${this.lastPosition}`
	}

	/**
	 * Adds a new LIKE value by prefix and suffixing the string with %'s, returning the position of the value (like $1, $2, etc.) and appending the value to the 'values' array.
	 *
	 * @param value - The value to add to the `values` array with the format '%<value>%'.
	 * @returns A string representing the new position of the added value in the format `$<position>`.
	 *
	 * @remarks
	 * This method will increment the `lastPosition` property and then push the new value to the `values` array.
	 * It will then return a string representation of the new position of that value.
	 *
	 * @example
	 * const params = new PGParams()
	 * console.log(await PGSQL.FetchMany(connection, `SELECT * FROM employee where name ILIKE ${params.addLike(5)}`, params.values))
	 *
	 * @public
	 */
	public addLike(value: string): string {
		return this.add(`%${value}%`)
	}

	/**
	 * Adds a new value, and if not null returns the position of the value (like $1, $2, etc.) and appending the value to the 'values' array, otherwise changes the SQL to be "<field>" IS NULL.
	 *
	 * @param field - The name of the field to check.
	 * @param value - The value to add to the `values` array.
	 * @returns Either '<field> IS NULL', or '<field> = <position>'.
	 *
	 * @remarks
	 * If not null, this method will increment the `lastPosition` property and then push the new value to the `values` array.
	 * It will then return a string representation of the new position of that value.
	 *
	 * @example
	 * const params = new PGParams()
	 * console.log(await PGSQL.FetchMany(connection, `SELECT * FROM employee where ${params.addEqualNullable('salary', null)}`, params.values))
	 *
	 * @public
	 */
	public addEqualNullable(field: string, value: any): string {
		if (value === null || value === undefined) {
			return `${field} IS NULL`
		} else {
			return `${field} = ${this.add(value)}`
		}
	}

	/**
	 * Replaces placeholders in the given SQL string with actual values from the `values` array.
	 *
	 * @param sql - The SQL string with placeholders in the format `$<position>`.
	 * @returns The SQL string with actual values replacing corresponding placeholders.
	 *
	 * @remarks
	 * This method will take an SQL string, look for placeholder expressions in the format `$<position>`,
	 * and replace these placeholders with the corresponding values from the `values` array.
	 * If the value is a string it will be surrounded with quotes.
	 * The positions are counted from the end of the `values` array to the beginning.
	 * Please notice that the counter starts from 1, thus the replacement of `$1` corresponds to the last value pushed to the array.
	 *
	 * @example
	 * ```typescript
	 * replaceSQLWithValues("SELECT * FROM users WHERE name = $1 AND age = $2")
	 * // Assume $1 corresponds to 'John' and $2 corresponds to 30
	 * // Returns: "SELECT * FROM users WHERE name = 'John' AND age = 30"
	 * ```
	 *
	 * @public
	 */
	public replaceSQLWithValues(sql: string): string {
		let returnSQL = sql

		for (let i = this.values.length; i > 0; i--) {
			returnSQL = ReplaceAll(`$${i}`, typeof this.values[i - 1] === 'string' ? `'${this.values[i - 1]}'` : this.values[i - 1], returnSQL)
		}

		return returnSQL
	}
}
