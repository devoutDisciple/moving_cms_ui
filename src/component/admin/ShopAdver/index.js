import React from 'react';
import { Button, Table, Popconfirm, Select, Form, Col } from 'antd';
import AddDialog from './AddDialog';
import config from '../../../config/config';
import Request from '../../../request/AxiosRequest';
import './index.less';
const FormItem = Form.Item;
const { Option } = Select;

class Shop extends React.Component {
	constructor(props) {
		super(props);
		this.shopStore = props.ShopStore;
	}

	state = {
		addDialogVisible: false, // 新增弹框
		shopList: [], // 商店列表
		adverList: [], // 列表
	};

	componentDidMount() {
		this.onSearchShopList();
		this.onSearchShopAdverList();
	}

	// 搜索店铺列表
	async onSearchShopList() {
		let value = this.props.form.getFieldsValue();
		let shops = await Request.get('/shop/all', value);
		let shopList = shops.data || [];
		shopList.map((item) => {
			item.key = item.id;
		});
		console.log(shopList, 888);
		this.setState({ shopList });
	}

	// 查询广告图列表
	async onSearchShopAdverList() {
		let value = this.props.form.getFieldsValue();
		let advers = await Request.get('/shopAdver/list', value);
		this.setState({ adverList: advers.data || [] });
	}

	// 新增编辑框的显示
	controllerAddDialog() {
		this.setState({
			addDialogVisible: !this.state.addDialogVisible,
		});
	}

	// 确认删除
	async onConfirmDelete(record) {
		await Request.post('/shopAdver/delete', { id: record.id });
		this.onSearchShopAdverList();
	}

	render() {
		let { shopList, addDialogVisible, adverList } = this.state;
		const formItemLayout = {
				labelCol: { span: 8 },
				wrapperCol: { span: 16 },
			},
			{ getFieldDecorator } = this.props.form;
		const columns = [
			{
				title: '店铺名称',
				dataIndex: 'name',
				key: 'name',
				align: 'center',
				render: (txt, record) => <span>{shopList.filter((item) => item.id === record.shopid)[0]?.name}</span>,
			},
			{
				title: '权重',
				dataIndex: 'sort',
				key: 'sort',
				align: 'center',
			},
			{
				title: '广告图片',
				dataIndex: 'url',
				key: 'url',
				align: 'center',
				render: (txt, record) => (
					<img className="shop_adver_img" src={`${config.baseUrl}/adver/${record.url}`} />
				),
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
								<a>删除</a>
							</Popconfirm>
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
							<FormItem label="店铺名称">
								{getFieldDecorator('shopid', { initialValue: -1 })(
									<Select onSelect={() => {}} placeholder="请选择">
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
							<Button type="primary" onClick={this.onSearchShopAdverList.bind(this)}>
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
						rowKey="id"
						columns={columns}
						dataSource={adverList}
						pagination={{
							total: adverList.length || 0,
							showTotal: (total) => `共 ${total} 条`,
						}}
					/>
				</div>
				{addDialogVisible && (
					<AddDialog
						controllerDialog={this.controllerAddDialog.bind(this)}
						onSearch={this.onSearchShopAdverList.bind(this)}
					/>
				)}
			</div>
		);
	}
}

const ShopForm = Form.create()(Shop);
export default ShopForm;
