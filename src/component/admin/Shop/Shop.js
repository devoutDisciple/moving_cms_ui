import React from 'react';
import {inject, observer} from 'mobx-react';
import {
	Button, Table, Popconfirm, message, Tooltip, Form, Col, Input
} from 'antd';
import AddDialog from './AddDialog';
import UserDialog from './UserDialog';
import EditorDialog from './EditorDialog';
import Request from '../../../request/AxiosRequest';
import DataDialog from './DataDialog';
const FormItem = Form.Item;

@inject('ShopStore')
@observer
class Shop extends React.Component{

	constructor(props) {
		super(props);
		this.shopStore = props.ShopStore;
	}

	state = {
		addDialogVisible: false,
		editorDialogVisible: false,
		editData: {},
		dataDialogVisible: false,
		shopid: '',
		accountData: {},
		accountVisible: false
	}

	componentDidMount() {
		this.onSearch();
	}

	// 新增编辑框的显示
	controllerAddDialog() {
		this.setState({
			addDialogVisible: !this.state.addDialogVisible
		});
	}

	// 编辑框的显示
	controllerEditorDialog() {
		this.setState({
			editorDialogVisible: !this.state.editorDialogVisible
		});
	}

	// 确认删除
	async onConfirmDelete(record) {
		let result = await Request.post('/shop/delete', {id: record.id});
		if(result.data == 'success') {
			message.success('删除成功');
			return this.onSearch();
		}
	}

	// 点击修改
	onEditorCampus(record) {
		this.setState({
			editData: record
		}, () => {
			this.controllerEditorDialog();
		});
	}

	// 点击搜索
	onSearch() {
		let value = this.props.form.getFieldsValue();
		this.shopStore.getAll(value);
	}

	// 确认关店或者开店
	async onConfirmCloseOrOpen(record, status) {
		let res = await this.shopStore.closeOrOpen({id: record.id, status});
		if(res.data == 'success') {
			if(status == 1) message.success('开启成功');
			else message.success('关店成功');
			this.onSearch();
		}
	}

	getMore(record) {
		this.setState({
			shopid: record.id
		}, () => {
			this.onControllerDataVisible();
		});
	}

	// 查看更多 查看厨房报表数据
	onControllerDataVisible() {
		this.setState({
			dataDialogVisible: !this.state.dataDialogVisible
		});
	}

	// 修改账户
	modifyAccount(record) {
		this.setState({
			shopid: record.id
		}, () => {
			this.onControllerAccountDialog();
		});
	}

	// 控制修改账号密码
	onControllerAccountDialog() {
		this.setState({accountVisible: !this.state.accountVisible});
	}


	render() {
		const columns = [
			{
				title: '名称',
				dataIndex: 'name',
				key: 'name',
				align: 'center'
			},
			{
				title: '销售量',
				dataIndex: 'sales',
				key: 'sales',
				align: 'center'
			},
			{
				title: '起送价格',
				dataIndex: 'start_price',
				key: 'start_price',
				align: 'center'
			},
			{
				title: '配送费',
				dataIndex: 'send_price',
				key: 'send_price',
				align: 'center'
			},
			{
				title: '开店时间',
				dataIndex: 'start_time',
				key: 'start_time',
				align: 'center'
			},
			{
				title: '关店时间',
				dataIndex: 'end_time',
				key: 'end_time',
				align: 'center'
			},
			{
				title: '地址',
				dataIndex: 'address',
				key: 'address',
				align: 'center',
				render:(text, record) => {
					return <Tooltip placement="top" title={record.address}>
						<span className='common_table_ellipse'>{record.address}</span>
					   </Tooltip>;
				}
			},
			{
				title: '电话',
				dataIndex: 'phone',
				key: 'phone',
				align: 'center'
			},
			{
				title: '营收情况',
				dataIndex: 'win',
				key: 'win',
				align: 'center',
				render:() => {
					return <span>暂无</span>;
				}
			},
			{
				title: '厨房状态',
				dataIndex: 'status',
				key: 'status',
				align: 'center',
				render:(text, record) => {
					if(record.status == 1) return <span className='common_cell_green'>开启</span>;
					return <span className='common_cell_red'>关闭</span>;
				}
			},
			{
				title: '权重',
				dataIndex: 'sort',
				key: 'sort',
				align: 'center'
			},
			{
				title: '操作',
				dataIndex: 'operation',
				key: 'operation',
				align: 'center',
				render:(text, record) => {
					return <span className="common_table_span">
						<a href="javascript:;" onClick={this.onEditorCampus.bind(this, record)}>修改</a>
						{
							record.status == 1 ?
								<Popconfirm placement="top" title="是否确认关店" onConfirm={this.onConfirmCloseOrOpen.bind(this, record, 2)} okText="确认" cancelText="取消">
									<a href="javascript:;" >关店</a>
     							</Popconfirm>
						 :
						 		<Popconfirm placement="top" title="是否确认开店" onConfirm={this.onConfirmCloseOrOpen.bind(this, record, 1)} okText="确认" cancelText="取消">
									<a href="javascript:;" >开店</a>
     							</Popconfirm>
						}

						<Popconfirm placement="top" title="是否确认删除" onConfirm={this.onConfirmDelete.bind(this, record)} okText="确认" cancelText="取消">
							<a href="javascript:;" >删除</a>
     					</Popconfirm>
						 <a href="javascript:;" onClick={this.modifyAccount.bind(this, record)}>修改账户</a>
						<a href="javascript:;" onClick={this.getMore.bind(this, record)}>更多</a>
					</span>;
				}
			}
		];
		let {list} = this.shopStore,
			{addDialogVisible, editorDialogVisible, editData, shopid, dataDialogVisible, accountVisible} = this.state;
		const formItemLayout = {
				labelCol: { span: 8 },
				wrapperCol: { span: 16 },
			}, { getFieldDecorator } = this.props.form;
		return (
			<div className='common'>
				<div className='common_search'>
					<Form className="common_search_form" {...formItemLayout}>
						<Col span={6}>
							<FormItem
								label="厨房名称">
								{getFieldDecorator('name')(
									<Input placeholder="请输入厨房名称" />
								)}
							</FormItem>
						</Col>
						<Col span={6} offset={1}>
							<Button type='primary' onClick={this.onSearch.bind(this)}>查询</Button>
							<Button type='primary' onClick={this.controllerAddDialog.bind(this)}>新增</Button>
						</Col>
					</Form>
				</div>
				<div className='common_content'>
					<Table
						bordered
						dataSource={list}
						columns={columns}
						pagination={
							{
								total: list.length || 0,
								showTotal: (total) => `共 ${total} 条`
							}
						}/>
				</div>
				{
					addDialogVisible ?
						<AddDialog
							onSearch={this.onSearch.bind(this)}
							controllerAddDialog={this.controllerAddDialog.bind(this)}/>
						: null
				}
				{
					accountVisible ?
						<UserDialog
							shopid={shopid}
							onSearch={this.onSearch.bind(this)}
							onControllerAccountDialog={this.onControllerAccountDialog.bind(this)}/>
						: null
				}
				{
					editorDialogVisible ?
						<EditorDialog
							editData={editData}
							onSearch={this.onSearch.bind(this)}
							controllerEditorDialog={this.controllerEditorDialog.bind(this)}/>
						: null
				}
				{
					dataDialogVisible ?
						<DataDialog
							shopid={shopid}
							onControllerDataVisible={this.onControllerDataVisible.bind(this)}/>
						: null
				}
			</div>
		);
	}
}

const ShopForm = Form.create()(Shop);
export default ShopForm;
