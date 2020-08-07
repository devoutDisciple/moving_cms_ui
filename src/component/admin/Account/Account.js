import React from 'react';
import { Button, Table, Popconfirm, message, Form, Select, Col, Badge } from 'antd';
import AddDialog from './AddDialog';
import EditorDialog from './EditorDialog';
import Request from '../../../request/AxiosRequest';
import FilterStatus from '../../../util/FilterStatus';
const FormItem = Form.Item;
const { Option } = Select;

class Swiper extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			shopList: [],
			editData: {},
			accountsList: [],
			addDialogVisible: false,
			editorDialogVisible: false,
		};
	}

	async componentDidMount() {
		await this.props.form.setFieldsValue({ shopid: -1 });
		await this.onSearchShop();
		await this.onSearchAccounts();
	}

	// 查询商店
	async onSearchShop() {
		let resShop = await Request.get('/shop/all');
		let shops = resShop.data || [];
		await this.setState({ shopList: shops });
	}

	// 查询账户
	async onSearchAccounts() {
		let values = this.props.form.getFieldsValue();
		let result = await Request.get('/account/getAllAccount', values);
		let accounts = result.data || [];
		console.log(accounts);
		await this.setState({ accountsList: accounts });
	}

	// 商店选择切换的时候
	onShopSelect(shopid) {
		this.setState({ shopid }, () => this.onSearchAccounts());
	}

	// 新增编辑框的显示
	controllerAddDialog() {
		this.setState({ addDialogVisible: !this.state.addDialogVisible });
	}

	// 编辑框的显示
	controllerEditorDialog() {
		this.setState({ editorDialogVisible: !this.state.editorDialogVisible });
	}

	// 确认删除
	async onConfirmDelete(record) {
		let result = await Request.post('/account/deleteById', { id: record.id });
		if (result.data == 'success') {
			message.success('删除成功');
			return this.onSearchAccounts();
		}
	}

	// 点击修改
	onEditorCampus(record) {
		this.setState({ editData: record }, () => this.controllerEditorDialog());
	}

	render() {
		const { getFieldDecorator } = this.props.form,
			formItemLayout = {
				labelCol: { span: 4 },
				wrapperCol: { span: 20 },
			},
			{ addDialogVisible, editorDialogVisible, accountsList, shopList, editData } = this.state,
			columns = [
				{
					title: '用户名',
					dataIndex: 'name',
					key: 'name',
					align: 'center',
				},
				{
					title: '登录账号',
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
					title: '所属商店',
					dataIndex: 'shopName',
					key: 'shopName',
					align: 'center',
				},
				{
					title: '角色',
					dataIndex: 'role',
					key: 'role',
					align: 'center',
					render: (text, record) => {
						if (record.role == 1) {
							return <Badge status="error" text={FilterStatus.filterRoleType(record.role)} />;
						}
						if (record.role == 2) {
							return <Badge status="warning" text={FilterStatus.filterRoleType(record.role)} />;
						}
						if (record.role == 3) {
							return <Badge status="processing" text={FilterStatus.filterRoleType(record.role)} />;
						}
						return <span>{FilterStatus.filterRoleType(record.role)}</span>;
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
								<Popconfirm
									placement="top"
									title="是否确认删除"
									onConfirm={this.onConfirmDelete.bind(this, record)}
									okText="确认"
									cancelText="取消"
								>
									{record.role == 1 || record.role == 2 ? (
										<a disabled={true} href="javascript:;">
											删除
										</a>
									) : (
										<a href="javascript:;">删除</a>
									)}
									{/* <a href="javascript:;">删除</a> */}
								</Popconfirm>
								<a href="javascript:;" onClick={this.onEditorCampus.bind(this, record)}>
									修改
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
							<FormItem label="店铺选择">
								{getFieldDecorator('shopid')(
									<Select onSelect={this.onShopSelect.bind(this)} placeholder="请选择">
										<Option key={-1} value={-1}>
											全部
										</Option>
										{shopList &&
											shopList.map((item) => {
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
						<Col span={6} offset={1}>
							<Button type="primary" onClick={this.controllerAddDialog.bind(this)}>
								新增
							</Button>
						</Col>
					</Form>
				</div>
				<div className="common_content">
					<Table
						bordered
						dataSource={accountsList}
						rowKey="id"
						columns={columns}
						pagination={{
							total: accountsList.length,
							showTotal: (total) => `共 ${total} 条`,
						}}
					/>
				</div>
				{addDialogVisible ? (
					<AddDialog
						onSearch={this.onSearchAccounts.bind(this)}
						controllerAddDialog={this.controllerAddDialog.bind(this)}
					/>
				) : null}
				{editorDialogVisible ? (
					<EditorDialog
						editData={editData}
						onSearch={this.onSearchAccounts.bind(this)}
						controllerAddDialog={this.controllerEditorDialog.bind(this)}
					/>
				) : null}
			</div>
		);
	}
}

const SwiperForm = Form.create()(Swiper);
export default SwiperForm;
