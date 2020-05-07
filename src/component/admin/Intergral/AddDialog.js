import React from 'react';
import { Form, Input, Modal, Row, Col, message, Select } from 'antd';
import Cropper from 'cropperjs';
import moment from 'moment';
import 'cropperjs/dist/cropper.css';
import Request from '../../../request/AxiosRequest';
const FormItem = Form.Item;
const Option = Select.Option;

class AddDialog extends React.Component {
	constructor(props) {
		super(props);
	}

	state = {
		shopList: [],
	};

	async componentDidMount() {
		await this.onSearchShop();
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
				if (!this.cropper) return message.warning('请上传图片');
				this.cropper.getCroppedCanvas().toBlob(async (blob) => {
					const formData = new FormData();
					formData.append('shopid', values.shopid);
					formData.append('name', values.name);
					formData.append('intergral', values.intergral);
					formData.append('desc', values.desc);
					formData.append('file', blob);
					formData.append('create_time', moment().format('YYYY-MM-DD HH:mm:ss'));
					formData.append('sort', Number(values.sort) || 1);
					let res = await Request.post('/intergral/add', formData);
					if (res.data == 'success') {
						this.props.controllerAddDialog();
						this.props.onSearch();
						return message.success('新增成功');
					}
				});
			} catch (error) {
				console.log(error);
			}
		});
	}

	handleCancel() {
		this.props.controllerAddDialog();
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
				aspectRatio: 8 / 8,
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
			{ shopList } = this.state;
		return (
			<div>
				<Modal
					className="common_dialog"
					title="新增积分商品"
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
							})(<Input maxLength={16} placeholder="请输入" />)}
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
							<Col span={4} className="campus_container_label campus_container_label_require">
								图片录入：
							</Col>
							<Col span={20}>
								<input
									type="file"
									id="swiper_dialog_img"
									accept="image/jpeg,image/jpg,image/png"
									onChange={this.fileChange.bind(this)}
								/>
							</Col>
						</Row>
						<Row className="campus_container">
							<Col span={4} className="campus_container_label"></Col>
							<Col span={20} className="swiper_dialog_preview"></Col>
						</Row>
					</Form>
				</Modal>
			</div>
		);
	}
}

const AddDialogForm = Form.create()(AddDialog);
export default AddDialogForm;
