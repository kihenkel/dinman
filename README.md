# dinman
dinman stands for dependency-instance-manager. A Node.js application that manages other Node.js applications on-demand on a dependency basis.

This application is a fork of [node-instance-manager](https://github.com/kihenkel/node-instance-manager "node-instance-manager").

### Requirements
Requires Node 8.7 or higher.

## Startup
First you need to build a config to let dinman know about the apps and their dependencies:

`npm run buildconfig -- "C:\code\my-apps" "C:\code\my-services"`

You can pass as many paths as you wish. Note that those paths have to point to the *parent directory* of your node applications. Then it'll crawl through all sub-directories.

The log output should give you hints if it worked as intended. In the end you should have a generated `config.json` in your `config` folder.
Now start dinman via `node .\index.js` and use the available commands. (refer to [node-instance-manager](https://github.com/kihenkel/node-instance-manager "node-instance-manager"), the usage is identical)