import React from 'react';
import { Form, InputNumber, Modal, Select, message } from 'antd';
import request from '../../../request/AxiosRequest';
const FormItem = Form.Item;
const Option = Select.Option;

class MoneyDialog extends React.Component {
	constructor(props) {
		super(props);
	}

	state = {};

	async componentDidMount() {
		this.props.form.setFieldsValue({ operation: 1, money: 0 });
	}

	async handleOk() {
		this.props.form.validateFields(async (err, values) => {
			try {
				if (err) return;
				const { data } = this.props;
				let res = await request.post('/bill/updateMoney', { ...values, userid: data.id });
				console.log(res, 2222);
				if (res.data == 'success') {
					this.props.onControllerDialog();
					message.success('更改用户余额成功');
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
		const { data } = this.props;
		console.log(data, 7890);
		const formItemLayout = {
			labelCol: { span: 4 },
			wrapperCol: { span: 20 },
		};
		return (
			<div>
				<Modal
					className="common_dialog common_max_dialog"
					title="修改余额"
					visible={true}
					onOk={this.handleOk.bind(this)}
					onCancel={this.handleCancel.bind(this)}
				>
					<div className="member_desc">
						<span className="member_desc_title">会员昵称：</span>
						<span className="member_desc_value">{data.username}</span>
						<span className="member_desc_title">当前余额：</span>
						<span className="member_desc_value">{data.balance}</span>
						<span className="member_desc_title">会员手机号：</span>
						<span className="member_desc_value">{data.phone}</span>
					</div>
					<Form {...formItemLayout} onSubmit={this.handleSubmit}>
						<FormItem label="增加/减少">
							{getFieldDecorator('operation', {
								rules: [
									{
										required: true,
										message: '请输入',
									},
								],
							})(
								<Select placeholder="请选择">
									<Option key={1} value={1}>
										增加
									</Option>
									<Option key={2} value={2}>
										减少
									</Option>
								</Select>,
							)}
						</FormItem>
						<FormItem label="金额" className="member_money_input">
							{getFieldDecorator('money', {
								rules: [
									{
										required: true,
										message: '请输入',
									},
								],
							})(<InputNumber min={0} max={100000} />)}
						</FormItem>
					</Form>
				</Modal>
			</div>
		);
	}
}

const MoneyDialogForm = Form.create()(MoneyDialog);
export default MoneyDialogForm;
