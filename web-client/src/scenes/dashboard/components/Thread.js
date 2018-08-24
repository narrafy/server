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
        const isActive = this.props.isActive
        if(isActive){
            return(
                <li className={"list-group-item active"} key={this.props.id}>
                    <a className="a-active" href={""} onClick={this.handleOnClick} > {this.props.date} </a>
                    <span class="badge badge-light">Minutes: {this.props.minutes}</span>
                    <span class="badge badge-light">Seconds: {this.props.seconds}</span>
                    <span class="badge badge-primary">Questions: {this.props.counter}</span>
                </li>
            )
        }else{
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

export default Thread

