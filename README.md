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

## Application type
The config builder automatically determines an application's type. Right now the pattern is very simple:

Assuming that the app name is built with dashes, it takes the very last part. Eg. `my-cool-service` will resolve to type `service`, `that-awesome-application` will resolve to type `application`.

## Loose dependencies
Sometimes even though there is a dependency from one application to another, you don't want it to start automatically (eg. dependency from a backend service to a frontend website).
You can configure this as a *loose* dependency for dinman, based on the applications type. (refer to [Application type](#application-type) for determining the type)
To do so, add a `dependencyConfig.json` to your `config` folder:

### `config/dependencyConfig.json`
```javascript
{
  "looseDependencyTypes": [
    { "from": "service", "to": "app" }
  ]
}
```

This configures the type `app` to be a *loose* dependency to `service`. If now a service has a dependency to an app, the app will not start automatically.