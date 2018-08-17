import React, {Component} from 'react'
import Footer from '../partials/Footer'
import Banner from './Banner'
import Partner from './Partner'
import Team from './Team'
import Testimonial from './Testimonial'
import Contact from '../partials/Contact'
import ReactGA from 'react-ga'

export default class About extends Component
{
    constructor()
    {
        super()
        ReactGA.pageview(window.location.pathname + window.location.search)
    }

    render(){
        return(
            <div>
                <Banner/>
                <Partner/>
                <Team />
                <Testimonial />
                <Contact />
                <Footer/>
            </div>
        )
    }
}