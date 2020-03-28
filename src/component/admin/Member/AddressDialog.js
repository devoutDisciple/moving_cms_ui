import React from 'react';
import {
	Modal, Table, Tooltip
} from 'antd';


export default class AddressDialog extends React.Component {

	constructor(props) {
		super(props);
		this.shopStore = props.ShopStore;
	}

	state = {
		data: []
	};

	async componentDidMount() {
		let data = this.props.data;
		try {
			data = JSON.parse(data.address);
			data.map((item, index) => {
				item.key = index;
				if(item.floor == '暂无全餐点') item.floor = '';
				item.address = `${item.campus} ${item.floor}`;
			});
			this.setState({data});
		} catch (error) {
			console.log(error);
			this.setState({data: []});
		}
	}


	handleCancel() {
		this.props.onControllerAddressDialog();
	}

	render() {
		const columns = [
			{
				title: '姓名',
				dataIndex: 'username',
				key: 'username',
				align: 'center'
			},
			{
				title: '电话',
				dataIndex: 'phone',
				key: 'phone',
				align: 'center',
			},
			{
				title: '取餐地址',
				dataIndex: 'address',
				key: 'address',
				align: 'center',
				render:(text, record) => {
					return <Tooltip placement="top" title={record.address}>
						<span className='common_table_ellipse'>{record.address}</span>
					   </Tooltip>;
				}
			},
			{
				title: '默认地址',
				dataIndex: 'default',
				key: 'default',
				align: 'center',
				render:(text, record) => {
					if(record.default == true) return <span>是</span>;
					return <span>否</span>;
				}
			},
		];
		let {data} = this.state;
		return (
			<div>
				<Modal
					className='common_dialog common_max_dialog'
					title="收货地址"
					visible={true}
					footer={null}
					onCancel={this.handleCancel.bind(this)}>
					<Table
						bordered
						dataSource={data}
						columns={columns}
						pagination={
							{
								total: data.length,
								showTotal: (total) => `共 ${total} 条`
							}
						}/>
				</Modal>
			</div>
		);
	}
}
