import React from 'react';
import {
	Form, Input, Modal, Radio, Row, Col, message, Upload, Icon
} from 'antd';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import config from '../../../../config/config';
import request from '../../../request/AxiosRequest';
const FormItem = Form.Item;
let id = 2;

class EditorDialog extends React.Component {

	constructor(props) {
		super(props);
		this.shopStore = props.ShopStore;
	}

	state = {
		previewVisible: false,
		previewImage: '',
		fileList: [
		],
	};

	async componentDidMount() {
		// this.props.form.setFieldsValue({
		// 	today: '2'
		// });
		let data = this.props.data;
		let specification = JSON.parse(data.specification) || [];
		const { form } = this.props;
		let typeObj = {};
		let typeList = [];
		specification.map((item, index) => {
			typeList.push(index);
			typeObj[`names[${index}]`] = item.name;
			typeObj[`prices[${index}]`] = item.price;
		});
		form.setFieldsValue({
			keys: typeList,
		}, () => {
			this.props.form.setFieldsValue(typeObj);
		});
		this.props.form.setFieldsValue({
			name: data.name,
			title: data.title,
			price: data.price,
			package_cost: data.package_cost,
			today: String(data.today) || '1',
			sort: data.sort,
			sales: Number(data.sales)
		});
		let list = data.desc || [], fileList = [];
		list = JSON.parse(list);
		list.map((item, index) => {
			fileList.push({
				uid: index,
				name: `${index}.jpg`,
				status: 'done',
				url: item,
			});
		});
		this.setState({
			fileList: fileList
		});
	}

	fileChange() {
		let self = this;
		let file = document.getElementById('goods_main_img').files[0];
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
			let dom = document.querySelector('.goods_main_preview');
			dom.innerHTML = '';
			dom.appendChild(image);
			self.cropper = new Cropper(image, {
				aspectRatio: 4 / 4,
				zoomable: false
			});
		};
		reader.onerror = function() {
			message.warning('服务端错误, 请稍后重试');
		};
	}

	descChange() {
		let files = document.getElementById('goods_desc_img').files;
		let dom = document.querySelector('.goods_desc_preview');
		for(let i = 0; i < files.length; i++) {
			var reader = new FileReader();
			reader.readAsDataURL(files[i]);
			reader.onload = function(e) {
				var image = new Image();
				image.src = e.target.result;
				dom.appendChild(image);
			};
			reader.onerror = function() {
				message.warning('服务端错误, 请稍后重试');
			};
		}
	}


	async handleOk()  {
		this.props.form.validateFields(async (err, values) => {
			try {
				if (err) return;
				let {keys, names, prices} = values;
				let specification = [];
				keys.map(key => {
					specification.push({
						name: names[key],
						price: prices[key]
					});
				});
				let formData = new FormData(), {fileList} = this.state, desc = [];
				fileList.map(item => {
					desc.push(item.response ? item.response.data : item.url);
				});
				desc =  JSON.stringify(desc);
				formData.append('desc', desc);
				formData.append('id', this.props.data.id);
				formData.append('name', values.name);
				values.title ? formData.append('title', values.title) : null;
				formData.append('price', values.price);
				formData.append('package_cost', values.package_cost);
				formData.append('today', values.today);
				formData.append('sort', values.sort);
				formData.append('sales', values.sales);
				formData.append('shopid', this.props.data.shopid);
				formData.append('specification', JSON.stringify(specification));
				if(!this.cropper) {
					formData.append('type', 1);
					let res = await request.post('/goods/update', formData);
					if(res.data == 'success') {
						message.success('修改成功');
						this.props.onSearch();
						this.props.controllerEditorDialog();
					}
					return;
				}
				this.cropper.getCroppedCanvas().toBlob(async (blob) => {
					formData.append('file', blob);
					formData.append('type', 2);
					let res = await request.post('/goods/update', formData);
					if(res.data == 'success') {
						message.success('修改成功');
						this.props.onSearch();
						this.props.controllerEditorDialog();
					}
				});
			} catch (error) {
				console.log(error);
			}
		});
	}

	handleDialogCancel() {
		this.props.controllerEditorDialog();
	}

	handleCancel() {
		this.setState({ previewVisible: false });
	}

	getBase64(file) {
		return new Promise((resolve, reject) => {
		  const reader = new FileReader();
		  reader.readAsDataURL(file);
		  reader.onload = () => resolve(reader.result);
		  reader.onerror = error => reject(error);
		});
	}

	async handlePreview (file) {
  		if (!file.url && !file.preview) {
  			file.preview = await this.getBase64(file.originFileObj);
	  	}
	  	this.setState({
			previewImage: file.url || file.preview,
			previewVisible: true,
		});
	}

	handleChange ({ fileList }) {
		this.setState({ fileList });
	}

	addType() {
		const { form } = this.props;
		// can use data-binding to get
		const keys = form.getFieldValue('keys');
		const nextKeys = keys.concat(id++);
		// can use data-binding to set
		// important! notify form to detect changes
		form.setFieldsValue({
			keys: nextKeys,
		});
	}

	removeType(k) {
		const { form } = this.props;
		// can use data-binding to get
		const keys = form.getFieldValue('keys');
		// can use data-binding to set
		form.setFieldsValue({
		  keys: keys.filter(key => key !== k),
		});
	}

	render() {
		const { getFieldDecorator, getFieldValue } = this.props.form;
		const formItemLayout = {
			labelCol: { span: 4 },
			wrapperCol: { span: 20 },
		};
		const { previewVisible, previewImage, fileList } = this.state;
		const uploadButton = (
			<div>
				<Icon type="plus" />
				<div className="ant-upload-text">Upload</div>
			</div>
		);
		getFieldDecorator('keys', { initialValue: [] });
		const keys = getFieldValue('keys');
		const formItems = keys.map((k, index) => {
			return (
				<Row key={index} className="goods_dialog_type_formitem">
					<Col span={10}>
						<Form.Item
							className="goods_dialog_type_formitem_input"
							label=''
							required={true}>
							{getFieldDecorator(`names[${k}]`, {
								validateTrigger: ['onChange', 'onBlur'],
								rules: [
									{
										required: true,
										whitespace: true,
										message: '请输入',
									},
								],
							})(
								<Input placeholder="请输入" />
							)}
						</Form.Item>
					</Col>
					<Col span={10}>
						<Form.Item
							label=''
							className="goods_dialog_type_formitem_input"
							required={true}>
							{getFieldDecorator(`prices[${k}]`, {
								validateTrigger: ['onChange', 'onBlur'],
								rules: [
									{
										required: true,
										whitespace: true,
										message: '请输入',
									},
								],
							})(
								<Input type="number" placeholder="请输入" />
							)}
						</Form.Item>
					</Col>
					<Col span={4} className="goods_dialog_type_title goods_dialog_type_plus">
						<Icon
							className="dynamic-delete-button"
							type="minus-circle-o"
							onClick={this.removeType.bind(this, k)}
						/>
					</Col>
				</Row>
			);
		});
		return (
			<div>
				<Modal
					className='common_dialog common_max_dialog'
					title="新增商品"
					visible={true}
					onOk={this.handleOk.bind(this)}
					onCancel={this.handleDialogCancel.bind(this)}>
					<Form {...formItemLayout} onSubmit={this.handleSubmit}>
						<FormItem
							label="商品名称">
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
							label="销量">
							{getFieldDecorator('sales', {
								rules: [{
									required: true,
									message: '请输入',
								}],
							})(
								<Input placeholder="请输入" type="number"/>
							)}
						</FormItem>
						<FormItem
							label="价格">
							{getFieldDecorator('price', {
								rules: [{
									required: true,
									message: '请输入',
								}],
							})(
								<Input type="number" placeholder="请输入" />
							)}
						</FormItem>
						<FormItem
							label="餐盒费">
							{getFieldDecorator('package_cost', {
								rules: [{
									required: true,
									message: '请输入',
								}],
							})(
								<Input type="number" placeholder="请输入" />
							)}
						</FormItem>
						<FormItem
							label="今日推荐">
							{getFieldDecorator('today', {
								rules: [{
									required: true,
									message: '请选择',
								}],
							})(
								<Radio.Group>
									<Radio value="1">是</Radio>
									<Radio value="2">否</Radio>
								</Radio.Group>
							)}
						</FormItem>
						<FormItem
							label="权重">
							{getFieldDecorator('sort', {
								rules: [{
									required: true,
									message: '请输入',
								}],
							})(
								<Input type="number" placeholder="请输入权重, 权重越高, 排名越靠前" />
							)}
						</FormItem>
						<FormItem
							label="描述">
							{getFieldDecorator('title')(
								<Input placeholder="请输入(8个字以内)" />
							)}
						</FormItem>
						<Row className='campus_container'>
							<Col span={4} className='campus_container_label campus_container_label_require'>主图录入：</Col>
							<Col span={20}>
								<input
									type="file"
									id='goods_main_img'
									accept="image/gif,image/jpeg,image/jpg,image/png,image/svg"
									onChange={this.fileChange.bind(this)}/>
							</Col>
						</Row>
						<Row className='campus_container goods_img_container'>
							<Col span={4} className='campus_container_label'></Col>
							<Col span={20} className='goods_main_preview'>
								<img src={this.props.data.url}/>
							</Col>
						</Row>
						<FormItem
							label="描述图片">
							{getFieldDecorator('descFile')(
								<Upload
									action={`${config.baseUrl}/goods/uploadDescImg`}
									listType="picture-card"
									withCredentials
									fileList={fileList}
									onPreview={this.handlePreview.bind(this)}
									onChange={this.handleChange.bind(this)}>
									{fileList.length >= 10 ? null : uploadButton}
								</Upload>
							)}
						</FormItem>
						<FormItem
							className="goods_dialog_type_name"
							label="规格录入">
							<Row>
								<Col span={10} className="goods_dialog_type_title">规格</Col>
								<Col span={10} className="goods_dialog_type_title">价格</Col>
								<Col span={4} className="goods_dialog_type_title goods_dialog_type_plus">
									<Icon type="plus-circle" onClick={this.addType.bind(this)}/>
								</Col>
							</Row>
						</FormItem>
						{formItems}
						<Modal visible={previewVisible} footer={null} onCancel={this.handleCancel.bind(this)}>
							<img alt="example" style={{ width: '100%' }} src={previewImage} />
						</Modal>
					</Form>
				</Modal>
			</div>
		);
	}
}

const EditorDialogForm = Form.create()(EditorDialog);
export default EditorDialogForm;
