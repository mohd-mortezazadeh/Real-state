import React, {useState} from 'react';
import L, {LocationEvent} from "leaflet"
import {MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents} from 'react-leaflet'


// import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'
// // import "leaflet-defaulticon-compatibility";
import {LatLngExpression} from "leaflet";
import MapMarker from "./mapMarker";


const MapComponent = ({handleSetLangLat, lat, lng , position}: any) => {
    console.log(position)
    // const position : LatLngExpression =

    // console.log(position)
    // var myCustomIcon = new customIcon({ iconUrl: '../images/marker.png' });

    const handlePosition = (latlang: any) => {
        // setPosition(latlang)
        // handleSetLangLat(latlang)
    }

    const handlePositionOnDrag = (latlang: any) => {
        // handleSetLangLat(latlang)
    }
    return (
        // <div className='w-full'>
        <MapContainer minZoom={8} maxZoom={14} trackResize={true} className='w-full h-70' dragging={true}  center={position} zoom={13}
                      scrollWheelZoom={true}>
            <>

                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapMarker handlePositionOnDrag={handleSetLangLat} handlePosition={handleSetLangLat}
                           position={position}/>
                
            </>
        </MapContainer>
        // </div>
    );
};

export default MapComponent;