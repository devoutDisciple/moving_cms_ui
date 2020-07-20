import React from 'react';
import { Table, Form, Col, Select, Button, Input, Badge } from 'antd';
import Request from '../../../request/AxiosRequest';
import FilterStatus from '../../../util/FilterStatus';
import FilterOrderStatus from '../../../util/FilterOrderStatus';
import moment from 'moment';
const FormItem = Form.Item;
const { Option } = Select;

class Order extends React.Component {
	constructor(props) {
		super(props);
	}

	state = {
		oderList: [],
		shopList: [], // 店铺列表
		current: 1,
		pagesize: 10,
		total: 0,
	};

	async componentDidMount() {
		setTimeout(async () => {
			await this.props.form.setFieldsValue({ order_type: -1, shopid: -1 });
			// 查询所有店铺
			await this.onSearchShopList();
			// 查询所有订单
			await this.onSearchOrder();
		}, 0);
	}

	// 查询所有店铺
	async onSearchShopList() {
		let res = await Request.get('/shop/all');
		let data = res.data || [];
		data.forEach((item) => {
			item.key = item.id;
		});
		this.setState({ shopList: res.data || [] });
	}

	// 查询所有订单
	async onSearchOrder() {
		let { current, pagesize } = this.state;
		let values = this.props.form.getFieldsValue();
		values = Object.assign(values, { current, pagesize });
		let res = await Request.get('/order/getAllByPagesize', values);
		let data = res.data || {};
		console.log(data, 33);
		let dataSource = data.dataSource || [],
			total = data.total || 0;
		this.setState({ oderList: dataSource, total });
	}

	// 查看订单详情
	async onSearchOrderDetail() {}

	render() {
		let { oderList, shopList, current, total } = this.state,
			columns = [
				{
					title: '订单编号',
					dataIndex: 'code',
					key: 'code',
					align: 'center',
				},
				{
					title: '订单类型',
					dataIndex: 'order_type',
					key: 'order_type',
					align: 'center',
					render: (text) => {
						return <span>{FilterOrderStatus.filterOrderType(text)}</span>;
					},
				},
				{
					title: '商店名称',
					dataIndex: 'shop',
					key: 'shop',
					align: 'center',
				},
				{
					title: '用户名称',
					dataIndex: 'username',
					key: 'username',
					align: 'center',
				},
				{
					title: '联系方式',
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
					title: '订单总价',
					dataIndex: 'money',
					key: 'money',
					align: 'center',
				},
				{
					title: '消耗积分',
					dataIndex: 'intergral_num',
					key: 'intergral_num',
					align: 'center',
				},
				{
					title: '订单状态',
					dataIndex: 'status',
					key: 'status',
					align: 'center',
					render: (text, record) => {
						return <span>{FilterOrderStatus.filterOrderStatus(record.status)}</span>;
					},
				},
				{
					title: '店员确认',
					dataIndex: 'is_sure',
					key: 'is_sure',
					align: 'center',
					render: (text, record) => {
						if (record.order_type === 1) {
							if (text == 2) return <Badge status="success" text="店员已确认" />;
							return <Badge status="error" text="店员未确认" />;
						}
						return <span>--</span>;
					},
				},
				{
					title: '下单时间',
					dataIndex: 'create_time',
					key: 'create_time',
					align: 'center',
					render: (text) => {
						return text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '';
					},
				},

				// {
				// 	title: '操作',
				// 	dataIndex: 'operation',
				// 	key: 'operation',
				// 	align: 'center',
				// 	render: (text, record) => {
				// 		return (
				// 			<span className="common_table_span">
				// 				<a href="javascript:;" onClick={this.onSearchOrderDetail.bind(this, record)}>
				// 					订单详情
				// 				</a>
				// 			</span>
				// 		);
				// 	},
				// },
			],
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
							<FormItem label="订单类型">
								{getFieldDecorator('order_type')(
									<Select placeholder="请选择" onSelect={this.onSearchOrder.bind(this)}>
										<Option value={-1}>全部</Option>
										<Option value={1}>洗衣柜下订单</Option>
										<Option value={2}>上门取衣订单</Option>
										<Option value={3}>积分兑换订单</Option>
										<Option value={4}>店员录入订单</Option>
									</Select>,
								)}
							</FormItem>
						</Col>
						<Col span={6}>
							<FormItem label="所属店铺">
								{getFieldDecorator('shopid')(
									<Select placeholder="请选择" onSelect={this.onSearchOrder.bind(this)}>
										<Option value={-1}>全部</Option>
										{shopList.map((item) => {
											return (
												<Option key={item.id} value={item.id}>
													{item.name}
												</Option>
											);
										})}
									</Select>,
								)}
							</FormItem>
						</Col>
						<Col span={6}>
							<FormItem label="订单号">
								{getFieldDecorator('code')(<Input placeholder="请输入" />)}
							</FormItem>
						</Col>
						<Col span={3} offset={1}>
							<Button type="primary" onClick={this.onSearchOrder.bind(this)}>
								查询
							</Button>
						</Col>
					</Form>
				</div>
				<div className="common_content">
					<Table
						bordered
						rowKey="id"
						dataSource={oderList}
						columns={columns}
						pagination={{
							onChange: (value) => {
								this.setState({ current: value }, () => {
									this.onSearchOrder();
								});
							},

							current: current,
							total: total,
							showTotal: (total) => `共 ${total} 条`,
						}}
					/>
				</div>
			</div>
		);
	}
}

const OrderForm = Form.create()(Order);
export default OrderForm;
