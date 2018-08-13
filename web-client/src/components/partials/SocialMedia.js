import React from 'react'
import {SocialIcon} from 'react-social-icons'
import {twitterUrl, facebookUrl, mediumUrl} from '../../config'

function SocialMedia()
{
    return (
        <div className="col-md-4 pull-right">
            <p>Follow us on social media: </p>
            <ul className="social">
                <li className="nav-item offset-1">
                    <SocialIcon url={facebookUrl} color="white" />
                </li>
                <li className="nav-item offset-1">
                    <SocialIcon url={twitterUrl} color="white" />
                </li>
                <li className="nav-item offset-1">
                    <SocialIcon url={mediumUrl} color="white" />
                </li>
            </ul>
        </div>
    )
}

export default SocialMedia