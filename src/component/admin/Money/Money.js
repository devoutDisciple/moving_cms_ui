import React from 'react';
// const { Option } = Select;
import {Table, Popconfirm, message} from 'antd';
import Request from '../../../request/AxiosRequest';
import moment from 'moment';
import Filter from '../../../util/FilterOrderStatus';

export default class Order extends React.Component{

	constructor(props) {
		super(props);
		this.globalStore = this.props.GlobalStore;
	}

	state = {
		list: []
	}

	async componentDidMount() {
		await this.onSearchBill();
	}

	async onSearchBill() {
		let res = await Request.get('/bill/getAllBill');
		let data = res.data || [];
		data.map(item => {
			item.key = item.id;
			item.create_time = moment(item.create_time).format('YYYY-MM-DD HH:mm:ss');
			item.modify_time = moment(item.modify_time).format('YYYY-MM-DD HH:mm:ss');
		});
		this.setState({list: res.data || []});
	}

	// 撤销申请
	async onChangeBillStatus(data, status) {
		let res = await Request.post('/bill/modifyBillById', {id: data.id, status: status});
		if(res.data == 'success') {
			message.success('操作成功');
			this.onSearchBill();
		}
	}


	render() {
		let {list} = this.state;
		const columns = [
			{
				title: '审批编号',
				dataIndex: 'code',
				key: 'code',
				align: 'center'
			},
			{
				title: '商家名称',
				dataIndex: 'shopName',
				key: 'shopName',
				align: 'center'
			},
			{
				title: '支付方式',
				dataIndex: 'type',
				key: 'type',
				align: 'center',
				render: (text, record) => {
					return <span>{Filter.filterBillType(record.type)}</span>;
				}
			},
			{
				title: '商家收款账号',
				dataIndex: 'account',
				key: 'account',
				align: 'center'
			},
			{
				title: '收款人姓名',
				dataIndex: 'name',
				key: 'name',
				align: 'center'
			},
			{
				title: '收款人手机号',
				dataIndex: 'phone',
				key: 'phone',
				align: 'center'
			},
			{
				title: '申请金额(元)',
				dataIndex: 'money',
				key: 'money',
				align: 'center'
			},
			{
				title: '平台抽成(元)',
				dataIndex: 'our_money',
				key: 'our_money',
				align: 'center'
			},
			{
				title: '提现手续费(元)',
				dataIndex: 'other_money',
				key: 'other_money',
				align: 'center'
			},
			{
				title: '到账金额(元)',
				dataIndex: 'real_money',
				key: 'real_money',
				align: 'center'
			},

			{
				title: '申请时间',
				dataIndex: 'create_time',
				key: 'create_time',
				align: 'center',
			},
			{
				title: '处理时间',
				dataIndex: 'modify_time',
				key: 'modify_time',
				align: 'center',
			},
			{
				title: '状态',
				dataIndex: 'status',
				key: 'status',
				align: 'center',
				render: (text, record) => {
					let status = record.status;
					if(status == 1) return <span style={{color: '#15863d'}}>{Filter.filterBillStatus(record.status)}</span>;
					if(status == 2) return <span style={{color: 'red'}}>{Filter.filterBillStatus(record.status)}</span>;
					if(status == 3) return <span style={{color: '#008dff'}}>{Filter.filterBillStatus(record.status)}</span>;
					if(status == 4) return <span style={{color: 'red'}}>{Filter.filterBillStatus(record.status)}</span>;
				}
			},
			{
				title: '操作',
				dataIndex: 'operation',
				key: 'operation',
				align: 'center',
				render: (text, record) => {
					let status = record.status;
					if(status == 1) {
						return (
							<span className="common_table_span">
								<Popconfirm placement="top" title="是否确认拒绝" onConfirm={this.onChangeBillStatus.bind(this, record, 2)} okText="确认" cancelText="取消">
									<a href="javascript:;">拒绝</a>
								</Popconfirm>
								<Popconfirm placement="top" title="是否确认完成支付" onConfirm={this.onChangeBillStatus.bind(this, record, 3)} okText="确认" cancelText="取消">
									<a href="javascript:;">接受</a>
								</Popconfirm>
							</span>
						);
					}
				}
			},
		];
		return (
			<div className='common'>
				<div className='common_content'>
					<Table
						bordered
						dataSource={list}
						columns={columns}
						pagination={
							{
								total: list.length || 0,
								showTotal: (total) => `共 ${total} 条`
							}
						}/>
				</div>
			</div>
		);
	}
}
