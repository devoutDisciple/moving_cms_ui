import React from 'react';
import { Menu, Icon } from 'antd';
import { inject, observer } from 'mobx-react';

@inject('GlobalStore')
@observer
export default class MyMenu extends React.Component {
	constructor(props) {
		super(props);
		this.globalStore = props.GlobalStore;
	}

	state = {
		selectedKeys: '/home/shop',
	};

	componentDidMount() {
		let hash = location.hash;
		let selectedKeys = '';
		if (hash.startsWith('#')) {
			selectedKeys = hash.split('#')[1];
			this.setState({
				selectedKeys: selectedKeys,
			});
		}
	}

	onSelect(data) {
		let key = data.key;
		location.hash = '#' + key;
		this.setState({
			selectedKeys: key,
		});
	}

	render() {
		let role = this.globalStore.userinfo.role;
		// 超级管理员
		if (role != 1) return <></>;
		return (
			<Menu
				mode="inline"
				theme="dark"
				onSelect={this.onSelect.bind(this)}
				selectedKeys={[this.state.selectedKeys]}
			>
				<Menu.Item key="/home/data">
					<Icon type="inbox" />
					<span>数据汇总</span>
				</Menu.Item>
				<Menu.Item key="/home/adver">
					<Icon type="inbox" />
					<span>APP首屏广告</span>
				</Menu.Item>
				<Menu.Item key="/home/area">
					<Icon type="inbox" />
					<span>区域管理</span>
				</Menu.Item>
				<Menu.Item key="/home/shop">
					<Icon type="pie-chart" />
					<span>店铺管理</span>
				</Menu.Item>
				<Menu.Item key="/home/account">
					<Icon type="pie-chart" />
					<span>账号管理</span>
				</Menu.Item>
				<Menu.Item key="/home/swiper">
					<Icon type="pie-chart" />
					<span>首页轮播图</span>
				</Menu.Item>
				<Menu.Item key="/home/cabinet">
					<Icon type="inbox" />
					<span>洗衣柜管理</span>
				</Menu.Item>
				<Menu.Item key="/home/clothing">
					<Icon type="inbox" />
					<span>衣物管理</span>
				</Menu.Item>
				<Menu.Item key="/home/order">
					<Icon type="inbox" />
					<span>订单管理</span>
				</Menu.Item>
				<Menu.Item key="/home/intergral">
					<Icon type="inbox" />
					<span>积分兑换管理</span>
				</Menu.Item>
				<Menu.Item key="/home/member">
					<Icon type="inbox" />
					<span>会员管理</span>
				</Menu.Item>
				<Menu.Item key="/home/exception">
					<Icon type="inbox" />
					<span>柜子使用记录</span>
				</Menu.Item>
				<Menu.Item key="/home/options">
					<Icon type="inbox" />
					<span>意见反馈</span>
				</Menu.Item>
			</Menu>
		);
	}
}
