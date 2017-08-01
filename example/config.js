/**
 * server配置
 * 
 */
const utils = require("mk-service-utils")
const auth = require("mk-service-auth")
const db = require("mk-service-db")

const config = ({ services }) => {
    Object.assign(server.services, services)
    utils.api.env(server.configs);
    configServices(server)
    return server
}

const server = {
    host: "0.0.0.0",
    port: "8000",
    apiRootUrl: "/v1",
    interceptors: [],
    services: {
        // referrenced service
        utils,
        auth,
        db,
    },
    configs: {
        // serviceName: {}
        utils: {
            md5: {
                key: "my private md5 key",
            }
        },
        auth: {
            key: "my private token key",
            tokenKeys: ["userId"],
            exclude: ["/user/login", "/user/ping", "/user/create"],
        },
        db: {
            name: "bizdata",
            type: "mysql",
            user: "root",
            pwd: "${mysql_password}", //从环境变量中读取。
            host: "${mysql_host}",
            port: "${mysql_port}",
            transactionType: "auto",
            database: "bizdata_dev",
        }, 
    },
}

function configServices(server) {
    var { services, configs } = server;
    Object.keys(services).filter(k => !!services[k].config).forEach(k => {
        let curCfg = Object.assign({ server, services }, configs["*"], configs[k]);
        services[k].config(curCfg);
    })
}

module.exports = config
