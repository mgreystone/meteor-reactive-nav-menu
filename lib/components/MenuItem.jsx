let lastId = 0

ReactiveMenu.MenuItem = React.createClass({

  displayName: 'ReactiveMenu.MenuItem',

  propTypes: {
    className: React.PropTypes.string.isRequired,
    depth: React.PropTypes.number,
    item: React.PropTypes.instanceOf(MenuItem).isRequired,
    level: React.PropTypes.number.isRequired
  },

  getInitialState () {
    return {
      animating: false,
      expanded: false
    }
  },

  componentWillMount () {
    this.submenuId = `reactive-menu-submenu-${++lastId}`
    this.updateHasChildren()
  },

  componentWillReceiveProps (nextProps) {
    this.updateHasChildren(nextProps)
  },

  updateHasChildren (props) {
    props = props || this.props
    const { item, depth, level } = props
    const hasChildren = item.count() > 0 && (depth == null || level < depth)
    this.setState({ hasChildren })
  },

  onMouseEnter () {
    this.setState({ animating: true, expanded: true })
  },

  onMouseLeave () {
    this.setState({ animating: true, expanded: false })
  },

  renderLink () {
    const { submenuId } = this
    const { className: baseClassName, item: { title, url }, level } = this.props
    const { expanded, hasChildren } = this.state
    const isClickable = !!url

    const className = classNames({
      [`${baseClassName}__link`]: true,
      [`${baseClassName}__link--level${level}`]: true,
      [`${baseClassName}__link--clickable`]: isClickable
    })

    const commonProps = {
      'aria-level': level,
      className,
      role: 'treeitem'
    }

    if (hasChildren) {
      Object.assign(commonProps, {
        'aria-expanded': expanded,
        'aria-owns': submenuId
      })
    }

    if (isClickable) {
      return (
        <a href={url} {...commonProps}>{title}</a>
      )
    } else {
      return (
        <span {...commonProps}>{title}</span>
      )
    }
  },

  renderSubMenu () {
    const { submenuId } = this
    const { className: baseClassName, depth, item, level } = this.props
    const { hasChildren } = this.state
    const subMenuLevel = level + 1

    if (hasChildren) {
      const className = classNames({
        [`${baseClassName}__submenu`]: true,
        [`${baseClassName}__submenu--level${level}`]: true
      })

      return (
        <div className={className} id={submenuId} role='group'>
          {item.map(item => {
            const { id } = item

            return (
              <ReactiveMenu.MenuItem
                className={baseClassName}
                depth={depth}
                item={item}
                key={id}
                level={subMenuLevel}
              />
            )
          })}
        </div>
      )
    }
  },

  render () {
    const { className: baseClassName, level } = this.props
    const { animating, expanded, hasChildren } = this.state

    const className = classNames({
      [`${baseClassName}__item`]: true,
      [`${baseClassName}__item--animating`]: animating,
      [`${baseClassName}__item--expanded`]: expanded,
      [`${baseClassName}__item--has-children`]: hasChildren,
      [`${baseClassName}__item--level${level}`]: true
    })

    return (
      <div
        className={className}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      >
        {this.renderLink()}
        {this.renderSubMenu()}
      </div>
    )
  }

})
