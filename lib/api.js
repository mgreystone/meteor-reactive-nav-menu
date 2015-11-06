const allMenus = {}

function createMenu (options) {
  if (!options) {
    throw new Meteor.Error('invalid-args', 'No args provided')
  }

  const { id } = options

  if (!id) {
    throw Error('invalid-args', 'No id provided')
  }

  if (allMenus.hasOwnProperty(id)) {
    console.warn(`Menu "${id}" already exists, not creating`)
  } else {
    allMenus[id] = new Menu({ id })
  }

  return allMenus[id]
}

function getMenu (id) {
  return allMenus[id]
}

Object.assign(ReactiveMenu, {
  createMenu,
  getMenu
})
