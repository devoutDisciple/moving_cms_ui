const env = true; // 线上环境
// const env = false; // 线下环境

export default {
	site: {
		// 初始化位置信息
		longitude: 120.050247, // 经度
		latitude: 30.282795, // 纬度
		name: '浙江省杭州市余杭区五常街道西溪水岸花苑',
	},
	baseUrl: env ? 'http://47.107.43.166/movingxiyi' : 'http://localhost:8080', // 线上环境
};
