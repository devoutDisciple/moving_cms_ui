import React from 'react';
import { Form, Modal, Row, Col, message } from 'antd';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import config from '../../../config/config';
import Request from '../../../request/AxiosRequest';

class EditorDialog extends React.Component {
	constructor(props) {
		super(props);
		this.swiperStore = props.SwiperStore;
	}

	async handleOk() {
		this.props.form.validateFields(async (err) => {
			try {
				if (err) return;
				const formData = new FormData();
				this.cropper.getCroppedCanvas().toBlob(async (blob) => {
					formData.append('file', blob);
					let res = await Request.post('/adver/modify', formData);
					if (res.data == 'success') {
						this.props.controllerEditorDialog();
						location.reload();
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
				aspectRatio: 1 / 2,
				zoomable: false,
			});
		};
		reader.onerror = function () {
			message.warning('服务端错误, 请稍后重试');
		};
	}

	render() {
		return (
			<div>
				<Modal
					className="common_dialog"
					title="广告信息编辑"
					visible={true}
					onOk={this.handleOk.bind(this)}
					onCancel={this.handleCancel.bind(this)}
				>
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
							<img src={`${config.baseUrl}/adver/advertisement.png`} />
						</Col>
					</Row>
				</Modal>
			</div>
		);
	}
}

const EditorDialogForm = Form.create()(EditorDialog);
export default EditorDialogForm;
