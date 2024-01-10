/**
 * 数据访问模式：对数据访问层的封装
 */

// 担心存在问题：数据互相覆盖，兼容性问题，无法知道状态，归一化方式解决

// 由于localStorage相当于一个大容器，对于同一个站点，没有分割库的概念，所以我们可以将每次存储的数据字段前面添加前缀来分隔localStorage存储
// 存储时间，方便日后对数据的管理（定期删除），因此可以添加一个时间戳，这里需要一个拼接符分隔时间和存储的数据

var BaseLocalStorage = function(preId, timeSign) {
    this.preId = preId
    this.timeSign = timeSign || '|-|' 
}

BaseLocalStorage.prototype = {
    status: {
        SUCCESS: 0,
        FAILURE: 1,
        OVERFLOW: 2, // 溢出
        TIMEOUT: 3 // 过期
    },
    storage: localStorage || window.localStorage,
    getKey: function(key) {
        return this.preId + key
    },
    set: function(key, value, callback, time) {
        var status = this.status.SUCCESS;
        var key = this.getKey(key)
        try {
            time = new Date(time).getTime() || time.getTime()
        } catch(e) {
            // 有误则默认一个月
            time = new Date().getTime() + 1000 * 60 * 60 * 24 * 31
        }
        try {
            this.storage.setItem(key, time + this.timeSign + value)
        }catch(e) {
            status = this.status.OVERFLOW
        }
        callback && callback.callback(this, status, key, value)
    },
    get: function(key, callback) {
        var status = this.status.SUCCESS,
            key = this.getKey(key),
            value = null,
            timeSignLen = this.timeSign.length,
            that = this,
            index,
            time,
            result;
        try {
            value = this.storage.getItem(key)
        } catch(e) {
            result = {
                status: that.status.FAILURE,
                value: null
            }
            callback && callback.call(this, result.status, result.value)
            return result
        }
        if(value) {
            index = value.indexOf(that.timeSign)
            time = +value.slice(0, index)
            // 0表示永久
            if(new Date(time).getTime() > new Date().getTime() || time == 0) {
                value = value.slice(index + timeSignLen)
            } else {
                // 过期为null，且删除
                value = null;
                status = that.status.TIMEOUT;
                that.remove(key)
            }
        } else {
            status = that.status.FAILURE
        }
        result = {
            status: status,
            value: value
        }
        callback && callback.call(this, result.status, result.value)
        return result        
    },
    remove: function(key, callback) {
        var status = this.status.FAILURE,
            key = this.getKey(),
            value = null;
        try {
            value = this.storage.getItem(key)
        } catch(e) { }
        if(value) {
            try {
                this.storage.removeItem(key)
                status = this.status.SUCCESS
            } catch(e) {}
        }
        callback && callback.call(this, status, status > 0 ? null : value.slice(value.indexOf(this.timeSign) + this.timeSign.length))
    }
}

// 通常我们在设置默认状态时，应该保证该默认状态尽可能多的出现，这样代码效率也会高一些，这也体现了一个工程师应对自己设计的代码的全局把控能力

// 这种模式在服务端操作数据库更常见

module.exports = {
    DB: {
        db: 'demo',
        host: 'localhost',
        port: 27017
    }
}

var mongodb = require('mongodb')
var config = require('./config').DB
var d = new mongodb.Db(
    config.db,
    new mongodb.Server(
        config.host,
        config.port,
        {auto_reconnect: true}
    ),
    {safe: true}
)

function connect(col, fn) {
    d.open(function(err, db) {
        if(err) {
            throw err
        } else {
            db.collection(col, function(err, col) {
                if(err) {
                    throw err
                } else {
                    fn & fn(col, db)
                }
            })
        }
    })
}

exports.DB = function(col) {
    return {
        insert: function(data, success, fail) {
            connect(col, function(col, db){
                db.insert(data, function(err, docs){
                    if(err) {
                        fail && fail(err)
                    } else {
                        success && success(docs)
                    }
                    db.close()
                })
            })
        },
        remove: function(data, success, fail) {
            connect(col, function(col, db){
                db.remove(data, function(err, len){
                    if(err) {
                        fail && fail(err)
                    } else {
                        success && success(len)
                    }
                    db.close()
                })
            })
        },
        update: function(con, doc, success, fail) {
            connect(col, function(col, db){
                db.update(con, doc, function(err, len){
                    if(err) {
                        fail && fail(err)
                    } else {
                        success && success(len)
                    }
                    db.close()
                })
            })
        },
        find: function(con, success, fail) {
            connect(col, function(col, db){
                db.find(con).toArray(function(err, docs){
                    if(err) {
                        fail && fail(err)
                    } else {
                        success && success(len)
                    }
                    db.close()
                })
            })
        }
    }
}