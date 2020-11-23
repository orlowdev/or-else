export type Unary<TArg, TReturn = TArg> = (x: TArg) => TReturn

export type Unpack<T> = T extends Array<infer U> ? U : T

export type Nullable<T> = T | null | undefined

export type Thunk<T> = () => T
