import React from "react";
import axios from "axios";

axios.defaults.withCredentials = true; 

const Auth = App => LoginPage => {
    return class extends React.Component {
        constructor() {
            super();
            this.state = {
                loggedIn : false,
                username : null,
            }
        }
        componentDidMount() {
            // handle setting logged in if session exists
            console.log("login page section")
            axios // POST REQ
            .get('http://localhost:5000/api/users')
            .then(response => {
                console.log(response);
                this.setState({loggedIn:true});
            })
            .catch(err => {
                console.log(err)
            })
        }
        handleLogin = e => {
            e.preventDefault();
            console.log("okay, you tried")
            let loginObj = {
                username: e.target[0].value,
                password: e.target[1].value
            }
            axios // POST REQ
            .post('http://localhost:5000/api/login', loginObj)
            .then(response => {
                console.log(response)
                this.setState({loggedIn: true})
                //localStorage.setItem("cookie",JSON.stringify(response.data.cookie))
            })
            .catch(err => {
                console.log(err)
            })
        }
        handleRegister = e => {
            e.preventDefault();
            let registerObj = {
                username: e.target[0].value,
                password: e.target[1].value
            }
            axios // POST TO CREATE USER
            .post('http://localhost:5000/api/register', registerObj)
            .then(response => {
                console.log(response)
            })
            .catch(err => {
                console.log(err)
            })
        }
        logOut = e => {
            this.setState({loggedIn: false})
            axios
            .get('http://localhost:5000/api/logout')
            .then(res => {
                console.log("hey you logged out good job")
            })
            .catch(err => {
                console.log("CANT LEAVE")
            })
        }
        render() {
            if (this.state.loggedIn) {
                return (
                    <App logOut={this.logOut}/>
                )
            } else {
                return (
                    <div>
                        <LoginPage handleLogin={this.handleLogin} handleRegister={this.handleRegister}/>
                    </div>
                )
            }
        }
    }

}

export default Auth;