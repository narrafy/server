import React, {Component} from 'react'
import {connect} from 'react-redux'
import { loadThread } from '../../../actions/thread'
import {authToken} from '../../../utils'

class Thread extends Component{

    constructor(){
        super()
        this.handleOnClick = this.handleOnClick.bind(this)
    }

    handleOnClick(e)
    {   
        e.preventDefault()
        const { dispatch, activeThread } = this.props
        dispatch(loadThread(activeThread, authToken))
    
    }
    
    render(){
        const { id, activeThread } = this.props
        const isActive = id === activeThread
        if(isActive){
            return(
                <li className={"list-group-item active"} key={this.props.id}>
                    <a className="a-active" href={""} onClick={this.handleOnClick} > {this.props.date} </a>
                    <span class="badge badge-light">Minutes: {this.props.minutes}</span>
                    <span class="badge badge-light">Seconds: {this.props.seconds}</span>
                    <span class="badge badge-primary">Questions: {this.props.counter}</span>
                </li>
            )
        } else {
            return(
                <li className={"list-group-item"} key={this.props.id}>
                    <a href={""} onClick={this.handleOnClick} > {this.props.date} </a>
                    <span class="badge badge-light">Minutes: {this.props.minutes}</span>
                    <span class="badge badge-light">Seconds: {this.props.seconds}</span>
                    <span class="badge badge-primary">Questions: {this.props.counter}</span>
                </li>
            )
        }
    }
}
const mapStateToProps = state => {
    return {activeThread: state.thread.activeThread}
}

export default connect(mapStateToProps)(Thread) 

