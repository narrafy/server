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
                <span> Minutes {this.props.minutes} </span>
                <a href={""} onClick={this.handleOnClick} > {this.props.date} </a>
            </li>
        )
    }
}

export default Thread

