import React from 'react';
import {
	Table, Tooltip, message
} from 'antd';
import request from '../../../request/AxiosRequest';
import moment from 'moment';
import AddressDialog from './AddressDialog';
import OrderDialog from './OrderDialog';
import EvaluateDialog from './EvaluateDialog';

export default class Member extends React.Component{

	constructor(props) {
		super(props);
	}

	state = {
		userList: [], // 用户列表
		addressDialogVisible: false,// 地址弹框
		orderDialogVisible: false, // 全部订单弹框
		evaluateDialogVisible: false, // 评价信息
		addressData: [], // 地址信息
		orderList: [], // 订单信息
		evaluateList: [], // 评价列表
	}

	async componentDidMount() {
		let res = await request.get('/user/all');
		let data = res.data || [];
		data.map((item, index) => item.key = index);
		this.setState({
			userList: data
		});
	}

	// 查看累计消费
	async onSearchAllMoeny(record) {
		let res = await request.get('/order/getAllMoneyByOpenid', {openid: record.openid});
		message.success(`该用户累计消费: ${res.data || 0}`);
	}

	// 查看用户所有订单
	async onSearchOrder(record) {
		let res = await request.get('/order/getListByOpenid', {openid: record.openid});
		this.setState({
			orderList: res.data || []
		}, () => {
			this.onControllerOrderDialog();
		});
	}

	// 点击查看地址
	onSearchAddress(data) {
		this.setState({
			addressData: data
		}, () => {
			this.onControllerAddressDialog();
		});
	}

	// 查看所有评价
	async onSearchEvaluate(record) {
		let res = await request.get('/evaluate/getEvaluateByOpenid', {openid: record.openid});
		this.setState({
			evaluateList: res.data || []
		}, () => {
			this.onControllerEvaluateDialog();
		});
	}

	// 评价弹框的开关
	onControllerEvaluateDialog() {
		this.setState({
			evaluateDialogVisible: !this.state.evaluateDialogVisible
		});
	}

	// 收货地址弹框关闭与打开
	onControllerAddressDialog() {
		this.setState({
			addressDialogVisible: !this.state.addressDialogVisible
		});
	}

	// 订单信息弹框的打开关闭
	onControllerOrderDialog() {
		this.setState({
			orderDialogVisible: !this.state.orderDialogVisible
		});
	}

	render() {
		const columns = [
			{
				title: '用户名称',
				dataIndex: 'username',
				key: 'username',
				align: 'center'
			},
			{
				title: '微信名称',
				dataIndex: 'name',
				key: 'name',
				align: 'center',
				render:(text, record) => {
					return <Tooltip placement="top" title={record.name}>
						<span className='common_table_ellipse'>{record.name}</span>
					   </Tooltip>;
				}
			},
			{
				title: '头像',
				dataIndex: 'avatarUrl',
				key: 'avatarUrl',
				align: 'center',
				render:(text, record) => {
					return <img className='common_table_img' src={record.avatarUrl}/>;
				}
			},
			{
				title: '手机号',
				dataIndex: 'phone',
				key: 'phone',
				align: 'center'
			},
			{
				title: '收货地址',
				dataIndex: 'price',
				key: 'price',
				align: 'center',
				render:(text, record) => {
					return <a href="javascript:;" onClick={this.onSearchAddress.bind(this, record)}>查看</a>;
				}
			},
			{
				title: '累计消费',
				dataIndex: 'consume',
				key: 'consume',
				align: 'center',
				render:(text, record) => {
					return <a href="javascript:;" onClick={this.onSearchAllMoeny.bind(this, record)}>查看</a>;
				}
			},
			{
				title: '所有订单',
				dataIndex: 'hello',
				key: 'hello',
				align: 'center',
				render:(text, record) => {
					return <a href="javascript:;" onClick={this.onSearchOrder.bind(this, record)}>查看</a>;
				}
			},
			{
				title: '所有评价',
				dataIndex: 'evaluate',
				key: 'evaluate',
				align: 'center',
				render:(text, record) => {
					return <a href="javascript:;" onClick={this.onSearchEvaluate.bind(this, record)}>查看</a>;
				}
			},
			{
				title: '注册时间',
				dataIndex: 'create_time',
				key: 'create_time',
				align: 'center',
				render:(text, record) => {
					return <span>{moment(record.create_time).format('YYYY-MM-DD HH:mm:ss')}</span>;
				}
			}
		];
		let {
			addressDialogVisible,
			addressData,
			userList,
			orderDialogVisible,
			orderList,
			evaluateDialogVisible,
			evaluateList
		} = this.state;
		return (
			<div className='common'>
				<div className='common_content'>
					<Table
						bordered
						dataSource={userList}
						columns={columns}
						pagination={
							{
								total: userList.length,
								showTotal: (total) => `共 ${total} 条`
							}
						}/>
				</div>
				{
					addressDialogVisible ?
						<AddressDialog
							data={addressData}
							onControllerAddressDialog={this.onControllerAddressDialog.bind(this)}/>
						: null
				}
				{
					orderDialogVisible ?
						<OrderDialog
							data={orderList}
							onControllerOrderDialog={this.onControllerOrderDialog.bind(this)}/>
						: null
				}
				{
					evaluateDialogVisible ?
						<EvaluateDialog
							data={evaluateList}
							onControllerEvaluateDialog={this.onControllerEvaluateDialog.bind(this)}/>
						: null
				}
			</div>
		);
	}
}


