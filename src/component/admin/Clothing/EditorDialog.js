import React from 'react';
import moment from 'moment';
import Request from '../../../request/AxiosRequest';
import { Form, Input, Modal, Select, message } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

class EditDialog extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			shopList: [], //所有商店
		};
	}

	async componentDidMount() {
		let { editData } = this.props;
		await this.onSearchShop();
		this.props.form.setFieldsValue({
			shopid: editData.shopid,
			name: editData.name,
			price: editData.price,
			sort: editData.sort,
		});
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
				values.create_time = moment().format('YYYY-MM-DD HH:mm:ss');
				values.id = this.props.editData.id;
				let res = await Request.post('/clothing/update', values);
				if (res.data == 'success') {
					message.success('编辑成功');
					this.props.onSearch();
					this.props.controllerEditorDialog();
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
		const { getFieldDecorator } = this.props.form,
			formItemLayout = {
				labelCol: { span: 4 },
				wrapperCol: { span: 20 },
			},
			{ shopList } = this.state;
		return (
			<div>
				<Modal
					className="common_dialog common_max_dialog"
					title="修改衣物"
					visible={true}
					onOk={this.handleOk.bind(this)}
					onCancel={this.handleCancel.bind(this)}
				>
					<Form {...formItemLayout} onSubmit={this.handleSubmit}>
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
						<FormItem label="衣物名称">
							{getFieldDecorator('name', {
								rules: [
									{
										required: true,
										message: '请输入',
									},
								],
							})(<Input placeholder="请输入" maxLength={20} />)}
						</FormItem>
						<FormItem label="价格">
							{getFieldDecorator('price', {
								rules: [
									{
										required: true,
										message: '请输入',
									},
								],
							})(<Input type="number" maxLength={10} placeholder="请输入" />)}
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

const EditDialogForm = Form.create()(EditDialog);
export default EditDialogForm;
