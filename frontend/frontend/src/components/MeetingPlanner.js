import React, { Component } from "react";
import AddParticipant from './AddParticipant'
import './MeetingPlanner.css'
class MeetingPlanner extends Component {
    

render() {
        return <div className='rowC'>
            <AddParticipant />
        </div>
    }
}

export default MeetingPlanner;