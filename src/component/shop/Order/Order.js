import React from 'react';
import {
	Button, Checkbox, Form, Col, Row, Input, DatePicker, message, Tabs, Tooltip, Popconfirm
} from 'antd';
const { TabPane } = Tabs;
const FormItem = Form.Item;
// const { Option } = Select;
import Request from '../../../request/AxiosRequest';
import moment from 'moment';
import {inject, observer} from 'mobx-react';
import './index.less';
import FilterOrderStatus from '../../../util/FilterOrderStatus';
import EvaluateDialog from './EvaluateDialog';

@inject('GlobalStore')
@observer
class Order extends React.Component{

	constructor(props) {
		super(props);
		this.globalStore = this.props.GlobalStore;
	}

	state = {
		campus: '',
		position: [],
		positionActive: 'all', // 默认选择全部  订单地址
		print: 'all', // 默认选择全部  发货单状态 1-未打印 2-打印 all-全部
		sendtab: 1, // 配送的tab 1-等待派送 2-派送中 3-成功  4-取消   6-评价 7-退款
		orderList: [],
		selectedRowKeys: '',
		selectedRows: [],
		checkAll: false, // 是否全选
		titleData: [], // 头标数
		evaluateDialogVisible: false, // 显示评价弹框
		evaluateData: {}, // 评价数据
		sendResult: { // 未派送和退款中的订单数量
			sendNum: 0,
			payNum: 0
		},
		newOrderNum: 0, // 新订单的数量
	}

	async componentDidMount() {
		// 获取厨房位置信息
		await this.getShopDetail();
		// 查询厨房订单信息
		await this.goodsSearchBtnClick();
		await this.getAllOrderNum();
		if(!window.location.href.includes('localhost')) {
			window.goodsTimer = setInterval(async () => {
				await this.getAllOrderNum();
				await this.goodsSearchBtnClick();
			}, 1000 * 15);
		}
	}

	componentWillUnmount() {
		clearInterval(window.goodsTimer);
	}

	// 获取订单数据数量
	async getAllOrderNum() {
		let shopid = this.globalStore.userinfo.shopid;
		let position = this.state.position;
		// 获取订单数量
		let res = await Request.get('/order/getNumData', {id: shopid, floor: position});
		// 查看是否有未派送和退款中订单
		let sendResult = await Request.get('/order/getOrderByStatusForSendAndPay', {id: shopid});
		// 查看是否有新的订单
		let newResult = await Request.get('/order/getNewOrderByShopId', {id: shopid});
		let newOrderNum = newResult.data ? newResult.data.newOrderNum : 0;
		let oldOrderNum = this.state.newOrderNum;
		if(oldOrderNum < newOrderNum) {
			message.success('您有新的订单');
		}
		this.setState({
			titleData: res.data || [],
			sendResult: sendResult.data || {sendNum: 0, payNum: 0},
			newOrderNum: newOrderNum
		});
	}

	// 获取厨房订单数据
	async getShopDetail() {
		let shopid = this.globalStore.userinfo.shopid;
		let shop = await Request.get('/shop/getShopByShopid', {id: shopid});
		let campus = shop.data.campus || '';
		let result = await Request.get('/position/getPositionByCampus', {campus});
		let floor = JSON.parse(result.data.floor) || [];
		let position = [];
		floor.map(item => {
			if(item.children && item.children.length) {
				item.children.map(address => {
					position.push(`${item.name} ${address.name}`);
				});
			}
		});
		this.setState({
			campus, position
		});
	}

	// 位置按钮点击的时候
	positionClick(positionActive) {
		this.setState({positionActive}, () => this.goodsSearchBtnClick());
	}

	// 是否打印点击的时候后
	printClick(print) {
		this.setState({print}, () => this.goodsSearchBtnClick());
	}

	// 派送tab点击之后
	sendTabClick(status) {
		this.setState({sendtab: status, checkAll: false}, () => this.goodsSearchBtnClick());
	}

	// 改变单个按钮是否选择的时候
	checkboxClick(record) {
		let orderList = this.state.orderList;
		for(let item of orderList) {
			if(item.id == record.id) {
				item.checked = !item.checked;
				break;
			}
		}
		this.setState({orderList});
	}

	// 点击全选的时候
	checkBoxAllClick() {
		let {checkAll, orderList} = this.state;
		this.setState({checkAll: !checkAll}, () => {
			orderList.map(item => item.checked = !checkAll);
			this.setState({orderList});
		});
	}

	// 点击查询
	async goodsSearchBtnClick() {
		let {positionActive, print, sendtab} = this.state;
		let value = this.props.form.getFieldsValue();
		if(value.time) {
			value.start_time = moment(value.start_time).format('YYYY-MM-DD HH:mm:ss');
			value.end_time = moment(value.end_time).format('YYYY-MM-DD HH:mm:ss');
		}
		let shopid = this.globalStore.userinfo.shopid;
		let params = {
			campus: positionActive,
			print: print,
			shopid: shopid,
			sendtab: sendtab,
			...value
		};
		let result = await Request.post('/order/getOrderByStatusAndPosition', params);
		let {orderList} = this.state;
		let data = result.data || [];
		data.map((item, index) => {
			let flag = false;
			orderList.map(order => {
				if(order.id == item.id) flag = true;
			});
			if(flag) item.checked = true;
			item.key = index;
			item.orderList = JSON.parse(item.orderList) || [];
			item.order_time = moment(item.order_time).format('YYYY-MM-DD HH:mm:ss');
		});
		this.setState({orderList: data});
	}

	// 批量派送
	async tokenOrders(type) {
		let data = [];
		let orderList = this.state.orderList;
		orderList.map(item => {
			item.checked ? data.push(item) : null;
		});
		if(data.length == 0) return message.warning('请勾选操作的订单');
		let params = [];
		data.map(item => {
			params.push({
				id: item.id,
				status: type
			});
		});
		let res = await Request.post('/order/updateMoreStatus', {data: params});
		if(res.data == 'success') {
			message.success('操作成功');
			this.getAllOrderNum();
			this.goodsSearchBtnClick();
		}
	}

	// 改变订单状态
	async onChangeOrderStatus(record, status) {
		let res = await Request.post('/order/updateStatus', {id: record.id, status});
		if(res.data == 'success') {
			message.success('更改成功');
			return this.goodsSearchBtnClick();
		}
	}

	// 取消订单
	async cancelOrder(data) {
		let result = await this.onConfirmSure(data);
		let res = await Request.post('/order/updateStatus', {id: data.id, status: 4});
		if(res.data == 'success' && result.data == 'success') {
			message.success('取消成功');
			return this.goodsSearchBtnClick();
		}
	}

	// 打印订单
	async allPrint() {
		let data = [];
		let orderList = this.state.orderList;
		orderList.map(item => {
			item.checked ? data.push(item) : null;
		});
		if(data.length == 0) return message.warning('请勾选操作的订单');
		let params = [];
		// let ids = [];
		data.map(item => {
			params.push({
				id: item.id,
				print: 2
			});
			// ids.push(item.id);
		});
		let res = await Request.post('/order/updateMorePrint', {data: params});
		if(res.data == 'success') {
			message.success('打印中');
			this.goodsSearchBtnClick();
		}
		// await Request.post('/print/printMoreOrder', {ids});
		params.map(item => {
			Request.post('/print/printOrder', {id: item.id});
		});

	}

	// 同意退款
	async onConfirmSure(record) {
		let res = await Request.post('/pay/getBackPayMoney', {id: record.id});
		if(res.data == 'success') {
			message.success('退款成功');
			return this.goodsSearchBtnClick();
		}
	}

	// 拒绝退款
	async onConfirmRefuse(record) {
		let res = await Request.post('/order/updateStatus', {id: record.id, status: 8});
		if(res.data == 'success') {
			message.success('操作成功');
			return this.goodsSearchBtnClick();
		}
	}

	// 查看评价
	evaluateClick(data) {
		this.setState({
			evaluateData: data
		}, () => this.onControllerEvaluateDialogVisible());
	}

	onControllerEvaluateDialogVisible() {
		this.setState({
			evaluateDialogVisible: !this.state.evaluateDialogVisible
		});
	}

	render() {
		let {
			position,
			positionActive,
			print,
			orderList,
			checkAll,
			sendtab,
			titleData,
			evaluateDialogVisible,
			evaluateData,
			sendResult
		} = this.state;
		const { getFieldDecorator } = this.props.form;
		const formItemLayout = {
			labelCol: { span: 8 },
			wrapperCol: { span: 16 },
		};
		return (
			<div className='common shop_order'>
				<Row className='shop_order_title'>
					<Button
						onClick={this.positionClick.bind(this, 'all')}
						type={positionActive == 'all' ? 'primary' : null}>全部订单</Button>
					{
						position && position.length != 0 ?
							position.map((item, index) => {
								return <Button
									className='shop_order_title_btn'
									key={index}
									type={positionActive == item ? 'primary' : null}
									onClick={this.positionClick.bind(this, item)}>
									{item}
									{
										titleData[index] > 0 ?
											<span className='shop_order_title_btn_span'>{titleData[index]}</span>
											: null
									}
								</Button>;
							})
							: null
					}
				</Row>
				<div className='shop_order_search'>
					<Form {...formItemLayout}>
						<Row>
							<Col span={6}>
								<FormItem
									label="宝贝名称">
									{getFieldDecorator('name')(
										<Input placeholder="请输入"/>
									)}
								</FormItem>
							</Col>
							<Col span={6}>
								<FormItem
									label="买家名称">
									{getFieldDecorator('people')(
										<Input placeholder="请输入"/>
									)}
								</FormItem>
							</Col>
							<Col span={6}>
								<FormItem
									label="订单编号">
									{getFieldDecorator('id')(
										<Input placeholder="请输入"/>
									)}
								</FormItem>
							</Col>
							<Col span={6}>
								<FormItem
									label="手机号">
									{getFieldDecorator('phone')(
										<Input placeholder="请输入"/>
									)}
								</FormItem>
							</Col>
						</Row>
						<Row className="shop_order_search_time">
							<Col span={6}>
								<FormItem label="成交时间：从" colon={false}>
									{getFieldDecorator('start_time')(
										<DatePicker style={{minWidth: 0}} showTime format="YYYY-MM-DD HH:mm:ss" />,
									)}
								</FormItem>
							</Col>
							<Col span={6}>
								<FormItem className="shop_order_search_small" label="到" colon={false}>
									{getFieldDecorator('end_time')(
										<DatePicker style={{minWidth: 0}} showTime format="YYYY-MM-DD HH:mm:ss" />,
									)}
								</FormItem>
							</Col>
							<Col span={6}>
								<Button className='goods_search_btn' onClick={this.goodsSearchBtnClick.bind(this)} type='primary'>查询</Button>
							</Col>
						</Row>
					</Form>
				</div>
				<Row className="shop_order_tabs">
					<Tabs defaultActiveKey="1" onTabClick={this.sendTabClick.bind(this)}>
						<TabPane tab={
							<span className='shop_order_tabs_span'>
								待派送
								{sendResult.sendNum ? <a className='shop_order_tabs_dot'></a> : null}
							</span>}
						key="1"
						/>
						{/* <TabPane tab={<span className='shop_order_tabs_span'>待派送{sendResult.sendNum ? <a className='shop_order_tabs_dot'></a> : null}</span>} key="1" /> */}
						<TabPane tab={<span>派送中</span>} key="2" />
						<TabPane tab={
							<span className='shop_order_tabs_span'>
								退款中
								{sendResult.payNum ? <a className='shop_order_tabs_dot'></a> : null}
							</span>}
						key="6"
						/>
						{/* <TabPane tab={<span className='shop_order_tabs_span'>退款中{sendResult.payNum ? <a className='shop_order_tabs_dot'></a> : null}</span>} key="6" /> */}
						<TabPane tab={<span>成功的订单</span>} key="3" />
						<TabPane tab={<span>关闭的订单</span>} key="4" />
					</Tabs>
				</Row>
				<Row className="shop_order_print">
					<Col className="shop_order_print_left" span={8}><Checkbox checked={checkAll} onChange={this.checkBoxAllClick.bind(this)}>全选</Checkbox></Col>
					<Col className="shop_order_print_center" span={8}>发货单:
						<Button onClick={this.printClick.bind(this, 'all')} type={print == 'all' ? 'primary' : null}>全部</Button>
						<Button onClick={this.printClick.bind(this, 1)} type={print == 1 ? 'primary' : null}>未打印</Button>
						<Button onClick={this.printClick.bind(this, 2)} type={print == 2 ? 'primary' : null}>已打印</Button>
					</Col>
					<Col className="shop_order_print_right" span={8}></Col>
				</Row>
				<div className='common_content'>
					<Row className="shop_order_table_title">
						<Col span={3}>宝贝</Col>
						<Col span={3}>单价</Col>
						<Col span={3}>数量</Col>
						<Col span={3}>备注</Col>
						<Col span={3}>收货信息</Col>
						<Col span={3}>交易状态</Col>
						<Col span={3}>实收款</Col>
						{
							sendtab == 6 ?
								<Col span={3}>操作</Col>
								: null
						}
						{
							sendtab != 6 ?
								<Col span={3}>评价</Col>
								: null
						}

					</Row>
					{
						orderList && orderList.length != 0 ?
							orderList.map((item, index) => {
								return (
									<Row key={index} className="shop_order_table_chunk">
										<Row className="shop_order_table_content">
											<Row className="shop_order_table_content_title">
												<Checkbox
													onChange={this.checkboxClick.bind(this, item)}
													checked={item.checked}>
													订单号: {item.id}
												</Checkbox>
												<span>创建时间：{item.order_time}</span>
											</Row>
											<Row className="shop_order_table_content_table">
												<Col className="shop_order_table_content_table_left" span={9}>
													{
														item.orderList && item.orderList.length != 0 ?
															item.orderList.map((order, i) => {
																return (
																	<Row className="shop_order_table_content_table_left_chunk" key={i}>
																		<Col span={8}>
																			<Col span={8} className="shop_order_table_content_table_left_chunk_col"><img src={order.goodsUrl}/></Col>
																			<Col offset={1} span={15} className="shop_order_table_content_table_left_chunk_row">
																				<Row className="shop_order_table_content_table_left_chunk_row_content">
																					<Row className="shop_order_table_content_table_left_chunk_row_name">
																						<Tooltip placement="top" title={order.goodsName}>
																							{order.goodsName}
																						</Tooltip>
																					</Row>
																				</Row>
																				<Row className="shop_order_table_content_table_left_chunk_row_content">
																					<Row className="shop_order_table_content_table_left_chunk_row_desc">
																						<Tooltip placement="top" title={order.specification}>
																						规格: {order.specification ? order.specification : null}
																						</Tooltip>
																					</Row>
																				</Row>
																			</Col>
																		</Col>
																		<Col span={8} className="shop_order_table_content_table_left_chunk_col">{order.price}</Col>
																		<Col span={8} className="shop_order_table_content_table_left_chunk_col">{order.num}</Col>
																	</Row>
																);
															})
															: null
													}
												</Col>
												<Col
													className="shop_order_table_content_table_right"
													span={15}
													style={{height: `${item.orderList.length * 100}px`, lineHeight: `${item.orderList.length * 100}px`}}>
													<Col className="shop_order_table_content_table_right_chunk" span={5}>{item.desc ? item.desc : '--'}</Col>
													<Col className="shop_order_table_content_table_right_chunk"span={5}>
														<Row className="shop_order_table_content_table_right_chunk_address">
															<Row>地址: {item.address}</Row>
															<Row>姓名: {item.people}</Row>
															<Row>电话: {item.phone}</Row>
														</Row>
													</Col>
													<Col
														className="shop_order_table_content_table_right_chunk"span={5}>
														{FilterOrderStatus.filterOrderStatus(item.status)}
														{
															sendtab == 1 || sendtab == 2 ?
																<Popconfirm placement="top" title="是否确认取消该订单" onConfirm={this.cancelOrder.bind(this, item)} okText="确认" cancelText="取消">
																	<a href="javascript:;" style={{marginLeft: '5px', fontSize: '10px'}}>
																		取消该订单
																	</a>
     															</Popconfirm>
														 	: null
														}
													</Col>
													<Col className="shop_order_table_content_table_right_chunk"span={5}>{item.total_price}</Col>
													{
														sendtab != 6 ?
															<Col className="shop_order_table_content_table_right_chunk"span={4}>
																{item.status == 5 ? <a onClick={this.evaluateClick.bind(this, item)} href="javascript:;">查看</a> : '--'}
															</Col>
															: null
													}
													{
														sendtab == 6 ?
															<Col className="shop_order_table_content_table_right_chunk common_table_span"span={4}>
																<Popconfirm placement="top" title="是否确认同意" onConfirm={this.onConfirmSure.bind(this, item)} okText="确认" cancelText="取消">
																	<a href="javascript:;" >同意</a>
     															</Popconfirm>
																 <Popconfirm placement="top" title="是否确认拒绝" onConfirm={this.onConfirmRefuse.bind(this, item)} okText="确认" cancelText="取消">
																	<a href="javascript:;" >拒绝</a>
     															</Popconfirm>
															</Col>
															: null
													}
												</Col>
											</Row>
										</Row>
									</Row>
								);
							})
							: null
					}

				</div>
				<Row className="shop_order_fixed">
					{
						sendtab == 1 || sendtab == 2 ?
							<Button onClick={this.allPrint.bind(this)}>批量打印订单</Button>
							: null
					}
					{
						sendtab == 1 ?
							<Button onClick={this.tokenOrders.bind(this, 2)}>批量派送</Button>
							: null
					}
					{
						sendtab == 2 ?
							<Button onClick={this.tokenOrders.bind(this, 3)}>批量送达</Button>
							: null
					}
				</Row>
				{
					evaluateDialogVisible ?
						<EvaluateDialog
							data={evaluateData}
							onControllerEvaluateDialogVisible={this.onControllerEvaluateDialogVisible.bind(this)}/>
						: null
				}
			</div>
		);
	}
}

const OrderForm = Form.create()(Order);
export default OrderForm;
