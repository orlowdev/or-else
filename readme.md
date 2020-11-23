# ||else

[![Maintainability](https://api.codeclimate.com/v1/badges/ce5601f3a66994877fb0/maintainability)](https://codeclimate.com/github/orlovedev/or-else/maintainability)
[![codecov](https://codecov.io/gh/orlovedev/or-else/branch/main/graph/badge.svg)](https://codecov.io/gh/orlovedev/or-else)

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![versioning: or-release](https://img.shields.io/badge/versioning-%7C%7Cr-E76D83.svg)](https://github.com/orlovedev/or-release)

A set of tools for capturing and maintaining multiple application flows.

## Contents

- `Switch` works like the ordinary `switch`: you provide the cases and the default value, it jumps in to the proper case or falls through to the default result. The cases may be matched against a **value** or with a **function**.
- `LazySwitch` is like the previous `Switch` but it accepts the value to be matched against provided prefixes in a `match` method. The cases may be matched against a **value** or with a **function**.
- `Either` is a monad with a `Left` and a `Right` state that can be used for capturing uncommon behaviour or maintaining two flows of application execution at once.

## Installation

```sh
yarn add or-else
```

or

```sh
npm i -S or-else
```

## Examples

TBD
