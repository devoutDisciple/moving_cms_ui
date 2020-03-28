import React from 'react';
import {
	Modal, Card, Col, Row
} from 'antd';
import Request from '../../../request/AxiosRequest';
import moment from 'moment';

export default class AddDialog extends React.Component {

	constructor(props) {
		super(props);
	}

	state = {

	};

	async componentDidMount() {
		let record = this.props.data;
		let id = record.id;
		let result = await Request.get('/evaluate/getEvaluateByOrderId', {id: id});
		let data = result.data || [];
		data.map(item => {
			item.create_time = moment(item.create_time).format('YYYY-MM-DD HH:mm:ss');
		});
		this.setState({
			list: data
		});
	}

	async handleOk()  {
		this.props.onControllerEvaluateDialogVisible();
	}

	handleCancel() {
		this.props.onControllerEvaluateDialogVisible();
	}

	render() {
		let {list} = this.state;
		return (
			<Modal
				className='common_dialog'
				visible={true}
				title=""
				footer={null}
				onOk={this.handleOk.bind(this)}
				onCancel={this.handleCancel.bind(this)}>
				{
					list && list.length != 0 ?
						list.map((item, index) => {
							return (
								<Card className="order_evaluate_dialog" key={index} title={
									<Row className='order_evaluate_dialog_title'>
										<Col className='order_evaluate_dialog_title_img'>
											<img src={item.goodsUrl}/>
										</Col>
										<Col className='order_evaluate_dialog_title_name'>{item.goodsName}</Col>
										<Col className='order_evaluate_dialog_title_grade'>{item.create_time}</Col>
									</Row>
								}>
									<p>评分: {item.goods_grade}</p>
									<p>评价内容: {item.desc}</p>
								</Card>
							);
						})
						: null
				}
			</Modal>
		);
	}
}
