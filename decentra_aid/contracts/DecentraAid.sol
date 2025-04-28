// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DecentraAid{

    struct volunteers{
        string name;
        address userAddress;
    }

    struct eventDetails{
        string eventName;
        string organization;
        string location;
        string date;
        string startTime;
        string endTime;
        uint totalEventHours;
        uint numberOfVolunteersRequired;
        uint numberOfLeadersRequired;
        string eventDescription;
        uint id;
    }

    struct eventNames{
        string[] volunteerNames;
        string[] leaderNames;
    }

    struct numberOfSignedUp{
        uint totalVolunteersSignedUpForEvent;
        uint totalLeadersSignedUpForEvent;
    }

    mapping (uint => numberOfSignedUp) private numberOfSigned;

    mapping (uint => eventNames) private namesOfVolunteers;

    mapping (uint => eventDetails) public events;
    
    uint private numberOfEvents;

    address private eventCoordinator;

    mapping(address => uint) private volunteersHours;
    mapping(address => uint) private attendanceRate;
    mapping(uint => uint) private currentNumberOfVolunteers;
    mapping(uint => uint) private currentNumberOfLeaders;
    mapping(uint => uint) private signedUp;
    mapping(string => address) private userAddress;
    mapping (address => uint) private totalEventsSignedUpFor;
    mapping (address => uint) private totalEventsAttended;
    mapping (uint => string) private statusOfEvent;

    constructor(){
       eventCoordinator = msg.sender;
    }

    function getHours() public view returns (uint){
        return(volunteersHours[msg.sender]);
    }

    function getAttendanceRate() public view returns (uint){

        uint totalSignUp = totalEventsSignedUpFor[msg.sender];

        if (totalSignUp == 0){
            return 0;
        }else{
            uint totalShow = totalEventsAttended[msg.sender];
            uint rate = ((totalShow * 100) / totalSignUp);
            return rate;
        }
    }

    function signUp(string memory userName, uint id) public{
        require(keccak256(bytes(statusOfEvent[id])) == keccak256(bytes("Started")), "The Event Has Already Ended");
        require(keccak256(bytes(statusOfEvent[id])) != keccak256(bytes("Ended")), "The Event Has Already Ended");

        require(signedUp[id] < events[id].numberOfVolunteersRequired + 1, "Error");

        totalEventsSignedUpFor[msg.sender]++;
        userAddress[userName] = msg.sender;
        namesOfVolunteers[id].volunteerNames.push(userName);
        numberOfSigned[id].totalVolunteersSignedUpForEvent++;
          
    }

    function signUpAsLeader(string memory userName, uint id) public{
        require(keccak256(bytes(statusOfEvent[id])) == keccak256(bytes("Started")), "The Event Has Already Ended");
        require(keccak256(bytes(statusOfEvent[id])) != keccak256(bytes("Ended")), "The Event Has Already Ended");

        require(signedUp[id] < events[id].numberOfLeadersRequired + 1, "Error");

        totalEventsSignedUpFor[msg.sender]++;
        userAddress[userName] = msg.sender;
        namesOfVolunteers[id].leaderNames.push(userName);
        numberOfSigned[id].totalLeadersSignedUpForEvent++;
    }

    function getNumberOfVolunteers(uint eventId) public view returns (uint){
        return numberOfSigned[eventId].totalVolunteersSignedUpForEvent;
    }

    function getNumberOfLeaders(uint eventId) public view returns (uint){
        return numberOfSigned[eventId].totalLeadersSignedUpForEvent;
    }

    function getNamesOfVolunteers(uint eventId) public view returns (string[] memory){

        return namesOfVolunteers[eventId].volunteerNames;   
    }

    function getNamesOfLeader(uint eventId) public view returns (string[] memory){
        return namesOfVolunteers[eventId].leaderNames;   
    }

    function show(string memory name, uint id) public{
        require(msg.sender == eventCoordinator, "Only Coordinator Has Access To This Function");
        uint totalHours = events[id].totalEventHours;
        address userAddr = userAddress[name];
        volunteersHours[userAddr] += totalHours;
        totalEventsAttended[userAddr]++;
    }

    function startEvent(uint id) public{
        require(msg.sender == eventCoordinator, "Only Coordinator Has Access To This Function");
        statusOfEvent[id] = "Started";
    }

    function endEvent(uint id) public{
       require(msg.sender == eventCoordinator, "Only Coordinator Has Access To This Function");
       statusOfEvent[id] = "Ended";
    }

    function createEvent(string memory eventName, string memory orgName, string memory location,
    string memory date, string memory startTime, string memory endTime, uint totalEventHours, uint numberOfVolunters, 
    uint numberOfLeaders, string memory eventDescription, uint id) public{
        require(msg.sender == eventCoordinator, "Only Coordinator Has Access To This Function");

        events[id] = eventDetails(eventName, orgName, location, date, 
        startTime, endTime, totalEventHours, numberOfVolunters, numberOfLeaders,
        eventDescription, id);
        events[id].id = id;
        numberOfEvents++;
        statusOfEvent[id] = "Not Started";

    }
    function getEventName(uint id) public view returns (string memory) {
        return (events[id].eventName);
    }

    function getOrganizationName(uint id) public view returns (string memory){
         return events[id].organization;
    }

    function getLocation(uint id) public view returns (string memory){
        return  (events[id].location);
    }
    function getEventDate(uint id) public view returns (string memory){
          return events[id].date;
    }
    function getEventStartTime(uint id) public view returns (string memory) {
        return (events[id].startTime);
    }
    function getEventEndTime(uint id) public view returns (string memory){
          return events[id].endTime;
    }
    function getNumberOfVolunteersRequired(uint id) public view returns (uint){
           return events[id].numberOfVolunteersRequired;
    }
    function getNumberOfLeadersRequired(uint id) public view returns (uint){
        return  events[id].numberOfLeadersRequired;
    }
    function getEventDescription(uint id) public view returns (string memory){
          return events[id].eventDescription;
    }
    function getNumberOfEvents() public view returns(uint){
        return numberOfEvents;
    }
    function getEventId(uint id) public view returns (uint){
          return events[id].id;
    }
}
