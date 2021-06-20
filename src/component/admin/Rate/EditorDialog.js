import React from 'react';
import {
	Form, Modal, Input, message
} from 'antd';
import 'cropperjs/dist/cropper.css';
import Request from '../../../request/AxiosRequest';
const FormItem = Form.Item;

class EditorDialog extends React.Component {

	constructor(props) {
		super(props);
		this.swiperStore = props.SwiperStore;
	}

	state = {
	};

	async componentDidMount() {
		let editData = this.props.editData;
		this.props.form.setFieldsValue({
			shop_rate: editData.shop_rate,
			other_rate: editData.other_rate,
		});
	}

	async handleOk()  {
		this.props.form.validateFields(async (err, values) => {
			try {
				if (err) return;
				values.id = this.props.editData.id;
				let res = await Request.post('/rate/modify', values);
				if(res.data == 'success') {
					message.success('修改成功');
					this.props.controllerEditorDialog();
					return this.props.onSearch();
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
			labelCol: { span: 6 },
			wrapperCol: { span: 18 },
		};
		return (
			<div>
				<Modal
					className='common_dialog'
					title="平台抽成(%)"
					visible={true}
					onOk={this.handleOk.bind(this)}
					onCancel={this.handleCancel.bind(this)}>
					<Form {...formItemLayout} onSubmit={this.handleSubmit}>
						<FormItem
							label="平台抽成(%)">
							{getFieldDecorator('shop_rate', {
								rules: [{
									required: true,
									message: '请输入',
								}],
							})(
								<Input type="number" placeholder="请输入" />
							)}
						</FormItem>
						<FormItem
							label="提现费率(%)">
							{getFieldDecorator('other_rate', {
								rules: [{
									required: true,
									message: '请输入',
								}],
							})(
								<Input type="number" placeholder="请输入" />
							)}
						</FormItem>
					</Form>
				</Modal>
			</div>
		);
	}
}

const EditorDialogForm = Form.create()(EditorDialog);
export default EditorDialogForm;
