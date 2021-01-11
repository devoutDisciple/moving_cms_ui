import React from 'react';
import { Table, Form, Col, Select, Button, Input } from 'antd';
import request from '../../../request/AxiosRequest';
import AddressDialog from './AddressDialog';
import OrderDialog from './OrderDialog';
import EvaluateDialog from './EvaluateDialog';
import config from '../../../config/config';
import FilterStatus from '../../../util/FilterStatus';
import PayDialog from './PayDialog';
import moment from 'moment';
const FormItem = Form.Item;
const { Option } = Select;

class Member extends React.Component {
	constructor(props) {
		super(props);
	}

	state = {
		userList: [], // 用户列表
		addressDialogVisible: false, // 地址弹框
		orderDialogVisible: false, // 全部订单弹框
		evaluateDialogVisible: false, // 评价信息
		payDialogVisible: false, // 消费记录信息
		dialogData: {}, // 弹框需要的信息
		orderList: [], // 订单信息
		evaluateList: [], // 评价列表
	};

	async componentDidMount() {
		await this.onSearchUser();
		this.props.form.setFieldsValue({ member: 9 });
	}

	// 获取所有用户
	async onSearchUser() {
		let res = await request.get('/user/all');
		let data = res.data || [];
		data.forEach((item, index) => (item.key = index));
		this.setState({ userList: data });
	}

	// 根据条件筛选用户
	async onSearchMember() {
		let values = this.props.form.getFieldsValue();
		let res = await request.get('/user/getByCondition', values);
		let data = res.data || [];
		data.forEach((item, index) => (item.key = index));
		this.setState({ userList: data });
	}

	// 查看所有消费记录
	async onSearchAllMoeny(record) {
		this.setState({ dialogData: record }, () => {
			this.onControllerPayDialog();
		});
	}

	// 查看用户所有订单
	async onSearchOrder(record) {
		let res = await request.get('/order/getAllListByUserId', { userid: record.id });
		this.setState({ orderList: res.data || [] }, () => {
			this.onControllerOrderDialog();
		});
	}

	// 点击查看地址
	onSearchAddress(data) {
		this.setState({ dialogData: data }, () => {
			this.onControllerAddressDialog();
		});
	}

	// 查看所有评价
	async onSearchEvaluate(record) {
		let res = await request.get('/evaluate/getEvaluateByOpenid', { openid: record.openid });
		this.setState({ evaluateList: res.data || [] }, () => {
			this.onControllerEvaluateDialog();
		});
	}

	// 评价弹框的开关
	onControllerEvaluateDialog() {
		this.setState({
			evaluateDialogVisible: !this.state.evaluateDialogVisible,
		});
	}

	// 支付记录弹框的开关
	onControllerPayDialog() {
		this.setState({
			payDialogVisible: !this.state.payDialogVisible,
		});
	}

	// 收货地址弹框关闭与打开
	onControllerAddressDialog() {
		this.setState({
			addressDialogVisible: !this.state.addressDialogVisible,
		});
	}

	// 订单信息弹框的打开关闭
	onControllerOrderDialog() {
		this.setState({
			orderDialogVisible: !this.state.orderDialogVisible,
		});
	}

	render() {
		const columns = [
				{
					title: '用户id',
					dataIndex: 'id',
					key: 'id',
					align: 'center',
				},
				{
					title: '头像',
					dataIndex: 'avatarUrl',
					key: 'avatarUrl',
					align: 'center',
					render: (text, record) => {
						return <img className="common_table_img" src={`${config.baseUrl}/${record.photo}`} />;
					},
				},
				{
					title: '昵称',
					dataIndex: 'nickname',
					key: 'nickname',
					align: 'center',
				},
				{
					title: '真实姓名',
					dataIndex: 'username',
					key: 'username',
					align: 'center',
				},
				{
					title: '手机号',
					dataIndex: 'phone',
					key: 'phone',
					align: 'center',
				},
				{
					title: '会员等级',
					dataIndex: 'member',
					key: 'member',
					align: 'center',
					render: (text) => {
						return <span>{FilterStatus.filterMemberStatus(text)}</span>;
					},
				},
				{
					title: '收货地址',
					dataIndex: 'address',
					key: 'address',
					align: 'center',
					render: (text, record) => {
						return <a onClick={this.onSearchAddress.bind(this, record)}>查看</a>;
					},
				},
				{
					title: '支付记录',
					dataIndex: 'consume',
					key: 'consume',
					align: 'center',
					render: (text, record) => {
						return <a onClick={this.onSearchAllMoeny.bind(this, record)}>查看</a>;
					},
				},
				// {
				// 	title: '所有订单',
				// 	dataIndex: 'hello',
				// 	key: 'hello',
				// 	align: 'center',
				// 	render: (text, record) => {
				// 		return <a onClick={this.onSearchOrder.bind(this, record)}>查看</a>;
				// 	},
				// },
				// {
				// 	title: '所有评价',
				// 	dataIndex: 'evaluate',
				// 	key: 'evaluate',
				// 	align: 'center',
				// 	render: (text, record) => {
				// 		return (
				// 			<a  onClick={this.onSearchEvaluate.bind(this, record)}>
				// 				查看
				// 			</a>
				// 		);
				// 	},
				// },
				{
					title: '账户余额',
					dataIndex: 'balance',
					key: 'balance',
					align: 'center',
				},
				{
					title: '积分',
					dataIndex: 'integral',
					key: 'integral',
					align: 'center',
				},
				{
					title: '注册时间',
					dataIndex: 'create_time',
					key: 'create_time',
					align: 'center',
					render: (text, record) => {
						return <span>{moment(record.create_time).format('YYYY-MM-DD HH:mm:ss')}</span>;
					},
				},
			],
			{
				evaluateDialogVisible,
				addressDialogVisible,
				orderDialogVisible,
				payDialogVisible,
				dialogData,
				userList,
				orderList,
				evaluateList,
			} = this.state,
			formItemLayout = {
				labelCol: { span: 8 },
				wrapperCol: { span: 16 },
			},
			{ getFieldDecorator } = this.props.form;
		return (
			<div className="common">
				<div className="common_search">
					<Form className="common_search_form" {...formItemLayout}>
						<Col span={6}>
							<FormItem label="会员级别">
								{getFieldDecorator('member')(
									<Select placeholder="请选择" onSelect={this.onSearchMember.bind(this)}>
										<Option value={9}>全部</Option>
										<Option value={1}>普通用户</Option>
										<Option value={2}>MOVING会员</Option>
										<Option value={3}>MOVING PLUS会员</Option>
									</Select>,
								)}
							</FormItem>
						</Col>
						<Col span={6}>
							<FormItem label="会员名称">
								{getFieldDecorator('name')(<Input placeholder="请输入" />)}
							</FormItem>
						</Col>
						<Col span={6}>
							<FormItem label="手机号">
								{getFieldDecorator('phone')(<Input type="number" placeholder="请输入" />)}
							</FormItem>
						</Col>
						<Col span={3} offset={1}>
							<Button type="primary" onClick={this.onSearchMember.bind(this)}>
								查询
							</Button>
						</Col>
					</Form>
				</div>
				<div className="common_content">
					<Table
						bordered
						dataSource={userList}
						columns={columns}
						pagination={{
							total: userList.length,
							showTotal: (total) => `共 ${total} 条`,
						}}
					/>
				</div>
				{addressDialogVisible ? (
					<AddressDialog
						data={dialogData}
						onControllerAddressDialog={this.onControllerAddressDialog.bind(this)}
					/>
				) : null}
				{payDialogVisible && (
					<PayDialog data={dialogData} onControllerAddressDialog={this.onControllerPayDialog.bind(this)} />
				)}
				{orderDialogVisible ? (
					<OrderDialog data={orderList} onControllerOrderDialog={this.onControllerOrderDialog.bind(this)} />
				) : null}
				{evaluateDialogVisible ? (
					<EvaluateDialog
						data={evaluateList}
						onControllerEvaluateDialog={this.onControllerEvaluateDialog.bind(this)}
					/>
				) : null}
			</div>
		);
	}
}

const MemberForm = Form.create()(Member);
export default MemberForm;
