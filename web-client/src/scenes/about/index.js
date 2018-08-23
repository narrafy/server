import React, {Component} from 'react'
import Banner from './components/Banner'
import Partner from './components/Partner'
import Team from './components/Team'
import Testimonial from './components/Testimonial'

import Subscribe from '../../components/partials/Subscribe'
import Contact from '../../components/partials/Contact'
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
                <Subscribe/>
                <Partner/>
                <Team />
                <Testimonial />
                <Contact />
            </div>
        )
    }
}