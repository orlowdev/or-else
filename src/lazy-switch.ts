import { Unary, Unpack } from './types'
import { isFunction } from './utils'

interface ILazySwitchDefaultAware<TContext, TDefaultResult, TResult extends any[]> {
	case: <TNewResult>(
		predicate: TContext | Unary<TContext, boolean>,
		onTrue: TNewResult,
	) => ILazySwitchDefaultAware<
		TContext,
		TDefaultResult,
		[TDefaultResult, Unpack<TResult>, TNewResult]
	>
	match: (value: TContext) => Unpack<TResult> | TDefaultResult
}

interface ILazySwitch<TContext, TResult extends any[]>
	extends ILazySwitchDefaultAware<TContext, unknown, TResult> {
	case: <TNewResult>(
		predicate: TContext | Unary<TContext, boolean>,
		onTrue: TNewResult,
	) => ILazySwitch<TContext, [Unpack<TResult>, TNewResult]>
	default: <TDefaultResult>(
		defaultValue: TDefaultResult,
	) => ILazySwitchDefaultAware<TContext, TDefaultResult, TResult>
}

const lazySwitch = <TContext, TDefault, TResult extends any[]>(
	defaultValue?: TDefault,
	predicates: Array<TContext | Unary<TContext, boolean>> = [],
	results: TResult = [] as any,
): ILazySwitch<TContext, TResult> => ({
	case: (predicate, onTrue) =>
		lazySwitch(defaultValue, predicates.concat([predicate]), results.concat([onTrue])) as any,
	default: (defaultValue) => lazySwitch(defaultValue, predicates, results) as any,
	match: (value) => {
		const foundIndex = predicates.findIndex((predicate) =>
			isFunction(predicate) ? predicate(value) : predicate === value,
		)

		return ~foundIndex ? results[foundIndex] : defaultValue
	},
})

export interface ILazySwitchStatic {
	empty: <TContext, TResult extends any[] = []>() => ILazySwitch<TContext, TResult>
	of: <TContext, TDefaultValue, TResult extends any[] = []>(
		defaultValue: TDefaultValue,
	) => ILazySwitchDefaultAware<TContext, TDefaultValue, TResult>
	default: <TContext, TDefaultValue, TResult extends any[] = []>(
		defaultValue: TDefaultValue,
	) => ILazySwitchDefaultAware<TContext, TDefaultValue, TResult>
}

export const LazySwitch: ILazySwitchStatic = {
	empty: () => lazySwitch(),
	of: (defaultValue) => lazySwitch(defaultValue) as any,
	default: (defaultValue) => lazySwitch(defaultValue) as any,
}
