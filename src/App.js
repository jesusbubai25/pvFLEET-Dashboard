import logo from "./logo.svg";
import "./App.css";
import MyComponent2 from "./mapComponent/MyComponent2";
import Leafleet from "./mapComponent/Leafleet";
import MyComponent2cpy from "./mapComponent/MyComponent2cpy";
import Leafleet2 from "./mapComponent/Leafleet2";

function App() {
  return (
    <>
      <div className="app">
        {/* <MyComponent2 /> */}
        <MyComponent2cpy />
        {/* <Leafleet/> */}
        {/* <Leafleet2/> */}
      </div>
    </>
  );
}

export default App;

// const geocoder = new window.google.maps.Geocoder();
// const location = {
//     lat: 55.204321665291644,
//     lng: 90.60957901382083
// }

// const getLocName = (my_location) => {
//     geocoder.geocode({ 'latLng': my_location }, function (results, status) {
//         if (status === window.google.maps.GeocoderStatus.OK) {
//             if (results[0]) {
//                 let adrs_comp = results[0].address_components, loc_name, area_name;
//                 for (let i = 0; i < adrs_comp.length; i++) {
//                     if (adrs_comp[i].types[0] === "locality") {
//                         loc_name = adrs_comp[i].long_name;
//                     }
//                     if (adrs_comp[i].types[0] === "administrative_area_level_1") {
//                         area_name = adrs_comp[i].long_name;
//                     }
//                 }
//             }
//         }
//     });
// }

// fetch('https://maps.googleapis.com/maps/api/geocode/json?latlng=11.2742848,75.8013801&key=AIzaSyDP7lrCRX5_2WBxb_upHhF9P-9Xk8nwhd8')
//     .then(res => res.json())
//     .then(result => console.log("result is ", result))
//     .catch(err => console.log(err))
