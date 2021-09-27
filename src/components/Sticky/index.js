import PropTypes from 'prop-types';
import React , {Component, createRef} from 'react'

import styles from './index.module.css';

class Sticky extends Component {
  placeholder = createRef()
  content = createRef()

  handleScroll = () => {
    const placeholderEl = this.placeholder.current
    const contentEl = this.content.current

    const { top } = placeholderEl.getBoundingClientRect()
    if(top < 0) {
      // 吸顶
      contentEl.classList.add(styles.fixed)
      placeholderEl.style.height = this.props.height + 'px'
    }else {
      // 取消吸顶
      contentEl.classList.remove(styles.fixed)
      placeholderEl.style.height = '0'
    }
  }
  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll)
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }
  render() {
    return (
      <div>
        {/* 占位元素 */}
        <div ref={this.placeholder}/>
        {/* 内容元素 */}
        <div ref={this.content}>{this.props.children}</div>
      </div>
    )
  }

}
Sticky.propTypes = {
  height: PropTypes.number.isRequired
}

export default Sticky