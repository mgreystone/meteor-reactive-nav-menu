MenuItem = function (options) {
  this.init()

  if (!options) {
    throw new Meteor.Error('invalid-args', 'Missing options')
  }

  const { id, parent, priority = 0 } = options
  let { title, url, badge = 0 } = options
  const items = {}

  if (!id) {
    throw new Meteor.Error('invalid-args', 'Missing id')
  }

  if (!title) {
    throw new Meteor.Error('invalid-args', 'Missing title')
  }

  this.events.on('update', () => parent.events.emit('update'))

  Object.defineProperties(this, {
    id: {
      value: id
    },
    title: {
      get () { return title },
      set (value) {
        title = value
        this.events.emit('update')
      }
    },
    url: {
      get () { return url },
      set (value) {
        url = value
        this.events.emit('update')
      }
    },
    priority: {
      value: priority
    },
    items: {
      value: items
    },
    badge: {
      get () { return badge },
      set (value) {
        badge = value
        this.events.emit('update')
      }
    }
  })
}

Object.assign(MenuItem.prototype, MenuMixin)
