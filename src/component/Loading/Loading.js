import React from 'react';
import { Layout } from 'antd';
import {inject, observer} from 'mobx-react';
import './loading.less';

@inject('GlobalStore')
@observer
export default class Loading extends React.Component{

	render() {
		let show = this.props.show;
		if(show) return (
			<div className="spinner">
				<div className="double-bounce1"></div>
				<div className="double-bounce2"></div>
			</div>
		);
		return <Layout className="root_layout">
			{this.props.children}
		</Layout>;

	}
}
