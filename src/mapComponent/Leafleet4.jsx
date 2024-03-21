import React, { memo, useEffect, useMemo, useRef, useState } from "react";
// import { MapContainer } from 'react-leaflet/MapContainer'
// import { TileLayer } from 'react-leaflet/TileLayer'
// import { useMap } from 'react-leaflet/hooks'
import "leaflet/dist/leaflet.css";
import "./Leafleet.css";
import "../App.css";
import "../style/map.css";
import img7 from "../Logo/images/marker-logo-06.png";
import img8 from "../Logo/images/marker-logo-07.jpg";
import L from "leaflet";
import { geocodeByLatLng } from "react-google-places-autocomplete";
import "../style/st.css";

import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvent,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import axios from "axios";
import { Country, State, City } from "country-state-city";
import MarkerClusterGroup from "../Test/marker-cluster";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

var addressPoints = [
  [-37.8210922667, 175.2209316333, "2"],
  [-37.8210819833, 175.2213903167, "3"],
  [-37.8210881833, 175.2215004833, "3A"],
  [-37.8211946833, 175.2213655333, "1"],
  [-37.8209458667, 175.2214051333, "5"],
  [-37.8208292333, 175.2214374833, "7"],
  [-37.8325816, 175.2238798667, "537"],
  [-37.8315855167, 175.2279767, "454"],
  [-37.8096336833, 175.2223743833, "176"],
  [-37.80970685, 175.2221815833, "178"],
  [-37.8102146667, 175.2211562833, "190"],
  [-37.8088037167, 175.2242227, "156"],
  [-37.8112330167, 175.2193425667, "210"],
  [-37.8116368667, 175.2193005167, "212"],
  [-37.80812645, 175.2255449333, "146"],
  [-37.8080231333, 175.2286383167, "125"],
  [-37.8089538667, 175.2222222333, "174"],
  [-37.8080905833, 175.2275400667, "129"],
];

const Leafleet4 = () => {
  const [center, setCenter] = useState({ lat: 22.577152, lng: 88.3720192 });
  const [zoom, setZoom] = useState(2);
  const ref = useRef(null);
  const [projects, setProjects] = useState([]);

  const GetLocation = () => {
    const map = useMapEvent({
      click(ee) {
        console.log(ee.latlng.lat, " ", ee.latlng.lng);

        // Geonames API
        // fetch(
        //   `http://api.geonames.org/findNearbyJSON?lat=${ee.latlng.lat}&lng=${ee.latlng.lng}&username=sidh`
        // )
        //   .then((res) => res.json())
        //   .then((res) => console.log("result is ", res))
        //   .catch((err) => console.log("err is ", err.message));

        // Opencage API
        // fetch(
        //   `https://api.opencagedata.com/geocode/v1/json?q=${ee.latlng.lat}+${ee.latlng.lng}&key=99a8119c167543e7976e0fddcdfd9684`
        // )
        //   .then((result) => result.json())
        //   .then((result) => console.log("result is ", result.results[0]))
        //   .catch((err) => console.log("Error is ", err));
        fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${ee.latlng.lat}&lon=${ee.latlng.lng}&format=json`
        )
          .then((result) => result.json())
          .then((result) => console.log("result is ", result))
          .catch((err) => console.log("Error is ", err));
      },
      zoomend: (e) => {
        setZoom(map.getZoom());
      },
    });
  };

  useEffect(() => {
    const getAllProjects = async () => {
      try {
        const { data } = await axios.get("/pvfleet/all-project");
        if (data) {
          setProjects([...data?.result]);
        }
      } catch (error) {
        console.log("error is ", error.message);
        alert("Error is ", error.message);
      } finally {
      }
    };
    getAllProjects();
  }, []);
  console.log(projects);

  return (
    <>
      <div
        style={{
          padding: "2vmin",
          height: "100%",
          display: "flex",
          // alignItems: "center",
          // justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <div className="main-container-1">
          <div>
            <div>
              <span>Project Locations</span>
              <img
                src={img7}
                height={"25px"}
                width={"25px"}
                style={{
                  // border:"2px solid red"
                  position: "relative",
                  top: "3px",
                }}
                alt="Project-Location"
              />
              {/* <svg style={{ rotate: "-45deg", position: "relative", top: "3px" }} height={"20px"} width={"20px"} fill="red" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M25.497 6.503l.001-.003-.004.005L3.5 15.901l11.112 1.489 1.487 11.11 9.396-21.992.005-.006z"></path></g></svg> */}
              {/* <svg height={"30px"} fill="green" width={"30px"}> */}
              {/* <path d='M12.75 0l-2.25 2.25 2.25 2.25-5.25 6h-5.25l4.125 4.125-6.375 8.452v0.923h0.923l8.452-6.375 4.125 4.125v-5.25l6-5.25 2.25 2.25 2.25-2.25-11.25-11.25zM10.5 12.75l-1.5-1.5 5.25-5.25 1.5 1.5-5.25 5.25z'>
                    </path> */}
              {/* <path d={`${window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW}`} fill="red">
                        </path>
                    </svg> */}
              <span
                style={{ height: "15px", borderLeft: "3px solid transparent" }}
              ></span>
              <span>Your location</span>
              <svg
                height={"25px"}
                width={"25px"}
                viewBox="0 0 512 512"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                fill="rgb(4, 142, 173)"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <title>location</title>{" "}
                  <g
                    id="Page-1"
                    stroke="none"
                    strokeWidth="1"
                    fill="none"
                    fillRule="evenodd"
                  >
                    {" "}
                    <g
                      id="Combined-Shape"
                      fill="rgb(14, 200, 241)"
                      transform="translate(106.666667, 42.666667)"
                    >
                      {" "}
                      <path d="M149.333333,7.10542736e-15 C231.807856,7.10542736e-15 298.666667,66.8588107 298.666667,149.333333 C298.666667,174.270044 292.571852,197.766489 281.750846,218.441128 L149.333333,448 L19.9831547,224.008666 C7.25333333,202.026667 2.84217094e-14,176.537017 2.84217094e-14,149.333333 C2.84217094e-14,66.8588107 66.8588107,7.10542736e-15 149.333333,7.10542736e-15 Z M149.333333,42.6666667 C90.42296,42.6666667 42.6666667,90.42296 42.6666667,149.333333 C42.6666667,166.273109 46.5745408,182.526914 53.969702,197.200195 L57.5535689,203.746216 L149.333333,362.666667 L241.761134,202.626841 C251.054097,186.579648 256,168.390581 256,149.333333 C256,90.42296 208.243707,42.6666667 149.333333,42.6666667 Z M149.333333,85.3333333 C184.679557,85.3333333 213.333333,113.987109 213.333333,149.333333 C213.333333,184.679557 184.679557,213.333333 149.333333,213.333333 C113.987109,213.333333 85.3333333,184.679557 85.3333333,149.333333 C85.3333333,113.987109 113.987109,85.3333333 149.333333,85.3333333 Z M149.333333,128 C137.551259,128 128,137.551259 128,149.333333 C128,161.115408 137.551259,170.666667 149.333333,170.666667 C161.115408,170.666667 170.666667,161.115408 170.666667,149.333333 C170.666667,137.551259 161.115408,128 149.333333,128 Z">
                        {" "}
                      </path>{" "}
                    </g>{" "}
                  </g>{" "}
                </g>
              </svg>
            </div>
            <div className="logo-container">
              <div>
                <span>GreenEnco Limited </span>
                <span>Maximizing Asset Values</span>
              </div>
            </div>
            <div>
              <button>Fill Your Project Detail Here</button>
            </div>
          </div>
        </div>

        <MapContainer
          center={[center.lat, center.lng]}
          zoom={zoom}
          minZoom={2}
          maxZoom={15}
          ref={ref}
          style={{
            width: "100%",
            height: "100%",
            cursor: "default",
          }}
          worldCopyJump={true}
          whenReady={(e) => {}}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          <MarkerClusterGroup
            // style={{
            //   background: "#9370db",
            //   border: "3px solid  #ededed",
            //   borderRadius: "50%",
            //   color: "black",
            //   height: "40px",
            //   lineHeight: "37px",
            //   textAlign: "center",
            //   width: "40px"
            // }}
            onclick={(e) => {
              console.log( "clicked child count", e.layer._childCount);
            }}
            eventHandlers={{
              click: (e) => console.log("click data is ", e),
              overlayadd: (e) => console.log("over lay add ", e),
              overlayremove: (e) => console.log("overlayer remove", e),
            }}
            onClusterClick={(cluster) => {
              console.log(cluster);
              console.warn(
                "cluster-click",
                cluster,
                cluster.layer.getAllChildMarkers()
              );
            }}
          >
            {projects?.map((e, index) => {
              let DefaultIcon = L.divIcon({
                className: "defaultIcon",
                html: `
                            <img src=${img7}  id=defaultIconImg />
                             <span id=defaultIconImgSpan ></span>
                            `,
                // iconSize: [25, 25],
                // iconAnchor: [20, 20],
              });
              return (
                <Marker
                  key={index}
                  icon={DefaultIcon}
                  position={[e?.Latitude, e?.Longitude]}
                  onClick={(marker) => console.log("marker is ", marker)}
                />
              );
            })}
          </MarkerClusterGroup>
        </MapContainer>
      </div>
    </>
  );
};

export default Leafleet4;
