import React from 'react';
import { Table } from 'antd';
import config from '../../../config/config';
import EditorDialog from './EditorDialog';

export default class Adver extends React.Component {
	constructor(props) {
		super(props);
	}

	state = {
		data: [{ key: 1, name: 1 }],
		visible: false,
	};

	// 控制弹框开关
	controllerEditorDialog() {
		this.setState({ visible: !this.state.visible });
	}

	render() {
		const columns = [
			{
				title: '广告图',
				dataIndex: 'url',
				key: 'url',
				align: 'center',
				render: () => {
					return <img className="common_table_img" src={`${config.imgUrl}/advertisement.png`} />;
				},
			},
			{
				title: '操作',
				dataIndex: 'operation',
				key: 'operation',
				align: 'center',
				render: () => {
					return (
						<a href="javascript:;" onClick={this.controllerEditorDialog.bind(this)}>
							修改
						</a>
					);
				},
			},
		];
		let { data, visible } = this.state;
		return (
			<div className="common">
				<div className="common_content">
					<Table bordered dataSource={data} columns={columns} pagination={false} />
				</div>
				{visible ? <EditorDialog controllerEditorDialog={this.controllerEditorDialog.bind(this)} /> : null}
			</div>
		);
	}
}
