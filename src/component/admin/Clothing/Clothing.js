import React from 'react';
import { Button, Table, Popconfirm, message, Form, Select, Col } from 'antd';
import AddDialog from './AddDialog';
import EditorDialog from './EditorDialog';
import Request from '../../../request/AxiosRequest';
import moment from 'moment';
const FormItem = Form.Item;
const { Option } = Select;

class Swiper extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			shopList: [],
			editData: {},
			clothingsList: [],
			addDialogVisible: false,
			editorDialogVisible: false,
		};
	}

	async componentDidMount() {
		await this.props.form.setFieldsValue({ shopid: -1 });
		await this.onSearchShop();
		await this.onSearchClothing();
	}

	// 查询所有衣物
	async onSearchClothing() {
		let values = this.props.form.getFieldsValue();
		let clothings = await Request.get('/clothing/getByShopid', values);
		let clothingsList = clothings.data || [];
		await this.setState({ clothingsList: clothingsList });
	}

	// 查询商店
	async onSearchShop() {
		let resShop = await Request.get('/shop/all');
		let shops = resShop.data || [];
		await this.setState({ shopList: shops });
	}

	// 商店选择切换的时候
	onShopSelect(shopid) {
		this.setState({ shopid }, () => this.onSearchClothing());
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
		let result = await Request.post('/clothing/deleteById', { id: record.id });
		if (result.data == 'success') {
			message.success('删除成功');
			return this.onSearchClothing();
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
			{ addDialogVisible, editorDialogVisible, clothingsList, shopList, editData } = this.state,
			columns = [
				{
					title: '所属店铺',
					dataIndex: 'shopName',
					key: 'shopName',
					align: 'center',
				},
				{
					title: '衣物名称',
					dataIndex: 'name',
					key: 'name',
					align: 'center',
				},
				{
					title: '价格',
					dataIndex: 'price',
					key: 'price',
					align: 'center',
				},
				{
					title: '创建时间',
					dataIndex: 'create_time',
					key: 'create_time',
					align: 'center',
					render: (text) => {
						return text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '';
					},
				},
				{
					title: '权重',
					dataIndex: 'sort',
					key: 'sort',
					align: 'center',
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
									<a href="javascript:;">删除</a>
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
						dataSource={clothingsList}
						columns={columns}
						pagination={{
							total: clothingsList.length,
							showTotal: (total) => `共 ${total} 条`,
						}}
					/>
				</div>
				{addDialogVisible ? (
					<AddDialog
						onSearch={this.onSearchClothing.bind(this)}
						controllerAddDialog={this.controllerAddDialog.bind(this)}
					/>
				) : null}
				{editorDialogVisible ? (
					<EditorDialog
						editData={editData}
						onSearch={this.onSearchClothing.bind(this)}
						controllerEditorDialog={this.controllerEditorDialog.bind(this)}
					/>
				) : null}
			</div>
		);
	}
}

const SwiperForm = Form.create()(Swiper);
export default SwiperForm;
