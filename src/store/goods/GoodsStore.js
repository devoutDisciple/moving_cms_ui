import {
	observable,
	action,
	runInAction
} from 'mobx';
import request from '../../request/AxiosRequest';

class GoodsStore {

    // 厨房列表
    @observable
	shopList = [];

	// 菜品信息
	@observable
	goodsList = [];

	 // 设置厨房列表
	 @action
	 setShopList(data) {
		 this.shopList = data;
	 }

	 //  设置菜品信息
	 @action
	 setGoodsList(data) {
	 	this.goodsList = data;
	 }

	// 获取所有厨房信息
	@action
	 async getAllShop() {
	 	try {
			 let res = await request.get('/shop/getAllForSelect');
	 		runInAction(() => {
				 let data = res.data || [];
				 data.map(item => {
					 item.key = item.id;
				 });
				 this.setShopList(res.data || []);
	 		});
	 	} catch (error) {
	 		console.log(error);
	 	}
	 }

	//  获取所有商品信息
	@action
	async getAllGoods(id) {
		try {
			let res = await request.get('/goods/getByShopId', {id});
			runInAction(() => {
				let data = res.data || [];
				data.map(item => {
					item.key = item.id;
				});
				this.setGoodsList(res.data || []);
			});
		} catch (error) {
			console.log(error);
		}
	}

}
export default new GoodsStore();
