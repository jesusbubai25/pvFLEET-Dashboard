// Import React and React DOM
import * as React from 'react'
import { render } from 'react-dom'
import MyComponent5 from './MyComponent5'

// Import Google Map component
// import  from './GoogleMapWithMarker'

// Some default styles
const styles = {
  width: '100%',
  height: '536px'
}

// Wrapper with Google Map component
class MyComponent6 extends React.PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      infoboxMessage: '',
      isInfoboxVisible: false,
      markerLang: 0,
      markerLat: 0
    }
  }

  handleMarkerClick = (message, lang, lat) => {
    this.setState({
      infoboxMessage: message, // Message shown in info window
      isInfoboxVisible: !this.state.isInfoboxVisible, // Show info window
      markerLang: lang + 0.006, // Y coordinate for positioning info window
      markerLat: lat - 0.0004 // X coordinate for positioning info window
    })
  }

  handleInfoboxClick = () => {
    this.setState({
      isInfoboxVisible: false
    })
  }

  render() {
    return (
      <div style={styles}>
        <MyComponent5
          googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyDP7lrCRX5_2WBxb_upHhF9P-9Xk8nwhd8&v=3.exp&libraries=geometry,drawing,places&key="
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `100%` }} />}
          mapElement={<div style={{ height: `100%` }} />}
          isInfoboxVisible={this.state.isInfoboxVisible} // Show/hide info window
          infoboxMessage={this.state.infoboxMessage} // Message shown in info window
          handleInfoboxClick={this.handleInfoboxClick} // Handle closing of the info window
          handleMarkerClick={this.handleMarkerClick} // Handle click on Marker component
          infoboxPosY={this.state.markerLang} // Y coordinate for positioning info window
          infoboxPosX={this.state.markerLat} // X coordinate for positioning info window
        />
      </div>
    )
  }
}

export default MyComponent6
// Render everything in HTML
