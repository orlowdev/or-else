import test from 'ava'
import { LazySwitch } from '../src/lazy-switch'

test('LazySwitch returns default if none of the cases matched', (t) => {
	t.true(LazySwitch.of(true).case(2, false).match(0))
	t.true(
		LazySwitch.of(true)
			.case((x: number) => x > 1, false)
			.match(1),
	)
	t.true(LazySwitch.empty().default(true).match(0))
})

test('LazySwitch returns value assigned to the matched case', (t) => {
	t.true(LazySwitch.default(false).case(1, true).match(1))
	t.true(
		LazySwitch.of(false)
			.case((x: number) => x == 1, true)
			.case((x: number) => x < 1, null)
			.match(1),
	)
})

test('LazySwitch returns the result of the first matching case', (t) => {
	t.is(LazySwitch.empty().case(1, 1).case(1, 2).default(3).match(1), 1)
})
