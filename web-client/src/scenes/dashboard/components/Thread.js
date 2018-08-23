import React from 'react'

export default function Thread(props){
    return(
        <li key={props.id}>
            <span> {props.date} </span>
            <a href="#" > {props.id} </a>
        </li>
    )
}
