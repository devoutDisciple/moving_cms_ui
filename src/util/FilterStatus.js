export default {
	// 会员等级
	filterMemberStatus: function (status) {
		let data = '';
		switch (Number(status)) {
			case 1:
				data = '普通用户';
				break;
			case 2:
				data = '黄金会员';
				break;
			case 3:
				data = '钻石会员';
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
};
