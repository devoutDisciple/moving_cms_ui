import React from 'react';
import {inject, observer} from 'mobx-react';
import {
	Table, Popconfirm, message, Tooltip, Form, Button, Col, Input
} from 'antd';
import Request from '../../../request/AxiosRequest';
import AddDialog from './AddDialog';
import EditorDialog from './EditorDialog';
import './index.less';
import request from '../../../request/AxiosRequest';
const FormItem = Form.Item;

@inject('GlobalStore')
@observer
class Goods extends React.Component{

	constructor(props) {
		super(props);
		this.globalStore = this.props.GlobalStore;
	}

	state = {
		addDialogVisible: false,
		editorDialogVisible: false,
		editData: {},
		goodsList: []
	}

	async componentDidMount() {
		await this.onSearchGoods();
	}

	// 查询菜品
	async onSearchGoods() {
		let value = this.props.form.getFieldsValue();
		let params = {};
		params.id = this.globalStore.userinfo.shopid;
		value.name ? params.name = value.name : null;
		let res = await request.get('/goods/getByShopId', params);
		let data = res.data || [];
		data.map((item, index) => {
			item.key = index;
		});
		this.setState({
			goodsList: data
		});
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
		let result = await Request.post('/goods/delete', {id: record.id});
		if(result.data == 'success') {
			message.success('删除成功');
			return this.onSearchGoods();
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

	// 商品上下架
	async onControllerShow(data) {
		let result = await Request.post('/goods/updateShow', {show: data.show == 1 ? 2 : 1, id: data.id});
		if(result.data == 'success') {
			message.success('修改成功');
			return this.onSearchGoods();
		}
	}

	// 商品是否售罄 onControllerLeave
	async onControllerLeave(data) {
		let result = await Request.post('/goods/updateLeave', {leave: data.leave == 1 ? 2 : 1, id: data.id});
		if(result.data == 'success') {
			message.success('修改成功');
			return this.onSearchGoods();
		}
	}

	// 厨房选择的时候
	selectChange(id) {
		this.setState({
			shopid: id
		}, async () => {
			await this.onSearchGoods();
		});
	}

	render() {
		const columns = [
			{
				title: '名称',
				dataIndex: 'name',
				key: 'name',
				align: 'center',
				render:(text, record) => {
					return <Tooltip placement="top" title={record.name}>
						<span className='common_table_ellipse'>{record.name}</span>
					   </Tooltip>;
				}
			},
			{
				title: '图片',
				dataIndex: 'url',
				key: 'url',
				align: 'center',
				render:(text, record) => {
					return <img className='common_table_img' src={record.url}/>;
				}
			},
			{
				title: '销售量',
				dataIndex: 'sales',
				key: 'sales',
				align: 'center'
			},
			{
				title: '描述',
				dataIndex: 'title',
				key: 'title',
				align: 'center',
				render:(text, record) => {
					return <Tooltip placement="top" title={record.title}>
						<span className='common_table_ellipse'>{record.title}</span>
					   </Tooltip>;
				}
			},
			{
				title: '价格(元)',
				dataIndex: 'price',
				key: 'price',
				align: 'center'
			},
			{
				title: '餐盒费',
				dataIndex: 'package_cost',
				key: 'package_cost',
				align: 'center'
			},
			{
				title: '今日推荐',
				dataIndex: 'today',
				key: 'today',
				align: 'center',
				render:(text, record) => {
					if(record.today == 1) return <span className='common_cell_green'>是</span>;
					return <span className='common_cell_red'>否</span>;
				}
			},
			{
				title: '商品上下架',
				dataIndex: 'show',
				key: 'show',
				align: 'center',
				render:(text, record) => {
					if(record.show == 1) return <span className='common_cell_green'>上架</span>;
					return <span className='common_cell_red'>下架</span>;
				}
			},
			{
				title: '是否售罄',
				dataIndex: 'leave',
				key: 'leave',
				align: 'center',
				render:(text, record) => {
					if(record.leave == 1) return <span className='common_cell_green'>有余货</span>;
					return <span className='common_cell_red'>已售罄</span>;
				}
			},
			{
				title: '操作',
				dataIndex: 'operation',
				key: 'operation',
				align: 'center',
				render:(text, record) => {
					return <span className="common_table_span">
						<a href="javascript:;" onClick={this.onEditorCampus.bind(this, record)}>修改</a>
						<Popconfirm placement="top" title="是否确认" onConfirm={this.onControllerShow.bind(this, record)} okText="确认" cancelText="取消">
							<a href="javascript:;" >{record.show == 1 ? '下架' : '上架'}</a>
     					</Popconfirm>
						 <Popconfirm placement="top" title="是否确认" onConfirm={this.onControllerLeave.bind(this, record)} okText="确认" cancelText="取消">
							<a href="javascript:;" >{record.leave == 1 ? '已售罄' : '有余货'}</a>
     					</Popconfirm>
						<Popconfirm placement="top" title="是否确认删除" onConfirm={this.onConfirmDelete.bind(this, record)} okText="确认" cancelText="取消">
							<a href="javascript:;" >删除</a>
     					</Popconfirm>
					</span>;
				}
			}
		];
		let {goodsList} = this.state;
		let {addDialogVisible, editorDialogVisible, editData} = this.state;
		let shopid = this.globalStore.userinfo.shopid;
		const formItemLayout = {
				labelCol: { span: 8 },
				wrapperCol: { span: 16 },
			}, { getFieldDecorator } = this.props.form;
		return (
			<div className='common'>
				{/* <div className='common_search'>
					<Col span={6} offset={1}>
						<Button className='goods_search_btn' type='primary' onClick={this.controllerAddDialog.bind(this)}>新增</Button>
					</Col>
				</div> */}
				<div className='common_search'>
					<Form className="common_search_form" {...formItemLayout}>
						<Col span={6}>
							<FormItem
								label="菜品名称">
								{getFieldDecorator('name')(
									<Input placeholder="请输入菜品名称" />
								)}
							</FormItem>
						</Col>
						<Col span={6} offset={1}>
							<Button type='primary' onClick={this.onSearchGoods.bind(this)}>查询</Button>
							<Button className='goods_search_btn' type='primary' onClick={this.controllerAddDialog.bind(this)}>新增</Button>
						</Col>
					</Form>
				</div>
				<div className='common_content'>
					<Table
						bordered
						dataSource={goodsList}
						columns={columns}
						pagination={
							{
								total: goodsList.length || 0,
								showTotal: (total) => `共 ${total} 条`
							}
						}/>
				</div>
				{
					addDialogVisible ?
						<AddDialog
							shopid={shopid}
							onSearch={this.onSearchGoods.bind(this)}
							controllerAddDialog={this.controllerAddDialog.bind(this)}/>
						: null
				}
				{
					editorDialogVisible ?
						<EditorDialog
							shopid={shopid}
							data={editData}
							onSearch={this.onSearchGoods.bind(this)}
							controllerEditorDialog={this.controllerEditorDialog.bind(this)}/>
						: null
				}
			</div>
		);
	}
}

const GoodsForm = Form.create()(Goods);
export default GoodsForm;
