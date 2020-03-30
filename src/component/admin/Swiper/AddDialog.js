import React from 'react';
import { Form, Input, Modal, Row, Col, message, Select } from 'antd';
import { inject, observer } from 'mobx-react';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import request from '../../../request/AxiosRequest';
const FormItem = Form.Item;
const { Option } = Select;

@inject('SwiperStore')
@observer
class AddDialog extends React.Component {
	constructor(props) {
		super(props);
		this.swiperStore = props.SwiperStore;
	}

	state = {};

	async componentDidMount() {
		await this.getAllShop();
	}

	// 获取所有厨房信息
	async getAllShop() {
		let res = await request.get('/shop/getAllForSelect');
		let data = res.data || [];
		data.map((item, index) => {
			item.key = index;
		});
		this.setState({
			allShopDetail: data,
		});
	}

	// 厨房选择获取食品信息
	async shopSelect(shopid) {
		let res = await request.get('/goods/getDescGoodsByShopId', { shopid: shopid });
		let data = res.data || [];
		this.setState({
			allGoodsDetail: data,
		});
	}

	async handleOk() {
		this.props.form.validateFields(async (err, values) => {
			try {
				if (err) return;
				if (!this.cropper) return message.warning('请上传图片');
				this.cropper.getCroppedCanvas().toBlob(async (blob) => {
					let campus = localStorage.getItem('campus') || '';
					const formData = new FormData();
					formData.append('campus', campus);
					formData.append('file', blob);
					formData.append('type', values.type);
					values.shop ? formData.append('shopid', values.shop) : null;
					values.goods ? formData.append('goodsid', values.goods) : null;
					formData.append('sort', Number(values.sort) || 1);
					let res = await this.swiperStore.addSwiper(formData);
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
		const { getFieldDecorator } = this.props.form;
		const formItemLayout = {
			labelCol: { span: 4 },
			wrapperCol: { span: 20 },
		};
		let { allShopDetail, type, allGoodsDetail } = this.state;
		return (
			<div>
				<Modal
					className="common_dialog"
					title="新增轮播图"
					visible={true}
					onOk={this.handleOk.bind(this)}
					onCancel={this.handleCancel.bind(this)}
				>
					<Form {...formItemLayout} onSubmit={this.handleSubmit}>
						<FormItem label="关联设置">
							{getFieldDecorator('type', {
								rules: [
									{
										required: true,
										message: '请选择',
									},
								],
							})(
								<Select placeholder="请选择" onSelect={this.typeSelect.bind(this)}>
									<Option value="1">关联厨房</Option>
									<Option value="2">关联食品</Option>
									<Option value="3">无</Option>
								</Select>,
							)}
						</FormItem>
						{type == '1' || type == '2' ? (
							<FormItem label="关联厨房">
								{getFieldDecorator('shop', {
									rules: [
										{
											required: true,
											message: '请选择',
										},
									],
								})(
									<Select placeholder="请选择" onSelect={this.shopSelect.bind(this)}>
										{allShopDetail && allShopDetail.length != 0
											? allShopDetail.map((item) => {
													return (
														<Option key={item.id} value={String(item.id)}>
															{item.name}
														</Option>
													);
											  })
											: null}
									</Select>,
								)}
							</FormItem>
						) : null}

						{type == '2' ? (
							<FormItem label="关联食品">
								{getFieldDecorator('goods', {
									rules: [
										{
											required: true,
											message: '请选择',
										},
									],
								})(
									<Select placeholder="请选择">
										{allGoodsDetail && allGoodsDetail.length != 0
											? allGoodsDetail.map((item) => {
													return (
														<Option key={item.id} value={String(item.id)}>
															{item.name}
														</Option>
													);
											  })
											: null}
									</Select>,
								)}
							</FormItem>
						) : null}
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
