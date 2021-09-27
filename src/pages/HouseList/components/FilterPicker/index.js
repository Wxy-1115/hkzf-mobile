import React from 'react'
import { PickerView } from 'antd-mobile';

import style from './index.module.css'
import FilterFooter from '../../../../components/FilterFooter';

class FilterPicker extends React.Component {
  // state={
  //   value: this.props.defaultValue
  // }
  constructor(props) {
    super(props)
    this.state = {
      value: this.props.defaultValue
    }
  }
  render() {
    const {value} = this.state
    const { onCancel, onSave, data, cols, type } = this.props
    return (
      <div className={style.pickerView}>
        <PickerView
          data={data}
          cols={cols}
          value={value}
          onChange={(val)=> {
            // console.log(val);
            this.setState({
              value: val
            })
          }}
        />
        <FilterFooter onCancel={() => onCancel(type)} onOk={() => onSave(value, type)}/>
      </div>
    )
  }
}

export default FilterPicker