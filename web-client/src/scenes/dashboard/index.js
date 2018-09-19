import React, {Component} from 'react'
import {withRouter} from 'react-router'
import {connect} from 'react-redux'
import DashboardContainer  from './components/DashboardContainer'
import ThreadPager  from './components/ThreadPager'


class Dashboard extends Component{

    constructor(){
        
        super()        
        this.state={
            currentPage: 0
        }
        this.onChangePage = this.onChangePage.bind(this)
    }

    componentDidMount()
    {
        const { profile, history } = this.props
        if(!profile){
            history.push()
        }
    }

    onChangePage(currentPage){
        this.setState({
            currentPage: currentPage
        })
    }
    
    render(){
        return (
            <div className={"container"}>           
                <ThreadPager />
                <DashboardContainer />
            </div>
        )
    }
}

const mapStateToProps = state => {
    const {profile} = state.auth
    return { profile }
}

export default withRouter(connect(mapStateToProps)(Dashboard))
