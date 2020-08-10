import React from 'react';
import { Table, Form, Col, Select, Button, Badge } from 'antd';
import Request from '../../../request/AxiosRequest';
import config from '../../../config/config';
import moment from 'moment';
const FormItem = Form.Item;
const { Option } = Select;

class Order extends React.Component {
	constructor(props) {
		super(props);
	}

	state = {
		recordList: [],
		cabinetList: [], // 快递柜
		current: 1,
		pagesize: 10,
		total: 0,
	};

	async componentDidMount() {
		setTimeout(async () => {
			await this.props.form.setFieldsValue({ success: -1, cabinetid: -1 });
			// 获取所有快递柜
			await this.onSearchCabinet();
			// 查询所有记录
			await this.onSearch();
		}, 0);
	}

	// 获取所有柜子
	async onSearchCabinet() {
		let res = await Request.get('/cabinet/getAllForSelect');
		console.log(res.data, 111);
		this.setState({ cabinetList: res.data || [] });
	}

	// 查询所有记录
	async onSearch() {
		let { current, pagesize } = this.state;
		let values = this.props.form.getFieldsValue();
		values = Object.assign(values, { current, pagesize });
		let res = await Request.get('/exception/getAllByPagesize', values);
		let data = res.data || {};
		console.log(data, 33);
		let dataSource = data.dataSource || [],
			total = data.total || 0;
		this.setState({ recordList: dataSource, total });
	}

	render() {
		let { recordList, cabinetList, current, total } = this.state,
			columns = [
				{
					title: '柜子图片',
					dataIndex: 'cabinetUrl',
					key: 'cabinetUrl',
					align: 'center',
					render: (text, record) => {
						return <img className="common_table_img" src={`${config.imgUrl}/${record.cabinetUrl}`} />;
					},
				},
				{
					title: '洗衣柜',
					dataIndex: 'cabinetName',
					key: 'cabinetName',
					align: 'center',
				},
				{
					title: '洗衣柜位置',
					dataIndex: 'cabinetAddress',
					key: 'cabinetAddress',
					align: 'center',
				},
				{
					title: '格口',
					dataIndex: 'cellid',
					key: 'cellid',
					align: 'center',
				},
				{
					title: '是否成功',
					dataIndex: 'success',
					key: 'success',
					align: 'center',
					render: (text) => {
						if (text == 1) return <Badge status="success" text="成功" />;
						return <Badge status="error" text="失败" />;
					},
				},
				{
					title: '用户类型',
					dataIndex: 'user_type',
					key: 'user_type',
					align: 'center',
					render: (text) => {
						if (text == 1) return <Badge status="Processing" text="用户" />;
						return <Badge status="Warning" text="店员" />;
					},
				},
				{
					title: '返回记录',
					dataIndex: 'result',
					key: 'result',
					align: 'center',
				},
				{
					title: '操作时间',
					dataIndex: 'create_time',
					key: 'create_time',
					align: 'center',
					render: (text) => {
						return <span>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</span>;
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
							<FormItem label="柜子">
								{getFieldDecorator('cabinetid')(
									<Select placeholder="请选择" onSelect={this.onSearch.bind(this)}>
										<Option value={-1}>全部</Option>
										{cabinetList.map((item) => {
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
							<FormItem label="记录类型">
								{getFieldDecorator('success')(
									<Select placeholder="请选择" onSelect={this.onSearch.bind(this)}>
										<Option value={-1}>全部</Option>
										<Option value={1}>正常记录</Option>
										<Option value={2}>异常记录</Option>
									</Select>,
								)}
							</FormItem>
						</Col>

						<Col span={3} offset={1}>
							<Button type="primary" onClick={this.onSearch.bind(this)}>
								查询
							</Button>
						</Col>
					</Form>
				</div>
				<div className="common_content">
					<Table
						bordered
						rowKey="id"
						dataSource={recordList}
						columns={columns}
						pagination={{
							onChange: (value) => {
								this.setState({ current: value }, () => {
									this.onSearch();
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
