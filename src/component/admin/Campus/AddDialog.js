import React from 'react';
import {
	Form, Input, Modal, Row, Col, Icon, message
} from 'antd';
import './zTree/jquery-1.4.4.min.js';
import './zTree/zTreeStyle.css';
import './zTree/jquery.ztree.core.min';
import './zTree/jquery.ztree.excheck.min';
import './zTree/jquery.ztree.exedit.min';
import Request from '../../../request/AxiosRequest';
import {inject, observer} from 'mobx-react';
const FormItem = Form.Item;
let newCount = 1;

@inject('CampusStore')
@observer
class AddDialog extends React.Component {

	constructor(props) {
		super(props);
		this.getTime = this.getTime.bind(this);
		this.beforeEditName = this.beforeEditName.bind(this);
		this.beforeRemove = this.beforeRemove.bind(this);
		this.onRemove = this.onRemove.bind(this);
		this.beforeRename = this.beforeRename.bind(this);
		this.addHoverDom = this.addHoverDom.bind(this);
		this.removeHoverDom = this.removeHoverDom.bind(this);
		this.onRename = this.onRename.bind(this);
		this.campusStore = props.CampusStore;
	}

	state = {
		zNodes: []
	};

	componentDidMount() {
		this.initZtree();
	}

	initZtree() {
		const setting = {
			view: {
				addHoverDom: this.addHoverDom,//用于当鼠标移动到节点上时，显示用户自定义控件
				removeHoverDom: this.removeHoverDom,//用于当鼠标移出节点时，隐藏用户自定义控件
				selectedMulti: false
			},
			edit: {
				enable: true,
				editNameSelectAll: true,//节点编辑名称 input 初次显示时,设置 txt 内容是否为全选状态
				showRemoveBtn: true,//设置是否显示删除按钮
				showRenameBtn: true,//设置是否显示编辑名称按钮
				removeTitle: '删除节点',
				renameTitle: '编辑'
			},
			data: {
				simpleData: {
					enable: true//true / false 分别表示 使用 / 不使用 简单数据模式
				}
			},
			callback: {
				beforeEditName: this.beforeEditName,
				beforeRemove: this.beforeRemove,
				beforeRename: this.beforeRename,
				onRemove: this.onRemove,
				onRename: this.onRename
			}
		};

		// var zNodes =[
		// 	{ id:1, pId:0, name:'父节点 1', open:true},
		// 	{ id:11, pId:1, name:'叶子节点 1-1'},
		// 	{ id:12, pId:1, name:'叶子节点 1-2'},
		// 	{ id:13, pId:1, name:'叶子节点 1-3'},
		// 	{ id:2, pId:0, name:'父节点 2', open:true},
		// 	{ id:21, pId:2, name:'叶子节点 2-1'},
		// 	{ id:22, pId:2, name:'叶子节点 2-2'},
		// 	{ id:23, pId:2, name:'叶子节点 2-3'},
		// 	{ id:3, pId:0, name:'父节点 3', open:true},
		// 	{ id:31, pId:3, name:'叶子节点 3-1'},
		// 	{ id:32, pId:3, name:'叶子节点 3-2'},
		// 	{ id:33, pId:3, name:'叶子节点 3-3'}
		// ];
		setTimeout(() => {
			$.fn.zTree.init($('#campus_tree'), setting, this.state.zNodes);
		}, 0);
	}

	beforeEditName(treeId, treeNode) {
		var zTree = $.fn.zTree.getZTreeObj('campus_tree');
		zTree.selectNode(treeNode);
		setTimeout(function() {
			zTree.editName(treeNode);
		}, 0);
		return false;
	}

	beforeRemove(treeId, treeNode) {
		var zTree = $.fn.zTree.getZTreeObj('campus_tree');
		zTree.selectNode(treeNode);
		// return confirm('确认删除 节点 -- ' + treeNode.name + ' 吗？');
		return true;
	}

	onRename() {
		let nodes = $.fn.zTree.getZTreeObj('campus_tree').getNodes();
		let newNodes = this.getNodes(nodes, []);
		this.setState({
			zNodes: newNodes
		});
	}

	onRemove(e, treeId, treeNode) {
		console.log('remove: ', treeNode);
	}

	beforeRename(treeId, treeNode, newName) {
		if (newName.length == 0) {
			setTimeout(function() {
				var zTree = $.fn.zTree.getZTreeObj('campus_tree');
				zTree.cancelEditName();
				alert('节点名称不能为空.');
			}, 0);
			return false;
		}
		return true;
	}

	addHoverDom(treeId, treeNode) {
		var sObj = $('#' + treeNode.tId + '_span');
		if (treeNode.editNameFlag || $('#addBtn_'+treeNode.tId).length>0) return;
		var addStr = '<span class=\'button add\' id=\'addBtn_' + treeNode.tId
			+ '\' title=\'添加\' onfocus=\'this.blur();\'></span>';
		sObj.after(addStr);
		var btn = $('#addBtn_'+treeNode.tId);
		if (btn) btn.bind('click', function(){
			var zTree = $.fn.zTree.getZTreeObj('campus_tree');
			newCount++;
			zTree.addNodes(treeNode, {id:(100 + newCount), pId:treeNode.id, name:'三级菜单'});
			return false;
		});
	}

	removeHoverDom(treeId, treeNode) {
		$('#addBtn_'+treeNode.tId).unbind().remove();
	}

	getTime() {
		var now= new Date(),
			h=now.getHours(),
			m=now.getMinutes(),
			s=now.getSeconds(),
			ms=now.getMilliseconds();
		return (h+':'+m+':'+s+ ' ' +ms);
	}

	addCampus() {
		let zNodes = this.state.zNodes;
		console.log(zNodes, 111);
		zNodes.push({ id: new Date().getTime(), pId: newCount, name:'二级菜单', open:true});
		this.setState({
			zNodes: zNodes
		}, () => {
			newCount++;
			this.initZtree();
		});
	}

	getNodes(nodes, arr) {
		nodes.map(item => {
			let obj = {};
			obj.id = item.id;
			obj.pId = item.pId;
			obj.name = item.name;
			if(item.children && item.children.length != 0) {
				obj.children = [];
				this.getNodes(item.children, obj.children);
			}
			arr.push(obj);
		});
		return arr;
	}

	handleOk()  {
		this.props.form.validateFields(async (err, values) => {
			try {
				if (err) return;
				let nodes = $.fn.zTree.getZTreeObj('campus_tree').getNodes();
				let newNodes = this.getNodes(nodes, []);
				let params = Object.assign(values, {floor: newNodes});
				let result = await Request.post('/position/add', params);
				if(result.data == 'success') {
					message.success('新增成功');
					this.props.onSearch();
					return this.props.controllerAddDialog();
				}
			} catch (error) {
				console.log(error);
			}
		});
	}

	handleCancel() {
		this.props.controllerAddDialog();
	}

	render() {
		const { getFieldDecorator } = this.props.form;
		const formItemLayout = {
			labelCol: { span: 4 },
			wrapperCol: { span: 20 },
		};
		return (
			<div>
				<Modal
					className='common_dialog'
					title="新增校区"
					visible={true}
					onOk={this.handleOk.bind(this)}
					onCancel={this.handleCancel.bind(this)}>
					<Form {...formItemLayout} onSubmit={this.handleSubmit}>
						<FormItem
							label="校区名称">
							{getFieldDecorator('name', {
								rules: [{
									required: true,
									message: '请输入',
								}],
							})(
								<Input placeholder="请输入校区名称" />
							)}
						</FormItem>
						<FormItem
							label="权重">
							{getFieldDecorator('sort', {
								rules: [{
									required: true,
									message: '请输入',
								}],
							})(
								<Input type="number" placeholder="请输入权重, 权重越高, 排名越靠前" />
							)}
						</FormItem>
						<Row className='campus_container'>
							<Col span={4} className='campus_container_label'>楼号录入：</Col>
							<Col span={20}>
								<Col span={20} id="campus_tree" className="ztree"></Col>
								<Col span={2} className="campus_tree_icon">
									<Icon onClick={this.addCampus.bind(this)} type="plus-circle" />
									{/* <Button type='primary' onClick={this.addCampus.bind(this)}>添加楼号</Button> */}
								</Col>
							</Col>
						</Row>
					</Form>
				</Modal>
			</div>
		);
	}
}

const AddDialogForm = Form.create()(AddDialog);
export default AddDialogForm;
