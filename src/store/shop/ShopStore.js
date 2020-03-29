import { observable, action, runInAction } from 'mobx';
import request from '../../request/AxiosRequest';

class ShopStore {
	// 轮播图list
	@observable
	list = [];

	@action
	setList(data) {
		this.list = data;
	}

	// 获取所有厨房信息
	@action
	async getAll(value) {
		try {
			let shop = await request.get('/shop/all', value);
			runInAction(() => {
				let data = shop.data || [];
				data.map((item) => {
					item.key = item.id;
				});
				this.setList(shop.data || []);
			});
		} catch (error) {
			console.log(error);
		}
	}

	// 新增商铺
	@action
	async addShop(data) {
		try {
			let shop = await request.post('/shop/add', data);
			return shop;
		} catch (error) {
			console.log(error);
		}
	}

	// 修改厨房
	@action
	async updateShop(data) {
		try {
			let shop = await request.post('/shop/update', data);
			return shop;
		} catch (error) {
			console.log(error);
		}
	}

	// 开店或者关店
	async closeOrOpen(data) {
		try {
			let shop = await request.post('/shop/closeOrOpen', data);
			return shop;
		} catch (error) {
			console.log(error);
		}
	}
}
export default new ShopStore();
