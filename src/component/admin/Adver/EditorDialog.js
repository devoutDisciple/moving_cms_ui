import React from 'react';
import {
	Form, Modal, Row, Col, message, Select, Input
} from 'antd';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import Request from '../../../request/AxiosRequest';
const FormItem = Form.Item;
const { Option } = Select;

class EditorDialog extends React.Component {

	constructor(props) {
		super(props);
		this.swiperStore = props.SwiperStore;
	}

	state = {
		allShopDetail: [],
		allGoodsDetail: [],
		type: '1', // 关联类型
		show: '1', // 是否展示
	};

	async componentDidMount() {
		let editData = this.props.editData;
		await this.getAllShop();
		await this.shopSelect(editData.shop_id);
		setTimeout(() => {
			let show = String(editData.show), status = String(editData.status);
			this.setState({
				type: show, // 关联类型
				status: status, // 是否展示
			}, () => {
				this.props.form.setFieldsValue({
					show: show,
					status: status
				});
				if(show == 1) {
					this.props.form.setFieldsValue({
						shop: String(editData.shop_id),
					});
				}
				if(show == 2) {
					this.props.form.setFieldsValue({
						shop: String(editData.shop_id),
						goods: String(editData.goods_id),
					});
				}
				if(status == 1) {
					this.props.form.setFieldsValue({
						time: editData.time,
					});
				}
			});
		}, 100);
	}

	async handleOk()  {
		this.props.form.validateFields(async (err, values) => {
			try {
				if (err) return;
				const formData = new FormData();
				formData.append('id', this.props.editData.id);
				values.shop ? formData.append('shop_id', values.shop) : null;
				values.goods ? formData.append('goods_id', values.goods) : null;
				formData.append('status', values.status);
				formData.append('show', values.show);
				values.time ? formData.append('time', values.time) : null;
				if(!this.cropper) {
					let res = await Request.post('/adver/modify', formData);
					if(res.data == 'success') {
						this.props.controllerEditorDialog();
						this.props.onSearch();
						return message.success('编辑成功');
					}
				}
				this.cropper.getCroppedCanvas().toBlob(async (blob) => {
					formData.append('file', blob);
					let res = await Request.post('/adver/modify', formData);
					if(res.data == 'success') {
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
		reader.onprogress = function(e) {
			if (e.lengthComputable) {
				// 简单把进度信息打印到控制台吧
				console.log(e.loaded / e.total + '%');
			}
		};
		reader.onload = function(e) {
			var image = new Image();
			image.src = e.target.result;
			let dom = document.querySelector('.swiper_dialog_preview');
			dom.innerHTML = '';
			dom.appendChild(image);
			self.cropper = new Cropper(image, {
				aspectRatio: 4 / 5,
				zoomable: false
			});
		};
		reader.onerror = function() {
			message.warning('服务端错误, 请稍后重试');
		};
	}

	// 获取所有厨房信息
	async getAllShop() {
		// 获取所有厨房信息
		let res = await Request.get('/shop/getAllForSelect');
		let data = res.data || [];
		this.setState({
			allShopDetail: data
		});
	}

	// 厨房选择获取食品信息
	async shopSelect(shopid) {
		// 获取所有厨房信息
		let res = await Request.get('/goods/getDescGoodsByShopId', {shopid: shopid});
		let data = res.data || [];
		this.setState({
			allGoodsDetail: data
		});
	}

	// 选择关联类型
	typeSelect(type) {
		this.setState({type});
	}

	showSelect(show) {
		this.setState({show});
	}

	render() {
		const { getFieldDecorator } = this.props.form;
		const formItemLayout = {
			labelCol: { span: 4 },
			wrapperCol: { span: 20 },
		};
		let {allShopDetail, allGoodsDetail, type, show} = this.state;
		return (
			<div>
				<Modal
					className='common_dialog'
					title="广告信息编辑"
					visible={true}
					onOk={this.handleOk.bind(this)}
					onCancel={this.handleCancel.bind(this)}>
					<Form {...formItemLayout} onSubmit={this.handleSubmit}>
						<FormItem
							label="关联设置">
							{getFieldDecorator('show', {
								rules: [{
									required: true,
									message: '请选择',
								}],
							})(
								<Select placeholder="请选择" onSelect={this.typeSelect.bind(this)}>
									<Option value="1">关联厨房</Option>
									<Option value="2">关联食品</Option>
									<Option value="3">无</Option>
								</Select>
							)}
						</FormItem>
						{
							type == '1' || type == '2'?
								<FormItem
									label="关联厨房">
									{getFieldDecorator('shop', {
										rules: [{
											required: true,
											message: '请选择',
										}],
									})(
										<Select placeholder="请选择" onSelect={this.shopSelect.bind(this)}>
											{
												allShopDetail && allShopDetail.length != 0 ?
													allShopDetail.map(item => {
														return <Option key={item.id} value={String(item.id)}>{item.name}</Option>;
													})
													: null
											}
										</Select>
									)}
								</FormItem>
								: null
						}

						{
							type == '2' ?
								<FormItem
									label="关联食品">
									{getFieldDecorator('goods', {
										rules: [{
											required: true,
											message: '请选择',
										}],
									})(
										<Select placeholder="请选择">
											{
												allGoodsDetail && allGoodsDetail.length != 0 ?
													allGoodsDetail.map(item => {
														return <Option key={item.id} value={String(item.id)}>{item.name}</Option>;
													})
													: null
											}
										</Select>
									)}
								</FormItem>
								: null
						}
						<FormItem
							label="是否展示">
							{getFieldDecorator('status', {
								rules: [{
									required: true,
									message: '请选择',
								}],
							})(
								<Select placeholder="请选择" onSelect={this.showSelect.bind(this)}>
									<Option value="1">展示</Option>
									<Option value="2">不展示</Option>
								</Select>
							)}
						</FormItem>
						{
							show == 1 ?
								<FormItem
									label="展示时间">
									{getFieldDecorator('time', {
										rules: [{
											required: true,
											message: '请输入',
										}],
									})(
										<Input type="number" placeholder="请输入时间(秒)" />
									)}
								</FormItem>
								: null
						}
						<Row className='campus_container'>
							<Col span={4} className='campus_container_label'>图片录入：</Col>
							<Col span={20}>
								<input
									type="file"
									id='swiper_dialog_img'
									accept="image/gif,image/jpeg,image/jpg,image/png,image/svg"
									onChange={this.fileChange.bind(this)}/>
							</Col>
						</Row>
						<Row className='campus_container'>
							<Col span={4} className='campus_container_label'></Col>
							<Col span={20} className='swiper_dialog_preview'>
								<img src={this.props.editData.url}/>
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
