let _config = {
  carboneUrl: 'https://render.carbone.io/',
  isReturningBuffer: true,
  retriesOnError: 2, // number of retries
  retriesIntervalOnError: 1000 // unit ms
};

let _version = '4';

module.exports = {
  config: _config,
  getVersion: () => {
    return _version;
  },

  /**
   * Update the carbone version
   * @param {Number} apiVersion Carbone version which must be used
   */
  setApiVersion: function (apiVersion) {
    _version = apiVersion
  },

  /**
   * Update the SDK configuration
   * @param {Object} userConfig User configuration
   */
  setOptions: function (userConfig) {
    _config = Object.assign(_config, userConfig)
  }
}
