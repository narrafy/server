import React, {Component} from 'react'
import DashboardContainer  from './components/DashboardContainer'
import ThreadPager  from './components/ThreadPager'
import {withRouter} from 'react-router'

class Dashboard extends Component{

    constructor(){
        
        super()        
        this.state={
            currentPage: 0
        }
        this.onChangePage = this.onChangePage.bind(this)
    }

    onChangePage(currentPage){
        this.setState({
            currentPage: currentPage
        })
    }
    
    render(){
        return (
            <div className={"container"}>           
                <ThreadPager onChangePage={this.onChangePage} />
                <DashboardContainer page={this.state.currentPage} />
            </div>
        )
    }
}

export default withRouter(Dashboard)