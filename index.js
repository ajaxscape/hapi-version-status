const { name, homepage, version } = require(`${process.cwd()}/package`)
const git = require('git-last-commit')

const register = function (server, opts = {}) {
  // Set options with defaults if required
  const { path = '/version', options = {} } = opts

  server.route({
    method: 'GET',
    path,
    handler: async (request) => {
      const { info: instance } = request.server
      const commit = await new Promise((resolve, reject) => {
        git.getLastCommit((err, commit) => {
          if (err) {
            reject(err)
          } else {
            resolve(commit)
          }
        })
      })
      Object.assign(commit, { name, version, commit: homepage.replace('#readme', `/commit/${commit.hash}`), instance })
      return commit
    },
    options
  })
}

const pkg = require('./package')

exports.plugin = {
  name: pkg.name,
  register,
  once: true,
  pkg
}
