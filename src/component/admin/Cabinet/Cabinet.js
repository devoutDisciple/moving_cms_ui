import React from 'react';
import { inject, observer } from 'mobx-react';
import { Button, Table, Popconfirm, message, Form, Select, Col } from 'antd';
import AddDialog from './AddDialog';
import EditorDialog from './EditorDialog';
import config from '../../../config/config';
import Request from '../../../request/AxiosRequest';
import moment from 'moment';
const FormItem = Form.Item;
const { Option } = Select;

@inject('SwiperStore')
@observer
class Swiper extends React.Component {
	constructor(props) {
		super(props);
		this.onSearchShop = this.onSearchShop.bind(this);
		this.onSearchCabinet = this.onSearchCabinet.bind(this);
	}

	state = {
		shopid: '',
		shopList: [],
		editData: {},
		swiperList: [],
		addDialogVisible: false,
		editorDialogVisible: false,
	};

	async componentDidMount() {
		await this.onSearchShop();
		await this.onSearchCabinet();
	}

	// 查询快递柜
	async onSearchCabinet() {
		let values = this.props.form.getFieldsValue();
		if (!values.shopid) return;
		let swipers = await Request.get('/cabinet/getByShopId', values);
		let swiperList = swipers.data || [];
		await this.setState({ swiperList: swiperList });
	}

	// 查询商店
	async onSearchShop() {
		let resShop = await Request.get('/shop/all');
		let shops = resShop.data || [];
		let shopid = shops[0] ? shops[0].id : '';
		await this.setState({ shopList: shops, shopid });
		await this.props.form.setFieldsValue({ shopid: shops[0].id });
	}

	// 商店选择切换的时候
	onShopSelect(shopid) {
		this.setState({ shopid }, () => this.onSearchCabinet());
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
		let result = await Request.post('/cabinet/delete', { id: record.id });
		if (result.data == 'success') {
			message.success('删除成功');
			return this.onSearchCabinet();
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
			{ addDialogVisible, editorDialogVisible, swiperList, shopList, shopid, editData } = this.state,
			columns = [
				{
					title: '店铺',
					dataIndex: 'shopName',
					key: 'shopName',
					align: 'center',
				},
				{
					title: '首页展示图片',
					dataIndex: 'url',
					key: 'url',
					align: 'center',
					render: (text, record) => {
						return <img className="common_table_img" src={`${config.baseUrl}/${record.url}`} />;
					},
				},
				{
					title: '标题',
					dataIndex: 'name',
					key: 'name',
					align: 'center',
				},
				{
					title: '地址',
					dataIndex: 'address',
					key: 'address',
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
						dataSource={swiperList}
						columns={columns}
						pagination={{
							total: swiperList.length,
							showTotal: (total) => `共 ${total} 条`,
						}}
					/>
				</div>
				{addDialogVisible ? (
					<AddDialog
						shopid={shopid}
						controllerAddDialog={this.controllerAddDialog.bind(this)}
						onSearch={this.onSearchCabinet.bind(this)}
					/>
				) : null}
				{editorDialogVisible ? (
					<EditorDialog
						shopid={shopid}
						editData={editData}
						onSearch={this.onSearchCabinet.bind(this)}
						controllerEditorDialog={this.controllerEditorDialog.bind(this)}
					/>
				) : null}
			</div>
		);
	}
}

const SwiperForm = Form.create()(Swiper);
export default SwiperForm;
