const dao = require("./dao")
const config = require("./config").current

const login = (mobile, password) => {
    var utils = config.services.utils
    if (!mobile) {
        throw ({ code: "10000", message: "用户名不能为空！" })
    }
    else if (!password) {
        throw ({ code: "10000", message: "密码不能为空！" })
    }
    else if (password.length != 32) {
        //模拟客户端的密码。
        password = utils.api.md5(password, "${key}");
    }

    return dao.findByMobile(mobile).then(user => {
        if (!user) {
            throw ({ code: "10000", message: "用户不存在！" })
        }

        const pwd = utils.api.md5(password, "${key}")
        if (pwd != user.password) {
            throw ({ code: "10000", message: "密码不正确!" })
        }
        return user
    })
}


const create = (mobile, password) => {
    var utils = config.services.utils
    if (!mobile) {
        throw ({ code: "10000", message: "用户名不能为空！" })
    }
    else if (!password) {
        throw ({ code: "10000", message: "密码不能为空！" })
    }
    else if (password.length != 32) {
        //模拟客户端的密码。
        password = utils.api.md5(password, "${key}");
    }

    return dao.findByMobile(mobile).then(user => {
        if (user) {
            throw ({ code: "10000", message: "用户已经存在！" })
        }

        const pwd = utils.api.md5(password, "${key}")
        const id = utils.api.objectId()
        return dao.create({ id, mobile, password: pwd })
    })
}

const update = ({ id, name, email }) => {
    return dao.update({ id, name, email })
}

module.exports = {
    login,
    create,
    update,
}