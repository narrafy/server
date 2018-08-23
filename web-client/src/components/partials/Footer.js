import React from 'react'
import SocialMedia from './SocialMedia'

function Footer()
{
    return(
        <footer>
            <div className="container">
                <div className="row">
                    <div className="col-md-4">
                        <p>Copyright 2018 Narrafy</p>
                    </div>
                    <div className="col-md-4 text-center">
                        <p><a href="/privacy-policy">Privacy policy</a></p>
                        <p><a href="/about">About Us</a></p>
                        <p><a href="/about#contact">Contact</a></p>
                    </div>
                    <SocialMedia />
                </div>
            </div>
        </footer>
    )
}

export default Footer