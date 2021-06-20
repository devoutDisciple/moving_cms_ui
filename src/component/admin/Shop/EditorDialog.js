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
	}

	state = {};

	async componentDidMount() {
		let { shopid } = this.props;
		let shopRes = await request.get('/shop/getShopDetailById', {
			shopid: shopid,
		});
		let shop = shopRes.data || {};
		this.props.form.setFieldsValue({
			name: shop.name,
			manager: shop.manager,
			phone: shop.phone,
			sort: shop.sort,
			desc: shop.desc ? shop.desc : '',
		});
	}

	async handleOk() {
		let { shopid } = this.props;
		this.props.form.validateFields(async (err, values) => {
			try {
				if (err) return;
				values.shopid = shopid;
				let res = await request.post('/shop/updateShop', values);
				if (res.data == 'success') {
					this.props.controllerEditorDialog();
					this.props.onSearch();
				}
			} catch (error) {
				console.log(error);
			}
		});
	}

	handleCancel() {
		this.props.controllerEditorDialog();
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
					title="修改店铺"
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
