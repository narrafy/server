import React, {Component} from 'react'
import NavigationBar from '../partials/NavigationBar'
import Footer from '../partials/Footer'

class About extends Component
{
    render(){
        return(
            <div>
                <NavigationBar/>
                <div>Hello there!</div>
                <Footer/>
            </div>
        )
    }
}

export default About