import React from 'react';
import PropTypes from 'prop-types';
import './login.less';
import { Form, Icon, Input, Button, Row } from 'antd';
import {inject, observer} from 'mobx-react';

@inject('GlobalStore')
@observer
class Login extends React.Component{

	constructor(props) {
		super(props);
		this.globalStore = props.GlobalStore;
	}

    static propTypes = {
    	GlobalStore: PropTypes.any
    }

    btnClick() {
    	this.props.form.validateFields((err, values) => {
    		if (!err) {
    			this.globalStore.login(values);
    		}
    	});

    }

    render() {
    	const { getFieldDecorator } = this.props.form;
    	return (
    		<div className="login">
    			<div className="login_content">
    				<Row className='login_content_title'>Moving Dry Cleaner</Row>
    				<Row className='login_content_content'>
    					<Form>
    						<Form.Item className="login_content_content_row">
    							{getFieldDecorator('username', {
    								rules: [{ required: true, message: '请输入用户名!' }],
    							})(
    								<Input
    									prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
    									placeholder="Username"/>,
    							)}
    						</Form.Item>
    						<Form.Item className="login_content_content_row">
    							{getFieldDecorator('password', {
    								rules: [{ required: true, message: '请输入密码!' }],
    							})(
    								<Input
    									onPressEnter={this.btnClick.bind(this)}
    									prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
    									type="password"
    									placeholder="Password"/>,
    							)}
    						</Form.Item>
    						<Form.Item className="login_content_content_row">
    							<Button onClick={this.btnClick.bind(this)} type="primary">登录</Button>
    						</Form.Item>
    					</Form>
    				</Row>
    			</div>
    		</div>
    	);
    }
}

const LoginForm = Form.create()(Login);
export default LoginForm;
