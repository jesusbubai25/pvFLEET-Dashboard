import React, { memo, useEffect, useMemo, useRef, useState } from "react";
// import { MapContainer } from 'react-leaflet/MapContainer'
// import { TileLayer } from 'react-leaflet/TileLayer'
// import { useMap } from 'react-leaflet/hooks'
import "leaflet/dist/leaflet.css";
import "../App.css";
import "../style/map.css";
import img7 from "../Logo/images/marker-logo-06.png";
import img8 from "../Logo/images/marker-logo-07.jpg";
import L from "leaflet";
import { geocodeByLatLng } from "react-google-places-autocomplete";

import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvent,
} from "react-leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import axios from "axios";
import { Country, State, City } from "country-state-city";
const CountryAndState = Country.getAllCountries();

let xyz = 1;
const DefaultIcon = ({ e }) => {
  useEffect(() => {}, []);
};
const Leafleet = () => {
  const [center, setCenter] = useState({ lat: 22.577152, lng: 88.3720192 });
  const [zoom, setZoom] = useState(2);
  const [openProjectData, setOpenProjectData] = useState(null);
  const [marker, setmarker] = useState(null);
  const [projects, setProjects] = useState([]);
  const [finalProjectLocation, setFinalProjectLocation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openData, setOpenData] = useState(false);
  const ref = useRef(null);
  const ref2 = useRef(null);

  let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });
  L.Marker.prototype.options.icon = DefaultIcon;

  useMemo(() => {
    if (projects.length > 0 && finalProjectLocation?.length > 0) {
      if (zoom < 4) {
        let obj = [];
        finalProjectLocation?.map((e, inde) => {
          let elem = obj.findIndex((ee, i) => {
            return ee["Country"] === e.Country;
          });
          if (elem >= 0) {
            let test = { ...obj[elem] };
            test["projectCount"] = obj[elem]["projectCount"] + 1;
            obj.splice(elem, 1, test);
          } else {
            let country = CountryAndState.find((ee) => ee.name === e.Country);
            let test = {
              Country: country?.name,
              Latitude: country?.latitude,
              Longitude: country?.longitude,
            };
            test["projectCount"] = 1;
            obj.push(test);
          }
        });
        obj.map((e, index) => {
          if (e.projectCount === 1) {
            let val = finalProjectLocation?.find(
              (ee) => ee.Country === e.Country
            );
            obj.splice(index, 1, { ...val });
          }
        });
        setProjects(obj);
      } else if (zoom < 7) {
        let obj2 = [];
        finalProjectLocation?.map((e, inde) => {
          let state = e.StateOrRegion?.split(",")[0];
          let elem = obj2.findIndex((ee, i) => {
            return ee["name"]?.split(",")[0] === state;
          });

          if (elem >= 0) {
            let test = { ...obj2[elem] };
            test["projectCount"] = obj2[elem]["projectCount"] + 1;
            obj2.splice(elem, 1, test);
          } else {
            let country = CountryAndState.find((ee) => ee.name === e.Country);
            let result = State.getStatesOfCountry(country.isoCode)?.find(
              (ee) => ee.name === state
            );
            let test = {
              name: result?.name,
              Latitude: result?.latitude,
              Longitude: result?.longitude,
            };
            test["projectCount"] = 1;
            obj2.push(test);
          }
        });
        obj2.map((e, index) => {
          if (e.projectCount === 1) {
            let val = finalProjectLocation?.find(
              (ee) => ee.StateOrRegion?.split(",")[0] === e.name
            );
            console.log("e is ", e, " val is ", val);
            obj2.splice(index, 1, { ...val });
          }
        });
        setProjects(obj2);
      } else if (zoom < 11) {
        let obj3 = [];
        finalProjectLocation?.map((e, inde) => {
          let state = e.StateOrRegion?.split(",")[0];
          let city = e.StateOrRegion?.split(",")[1].trim();
          let elem = obj3.findIndex((ee, i) => {
            return ee["name"]?.split(",")[0] === city;
          });
          if (elem >= 0) {
            let test = { ...obj3[elem] };
            test["projectCount"] = obj3[elem]["projectCount"] + 1;
            obj3.splice(elem, 1, test);
          } else {
            let country = CountryAndState.find((ee) => ee.name === e.Country);
            let result = State.getStatesOfCountry(country?.isoCode)?.find(
              (ee) => ee.name === state
            );
            let result2 = City.getCitiesOfState(
              country.isoCode,
              result.isoCode
            )?.find((eee) => eee.name === city);
            let test = {
              name: result2?.name,
              Latitude: result2?.latitude,
              Longitude: result2?.longitude,
            };
            test["projectCount"] = 1;
            obj3.push(test);
          }
        });
        obj3.map((e, index) => {
          if (e.projectCount === 1) {
            let val = finalProjectLocation?.find(
              (ee) => ee.StateOrRegion?.split(",")[1].trim() === e.name
            );
            obj3.splice(index, 1, { ...val });
          }
        });
        setProjects(obj3);
      } else {
        setProjects(finalProjectLocation);
      }
    }
  }, [loading, zoom]);
  const GetLocation = () => {
    const map = useMapEvent({
      click(ee) {
        setmarker({ lat: ee.latlng.lat, lng: ee.latlng.lng });

        fetch(
          `https://api.opencagedata.com/geocode/v1/json?q=${ee.latlng.lat}+${ee.latlng.lng}&key=99a8119c167543e7976e0fddcdfd9684`
        )
          .then((result) => result.json())
          .then((result) => {
            console.log(
              "result is ",
              result.results[0].formatted,
              result.results[0].components
            );
            console.log("Country ", result.results[0].components.country);
            console.log("State ", result.results[0].components.state);
            console.log(
              "District",
              result.results[0].components.state_district
            );
          })
          .catch((err) => console.log("Error is ", err));
      },
      zoomend: (e) => {
        setZoom(map.getZoom());
      },
    });

    useEffect(() => {
      L.DomEvent.disableClickPropagation(ref2.current);
    });

    // map.fitBounds([
    //   [-90, -180],
    //   [90, 180],
    // ]);
  };
  window.onclick = () => {
    if (setOpenData) {
      setOpenData(false);
    }
  };
  const handleMarkerClick = (e) => {
    setmarker(null);
    // setCenter({ ...center, lat: e.lat, lng: e.lng });
    // ref.current.setView(
    //   { lat: e.lat, lng: e.lng },
    //   ref.current.getZoom() <= 15
    //     ? ref.current.getZoom() + 2
    //     : ref.current.getZoom(),
    //   {
    //     animate: true,
    //   }
    // );

    // let newdata = [...markers];
    // let index = newdata.findIndex((ee) => ee.lat === e.lat && ee.lng === e.lng);
    // newdata.splice(index, 1);
    // setmarkers(newdata);
  };

  const getAllProjects = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/pvfleet/all-project");
      if (data) {
        setProjects([...projects, ...data?.result]);
        setFinalProjectLocation([...finalProjectLocation, ...data?.result]);
      }
    } catch (error) {
      console.log("error is ", error.message);
      alert("Error is ", error.message);
    } finally {
      setLoading(false);
    }
  };
  // console.log("zoom is ", zoom);
  // console.log("projects is ", projects);
  // console.log("open data ", openData);
  // console.log("Project data ", openProjectData);

  useEffect(() => {
    getAllProjects();

    // const getGeoLocation = async () => {

    //   try {
    //     const response = await axios.get(
    //       `https://api.opencagedata.com/geocode/v1/json?q=${22.3534}+${87.2321}&key=99a8119c167543e7976e0fddcdfd9684`
    //     );

    //     if (response.data.results.length > 0) {
    //       const address = response.data.results[0].formatted;
    //       console.log('Location Address:', address);
    //       return address;
    //     } else {
    //       console.error('No results found for the given coordinates.');
    //       return null;
    //     }
    //   } catch (error) {
    //     console.error('Error fetching location:', error);
    //     return null;
    //   }
    // };
    // getGeoLocation()
  }, []);

  return (
    <div
      style={{
        padding: "2vmin",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {loading ? (
        <h3>Please Wait...</h3>
      ) : (
        <MapContainer
          center={[center.lat, center.lng]}
          zoom={zoom}
          minZoom={2}
          maxZoom={15}
          ref={ref}
          whenReady={(e) => {
            console.log("ref1 ", ref, " ref2 ", ref2, " e is ", e);
          }}
          style={{
            width: "100%",
            height: "98%",
            cursor: "default",
          }}

          // doubleClickZoom={false}
          // dragging={false}
        >
          {/* <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          noWrap={true}
        /> */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            // url='https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            // url="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"
            // url="https://stamen-tiles-{s}.a.ssl.fastly.net/{style}/{z}/{x}/{y}.{ext}"
            // url="https://{s}.basemaps.cartocdn.com/{'light_all'}/{z}/{x}/{y}{r}.{ext}"
            // url="https://{s}.tile.thunderforest.com/light_all/{z}/{x}/{y}.png"
            noWrap={true}
            ref={ref2}
          />

          <div
            className="detail-container"
            style={{
              height: openData ? "75vmin" : "0",
              border: openData ? "2px solid orange" : "none",
              // height: "70vmin",
              // border:"2px solid orange",
              // display:openData?"flex":"none"
            }}
            onClick={(e) => {
              e.stopPropagation();
            }}
            ref={ref2}
          >
            <i
              onClick={(e) => {
                setOpenData(false);
                e.stopPropagation();
              }}
              className="fa-solid fa-xmark x-mark"
            ></i>
            <div>
              <h2>Project Details</h2>
            </div>
            <div>
              <div>
                <p>Project Location </p>
                <span>
                  {openProjectData?.Country +
                    ", " +
                    openProjectData?.StateOrRegion}
                </span>
              </div>
              <div>
                <p>Project Capacity</p>
                <span>
                  {openProjectData?.ProjectCapacity +
                    `(${openProjectData?.CapacityUnit})`}
                </span>
              </div>
              <div>
                <p>Module Details</p>
                <span>
                  {openProjectData?.ModuleType +
                    ", " +
                    openProjectData?.ModuleCapacity +
                    "Wp"}
                </span>
              </div>
              <div>
                <p>Inverter Type</p>
                <span>{openProjectData?.InverterType}</span>
              </div>
              <div>
                <p>Structure Type</p>
                <span>{openProjectData?.StructureType}</span>
              </div>
              <div>
                <p>Tilt Angle</p>
                <span>
                  {openProjectData?.TiltAngle}
                  {"(Deg)"}
                </span>
              </div>
              <div>
                <p>Irradiation</p>
                <span>{openProjectData?.Irradiation}</span>
              </div>
              <div>
                <p>Plant Generation</p>
                <span>
                  {openProjectData?.PlantGeneration}
                  {" GW"}
                </span>
              </div>
            </div>
          </div>
          {marker && (
            <Marker
              draggable={true}
              position={[marker.lat, marker.lng]}
              eventHandlers={{
                click: () => {
                  setmarker(null);
                },
              }}
            ></Marker>
          )}

          {projects?.map((e, index) => {
            // let DefaultIcon = L.divIcon({
            //   className: "defaultIcon",
            //   html: `<div key=${index} class="my-div-span"><span>${
            //     e?.projectCount>1?e?.projectCount:""
            //   }</span></div>`,
            //   iconSize: [25, 25],
            //   iconAnchor: [20, 25],
            // });

            let DefaultIcon = L.divIcon({
              className: "defaultIcon",
              html: `
              <img src=${img7}  id=defaultIconImg />
              <span id=defaultIconImgSpan >${
                e?.projectCount > 1 ? e?.projectCount : ""
              }</span>
              `,
              // iconSize: [25, 25],
              iconAnchor: [15, 25],
            });
            return (
              <>
                <Marker
                  icon={DefaultIcon}
                  key={index}
                  position={[e?.Latitude, e?.Longitude]}
                  eventHandlers={{
                    click: (ee) => {
                      ee.originalEvent.stopPropagation();
                      if (ref.current.getZoom() <= 12 && e?.projectCount) {
                        ref.current.flyTo(
                          { lat: e?.Latitude, lng: e?.Longitude },
                          ref.current.getZoom() + 2,
                          {
                            animate: true,
                            duration: 0.5,
                          }
                        );
                      }
                      if (ref.current.getZoom() >= 12) {
                        ref.current.flyTo(
                          { lat: e?.Latitude, lng: e?.Longitude },
                          ref.current.getZoom(),
                          {
                            animate: true,
                            duration: 0.5,
                          }
                        );
                        setOpenProjectData(e);
                        setOpenData(true);
                      }
                      if (!e.projectCount) {
                        ref.current.flyTo(
                          { lat: e?.Latitude, lng: e?.Longitude },
                          ref.current.getZoom(),
                          {
                            animate: true,
                            duration: 0.5,
                          }
                        );
                        setOpenData(true);
                        setOpenProjectData(e);
                      }
                    },
                  }}
                ></Marker>
              </>
            );
          })}

          <GetLocation />
        </MapContainer>
      )}
    </div>
  );
};

export default Leafleet;

// let DefaultIcon = L.icon({
//  iconUrl:icon,

//  shadowUrl:iconShadow,
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
// });

// let DefaultIcon = L.divIcon({
//   className: "defaultIcon",
//   html: `<div class="my-div-span"><span>${5}</span></div>`,
//   iconSize: [25, 25],
//   iconAnchor: [30, 20],
// L.Marker.prototype.options.icon = DefaultIcon;

// if (ref.current) {
//   // ref.current.setMaxBounds([[-90, -180], [90, 180]])
// }
// // fetch("http://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&sensor=true")
// fetch(
//   "http://api.geonames.org/countryCodeJSON?lat=49.03&lng=10.2&username=sidh"
// )
//   // fetch('https://maps.googleapis.com/maps/api/geocode/json?latlng=11.2742848,75.8013801&key=AIzaSyDP7lrCRX5_2WBxb_upHhF9P-9Xk8nwhd8')

//   // fetch("https://api.weatherapi.com/v1/forecast.json?key=AIzaSyDP7lrCRX5_2WBxb_upHhF9P-9Xk8nwhd8&q=53.3498053,-6.2603097&days=1&aqi=no&alerts=n")

//   .then((result) => result.json())
//   .then((result) => console.log("result is ", result))
//   .catch((error) => console.log("Error is ", error));
