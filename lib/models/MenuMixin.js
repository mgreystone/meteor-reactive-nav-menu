const DONE = { done: true }

MenuMixin = {
  [Symbol.iterator] () {
    const { items: allItems } = this
    const sortedKeys = Object.keys(allItems).sort()
    let i = sortedKeys.shift()
    let j = 0

    return {
      next () {
        if (i == null) {
          return DONE
        }

        if (allItems[i] && !allItems[i][j]) {
          i = sortedKeys.shift()
          j = 0
          if (i == null) {
            return DONE
          }
        }

        return { value: allItems[i][j++], done: false }
      }
    }
  },

  addItem (params) {
    const options = { parent: this }
    const { items: allItems } = this

    Object.assign(options, params)
    const item = new MenuItem(options)

    if (!allItems.hasOwnProperty(item.priority)) {
      allItems[item.priority] = []
    }

    allItems[item.priority].push(item)

    this.events.emit('update')

    return item
  },

  getItem (id) {
    for (let item of this) {
      if (item.id === id) {
        return item
      }

      const childItem = item.getItem(id)
      if (childItem) {
        return childItem
      }
    }

    return null
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

  init () {
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
