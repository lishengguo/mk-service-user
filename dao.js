const model = require('./model')

const findByMobile = (mobile) => {
    var where = { mobile: mobile }
    if (mobile.indexOf('@') != -1) {
        where = { email: mobile }
    }
    return model.User.findOne({ where })
}

const create = (user) => model.User.create(user)

const update = (user) => model.User.update(user, { where: { id: user.id } })

module.exports = {
    findByMobile,
    create,
    update,
}