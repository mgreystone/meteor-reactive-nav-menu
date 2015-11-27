let lastId = 0

ReactiveMenu.MenuItem = React.createClass({

  displayName: 'ReactiveMenu.MenuItem',

  propTypes: {
    className: React.PropTypes.string.isRequired,
    depth: React.PropTypes.number,
    expandable: React.PropTypes.bool.isRequired,
    index: React.PropTypes.number.isRequired,
    item: React.PropTypes.instanceOf(MenuItem).isRequired,
    level: React.PropTypes.number.isRequired,
    onDownKey: React.PropTypes.func.isRequired,
    onFocus: React.PropTypes.func.isRequired,
    onLeftKey: React.PropTypes.func,
    onUpKey: React.PropTypes.func.isRequired
  },

  getDefaultProps () {
    return {
      onLeftKey: noop
    }
  },

  getInitialState () {
    const { expandable, index, level } = this.props

    return {
      animating: false,
      canTab: index === 0 && level === 1,
      expanded: !expandable
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

  getLinkEl () {
    const { link } = this.refs
    const linkEl = ReactDOM.findDOMNode(link)
    return linkEl
  },

  focus () {
    this.getLinkEl().focus()
    this.setState({ canTab: true })
    this.props.onFocus(this)
  },

  focusLast () {
    const { item } = this.props
    const { hasChildren } = this.state
    let ref

    if (hasChildren) {
      ref = this.refs[`item${item.count() - 1}`]
    } else {
      ref = this
    }

    ref.focus()
  },

  blur () {
    this.getLinkEl().blur()
    this.setState({ canTab: false })
  },

  onMouseEnter () {
    const { expandable } = this.props
    this.setState({ animating: true, expanded: expandable })
  },

  onMouseLeave () {
    this.setState({ animating: true, expanded: false })
  },

  onLinkClick () {
    this.setState({ canTab: true })
    this.props.onFocus(this)
  },

  onLinkKeyUp (event) {
    const KEY_LEFT = 37
    const KEY_UP = 38
    const KEY_RIGHT = 39
    const KEY_DOWN = 40

    const methods = {
      [KEY_LEFT]: this.onLinkLeftKey,
      [KEY_RIGHT]: this.onLinkRightKey,
      [KEY_UP]: this.onLinkUpKey,
      [KEY_DOWN]: this.onLinkDownKey
    }

    if (methods.hasOwnProperty(event.keyCode)) {
      methods[event.keyCode]()
    }
  },

  onLinkLeftKey () {
    const { expandable } = this.props
    const { expanded } = this.state

    if (expandable && expanded) {
      this.setState({ expanded: false })
    } else {
      this.props.onLeftKey()
    }
  },

  onLinkRightKey () {
    const { expandable } = this.props
    const { hasChildren } = this.state

    if (expandable) {
      this.setState({ expanded: true })
    }

    if (hasChildren) {
      this.blur()
      this.refs.item0.focus()
    }
  },

  onLinkUpKey () {
    const { onUpKey: bubble } = this.props
    bubble()
  },

  onLinkDownKey () {
    const { onDownKey: bubble } = this.props
    const { expanded, hasChildren } = this.state
    const { item0: firstItem } = this.refs

    if (hasChildren && expanded) {
      this.blur()
      firstItem.focus()
    } else {
      bubble()
    }
  },

  onSubmenuUpKey (index) {
    const { expanded } = this.state

    this.refs[`item${index}`].blur()

    if (index === 0 || !expanded) {
      this.focus()
    } else {
      this.refs[`item${index - 1}`].focusLast()
    }
  },

  onSubmenuDownKey (index) {
    const { item, onDownKey: bubble } = this.props

    if (index === item.count() - 1) {
      bubble()
    } else {
      this.refs[`item${index}`].blur()
      this.refs[`item${index + 1}`].focus()
    }
  },

  onSubmenuLeftKey (index) {
    this.refs[`item${index}`].blur()
    this.focus()
  },

  renderLink () {
    const { submenuId } = this

    const {
      className: baseClassName,
      item: { title, url },
      level
    } = this.props

    const { expanded, canTab, hasChildren } = this.state
    const isClickable = !!url
    const tabIndex = canTab ? 0 : -1

    const className = classNames({
      [`${baseClassName}__link`]: true,
      [`${baseClassName}__link--level${level}`]: true,
      [`${baseClassName}__link--clickable`]: isClickable
    })

    const commonProps = {
      'aria-level': level,
      className,
      onClick: this.onLinkClick,
      onKeyUp: this.onLinkKeyUp,
      ref: 'link',
      role: 'treeitem',
      tabIndex
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

    const {
      className: baseClassName,
      expandable,
      depth,
      item,
      level
    } = this.props

    const { hasChildren } = this.state
    const subMenuLevel = level + 1

    if (hasChildren) {
      const className = classNames({
        [`${baseClassName}__submenu`]: true,
        [`${baseClassName}__submenu--level${level}`]: true
      })

      return (
        <div className={className} id={submenuId} role='group'>
          {item.map((item, index) => {
            const { id } = item

            return (
              <ReactiveMenu.MenuItem
                className={baseClassName}
                depth={depth}
                expandable={expandable}
                index={index}
                item={item}
                key={id}
                level={subMenuLevel}
                onDownKey={this.onSubmenuDownKey.bind(this, index)}
                onFocus={this.props.onFocus}
                onLeftKey={this.onSubmenuLeftKey.bind(this, index)}
                onUpKey={this.onSubmenuUpKey.bind(this, index)}
                ref={`item${index}`}
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

function noop () {}
