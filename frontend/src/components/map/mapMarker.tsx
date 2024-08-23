import React, {useEffect, useState} from 'react';
import {Marker, Popup, useMapEvents} from "react-leaflet";
import L, {LocationEvent , divIcon} from "leaflet";
import LocationSvg from "../svg/location/LocationSvg";
import {renderToStaticMarkup} from "react-dom/server";

const MapMarker = ({position,handlePosition,handlePositionOnDrag} : any) => {

    const [latlang,setlatlng] = useState<any>(null)

    const iconMarkup = renderToStaticMarkup(<LocationSvg height={38} width={38}/>);
    const customMarkerIcon = divIcon({
        html: iconMarkup,
        className : ''
    });

    const map = useMapEvents({

        zoom : (e)=>{
            // console.log(e)
        },
        click(e) {
            map.locate()
            // console.log(e.latlng)
            handlePosition([e.latlng.lat,e.latlng.lng])
        },
        locationfound(e : LocationEvent) {
            console.log(e)
            // console.log(e.latlng)
            // handlePosition([e.latlng.lat,e.latlng.lng])
            // map.flyTo(e.latlng, map.getZoom())
        },
        drag : (e )=>{
            // console.log(e)
            // setlatlng([e.latlng.lat,e.latlng.lng])
            // handlePosition([e.latlng.lat,e.latlng.lng])

        }
    })

    useEffect(() => {
        map.flyTo(position)
    }, [position])

    return (
        <Marker
            position={position}
            eventHandlers={{
                click : (e)=>{
                    handlePosition([e.target._latlng.lat,e.target._latlng.lng])
                },
                dragend : (e : any)=>{
                    console.log(e)
                    handlePositionOnDrag([e.target._latlng.lat,e.target._latlng.lng])
                    // setlatlng([e.latlng.lat,e.latlng.lng])

                }
            }}
            icon={customMarkerIcon}
            draggable={true}
        >
            <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
        </Marker>
    );
};

export default MapMarker;