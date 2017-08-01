/**
 * 数据库模型的定义，在DAO文件中使用。
 */

var model = {
    config: (db) => {
        model.User = model.User || db.import("user", userDefine);
    }
}

const userDefine = (db, DataTypes) => db.define(
    "user", {
        id: { type: DataTypes.BIGINT, primaryKey: true },
        name: DataTypes.STRING,
        password: DataTypes.STRING,
        email: DataTypes.STRING,
        mobile: DataTypes.STRING,
    }, {
        // updatedAt: false,
        // createdAt: "createTime",
        tableName: "sys_user",
    }
)

module.exports = model