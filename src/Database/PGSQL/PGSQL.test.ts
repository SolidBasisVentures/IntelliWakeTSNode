import {describe, it, expect} from 'vitest'
import {IsValidPostgresInteger} from './PGSQL'

describe('IsValidPostgresInteger', () => {
	it('should return true for a valid signed integer within range', () => {
		expect(IsValidPostgresInteger(12345)).toBe(true)
		expect(IsValidPostgresInteger(-12345)).toBe(true)
		expect(IsValidPostgresInteger(2147483647)).toBe(true)
		expect(IsValidPostgresInteger(-2147483648)).toBe(true)
		expect(IsValidPostgresInteger(0)).toBe(true)
	})

	it('should return true for a valid unsigned integer within range', () => {
		expect(IsValidPostgresInteger(4294967295, true)).toBe(true)
		expect(IsValidPostgresInteger(0, true)).toBe(true)
	})

	it('should return false for a value out of signed integer range', () => {
		expect(IsValidPostgresInteger(Number.MAX_SAFE_INTEGER)).toBe(false)
		expect(IsValidPostgresInteger(-2147483649)).toBe(false)
		expect(IsValidPostgresInteger(2147483648)).toBe(false)
	})

	it('should return false for a value out of unsigned integer range', () => {
		expect(IsValidPostgresInteger(4294967296, true)).toBe(false)
		expect(IsValidPostgresInteger(-1, true)).toBe(false)
	})

	it('should return false for a value that is not a number or not an integer', () => {
		expect(IsValidPostgresInteger(3.14)).toBe(false)
		expect(IsValidPostgresInteger('12345')).toBe(true)
		expect(IsValidPostgresInteger(null)).toBe(false)
		expect(IsValidPostgresInteger(undefined)).toBe(false)
		expect(IsValidPostgresInteger({})).toBe(false)
		expect(IsValidPostgresInteger([])).toBe(false)
	})
})
