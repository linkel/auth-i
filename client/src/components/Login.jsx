import React from 'react';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            display: "login",
        }
    }
    showRegister = () => {
        this.setState({display : "register"})
    }
    showLogin = () => {
        this.setState({display : "login"})
    }
    render() {
        return (
            <div>
                {this.state.display === "login" ?
                <div>
                <form onSubmit={(e) => {this.props.handleLogin(e)}}>
                    <input type="text" placeholder="username"></input>
                    <input type="text" placeholder="password"></input>
                    <input type="submit"/> 
                </form>
                <button onClick={this.showRegister}>Don't have a username yet?</button>
                </div>
                :
                <div>
                <form onSubmit={(e) => {this.props.handleRegister(e)}}>
                    <input type="text" placeholder="username"></input>
                    <input type="text" placeholder="password"></input>
                    <input type="submit"/> 
                </form>
                <button onClick={this.showLogin}>Already have a username?</button>
                </div>
                }
            </div>
        )
    }
}

export default Login;