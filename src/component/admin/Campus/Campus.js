import React from 'react';
import { inject, observer } from 'mobx-react';
import { Form, Input, Col, Button, Table, Popconfirm, message } from 'antd';
const FormItem = Form.Item;
import AddDialog from './AddDialog';
import EditorDialog from './EditorDialog';
import Request from '../../../request/AxiosRequest';
import MapDialog from './MapDialog';

@inject('CampusStore')
@observer
class Campus extends React.Component {
	constructor(props) {
		super(props);
		this.campusStore = props.CampusStore;
	}

	state = {
		dataSource: [],
		addDialogVisible: false,
		editorDialogVisible: false,
		editData: {},
		mapDialogVisible: false,
		mapData: {}, // 地图数据
	};

	componentDidMount() {
		this.onSearch();
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
		let result = await Request.post('/position/delete', { id: record.id, name: record.name });
		if (result.data == 'success') {
			message.success('删除成功');
			return this.onSearch();
		}
	}

	// 点击修改
	onEditorCampus(record) {
		this.setState(
			{
				editData: record,
			},
			() => {
				this.controllerEditorDialog();
			},
		);
	}

	// 点击搜索
	async onSearch() {
		let values = this.props.form.getFieldsValue();
		await this.campusStore.getCampus(values);
	}

	// 点击标记的时候
	onSignClick(record) {
		this.setState({ mapData: record }, () => this.onControllerMapDialog());
	}

	// 控制地图显示的开关
	onControllerMapDialog() {
		this.setState({ mapDialogVisible: !this.state.mapDialogVisible }, () => this.onSearch());
	}

	render() {
		const formItemLayout = {
				labelCol: { span: 8 },
				wrapperCol: { span: 16 },
			},
			campusList = this.campusStore.campus,
			{ addDialogVisible, editorDialogVisible, editData, mapDialogVisible, mapData } = this.state,
			{ getFieldDecorator } = this.props.form,
			columns = [
				{
					title: '区域',
					dataIndex: 'name',
					key: 'name',
					align: 'center',
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
					/*eslint-disable*/
					return <span className="common_table_span">
						<Popconfirm placement="top" title="是否确认删除" onConfirm={this.onConfirmDelete.bind(this, record)} okText="确认" cancelText="取消">
							<a href="javascript:;" target="_blank">删除</a>
     					</Popconfirm>
						<a href="javascript:;" onClick={this.onEditorCampus.bind(this, record)}>修改</a>
						<a href="javascript:;" onClick={this.onSignClick.bind(this, record)}>标记</a>
					</span>;
				}
			}
		];
		return (
			<div className='common'>
				<div className='common_search'>
					<Form className="common_search_form" {...formItemLayout}>
						<Col span={6}>
							<FormItem
								label="区域名称">
								{getFieldDecorator('name')(
									<Input placeholder="请输入区域名称" />
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
						dataSource={campusList}
						columns={columns}
						pagination={
							{
								total: campusList.length,
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
				{
					mapDialogVisible ?
					<MapDialog data={mapData} onControllerMapDialog={this.onControllerMapDialog.bind(this)}/>
					: null
				}
			</div>
		);
	}
}

const CampusForm = Form.create()(Campus);
export default CampusForm;
