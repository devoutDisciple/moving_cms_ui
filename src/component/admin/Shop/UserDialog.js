import React from 'react';
import {
	Form, Input, Modal, message
} from 'antd';
import Request from '../../../request/AxiosRequest';
const FormItem = Form.Item;

class UserDialog extends React.Component {

	constructor(props) {
		super(props);
	}

	state = {

	};

	async componentDidMount() {
		let shopid = this.props.shopid;
		let res = await Request.get('/account/getAccount', {id: shopid});
		let data = res.data || {};
		this.props.form.setFieldsValue({
			username: data.username,
			password: data.password,
		});
	}

	async handleOk()  {
		this.props.form.validateFields(async (err, values) => {
			try {
				if (err) return;
				let shopid = this.props.shopid;
				let result = await Request.post('/account/modifyAccount', {id: shopid, password: values.password, type: 1});
				if(result.data == 'success') {
					message.success('修改成功');
					return this.props.onControllerAccountDialog();
				}
			} catch (error) {
				console.log(error);
			}
		});
	}

	handleCancel() {
		return this.props.onControllerAccountDialog();
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
					className='common_dialog common_max_dialog'
					title="修改密码"
					visible={true}
					onOk={this.handleOk.bind(this)}
					onCancel={this.handleCancel.bind(this)}>
					<Form {...formItemLayout} onSubmit={this.handleSubmit}>

						<FormItem
							label="用户名">
							{getFieldDecorator('username', {
								rules: [{
									required: true,
									message: '请输入',
								}],
							})(
								<Input placeholder="请输入" disabled/>
							)}
						</FormItem>
						<FormItem
							label="密码">
							{getFieldDecorator('password', {
								rules: [{
									required: true,
									message: '请输入',
								}],
							})(
								<Input placeholder="请输入" />
							)}
						</FormItem>
					</Form>
				</Modal>
			</div>
		);
	}
}

const UserDialogForm = Form.create()(UserDialog);
export default UserDialogForm;
