import React from 'react';
import { Row, Col, Button } from 'antd';
import request from '../../../request/AxiosRequest';
import echartsTheme from '../../../util/echartsTheme.js';
import echarts from 'echarts';
import PayType from './PayType';
import OrderType from './OrderType';
import './index.less';

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
		salesType: 1,
		moneyType: 1,
		salesCharts: false, // 是否展示图表
		moneyCharts: false, // 是否展示图表
	};

	async componentDidMount() {
		// 获取订单数量汇总
		await this.getOrderNumData();
		// 获取订单数量根据时间
		await this.getOrderNumDataByTime(1);
		// 获取金额数据汇总
		await this.getMoneyNumDataByTime(1);
	}

	// 获取订单数据汇总
	async getOrderNumData() {
		let res = await request.get('/order/getDataNum');
		let data = res.data || {};
		this.setState({ dataNum: data });
	}

	// 获取订单数据汇总
	async getOrderNumDataByTime(type) {
		let res = await request.get('/order/getSalesByTime', { type: type });
		echarts.registerTheme('walden', echartsTheme);
		let myChart = echarts.init(document.getElementById('data_member1'), 'walden');
		let data = res.data || [],
			echartsData = [];
		data.map((item) => {
			echartsData.push({ value: [item.days, item.count] });
		});
		if (echartsData.length == 0) return this.setState({ salesCharts: false });
		let option = this.renderCommonOption('{value} 单', '订单量', echartsData);
		this.setState({ salesCharts: true }, () => {
			myChart.setOption(option);
		});
	}

	// 获取金额数据汇总
	async getMoneyNumDataByTime(type) {
		let res = await request.get('/bill/getMoneyNumByTime', { type: type });
		echarts.registerTheme('walden', echartsTheme);
		let myChart = echarts.init(document.getElementById('data_member2'), 'walden');
		let data = res.data || [],
			echartsData = [];
		data.map((item) => {
			echartsData.push({ value: [item.days, Number(item.money)] });
		});
		if (echartsData.length == 0) return this.setState({ moneyCharts: false });
		let option = this.renderCommonOption('{value} 元', '付款金额', echartsData);
		this.setState({ moneyCharts: true }, () => {
			myChart.setOption(option);
		});
	}

	// 点击销售量按钮
	async onClickSalesBtn(type) {
		this.setState(
			{
				salesType: type,
			},
			() => this.getOrderNumDataByTime(type),
		);
	}

	// 点击销售额按钮
	async onClickMoneyBtn(type) {
		this.setState(
			{
				moneyType: type,
			},
			() => this.getMoneyNumDataByTime(type),
		);
	}

	renderCommonOption(yAxisFormatter, seriesName, data) {
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
					name: seriesName,
					type: 'line',
					data: data,
				},
			],
		};
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
				<Row>
					<Col span={12} className="data_common_detail">
						<Row className="data_common_detail_title">
							<div className="data_common_detail_title_left">订单量统计</div>
							<div className="data_common_detail_title_right">
								<Button
									type={salesType == 1 ? 'primary' : null}
									onClick={this.onClickSalesBtn.bind(this, 1)}
								>
									最近七天
								</Button>
								<Button
									type={salesType == 2 ? 'primary' : null}
									onClick={this.onClickSalesBtn.bind(this, 2)}
								>
									最近一月
								</Button>
								<Button
									type={salesType == 3 ? 'primary' : null}
									onClick={this.onClickSalesBtn.bind(this, 3)}
								>
									最近一年
								</Button>
							</div>
						</Row>
						<Row id="data_member1" className="data_common_detail_content" />
						{!salesCharts && <div className="chart_empty">暂无数据</div>}
					</Col>
					<Col span={12} className="data_common_detail">
						<Row className="data_common_detail_title">
							<div className="data_common_detail_title_left">销售额统计</div>
							<div className="data_common_detail_title_right">
								<Button
									type={moneyType == 1 ? 'primary' : null}
									onClick={this.onClickMoneyBtn.bind(this, 1)}
								>
									最近七天
								</Button>
								<Button
									type={moneyType == 2 ? 'primary' : null}
									onClick={this.onClickMoneyBtn.bind(this, 2)}
								>
									最近一月
								</Button>
								<Button
									type={moneyType == 3 ? 'primary' : null}
									onClick={this.onClickMoneyBtn.bind(this, 3)}
								>
									最近一年
								</Button>
							</div>
						</Row>
						<Row id="data_member2" className="data_common_detail_content" />
						{!moneyCharts && <div className="chart_empty">暂无数据</div>}
					</Col>
				</Row>
				<Row>
					<Col span={12} className="data_common_detail">
						<OrderType />
					</Col>
					<Col span={12} className="data_common_detail">
						<PayType />
					</Col>
				</Row>
			</div>
		);
	}
}
