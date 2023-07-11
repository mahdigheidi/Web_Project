import React, { useState, useRef, useEffect } from 'react';
import AsyncSelect from 'react-select/async';
import "./WeekStyle.css";

const default_option = {id:-1, name:"All"}



export const OfficeSelect = (props) => {

    const selectedOffice = props.selectedOffice
    const setSelectedOffice = props.setSelectedOffice
    const officeValue = props.officeValue
    const setOfficeValue = props.setOfficeValue

    const handleOfficeSelectorChange = value => {
        setSelectedOffice(value);
    };

    const handleOfficeInputChange = value => {
        setOfficeValue(value);
    };

    const fetchOffices  = async (args) => {
        const response = await fetch("http://localhost:8080/office/", {
        method: "GET", 
        })
        const offices = await response.json()
        const mappedOffices = offices.map(
            (office) => {
            return {
                id: office.ID, 
                name: office.Name
            }
            }
        )
        mappedOffices.push(default_option)
        // console.log(mappedOffices)
        return mappedOffices
    }




    return (

      <AsyncSelect
        style={{
          marginLeft: '5px',
          padding: '5px',
          borderRadius: '5px',
          border: '1px solid #ccc',
          backgroundColor: '#f8f8f8',
          color: '#333',
        }}
        cacheOptions
        defaultOptions
        value={selectedOffice}
        getOptionLabel={e => e.name}
        getOptionValue={e => e.id}
        loadOptions={fetchOffices}
        onInputChange={handleOfficeInputChange}
        onChange={handleOfficeSelectorChange}
      />
    )
  }




export const RoomSelect = (props) => {

    const selectedRoom = props.selectedRoom
    const setSelectedRoom = props.setSelectedRoom
    const roomValue = props.roomValue
    const setRoomValue = props.setRoomValue

    const handleRoomSelectorChange = value => {
        setSelectedRoom(value);
    };

    const handleRoomInputChange = value => {
        setRoomValue(value);
    };

    const fetchRooms  = async (args) => {
        const response = await fetch("http://localhost:8080/room/", {
        method: "GET", 
        })
        const rooms = await response.json()
        // console.log("got rooms: ", rooms)
        const mappedRooms = rooms.map(
            (room) => {
            return {
                id: room.id, 
                name: room.name
            }
            }
        )
        mappedRooms.push(default_option)
        // console.log(mappedRooms)
        return mappedRooms
    }

    return (

      <AsyncSelect
        style={{
          marginLeft: '5px',
          padding: '5px',
          borderRadius: '5px',
          border: '1px solid #ccc',
          backgroundColor: '#f8f8f8',
          color: '#333',
        }}
        cacheOptions
        defaultOptions
        value={selectedRoom}
        getOptionLabel={e => e.name}
        getOptionValue={e => e.id}
        loadOptions={fetchRooms}
        onInputChange={handleRoomInputChange}
        onChange={handleRoomSelectorChange}
      />
    )
  }