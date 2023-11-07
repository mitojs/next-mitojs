# Contributing Guidelines

Welcome! We appreciate your interest in contributing to our project. To make the process easier and more efficient for everyone involved, please take a little bit time to follow these guidelines when submitting pull requests or bug reports.

## Project Structure

```
```

## Development Workstation Setup

Make sure your Node >= v18.18.0, pnpm >= v8.9.2

### Install

```bash
$ pnpm i
```

### Verify
run command for building '@mitojs/shared'
```bash
$ pnpm nx run @mitojs/shared:build
```

## Debugger Locally

Project's monorepo feature is based on the [Nx](https://github.com/nrwl/nx) tool, so most of the following commands include nx parameters.

### Build Package

```bash
# build single package
$ pnpm nx <name>:test

# build all packages
$ pnpm nx run-many --nx-bail --target=build

# build multiple packages with `Nx`
$ pnpm nx run-many --nx-bail --target=build --project=<glob>
# 🌰 pnpm nx run-many --nx-bail --target=build --projects='@mitojs/*'
```


### Running Unit Test

```bash
# run unit test for all packages
$ pnpm test

# run unit test for single package with `Nx`
$ pnpm nx <name>:test
# 🌰 pnpm nx @mitojs/node-gc:test
```

Well,you are able to `cd` sub package folder to run test command,too.

```bash
# cd packages/web
$ pnpm test
```

### Running E2e Test

```bash
$ pnpm e2e
```

Well,you can add `--open` param to launch cypress.app locally.

## Commit Guidelines

### Commit With cz

```bash
$ pnpm commit
```

After you run `pnpm commit`,just pick the correct type and scope for current change.It's convenient!

### Commit with native Git commands

Of course, you can use native `Git` commands, but they must be in compliance with the [conventionalcommits](https://www.conventionalcommits.org/en/v1.0.0/).

Here are the preset commit types:

- feat: ✨ A new feature
- fix: 🐛 A bug fix
- build: 📦️ Changes that affect the build system or external dependencies
- ci: 🎡 Changes to our CI configuration files and scripts
- docs: 📝 Documentation only changes
- refactor: ♻️ A code change that neither fixes a bug nor adds a feature
- style: 💄 Changes that do not affect the meaning of the code
- perf: ⚡️ A code change that improves performance
- test: ✅ Adding missing tests or correcting existing tests
- chore: 🔨 Other changes that don't modify src or test files
- revert: ⏪️ Reverts a previous commit

```bash
<commit type>(scope): <description>
# 🌰 feat(web): ✨ add a new feature for xxx
# 🌰 fix(web): 🐛 fix a bug for xxx
```

