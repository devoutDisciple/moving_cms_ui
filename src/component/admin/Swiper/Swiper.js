import React from 'react';
import {inject, observer} from 'mobx-react';
import {
	Button, Table, Popconfirm, message
} from 'antd';
import AddDialog from './AddDialog';
import EditorDialog from './EditorDialog';
import Request from '../../../request/AxiosRequest';

@inject('SwiperStore')
@observer
export default class Swiper extends React.Component{

	constructor(props) {
		super(props);
		this.swiperStore = props.SwiperStore;
	}

	state = {
		dataSource: [],
		addDialogVisible: false,
		editorDialogVisible: false,
		editData: {}
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
		let result = await Request.post('/swiper/delete', {id: record.id});
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
		this.swiperStore.getSwiper();
	}

	render() {
		const swiperList = this.swiperStore.swiperList || [],
			{addDialogVisible, editorDialogVisible, editData} = this.state,
			columns = [
				{
					title: '校区',
					dataIndex: 'campus',
					key: 'campus',
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
					title: '关联类型',
					dataIndex: 'type',
					key: 'type',
					align: 'center',
					render:(text) => {
						if(text == 1) return <span>关联厨房</span>;
						if(text == 2) return <span>关联食品</span>;
						if(text == 3) return <span>暂无关联</span>;
					}
				},
				{
					title: '关联厨房',
					dataIndex: 'shopName',
					key: 'shopName',
					align: 'center',
				},
				{
					title: '关联食品',
					dataIndex: 'goodsName',
					key: 'goodsName',
					align: 'center'
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
							<Popconfirm placement="top" title="是否确认删除" onConfirm={this.onConfirmDelete.bind(this, record)} okText="确认" cancelText="取消">
								<a href="javascript:;" >删除</a>
     					</Popconfirm>
							<a href="javascript:;" onClick={this.onEditorCampus.bind(this, record)}>修改</a>
						</span>;
					}
				}
			];
		return (
			<div className='common'>
				<div className='common_search'>
					<Button type='primary' onClick={this.controllerAddDialog.bind(this)}>新增</Button>
				</div>
				<div className='common_content'>
					<Table
						bordered
						dataSource={swiperList}
						columns={columns}
						pagination={
							{
								total: swiperList.length,
								showTotal: (total) => `共 ${total} 条`
							}
						}/>
				</div>
				{
					addDialogVisible ?
						<AddDialog
							controllerAddDialog={this.controllerAddDialog.bind(this)}
							onSearch={this.onSearch.bind(this)}/>
						: null
				}
				{
					editorDialogVisible ?
						<EditorDialog
							onSearch={this.onSearch.bind(this)}
							controllerEditorDialog={this.controllerEditorDialog.bind(this)}
							editData={editData}/>
						: null
				}
			</div>
		);
	}
}
