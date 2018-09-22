import React, {Component} from 'react'
import {connect} from 'react-redux'
import { loadThread } from '../../../actions/thread'
import {getToken} from '../../../utils'

class Thread extends Component{


    constructor(){
        super()
        this.handleOnClick = this.handleOnClick.bind(this)
    }

    handleOnClick(e)
    {   
        e.preventDefault()
        const token = getToken();
        const { dispatch, id } = this.props
        dispatch(loadThread(id, token))
    }

    render(){
        
        const { id, activeThread , minutes, date, seconds, counter } = this.props
        const isActive = id === activeThread

        if(isActive){
            return(
                <li className={"list-group-item active"} key={id}>
                    <a className="a-active" href={""} onClick= { this.handleOnClick}> {date} </a>
                    <span class="badge badge-light">Minutes: {minutes}</span>
                    <span class="badge badge-light">Seconds: {seconds}</span>
                    <span class="badge badge-primary">Questions: {counter}</span>
                </li>
            )
        } else {
            return(
                <li className={"list-group-item"} key={id}>
                    <a href={""} onClick={ this.handleOnClick } > {date} </a>
                    <span class="badge badge-light">Minutes: {minutes}</span>
                    <span class="badge badge-light">Seconds: {seconds}</span>
                    <span class="badge badge-primary">Questions: {counter}</span>
                </li>
            )
        }
    }
}

const mapStateToProps = state => {
    
    return { activeThread: state.thread.activeThread}
}

export default connect(mapStateToProps)(Thread) 

