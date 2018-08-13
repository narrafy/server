import React from 'react'

function SocialMedia(props)
{
    return (
        <div className="col-md-4 pull-right">
            <ul className="social">
                <p>Follow us on social media: </p>
                <li className="nav-item">
                    <a className="nav-link" href={props.facebook}> <i className="fa fa-facebook" aria-hidden="true"></i>
                        {props.facebook}
                    </a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href={props.twitter}><i className="fa fa-twitter" aria-hidden="true"></i></a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href={props.medium}><i className="fa fa-medium" aria-hidden="true"></i></a>
                </li>
            </ul>
        </div>
    )
}

export default SocialMedia