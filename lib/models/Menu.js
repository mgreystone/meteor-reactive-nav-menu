Menu = function (options) {
  this.init()

  if (!options) {
    throw new Meteor.Error('invalid-args', 'Missing options')
  }

  const { id } = options
  const items = {}

  Object.defineProperties(this, {
    id: {
      value: id
    },
    items: {
      value: items
    }
  })
}

Object.assign(Menu.prototype, MenuMixin)
