const { name, homepage, version } = require(`${process.cwd()}/package`)
const git = require('git-last-commit')
const moment = require('moment')
const wreck = require('@hapi/wreck')

const register = function (server, opts = {}) {
  // Set options with defaults if required
  const { path = '/version', options = {}, view, viewData = {}, serviceVersionPaths = [] } = opts

  const getVersionStatus = async () => {
    const { info: instance } = server
    const service = await new Promise((resolve, reject) => {
      git.getLastCommit((err, commit) => {
        if (err) {
          reject(err)
        } else {
          resolve(commit)
        }
      })
    })
    const started = moment(instance.started).format('DD/MM/YYYY HH:mm:ss')
    const { hash } = service
    const commit = homepage.replace('#readme', `/commit/${hash}`)
    return { started, name, version, commit, hash }
  }

  const getServicesVersionStatus = async () => {
    return Promise.all(serviceVersionPaths.map(async (path) => {
      const { payload } = await wreck.get(path, { json: true })
      return payload
    }))
  }

  server.route({
    method: 'GET',
    path,
    handler: async (request, h) => {
      const versionStatus = await getVersionStatus()
      const otherServices = await getServicesVersionStatus()
      if (view) {
        const services = [versionStatus, ...otherServices]
        const renderTimestamp = moment().format('DD/MM/YYYY HH:mm:ss')
        return h.view(view, { services, renderTimestamp, ...viewData })
      } else {
        return versionStatus
      }
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
