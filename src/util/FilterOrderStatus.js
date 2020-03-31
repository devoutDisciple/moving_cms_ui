export default {
	filterOrderStatus: function (status) {
		let data = '';
		// 1-未支付 2-商家未接单 3-商家接单 4-派送中 5-订单完成 6-已取消 7-已评价
		switch (Number(status)) {
			case 1:
				data = '未派送';
				break;
			case 2:
				data = '派送中';
				break;
			case 3:
				data = '订单完成';
				break;
			case 4:
				data = '已取消';
				break;
			case 5:
				data = '已评价';
				break;
			case 6:
				data = '退款中';
				break;
			case 7:
				data = '退款完成';
				break;
			case 8:
				data = '退款失败';
				break;
		}
		return data;
	},
	// 支付类型
	filterBillType: function (status) {
		let data = '';
		// 1-工商银行 2-农业银行 3-建设银行 4-招商银行 5-邮政银行 6-支付宝 7-微信
		switch (Number(status)) {
			case 1:
				data = '工商银行';
				break;
			case 2:
				data = '农业银行';
				break;
			case 3:
				data = '建设银行';
				break;
			case 4:
				data = '招商银行';
				break;
			case 5:
				data = '邮政银行';
				break;
			case 6:
				data = '支付宝';
				break;
			case 7:
				data = '微信';
				break;
		}
		return data;
	},
	// 支付状态
	filterBillStatus: function (status) {
		let data = '';
		// 1-支付宝 2-银行卡
		switch (Number(status)) {
			case 1:
				data = '待审批';
				break;
			case 2:
				data = '拒绝';
				break;
			case 3:
				data = '已支付';
				break;
			case 4:
				data = '已撤销';
				break;
		}
		return data;
	},
	// 商品评分
	filterGoodsGrade: function (status) {
		let data = '';
		// 1-支付宝 2-银行卡
		switch (Number(status)) {
			case 1:
				data = '很差';
				break;
			case 2:
				data = '一般';
				break;
			case 3:
				data = '满意';
				break;
			case 4:
				data = '非常满意';
				break;
			case 5:
				data = '无可挑剔';
				break;
			default:
				data = '';
		}
		return data;
	},
};
