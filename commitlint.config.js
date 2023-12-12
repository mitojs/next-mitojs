const fg = require('fast-glob')
const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')

const workspaceConfig = yaml.load(fs.readFileSync('./pnpm-workspace.yaml', 'utf8'))
const scopes = workspaceConfig.packages
  .reduce((acc, workspaceGlob) => {
    const specificPackageDirName = fg.sync(workspaceGlob, { onlyDirectories: true }).map((filePath) => path.basename(filePath))
    acc.push(...specificPackageDirName)
    return acc
  }, [])
  .concat('architecture', 'changesets')

module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [2, 'always', scopes],
    'scope-min-length': [2, 'always', 1],
    'header-max-length': [1, 'always', 600],
  },
  prompt: {
    messages: {
      type: "Select the type of change that you're committing:",
      scope: 'Denote the SCOPE of this change (required):',
      customScope: 'Denote the SCOPE of this change:',
      subject: 'Write a SHORT, IMPERATIVE tense description of the change:\n',
      body: 'Provide a LONGER description of the change (optional). Use "|" to break new line:\n',
      breaking: 'List any BREAKING CHANGES (optional). Use "|" to break new line:\n',
      footerPrefixesSelect: 'Select the ISSUES type of changeList by this change (optional):',
      customFooterPrefix: 'Input ISSUES prefix:',
      footer: 'List any ISSUES by this change. E.g.: #31, #34:\n',
      confirmCommit: 'Are you sure you want to proceed with the commit above?',
    },
    types: [
      { value: 'feat', name: 'feat:     ✨  A new feature', emoji: '✨' },
      { value: 'fix', name: 'fix:      🐛  A bug fix', emoji: '🐛' },
      { value: 'docs', name: 'docs:     📝  Documentation only changes', emoji: '📝' },
      { value: 'style', name: 'style:    💄  Changes that do not affect the meaning of the code', emoji: '💄:' },
      {
        value: 'refactor',
        name: 'refactor: ♻️   A code change that neither fixes a bug nor adds a feature',
        emoji: '♻️',
      },
      { value: 'perf', name: 'perf:     ⚡️  A code change that improves performance', emoji: '⚡️' },
      {
        value: 'test',
        name: 'test:     ✅  Adding missing tests or correcting existing tests',
        emoji: '✅',
      },
      {
        value: 'build',
        name: 'build:    📦️   Changes that affect the build system or external dependencies',
        emoji: '📦️',
      },
      { value: 'ci', name: 'ci:       🎡  Changes to our CI configuration files and scripts', emoji: '🎡' },
      { value: 'chore', name: "chore:    🔨  Other changes that don't modify src or test files", emoji: '🔨' },
      { value: 'revert', name: 'revert:   ⏪️  Reverts a previous commit', emoji: '⏪️' },
    ],
    useEmoji: true,
  },
}
