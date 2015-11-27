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
      menu: null
    }
  },

  componentWillMount () {
    this._forceUpdateBound = this.forceUpdate.bind(this)
    this.updateMenu()
  },

  componentDidMount () {
    this.resetFocusedItem()
  },

  componentWillReceiveProps (nextProps) {
    const { id: nextId } = nextProps
    const { id } = this.props

    if (nextId !== id) {
      this.updateMenu(nextProps)
    }
  },

  componentDidUpdate (prevProps) {
    const { id: prevId } = prevProps
    const { id } = this.props

    if (prevId !== id) {
      this.resetFocusedItem()
    }
  },

  componentWillUnmount () {
    const { menu } = this.state

    if (menu) {
      menu.off('update'. this._forceUpdateBound)
    }
  },

  updateMenu (props = this.props) {
    const { id } = props
    const { menu: prevMenu } = this.state

    const menu = ReactiveMenu.getMenu(id)

    if (!menu) {
      console.warn(`No menu "${id}" found`)
    }

    if (prevMenu) {
      prevMenu.events.off('update', this._forceUpdateBound)
    }

    if (menu) {
      menu.events.on('update', this._forceUpdateBound)
    }

    this.setState({ menu })
  },

  resetFocusedItem () {
    this.focusedItem = this.refs.item0
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
    const { menu } = this.state

    if (!menu || depth === 0) {
      return null
    }

    return (
      <nav className={className} onClickCapture={this.onClick} role='tree'>
        {menu.map((item, index) => {
          const { id } = item

          return (
            <ReactiveMenu.MenuItem
              className={className}
              depth={depth}
              expandable={expandable}
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
