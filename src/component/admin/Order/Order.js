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
	async onSearchOrder(currentPage) {
		let { current, pagesize } = this.state;
		if (currentPage) current = currentPage;
		let values = this.props.form.getFieldsValue();
		this.setState({ current }, async () => {
			values = Object.assign(values, { current, pagesize });
			let res = await Request.get('/order/getAllByPagesize', values);
			let data = res.data || {};
			let dataSource = data.dataSource || [],
				total = data.total || 0;
			this.setState({ oderList: dataSource, total });
		});
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
					title: '折扣',
					dataIndex: 'discount',
					key: 'discount',
					align: 'center',
					render: (text) => {
						if (!text || text === Number(10)) return <span>无折扣</span>;
						return <span>{text} 折</span>;
					},
				},
				{
					title: '折扣费用',
					dataIndex: 'subDiscountMoney',
					key: 'subDiscountMoney',
					align: 'center',
				},
				{
					title: '加急费用',
					dataIndex: 'urgencyMoney',
					key: 'urgencyMoney',
					align: 'center',
					render: (text) => {
						if (!text) return <span>--</span>;
						return <span>{text}</span>;
					},
				},
				{
					title: '实付',
					dataIndex: 'payMoney',
					key: 'payMoney',
					align: 'center',
				},
				{
					title: '消耗积分',
					dataIndex: 'intergral_num',
					key: 'intergral_num',
					align: 'center',
					render: (text) => {
						if (!text) return <span>--</span>;
						return <span>{text}</span>;
					},
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
						if (record.order_type === 1 || record.order_type === 4 || record.order_type === 5) {
							if (text == 2) return <Badge status="success" text="已确认" />;
							return <Badge status="error" text="未确认" />;
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
						<Col span={4}>
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
						<Col span={4}>
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
						<Col span={4}>
							<FormItem label="订单号">
								{getFieldDecorator('code')(<Input placeholder="请输入" />)}
							</FormItem>
						</Col>
						<Col span={4}>
							<FormItem label="用户名称">
								{getFieldDecorator('username')(<Input placeholder="请输入" />)}
							</FormItem>
						</Col>
						<Col span={4}>
							<FormItem label="用户手机号">
								{getFieldDecorator('phone')(<Input placeholder="请输入" />)}
							</FormItem>
						</Col>
						<Col span={3} offset={1}>
							<Button type="primary" onClick={this.onSearchOrder.bind(this, 1)}>
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
