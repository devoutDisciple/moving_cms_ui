import React from 'react';
import {Modal, message} from 'antd';
import './index.less';
import request from '../../../request/AxiosRequest';

export default class MapDialog extends React.Component {

	constructor(props) {
		super(props);
		this.showInfoClick = this.showInfoClick.bind(this);
	}

	state = {
	};

	componentDidMount() {
		setTimeout(() => {
			let {siteX, siteY} = this.props.data;
			this.map = new AMap.Map('container', {
				resizeEnable: true, //是否监控地图容器尺寸变化
				zoom:11, //初始化地图层级
				center: [siteX, siteY] //初始化地图中心点
			});
			this.marker = new AMap.Marker({
				position: new AMap.LngLat(siteX, siteY),   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
				title: '广州市'
			});
			this.map.add(this.marker);
			this.map.on('click', this.showInfoClick);
		}, 0);
	}

	showInfoClick(e) {
		let siteX = e.lnglat.getLng();
		let siteY = e.lnglat.getLat();
		this.setState({siteX, siteY});
		// 移除已创建的 marker
		this.map.remove(this.marker);
		this.marker = new AMap.Marker({
			position: new AMap.LngLat(siteX, siteY),   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
		});
		this.map.add(this.marker);
	}

	async handleOk() {
		let {data} = this.props;
		let {siteX, siteY} = this.state;
		let res = await request.post('/position/updatePositionSite', {id: data.id, siteX, siteY});
		if(res.data == 'success') {
			message.success('地点坐标标记成功');
			this.props.onControllerMapDialog();
		}
	}

	handleCancel() {
		this.props.onControllerMapDialog();
	}


	render() {
		return (
			<Modal
				className='common_dialog common_max_dialog'
				title="选取位置"
				visible={true}
				onOk={this.handleOk.bind(this)}
				onCancel={this.handleCancel.bind(this)}>
				<div id="container"></div>
			</Modal>
		);
	}
}
