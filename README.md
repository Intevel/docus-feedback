![/](https://github.com/Intevel/docus-feedback/blob/master/preview.png?raw=true)

# docus-feedback

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

Get Feedback on your [Docus](https://docus.dev) based documentation

- [✨ Release Notes](/CHANGELOG.md)
- [🏀 Example](https://codesandbox.io/p/sandbox/docus-feedback-example-8ucvjh?file=%2FREADME.md)

## Features

- 💾 SQLite based Storage
- ⛰ Handy composables
- 🗂 TypeScript Support

## Quick Introduction
This module is an extension of the documentation theme [Docus](https://docus.dev), this module creates an API endpoint for feedbacks, you then have the possibility to create a component like in the [Example](https://codesandbox.io/p/sandbox/docus-feedback-example-8ucvjh?file=%2FREADME.md) and allow the user to provide feedback for the documentation articles via the composable that comes with this module.

The feedbacks are stored in an SQLite Database and can be checked then.

## Quick Setup

1. Add `docus-feedback` dependency to your project

```bash
# Using pnpm
pnpm add -D docus-feedback

# Using yarn
yarn add --dev docus-feedback

# Using npm
npm install --save-dev docus-feedback
```

2. Add `docus-feedback` to the `modules` section of `nuxt.config.ts`

```js
export default defineNuxtConfig({
  modules: [
    'docus-feedback'
  ]
})
```

That's it! You can get feedback on your documentation ✨

## Development

```bash
# Install dependencies
pnpm install

# Generate type stubs
pnpm run dev:prepare

# Develop with the playground
pnpm run dev
```

## License

Copyright (c) 2023 Conner Luka Bachmann & Matteo Rezzin
[MIT License](./LICENSE)

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/docus-feedback/latest.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-version-href]: https://npmjs.com/package/docus-feedback

[npm-downloads-src]: https://img.shields.io/npm/dm/docus-feedback.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-downloads-href]: https://npmjs.com/package/docus-feedback

[license-src]: https://img.shields.io/npm/l/docus-feedback.svg?style=flat&colorA=18181B&colorB=28CF8D
[license-href]: https://npmjs.com/package/docus-feedback

[nuxt-src]: https://img.shields.io/badge/Nuxt-18181B?logo=nuxt.js
[nuxt-href]: https://nuxt.com
