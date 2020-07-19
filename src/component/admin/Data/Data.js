import React from 'react';
import { Row, Button } from 'antd';
import './index.less';
import request from '../../../request/AxiosRequest';
import echartsTheme from '../../../util/echartsTheme.js';
import echarts from 'echarts';

export default class Order extends React.Component {
	constructor(props) {
		super(props);
		this.renderCommonOption = this.renderCommonOption.bind(this);
	}

	state = {
		dataNum: {
			totalOrderNum: 0,
			todayOrderNum: 0,
			totalMoney: 0,
			todayMoney: 0,
			totalUserNum: 0,
			todayUserNum: 0,
			totalCabinetCellNum: 0,
			abledCabinetCellNum: 0,
		},
		orderNum: 0,
		orderPrice: 0,
		todayNum: 0,
		todayMoney: 0,
		salesType: 1,
		moneyType: 1,
		alreadyMoney: 0, //已经提现金额
		resMoney: 0, // 可提现金额，
		adminMoney: 0, // 平台营收
		salesCharts: false, // 是否展示图表
		moneyCharts: false, // 是否展示图表
	};

	async componentDidMount() {
		await this.getOrderData();
	}

	// 获取订单数据汇总
	async getOrderData() {
		let res = await request.get('/order/getDataNum');
		let data = res.data || {};
		console.log(data, 111);
		this.setState({ dataNum: data });
	}

	// 点击销售量按钮
	async onClickSalesBtn(type) {
		this.setState(
			{
				salesType: type,
			},
			() => this.getSales(type),
		);
	}

	// 点击销售量按钮
	async onClickMoneyBtn(type) {
		this.setState(
			{
				moneyType: type,
			},
			() => this.getSalesMoney(type),
		);
	}

	renderCommonOption(yAxisFormatter, data) {
		console.log(1111);
		return {
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
					formatter: yAxisFormatter,
				},
			},
			series: [
				{
					name: '销售量',
					type: 'line',
					data: data,
				},
			],
		};
	}

	// 获取本周销售总量
	async getSales(type) {
		let res = await request.get('/order/getSales', { type: type });
		echarts.registerTheme('walden', echartsTheme);
		let myChart = echarts.init(document.getElementById('data_member1'), 'walden');
		let data = res.data || [],
			echartsData = [];
		data.map((item) => {
			echartsData.push({ value: [item.days, item.count] });
		});
		if (echartsData.length == 0) return this.setState({ salesCharts: false });
		let option = this.renderCommonOption('{value} 单', echartsData);
		this.setState({ salesCharts: true }, () => {
			myChart.setOption(option);
		});
	}

	// 获得销售额数据汇总
	async getSalesMoney(type) {
		let res = await request.get('/order/getMoney', { type: type });
		let myChart = echarts.init(document.getElementById('data_member2'));
		let data = res.data || [],
			echartsData = [];
		data.map((item) => {
			echartsData.push({ value: [item.days, Number(item.money)] });
		});
		if (echartsData.length == 0) return this.setState({ moneyCharts: false });
		let option = this.renderCommonOption('{value} 元', echartsData);
		this.setState({ moneyCharts: true }, () => {
			myChart.setOption(option);
		});
	}

	async getData() {
		let res = await request.get('/order/getData');
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

	render() {
		let { moneyType, salesType, salesCharts, moneyCharts, dataNum } = this.state;
		return (
			<div className="data">
				<div className="data_cart">
					<div className="data_cart_chunk">
						<div className="data_cart_chunk_title">订单总量（单）</div>
						<div className="data_cart_chunk_number">{dataNum.totalOrderNum || 0}</div>
						<div className="data_cart_chunk_bottom">今日订单总量： {dataNum.todayOrderNum || 0}</div>
					</div>
					<div className="data_cart_chunk">
						<div className="data_cart_chunk_title">销售额（元）</div>
						<div className="data_cart_chunk_number">{dataNum.totalMoney || 0}</div>
						<div className="data_cart_chunk_bottom">今日销售额： {dataNum.todayMoney || 0}</div>
					</div>
					<div className="data_cart_chunk">
						<div className="data_cart_chunk_title">柜子格口数量</div>
						<div className="data_cart_chunk_number">{dataNum.totalCabinetCellNum || 0}</div>
						<div className="data_cart_chunk_bottom">剩余可用格口： {dataNum.abledCabinetCellNum || 0}</div>
					</div>
					<div className="data_cart_chunk">
						<div className="data_cart_chunk_title">会员数量（人）</div>
						<div className="data_cart_chunk_number">{dataNum.totalUserNum || 0}</div>
						<div className="data_cart_chunk_bottom">今日新增： {dataNum.todayUserNum || 0}</div>
					</div>
				</div>
				<Row className="data_common_detail">
					<Row className="data_common_detail_title">
						<div className="data_common_detail_title_left">订单量统计</div>
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
					<Row id="data_member1" className="data_common_detail_content" />
					{!salesCharts && <div className="chart_empty">暂无数据</div>}
				</Row>
				<Row className="data_common_detail">
					<Row className="data_common_detail_title">
						<div className="data_common_detail_title_left">销售额统计</div>
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
					<Row id="data_member2" className="data_common_detail_content" />
					{!moneyCharts && <div className="chart_empty">暂无数据</div>}
				</Row>
			</div>
		);
	}
}
