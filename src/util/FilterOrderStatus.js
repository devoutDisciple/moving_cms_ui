export default {
	// 筛选订单状态
	filterOrderStatus: function (status) {
		let data = '';
		// 1-存储在柜子 2-店员取货，清洗中 3-待付款 4-待取货 5-已完成 6-预约上门，未付款 7-积分兑换  8-预约上门取衣，已付款
		switch (Number(status)) {
			case 1:
				data = '待取货';
				break;
			case 2:
				data = '清洗中';
				break;
			case 3:
				data = '用户待付款';
				break;
			case 4:
				data = '用户待取货';
				break;
			case 5:
				data = '已完成';
				break;
			case 6:
				data = '预约上门，未付款';
				break;
			case 7:
				data = '积分兑换';
				break;
			case 8:
				data = '预约上门取衣，已付款';
				break;
			case 9:
				data = '店员录入订单';
				break;
		}
		return data;
	},
	// 筛选订单类型
	filterOrderType: function (status) {
		let data = '';
		// 下单类型：1-通过柜子下单 2-上门取衣 3-积分兑换 4-店员录入订单
		switch (Number(status)) {
			case 1:
				data = '洗衣柜订单';
				break;
			case 2:
				data = '上门取衣订单';
				break;
			case 3:
				data = '积分兑换订单';
				break;
			case 4:
				data = '店员录入订单';
				break;
		}
		return data;
	},
	// 判断洗衣柜是否打开
	filterCabinetSuccess: function (status) {
		let data = '';
		// 下单类型：1-成功 2-失败
		switch (Number(status)) {
			case 1:
				data = '成功';
				break;
			case 2:
				data = '失败';
				break;
		}
		return data;
	},
	// 判断洗衣柜打开人员类型
	filterCabinetUserType: function (status) {
		let data = '';
		// 下单类型：1-用户 2-店员
		switch (Number(status)) {
			case 1:
				data = '用户';
				break;
			case 2:
				data = '店员';
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
