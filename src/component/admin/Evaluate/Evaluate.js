import React from 'react';
import {
	Table, Tooltip, Form, Col, Input, Button
} from 'antd';
import Request from '../../../request/AxiosRequest';
import moment from 'moment';
const FormItem = Form.Item;

class Evaluate extends React.Component{

	constructor(props) {
		super(props);
	}

	state = {
		evaluateList: [],
		shopid: '',
		shopList: []
	}

	async componentDidMount() {
		this.onSearchEvaluateList();
	}

	// 下拉选择改变的时候
	selectChange(id) {
		this.setState({
			shopid: id,
		}, async () => {
			await this.onSearchEvaluateList();
		});
	}

	// 查询评价列表
	async onSearchEvaluateList() {
		let value = this.props.form.getFieldsValue();
		let result = await Request.get('/evaluate/getEvaluate', value);
		let data = result.data || [];
		let list = [];
		data.map(item => {
			item.key = item.id;
			item.create_time = moment(item.create_time).format('YYYY-MM-DD HH:mm:ss');
			if(!value.name) return list.push(item);
			if(item.shopName.includes(value.name)) {
				list.push(item);
			}
		});
		this.setState({
			evaluateList: list
		});
	}


	render() {
		let {evaluateList} = this.state;
		const columns = [
			{
				title: '订单编号',
				dataIndex: 'orderid',
				key: 'orderid',
				align: 'center'
			},
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
				title: '菜品名称',
				dataIndex: 'goodsName',
				key: 'goodsName',
				align: 'center'
			},
			{
				title: '厨房名称',
				dataIndex: 'shopName',
				key: 'shopName',
				align: 'center'
			},
			{
				title: '描述',
				dataIndex: 'desc',
				key: 'desc',
				align: 'center',
				render: (text, record) => {
					return <Tooltip placement="top" title={record.desc}>
						<span className='common_table_ellipse'>{record.desc ? record.desc : '--'}</span>
					   </Tooltip>;
				}
			},
			{
				title: '菜品评分',
				dataIndex: 'goods_grade',
				key: 'sender_grade',
				align: 'center'
			},
			{
				title: '创建时间',
				dataIndex: 'create_time',
				key: 'create_time',
				align: 'center'
			}
		];
		const { getFieldDecorator } = this.props.form;
		const formItemLayout = {
			labelCol: { span: 8 },
			wrapperCol: { span: 16 },
		};
		return (
			<div className='common'>
				<div className='common_search'>
					<Form className="common_search_form" {...formItemLayout}>
						<Col span={6}>
							<FormItem
								label="厨房名称">
								{getFieldDecorator('name')(
									<Input placeholder="请输入厨房名称" />
								)}
							</FormItem>
						</Col>
						<Col span={6} offset={1}>
							<Button type='primary' onClick={this.onSearchEvaluateList.bind(this)}>查询</Button>
						</Col>
					</Form>
				</div>
				<div className='common_content'>
					<Table
						bordered
						dataSource={evaluateList}
						columns={columns}
						pagination={
							{
								total: evaluateList.length,
								showTotal: (total) => `共 ${total} 条`
							}
						}/>
				</div>
			</div>
		);
	}
}

const EvaluateForm = Form.create()(Evaluate);
export default EvaluateForm;
