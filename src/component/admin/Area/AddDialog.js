import React from 'react';
import moment from 'moment';
import Request from '../../../request/AxiosRequest';
import { Form, Input, Modal, Select, message } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

class AddDialog extends React.Component {
	constructor(props) {
		super(props);
	}

	state = {
		level: 1, // 默认新增省
		cityList: [], // 所有市
		proviceList: [], // 所有省
	};

	async componentDidMount() {
		await this.onSearchArea();
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
			console.log(values, 111);
			try {
				if (err) return;
				let { level } = this.state;
				console.log(level, 222);
				if (level === 1) values.parentid = 0;
				if (level === 2) values.parentid = values.province;
				if (level === 3) values.parentid = values.city;
				values.create_time = moment().format('YYYY-MM-DD HH:mm:ss');
				console.log(values, 333);
				let res = await Request.post('/area/add', values);
				if (res.data == 'success') {
					message.success('新增成功');
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

const AddDialogForm = Form.create()(AddDialog);
export default AddDialogForm;
