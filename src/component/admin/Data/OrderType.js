import React from 'react';
import echarts from 'echarts';
import { Form, Row } from 'antd';
import Request from '../../../request/AxiosRequest';
import echartsTheme from '../../../util/echartsTheme.js';

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
		let res = await Request.get('/order/getOrderTypeNum');
		let data = res.data || [];
		echarts.registerTheme('walden', echartsTheme);
		let myChart = echarts.init(document.getElementById('order_type'), 'walden');
		// 	echartsData = [];
		// data.map((item) => {
		// 	echartsData.push({ value: [item.days, item.count] });
		// });
		// if (echartsData.length == 0) return this.setState({ showCharts: false });
		let option = this.renderOption(data);
		this.setState({ showCharts: true }, () => {
			myChart.setOption(option);
		});
	}

	renderOption(data) {
		return {
			tooltip: {
				trigger: 'item',
				formatter: '{a} <br/>{b} : {c} ({d}%)',
			},
			legend: {
				// type: 'scroll',
				orient: 'vertical',
				left: 10,
				top: 20,
				bottom: 20,
				data: ['洗衣柜下单', '上门取衣订单', '积分兑换订单', '店员录入订单'],
				// selected: ['贾郝', '薛史卜', '秦章·云宋', '祝任彭'],
			},
			series: [
				{
					name: '订单类型',
					type: 'pie',
					radius: '55%',
					center: ['40%', '50%'],
					data: [
						{ name: '洗衣柜下单', value: data.orderType1 || 0 },
						{ name: '上门取衣订单', value: data.orderType2 || 0 },
						{ name: '积分兑换订单', value: data.orderType3 || 0 },
						{ name: '店员录入订单', value: data.orderType4 || 0 },
					],
					emphasis: {
						itemStyle: {
							shadowBlur: 10,
							shadowOffsetX: 0,
							shadowColor: 'rgba(0, 0, 0, 0.5)',
						},
					},
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
				<Row id="order_type" className="data_common_detail_content" />
				{!showCharts && <div className="chart_empty">暂无数据</div>}
			</>
		);
	}
}

const EvaluateForm = Form.create()(Evaluate);
export default EvaluateForm;
