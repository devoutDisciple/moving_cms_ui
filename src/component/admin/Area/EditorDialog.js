import React from 'react';
import Request from '../../../request/AxiosRequest';
import { Form, Input, Modal, Select, message } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

class EditorDialog extends React.Component {
	constructor(props) {
		super(props);
	}

	state = {
		level: 1, // 默认新增省
		cityList: [], // 所有市
		proviceList: [], // 所有省
	};

	async componentDidMount() {
		let { editData } = this.props;
		await this.onSearchArea();
		this.setState({ level: editData.level });
		if (editData.level == 2) editData.province = editData.parentid;
		if (editData.level == 3) editData.city = editData.parentid;
		this.props.form.setFieldsValue(editData);
	}

	// 查询省市区
	async onSearchArea() {
		let value = this.props.form.getFieldsValue();
		let areas = await Request.get('/area/getAllByLevel', value);
		let areaList = areas.data || [],
			proviceList = [],
			cityList = [];
		areaList.map((item) => {
			item.key = item.id;
			if (item.level == 1) proviceList.push(item);
			if (item.level == 2) cityList.push(item);
		});
		this.setState({ proviceList, cityList });
	}

	async handleOk() {
		this.props.form.validateFields(async (err, values) => {
			try {
				if (err) return;
				let { level } = this.state,
					{ editData } = this.props;
				if (level === 1) values.parentid = 0;
				if (level === 2) values.parentid = values.province;
				if (level === 3) values.parentid = values.city;
				values.id = editData.id;
				let res = await Request.post('/area/update', values);
				if (res.data == 'success') {
					message.success('编辑成功');
					this.props.onControllerDialog();
					this.props.onSearch();
				}
			} catch (error) {
				console.log(error);
			}
		});
	}

	handleCancel() {
		this.props.onControllerDialog();
	}

	render() {
		const { getFieldDecorator } = this.props.form;
		const formItemLayout = {
				labelCol: { span: 4 },
				wrapperCol: { span: 20 },
			},
			{ level, proviceList, cityList } = this.state;
		return (
			<div>
				<Modal
					className="common_dialog common_max_dialog"
					title="新增区域"
					visible={true}
					onOk={this.handleOk.bind(this)}
					onCancel={this.handleCancel.bind(this)}
				>
					<Form {...formItemLayout} onSubmit={this.handleSubmit}>
						<FormItem label="区域级别">
							{getFieldDecorator('level', {
								rules: [
									{
										required: true,
										message: '请输入',
									},
								],
							})(
								<Select onSelect={(value) => this.setState({ level: value })} placeholder="请选择">
									<Option value={1}>省</Option>
									<Option value={2}>市</Option>
									<Option value={3}>县/区</Option>
								</Select>,
							)}
						</FormItem>
						{level == 2 && (
							<FormItem label="所属省">
								{getFieldDecorator('province', {
									rules: [
										{
											required: true,
											message: '请输入',
										},
									],
								})(
									<Select placeholder="请选择">
										{proviceList.map((item) => {
											return (
												<Option key={item.id} value={item.id}>
													{item.name}
												</Option>
											);
										})}
									</Select>,
								)}
							</FormItem>
						)}
						{level == 3 && (
							<FormItem label="所属市">
								{getFieldDecorator('city', {
									rules: [
										{
											required: true,
											message: '请输入',
										},
									],
								})(
									<Select placeholder="请选择">
										{cityList.map((item) => {
											return (
												<Option key={item.id} value={item.id}>
													{item.name}
												</Option>
											);
										})}
									</Select>,
								)}
							</FormItem>
						)}
						<FormItem label="区域名称">
							{getFieldDecorator('name', {
								rules: [
									{
										required: true,
										message: '请输入',
									},
								],
							})(<Input placeholder="请输入" maxLength={20} />)}
						</FormItem>
						{/* <FormItem label="是否运行">
							{getFieldDecorator('active', {
								rules: [
									{
										required: true,
										message: '请选择',
									},
								],
							})(
								<Select placeholder="请选择">
									<Option value={1}>是</Option>
									<Option value={2}>否</Option>
								</Select>,
							)}
						</FormItem> */}
						<FormItem label="权重">
							{getFieldDecorator('sort', {
								rules: [
									{
										required: true,
										message: '请输入',
									},
								],
							})(<Input type="number" placeholder="请输入数字(最小为1)" />)}
						</FormItem>
					</Form>
				</Modal>
			</div>
		);
	}
}

const EditorDialogForm = Form.create()(EditorDialog);
export default EditorDialogForm;
