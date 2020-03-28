import React from 'react';
import {
	Form, Input, Modal, Select, TimePicker
} from 'antd';
import {inject, observer} from 'mobx-react';
import moment from 'moment';

const FormItem = Form.Item;
const { Option } = Select;

@inject('ShopStore')
@observer
class AddDialog extends React.Component {

	constructor(props) {
		super(props);
		this.shopStore = props.ShopStore;
	}

	state = {

	};

	async componentDidMount() {
		await this.shopStore.getCampus();
	}

	async handleOk()  {
		this.props.form.validateFields(async (err, values) => {
			try {
				if (err) return;
				values.start_time = moment(values.start_time).format('HH:mm');
				values.end_time = moment(values.end_time).format('HH:mm');
				values.desc = values.desc ? values.desc :'';
				let res = await this.shopStore.addShop(values);
				if(res.data == 'success') {
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
		let {campus} = this.shopStore, format = 'HH:mm';
		return (
			<div>
				<Modal
					className='common_dialog common_max_dialog'
					title="新增厨房"
					visible={true}
					onOk={this.handleOk.bind(this)}
					onCancel={this.handleCancel.bind(this)}>
					<Form {...formItemLayout} onSubmit={this.handleSubmit}>
						<FormItem
							label="所属校区">
							{getFieldDecorator('campus', {
								rules: [{
									required: true,
									message: '请选择',
								}],
							})(
								<Select placeholder="请选择">
									{
										campus && campus.length != 0 ?
											campus.map(item => {
												return <Option key={item.id} value={item.name}>{item.name}</Option>;
											})
											: null
									}
								</Select>
							)}
						</FormItem>
						<FormItem
							label="厨房名称">
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
							label="厨房地址">
							{getFieldDecorator('address', {
								rules: [{
									required: true,
									message: '请输入',
								}],
							})(
								<Input placeholder="请输入" />
							)}
						</FormItem>
						<FormItem
							label="联系电话">
							{getFieldDecorator('phone', {
								rules: [{
									required: true,
									message: '请输入',
								}],
							})(
								<Input type="number" placeholder="请输入" />
							)}
						</FormItem>
						<FormItem label="营业时间" style={{ marginBottom: 0 }} className='common_dialog_time'>
							<FormItem
								style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}>
								{getFieldDecorator('start_time', {
									rules: [{
										required: true,
										message: '请选择',
									}],
								})(
									<TimePicker format={format}/>
								)}
							</FormItem>
							<span style={{ display: 'inline-block', width: '24px', textAlign: 'center' }}>-</span>
							<FormItem style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}>
								{getFieldDecorator('end_time', {
									rules: [{
										required: true,
										message: '请选择',
									}],
								})(
									<TimePicker format={format}/>
								)}
							</FormItem>
						</FormItem>
						<FormItem
							label="起送费">
							{getFieldDecorator('start_price', {
								rules: [{
									required: true,
									message: '请输入',
								}],
							})(
								<Input type="number" placeholder="请输入" />
							)}
						</FormItem>
						<FormItem
							label="用户名">
							{getFieldDecorator('username', {
								rules: [{
									required: true,
									message: '请输入',
								}],
							})(
								<Input placeholder="请输入(商家登录该系统的用户名)" />
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
								<Input placeholder="请输入(商家登录该系统的密码)" />
							)}
						</FormItem>
						<FormItem
							label="描述">
							{getFieldDecorator('desc')(
								<Input placeholder="请输入描述信息" />
							)}
						</FormItem>
					</Form>
				</Modal>
			</div>
		);
	}
}

const AddDialogForm = Form.create()(AddDialog);
export default AddDialogForm;
