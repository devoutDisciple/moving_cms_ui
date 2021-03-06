import React from 'react';
import { Icon, Layout } from 'antd';
import {inject, observer} from 'mobx-react';
import './index.less';
const { Header } = Layout;

@inject('GlobalStore')
@observer
export default class MyHeader extends React.Component{

	constructor(props) {
		super(props);
		this.globalStore = props.GlobalStore;
	}

	state = {
	}

	async componentDidMount() {}

	// 退出登录
	async logout() {
		await this.globalStore.logout();
	}

	render() {
		return (
			<Header className="root_layout_content_header">

				<span className="root_layout_content_header_span">您好：{this.globalStore.userinfo.username}</span>
				<span
					onClick={this.logout.bind(this)}
					className="root_layout_content_header_span" title="退出登录"
					style={{cursor: 'pointer'}}>
					<Icon type="logout" />
				</span>
			</Header>
		);
	}
}
