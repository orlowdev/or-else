import { Nullable, Thunk, Unary } from './types'

const unsafeGet = Symbol('EitherUnsafeGet')

export interface IEitherStatic {
	readonly isLeft: false
	readonly isRight: false
	try: <TRight, TLeft>(thunk: Thunk<TRight>) => IEither<TRight, TLeft>
	fromNullable: <TRight>(x: Nullable<TRight>) => IEither<NonNullable<TRight>, null>
	right: <TRight, TLeft = TRight>(x: TRight) => IEither<TRight, TLeft>
	left: <TLeft, TRight = TLeft>(x: TLeft) => IEither<TRight, TLeft>
	of: <TRight, TLeft = TRight>(x: TRight) => IEither<TRight, TLeft>
}

export interface IEither<TRight, TLeft = TRight> {
	readonly isLeft: boolean
	readonly isRight: boolean
	[unsafeGet]: () => TLeft | TRight
	equals: <TOtherContext>(other: IEither<TRight | TLeft | TOtherContext>) => boolean
	swap: () => IEither<TLeft, TRight>
	map: <TNewRight>(onRight: Unary<TRight, TNewRight>) => IEither<TNewRight, TLeft>
	bimap: <TNewRight, TNewLeft = TNewRight>(
		onLeft: Unary<TLeft, TNewLeft>,
		onRight: Unary<TRight, TNewRight>,
	) => IEither<TNewRight, TNewLeft>
	leftMap: <TNewLeft>(onLeft: Unary<TLeft, TNewLeft>) => IEither<TRight, TNewLeft>
	chain: <TNewRight, TNewLeft = TNewRight>(
		onRight: (x: TRight) => IEither<TNewRight, TNewLeft>,
	) => IEither<TNewRight, TLeft | TNewLeft>
	leftChain: <TNewLeft>(
		onLeft: (ctx: TLeft) => IEither<TRight, TNewLeft>,
	) => IEither<TRight, TNewLeft>
	ap: <TNewRight, TNewLeft = TLeft>(
		other: IEither<Unary<TRight, TNewRight>, Unary<TRight, TNewLeft>>,
	) => IEither<TNewRight, TLeft>
	getOrElse: <TNewLeft>(onLeft: Unary<TLeft, TNewLeft>) => TNewLeft
	fold: <TNewRight, TNewLeft = TNewRight>(
		onLeft: Unary<TLeft, TNewLeft>,
		onRight: Unary<TRight, TNewRight>,
	) => TNewLeft | TNewRight
}

export const left = <TLeft, TRight = TLeft>(x: TLeft): IEither<TRight, TLeft> => ({
	isLeft: true,
	isRight: false,
	[unsafeGet]: () => x,
	equals: (other) => other.isLeft && other[unsafeGet]() === x,
	swap: () => right(x),
	map: () => left(x),
	leftMap: (onLeft) => left(onLeft(x)),
	bimap: (onLeft) => left(onLeft(x)),
	chain: () => left(x),
	leftChain: (onLeft) => onLeft(x),
	ap: () => left(x),
	getOrElse: (onLeft) => onLeft(x),
	fold: (onLeft) => onLeft(x),
})

export const right = <TRight, TLeft = TRight>(x: TRight): IEither<TRight, TLeft> => ({
	isLeft: false,
	isRight: true,
	[unsafeGet]: () => x,
	equals: (other) => other.isRight && other[unsafeGet]() === x,
	swap: () => left(x),
	map: (onRight) => right(onRight(x)),
	leftMap: () => right(x),
	bimap: (_, onRight) => right(onRight(x)),
	chain: (onRight) => onRight(x),
	leftChain: () => right(x),
	ap: (other) => (other.isRight ? (right(other[unsafeGet]()(x)) as any) : right(x)),
	getOrElse: () => x as any,
	fold: (_, onRight) => onRight(x),
})

export const Either: IEitherStatic = {
	isLeft: false,
	isRight: false,
	try: (thunk) => {
		try {
			return right(thunk())
		} catch (error) {
			return left(error)
		}
	},
	fromNullable: (x) => (x == null ? left(null) : (right(x) as any)),
	right: (x) => right(x) as any,
	left: (x) => left(x),
	of: (x) => right(x),
}
