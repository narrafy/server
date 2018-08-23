import React, {Component} from 'react'

class Thread extends Component{

    constructor(){
        super()
        this.handleOnClick = this.handleOnClick.bind(this)
    }

    handleOnClick(e)
    {   
        e.preventDefault()
        this.props.onThreadClick(this.props.id)
    }
    
    render(){
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

export default Thread

