import React from 'react'
import SocialMedia from './SocialMedia'
import {twitterUrl, facebookUrl, mediumUrl} from '../../config'

function Footer()
{
    const data = {
        twitter: twitterUrl,
        facebook: facebookUrl,
        medium: mediumUrl
    }

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
                    </div>
                    <SocialMedia props={data} />
                </div>
            </div>
        </footer>
    )
}

export default Footer