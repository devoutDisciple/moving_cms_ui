import {
	observable,
	action,
	runInAction
} from 'mobx';
import request from '../../request/AxiosRequest';

class GlobalStore {

	// login的loading效果
	@observable
	loginLoading = true;

	// 是否登录
    @observable
	isLogin = false;

	// 用户信息
	@observable
	userinfo = {
		shopid: '',
		username: '',
		role: 2
	}

    // 校区list
    @observable
	campus = [];

	@action
    setUserinfo(data) {
    	let userinfo = this.userinfo;
    	this.userinfo = Object.assign(userinfo, data);
    }

    // loading的动画效果
    @action
	setLoading(boolean) {
    	this.loginLoading = boolean;
	}

	// 用户是否登录
	@action
    setLogin(boolean) {
    	this.isLogin = boolean;
    }

	// 设置校区
	@action
	setCampus(data) {
		this.campus = data;
	}

    // 查看当前用户是否登录
    @action
	async getLogin() {
    	this.setLoading(true);
    	try {
    		let user = await request.get('/account/isLogin');
    		runInAction(() => {
				if(user.data.role == 2) {
					this.setUserinfo({
						shopid: user.data.shopid
					});
				}
				this.setUserinfo({
					username: user.data.username,
					role: user.data.role
				});
    			this.setLoading(false);
    		});
    	} catch (error) {
    		this.setLoading(false);
    		console.log(error);
    	}
	}

	 // 用户登录
	 @action
	 async login(values) {
		 this.setLogin(false);
		 try {
			 let user = await request.post('/account/login', values);
			 runInAction(() => {
    			if(user.data.role == 2) {
    				this.setUserinfo({
    					shopid: user.data.shopid
    				});
    			}
				 this.setUserinfo({
					 username: user.data.username,
					 role: user.data.role
				 });
				 if(user.data.role == 2) {
    				location.hash = '#/home/shop/order';
    				localStorage.setItem('campus', user.data.campus);
				 }
				 if(user.data.role == 1) {
    				location.hash = '#/home/shop';
				 }
				 this.setLogin(true);
			 });
		 } catch (error) {
			 this.setLogin(false);
			 console.log(error);
		 }
    }

	// 退出登录
	@action
	 async logout() {
	 	try {
	 		await request.get('/account/logout');
	 		runInAction(() => {
	 			this.setUserinfo({
	 				username: '',
	 				role: ''
	 			});
	 			location.hash = '#/login';
	 		});
	 	} catch (error) {
	 		this.setUserinfo({
	 			username: '',
	 			role: ''
	 		});
	 		location.hash = '#/login';
	 		console.log(error);
	 	}
	 }
}
export default new GlobalStore();
