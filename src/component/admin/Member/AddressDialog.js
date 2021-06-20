import React from 'react';
import { Modal, Table, Tooltip } from 'antd';
import moment from 'moment';
import request from '../../../request/AxiosRequest';

export default class AddressDialog extends React.Component {
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
			let result = await request.get('/address/getAllByUserid', { userid: userid });
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
				title: '姓名',
				dataIndex: 'username',
				key: 'username',
				align: 'center',
			},
			{
				title: '电话',
				dataIndex: 'phone',
				key: 'phone',
				align: 'center',
			},
			{
				title: '性别',
				dataIndex: 'sex',
				key: 'sex',
				align: 'center',
				render: (text, record) => {
					if (record.default == 2) return <span>女</span>;
					return <span>男</span>;
				},
			},
			{
				title: '地址',
				dataIndex: 'area',
				key: 'area',
				align: 'center',
				render: (text, record) => {
					let area = `${record.area} ${record.street}`;
					return (
						<Tooltip placement="top" title={area}>
							<span className="common_table_ellipse">{area}</span>
						</Tooltip>
					);
				},
			},
			{
				title: '默认地址',
				dataIndex: 'default',
				key: 'default',
				align: 'center',
				render: (text, record) => {
					if (record.default == 2) return <span>是</span>;
					return <span>否</span>;
				},
			},
			{
				title: '创建时间',
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
					className="common_dialog common_big_dialog"
					title="收货地址"
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
