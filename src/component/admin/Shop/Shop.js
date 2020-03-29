import React from 'react';
import { inject, observer } from 'mobx-react';
import { Button, Table, Popconfirm, message, Tooltip, Form, Col, Input } from 'antd';
import AddDialog from './AddDialog';
import MapDialog from './MapDialog';
import UserDialog from './UserDialog';
import EditorDialog from './EditorDialog';
import DataDialog from './DataDialog';
import Request from '../../../request/AxiosRequest';
const FormItem = Form.Item;

@inject('ShopStore')
@observer
class Shop extends React.Component {
	constructor(props) {
		super(props);
		this.shopStore = props.ShopStore;
	}

	state = {
		addressDialogVisible: false, // 位置信息弹框
		addDialogVisible: true,
		editorDialogVisible: false,
		editData: {},
		dataDialogVisible: false,
		shopid: '',
		accountData: {},
		accountVisible: false,
	};

	componentDidMount() {
		this.onSearch();
	}

	// 点击搜索
	onSearch() {
		let value = this.props.form.getFieldsValue();
		this.shopStore.getAll(value);
	}

	// 新增编辑框的显示
	controllerAddDialog() {
		this.setState({
			addDialogVisible: !this.state.addDialogVisible,
		});
	}

	// 编辑框的显示
	controllerEditorDialog() {
		this.setState({ editorDialogVisible: !this.state.editorDialogVisible });
	}

	// 确认删除
	async onConfirmDelete(record) {
		let result = await Request.post('/shop/delete', { shopid: record.id });
		if (result.data == 'success') {
			message.success('删除成功');
			return this.onSearch();
		}
	}

	// 点击修改
	onEditorCampus(record) {
		this.setState({ editData: record }, () => {
			this.controllerEditorDialog();
		});
	}

	// 确认关店或者开店
	async onConfirmCloseOrOpen(record, status) {
		let res = await this.shopStore.closeOrOpen({ id: record.id, status });
		if (res.data == 'success') {
			if (status == 1) message.success('开启成功');
			else message.success('关店成功');
			this.onSearch();
		}
	}

	getMore(record) {
		this.setState({ shopid: record.id }, () => {
			this.onControllerDataVisible();
		});
	}

	// 查看更多 查看厨房报表数据
	onControllerDataVisible() {
		this.setState({
			dataDialogVisible: !this.state.dataDialogVisible,
		});
	}

	// 修改账户
	modifyAccount(record) {
		this.setState({ shopid: record.id }, () => {
			this.onControllerAccountDialog();
		});
	}

	// 控制修改账号密码
	onControllerAccountDialog() {
		this.setState({ accountVisible: !this.state.accountVisible });
	}

	// 录入店铺位置
	controllerMapDialogVisible(record) {
		this.setState({
			shopid: record.id,
			addressDialogVisible: !this.state.addressDialogVisible,
		});
	}

	render() {
		const columns = [
			{
				title: '店铺名称',
				dataIndex: 'name',
				key: 'name',
				align: 'center',
			},
			{
				title: '店铺经理',
				dataIndex: 'manager',
				key: 'manager',
				align: 'center',
			},
			{
				title: '电话',
				dataIndex: 'phone',
				key: 'phone',
				align: 'center',
			},
			{
				title: '地址',
				dataIndex: 'address',
				key: 'address',
				align: 'center',
				render: (text, record) => {
					return (
						<Tooltip placement="top" title={record.address}>
							<span className="common_table_ellipse">{record.address}</span>
						</Tooltip>
					);
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
							<a href="javascript:;" onClick={this.onEditorCampus.bind(this, record)}>
								修改
							</a>
							<a href="javascript:;" onClick={this.controllerMapDialogVisible.bind(this, record)}>
								位置录入
							</a>
							<Popconfirm
								placement="top"
								title="是否确认删除"
								onConfirm={this.onConfirmDelete.bind(this, record)}
								okText="确认"
								cancelText="取消"
							>
								<a href="javascript:;">删除</a>
							</Popconfirm>
							<a href="javascript:;" onClick={this.modifyAccount.bind(this, record)}>
								修改账户
							</a>
							<a href="javascript:;" onClick={this.getMore.bind(this, record)}>
								更多
							</a>
						</span>
					);
				},
			},
		];
		let { list } = this.shopStore,
			{
				addressDialogVisible,
				addDialogVisible,
				editorDialogVisible,
				editData,
				shopid,
				dataDialogVisible,
				accountVisible,
			} = this.state;
		const formItemLayout = {
				labelCol: { span: 8 },
				wrapperCol: { span: 16 },
			},
			{ getFieldDecorator } = this.props.form;
		return (
			<div className="common">
				<div className="common_search">
					<Form className="common_search_form" {...formItemLayout}>
						<Col span={6}>
							<FormItem label="店铺名称">
								{getFieldDecorator('name')(<Input placeholder="店铺名称模糊搜索" />)}
							</FormItem>
						</Col>
						<Col span={6} offset={1}>
							<Button type="primary" onClick={this.onSearch.bind(this)}>
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
						dataSource={list}
						columns={columns}
						pagination={{
							total: list.length || 0,
							showTotal: (total) => `共 ${total} 条`,
						}}
					/>
				</div>
				{addDialogVisible && (
					<AddDialog
						onSearch={this.onSearch.bind(this)}
						controllerAddDialog={this.controllerAddDialog.bind(this)}
					/>
				)}
				{accountVisible && (
					<UserDialog
						shopid={shopid}
						onSearch={this.onSearch.bind(this)}
						onControllerAccountDialog={this.onControllerAccountDialog.bind(this)}
					/>
				)}
				{editorDialogVisible && (
					<EditorDialog
						editData={editData}
						onSearch={this.onSearch.bind(this)}
						controllerEditorDialog={this.controllerEditorDialog.bind(this)}
					/>
				)}
				{dataDialogVisible && (
					<DataDialog shopid={shopid} onControllerDataVisible={this.onControllerDataVisible.bind(this)} />
				)}
				{addressDialogVisible && (
					<MapDialog
						shopid={shopid}
						onSearch={this.onSearch.bind(this)}
						onControllerMapDialog={() => this.setState({ addressDialogVisible: false })}
					/>
				)}
			</div>
		);
	}
}

const ShopForm = Form.create()(Shop);
export default ShopForm;
