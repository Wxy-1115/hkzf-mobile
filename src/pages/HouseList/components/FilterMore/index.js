import React from 'react'
import FilterFooter from '../../../../components/FilterFooter'


import style from './index.module.css'


class FilterMore extends React.Component {
  state={
    selectedValue: this.props.defaultValue
  }
  onTagClick = (value) => {
    const { selectedValue } = this.state

    const newSelectedValue = [...selectedValue]
    if(selectedValue.indexOf(value) <= -1) {
      newSelectedValue.push(value)

    }else {
      const index = selectedValue.findIndex(item => item===value)
      newSelectedValue.splice(index, 1)
    }

    this.setState({
      selectedValue: newSelectedValue
    })
  }
  onCleanClick = () => {
    this.setState({
      selectedValue: []
    })
  }
  onOkClick = () => {
    const { type, onSave } = this.props

    onSave(this.state.selectedValue, type)

  }
  renderFilters=(data) => {
    // console.log(data);
    const { selectedValue} = this.state
    return data.map(item =>{
      return <span className={[style.tag, selectedValue.indexOf(item.value) <= -1 ? '' : style.tagActive].join(' ')} 
                   onClick={() => this.onTagClick(item.value)} 
                   key={item.value}>
                {item.label}
              </span>
    })
  }
  render() {
    const { data: { roomType, oriented, floor, characteristic }, onCancel, type } = this.props
    // const { selectedValue } = this.state
    return (
      <div>
        {/* 遮罩层 */}
        <div className={style.mask} onClick={() => onCancel(type)}></div>

        <div className={style.tags}>
          <dl className={style.dl}>
            <dt className={style.dt}>户型</dt>
            <dd className={style.dd}>{this.renderFilters(roomType)}</dd>

            <dt className={style.dt}>朝向</dt>
            <dd className={style.dd}>{this.renderFilters(oriented)}</dd>

            <dt className={style.dt}>楼层</dt>
            <dd className={style.dd}>{this.renderFilters(floor)}</dd>

            <dt className={style.dt}>房屋亮点</dt>
            <dd className={style.dd}>{this.renderFilters(characteristic)}</dd>
          </dl>
          <FilterFooter className={style.footer} 
            onCancel={this.onCleanClick}
            onOk={this.onOkClick}
            cancelText='清除'
          />
        </div>
      </div>
    )
  }
}

export default FilterMore