Package.describe({
  name: 'mgreystone:reactive-nav-menu',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
})

Package.onUse(function (api) {
  api.versionsFrom('1.2.1')

  const packages = [
    'ecmascript@0.1.6',
    'maxharris9:classnames@0.0.1',
    'raix:eventemitter@0.1.3',
    'react@0.14.1_1'
  ]

  api.use(packages)
  api.imply(packages)

  api.addFiles([
    'lib/_namespace.js',
    'lib/api.js',
    'lib/models/MenuMixin.js',
    'lib/models/Menu.js',
    'lib/models/MenuItem.js',
    'lib/components/Menu.jsx',
    'lib/components/MenuItem.jsx'
  ], 'client')

  api.export('ReactiveMenu', 'client')
})

Package.onTest(function (api) {
  api.use('ecmascript')
  api.use('tinytest')
  api.use('mgreystone:reactive-nav-menu')
  api.addFiles('reactive-nav-menu-tests.js')
})
