import React from 'react';
import Request from '../../../request/AxiosRequest';
import { Form, Input, Modal, Select, message } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

class AddDialog extends React.Component {
	constructor(props) {
		super(props);
	}

	state = {
		shopList: [], //所有商店
		roleList: [
			{ role: 2, label: '店长' },
			{ role: 3, label: '店员' },
		],
	};

	async componentDidMount() {
		await this.onSearchShop();
	}

	// 查询商店
	async onSearchShop() {
		let resShop = await Request.get('/shop/all');
		let shops = resShop.data || [];
		await this.setState({ shopList: shops });
	}

	async handleOk() {
		this.props.form.validateFields(async (err, values) => {
			try {
				if (err) return;
				if (!/^1[3456789]\d{9}$/.test(values.phone)) {
					return message.warning('请输入正确的手机号码');
				}
				let res = await Request.post('/account/addAccount', values);
				if (res.data === 'success') {
					message.success('新增成功');
					this.props.onSearch();
					this.props.controllerAddDialog();
				}
				console.log(values, 111);
			} catch (error) {
				console.log(error);
			}
		});
	}

	handleCancel() {
		this.props.controllerAddDialog();
	}

	render() {
		const { getFieldDecorator } = this.props.form,
			formItemLayout = {
				labelCol: { span: 4 },
				wrapperCol: { span: 20 },
			},
			{ shopList, roleList } = this.state;
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
						<FormItem label="角色">
							{getFieldDecorator('role', {
								rules: [
									{
										required: true,
										message: '请选择',
									},
								],
							})(
								<Select placeholder="请选择">
									{roleList.map((item, index) => (
										<Option key={index} value={item.role}>
											{item.label}
										</Option>
									))}
								</Select>,
							)}
						</FormItem>
						<FormItem label="所属店铺">
							{getFieldDecorator('shopid', {
								rules: [
									{
										required: true,
										message: '请输入',
									},
								],
							})(
								<Select placeholder="请选择">
									{shopList.map((item, index) => (
										<Option key={index} value={item.id}>
											{item.name}
										</Option>
									))}
								</Select>,
							)}
						</FormItem>
						<FormItem label="用户名称">
							{getFieldDecorator('name', {
								rules: [
									{
										required: true,
										message: '请输入',
									},
								],
							})(<Input placeholder="请输入" maxLength={20} />)}
						</FormItem>
						<FormItem label="手机号">
							{getFieldDecorator('phone', {
								rules: [
									{
										required: true,
										message: '请输入',
									},
								],
							})(<Input placeholder="请输入" maxLength={20} />)}
						</FormItem>
						<FormItem label="登录账户">
							{getFieldDecorator('username', {
								rules: [
									{
										required: true,
										message: '请输入',
									},
								],
							})(<Input placeholder="请输入" maxLength={20} />)}
						</FormItem>
						<FormItem label="登录密码">
							{getFieldDecorator('password', {
								rules: [
									{
										required: true,
										message: '请输入',
									},
								],
							})(<Input maxLength={20} placeholder="请输入" />)}
						</FormItem>
					</Form>
				</Modal>
			</div>
		);
	}
}

const AddDialogForm = Form.create()(AddDialog);
export default AddDialogForm;
