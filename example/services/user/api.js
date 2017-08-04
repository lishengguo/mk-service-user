/*
* api.js        //webapi接口定义（接口参数和返回值的格式转换）
*/
var config
const api = {
    _init: (current) => {
        config = current
        model.config(current)
    },

    ping: (dto) => true,

    login: ({ username, mobile, password }, ctx) => {
        return service.login(mobile || username, password).then(user => {
            if (user) {
                ctx.setToken([user.id])
                ctx.return(true)
            } else {
                ctx.return(false)
            }
        })
    },

    create: ({ mobile, password }, ctx) => {
        return service.create(mobile, password).then(user => {
            ctx.return(user)
        })
    },

    update: (user, ctx) => {
        user.id = ctx.token.userId
        return service.update(user).then(ctx.return)
    },
}
module.exports = api




/*
* service.js    //业务逻辑
*/
const service = {
    login: (mobile, password) => {
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
    },


    create: (mobile, password) => {
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
    },

    update: ({ id, name, email }) => {
        return dao.update({ id, name, email })
    },
}




/*
* dao.js        //数据库处理
*/
const dao = {
    findByMobile: (mobile) => {
        var where = { mobile: mobile }
        if (mobile.indexOf('@') != -1) {
            where = { email: mobile }
        }
        return model.User.findOne({ where })
    },
    create: (user) => model.User.create(user),
    update: (user) => model.User.update(user, { where: { id: user.id } }),
}




/*
* model.js      //数据模型定义
*/
var model = {
    config: (config) => { 
        let db = config.services.db
        if (!db) {
            throw ({ code: 100, message: "数据库访问组件 config.services.db 未初始化" })
        }
        config.db = db = db.api.getDB()  
 
        let DataTypes = db.Sequelize;

        model.User = db.define(
            "user", {
                id: { type: DataTypes.BIGINT, primaryKey: true },
                name: DataTypes.STRING,
                password: DataTypes.STRING,
                email: DataTypes.STRING,
                mobile: DataTypes.STRING,
            }, {
                updatedAt: false,
                createdAt: "createTime",
                tableName: "sys_user",
            }
        )
        model.User.sync()
    }
}
 