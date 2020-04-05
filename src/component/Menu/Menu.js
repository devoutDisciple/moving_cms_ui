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
		if (role == 1) {
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
					<Menu.Item key="/home/area">
						<Icon type="inbox" />
						<span>区域管理</span>
					</Menu.Item>
					<Menu.Item key="/home/shop">
						<Icon type="pie-chart" />
						<span>店铺管理</span>
					</Menu.Item>
					<Menu.Item key="/home/swiper">
						<Icon type="pie-chart" />
						<span>首页轮播图</span>
					</Menu.Item>
					<Menu.Item key="/home/cabinet">
						<Icon type="inbox" />
						<span>快递柜管理</span>
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

					<Menu.Item key="/home/options">
						<Icon type="inbox" />
						<span>意见反馈</span>
					</Menu.Item>
					{/* <Menu.Item key="/home/rate">
						<Icon type="inbox" />
						<span>费率管理</span>
					</Menu.Item>
					<Menu.Item key="/home/adver">
						<Icon type="inbox" />
						<span>广告录入</span>
					</Menu.Item>
					
					<Menu.Item key="/home/today">
						<Icon type="inbox" />
						<span>今日推荐</span>
					</Menu.Item>
					<Menu.Item key="/home/money">
						<Icon type="inbox" />
						<span>提现管理</span>
					</Menu.Item>
					<Menu.Item key="/home/evaluate">
						<Icon type="inbox" />
						<span>用户评价</span>
					</Menu.Item>
					<Menu.Item key="/home/options">
						<Icon type="inbox" />
						<span>意见反馈</span>
					</Menu.Item> */}
				</Menu>
			);
		}

		return (
			<Menu
				mode="inline"
				theme="dark"
				onSelect={this.onSelect.bind(this)}
				selectedKeys={[this.state.selectedKeys]}
				inlineCollapsed={false}
			>
				<Menu.Item key="/home/shop/order">
					<Icon type="inbox" />
					<span>订单管理</span>
				</Menu.Item>
				<Menu.Item key="/home/shop/goods">
					<Icon type="inbox" />
					<span>菜品管理</span>
				</Menu.Item>
				<Menu.Item key="/home/shop/data">
					<Icon type="inbox" />
					<span>销售数据</span>
				</Menu.Item>
				<Menu.Item key="/home/shop/my">
					<Icon type="inbox" />
					<span>我的厨房</span>
				</Menu.Item>
				<Menu.Item key="/home/shop/bill">
					<Icon type="inbox" />
					<span>提现管理</span>
				</Menu.Item>
			</Menu>
		);
	}
}
