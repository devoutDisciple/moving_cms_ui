import React from 'react';
import {
	Table, Tooltip
} from 'antd';
import Request from '../../../request/AxiosRequest';
import moment from 'moment';

export default class Evaluate extends React.Component{

	constructor(props) {
		super(props);
	}

	state = {
		list: [],
	}

	async componentDidMount() {
		this.onSearch();
	}

	// 查询评价列表
	async onSearch() {
		let result = await Request.get('/option/all');
		let data = result.data || [];
		data.map(item => {
			item.key = item.id;
			item.create_time = moment(item.create_time).format('YYYY-MM-DD HH:mm:ss');
		});
		this.setState({
			list: data
		});
	}

	render() {
		let {list} = this.state;
		const columns = [
			{
				title: '用户名',
				dataIndex: 'username',
				key: 'username',
				align: 'center'
			},
			{
				title: '用户头像',
				dataIndex: 'avatarUrl',
				key: 'avatarUrl',
				align: 'center',
				render: (text, record) => {
					return <img style={{width: '33px'}} src={record.avatarUrl}/>;
				}
			},
			{
				title: '联系方式',
				dataIndex: 'phone',
				key: 'phone',
				align: 'center'
			},
			{
				title: '意见',
				dataIndex: 'text',
				key: 'text',
				align: 'center',
				render: (text, record) => {
					return <Tooltip placement="top" title={record.text}>
						<span className='common_max_table_ellipse'>{record.text}</span>
					</Tooltip>;
				}
			},
			{
				title: '创建时间',
				dataIndex: 'create_time',
				key: 'create_time',
				align: 'center'
			}
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
								total: list.length,
								showTotal: (total) => `共 ${total} 条`
							}
						}/>
				</div>
			</div>
		);
	}
}
