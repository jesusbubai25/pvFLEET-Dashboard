import { GoogleApiWrapper, InfoWindow, Map, Marker } from "google-maps-react";
import { Country, State, City } from "country-state-city";
import { useEffect, useMemo, useRef, useState } from "react";
import "../App.css";
import "../style/map.css";
import GoogleMapStyles from "../style/GoogleMapStyles";
import logo from "../Logo/images/location-logo-2.svg";
import axios from "axios";
import img from "../Logo/images/location-logo.png";
import img2 from "../Logo/images/location-logo-2.svg";
import img3 from "../Logo/images/location-logo-3.svg";
import img4 from "../Logo/images/marker-logo-03.png";
import img5 from "../Logo/images/marker-logo-04.png";
import img6 from "../Logo/images/marker-logo-05.png";
import img7 from "../Logo/images/marker-logo-06.png";
import img8 from "../Logo/images/marker-logo-07.jpg";

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

const MyComponent2cpy = () => {
  const [marker, setMarker] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [openData, setOpenData] = useState(false);
  const [center, setCenter] = useState({ lat: 22.577152, lng: 88.3720192 });
  const [projectCountContainer, setProjectCountContainer] = useState(false);
  const [openProjectData, setOpenProjectData] = useState(null);
  const [projects, setProjects] = useState([]);
  const [finalProjectLocation, setFinalProjectLocation] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [loading, setLoading] = useState(true);
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
    countryCode: null,
    countryNumberCode: null,
    stateCode: null,
    cityCode: null,
  });
  const ref = useRef(null);

  // const center = useMemo(() => ({ lat: 22.577152, lng: 88.3720192 }), []);
  const handleClick = (e) => {
    setMarker({ lat: e.latLng.lat(), lng: e.latLng.lng() });
    fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${e.latLng.lat()}+${e.latLng.lng()}&key=99a8119c167543e7976e0fddcdfd9684`
    )
      .then((result) => result.json())
      .then((result) => console.log("result is ", result.results[0]))
      .catch((err) => console.log("Error is ", err));
  };

  const handleMarkerClick = (e) => {
    setMarker(null);
  };
  window.onclick = () => {
    if (setOpenData) {
      setOpenData(false);
    }
  };
  const handleexistMarkerClick = (e) => {
    setCenter({ lat: e?.Latitude, lng: e?.Longitude });
    if (zoom >= 11) {
      setOpenData(true);
      setOpenProjectData(e);
    }
    if (zoom < 13 && e.projectCount) {
      setZoom((v) => v + 2);
    } else {
      setOpenData(true);
      setOpenProjectData(e);
    }
  };

  const submitHandler = () => {
    if (!marker) {
      alert(`Please Select One Location !`);
    } else {
      setOpenForm((v) => !v);
    }
  };
  const formSubmitHandler = (e) => {
    e.preventDefault();
    registerProject(ProjectData, locationDetail.countryNumberCode, marker);
  };
  const getAllProjects = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/pvfleet/all-project");
      if (data) {
        setProjects([...projects, ...data?.result]);
        setFinalProjectLocation([...data?.result]);
      }
    } catch (error) {
      console.log("error is ", error.message);
      alert("Error is ", error.message);
    } finally {
      setLoading(false);
      setZoom(1);
    }
  };
  console.log(finalProjectLocation);
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
  }, [zoom, finalProjectLocation]);

  const registerProject = async (Pdata, phoneNumberCode, location) => {
    try {
      const { data } = await axios.post("/pvfleet/project-register", {
        country: Pdata.country,
        stateOrRegion: Pdata.state + ", " + Pdata.city,
        projectCapacityUnit: Pdata.projectCapacityIn,
        projectCapacity: parseFloat(Pdata.projectCapacity),
        moduleType: Pdata.moduleType,
        moduleCapacity: parseInt(Pdata.moduleCapacity),
        inverterType: Pdata.inverterType,
        structureType: Pdata.structureType,
        tiltAngle: parseInt(Pdata.tileAngle),
        irradiation: parseFloat(Pdata.irradiation),
        plantGeneration: parseFloat(Pdata.plantGeneration),
        emailID: Pdata.emailID,
        phoneNumber: phoneNumberCode + Pdata.phoneNumber,
        latitude: location.lat,
        longitude: location.lng,
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
        setMarker(null);
      }
    } catch (error) {
      alert("Error is ", error.message);
      console.log("Error is ", error.message);
    }
  };
  useEffect(() => {
    getAllProjects();
  }, []);

  return (
    <>
      <div
        className="select-place-modal"
        style={{
          height: projectCountContainer ? "100%" : "0",
          overflow: projectCountContainer ? "auto" : "hidden",
        }}
      ></div>
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
            onClick={() => setOpenForm(false)}
          ></i>
          <h2>Fill Project Details</h2>
          <form autoComplete="on" onSubmit={(e) => formSubmitHandler(e)}>
            <div>
              <label htmlFor="country">Country: </label>
              {/* <input type="text" id="name" value={ProjectData.userName} onChange={(e) => setProjectData({ ...ProjectData, userName: e.target.value })} >
                            </input> */}
              <select
                id="country"
                onChange={(e) => {
                  setOpenDefaultData({
                    ...openDefaulData,
                    city: false,
                    moduleCapacity: false,
                  });
                  setLocationDetail({
                    ...locationDetail,
                    countryCode: CountryAndState[e.target.value].isoCode,
                  });
                  setProjectData({
                    ...ProjectData,
                    country: CountryAndState[e.target.value].name,
                  });
                }}
                required
              >
                <option selected disabled>
                  Select Country
                </option>

                {CountryAndState?.map((e, index) => {
                  return (
                    <option key={index} value={index}>
                      {e.name}
                    </option>
                  );
                })}
              </select>
            </div>
            <div>
              <label htmlFor="state">State: </label>
              <select
                id="state"
                onChange={(e) => {
                  setOpenDefaultData({
                    ...openDefaulData,
                    city: false,
                    moduleCapacity: false,
                  });
                  let val = State.getStatesOfCountry(
                    locationDetail.countryCode
                  )[e.target.value];
                  setLocationDetail({
                    ...locationDetail,
                    stateCode: val.isoCode,
                  });
                  setProjectData({
                    ...ProjectData,
                    state: val.name,
                  });
                }}
                required
              >
                <option selected disabled>
                  Select State
                </option>
                {State.getStatesOfCountry(locationDetail.countryCode)?.map(
                  (e, index) => {
                    return (
                      <option key={index} value={index}>
                        {e.name}
                      </option>
                    );
                  }
                )}
              </select>
            </div>

            <div>
              <label htmlFor="city">City/Region: </label>

              {!openDefaulData.city && (
                <select
                  id="city"
                  onChange={(e) => {
                    if (e.target.value === "city-not-availabel") {
                      setOpenDefaultData({
                        ...openDefaulData,
                        city: true,
                      });
                      return;
                    }
                    let val = City.getCitiesOfState(
                      locationDetail.countryCode,
                      locationDetail.stateCode
                    )[e.target.value];
                    setLocationDetail({
                      ...locationDetail,
                      cityCode: val.isoCode,
                    });
                    setProjectData({
                      ...ProjectData,
                      city: val.name,
                    });
                  }}
                  required
                >
                  <option selected disabled>
                    Select City
                  </option>
                  <option
                    style={{ fontWeight: "700" }}
                    key={"city-not-availabel"}
                    value={"city-not-availabel"}
                  >
                    City not available in the below list
                  </option>

                  {City.getCitiesOfState(
                    locationDetail.countryCode,
                    locationDetail.stateCode
                  )?.map((e, index) => {
                    return (
                      <option key={index} value={index}>
                        {e.name}
                      </option>
                    );
                  })}
                </select>
              )}
              {openDefaulData.city && (
                <input
                  type="text"
                  id="city"
                  value={ProjectData.city}
                  onChange={(e) =>
                    setProjectData({ ...ProjectData, city: e.target.value })
                  }
                  required
                />
              )}
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
                    borderLeft: " 1.5px solid rgba(204, 204, 204, 1)",
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
                    borderRight: " 1.5px solid rgba(204, 204, 204, 1)",
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

              <input type="submit" value="Submit" />
            </div>
          </form>
        </div>
      </div>
      {/* {loading ? (
        <div
          style={{
            textAlign: "center",
            height: "100vh",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: "5vmin",
          }}
        >
          Please Wait . . .
        </div>
      ) : ( */}
      <>
        {/* <div className="heading-container">
            <h3>!! Welcome TO pvFLEET Performance Dashboard !! </h3>
            <div>
              <span>GreenEnco Limited </span>
              <span>Maximizing Asset Values</span>
            </div>
          </div> */}
        <div className="main-container">
          <div>
            <div>
              <span>GreenEnco Limited </span>
              <span>Maximizing Asset Values</span>
            </div>
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
              <span>Your location</span>
              <svg
                height={"25px"}
                width={"25px"}
                viewBox="0 0 512 512"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                fill="red"
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
                      fill="red"
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
            <div>
              <button onClick={() => submitHandler()}>
                Fill Your Project Detail Here
              </button>
            </div>
          </div>
          {!loading && (
            <Map
              ref={ref}
              style={{ cursor: "default" }}
              // containerStyle={{
              //     position: "relative",
              //     width: "100%",
              //     height: "84vh",
              //     borderRadius: "14px",
              // }}

              // google={window.google}
              // streetViewControl={false}
              // scaleControl={true}
              // fullscreenControl={false}
              // styles={
              //     [
              //         {
              //             featureType: "poi.business",
              //             elementType: "labels",
              //             stylers: [{
              //                 visibility: "off"
              //             }]
              //         }
              //     ]
              // }
              // gestureHandling={"greedy"}
              // disableDoubleClickZoom={true}
              // minZoom={0}
              // maxZoom={25}
              // mapTypeControl={true}
              // zoomControl={true}
              // clickableIcons={false}
              // mapTypeId={window.google.maps.MapTypeId.SATELLITE}
              minZoom={2.5}
              maxZoom={17}
              containerStyle={{
                position: "relative",
                width: "100%",
                height: "91vh",
                borderRadius: "14px",
                cursor: "default",
              }}
              google={window.google}
              initialCenter={center}
              center={center}
              zoom={zoom}
              onClick={(el, y, w) => handleClick(w)}
              scaleControl={true}
              onCenterChanged={(e, ee, eee) => null}
              onZoomChanged={(e, ee, eee) => {
                setZoom(ee.getZoom());
              }}
              draggingCursor={"default"}
              draggableCursor={"default"}
              // disableDefaultUI={false}
              // mapTypeControl={true}
              // mapTypeControlOptions={{
              //     style: window.google.maps.MapTypeControlStyle.DROPDOWN_MENU,
              //     position: window.google.maps.ControlPosition.TOP_CENTER,
              //     mapTypeIds: ["id1", "id2"]
              // }}
              onReady={(e, ee) => {
                ee.setOptions({
                  mapTypeId: window.google.maps.MapTypeId.TERRAIN,
                  // disableDefaultUI:true,
                  mapTypeControl: true,
                  mapTypeControlOptions: {
                    style:
                      window.google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                    position: window.google.maps.ControlPosition.TOP_LEFT,
                    // mapTypeIds: [
                    //     window.google.maps.MapTypeId.ROADMAP,
                    //     window.google.maps.MapTypeId.SATELLITE,
                    //     window.google.maps.MapTypeId.HYBRID
                    // ]
                  },
                  styles: [
                    {
                      featureType: "road",
                      stylers: [{ visibility: "off" }],
                    },
                  ],
                });
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <h2
                  style={{
                    position: "relative",
                    top: "1vmin",
                    zIndex: 1111,
                    color: "white",
                    fontWeight: "800",
                    width: "fit-content",
                    opacity:0.8
                  }}
                >
                  !! Welcome TO pvFLEET Performance Dashboard !!{" "}
                </h2>
              </div>
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
              >
                <i
                  onClick={() => setOpenData(false)}
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

              {projects?.map((e, index) => {
                return (
                  <Marker
                    // animation={".5s ease-in-out"}
                    // label={`${e.projectCount || 1}`}
                    icon={{
                      //    url:'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
                      // path:'M12.75 0l-2.25 2.25 2.25 2.25-5.25 6h-5.25l4.125 4.125-6.375 8.452v0.923h0.923l8.452-6.375 4.125 4.125v-5.25l6-5.25 2.25 2.25 2.25-2.25-11.25-11.25zM10.5 12.75l-1.5-1.5 5.25-5.25 1.5 1.5-5.25 5.25z',
                      // scale:1,
                      url: img7,
                      // scale:0.5

                      scaledSize: new window.google.maps.Size(
                        35 + zoom * 2,
                        35 + zoom * 2
                      ),
                    }}
                    label={
                      e.projectCount > 1
                        ? {
                            text: `${e.projectCount}`,
                            fontWeight: "1000",
                            fontSize: "2vmin",
                            color: "white",
                          }
                        : null
                    }
                    // icon={{url:'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'}}
                    // icon={{

                    //     path:'M12.75 0l-2.25 2.25 2.25 2.25-5.25 6h-5.25l4.125 4.125-6.375 8.452v0.923h0.923l8.452-6.375 4.125 4.125v-5.25l6-5.25 2.25 2.25 2.25-2.25-11.25-11.25zM10.5 12.75l-1.5-1.5 5.25-5.25 1.5 1.5-5.25 5.25z',
                    //     fillColor:"#fff",
                    //     strokeColor:"#fff",
                    //     scale:0.7
                    // }}
                    // onLoad={marker => {
                    //     const customIcon = (opts) => Object.assign({
                    //         path: 'M12.75 0l-2.25 2.25 2.25 2.25-5.25 6h-5.25l4.125 4.125-6.375 8.452v0.923h0.923l8.452-6.375 4.125 4.125v-5.25l6-5.25 2.25 2.25 2.25-2.25-11.25-11.25zM10.5 12.75l-1.5-1.5 5.25-5.25 1.5 1.5-5.25 5.25z',
                    //         fillColor: '#34495e',
                    //         fillOpacity: 1,
                    //         strokeColor: '#000',
                    //         strokeWeight: 1,
                    //         scale: 0.8,
                    //         height:"20px",
                    //         width:"20px"
                    //     }, opts);
                    //     marker.setIcon(customIcon({
                    //         fillColor: 'green',
                    //         //   fillColor: 'black',
                    //         strokeColor: 'white',
                    //     }));
                    // }}
                    key={index}
                    position={{ lat: e?.Latitude, lng: e?.Longitude }}
                    onClick={(m, mm, mmm) => {
                      mmm.domEvent.stopPropagation();
                      handleexistMarkerClick(e);
                    }}
                  ></Marker>
                );
              })}
              {marker && (
                <Marker
                  cursor={"default"}
                  draggable={true}
                  onClick={() => setMarker(null)}
                  position={{ lat: marker.lat, lng: marker.lng }}
                />
              )}
            </Map>
          )}
        </div>
      </>
      {/* )} */}
    </>
  );
};

export default GoogleApiWrapper({
  apiKey: "AIzaSyDP7lrCRX5_2WBxb_upHhF9P-9Xk8nwhd8",
  LoadingContainer: () => (
    <h2
      style={{
        textAlign: "center",
        height: "100%",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
      }}
    >
      Please Wait . . .
    </h2>
  ),
})(MyComponent2cpy);
