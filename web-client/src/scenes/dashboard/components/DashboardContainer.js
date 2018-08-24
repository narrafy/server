import React, {Component} from 'react'
import ConversationContainer from './ConversationContainer'
import ThreadList from './ThreadList'

import {withRouter} from 'react-router'
import ApiClient from '../../../services/api/ApiClient'
import Auth from '../../../services/auth'
import {conversation} from "../../../config"

class DashboardContainer extends Component{

    render(){
        return (
            <div className={"container"}>
                <div className={"dashboard-container"}>
                    <div className={"row"}>
                        <div className="col-md-3  col-md-offset-1">                    
                        <ThreadList 
                            activeThread={this.props.activeThread} 
                            threads={this.props.threads} 
                            onThreadClick={this.props.onThreadClick}/>
                        </div>
                        <div className="col-md-9">
                            <ConversationContainer messages={this.props.messages} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(DashboardContainer)