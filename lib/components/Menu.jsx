ReactiveMenu.Menu = React.createClass({

  displayName: 'ReactiveMenu.Menu',

  propTypes: {
    className: React.PropTypes.string,
    depth: React.PropTypes.number,
    expandable: React.PropTypes.bool,
    id: React.PropTypes.string.isRequired
  },

  getDefaultProps () {
    return {
      className: 'reactive-menu',
      expandable: false
    }
  },

  getInitialState () {
    return {
      current: null,
      menu: null
    }
  },

  componentWillMount () {
    this._forceUpdateBound = this.forceUpdate.bind(this)
    this.updateMenu()
  },

  componentDidMount () {
    this.focusedItem = this.refs.item0
  },

  componentWillReceiveProps (nextProps) {
    this.updateMenu(nextProps)
  },

  componentWillUnmount () {
    const { menu } = this.state

    if (menu) {
      menu.off('update'. this._forceUpdateBound)
    }
  },

  updateMenu (props = this.props) {
    const { menu: prevMenu } = this.state
    const { id } = props
    const menu = ReactiveMenu.getMenu(id)
    let current

    if (menu !== prevMenu) {
      if (!menu) {
        console.warn(`No menu "${id}" found`)
      }

      if (prevMenu) {
        prevMenu.events.off('update', this._forceUpdateBound)
      }

      if (menu) {
        menu.events.on('update', this._forceUpdateBound)
      }

      this.setState({ current, menu })
    }
  },

  onClick () {
    const focusedItem = this.focusedItem
    if (focusedItem) {
      focusedItem.blur()
    }
  },

  onItemDownKey (index) {
    const { menu } = this.state

    if (index < menu.count() - 1) {
      this.refs[`item${index}`].blur()
      this.refs[`item${index + 1}`].focus()
    }
  },

  onItemFocus (sender) {
    this.focusedItem = sender
  },

  onItemUpKey (index) {
    if (index > 0) {
      this.refs[`item${index}`].blur()
      this.refs[`item${index - 1}`].focusLast()
    }
  },

  render () {
    const { className, depth, expandable } = this.props
    const { current, menu } = this.state

    if (!menu || depth === 0) {
      return null
    }

    return (
      <nav className={className} onClickCapture={this.onClick} role='tree'>
        {menu.map((item, index) => {
          const { id } = item
          const focusable = item === current

          return (
            <ReactiveMenu.MenuItem
              className={className}
              depth={depth}
              expandable={expandable}
              focusable={focusable}
              index={index}
              item={item}
              key={id}
              level={1}
              onDownKey={this.onItemDownKey.bind(this, index)}
              onFocus={this.onItemFocus}
              onUpKey={this.onItemUpKey.bind(this, index)}
              ref={`item${index}`}
            />
          )
        })}
      </nav>
    )
  }

})
