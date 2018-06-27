# dinman
dinman stands for dependency-instance-manager. A Node.js application that manages other Node.js applications on-demand on a dependency basis.

This application is based on [node-instance-manager](https://github.com/kihenkel/node-instance-manager "node-instance-manager").

### Requirements
Requires Node 8.x or higher.

### What is it for?
If you're using multiple Node.js at the same time and trying to set them up on your local machine, then dinman might be suitable for you.
It not only lets you start/stop those apps within one shell, it also knows about dependencies between those apps and fires up all required apps with one command.

### Startup
First you need to build a config to let dinman know about the apps and their dependencies:

`npm run buildconfig -- "C:\code\my-apps" "C:\code\my-services"`

You can pass as many paths as you wish. Note that those paths have to point to the *parent directory* of your Node applications. Then it'll crawl through all sub-directories.

The log output should give you hints if it worked as intended. In the end you should have a generated `config.json` in your `config` folder.
Now start dinman via `npm start` or `node .\index.js` and use the available commands. (type `help`, or refer to [node-instance-manager](https://github.com/kihenkel/node-instance-manager "node-instance-manager"), the usage is identical)

## Shell commands
The node-instance-manager provides a shell with the following commands:
- `ls` - Lists all apps from config
- `ls-groups` - Lists all groups from config
- `start [app]` - Starts an app
- `start-excluded [app]` - Starts an app with dependencies
- `start-all` - Starts all apps from config
- `restart [app]` - Restarts an app
- `stop [app]` - Stops an app
- `stop-all` - Stops all running apps
- `log [app]` - Outputs the log for an app
- `start-group [group]` - Starts a group
- `stop-group [group]` - Stops a group
- `cmd [app] [command]` - Executes command in app working dir (EXPERIMENTAL! Use at own risk.)
- `cmd-all [command]` - Executes command for all apps in their working dirs (EXPERIMENTAL! Use at own risk.)
- `cmd-group [group] [command]` - Executes command for a group in their working dirs (EXPERIMENTAL! Use at own risk.)

## Misc
### How it works
There's no generally applicable way of determining dependencies between Node.js apps. Therefore dinman looks for certain patterns. It assumes the following:
* A `package.json` file exists and contains information about name, port and preferably entry of the application
* The [config](https://www.npmjs.com/package/config) package is used and a `config/default.json` file is present
* The `default.json` file contains links to other applications via `localhost:port` or `127.0.0.1:port`

While building the config, if `default.json` contains a port mapping to one of the detected apps then a dependency is concluded.

### Application type
The config builder automatically determines an application's type. Right now the pattern is very simple:

Assuming that the app name is built with dashes, it takes the very last part. (or to say it in regex: /([^-]+)$/) Eg. `my-cool-service` will resolve to type `service`, `that-awesome-application` will resolve to type `application`.

### Loose dependencies
Sometimes even though there is a dependency from one application to another, you don't want it to start automatically (eg. dependency from a backend service to a frontend website).
You can configure this as a *loose* dependency for dinman, based on the applications type. (refer to [Application type](#application-type) for determining the type)
To do so, add a `dependencyConfig.json` to your `config` folder:

#### `config/dependencyConfig.json`
```javascript
{
  "looseDependencyTypes": [
    { "from": "service", "to": "app" }
  ]
}
```

This configures the type `app` to be a *loose* dependency to `service`. If now a service has a dependency to an app, the app will not start automatically.