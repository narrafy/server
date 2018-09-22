import React, {Component} from 'react'
import {connect} from 'react-redux'
import FormLogin from './components/Form'
import {history} from '../../utils/history'
import {clear} from '../../actions/alert'

class Login extends Component {

        constructor(props){
                
                super(props)
                const {dispatch} = this.props
                history.listen((location, action) =>{
                        //clear alert on local change
                        dispatch(clear())
                })
        }

        render(){
                const {alert} = this.props
                return (
                        <div className="login-container">
                                <div className={"row justify-content-md-center"}>
                                        <div className="col-md-7">
                                                <div className="card">
                                                        <div className="card-body">
                                                                <h5 className="card-title text-center">Login</h5>
                                                                <p className="card-text text-center">to continue your work.</p>
                                                                {alert.message &&
                                                                    <div className={`alert ${alert.type}`}>{ alert.message }</div>
                                                                }
                                                                <FormLogin />
                                                        </div>
                                                </div>
                                        </div>
                                </div>
                        </div>
                )
        }
}

const mapStateToProps = state => {
        const {alert} = state
        return { alert }
}

export default connect(mapStateToProps)(Login)