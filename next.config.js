module.exports = {
  webpack: (config, { isServer }) => {
    config.output.webassemblyModuleFilename = 'static/wasm/[modulehash].wasm'
    config.experiments = { asyncWebAssembly: true }
      if (!isServer) {
          // don't resolve 'fs' module on the client to prevent this error on build --> Error: Can't resolve 'fs'
          config.resolve.fallback = {
              fs: false,
              path: false,
              util: false,
              crypto: false,
              os: false
          }
      }

      return config;
  }
}