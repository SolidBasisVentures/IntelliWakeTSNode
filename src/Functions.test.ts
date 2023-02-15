import {IsOn} from '@solidbasisventures/intelliwaketsfoundation'
import {test, expect} from 'vitest'

test('IsOn 1', () => {
	expect(IsOn(1)).toBe(true);
})

test('IsOn null', () => {
	expect(IsOn(null)).toBe(false);
})

test('IsOn active', () => {
	expect(IsOn('active')).toBe(true);
})
