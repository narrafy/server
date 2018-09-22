import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router'
import ConversationContainer from './ConversationContainer'
import ThreadList from './ThreadList'
import { loadThreadList } from '../../../actions/thread'
import {getToken} from '../../../utils'

class DashboardContainer extends Component{

    componentDidMount()
    {
        const token = getToken()
        const { dispatch, activePage, limit } = this.props
        dispatch(loadThreadList(activePage, limit, token))
    }

    render(){
        return (
            <div className={"dashboard-container"}>
                <div className={"row"}>
                    <div className="col-md-3  col-md-offset-1">                    
                    <ThreadList />
                    </div>
                    <div className="col-md-9">
                        <ConversationContainer />
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    const { activePage, limit} = state.thread
    return { activePage, limit }
}

export default withRouter(connect(mapStateToProps)(DashboardContainer))