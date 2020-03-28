import React from 'react';
import {inject, observer} from 'mobx-react';
import {
	Button, Table, Popconfirm, message, Tooltip, Form, Col, Input
} from 'antd';
const FormItem = Form.Item;
import Request from '../../../request/AxiosRequest';
import AddDialog from './AddDialog';
import EditorDialog from './EditorDialog';
import './index.less';

@inject('GoodsStore')
@observer
class Goods extends React.Component{

	constructor(props) {
		super(props);
		this.goodsStore = props.GoodsStore;
	}

	state = {
		addDialogVisible: false,
		editorDialogVisible: false,
		editData: {},
		goodsList: [],
	}

	async componentDidMount() {
		// 查询厨房
		await this.onSearchGoods();
	}

	// 查询菜品
	async onSearchGoods() {
		let value = this.props.form.getFieldsValue();
		let result = await Request.get('/goods/getAllGoodsByName');
		let data = result.data || [];
		let list = [];
		data.map(item => {
			item.key = item.id;
			if(!value.name) return list.push(item);
			if(item.shopName.includes(value.name)) {
				list.push(item);
			}
		});
		this.setState({
			goodsList: list
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


	// 修改今日推荐
	async onRecommend(data, type) {
		let result = await Request.get('/goods/updateToday', {id: data.id, type});
		if(result.data == 'success') {
			message.success('修改成功');
			return this.onSearchGoods();
		}
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
				title: '厨房名称',
				dataIndex: 'shopName',
				key: 'shopName',
				align: 'center'
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
							record.today == 2 ?
								<a href="javascript:;" onClick={this.onRecommend.bind(this, record, 1)}>今日推荐</a>
								:
								<a href="javascript:;" onClick={this.onRecommend.bind(this, record, 2)}>取消推荐</a>
						}

						<Popconfirm placement="top" title="是否确认删除" onConfirm={this.onConfirmDelete.bind(this, record)} okText="确认" cancelText="取消">
							<a href="javascript:;" >删除</a>
     					</Popconfirm>
					</span>;
				}
			}
		];
		const { getFieldDecorator } = this.props.form;
		const formItemLayout = {
			labelCol: { span: 8 },
			wrapperCol: { span: 16 },
		};
		let {addDialogVisible, editorDialogVisible, editData, goodsList} = this.state;
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
							onSearch={this.onSearchGoods.bind(this)}
							controllerAddDialog={this.controllerAddDialog.bind(this)}/>
						: null
				}
				{
					editorDialogVisible ?
						<EditorDialog
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
