import {
	observable,
	action
} from 'mobx';
import _ from 'lodash';

class FormStore {

    @observable
    columns = [{
    	title: '姓名',
    	dataIndex: 'name',
    	key: 'name',
    }, {
    	title: '年龄',
    	dataIndex: 'age',
    	key: 'age',
    }, {
    	title: '性别',
    	dataIndex: 'sex',
    	key: 'sex',
    }, {
    	title: '手机号',
    	dataIndex: 'phone',
    	key: 'phone',
    }, {
    	title: '注册时间',
    	dataIndex: 'registerTime',
    	key: 'address',
    }];

    @observable
    dataSource = [];

    @observable
    loading = true;

    @observable
    addDialogVisible = false;

    @observable
    editDialogVisible = false;

    @observable.ref
    editData = {}

    @action
    setEditData(data) {
    	this.editData = data;
    }

    @action
    setEditDialogVisible(boolean) {
    	this.editDialogVisible = boolean;
    }

    @action
    setAddDialogVisible(boolean) {
    	this.addDialogVisible = boolean;
    }

    @action
    setLoading(boolean) {
    	this.loading = boolean;
    }

    @action
    setDataSource() {
    	let dataSource = [];
    	for(let i = 0; i< 100; i++) {
    		dataSource.push({
    			key: i,
    			name: _.padEnd('plane', _.random(8), '_-'),
    			age: _.random(50),
    			sex: _.random(10) > 5 ? '男' : '女',
    			phone: `1821061${_.random(10000)}`,
    			registerTime: '2018-06-02 18:00:36'
    		});
    	}
    	this.dataSource = dataSource;
    }
}
export default new FormStore();
