import React, {FC} from 'react'
import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import {renderToStaticMarkup} from "react-dom/server";
import LocationSvg from "../svg/location/LocationSvg";
import {divIcon} from "leaflet";

const PropertyMap:FC<any> = ({lat,lng}) => {
    const iconMarkup = renderToStaticMarkup(<LocationSvg height={38} width={38}/>);
    const customMarkerIcon = divIcon({
        html: iconMarkup,
        className : ''
    });
  return (
    <>
      <div
        className="bg-white rounded-3xl sm:shadow-xl p-4"
        // style={{ boxShadow: " 0px 4px 30px rgba(0, 38, 84, 0.11)" }}
      >
        <h2 className="text-text font-bold text-base pb-3">نقشه</h2>
        <figure className='overflow-hidden rounded-lg'>
            <MapContainer center={[lat,lng]} className='w-full h-70' zoom={10} maxZoom={12} scrollWheelZoom={false}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker icon={customMarkerIcon} position={[lat,lng]}>
                    <Popup>
                        A pretty CSS3 popup. <br /> Easily customizable.
                    </Popup>
                </Marker>
            </MapContainer>
        </figure>
      </div>
    </>
  );
}

export default PropertyMap
