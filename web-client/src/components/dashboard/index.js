import React, {Component} from 'react'
import Analytics from '../analytics'
import AuthService from '../login/AuthService';
const Auth = new AuthService();

class Dashboard extends Component{

    constructor(){
        super();
        this.state = {
            profile: null
        }
        this.handleLogout = this.handleLogout.bind(this)
    }

    componentWillMount(){
        if(!Auth.loggedIn()){
            this.props.history.replace('/login')
        }
        else{
            try{
                const profile = Auth.getProfile()
                this.setState({
                    profile: profile
                })
            }catch (e) {
                Auth.logout()
                this.props.history.replace('/login')
            }
        }
    }

    handleLogout(){
        Auth.logout()

        this.setState({
            profile: null
        })

        this.props.history.replace('/login');
    }

    render(){

        if(this.state.profile){
            return(
                    <Analytics/>
            )
        }else{
            return(
                <div>
                    <div className="App-header">
                        <h2>Welcome stranger</h2>
                    </div>
                    <p className="App-intro">
                        <button type="button" className="form-submit" >Logout</button>
                    </p>
                </div>
            )
        }
    }
}

export default Dashboard;
