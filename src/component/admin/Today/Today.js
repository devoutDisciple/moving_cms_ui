import React from 'react';
import {
	Table, message, Tooltip
} from 'antd';
// const { Option } = Select;
import Request from '../../../request/AxiosRequest';

export default class Today extends React.Component{

	constructor(props) {
		super(props);
	}

	state = {
		goodsList: [],
	}

	async componentDidMount() {
		// 查询所有厨房名称
		await this.onSearchTodayGoods();
	}

	// 查询所有的今日推荐
	async onSearchTodayGoods() {
		let goods = await Request.get('/goods/getAllToday');
		let goodsList = goods.data || [];
		goodsList.map(goods => {
			goods.key = goods.id;
		});
		this.setState({goodsList});
	}

	// 修改今日推荐
	async onRecommend(data, type) {
		let result = await Request.get('/goods/updateToday', {id: data.id, type});
		if(result.data == 'success') {
			message.success('修改成功');
			return this.onSearchTodayGoods();
		}
	}


	render() {
		let {goodsList} = this.state;
		const columns = [
			{
				title: '名称',
				dataIndex: 'name',
				key: 'name',
				align: 'center',
				render:(text, record) => {
					return <Tooltip placement="top" title={record.name}>
						<span className='common_table_ellipse'>{record.name}</span>
					   </Tooltip>;
				}
			},
			{
				title: '图片',
				dataIndex: 'url',
				key: 'url',
				align: 'center',
				render:(text, record) => {
					return <img className='common_table_img' src={record.url}/>;
				}
			},
			{
				title: '所属厨房',
				dataIndex: 'shopName',
				key: 'shopName',
				align: 'center'
			},
			{
				title: '操作',
				dataIndex: 'operation',
				key: 'operation',
				align: 'center',
				render:(text, record) => {
					return <span className="common_table_span">
						{
							record.today == 2 ?
								<a href="javascript:;" onClick={this.onRecommend.bind(this, record, 1)}>今日推荐</a>
								:
								<a href="javascript:;" onClick={this.onRecommend.bind(this, record, 2)}>取消推荐</a>
						}
					</span>;
				}
			}
		];
		return (
			<div className='common'>
				<div className='common_content'>
					<Table
						bordered
						dataSource={goodsList}
						columns={columns}
						pagination={
							{
								total: goodsList.length,
								showTotal: (total) => `共 ${total} 条`
							}
						}/>
				</div>
			</div>
		);
	}
}
