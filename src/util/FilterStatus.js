export default {
	// 会员等级
	filterMemberStatus: function (status) {
		let data = '';
		switch (Number(status)) {
			case 1:
				data = '普通用户';
				break;
			case 2:
				data = 'MOVING会员';
				break;
			case 3:
				data = 'MOVING PLUS会员';
				break;
			default:
				data = '普通用户';
		}
		return data;
	},
	// 区域等级
	filterAreaStatus: function (status) {
		let data = '';
		switch (Number(status)) {
			case 1:
				data = '省';
				break;
			case 2:
				data = '市';
				break;
			case 3:
				data = '区';
				break;
			default:
				data = '省';
		}
		return data;
	},
	// 是否正常运行
	filterActiveStatus: function (status) {
		let data = '';
		switch (Number(status)) {
			case 1:
				data = '是';
				break;
			case 2:
				data = '否';
				break;
			default:
				data = '是';
		}
		return data;
	},
	// 意见反馈的状态
	filterOptionsStatus: function (status) {
		let data = '';
		switch (Number(status)) {
			case 1:
				data = '待处理';
				break;
			case 2:
				data = '已处理';
				break;
			default:
				data = '待处理';
		}
		return data;
	},
	// 支付类型
	filterPayType: function (status) {
		let data = '';
		switch (status) {
			case 'order':
				data = '订单支付';
				break;
			case 'clothing':
				data = '上门取衣';
				break;
			case 'recharge':
				data = '余额充值';
				break;
			case 'member':
				data = '购买会员';
				break;
			default:
				data = '--';
		}
		return data;
	},
	// 支付方式
	filterPayMothod: function (status) {
		let data = '';
		switch (status) {
			case 'alipay':
				data = '支付宝';
				break;
			case 'wechat':
				data = '微信';
				break;
			default:
				data = '--';
		}
		return data;
	},
};
