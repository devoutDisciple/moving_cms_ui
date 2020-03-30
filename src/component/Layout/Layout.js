import React from 'react';
import Login from '../Login/Login';
import Home from '../Home/Home';
import { inject, observer } from 'mobx-react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import Loading from '../Loading/Loading';

@inject('GlobalStore')
@observer
export default class MyLayout extends React.Component {
	constructor(props) {
		super(props);
		this.globalStore = props.GlobalStore;
	}

	async componentDidMount() {
		await this.globalStore.getLogin();
	}

	render() {
		let { loginLoading } = this.globalStore;
		return (
			<Loading show={loginLoading}>
				<Router>
					<Switch>
						<Route exact path="/" component={Home} />
						<Route path="/login" component={Login} />
						<Route path="/home" component={Home} />
					</Switch>
				</Router>
			</Loading>
		);
	}
}
