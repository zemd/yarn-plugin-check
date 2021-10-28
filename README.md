# yarn-plugin-check

> Plugin that can check(port or exit status of the custom command)

## Usage

Install the plugin:
```sh
yarn plugin import https://raw.githubusercontent.com/zemd/yarn-plugin-check/main/bundles/%40yarnpkg/plugin-check.js
```

Check for specific port:

```sh
yarn check --port 80
yarn check --port 80 --host 127.0.0.1
yarn check --port 8080 --message "The given port is in use" 
```

Checking specific command:

```sh
yarn check --command "exit 1"
```

## License

yarn-plugin-check is released under the MIT license.

## Donate

[![](https://img.shields.io/badge/patreon-donate-yellow.svg)](https://www.patreon.com/red_rabbit)
