import React from "react";
import { Annotation, ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import geoUrl from '../style/feature.json'


const SimpleMap = () => {
    return (
        <div>
            <ComposableMap style={{
                // border:"2px solid red"
                padding: "2vmax",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}
            >
                <Geographies
                    style={{
                        border: "2px solid red"
                    }}
                    geography={geoUrl}>
                    {({ geographies }) =>
                        geographies.map((geo) => (
                            <Geography
                                style={{
                                    border: "2px solid red"
                                }}
                                key={geo.rsmKey} geography={geo}

                            />

                        ))
                    }
                </Geographies>

                <Marker coordinates={[2.3522, 48.8566]}>
                    <circle r={10} fill="#F00" stroke="#fff" strokeWidth={1} style={{display:"flex",alignItems:"center",justifyContent:"center"}} />
                    <text
                        textAnchor="middle"
                        y={3}
                        style={{ fontFamily: "system-ui", fill: "#5D5A6D",fontSize:"1.3vmin",fontWeight:600 }}
                    >
                        {2}
                    </text>
                </Marker>

                
                <Marker  coordinates={[40.6943, -73.9249]}>
                    <circle r={10} fill="#F00" stroke="#fff" strokeWidth={1} style={{display:"flex",alignItems:"center",justifyContent:"center"}} />
                    <text
                        textAnchor="middle"
                        y={3}
                        style={{ fontFamily: "system-ui", fill: "#5D5A6D",fontSize:"1.3vmin",fontWeight:600 }}
                    >
                        {2}
                    </text>
                </Marker>
                {/* <Annotation
                    subject={[2.3522, 48.8566]}
                    dx={0}
                    dy={-30}
                    connectorProps={{
                        stroke: "#FF5533",
                        strokeWidth: 3,
                        strokeLinecap: "round"

                    }}
                    
                >
                    <text x="-6" textAnchor="end" alignmentBaseline="middle" fill="#F53">
                        {"Paris"}
                    </text>
                </Annotation> */}
            </ComposableMap>
        </div>
    );
};

export default SimpleMap