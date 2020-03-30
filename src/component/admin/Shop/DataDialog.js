import React from 'react';
import { Card, Row, Button, Modal } from 'antd';
import './index.less';
import request from '../../../request/AxiosRequest';
import echarts from 'echarts';

export default class Order extends React.Component {
	constructor(props) {
		super(props);
	}

	state = {
		orderNum: 0,
		orderPrice: 0,
		todayNum: 0,
		todayMoney: 0,
		salesType: 1,
		moneyType: 1,
		alreadyMoney: 0, //已经提现金额
		resMoney: 0, // 可提现金额
	};

	async componentDidMount() {
		let shopid = this.props.shopid;
		setTimeout(() => {
			// 获取厨房数据汇总
			this.getData(shopid);
			// 获取销售量的数据汇总
			this.getSalesByShopid(shopid);
			// 获取销售额的数据汇总
			this.getSalesMoneyByShopid(shopid);
		}, 100);
		this.getMoneyBillAlready();
	}

	// 获取已提现金额和可提现金额
	async getMoneyBillAlready() {
		let shopid = this.props.shopid;
		let res = await request.get('/bill/getBillMoneyReadyByShopid', { shopid: shopid });
		let data = res.data;
		this.setState({
			alreadyMoney: data.alreadyMoney || 0, //已经提现金额
			resMoney: data.resMoney || 0, // 可提现金额
		});
	}

	// 点击销售量按钮
	async onClickSalesBtn(type) {
		this.setState(
			{
				salesType: type,
			},
			() => this.getSalesByShopid(type),
		);
	}

	// 点击销售量按钮
	async onClickMoneyBtn(type) {
		this.setState(
			{
				moneyType: type,
			},
			() => this.getSalesMoneyByShopid(type),
		);
	}

	// 获取本周销售总量
	async getSalesByShopid(type) {
		let shopid = this.props.shopid;
		let res = await request.get('/order/getSalesByShopid', { shopid: shopid, type: type });
		let myChart = echarts.init(document.getElementById('data_member1'));
		let data = res.data || [];
		let echartsData = [];
		if (data.length == 0) return;
		data.map((item) => {
			echartsData.push({ value: [item.days, item.count] });
		});
		let option = {
			grid: {
				left: '3%',
				right: '4%',
				bottom: '3%',
				containLabel: true,
			},
			tooltip: {
				trigger: 'axis',
			},
			xAxis: {
				type: 'time',
				boundaryGap: false,
				splitLine: {
					show: false,
				},
			},
			yAxis: {
				type: 'value',
				axisLabel: {
					formatter: '{value} 单',
				},
			},
			series: [
				{
					name: '销售量',
					type: 'line',
					data: echartsData,
					lineStyle: {
						color: '#2fc25b',
					},
				},
			],
		};
		// 使用刚指定的配置项和数据显示图表。
		myChart.setOption(option);
	}

	// 获得销售额数据汇总
	async getSalesMoneyByShopid(type) {
		let shopid = this.props.shopid;
		let res = await request.get('/order/getMoneyByShopid', { shopid: shopid, type: type });
		let myChart = echarts.init(document.getElementById('data_member2'));
		let data = res.data || [];
		if (data.length == 0) return;
		let echartsData = [];
		data.map((item) => {
			echartsData.push({ value: [item.days, Number(item.money)] });
		});
		let option = {
			grid: {
				left: '3%',
				right: '4%',
				bottom: '3%',
				containLabel: true,
			},
			tooltip: {
				trigger: 'axis',
			},
			xAxis: {
				type: 'time',
				boundaryGap: false,
				splitLine: {
					show: false,
				},
			},
			yAxis: {
				type: 'value',
				axisLabel: {
					formatter: '{value} 元',
				},
			},
			series: [
				{
					name: '销售额',
					type: 'line',
					data: echartsData,
					lineStyle: {
						color: '#1890ff',
					},
				},
			],
		};
		// 使用刚指定的配置项和数据显示图表。
		myChart.setOption(option);
	}

	async getData(shopid) {
		let res = await request.get('/order/getDataByShopid', { shopid: shopid });
		let data = res.data;
		this.setState({
			orderNum: data.orderNum || 0,
			orderPrice: data.orderPrice || 0,
			todayNum: data.todayNum && data.todayNum.length != 0 && data.todayNum[0].count ? data.todayNum[0].count : 0,
			todayMoney:
				data.todayMoney && data.todayMoney.length != 0 && data.todayMoney[0].count
					? data.todayMoney[0].count
					: 0,
		});
	}

	handleCancel() {
		this.props.onControllerDataVisible();
	}

	render() {
		// alreadyMoney: data.alreadyMoney || 0, //已经提现金额
		// resMoney: data.resMoney || 0, // 可提现金额
		let { orderNum, orderPrice, moneyType, salesType, todayNum, todayMoney, alreadyMoney, resMoney } = this.state;
		return (
			<Modal
				className="common_dialog common_max_dialog_max"
				title="厨房数据汇总"
				visible={true}
				onOk={this.handleCancel.bind(this)}
				onCancel={this.handleCancel.bind(this)}
			>
				<div className="shop_dialog_data">
					<div className="data_little_charts">
						<Card title="今日订单量(单)" className="data_little_charts_cart">
							<span>{todayNum}</span>
						</Card>
						<Card title="今日销售额(单)" className="data_little_charts_cart">
							<span>{todayMoney}</span>
						</Card>
						<Card title="订单总量(单)" className="data_little_charts_cart">
							<span>{orderNum}</span>
						</Card>
						<Card title="总销售额(元)" className="data_little_charts_cart">
							<span>{orderPrice}</span>
						</Card>
						<Card title="已提现(元)" className="data_little_charts_cart">
							<span>{alreadyMoney}</span>
						</Card>
						<Card title="可提现金额(元)" className="data_little_charts_cart">
							<span>{resMoney}</span>
						</Card>
					</div>
					<Row className="data_common_detail">
						<Row className="data_common_detail_title">
							<div className="data_common_detail_title_left">订单数量</div>
							<div className="data_common_detail_title_right">
								<Button
									type={salesType == 1 ? 'primary' : null}
									onClick={this.onClickSalesBtn.bind(this, 1)}
								>
									本周
								</Button>
								<Button
									type={salesType == 2 ? 'primary' : null}
									onClick={this.onClickSalesBtn.bind(this, 2)}
								>
									本月
								</Button>
								<Button
									type={salesType == 3 ? 'primary' : null}
									onClick={this.onClickSalesBtn.bind(this, 3)}
								>
									本年
								</Button>
							</div>
						</Row>
						<Row id="data_member1" className="data_common_detail_content"></Row>
					</Row>
					<Row className="data_common_detail">
						<Row className="data_common_detail_title">
							<div className="data_common_detail_title_left">销售额</div>
							<div className="data_common_detail_title_right">
								<Button
									type={moneyType == 1 ? 'primary' : null}
									onClick={this.onClickMoneyBtn.bind(this, 1)}
								>
									本周
								</Button>
								<Button
									type={moneyType == 2 ? 'primary' : null}
									onClick={this.onClickMoneyBtn.bind(this, 2)}
								>
									本月
								</Button>
								<Button
									type={moneyType == 3 ? 'primary' : null}
									onClick={this.onClickMoneyBtn.bind(this, 3)}
								>
									本年
								</Button>
							</div>
						</Row>
						<Row id="data_member2" className="data_common_detail_content"></Row>
					</Row>
				</div>
			</Modal>
		);
	}
}
