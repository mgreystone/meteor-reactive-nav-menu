MenuMixin = {
  [Symbol.iterator]: function *() {
    const { items: allItems } = this
    const sortedKeys = Object.keys(allItems).sort()
    const len = sortedKeys.length

    for (let i = 0; i < len; i++) {
      let priority = allItems[i]
      let priorityLen = priority.length

      for (let j = 0; j < priorityLen; j++) {
        yield priority[j]
      }
    }
  },

  addItem (options) {
    const { items: allItems } = this
    const item = new MenuItem(options)

    if (!allItems.hasOwnProperty(item.priority)) {
      allItems[item.priority] = []
    }

    allItems[item.priority].push(item)

    this.events.emit('update')

    return item
  },

  count () {
    const { items: allItems } = this
    const len = Object.keys(allItems).length
    let result = 0

    for (let i = 0; i < len; i++) {
      result += allItems[i].length
    }

    return result
  },

  init: function () {
    const events = new EventEmitter()
    Object.defineProperty(this, 'events', {
      value: events
    })
  },

  map (callback) {
    const results = []

    for (let item of this) {
      results.push(callback(item))
    }

    return results
  }
}
