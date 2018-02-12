# node-instance-manager
A Node.js application to manage multiple Node.js applications. Requires Node 8.7 or higher.
The application reads from a `config` folder which you have to provide. All you have to do is create an `config/index.js`. It can look like this:

### `config/index.js`
```javascript
const apps = [
  {
    name: 'my-client',
    path: 'C:/source/my-client',
  },
  {
    name: 'my-server',
    path: 'C:/source/my-server',
    entry: './src/server.js',
  },
];

const groups = {
  'my-group1': ['my-client', 'my-server'],
  'my-group2': ['my-client'],
}

module.exports = {
  apps,
  groups,
};
```
## Startup
Add a valid config as seen above. Now start the application:
`node .\index.js`
You can also provide groups as startup arguments which will start the group right away:
`node .\index.js my-group1 my-group2`

## App options
- `name` - **[required, String]** Name of the NodeJS application. Used as an identifier.
- `path` - **[required, String]** Path to the applications working directory.
- `entry` - [optional, String] Path to entry JS file (relative to working directory). [default: `./index.js`]

## Shell commands
The node-instance-manager provides a shell with the following commands:
- `ls` - Lists all apps from config
- `ls-groups` - Lists all groups from config
- `start [app]` - Starts an app
- `stop [app]` - Stops an app
- `log [app]` - Outputs the log for an app
- `start-group [group]` - Starts a group
- `stop-group [group]` - Stops a group

## Groups
You can define groups to start or stop multiple applications at the same time. Export `groups` in the config:
### `config/index.js`
```javascript
module.exports.groups = {
  'all-apps': ['my-client', 'my-server'],
}
```
This will create the group *all-apps* which starts or stops the applications *my-client* and *my-server*.