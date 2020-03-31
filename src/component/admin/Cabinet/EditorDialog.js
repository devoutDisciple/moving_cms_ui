import React from 'react';
import { Form, Input, Modal, Row, Col, message } from 'antd';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import Config from '../../../config/config';
import request from '../../../request/AxiosRequest';
const FormItem = Form.Item;

class EditorDialog extends React.Component {
	constructor(props) {
		super(props);
	}

	state = {};

	async componentDidMount() {
		let { editData } = this.props;
		console.log(editData, 99);
		this.props.form.setFieldsValue({
			shopName: editData.shopName,
			name: editData.name,
			address: editData.address,
			sort: editData.sort,
		});
	}

	async handleOk() {
		let { editData } = this.props;
		this.props.form.validateFields(async (err, values) => {
			try {
				if (err) return;
				if (!(values.sort > 0)) return message.warning('权重请输入数字');
				const formData = new FormData();
				formData.append('id', editData.id);
				formData.append('name', values.name);
				formData.append('address', values.address);
				formData.append('sort', Number(values.sort) || 1);
				if (!this.cropper) {
					let res = await request.post('/cabinet/update', formData);
					if (res.data == 'success') {
						this.props.controllerEditorDialog();
						this.props.onSearch();
						return message.success('编辑成功');
					}
				}
				this.cropper.getCroppedCanvas().toBlob(async (blob) => {
					formData.append('file', blob);
					let res = await request.post('/cabinet/update', formData);
					if (res.data == 'success') {
						this.props.controllerEditorDialog();
						this.props.onSearch();
						return message.success('编辑成功');
					}
				});
			} catch (error) {
				console.log(error);
			}
		});
	}

	handleCancel() {
		this.props.controllerEditorDialog();
	}

	fileChange() {
		let self = this;
		let file = document.getElementById('swiper_dialog_img').files[0];
		var reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onprogress = function (e) {
			if (e.lengthComputable) {
				// 简单把进度信息打印到控制台吧
				console.log(e.loaded / e.total + '%');
			}
		};
		reader.onload = function (e) {
			var image = new Image();
			image.src = e.target.result;
			let dom = document.querySelector('.swiper_dialog_preview');
			dom.innerHTML = '';
			dom.appendChild(image);
			self.cropper = new Cropper(image, {
				aspectRatio: 16 / 8,
				zoomable: false,
			});
		};
		reader.onerror = function () {
			message.warning('服务端错误, 请稍后重试');
		};
	}

	// 选择关联类型
	typeSelect(type) {
		this.setState({ type });
	}

	showSelect(show) {
		this.setState({ show });
	}

	render() {
		const { getFieldDecorator } = this.props.form,
			formItemLayout = {
				labelCol: { span: 4 },
				wrapperCol: { span: 20 },
			},
			{ editData } = this.props;
		return (
			<div>
				<Modal
					className="common_dialog"
					title="编辑快递柜"
					visible={true}
					onOk={this.handleOk.bind(this)}
					onCancel={this.handleCancel.bind(this)}
				>
					<Form {...formItemLayout} onSubmit={this.handleSubmit}>
						<FormItem label="商店名称">
							{getFieldDecorator('shopName', {
								rules: [
									{
										required: true,
										message: '请输入',
									},
								],
							})(<Input disabled placeholder="商店名称" />)}
						</FormItem>
						<FormItem label="柜子标题">
							{getFieldDecorator('name', {
								rules: [
									{
										required: true,
										message: '请输入',
									},
								],
							})(<Input placeholder="请输入" maxLength={20} />)}
						</FormItem>
						<FormItem label="柜子位置">
							{getFieldDecorator('address', {
								rules: [
									{
										required: true,
										message: '请输入',
									},
								],
							})(<Input placeholder="请输入" maxLength={20} />)}
						</FormItem>
						<FormItem label="权重">
							{getFieldDecorator('sort', {
								rules: [
									{
										required: true,
										message: '请输入',
									},
								],
							})(<Input type="number" placeholder="请输入权重, 权重越高, 排名越靠前" />)}
						</FormItem>
						<Row className="campus_container">
							<Col span={4} className="campus_container_label">
								图片录入：
							</Col>
							<Col span={20}>
								<input
									type="file"
									id="swiper_dialog_img"
									accept="image/gif,image/jpeg,image/jpg,image/png,image/svg"
									onChange={this.fileChange.bind(this)}
								/>
							</Col>
						</Row>
						<Row className="campus_container">
							<Col span={4} className="campus_container_label"></Col>
							<Col span={20} className="swiper_dialog_preview">
								<img src={`${Config.baseUrl}/${editData.url}`} />
							</Col>
						</Row>
					</Form>
				</Modal>
			</div>
		);
	}
}

const EditorDialogForm = Form.create()(EditorDialog);
export default EditorDialogForm;
