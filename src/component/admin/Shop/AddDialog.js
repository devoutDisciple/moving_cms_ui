import React from 'react';
import { Form, Input, Modal } from 'antd';
import { inject, observer } from 'mobx-react';
import request from '../../../request/AxiosRequest';
const FormItem = Form.Item;

@inject('ShopStore')
@observer
class AddDialog extends React.Component {
	constructor(props) {
		super(props);
		this.shopStore = props.ShopStore;
	}

	state = {};

	async componentDidMount() {}

	async handleOk() {
		this.props.form.validateFields(async (err, values) => {
			try {
				if (err) return;
				values.desc = values.desc ? values.desc : '';
				let res = await request.post('/shop/addShop', values);
				if (res.data == 'success') {
					this.props.controllerAddDialog();
					this.props.onSearch();
				}
			} catch (error) {
				console.log(error);
			}
		});
	}

	handleCancel() {
		this.props.controllerAddDialog();
	}

	render() {
		const { getFieldDecorator } = this.props.form;
		const formItemLayout = {
			labelCol: { span: 4 },
			wrapperCol: { span: 20 },
		};
		return (
			<div>
				<Modal
					className="common_dialog common_max_dialog"
					title="新增店铺"
					visible={true}
					onOk={this.handleOk.bind(this)}
					onCancel={this.handleCancel.bind(this)}
				>
					<Form {...formItemLayout} onSubmit={this.handleSubmit}>
						<FormItem label="店铺名称">
							{getFieldDecorator('name', {
								rules: [
									{
										required: true,
										message: '请输入',
									},
								],
							})(<Input placeholder="请输入" maxLength={20} />)}
						</FormItem>
						<FormItem label="店铺经理">
							{getFieldDecorator('manager', {
								rules: [
									{
										required: true,
										message: '请输入',
									},
								],
							})(<Input placeholder="请输入" maxLength={10} />)}
						</FormItem>
						<FormItem label="联系电话">
							{getFieldDecorator('phone', {
								rules: [
									{
										required: true,
										message: '请输入',
									},
								],
							})(<Input type="number" placeholder="请输入" maxLength={12} />)}
						</FormItem>
						<FormItem label="登录账号">
							{getFieldDecorator('username', {
								rules: [
									{
										required: true,
										message: '请输入',
									},
								],
							})(<Input placeholder="请输入(商家登录该系统的账号)" maxLength={20} />)}
						</FormItem>
						<FormItem label="密码">
							{getFieldDecorator('password', {
								rules: [
									{
										required: true,
										message: '请输入',
									},
								],
							})(<Input placeholder="请输入(商家登录该系统的密码)" maxLength={20} />)}
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
						<FormItem label="描述">
							{getFieldDecorator('desc')(<Input maxLength={30} placeholder="请输入描述信息" />)}
						</FormItem>
					</Form>
				</Modal>
			</div>
		);
	}
}

const AddDialogForm = Form.create()(AddDialog);
export default AddDialogForm;
