import React from 'react';
import {
	Form, Input, Modal, Select, message
} from 'antd';
import {inject, observer} from 'mobx-react';
const FormItem = Form.Item;
const { Option } = Select;
import request from '../../../request/AxiosRequest';
import moment from 'moment';

@inject('GlobalStore')
@observer
class BillDialog extends React.Component {

	constructor(props) {
		super(props);
		this.globalStore = this.props.GlobalStore;
	}

	state = {

	};

	async componentDidMount() {
		// this.props.form.setFieldsValue({
		// 	type: '1',
		// 	account: 123,
		// 	money: 12
		// });
	}

	handleOk() {
		this.props.form.validateFields(async (err, values) => {
			if(err) return;
			let money = values.money, resMoney = this.props.resMoney, shopid = this.globalStore.userinfo.shopid;
			if(!shopid) return message.warning('系统繁忙, 请稍后重试');
			if(money < 1) return message.warning('提款金额最低 1 元');
			if(money > resMoney) return message.warning('提现金额超出可提现余额');
			values.shop_id = shopid;
			values.create_time = moment().format('YYYY-MM-DD HH:mm:ss');
			values.modify_time = moment().format('YYYY-MM-DD HH:mm:ss');
			let res = await request.post('/bill/addBill', values);
			if(res.data == 'success') {
				this.props.onControllerBillDialogVisible();
				return message.success('申请成功');
			}
		});
	}

	handleDialogCancel() {
		this.props.onControllerBillDialogVisible();
	}


	render() {
		const { getFieldDecorator } = this.props.form;
		const formItemLayout = {
			labelCol: { span: 4 },
			wrapperCol: { span: 20 },
		};
		let resMoney = this.props.resMoney;
		return (
			<div>
				<Modal
					className='common_dialog'
					title="提现申请"
					visible={true}
					onOk={this.handleOk.bind(this)}
					onCancel={this.handleDialogCancel.bind(this)}>
					{/* 提现申请的支付方式可以为多种选择，把常用的银行调出来，（前缀加上各个公司的LOGO） 工商银行，农业银行，建设银行，中国银行，招商银行，邮政银行，支付宝/微信
       提现信息需加上  收款姓名，联系号码，提现账号改为收款账号。 */}
					<Form {...formItemLayout}>
						<FormItem
							label="支付方式">
							{getFieldDecorator('type', {
								rules: [{
									required: true,
									message: '请输入',
								}],
							})(
								<Select placeholder="请选择">
									<Option value="1">工商银行</Option>
									<Option value="2">农业银行</Option>
									<Option value="3">建设银行</Option>
									<Option value="4">招商银行</Option>
									<Option value="5">邮政银行</Option>
									<Option value="6">支付宝</Option>
									<Option value="7">微信</Option>
								</Select>
							)}
						</FormItem>
						<FormItem
							label="收款账号">
							{getFieldDecorator('account', {
								rules: [{
									required: true,
									message: '请输入',
								}],
							})(
								<Input placeholder="请输入" />
							)}
						</FormItem>
						<FormItem
							label="收款人姓名">
							{getFieldDecorator('name', {
								rules: [{
									required: true,
									message: '请输入',
								}],
							})(
								<Input placeholder="请输入" />
							)}
						</FormItem>
						<FormItem
							label="收款人电话">
							{getFieldDecorator('phone', {
								rules: [{
									required: true,
									message: '请输入',
								}],
							})(
								<Input placeholder="请输入" />
							)}
						</FormItem>
						<FormItem
							label="提现金额">
							{getFieldDecorator('money', {
								rules: [{
									required: true,
									message: '请输入',
								}],
							})(
								<Input type="number" min={1} placeholder={`可提现余额 ${resMoney} 元`} />
							)}
						</FormItem>
					</Form>
				</Modal>
			</div>
		);
	}
}

const BillDialogForm = Form.create()(BillDialog);
export default BillDialogForm;
