import React from 'react'

function Die(props){

    let styles = {
        backgroundColor: props.isHeld ? "#59E391" : "white"
    }

    return (
        <div 
        className='die' 
        style={styles}
        onClick={props.onHold}
        >
            <h1>{props.value}</h1>
        </div>
    )
}

export default Die;