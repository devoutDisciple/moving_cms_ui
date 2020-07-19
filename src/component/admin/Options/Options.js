import React from 'react';
import moment from 'moment';
import config from '../../../config/config';
import Request from '../../../request/AxiosRequest';
import FilterStatus from '../../../util/FilterStatus';
import { Table, Tooltip, Form, Col, Select, Button, message, Badge } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

class OptionsScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			list: [],
		};
	}

	async componentDidMount() {
		this.props.form.setFieldsValue({ status: 9 });
		await this.onSearch();
	}

	// 查询评价列表
	async onSearch() {
		let value = this.props.form.getFieldsValue();
		let result = await Request.get('/option/all', value);
		let data = result.data || [];
		data.forEach((item) => {
			item.key = item.id;
			item.create_time = moment(item.create_time).format('YYYY-MM-DD HH:mm:ss');
		});
		this.setState({ list: data });
	}

	// 更改意见状态
	async changeOptionStatus(record) {
		let result = await Request.post('/option/updateStatus', { id: record.id });
		if (result.data === 'success') {
			message.success('更改成功');
			this.onSearch();
		}
	}

	render() {
		let { list } = this.state,
			{ getFieldDecorator } = this.props.form,
			formItemLayout = {
				labelCol: { span: 4 },
				wrapperCol: { span: 20 },
			},
			columns = [
				{
					title: '用户id',
					dataIndex: 'userid',
					key: 'userid',
					align: 'center',
				},
				{
					title: '用户名',
					dataIndex: 'username',
					key: 'username',
					align: 'center',
				},
				{
					title: '用户头像',
					dataIndex: 'photo',
					key: 'photo',
					align: 'center',
					render: (text) => {
						return <img style={{ width: '33px' }} src={`${config.imgUrl}/${text}`} />;
					},
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
					title: '反馈原因',
					dataIndex: 'option',
					key: 'option',
					align: 'center',
				},

				{
					title: '描述',
					dataIndex: 'desc',
					key: 'desc',
					align: 'center',
					render: (text) => {
						return (
							<Tooltip placement="top" title={text}>
								<span className="common_max_table_ellipse">{text}</span>
							</Tooltip>
						);
					},
				},
				{
					title: '创建时间',
					dataIndex: 'create_time',
					key: 'create_time',
					align: 'center',
				},
				{
					title: '状态',
					dataIndex: 'status',
					key: 'status',
					align: 'center',
					render: (status) => {
						console.log(status, 99);
						let text = FilterStatus.filterOptionsStatus(status);
						if (status == 2) return <Badge status="success" text={text} />;
						return <Badge status="error" text={text} />;
					},
				},
				{
					title: '操作',
					dataIndex: 'operator',
					key: 'operator',
					align: 'center',
					render: (text, record) => {
						if (record.status == 2) return;
						return (
							<span className="common_table_span">
								<a href="javascript:;" onClick={this.changeOptionStatus.bind(this, record)}>
									标记为已处理
								</a>
							</span>
						);
					},
				},
			];
		return (
			<div className="common">
				<div className="common_search">
					<Form className="common_search_form" {...formItemLayout}>
						<Col span={6}>
							<FormItem label="状态">
								{getFieldDecorator('status')(
									<Select onSelect={() => {}} placeholder="请选择">
										<Option key={1} value={9}>
											全部
										</Option>
										<Option key={2} value={1}>
											待处理
										</Option>
										<Option key={3} value={2}>
											已处理
										</Option>
									</Select>,
								)}
							</FormItem>
						</Col>
						<Col span={6} offset={1}>
							<Button type="primary" onClick={this.onSearch.bind(this)}>
								查询
							</Button>
						</Col>
					</Form>
				</div>
				<div className="common_content">
					<Table
						bordered
						dataSource={list}
						columns={columns}
						pagination={{
							total: list.length,
							showTotal: (total) => `共 ${total} 条`,
						}}
					/>
				</div>
			</div>
		);
	}
}

const OptionsScreenForm = Form.create()(OptionsScreen);
export default OptionsScreenForm;
