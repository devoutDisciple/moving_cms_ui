import React from 'react';
import echarts from 'echarts';
import { Form, Row } from 'antd';
import Request from '../../../request/AxiosRequest';
import echartsTheme from '../../../util/echartsTheme.js';
import './index.less';

class Evaluate extends React.Component {
	constructor(props) {
		super(props);
	}

	state = {
		type: 1,
		showCharts: false,
	};

	async componentDidMount() {
		await this.getOrderNumDataByTime();
	}

	// 获取订单数据汇总
	async getOrderNumDataByTime() {
		let res = await Request.get('/bill/getAllMoneyByType');
		console.log(res, 8888);
		echarts.registerTheme('walden', echartsTheme);
		let myChart = echarts.init(document.getElementById('bill_type'), 'walden');
		let data = res.data || [];
		let option = this.renderOption(data);
		this.setState({ showCharts: true }, () => {
			myChart.setOption(option);
		});
	}

	renderOption(data) {
		return {
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					// 坐标轴指示器，坐标轴触发有效
					type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
				},
			},
			grid: {
				left: '3%',
				right: '8%',
				bottom: '3%',
				containLabel: true,
			},
			xAxis: [
				{
					type: 'category',
					data: ['充值费用', '购买会员', '存放柜子收费', '订单支付', '上门取衣派送费'],
					axisTick: {
						alignWithLabel: true,
					},
				},
			],
			yAxis: [
				{
					type: 'value',
				},
			],
			series: [
				{
					name: '收取金额',
					type: 'bar',
					barWidth: '60%',
					data: [
						data.recharge || 0,
						data.member || 0,
						data.save_clothing || 0,
						data.order || 0,
						data.clothing || 0,
					],
				},
			],
		};
	}

	// 点击销售额按钮
	async changeType(type) {
		this.setState({ type: type }, () => this.getOrderNumDataByTime(type));
	}

	render() {
		let { showCharts } = this.state;
		return (
			<>
				<Row className="data_common_detail_title">
					<div className="data_common_detail_title_left">订单类型分析</div>
				</Row>
				<Row id="bill_type" className="data_common_detail_content" />
				{!showCharts && <div className="chart_empty">暂无数据</div>}
			</>
		);
	}
}

const EvaluateForm = Form.create()(Evaluate);
export default EvaluateForm;
