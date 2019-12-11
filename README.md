# hapi-version-status
Plugin that registers a route that returns version and status details of the server

## installation

'npm install hapi-version-status -S'

## usage

```
const Hapi = require('hapi');

const server = hapi.server();
await server.register([{
  plugin: require('hapi-version-status'),
  options: {
    path: '/version',    
    options: {
      tags: ['my-tag']
    }
  }
}]);
```

where:
- ```path``` is the path where the end point for the version data

    Default: '/version'
        
    
- ```options``` is an object containing the hapi route options

    Default: {}