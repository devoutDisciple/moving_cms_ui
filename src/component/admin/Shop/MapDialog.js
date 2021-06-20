import React from 'react';
import './index.less';
import { Modal, message, Input, Form } from 'antd';
import request from '../../../request/AxiosRequest';
import config from '../../../config/config';
import axios from 'axios';

const FormItem = Form.Item;
const { Search } = Input;

class MapDialog extends React.Component {
	constructor(props) {
		super(props);
		this.showInfoClick = this.showInfoClick.bind(this);
		this.onInputAddress = this.onInputAddress.bind(this);
	}

	state = {
		longitude: 120.050247, // 经度
		latitude: 30.282795, // 纬度
		value: '杭州市西溪水岸花苑',
	};

	async componentDidMount() {
		let { shopid } = this.props;
		let response = await request.get('/shop/getShopDetailById', {
			shopid: shopid,
		});
		let shop = response.data || {};
		setTimeout(() => {
			let longitude = shop.longitude || config.site.longitude,
				latitude = shop.latitude || config.site.latitude,
				address = shop.address || config.site.name;
			this.props.form.setFieldsValue({ site: address });
			this.reChartsMap(longitude, latitude);
		}, 0);
	}

	// 输入的地理位置
	async onInputAddress(value) {
		try {
			axios
				.get(`https://restapi.amap.com/v3/geocode/geo?key=04b2e5e608f74b461c892db7ed3d64b6&address=${value}`, {
					withCredentials: false,
				})
				.then((res) => {
					let site = res.geocodes[0].location;
					let arr = site.split(',');
					this.reChartsMap(arr[0], arr[1]);
				});
		} catch (error) {
			console.log(error);
		}
	}

	// 重新绘制地图
	async reChartsMap(longitude, latitude) {
		this.map = new AMap.Map('container', {
			resizeEnable: true, //是否监控地图容器尺寸变化
			zoom: 18, //初始化地图层级
			center: [longitude, latitude], //初始化地图中心点
		});
		this.marker = new AMap.Marker({
			position: new AMap.LngLat(longitude, latitude),
			title: '广州市',
		});
		this.setState({ longitude, latitude });
		this.map.add(this.marker);
		this.map.on('click', (e) => {
			this.showInfoClick(e.lnglat.getLng(), e.lnglat.getLat());
		});
	}

	// 点击增加锚点
	showInfoClick(longitude, latitude) {
		this.setState({ longitude, latitude });
		axios
			.get(
				`https://restapi.amap.com/v3/geocode/regeo?key=04b2e5e608f74b461c892db7ed3d64b6&location=${longitude},${latitude}`,
				{
					withCredentials: false,
				},
			)
			.then((res) => {
				let site = res.regeocode.formatted_address || '';
				this.props.form.setFieldsValue({ site: site });
			});
		// 移除已创建的 marker
		this.map.remove(this.marker);
		this.marker = new AMap.Marker({
			position: new AMap.LngLat(longitude, latitude),
		});
		this.map.add(this.marker);
	}

	// 确认修改
	async handleOk() {
		let { shopid } = this.props;
		let { longitude, latitude } = this.state;
		let address = this.props.form.getFieldValue('site');
		console.log(address, 111);
		let res = await request.post('/shop/updateShopSite', {
			shopid: shopid,
			longitude,
			latitude,
			address,
		});
		console.log(res, 99);
		if (res.data == 'success') {
			message.success('地点坐标标记成功');
			this.props.onControllerMapDialog();
			this.props.onSearch();
		}
	}

	handleCancel() {
		this.props.onControllerMapDialog();
	}

	render() {
		let { longitude, latitude } = this.state;
		const { getFieldDecorator } = this.props.form;
		const formItemLayout = {
			labelCol: { span: 4 },
			wrapperCol: { span: 18 },
		};
		return (
			<Modal
				className="common_dialog common_big_dialog"
				title="选取位置"
				visible={true}
				onOk={this.handleOk.bind(this)}
				onCancel={this.handleCancel.bind(this)}
			>
				<div>
					<Form {...formItemLayout}>
						<FormItem label="地理位置">
							{getFieldDecorator('site', {
								rules: [
									{
										required: true,
										message: '请输入',
									},
								],
							})(
								<Search
									size="large"
									enterButton="确定"
									placeholder="地理位置编码"
									onSearch={(value) => this.onInputAddress(value)}
								/>,
							)}
						</FormItem>
					</Form>
				</div>
				<div className="address_site_num">
					逆地理编码坐标: longitude: {longitude}, latitude: {latitude}
				</div>
				<div id="container"></div>
			</Modal>
		);
	}
}

const MapDialogForm = Form.create()(MapDialog);
export default MapDialogForm;
