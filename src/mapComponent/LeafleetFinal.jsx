import React, { memo, useEffect, useMemo, useRef, useState } from "react";
// import { MapContainer } from 'react-leaflet/MapContainer'
// import { TileLayer } from 'react-leaflet/TileLayer'
// import { useMap } from 'react-leaflet/hooks'
import "leaflet/dist/leaflet.css";
import "./Leafleet.css";
import "../App.css";
import img7 from "../Logo/images/marker-logo-06.png";
import img8 from "../Logo/images/marker-logo-07.jpg";
import L from "leaflet";
import { geocodeByLatLng } from "react-google-places-autocomplete";
import MarkerClusterGroup from "../Test/marker-cluster";

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
import "../style/style.css";

const CountryAndState = Country.getAllCountries();
const TiltAngleArray = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
  23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41,
  42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60,
];
const ModuleCapacityArray = [
  200, 205, 210, 215, 220, 225, 230, 235, 240, 245, 250, 255, 260, 265, 270,
  275, 280, 285, 290, 295, 300, 305, 310, 315, 320, 325, 330, 335, 340, 345,
  350, 355, 360, 365, 370, 375, 380, 385, 390, 395, 400, 405, 410, 415, 420,
  425, 430, 435, 440, 445, 450, 455, 460, 465, 470, 475, 480, 485, 490, 495,
  500, 505, 510, 515, 520, 525, 530, 535, 540, 545, 550, 555, 560, 565, 570,
  575,
];
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;
// console.log(State.getStatesOfCountry("IN"));
// console.log(City.getCitiesOfState("IN", "TG"));

const LeafleetFinal = () => {
  const [center, setCenter] = useState({ lat: 22.577152, lng: 88.3720192 });
  const [zoom, setZoom] = useState(2);
  const [openProjectData, setOpenProjectData] = useState(null);
  const [marker, setmarker] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingRegister, setLoadingRegister] = useState(false);
  const [openData, setOpenData] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [openCountryDetail, setOpenCountryDetail] = useState(false);
  const [storeCountry, setStoreCountry] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(false);

  const [openDefaulData, setOpenDefaultData] = useState({
    city: false,
    moduleCapacity: false,
  });
  const [ProjectData, setProjectData] = useState({
    country: null,
    state: null,
    city: null,
    projectCapacityIn: "KWp",
    projectCapacity: null,
    moduleType: null,
    moduleCapacity: null,
    inverterType: null,
    structureType: null,
    tileAngle: null,
    irradiation: null,
    plantGeneration: null,
    emailID: null,
    phoneNumber: null,
  });
  const [locationDetail, setLocationDetail] = useState({
    countryNumberCode: null,
    state: false,
    city: false,
  });
  const ref = useRef(null);
  const ref2 = useRef(null);

  const formSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoadingRegister(true);
      const { data } = await axios.post("/pvfleet/project-register", {
        country: ProjectData.country,
        // stateOrRegion: ProjectData.state + ", " + ProjectData.city,
        stateOrRegion:
          ProjectData.state && ProjectData.city
            ? ProjectData.state + ", " + ProjectData.city
            : ProjectData.state
            ? ProjectData.state
            : ProjectData.city
            ? ProjectData.city
            : "",
        projectCapacityUnit: ProjectData.projectCapacityIn,
        projectCapacity: parseFloat(ProjectData.projectCapacity),
        moduleType: ProjectData.moduleType,
        moduleCapacity: parseInt(ProjectData.moduleCapacity),
        inverterType: ProjectData.inverterType,
        structureType: ProjectData.structureType,
        tiltAngle: parseInt(ProjectData.tileAngle),
        irradiation: parseFloat(ProjectData.irradiation),
        plantGeneration: parseFloat(ProjectData.plantGeneration),
        emailID: ProjectData.emailID,
        phoneNumber: locationDetail.countryNumberCode + ProjectData.phoneNumber,
        latitude: marker?.lat,
        longitude: marker?.lng,
      });
      if (data) {
        setOpenForm(false);
        // setProjectData({
        //     ...ProjectData,
        //     country: null,
        //     state: null,
        //     city: null,
        //     projectCapacityIn: "KWp",
        //     projectCapacity: null,
        //     moduleType: null,
        //     moduleCapacity: null,
        //     inverterType: null,
        //     structureType: null,
        //     tileAngle: null,
        //     irradiation: null,
        //     plantGeneration: null,
        //     emailID: null,
        //     phoneNumber: null,
        // })
        getAllProjects();
        setmarker(null);
        setZoom(2);
      }
    } catch (error) {
      alert("Error is " + error.response.data.error);
      console.log("Error is ", error.response.data.error);
    } finally {
      setLoadingRegister(false);
    }
  };

  const GetLocation = () => {
    const map = useMapEvent({
      click(ee) {
        console.log("clicking map");

        // ee.originalEvent.stopPropagation();
        setmarker({ lat: ee.latlng.lat, lng: ee.latlng.lng });
      },
      zoomend: (e) => {
        // setZoom(map.getZoom());
      },
    });

    useEffect(() => {
      L.DomEvent.disableClickPropagation(ref2.current);
    });
  };
  // window.onclick = (e) => {
  //   e.stopPropagation()
  //   if (setOpenData) {
  //     setOpenData(false);
  //   }
  // };

  const getAllProjects = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/pvfleet/all-project");
      if (data) {
        setProjects([...data?.result]);
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

  const submitHandler = async () => {
    if (!marker) {
      alert(`Please Select One Location !`);
    } else {
      try {
        const { data } = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?lat=${marker.lat}&lon=${marker.lng}&format=json`
        );
        if (!data.address?.country) {
          alert("Please Select a proper location");
          return;
        }
        setProjectData({
          ...ProjectData,
          country: data?.address?.country,
          state: data.address?.state ? data?.address?.state : null,
          city: data.address?.state_district
            ? data.address?.state_district?.replace(" District", "")
            : data.address?.region
            ? data.address?.region?.replace(" District", "")
            : null,
        });

        setLocationDetail({
          ...locationDetail,
          state: !ProjectData.state ? true : false,
          city: !ProjectData.city ? true : false,
        });
        // if(!data.address?.state)setLocationDetail({...locationDetail,state:true})
        // if(!data.address?.state_district || data.address?.region)setLocationDetail({...locationDetail,city:true})
        setOpenForm((v) => !v);
        // console.log("address is ", data.address);
        // console.log("country is ", data.address?.country);
        // console.log("state is ", data.address?.state);
        // console.log(
        //   "district is ",
        //   data.address?.state_district?.replace(" District", "")
        // );
        // console.log("region is ", data.address?.region);
      } catch (error) {
        console.log("Error is ", error.message);
        alert("Error is ", error.message);
      }

      // .then((result) => result.json())
      // .then((result) => {
      //   console.log(
      //     "result is ",
      //     result?.results[0]?.formatted,
      //     result?.results[0]?.components
      //   );
      //   console.log("Country ", result?.results[0]?.components?.country);
      //   console.log("State ", result?.results[0]?.components?.state);
      //   console.log(
      //     "District",
      //     result?.results[0]?.components?.state_district
      //   );
      // })
      // .catch((err) => console.log("Error is ", err.message));
    }
  };

  useMemo(() => {
    if (projects.length > 0) {
      let newArr = [];

      projects?.map((e, index) => {
        let i = newArr.findIndex((ee) => ee.name === e.Country);
        if (i >= 0) {
          let obj = newArr[i];
          obj["count"] = obj["count"] + 1;
          newArr.splice(i, obj);
        } else {
          let obj = {};
          obj.name = e.Country;
          obj.count = 1;
          obj.latitude = e.Latitude;
          obj.longitude = e.Longitude;
          newArr.push(obj);
        }
      });

      setStoreCountry(newArr);
    }
  }, [loading]);
  useEffect(() => {
    getAllProjects();
  }, []);

  return (
    <>
      <div
        className="form-modal"
        style={{
          height: openForm ? "100%" : "0",
          overflow: openForm ? "auto" : "hidden",
        }}
      >
        <div className="form-div">
          <i
            className="fa-solid fa-xmark form-x-mark"
            onClick={() => {
              setOpenForm(false);
              setProjectData({
                ...ProjectData,
                country: null,
                state: null,
                city: null,
              });
            }}
          ></i>
          <h2>Fill Project Details</h2>
          <form autoComplete="on" onSubmit={(e) => formSubmitHandler(e)}>
            <div>
              <label htmlFor="country">Country: </label>
              <input
                type="text"
                id="country"
                value={ProjectData.country || ""}
                readOnly
                // onChange={(e) =>
                //   setProjectData({ ...ProjectData, country: e.target.value })
                // }
              ></input>
            </div>
            <div>
              <label htmlFor="state">State: </label>
              <input
                placeholder="Optional"
                type="text"
                id="state"
                value={ProjectData.state || ""}
                onChange={(e) =>
                  locationDetail.state
                    ? setProjectData({
                        ...ProjectData,
                        state: e.target.value,
                      })
                    : null
                }
                readOnly={locationDetail.state ? false : true}
              ></input>
            </div>

            <div>
              <label htmlFor="city">City/Region: </label>

              <input
                placeholder="Optional"
                type="text"
                id="city"
                value={ProjectData.city || ""}
                onChange={(e) =>
                  locationDetail.city
                    ? setProjectData({ ...ProjectData, city: e.target.value })
                    : null
                }
                readOnly={locationDetail.city ? false : true}
              />
            </div>
            <div>
              <label htmlFor="project-capacity">Capacity: </label>
              <input
                style={{ paddingRight: "32%" }}
                type="number"
                id="project-capacity"
                value={ProjectData.projectCapacity}
                onChange={(e) =>
                  setProjectData({
                    ...ProjectData,
                    projectCapacity: e.target.value,
                  })
                }
                required
              />
              <div
                style={{
                  // border:"1px solid red",
                  position: "absolute",
                  bottom: "0px",
                  right: "0%",
                  width: "30%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <select
                  name=""
                  id="project-capacity-in"
                  style={{
                    width: "100%",
                    height: "100%",
                    margin: "0.2vmin",
                    outline: "none",
                    padding: "1vmin",
                    fontSize: "1.5vmin",
                    border: "none",
                    borderLeft: " 2px solid rgba(204, 204, 204, 1)",
                    // borderTop: " 1.5px solid rgba(204, 204, 204, 1)",
                    // border:"1px solid red",
                  }}
                  onChange={(e) => {
                    setProjectData({
                      ...ProjectData,
                      projectCapacityIn: e.target.value,
                    });
                  }}
                  required
                >
                  <option value="KWp">KWp</option>
                  <option value="MWp">MWp</option>
                  <option value="GWp">GWp</option>
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="module-type">Module Type: </label>
              <select
                id="module-type"
                onChange={(e) => {
                  setProjectData({
                    ...ProjectData,
                    moduleType: e.target.value,
                  });
                }}
                required
              >
                <option selected disabled value="">
                  Select Module Type
                </option>
                <option value="Thin-Film (A-SI)">Thin-Film (A-SI)</option>
                <option value="Polycrystalline">Polycrystalline</option>
                <option value="Monocrystalline">Monocrystalline</option>
                <option value="Monocrystalline PERC (Mono-facial)">
                  Monocrystalline PERC (Mono-facial)
                </option>
                <option value="Monocrystalline PERC (Bi-facial)">
                  Monocrystalline PERC (Bi-facial)
                </option>
                <option value="TOPCon (Mono-facial)">
                  TOPCon (Mono-facial)
                </option>
                <option value="TOPCon (Bi-facial)">TOPCon (Bi-facial)</option>
                <option value="Concentrated PV Cell (CVP)">
                  Concentrated PV Cell (CVP)
                </option>
              </select>
            </div>
            <div>
              <label htmlFor="module-capacity">Module Capacity (Wp): </label>
              {!openDefaulData.moduleCapacity && (
                <select
                  id="module-capacity"
                  onChange={(e) => {
                    if (e.target.value === "module-not-availabel") {
                      setOpenDefaultData({
                        ...openDefaulData,
                        moduleCapacity: true,
                      });
                      return;
                    }
                    setProjectData({
                      ...ProjectData,
                      moduleCapacity: e.target.value,
                    });
                  }}
                  required
                >
                  <option selected disabled value="">
                    Select Module Capacity
                  </option>
                  {ModuleCapacityArray?.map((e, index) => {
                    return (
                      <option value={e} key={e}>
                        {e}
                      </option>
                    );
                  })}
                </select>
              )}
            </div>
            <div>
              <label htmlFor="inverter-type">Inverter Type: </label>
              <select
                id="inverter-type"
                onChange={(e) => {
                  setProjectData({
                    ...ProjectData,
                    inverterType: e.target.value,
                  });
                }}
                required
              >
                <option selected disabled value="">
                  Select Inverter Type
                </option>
                <option value="String Inverter">String Inverter</option>
                <option value="Central Inverter">Central Inverter</option>
              </select>
            </div>
            <div>
              <label htmlFor="structure-type">Structure Type: </label>

              <select
                id="structure-type"
                onChange={(e) => {
                  setProjectData({
                    ...ProjectData,
                    structureType: e.target.value,
                  });
                }}
                required
              >
                <option selected disabled value="">
                  Select Structure Type
                </option>
                <option value="Fixed Tilt">Fixed Tilt</option>
                <option value="Seasonal Tilt">Seasonal Tilt</option>
                <option value="Tracker Single Axis">Tracker Single Axis</option>
                <option value="Tracker Double Axis">Tracker Double Axis</option>
              </select>
            </div>
            <div>
              <label htmlFor="tilt-angle">Tilt Angle (deg): </label>
              <select
                id="tilt-angle"
                onChange={(e) => {
                  setProjectData({
                    ...ProjectData,
                    tileAngle: e.target.value,
                  });
                }}
                required
              >
                <option selected disabled value="">
                  Select Tilt Angle
                </option>
                {TiltAngleArray.map((e, index) => {
                  return (
                    <option value={e} key={index}>
                      {e}
                    </option>
                  );
                })}
              </select>
            </div>
            <div>
              <label htmlFor="irradiation">
                Irradiation (W/m<sup>2</sup>):{" "}
              </label>
              <input
                type="number"
                id="irradiation"
                onChange={(e) => {
                  setProjectData({
                    ...ProjectData,
                    irradiation: e.target.value,
                  });
                }}
                required
              />
            </div>
            <div>
              <label htmlFor="irradiation">Plant Generation: </label>
              <input
                type="number"
                id="plant-generation"
                onChange={(e) => {
                  setProjectData({
                    ...ProjectData,
                    plantGeneration: e.target.value,
                  });
                }}
                required
              />
            </div>
            <div>
              <label htmlFor="email">Email Id: </label>
              <input
                type="email"
                id="email"
                onChange={(e) => {
                  setProjectData({
                    ...ProjectData,
                    emailID: e.target.value,
                  });
                }}
                required
              />
            </div>
            <div>
              <label htmlFor="phoneNumber">Phone Number: </label>
              <input
                style={{ paddingLeft: "16%" }}
                type="number"
                id="phoneNumber"
                onChange={(e) => {
                  setProjectData({
                    ...ProjectData,
                    phoneNumber: e.target.value,
                  });
                }}
                required
              />
              <div
                style={{
                  // border:"1px solid red",
                  position: "absolute",
                  bottom: "0px",
                  left: "0%",
                  width: "15%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <select
                  name=""
                  id="phone-number-code"
                  style={{
                    width: "100%",
                    height: "100%",
                    margin: "0.2vmin",
                    outline: "none",
                    padding: "1vmin",
                    fontSize: "1.5vmin",
                    border: "none",
                    borderRight: " 2px solid rgba(204, 204, 204, 1)",
                    // borderTop: " 1.5px solid rgba(204, 204, 204, 1)",
                    // border:"1px solid red",
                  }}
                  onChange={(e) => {
                    setLocationDetail({
                      ...locationDetail,
                      countryNumberCode: e.target.value,
                    });
                  }}
                  required
                >
                  <option selected disabled value="">
                    Country
                  </option>
                  {CountryAndState.map((e, index) => {
                    return (
                      <option key={index} value={e.phonecode}>
                        {e.phonecode}{" "}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
            <div>
              {/* <div><span>Please Wait </span><span>&nbsp;.</span><span>&nbsp;.</span><span>&nbsp;.</span></div> */}
              <input
                style={{ color: loadingRegister ? "white" : "black" }}
                type="submit"
                value={loadingRegister ? "Loading..." : "Submit"}
              />
            </div>
          </form>
        </div>
      </div>
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
              <button
                style={
                  {
                    // transform:selectedMarker?"translate(90deg)":"none"
                  }
                }
                onClick={() => (marker ? submitHandler() : null)}
                onMouseOver={() => {
                  if (!marker) setSelectedMarker(true);
                }}
                onMouseOut={() => setSelectedMarker(false)}
              >
                <span>
                  {" "}
                  {selectedMarker
                    ? "Please Mark a Location"
                    : "Fill Your Project Detail Here"}
                </span>
              </button>
            </div>
          </div>
        </div>
        {loading ? (
          <div
            style={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
            }}
          >
            <h3>Please Wait...</h3>
          </div>
        ) : (
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
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onClick={()=>console.log("heading div")}
            >
              <h2
                style={{
                  position: "relative",
                  top: "1vmin",
                  zIndex: 1111,
                  color: "black",
                  fontWeight: 1000,
                  width: "fit-content",
                  opacity: 0.8,
                }}
              >
                !! Welcome TO pvFLEET Performance Dashboard !!{" "}
              </h2>
            </div>
            <i
              style={{
                position: "absolute",
                top: "1vmin",
                right: "1.5vmin",
                zIndex: 1111,
                color: "black",
                fontWeight: 800,
                opacity: 0.8,
                cursor: "pointer",
                fontSize: "4vmin",
              }}
              className="fa-solid fa-bars"
              onClick={(e) => {
                console.log("clicking country open bar");
                e.stopPropagation();
                setOpenCountryDetail((v) => !v);
              }}
            ></i>

            <div
              className="country-detail"
              style={{
                width: openCountryDetail ? "35vmin" : "0",
              }}
            >
              <div
                onClick={(e) => {
                  setOpenCountryDetail((v) => !v);
                  console.log("closing country detail container");
                }}
              >
                Close
              </div>
              <div>
                <span>Country Name</span>
                <span>Projects</span>
              </div>
              {storeCountry?.map((e, index) => {
                return (
                  <div onClick={()=>
                    ref.current.flyTo(
                      { lat: e.latitude, lng:e.longitude },
                      ref.current.getZoom(),
                      {
                        animate: true,
                        duration: 0.5,
                      }
                    )
                  } >
                    <span>{e.name}</span>
                    <span>{e.count}</span>
                  </div>
                );
              })}
            </div>

            <div
              className="detail-container-1"
              style={{
                height: openData ? "75vmin" : "0",
                border: openData ? "2px solid orange" : "none",
                // height: "70vmin",
                // border:"2px solid orange",
                // display:openData?"flex":"none"
              }}
              onClick={(e) => {
                console.log("detail-container");
              }}
              ref={ref2}
            >
              <i
                onClick={(e) => {
                  console.log("close detail-container");
                  e.stopPropagation();
                  setOpenData(false);
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
                      +"" +
                      openProjectData?.StateOrRegion}
                  </span>
                </div>
                <div>
                  <p>Project Capacity</p>
                  <span>
                    {openProjectData?.ProjectCapacity +
                      ` ${openProjectData?.CapacityUnit}`}
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
                    {" Deg"}
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
                icon={DefaultIcon}
                draggable={true}
                position={[marker.lat, marker.lng]}
                eventHandlers={{
                  click: () => {
                    setmarker(null);
                  },
                }}
              ></Marker>
            )}
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
                e.originalEvent.stopPropagation();

                if (ref.current.getZoom() <= 12) {
                  ref.current.flyTo(
                    { lat: e.latlng.lat, lng: e?.latlng.lng },
                    ref.current.getZoom() + 1.5,
                    {
                      animate: true,
                      duration: 0.5,
                    }
                  );
                }
              }}
              eventHandlers={{
                click: (c) => {
                  c.originalEvent.stopPropagation();

                  let find = projects?.find(
                    (f) =>
                      f.Latitude == c.latlng.lat && f.Longitude == c.latlng.lng
                  );
                  if (find) {
                    ref.current.flyTo(
                      { lat: c?.latlng.lat, lng: c?.latlng.lng },
                      ref.current.getZoom(),
                      {
                        animate: true,
                        duration: 0.5,
                      }
                    );
                    setOpenProjectData(find);
                    setOpenData(true);
                  }
                },
                // overlayadd: (e) => console.log("over lay add ", e),
                // overlayremove: (e) => console.log("overlayer remove", e),
              }}
              onClusterClick={(cluster) => {
                // console.log(cluster);
                // console.warn(
                //   "cluster-click",
                //   cluster,
                //   cluster.layer.getAllChildMarkers()
                // );
              }}
            >
              {projects?.map((eee, index) => {
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
                    data={eee}
                    key={index}
                    icon={DefaultIcon}
                    position={[eee?.Latitude, eee?.Longitude]}
                  />
                );
              })}
            </MarkerClusterGroup>

            <GetLocation />
          </MapContainer>
        )}
      </div>
    </>
  );
};

export default LeafleetFinal;

// "Ganjam"
// latitude
// "19.38705000"
// longitude
// "85.05079000"

// "Cuttack"
// latitude
// "20.50000000"
// longitude
// "86.25000000"