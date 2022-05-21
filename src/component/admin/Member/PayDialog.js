import React from 'react';
import moment from 'moment';
import { Modal, Table } from 'antd';
import request from '../../../request/AxiosRequest';
import FilterStatus from '../../../util/FilterStatus';

export default class PayDialog extends React.Component {
	constructor(props) {
		super(props);
	}

	state = {
		data: [],
	};

	async componentDidMount() {
		let { data } = this.props;
		let userid = data.id;
		try {
			let result = await request.get('/bill/getAllByUserid', { userid: userid });
			console.log(result, 111);
			this.setState({ data: result.data || [] });
		} catch (error) {
			console.log(error);
			this.setState({ data: [] });
		}
	}

	handleCancel() {
		this.props.onControllerAddressDialog();
	}

	render() {
		const columns = [
			{
				title: 'code',
				dataIndex: 'code',
				key: 'code',
				align: 'center',
			},
			{
				title: '订单id',
				dataIndex: 'orderid',
				key: 'orderid',
				align: 'center',
			},
			{
				title: '消费类型',
				dataIndex: 'type',
				key: 'type',
				align: 'center',
				render: (text) => {
					return <span>{FilterStatus.filterPayType(text)}</span>;
				},
			},
			{
				title: '支付金额',
				dataIndex: 'money',
				key: 'money',
				align: 'center',
			},
			{
				title: '赠送金额',
				dataIndex: 'send',
				key: 'send',
				align: 'center',
			},
			{
				title: '支付方式',
				dataIndex: 'pay_type',
				key: 'pay_type',
				align: 'center',
				render: (text) => {
					return <span>{FilterStatus.filterPayMothod(text)}</span>;
				},
			},

			{
				title: '支付时间',
				dataIndex: 'create_time',
				key: 'create_time',
				align: 'center',
				render: (text) => {
					return <span>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</span>;
				},
			},
		];
		let { data } = this.state;
		return (
			<div>
				<Modal
					className="common_dialog common_big_big_dialog"
					title="支付记录"
					visible={true}
					footer={null}
					onCancel={this.handleCancel.bind(this)}
				>
					<Table
						bordered
						rowKey="id"
						dataSource={data}
						columns={columns}
						pagination={{
							total: data.length,
							showTotal: (total) => `共 ${total} 条`,
						}}
					/>
				</Modal>
			</div>
		);
	}
}
