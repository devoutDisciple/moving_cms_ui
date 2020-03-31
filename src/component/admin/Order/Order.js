import React from 'react';
import { Table, Form, Col, Select, Button, Input } from 'antd';
import Request from '../../../request/AxiosRequest';
import FilterStatus from '../../../util/FilterStatus';
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
	};

	async componentDidMount() {
		await this.props.form.setFieldsValue({ type: 0, shop: 0 });
		// 查询所有店铺
		await this.onSearchShopList();
		// 查询所有订单
		await this.onSearchOrder();
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
		let res = await Request.get('/order/getAll');
		let data = res.data || [];
		console.log(data, 33);
		data.map((item) => {
			item.key = item.id;
		});
		this.setState({ oderList: res.data || [] });
	}

	// 查看订单详情
	async onSearchOrderDetail() {}

	render() {
		let { oderList, shopList } = this.state,
			columns = [
				{
					title: '订单编号',
					dataIndex: 'id',
					key: 'id',
					align: 'center',
				},
				{
					title: '商店名称',
					dataIndex: 'shop',
					key: 'shop',
					align: 'center',
				},
				{
					title: '会员名称',
					dataIndex: 'username',
					key: 'username',
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
					title: '联系方式',
					dataIndex: 'phone',
					key: 'phone',
					align: 'center',
				},
				{
					title: '订单总价',
					dataIndex: 'money',
					key: 'money',
					align: 'center',
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
				{
					title: '订单状态',
					dataIndex: 'status',
					key: 'status',
					align: 'center',
					render: (text, record) => {
						return <span>{FilterStatus.filterMemberStatus(record.status)}</span>;
					},
				},
				{
					title: '操作',
					dataIndex: 'operation',
					key: 'operation',
					align: 'center',
					render: (text, record) => {
						return (
							<span className="common_table_span">
								<a href="javascript:;" onClick={this.onSearchOrderDetail.bind(this, record)}>
									订单详情
								</a>
							</span>
						);
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
						<Col span={6}>
							<FormItem label="订单类型">
								{getFieldDecorator('type')(
									<Select placeholder="请选择">
										<Option value={0}>全部</Option>
										<Option value={1}>清洗中</Option>
										<Option value={2}>待取货</Option>
										<Option value={3}>已完成</Option>
									</Select>,
								)}
							</FormItem>
						</Col>
						<Col span={6}>
							<FormItem label="所属店铺">
								{getFieldDecorator('shop')(
									<Select placeholder="请选择">
										<Option value={0}>全部</Option>
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
							<FormItem label="会员名称">
								{getFieldDecorator('name')(<Input placeholder="请输入" />)}
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
						dataSource={oderList}
						columns={columns}
						pagination={{
							total: oderList.length,
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
