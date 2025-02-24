import 'react-dropdown/style.css';
import './AddParticipant.css'
import TextField from '@material-ui/core/TextField';
import { useState } from "react";
import Autocomplete,
{ createFilterOptions } from '@material-ui/lab/Autocomplete';
import {ScheduleMeeting} from 'react-schedule-meeting';

const filter = createFilterOptions();

function AddParticipant() {
    
    const [data,setData] = useState([])
    const [res,setRes] = useState([])
    const [selectedData, setSelectedData] = useState('Empty');
    const meetingDays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    
    let start_Time = "";
    let end_Time = "";
    let meeting_Day = "";
    const timeSlots = [];

    const handleTextInputChange = async e => {
        if(res.length == 0){
            const response = await fetch(`http://127.0.0.1:8081/api/calender/members`, {
                    method: 'GET',
                    crossDomain:true,
                    headers: {'Content-Type': 'application/json'}
                  })
            const result = await response.json()
            setData(result.data)
            const temp = []
            data.forEach(element => {
                for (const [key, value] of Object.entries(element)) {
                    //console.log(`${key} ${value}`);
                    temp.push(value)
                }
            });
            setRes(temp)
        }
    }
    const handleOnClick = async e => {
        let id = ''
        data.forEach(element => {
            for (const [key, value] of Object.entries(element)) {
                console.log(selectedData)
                if(value == selectedData) {
                    id = key
                    break
                }
            }
        });
        const response = await fetch(`http://127.0.0.1:8081/api/calender/members/${id}`, {
                method: 'GET',
                crossDomain:true,
                headers: {'Content-Type': 'application/json'}
              })
        const result = await response.json()
        console.log(result.data);
        const obj = result.data;

        for (const [key, value] of Object.entries(obj)) {
            if(key === "start_time")
                start_Time = value;
            else if(key === "end_time")
                end_Time = value;
            else if(key === "meeting_days")
                meeting_Day = value;
        }

        
        for(let i=1;i<14;i++) {
            let date = new Date(new Date().setDate(new Date().getDate() + i));
            if(date.getDay()==meetingDays.indexOf(meeting_Day)){
                timeSlots.push(i);
            }
        }
    }

    const availableTimeslots = timeSlots.map((id) => {
        console.log(id);
        return {
            id,
            startTime: new Date(new Date(new Date().setDate(new Date().getDate() + id)).setHours(9, 0, 0, 0)),
            endTime: new Date(new Date(new Date().setDate(new Date().getDate() + id)).setHours(17, 0, 0, 0)),
        };
    });

    const handleValueChange = async (e,v) => {
        setSelectedData(v)
    }

    return (
        <div>
            <div style={{ marginLeft: '10px', marginTop: '10px' }}>
                <h3>Add Participant!</h3>
                <Autocomplete
                    disablePortal
                    options={res}
                    id="combo-box-demo"
                    style={{ width: 300 }}
                    onChange={handleValueChange}
                    renderInput={(params) => (
                    <TextField {...params} label="Enter Something"
                        variant="outlined" value={selectedData} onChange={handleTextInputChange}/>
                    )}/>
                    <button style={{marginLeft:'40%'}} onClick={handleOnClick}> Get Available Slots </button>
            </div>
        <div>
        <ScheduleMeeting
            borderRadius={10}
            primaryColor="#3f5b85"
            eventDurationInMinutes={15}
            availableTimeslots={availableTimeslots}
            onStartTimeSelect={console.log}
        />
    </div>
    </div>
      );
    }
 
    
export default AddParticipant;