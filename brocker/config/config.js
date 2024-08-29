module.exports = {
    protos: ['tcp', 'ws'],
    host: '0.0.0.0',
    port: 1883,
    wsPort: 9001,
    // wssPort: 4000,
    // tlsPort: 8883,
    brokerId: 'aedes-cli',
    // credentials: './credentials.json',
    // persistence: {
    //   name: 'mongodb',
    //   options: {
    //     url: 'mongodb://127.0.0.1/aedes'
    //   }
    // },
    // mq: {
    //   name: 'mongodb',
    //   options: {
    //     url: 'mongodb://127.0.0.1/aedes'
    //   }
    // },
    key: null,
    cert: null,
    rejectUnauthorized: true,
    verbose: false,
    veryVerbose: false,
    noPretty: false
  }
  