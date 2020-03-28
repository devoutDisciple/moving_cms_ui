import React from 'react';
import {
	Form, Input, Modal, message
} from 'antd';
import Request from '../../../request/AxiosRequest';
import {inject, observer} from 'mobx-react';
const FormItem = Form.Item;

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
		let data = this.props.editData;
		this.props.form.setFieldsValue({
			sn: data.sn,
			key: data.key
		});
	}

	async handleOk()  {
		let {editData} = this.props;
		this.props.form.validateFields(async (err, values) => {
			try {
				if (err) return;
				values.id = editData.id;
				let res = await Request.post('/print/add', values);
				// u7f16\u53f7\u548cKEY
				if(res.data && res.data.includes('u7f16') && res.data.includes('u53f7') && res.data.includes('u548cKEY')) {
				// if(res.data && res.data.includes('\uff08\u9519\u8bef\uff1a\u6253\u5370\u673a\u7f16\u53f7\u548cKEY\u4e0d\u6b63\u786e\uff09')) {
					this.props.onSearch();
					return message.warning('添加失败, 请输入正确的打印机编号和秘钥');
				}
				if(res.data && res.data.includes('u6ca1') && res.data.includes('u6709') && res.data.includes('u627e')) {
				// if(res.data && res.data.includes('\u6ca1\u6709\u627e\u5230\u8be5\u6253\u5370\u673a\u7684\u4fe1\u606f')) {
					this.props.onSearch();
					return message.warning('添加失败, 请输入正确的打印机编号和秘钥');
				}
				if(res.data && res.data.includes('u4e00') && res.data.includes('u53f0') && res.data.includes('u6700')) {
				// if(res.data && res.data.includes('\uff08\u9519\u8bef\uff1a\u4e00\u53f0\u6253\u5370\u673a\u6700\u591a\u53ea\u80fd\u7ed1\u5b9a')) {
					this.props.onSearch();
					return message.warning('添加失败, 请输入正确的打印机编号和秘钥');
				}
				if(res.data && res.data.includes('u5df2') && res.data.includes('u88ab') && res.data.includes('u6dfb')) {
				// if(res.data && res.data.includes('\uff08\u9519\u8bef\uff1a\u5df2\u88ab\u6dfb\u52a0\u8fc7\uff09')) {
					this.props.onSearch();
					return message.warning('该打印机已被添加过');
				}
				if(res.data && res.data.includes('ok')){
					message.success('打印机添加成功');
					this.props.controllerPrintDialog();
					return this.props.onSearch();
				}
				return message.success('打印机添加失败');
			} catch (error) {
				console.log(error);
			}
		});
	}

	handleCancel() {
		this.props.controllerPrintDialog();
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
					title="编辑打印机"
					visible={true}
					onOk={this.handleOk.bind(this)}
					onCancel={this.handleCancel.bind(this)}>
					<Form {...formItemLayout} onSubmit={this.handleSubmit}>
						<FormItem
							label="编号">
							{getFieldDecorator('sn')(
								<Input placeholder="请输入打印机编号(sn)" />
							)}
						</FormItem>
						<FormItem
							label="秘钥">
							{getFieldDecorator('key')(
								<Input placeholder="请输入打印机编号(KEY)" />
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
