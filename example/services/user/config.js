const model = require("./model")

const config = (options) => {
	Object.assign(current, options)
	model.config(options.services.db.api.getDB())
	return current
}

const current = {
	// myOptin: "initValue",
}

module.exports = Object.assign(config, {
	current,
})
