import React from 'react';
import {
	Table
} from 'antd';
// const { Option } = Select;
import Request from '../../../request/AxiosRequest';
import moment from 'moment';
import FilterOrderStatus from '../../../util/FilterOrderStatus';

export default class Order extends React.Component{

	constructor(props) {
		super(props);
	}

	state = {
		oderList: []
	}

	async componentDidMount() {
		// 查询所有订单
		await this.onSearchOrder();
	}

	// 查询所有订单
	async onSearchOrder() {
		let res = await Request.get('/order/getAll');
		let data = res.data || [];
		data.map(item => {
			item.key = item.id;
			item.order_time = moment(item.order_time).format('YYYY-MM-DD HH:mm:ss');
		});
		this.setState({oderList: res.data || []});
	}

	// 查看订单详情
	async onSearchOrderDetail() {

	}


	render() {
		let {oderList} = this.state;
		const columns = [
			{
				title: '订单编号',
				dataIndex: 'id',
				key: 'id',
				align: 'center'
			},
			{
				title: '会员名称',
				dataIndex: 'username',
				key: 'username',
				align: 'center'
			},
			{
				title: '联系方式',
				dataIndex: 'phone',
				key: 'phone',
				align: 'center'
			},
			{
				title: '订单总价',
				dataIndex: 'total_price',
				key: 'shopName',
				align: 'center'
			},
			{
				title: '订单时间',
				dataIndex: 'order_time',
				key: 'order_time',
				align: 'center'
			},
			{
				title: '订单状态',
				dataIndex: 'status',
				key: 'status',
				align: 'center',
				render: (text, record) => {
					return <span>{FilterOrderStatus.filterOrderStatus(record.status)}</span>;
				}
			},
			{
				title: '操作',
				dataIndex: 'operation',
				key: 'operation',
				align: 'center',
				render:(text, record) => {
					return <span className="common_table_span">
						<a href="javascript:;" onClick={this.onSearchOrderDetail.bind(this, record)}>订单详情</a>
					</span>;
				}
			}
		];
		return (
			<div className='common'>
				<div className='common_content'>
					<Table
						bordered
						dataSource={oderList}
						columns={columns}
						pagination={
							{
								total: oderList.length,
								showTotal: (total) => `共 ${total} 条`
							}
						}/>
				</div>
			</div>
		);
	}
}
