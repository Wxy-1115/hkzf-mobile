import React, { Component } from 'react'

import {
  Flex,
  List,
  InputItem,
  Picker,
  ImagePicker,
  TextareaItem,
  Toast
} from 'antd-mobile';

import NavHeader from '../../../components/NavHeader'
import HousePackage from '../../../components/HousePackage'

import styles from './index.module.css'
import { API } from '../../../utils';

// const alert = Modal.alert
const Item = List.Item;

const
  // 户型
  roomTypeData = [
    {
      label: '一室',
      value: 'ROOM|d4a692e4-a177-37fd'
    },
    {
      label: '二室',
      value: 'ROOM|d1a00384-5801-d5cd'
    },
    {
      label: '三室',
      value: 'ROOM|20903ae0-c7bc-f2e2'
    },
    {
      label: '四室',
      value: 'ROOM|ce2a5daa-811d-2f49'
    },
    {
      label: '四室+',
      value: 'ROOM|2731c38c-5b19-ff7f'
    },
  ],
  // 楼层
  floorData = [
    {
      label: '低楼层',
      value: 'FLOOR|1'
    }, {
      label: '中楼层',
      value: 'FLOOR|2'
    }, {
      label: '高楼层',
      value: 'FLOOR|3'
    }
  ],
  //朝向
  orientedData = [
    {
      label: '东',
      value: 'ORIEN|141b98bf-1ad0-11e3'
    },
    {
      label: '南',
      value: 'ORIEN|61e99445-e95e-7f37'
    },
    {
      label: '西',
      value: 'ORIEN|103fb3aa-e8b4-de0e'
    },
    {
      label: '北',
      value: 'ORIEN|caa6f80b-b764-c2df'
    },
    {
      label: '东南',
      value: 'ORIEN|dfb1b36b-e0d1-0977'
    },
    {
      label: '西北',
      value: 'ORIEN|80795f1a-e32f-feb9'
    },
    {
      label: '东北',
      value: 'ORIEN|67ac2205-7e0f-c057'
    },
    {
      label: '西南',
      value: 'ORIEN|2354e89e-3918-9cef'
    }
  ]

class RentAdd extends Component {
  state = {
    community: {},
    price: '',
    roomType: '',
    floor: '',
    oriented: '',
    description: '',
    tempSlides: [],
    title: '',
    size: '',
    supporting: ''
  }
  componentDidMount() {
    if(this.props.history.location.state) {
      this.setState({
        community: this.props.history.location.state
      })
    }
  }
  onChange = (files, type, index) => {
    console.log(files, type, index);
    this.setState({
      tempSlides: files
    });
  }
  handleSupporting = (selected) => {
    this.setState({
      supporting: selected.join('|')
    })
  }
  getValue = (name, value) => {
    // console.log(name, value);
    this.setState({
      [name]: value
    })
  }
  onCancel = () => {
    this.props.history.go(-1)
  }
  addHouse = async () => {
    const { 
      tempSlides,
      title,
      description,
      oriented,
      supporting,
      price,
      roomType,
      size,
      floor,
      community,
    } = this.state

    let houseImg = ''
    if (tempSlides.length > 0) {
      const form = new FormData()
      tempSlides.forEach(item => {
        form.append('file', item.file)
      })
      const res = await API.post('/houses/image', form, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      houseImg = res.data.body.join('|')
      // console.log(houseImg);
    }
    const res = await API.post('/user/houses', {
      title,
      description,
      houseImg,
      oriented,
      supporting,
      price,
      roomType,
      size,
      floor,
      community: community.id
    })
    // console.log(res);
    if(res.data.status === 200) {
      Toast.info('发布成功', 1, () => {
        this.props.history.replace('/rent')
      }, false)
    } else {
      Toast.info('服务器开小差了~', 1, null, false)
    }
  }
  render() {
    const {
      community,
      price,
      roomType,
      floor,
      oriented,
      description,
      tempSlides,
      title,
      size
    } = this.state
    const { history } = this.props
    return (
      <div className={styles.root}>
        <NavHeader onLeftClick={this.onCancel}>发布房源</NavHeader>
        <List
          className={styles.info}
          renderHeader={() => '房源信息'}
          data-role="rent-list"
        >
          <Item
            extra={community.name || '请输入小区名称'}
            arrow="horizontal"
            onClick={() => { history.push('/rent/search') }}>
            小区名称
          </Item>
          <InputItem
            extra="￥/月"
            placeholder='请输入租金/月'
            type="number"
            value={price}
            onChange={(val) => { this.getValue('price', val) }}
          >
            租&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;金
          </InputItem>
          <InputItem
            extra="㎡"
            placeholder='请输入建筑面积'
            type="number"
            value={size}
            onChange={(val) => { this.getValue('size', val) }}
          >
            建筑面积
          </InputItem>
          <Picker
            cols={1}
            data={roomTypeData}
            value={[roomType]}
            onChange={(val) => { this.getValue('roomType', val[0]) }}
          >
            <Item arrow="horizontal">
              户&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;型
            </Item>
          </Picker>
          <Picker
            value={[floor]}
            cols={1}
            data={floorData}
            onChange={(val) => { this.getValue('floor', val[0]) }}
          >
            <Item arrow="horizontal">所在楼层</Item>
          </Picker>
          <Picker
            value={[oriented]}
            cols={1}
            data={orientedData}
            onChange={(val) => { this.getValue('oriented', val[0]) }}
          >
            <Item arrow="horizontal">
              朝&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;向
            </Item>
          </Picker>
        </List>
        <List
          className={styles.title}
          renderHeader={() => '房屋标题'}
          data-role="rent-list"
        >
          <InputItem
            placeholder="请输入标题（例如：整租 小区名 2室 5000元）"
            value={title}
            onChange={(val) => { this.getValue('title', val) }}
          >
          </InputItem>
        </List>
        <List
          className={styles.img}
          renderHeader={() => '房屋图像'}
          data-role="rent-list"
        >
          <ImagePicker
            files={tempSlides}
            onChange={this.onChange}
            onImageClick={(index, fs) => console.log(index, fs)}
            selectable={tempSlides.length < 7}
            multiple={true}
          />
        </List>
        <List
          className={styles.supporting}
          renderHeader={() => '房屋配置'}
          data-role="rent-list"
        >
          <HousePackage selected={true} onSelect={this.handleSupporting}></HousePackage>
        </List>
        <List
          className={styles.desc}
          renderHeader={() => '房屋描述'}
          data-role="rent-list"
        >
          <TextareaItem
            rows={5}
            placeholder="请输入房屋描述信息"
            value={description}
            onChange={(val) => { this.getValue('description', val) }}
          />
        </List>

        <Flex className={styles.bottom}>
          <Flex.Item className={styles.cancel} onClick={this.onCancel}>
            取消
          </Flex.Item>
          <Flex.Item className={styles.onOk} onClick={this.addHouse}>
            确定
          </Flex.Item>
        </Flex>
        
      </div>
    )
  }
}

export default RentAdd