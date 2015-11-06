ReactiveMenu.Menu = React.createClass({

  displayName: 'ReactiveMenu.Menu',

  propTypes: {
    className: React.PropTypes.string,
    depth: React.PropTypes.number,
    id: React.PropTypes.string.isRequired
  },

  getDefaultProps () {
    return {
      className: 'reactive-menu'
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

  componentWillReceiveProps (nextProps) {
    this.updateMenu(nextProps)
  },

  updateMenu (props) {
    props = props || this.props
    const { menu: prevMenu } = this.state
    const { id } = props
    const menu = ReactiveMenu.getMenu(id)

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

      this.setState({ menu })
    }
  },

  render () {
    const { className, depth } = this.props
    const { menu } = this.state

    if (!menu || depth === 0) {
      return null
    }

    return (
      <nav className={className} role='tree'>
        {menu.map(item => {
          const { id } = item

          return (
            <ReactiveMenu.MenuItem
              className={className}
              depth={depth}
              item={item}
              key={id}
              level={1}
            />
          )
        })}
      </nav>
    )
  }

})
