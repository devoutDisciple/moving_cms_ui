import {
	observable,
	action,
	runInAction
} from 'mobx';
import request from '../../request/AxiosRequest';

class SwiperStore {

    // 轮播图list
    @observable
	swiperList = [];


	// 所有厨房信息
	@observable
	allShopDetail = [];

	// 设置轮播图
	@action
	setSwiperList(data) {
    	this.swiperList = data;
	}

	// 设置厨房
	@action
	setAllShopDetail(data) {
		this.allShopDetail = data;
	}

	//  获取所有轮播图
	@action
	 async getSwiper() {
	 	try {
	 		let res = await request.get('/swiper/all');
	 		runInAction(() => {
				let data = res.data || [];
				data.map((item, index) => {
					item.key = index;
				});
				this.setSwiperList(data || []);
	 		});
	 	} catch (error) {
	 		console.log(error);
	 	}
	 }

	 //  新增轮播图
	@action
	async addSwiper(formData) {
		try {
			let res = await request.post('/swiper/add', formData);
			return res;
		} catch (error) {
			console.log(error);
		}
	}

	 //  新增轮播图
	 @action
	 async updateSwiper(formData) {
		 try {
			 let res = await request.post('/swiper/update', formData);
			 return res;
		 } catch (error) {
			 console.log(error);
		 }
	 }

	// 获取所有厨房信息
	@action
	 async getAllShop() {
	 	try {
	 		let res = await request.get('/shop/getAllForSelect');
	 		runInAction(() => {
	 			let data = res.data || [];
	 			data.map((item, index) => {
	 				item.key = index;
	 			});
	 			this.setAllShopDetail(data || []);
	 		});
	 	} catch (error) {
	 		console.log(error);
	 	}
	 }
}
export default new SwiperStore();
