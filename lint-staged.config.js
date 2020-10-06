const fs = require('fs');
const { CLIEngine } = require('eslint');

const cli = new CLIEngine({});

const config = {
  '*.{js?(x),ts?(x)}': (files) =>
    'eslint --fix --max-warnings=0 ' +
    files.filter((file) => !cli.isPathIgnored(file)).join(' '),
  '*.{js?(x),ts?(x),css,md}': 'prettier --write',
};

for (let package of fs.readdirSync('./packages')) {
  config[[`packages/${package}/**/*.ts?(x)`]] = () =>
    `tsc -p packages/${package}/ --noEmit`;
}

module.exports = config;
