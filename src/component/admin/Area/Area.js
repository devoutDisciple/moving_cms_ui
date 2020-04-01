import React from 'react';
import AddDialog from './AddDialog';
import EditorDialog from './EditorDialog';
import Request from '../../../request/AxiosRequest';
import FilterStatus from '../../../util/FilterStatus';
import { Button, Table, Popconfirm, message, Form, Col, Input } from 'antd';
import moment from 'moment';
const FormItem = Form.Item;

class Area extends React.Component {
	constructor(props) {
		super(props);
		this.expandRenderCity = this.expandRenderCity.bind(this);
	}

	state = {
		shopid: '',
		cityList: [], // 市列表
		areaList: [], // 全部区域
		countryList: [], // 县/区列表
		proviceList: [], // 省列表
		addDialogVisible: false,
		editorDialogVisible: false,
	};

	async componentDidMount() {
		await this.onSearch();
	}

	// 点击搜索
	async onSearch() {
		let value = this.props.form.getFieldsValue();
		let areas = await Request.get('/area/getAllByLevel', value);
		let areaList = areas.data || [],
			proviceList = [];
		areaList.map((item) => {
			item.key = item.id;
			if (item.level === 1) proviceList.push(item);
		});
		this.setState({ areaList, proviceList });
	}

	// 编辑框的显示
	controllerEditorDialog(record) {
		this.setState({
			editData: record,
			editorDialogVisible: !this.state.editorDialogVisible,
		});
	}

	// 确认删除
	async onConfirmDelete(record) {
		let result = await Request.post('/area/delete', { id: record.id });
		if (result.data == 'success') {
			message.success('删除成功');
			return this.onSearch();
		}
	}

	// 固定的表头
	renderCoulmns() {
		const columns = [
			{
				title: '区域id',
				dataIndex: 'id',
				key: 'id',
				align: 'center',
			},
			{
				title: '区域名称',
				dataIndex: 'name',
				key: 'name',
				align: 'center',
			},
			{
				title: '区域等级',
				dataIndex: 'level',
				key: 'level',
				align: 'center',
				render: (text) => {
					return <span>{FilterStatus.filterAreaStatus(text)}</span>;
				},
			},
			{
				title: '权重',
				dataIndex: 'sort',
				key: 'sort',
				align: 'center',
			},
			// {
			// 	title: '是否运行',
			// 	dataIndex: 'active',
			// 	key: 'active',
			// 	align: 'center',
			// 	render: (text) => {
			// 		return (
			// 			<Badge
			// 				status={text == 1 ? 'success' : 'warning'}
			// 				text={FilterStatus.filterActiveStatus(text)}
			// 			/>
			// 		);
			// 	},
			// },
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
				title: '操作',
				dataIndex: 'operation',
				key: 'operation',
				align: 'center',
				render: (text, record) => {
					return (
						<span className="common_table_span">
							<a href="javascript:;" onClick={this.controllerEditorDialog.bind(this, record)}>
								修改
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
						</span>
					);
				},
			},
		];
		return columns;
	}

	// 展开所有县城
	expandRenderCounty(record) {
		const columns = this.renderCoulmns(),
			{ areaList } = this.state,
			list = [];
		areaList.forEach((item) => {
			if (item.parentid == record.id && item.level == 3) list.push(item);
		});
		return <Table columns={columns} dataSource={list} pagination={false} />;
	}

	// 展开所有市区
	expandRenderCity(record) {
		const columns = this.renderCoulmns(),
			{ areaList } = this.state,
			list = [];
		areaList.forEach((item) => {
			if (item.parentid == record.id && item.level == 2) list.push(item);
		});
		return (
			<Table
				columns={columns}
				dataSource={list}
				pagination={false}
				expandedRowRender={(record) => this.expandRenderCounty(record)}
			/>
		);
	}

	render() {
		const columns = this.renderCoulmns(),
			{ proviceList, addDialogVisible, editorDialogVisible, editData } = this.state,
			formItemLayout = {
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
							<Button type="primary" onClick={() => this.setState({ addDialogVisible: true })}>
								新增
							</Button>
						</Col>
					</Form>
				</div>
				<div className="common_content">
					<Table
						bordered
						columns={columns}
						dataSource={proviceList}
						expandedRowRender={(record) => this.expandRenderCity(record)}
						pagination={{
							total: proviceList.length || 0,
							showTotal: (total) => `共 ${total} 条`,
						}}
					/>
				</div>
				{addDialogVisible && (
					<AddDialog
						onSearch={this.onSearch.bind(this)}
						onControllerDialog={() => this.setState({ addDialogVisible: false })}
					/>
				)}
				{editorDialogVisible && (
					<EditorDialog
						editData={editData}
						onSearch={this.onSearch.bind(this)}
						onControllerDialog={() => this.setState({ editorDialogVisible: false })}
					/>
				)}
			</div>
		);
	}
}

const AreaForm = Form.create()(Area);
export default AreaForm;
