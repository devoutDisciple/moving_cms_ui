import { observable, action } from 'mobx';
import _ from 'lodash';

class GlobalStore {
	// 是否登录
	@observable
	isLogin = false;

	// 校区list
	@observable
	campus = [];

	@action
	setLoading(boolean) {
		this.loading = boolean;
	}

	@action
	setDataSource() {
		let dataSource = [];
		for (let i = 0; i < 100; i++) {
			dataSource.push({
				key: i,
				name: _.padEnd('plane', _.random(8), '_-'),
				age: _.random(50),
				sex: _.random(10) > 5 ? '男' : '女',
				phone: `1821061${_.random(10000)}`,
				registerTime: '2018-06-02 18:00:36',
			});
		}
		this.dataSource = dataSource;
	}
}
export default new GlobalStore();
