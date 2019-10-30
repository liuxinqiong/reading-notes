import Vue from 'vue'

const Store = function Store(option = {}) {
    const {state = {}, mutations={}} = options
    this._vm = new Vue({
        data: {
            $$state: state
        }
    })
    this._mutation = mutations
}

Store.prototype.commit = function(type, payload) {
    if(this._mutation[type]){
        this._mutation[type](this.state, payload)
    }
}

Object.defineProperties(Store.prototype, {
    state: {
        get: function() {
            return this._vm._data.$$state
        }
    }
})

export default {Store}