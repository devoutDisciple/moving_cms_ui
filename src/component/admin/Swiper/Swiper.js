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
		this.onSearchSwiper = this.onSearchSwiper.bind(this);
		this.onSearchShop = this.onSearchShop.bind(this);
	}

	state = {
		swiperList: [],
		shopList: [],
		addDialogVisible: false,
		editorDialogVisible: false,
		editData: {},
	};

	async componentDidMount() {
		await this.onSearchShop();
		await this.onSearchSwiper();
	}

	// 点击搜索轮播图
	async onSearchSwiper() {
		let values = this.props.form.getFieldsValue();
		let swipers = await Request.get('/swiper/getByShopId', values);
		let swiperList = swipers.data || [];
		this.setState({ swiperList: swiperList });
	}

	// 查询商店轮
	async onSearchShop() {
		let resShop = await Request.get('/shop/all');
		let shops = resShop.data || [];
		await this.setState({ shopList: shops });
		this.props.form.setFieldsValue({ shopid: shops[0].id });
	}

	// 新增编辑框的显示
	controllerAddDialog() {
		this.setState({
			addDialogVisible: !this.state.addDialogVisible,
		});
	}
	// 编辑框的显示
	controllerEditorDialog() {
		this.setState({
			editorDialogVisible: !this.state.editorDialogVisible,
		});
	}

	// 确认删除
	async onConfirmDelete(record) {
		let result = await Request.post('/swiper/delete', { id: record.id });
		if (result.data == 'success') {
			message.success('删除成功');
			return this.onSearchSwiper();
		}
	}

	// 点击修改
	onEditorCampus(record) {
		this.setState({ editData: record }, () => {
			this.controllerEditorDialog();
		});
	}

	render() {
		const { getFieldDecorator } = this.props.form,
			formItemLayout = {
				labelCol: { span: 4 },
				wrapperCol: { span: 20 },
			},
			{ addDialogVisible, editorDialogVisible, editData, swiperList, shopList } = this.state,
			columns = [
				{
					title: '店铺',
					dataIndex: 'shopName',
					key: 'shopName',
					align: 'center',
				},
				{
					title: '图片',
					dataIndex: 'url',
					key: 'url',
					align: 'center',
					render: (text, record) => {
						return <img className="common_table_img" src={`${config.baseUrl}/${record.url}`} />;
					},
				},
				{
					title: '创建日期',
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
							<FormItem label="关联设置">
								{getFieldDecorator('shopid')(
									<Select placeholder="请选择">
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
							<Button type="primary" onClick={this.onSearchSwiper.bind(this)}>
								查询
							</Button>
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
						controllerAddDialog={this.controllerAddDialog.bind(this)}
						onSearch={this.onSearchSwiper.bind(this)}
					/>
				) : null}
				{editorDialogVisible ? (
					<EditorDialog
						onSearch={this.onSearchSwiper.bind(this)}
						controllerEditorDialog={this.controllerEditorDialog.bind(this)}
						editData={editData}
					/>
				) : null}
			</div>
		);
	}
}

const SwiperForm = Form.create()(Swiper);
export default SwiperForm;
