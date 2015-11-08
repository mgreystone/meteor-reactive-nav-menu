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
    const { item } = this.props
    this._forceUpdateBound = this.forceUpdate.bind(this)
    this.submenuId = `reactive-menu-submenu-${++lastId}`
    item.events.on('update', this._forceUpdateBound)
    this.updateHasChildren()
  },

  componentWillReceiveProps (nextProps) {
    const { item } = this.props
    const { item: nextItem } = nextProps

    if (item !== nextItem) {
      item.events.off('update', this._forceUpdateBound)
      nextItem.events.on('update', this._forceUpdateBound)
    }

    this.updateHasChildren(nextProps)
  },

  componentWillUnmount () {
    const { item } = this.props
    item.events.off('update', this._forceUpdateBound)
  },

  updateHasChildren (props = this.props) {
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

  renderBadge () {
    const { className: baseClassName, item, level } = this.props
    const badge = totalBadges(item)

    if (badge === 0) {
      return null
    }

    const className = classNames({
      [`${baseClassName}__badge`]: true,
      [`${baseClassName}__badge--level${level}`]: true
    })

    return (
      <small className={className}>
        {badge}
      </small>
    )
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
        {this.renderBadge()}
        {this.renderSubMenu()}
      </div>
    )
  }

})

function totalBadges (item) {
  let result = item.badge

  for (let child of item) {
    result += totalBadges(child)
  }

  return result
}
