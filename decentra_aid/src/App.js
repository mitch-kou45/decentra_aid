import logo from './logo.svg';
import './App.css';
import {useEffect, useState} from 'react';

// Import web3
const Web3 = require('web3').default;
const web3 = new Web3("http://127.0.0.1:8545"); // Adjust to your provider (e.g., Ganache or Infura URL)

// Contract ABI and Address
const contractABI = require('./DecentraAid.json').abi;
const contractAddress = "0xdEE61Bae88a5E743e39444b2e0e6E8EE6E493085";
const Contract = new web3.eth.Contract(contractABI, contractAddress);

async function getHours() {
	try{
  	const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const account = accounts[0];
    const userHours = await Contract.methods.getHours().call({from: account, gas:500000, gasPrice: web3.utils.toWei('50', 'gwei')});
    
    document.getElementById("hoursOutput").innerHTML = "Hours: " + userHours;
    
    console.log(userHours);
    
	}catch(error){
		console.error("Error Getting Hours: ", error);
	}
}

async function getAttendance() {

	try{
  	const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const account = accounts[0];
    const userAttendance = await Contract.methods.getAttendanceRate().call({from: account, gas:500000, gasPrice: web3.utils.toWei('50', 'gwei')});
    document.getElementById("attendanceOutput").innerHTML = "Attendance: " + userAttendance;
      	     
	}catch(error){
		console.error("Error Getting Attendance: ", error);
	}

}

async function StartEvent(eventId) {
	try{
		const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
		const account = accounts[0];
		
		await Contract.methods.startEvent(eventId).send({from: account, gas:500000, gasPrice: web3.utils.toWei('50', 'gwei')});
		
		console.log("Event Started");
      	      
	}catch(error){
		console.error("Error Starting Event: ", error);
	}
}

async function EndEvent(eventId) {
	
	try{
  	const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const account = accounts[0];
    
    await Contract.methods.endEvent(eventId).send({from: account, gas:500000, gasPrice: web3.utils.toWei('50', 'gwei')});
    
    console.log("Event Ended");  
        
	}catch(error){
		console.error("Error Ending Event: ", error);
	}
	
}

async function signUps(name, eventId) {
	try{
		const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
		const account = accounts[0];

		await Contract.methods.signUp(name, eventId).send({from: account, gas:500000, gasPrice: web3.utils.toWei('50', 'gwei')});
		
		console.log("Signing Up");
      	      
	}catch(error){
		console.error("Error Signing Up: ", error);
	}
}

async function signUpsLeader(name, eventId) {
	try{
		const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
		const account = accounts[0];
		
		await Contract.methods.signUpAsLeader(name, eventId).send({from: account, gas:500000, gasPrice: web3.utils.toWei('50', 'gwei')});
		
		console.log("Signing Up As Leader");
      	      
	}catch(error){
		console.error("Error Signing Up as Leader: ", error);
	}
}

async function userShow(name, eventId) {
	try{
		const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
		const account = accounts[0];
		
		await Contract.methods.show(name, eventId).send({from: account, gas:500000, gasPrice: web3.utils.toWei('50', 'gwei')});
		
		console.log("User Show");
      	      
	}catch(error){
		console.error("Error Showing User: ", error);
	}
}

async function volunteerNames(eventId) {
	
	try{
		const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
		const account = accounts[0];
		const volunteers = await Contract.methods.getNamesOfVolunteers(eventId).call();
		
		console.log("Getting Names");
		
		document.getElementById("volunteerNamesOutput").innerHTML = "Volunteers: " + volunteers;
      	            
	}catch(error){
		console.error("Error Getting Names: ", error);
	}
}

async function leadersNames(eventId) {
	
	try{
		const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
		const account = accounts[0];
		const leaders = await Contract.methods.getNamesOfLeader(eventId).call();
		console.log("Getting Names");
		document.getElementById("leaderNamesOutput").innerHTML = "Leaders: " + leaders;    
	}catch(error){
		console.error("Error Getting Names: ", error);
	}
	
}

async function getNumberOfEvent(){

	try{
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
		const account = accounts[0];     	      
		const numberOfEvents = await Contract.methods.getNumberOfEvents().call({from: account, gas:500000, gasPrice: web3.utils.toWei('50', 'gwei')});
		return numberOfEvents;
	}catch(error){
		console.error("Error Getting Number Of Events: ", error);
	}
}

async function getNumberOfVolunteers(eventId){

	try{
		let numberOfVolunteers = await Contract.methods.getNumberOfVolunteers(eventId).call();
		document.getElementById("numberOfVolunteers").innerHTML = "Number of Volunteers: " + numberOfVolunteers;  
		    
	}catch(error){
		console.error("Error Getting Number Of Volunteers: ", error);
	}
	
}

async function getNumberOfLeaders(eventId){
	
	try{
	
		let numberOfLeaders = await Contract.methods.getNumberOfLeaders(eventId).call();
		document.getElementById("numberOfLeaders").innerHTML = "Number of Leaders: " + numberOfLeaders;
    
	}catch(error){
		console.error("Error Getting Number Of Leaders: ", error);
	}

}

async function connect() {
	try { 
  	if (window.ethereum) {
  		App.web3Provider = window.ethereum;
  		try {
    		await window.ethereum.enable();;
			} catch (error) {
    		console.error("User denied account access 0: ", error);
			}
		}
		
  } catch (error) {
    console.error("User denied account access 1: ", error);
  }
  
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  const account = accounts[0]; 
}


function App() {

	const [events, setEvents] = useState([]);
	const getEvents = async () => {

		const listOfEvents = [];
		
		try{
    	const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0];     	      
      	      
      let numberOfEvents = await Contract.methods.getNumberOfEvents().call({from: account, gas:500000, gasPrice: web3.utils.toWei('50', 'gwei')});
      numberOfEvents = Number(numberOfEvents);
      console.log("Number of Events: ", numberOfEvents);
      if(numberOfEvents != 0){
	      
    		for(let i = 1; i <= (numberOfEvents); i++){
		  		const volunteerEventName = await Contract.methods.getEventName(i).call({from: account, gas:500000, gasPrice: web3.utils.toWei('50', 'gwei')});
		  		const volunteerOrgName = await Contract.methods.getOrganizationName(i).call({from: account, gas:500000, gasPrice: web3.utils.toWei('50', 'gwei')});
		  		const volunteerEventLocation = await Contract.methods.getLocation(i).call({from: account, gas:500000, gasPrice: web3.utils.toWei('50', 'gwei')});
		  		const volunteerEventDate = await Contract.methods.getEventDate(i).call({from: account, gas:500000, gasPrice: web3.utils.toWei('50', 'gwei')});
		  		const volunteerEventStartTime = await Contract.methods.getEventStartTime(i).call({from: account, gas:500000, gasPrice: web3.utils.toWei('50', 'gwei')});
		  		const volunteerEventEndTime = await Contract.methods.getEventEndTime(i).call({from: account, gas:500000, gasPrice: web3.utils.toWei('50', 'gwei')});
		  		const volunteerRequried = await Contract.methods.getNumberOfVolunteersRequired(i).call({from: account, gas:500000, gasPrice: web3.utils.toWei('50', 'gwei')});
		  		const volunteerLeaderRequired = await Contract.methods.getNumberOfLeadersRequired(i).call({from: account, gas:500000, gasPrice: web3.utils.toWei('50', 'gwei')});
		  		const volunteerEventDescription = await Contract.methods.getEventDescription(i).call({from: account, gas:500000, gasPrice: web3.utils.toWei('50', 'gwei')});
		  		const volunteerEventId = await Contract.methods.getEventId(i).call({from: account, gas:500000, gasPrice: web3.utils.toWei('50', 'gwei')});
		  		listOfEvents.push({eventName: volunteerEventName, orgName: volunteerOrgName, location: volunteerEventLocation, date: volunteerEventDate, 
		  		startTime: volunteerEventStartTime, endTime: volunteerEventEndTime, numberVolunteers: volunteerRequried, numberLeaders: volunteerLeaderRequired,
		  		eventDescription: volunteerEventDescription, eventId: volunteerEventId});
    		}
      	      
    		setEvents(listOfEvents);
 
    	}
      	      
		}catch(error){
			console.error("Error Getting Events: ", error);
	}
}

useEffect(() => {

	connect();
	const quantity = getNumberOfEvent();
	getEvents();
	
}, []);

const [signUpInputValue, setSignUpInputValue] = useState('');
const [signUpLeaderInputValue, setSignUpLeaderInputValue] = useState('');
const [showInputValue, setShowInputValue] = useState('');

const[eventNames, setEventNames] = useState('');
const[organizations, setOrganizations] = useState('');
const[locations, setLocations] = useState('');
const[dates, setDates] = useState('');
const[startTimes, setStartTimes] = useState('');
const[endTimes, setEndTimes] = useState('');
const[totalHours, setTotalHours] = useState('');
const[maxVolunteers, setMaxVolunteers] = useState('');
const[maxLeaders, setMaxLeaders] = useState('');
const[eventDescriptions, setEventDescriptions] = useState('');

const [showCoordinatorPopup, setShowCoordinatorPopup] = useState(null);
const [showVolunteerPopup, setShowVolunteerPopup] = useState(null);
const [showCreateEventPopup, setShowCreateEventPopup] = useState(false);


const createEvents = async (eventNames, organizations, locations, dates, startTimes, endTimes, totalHours, maxVolunteers, maxLeaders, eventDescriptions) => {

	try{
	
		const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
		  const account = accounts[0];
		  
		  let numberOfEvents = await Contract.methods.getNumberOfEvents().call({from: account, gas:500000, gasPrice: web3.utils.toWei('50', 'gwei')});
			numberOfEvents = Number(numberOfEvents) + 1;
		  
		  await Contract.methods.createEvent(
		  eventNames, 
		  organizations, 
		  locations, 
		  dates, 
		  startTimes, 
		  endTimes, 
		  totalHours, 
		  maxVolunteers, 
		  maxLeaders, 
		  eventDescriptions, 
		  numberOfEvents).send({from: account, gas:500000, gasPrice: web3.utils.toWei('50', 'gwei')});
		  
		  console.log("Creating Event");
	
	}catch(error){
	
		console.error("Error Creating Event: ", error);
	}
	
}

return (
	<div>	
		<h1 class="title">Decentra Aid</h1>
		<div class="title-line"></div>
		  
		<div className="buttonContainer">
		  
			<div className="hoursButtonRow">
				<button className="actionButton" id="getHoursButton" onClick={getHours}>Get Hours</button>
				<p id="hoursOutput"></p>
			</div>
				
			<div className="eventButton">
				<button className="actionButton" id="createEventButton" onClick={() => setShowCreateEventPopup(true)}>Create Event
				</button>
			</div>
				
			<div className="attendanceButtonRow">
				<button className="actionButton" id="getAttendanceRate" onClick={getAttendance}>Get Attendance Rate</button>
				<p id="attendanceOutput"></p>
			</div>
		  
		</div>
		  
		{events.map((event) => (
			<div className="eventContainer" key={event.eventId}>
				
				<div className="eventInfo">
					<div className="eventColumnLeft">
						<p><strong>Event Name:</strong> {event.eventName}</p>
						<p><strong>Organization Name:</strong> {event.orgName}</p>
						<p><strong>Location:</strong> {event.location}</p>
						<p><strong>Start Time:</strong> {event.startTime}</p>
						<p><strong>End Time:</strong> {event.endTime}</p>
					</div>

					<div className="eventColumnRight">
						<p><strong>Date:</strong> {event.date}</p>
						<p><strong>Volunteers Required: </strong>{event.numberVolunteers}</p>
						<p><strong>Leaders Required: </strong>{event.numberLeaders}</p>
						<p><strong>Description: </strong>{event.eventDescription}</p>
					</div>
				</div>
			
				<div className="eventButtons">
					<button className="actionButton" id="eventManagementButton" onClick={() => setShowCoordinatorPopup(event.eventId)}>Event Management</button>
					<button className="actionButton" id="volunteerManagementButton" onClick={() => setShowVolunteerPopup(event.eventId)}>Volunteer Management</button>
				</div>
				  	
				{showCoordinatorPopup === event.eventId && (
					<>   
					
						<div className="popupOverlay">
							<div className="coordinator-popup">
							
								<button id="startEventButton" onClick={() => StartEvent(event.eventId)}>Start Event</button>
								<button id="endEventButton" onClick={() => EndEvent(event.eventId)}>End Event</button>
								
								<button id="getNumberVolunteers" onClick={() => getNumberOfVolunteers(event.eventId)}> Get Number of Volunteers </button>
								<p id="numberOfVolunteers"> </p>
								
								<button id="getNumberLeaders" onClick={() => getNumberOfLeaders(event.eventId)}> Get Number of Leaders </button>
								<p id="numberOfLeaders"> </p>
								
								<button id="getVolunteerNames" onClick={() => volunteerNames(event.eventId)}> Get Names of Volunteers </button>
								<p id="volunteerNamesOutput"> </p>
								
								<button id="getLeaderNames" onClick={() => leadersNames(event.eventId)}> Get Names of Leaders </button>
								<p id="leaderNamesOutput"> </p>
				 
								<button id="Show"onClick={() => userShow(showInputValue, event.eventId)}> Show </button>
								<input type="text" id="showButton" value={showInputValue} onChange={(e) => setShowInputValue(e.target.value)}/>
								
								<div className ="eventManagementClose-popup">
								<button onClick={() => setShowCoordinatorPopup(null)}>Close</button>
								</div>
								
							</div>
						</div>
						
					</>
				)}
				  
			 	{showVolunteerPopup === event.eventId && (
					<>   
			
						<div className="popupOverlay">
							<div className="popupBox volunteer-popup">
						
								<button id="getNumberVolunteers" onClick={() => getNumberOfVolunteers(event.eventId)}> Get Number of Volunteers </button>
								<p id="numberOfVolunteers"> </p>
						
								<button id="getNumberLeaders" onClick={() => getNumberOfLeaders(event.eventId)}> Get Number of Leaders </button>
								<p id="numberOfLeaders"> </p>
								
								<button id="signUp" onClick={() =>signUps(signUpInputValue, event.eventId)}> Sign Up </button>
								<input type="text" id="signUpInput" value={signUpInputValue} onChange={(e) => setSignUpInputValue(e.target.value)}/>
							
								<button id="leaderSignUp" onClick={() =>signUpsLeader(signUpLeaderInputValue, event.eventId)}> Signup as Leader </button>
								<input type="text" id="signUpAsLeaderInput" value={signUpLeaderInputValue} onChange={(e) => setSignUpLeaderInputValue(e.target.value)}/>
								
								<button onClick={() => setShowVolunteerPopup(null)}>Close</button>
							
							</div>	
						</div>
					</>
				)}
			</div>
					
		))}

		{showCreateEventPopup && (
			<>   
				<div id="creatEventPopup">
					<div className="popupOverlay">
						<div className="popupBox">
							
							<p>Event Name: </p>
							<input type="text" id="eventNameInput" value={eventNames} onChange={(e) => setEventNames(e.target.value)}/>
							
							<p>Organization Name: </p>
							<input type="text" id="orgNameInput" value={organizations} onChange={(e) => setOrganizations(e.target.value)}/>
							
							<p>Location: </p>
							<input type="text" id="locationInput" value={locations} onChange={(e) => setLocations(e.target.value)}/>
							
							<p>Date: </p>
							<input type="text" id="dateInput" value={dates} onChange={(e) => setDates(e.target.value)}/>
							
							<p>Start Time: </p>
							<input type="text" id="startTimeInput"  value={startTimes} onChange={(e) => setStartTimes(e.target.value)}/>
							
							<p>End time: </p>
							<input type="text" id="endTimeInput" value={endTimes} onChange={(e) => setEndTimes(e.target.value)}/>
							
							<p>Total Volunteering Hours: </p>
							<input type="text" id="totalHoursInput"  value={totalHours} onChange={(e) => setTotalHours(e.target.value)}/>
							
							<p>Number of Volunteers Required: </p>
							<input type="text" id="numberOfVolunteersInput"  value={maxVolunteers} onChange={(e) => setMaxVolunteers(e.target.value)}/>
							
							<p>Number of Leaders Required: </p>
							<input type="text" id="numberOfLeadersInput"  value={maxLeaders} onChange={(e) => setMaxLeaders(e.target.value)}/>
							
							<p>Event Description: </p>
							<input type="text" id="eventDescripionInput" value={eventDescriptions} onChange={(e) => setEventDescriptions(e.target.value)}/>

							<div className="createEvent-button">
							
							<button id="submitEvent" onClick={() => {
								createEvents(
									eventNames, 
									organizations, 
									locations, 
									dates, 
									startTimes, 
									endTimes, 
									totalHours, 
									maxVolunteers, 
									maxLeaders, 
									eventDescriptions
								);
								setShowCreateEventPopup(false);
							}}>Create Event</button>

      					
								<button onClick={() => setShowCreateEventPopup(false)}>Close</button>
								
							</div>
						</div>	    
					</div>
				</div>
			</>
		)}
	
	</div>
	);

}

export default App;
