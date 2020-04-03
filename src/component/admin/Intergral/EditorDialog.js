import React from 'react';
import { Form, Input, Modal, Row, Col, message, Select } from 'antd';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import Request from '../../../request/AxiosRequest';
import Config from '../../../config/config';
const FormItem = Form.Item;
const Option = Select.Option;

class EditorDialog extends React.Component {
	constructor(props) {
		super(props);
	}

	state = {
		shopList: [],
	};

	async componentDidMount() {
		let { editData } = this.props;
		console.log(editData, 99);
		this.props.form.setFieldsValue({
			sort: editData.sort,
			shopid: editData.shopid,
			name: editData.name,
			desc: editData.desc,
			intergral: editData.intergral,
		});
		await this.onSearchShop();
	}

	// 查询商店
	async onSearchShop() {
		let resShop = await Request.get('/shop/all');
		let shops = resShop.data || [];
		await this.setState({ shopList: shops });
	}

	async handleOk() {
		let { editData } = this.props;
		this.props.form.validateFields(async (err, values) => {
			try {
				if (err) return;
				if (!(values.sort > 0)) return message.warning('权重请输入数字');
				const formData = new FormData();
				formData.append('id', editData.id);
				formData.append('shopid', values.shopid);
				formData.append('name', values.name);
				formData.append('intergral', values.intergral);
				formData.append('desc', values.desc);
				formData.append('sort', Number(values.sort) || 1);

				if (!this.cropper) {
					let res = await Request.post('/intergral/update', formData);
					if (res.data == 'success') {
						this.props.controllerEditorDialog();
						this.props.onSearch();
						return message.success('编辑成功');
					}
				}
				this.cropper.getCroppedCanvas().toBlob(async (blob) => {
					formData.append('file', blob);
					let res = await Request.post('/intergral/update', formData);
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

	render() {
		const { getFieldDecorator } = this.props.form,
			formItemLayout = {
				labelCol: { span: 4 },
				wrapperCol: { span: 20 },
			},
			{ shopList } = this.state,
			{ editData } = this.props;
		return (
			<div>
				<Modal
					className="common_dialog"
					title="编辑轮播图"
					visible={true}
					onOk={this.handleOk.bind(this)}
					onCancel={this.handleCancel.bind(this)}
				>
					<Form {...formItemLayout} onSubmit={this.handleSubmit}>
						<FormItem label="店铺">
							{getFieldDecorator('shopid', {
								rules: [
									{
										required: true,
										message: '请输入',
									},
								],
							})(
								<Select onSelect={(value) => this.setState({ level: value })} placeholder="请选择">
									{shopList.map((item) => {
										return (
											<Option key={item.id} value={item.id}>
												{item.name}
											</Option>
										);
									})}
								</Select>,
							)}
						</FormItem>
						<FormItem label="商品名称">
							{getFieldDecorator('name', {
								rules: [
									{
										required: true,
										message: '请输入',
									},
								],
							})(<Input maxLength={10} placeholder="请输入" />)}
						</FormItem>
						<FormItem label="所需积分">
							{getFieldDecorator('intergral', {
								rules: [
									{
										required: true,
										message: '请输入',
									},
								],
							})(<Input type="number" maxLength={10} placeholder="请输入" />)}
						</FormItem>
						<FormItem label="描述">
							{getFieldDecorator('desc', {
								rules: [
									{
										required: true,
										message: '请输入',
									},
								],
							})(<Input maxLength={20} placeholder="请输入" />)}
						</FormItem>
						<FormItem label="商品权重">
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
