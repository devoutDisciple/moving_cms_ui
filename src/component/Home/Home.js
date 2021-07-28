import React from 'react';
import { Layout } from 'antd';
const { Sider, Content, Footer } = Layout;
import Menu from '../Menu/Menu';
import MyHeader from './Header';
import { Route, Switch } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import './index.less';
import logo from '../../asserts/logo.png';

// 管理员

// 轮播图管理
import Swiper from '../admin/Swiper/Swiper';
// 广告管理
import Adver from '../admin/Adver/Adver';
// 区域管理
import Area from '../admin/Area/Area';
// 商店管理
import Shop from '../admin/Shop/Shop';
// 洗衣柜管理
import Cabinet from '../admin/Cabinet/Cabinet';
// 会员管理
import Member from '../admin/Member/Member';
// 订单管理
import Order from '../admin/Order/Order';
// 数据汇总
import Data from '../admin/Data/Data';
// 意见反馈
import Options from '../admin/Options/Options';
// 积分兑换
import Intergral from '../admin/Intergral/Intergral';
// 店铺广告
import ShopAdver from '../admin/ShopAdver/index';
// 衣物管理
import Clothing from '../admin/Clothing/Clothing';
// 账号管理
import Account from '../admin/Account/Account';
// 异常柜子打开记录
import Exception from '../admin/Exception/index';

@inject('GlobalStore')
@observer
export default class MyLayout extends React.Component {
	constructor(props) {
		super(props);
		this.globalStore = this.props.GlobalStore;
	}

	componentDidMount() {}

	render() {
		let { role } = this.globalStore.userinfo;
		return (
			<React.Fragment>
				<Layout>
					<Sider className="root_layout_sider">
						<div className="root_layout_sider_header">MOVING洗衣</div>
						<Menu />
					</Sider>
					<Content className="root_layout_content">
						<MyHeader />
						<div className="content">
							{role == 1 ? (
								<Switch>
									<Route exact path="/home" component={Shop} />
									<Route path="/home/adver" component={Adver} />
									<Route path="/home/shop" component={Shop} />
									<Route path="/home/account" component={Account} />
									<Route path="/home/swiper" component={Swiper} />
									<Route path="/home/cabinet" component={Cabinet} />
									<Route path="/home/member" component={Member} />
									<Route path="/home/clothing" component={Clothing} />
									<Route path="/home/order" component={Order} />
									<Route path="/home/intergral" component={Intergral} />
									<Route path="/home/area" component={Area} />
									<Route path="/home/shopAdver" component={ShopAdver} />
									<Route path="/home/data" component={Data} />
									<Route path="/home/exception" component={Exception} />
									<Route path="/home/options" component={Options} />
								</Switch>
							) : null}
						</div>
					</Content>
				</Layout>
				<Footer className="root_layout_footer">
					<img src={logo} />
					<span>MOVING洗衣</span>
				</Footer>
			</React.Fragment>
		);
	}
}
