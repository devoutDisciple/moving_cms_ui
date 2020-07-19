import React from 'react';
import { Modal, Table } from 'antd';
import moment from 'moment';
import FilterStatus from '../../../util/FilterOrderStatus';

export default class OrderDialog extends React.Component {
	constructor(props) {
		super(props);
		this.shopStore = props.ShopStore;
	}

	state = {
		data: [],
	};

	async componentDidMount() {
		let data = this.props.data;
		data.map((item, index) => {
			item.key = index;
			item.order_time = moment(item.order_time).format('YYYY-MM-DD HH:mm:ss');
		});
		this.setState({ data });
	}

	handleCancel() {
		this.props.onControllerOrderDialog();
	}

	expandedRowRender(record) {
		let order_list = JSON.parse(record.order_list || []);
		order_list.map((item, index) => {
			item.key = index;
		});
		const columns = [
			{ title: '商品名称', dataIndex: 'name', key: 'name' },
			{ title: '数量', dataIndex: 'num', key: 'num' },
			{ title: '单价', dataIndex: 'price', key: 'price' },
			{
				title: '总价',
				dataIndex: 'total',
				key: 'total',
				render: (text, record) => {
					return <span>{Number(record.num) * Number(record.price)}</span>;
				},
			},
		];
		return <Table columns={columns} dataSource={order_list} pagination={false} />;
	}

	render() {
		const columns = [
			{
				title: '订单编号',
				dataIndex: 'id',
				key: 'id',
				align: 'center',
			},
			{
				title: '折扣价',
				dataIndex: 'discount_price',
				key: 'discount_price',
				align: 'center',
			},
			{
				title: '订单总价',
				dataIndex: 'total_price',
				key: 'total_price',
				align: 'center',
			},
			{
				title: '订单时间',
				dataIndex: 'order_time',
				key: 'order_time',
				align: 'center',
				render: (text, record) => {
					return <span>{record.order_time}</span>;
				},
			},
			{
				title: '订单状态',
				dataIndex: 'status',
				key: 'status',
				align: 'center',
				render: (text, record) => {
					return <span>{FilterStatus.filterOrderStatus(record.status)}</span>;
				},
			},
		];
		let { data } = this.state;
		return (
			<div>
				<Modal
					className="common_dialog common_max_dialog"
					title="消费记录"
					visible={true}
					footer={null}
					onCancel={this.handleCancel.bind(this)}
				>
					<Table
						bordered
						expandedRowRender={this.expandedRowRender.bind(this)}
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
