import React from 'react';
import { Row, Col, DatePicker } from 'antd';
import request from '../../../request/AxiosRequest';
import echartsTheme from '../../../util/echartsTheme.js';
import echarts from 'echarts';
import PayType from './PayType';
import OrderType from './OrderType';
import moment from 'moment';
import './index.less';

const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';

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
			cabinetUseTimes: 0,
			cabinetUseErrorTimes: 0,
		},
		salesNum: 0,
		moneyNum: 0,
		salesCharts: false, // 是否展示图表
		moneyCharts: false, // 是否展示图表
	};

	async componentDidMount() {
		// 获取订单数量汇总
		await this.getOrderNumData();
		let startTime = moment(moment().subtract(7, 'days')).format(dateFormat);
		let endTime = moment().format(dateFormat);
		await this.onSearchSalesData([startTime, endTime]);
		await this.getMoneyNumDataByTime([startTime, endTime]);
	}

	// 获取订单数据汇总
	async getOrderNumData() {
		let res = await request.get('/order/getDataNum');
		let data = res.data || {};
		this.setState({ dataNum: data });
	}

	// 获取单位时间内订单数据
	async onSearchSalesData(value) {
		if (value) {
			let startTime = moment(value[0]).format(dateFormat),
				endTime = moment(value[1]).format(dateFormat),
				salesNum = 0;
			let res = await request.get('/order/getSalesByRange', { startTime, endTime });
			echarts.registerTheme('walden', echartsTheme);
			let myChart = echarts.init(document.getElementById('data_member1'), 'walden');
			let data = res.data || [],
				echartsData = [];
			data.map((item) => {
				salesNum += Number(item.count);
				echartsData.push({ value: [moment(item.days).format(dateFormat), Number(item.count)] });
			});
			if (echartsData.length == 0) return this.setState({ salesCharts: false });
			let option = this.renderCommonOption('{value} 单', '订单量', echartsData);
			this.setState({ salesCharts: true, salesNum }, () => {
				myChart.setOption(option);
			});
		}
	}

	// 获取金额数据汇总
	async getMoneyNumDataByTime(value) {
		if (value) {
			let startTime = moment(value[0]).format(dateFormat),
				endTime = moment(value[1]).format(dateFormat),
				moneyNum = 0;
			let res = await request.get('/order/getMoneyByRange', { startTime, endTime });
			echarts.registerTheme('walden', echartsTheme);
			let myChart = echarts.init(document.getElementById('data_member2'), 'walden');
			let data = res.data || [],
				echartsData = [];
			data.map((item) => {
				moneyNum += Number(item.count);
				echartsData.push({ value: [moment(item.days).format(dateFormat), Number(item.count)] });
			});
			if (echartsData.length == 0) return this.setState({ moneyCharts: false });
			let option = this.renderCommonOption('{value} 元', '付款金额', echartsData);
			this.setState({ moneyCharts: true, moneyNum: moneyNum.toFixed(2) }, () => {
				myChart.setOption(option);
			});
		}
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
		let { salesCharts, moneyCharts, dataNum, salesNum, moneyNum } = this.state;
		let successRate = '0%';
		if (dataNum.cabinetUseTimes > 0) {
			successRate =
				Math.round(
					((dataNum.cabinetUseTimes - dataNum.cabinetUseErrorTimes) / dataNum.cabinetUseTimes) * 10000,
				) /
					100.0 +
				'%';
		}
		return (
			<div className="data">
				<div className="data_cart">
					<div className="data_cart_chunk">
						<div className="data_cart_chunk_title">订单总量(单)</div>
						<div className="data_cart_chunk_number">{dataNum.totalOrderNum || 0}</div>
						<div className="data_cart_chunk_bottom">今日订单总量： {dataNum.todayOrderNum || 0}</div>
					</div>
					<div className="data_cart_chunk">
						<div className="data_cart_chunk_title">总收入(元)</div>
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
					<div className="data_cart_chunk">
						<div className="data_cart_chunk_title">格口操作次数</div>
						<div className="data_cart_chunk_number">{dataNum.cabinetUseTimes || 0}</div>
						<div className="data_cart_chunk_bottom">
							失败次数：{dataNum.cabinetUseErrorTimes || 0} 成功率：{successRate}
						</div>
					</div>
				</div>
				<Row>
					<Col span={12} className="data_common_detail">
						<Row className="data_common_detail_title">
							<div className="data_common_detail_title_left">订单量统计</div>
							<div className="data_common_detail_title_right">
								<RangePicker
									defaultValue={[
										moment(moment().subtract(7, 'days'), dateFormat),
										moment(new Date(), dateFormat),
									]}
									onChange={this.onSearchSalesData.bind(this)}
								/>
								<span style={{ marginLeft: '10px', fontSize: '14px' }}> 共: {salesNum} 单</span>
							</div>
						</Row>
						<Row id="data_member1" className="data_common_detail_content" />
						{!salesCharts && <div className="chart_empty">暂无数据</div>}
					</Col>
					<Col span={12} className="data_common_detail">
						<Row className="data_common_detail_title">
							<div className="data_common_detail_title_left">销售额统计</div>
							<div className="data_common_detail_title_right">
								<RangePicker
									defaultValue={[
										moment(moment().subtract(7, 'days'), dateFormat),
										moment(new Date(), dateFormat),
									]}
									onChange={this.getMoneyNumDataByTime.bind(this)}
								/>
								<span style={{ marginLeft: '10px', fontSize: '14px' }}> 共: {moneyNum} 元</span>
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
