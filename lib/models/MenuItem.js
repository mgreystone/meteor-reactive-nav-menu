MenuItem = function (options) {
  this.init()

  if (!options) {
    throw new Meteor.Error('invalid-args', 'Missing options')
  }

  const { id, title, url, priority = 0 } = options
  const items = {}

  if (!id) {
    throw new Meteor.Error('invalid-args', 'Missing id')
  }

  if (!title) {
    throw new Meteor.Error('invalid-args', 'Missing title')
  }

  Object.defineProperties(this, {
    id: {
      value: id
    },
    title: {
      value: title,
      writable: true
    },
    url: {
      value: url,
      writable: true
    },
    priority: {
      value: priority,
      writable: true
    },
    items: {
      value: items
    }
  })
}

Object.assign(MenuItem.prototype, MenuMixin)
