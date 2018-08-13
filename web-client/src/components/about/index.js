import React, {Component} from 'react'
import Footer from '../partials/Footer'
import Banner from './Banner'
import Partner from './Partner'
import Team from './Team'
import Testimonial from './Testimonial'
import Contact from '../partials/Contact'

class About extends Component
{
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

export default About