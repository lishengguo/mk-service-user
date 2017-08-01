const config = require("./config").current
const service = require("./service")

const ping = (dto) => true

const login = ({ mobile, password }, ctx) => {
    service.login(mobile, password).then(user => {
        if (user) {
            ctx.setToken([user.id])
            ctx.return(true)
        } else {
            ctx.return(false)
        }
    })
}

const create = ({ mobile, password }, ctx) => {
    return service.create(mobile, password).then(user => {
        ctx.return(user)
    })
}

const update = (user, ctx) => {
    user.id = ctx.token.userId
    return service.update(user).then(ctx.return)
}

module.exports = {
    ping,
    login,
    create,
    update,
}

