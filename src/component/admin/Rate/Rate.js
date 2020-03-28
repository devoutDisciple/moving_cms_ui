import React from 'react';
import Request from '../../../request/AxiosRequest';
import {
	Table
} from 'antd';
import EditorDialog from './EditorDialog';

export default class Rate extends React.Component{

	constructor(props) {
		super(props);
	}

	state = {
		data: [],
		visible: false,
		editData: {}
	}

	componentDidMount() {
		this.onSearch();
	}

	// 获取数据
	async onSearch() {
		let result = await Request.get('/rate/getAll');
		let data = result.data || [];
		data.map(item => item.key = item.id);
		this.setState({data});
	}

	// 控制弹框开关
	controllerEditorDialog() {
		this.setState({visible: !this.state.visible});
	}

	// 点击编辑
	onEditAdver(data) {
		this.setState({
			editData: data
		}, () => this.controllerEditorDialog());
	}

	render() {
		const columns = [
			{
				title: '平台抽成(%)',
				dataIndex: 'shop_rate',
				key: 'shop_rate',
				align: 'center',
			},
			{
				title: '提现费率(%)',
				dataIndex: 'other_rate',
				key: 'other_rate',
				align: 'center'
			},
			{
				title: '操作',
				dataIndex: 'operation',
				key: 'operation',
				align: 'center',
				render: (text, record) => {
					return <a href="javascript:;" onClick={this.onEditAdver.bind(this, record)}>修改</a>;
				}
			},
		];
		let {data, visible, editData} = this.state;
		return (
			<div className='common'>
				<div className='common_content'>
					<Table
						bordered
						dataSource={data}
						columns={columns}
						pagination={false}/>
				</div>
				{
					visible ?
						<EditorDialog
							editData={editData}
							onSearch={this.onSearch.bind(this)}
							controllerEditorDialog={this.controllerEditorDialog.bind(this)}/>
						: null
				}
			</div>
		);
	}
}
