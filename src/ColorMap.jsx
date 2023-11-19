import {useState, useRef, useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from 'react-leaflet'
import MarkerClusterGroup from "react-leaflet-cluster";
import L from 'leaflet';
import { InfoBox } from './InfoBox';
import { Legend } from './Legend';
import { TimeSlider } from './timeslider';
import { DataScopeSelector } from './DataScopeSelector';
import { getColor } from './util';
import { Icon, divIcon, point } from "leaflet";

import './index.css';

import countries from './population.json';
import trashcans from './trash_cans.json';

const dataScopes = [
    {
        name: "Population",
        key: 'pop',
        description: "The population of the region",
        unit: "",
        scale: [100, 500, 1000, 2500, 5000, 10000, 25000]
    },
    {
        name: "Trashcans",
        key: "trashcans",
        description: "Amount of trashcans in the region",
        unit: "",
        scale: [1000, 5000, 10000, 25000, 50000, 100000, 250000]
    },
    {
        name: "Trashcans per 1000 people",
        key: "trashcan1000",
        description: "Amount of trashcans per thousand people",
        unit: "",
        scale: [10, 50, 100, 250, 500, 1000, 2500]
    }
];

const colors = [
    ['#fcfca7', '#f4e283', '#eec762', '#e8ab44', '#e28d2b', '#dc6e16', '#d4490a', '#cb0c0c'],
    ['#ffffd9', '#edf8b1', '#c7e9b4', '#7fcdbb', '#41b6c4', '#1d91c0', '#225ea8', '#253494', '#081d58']
]

export default function ChoroplethMap() {
    const [dataScope, setDataScope] = useState(dataScopes[0]);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [hoveredCountry, setHoveredCountry] = useState(null);
    const [timeScope, setTimeScope] = useState(2023);

    const geoMap = useRef(null);

    const customIcon = (type_color) => {
        let iconUrl = require("./icon.png");
        let iconSize = [38, 38];
        
        if (type_color === "glass") {
            iconUrl = require("./glass_icon.png");
        }/* else if (type_color === "expired medicines") {
            iconUrl = require("./pink_icon.png");
        } else if (type_color === "used oil") {
            iconUrl = require("./red_icon.png");
        } else if (type_color === "cardboard, paper, plastic") {
            iconUrl = require("./green_icon.png");
        } else if (type_color === "aluminum cans, batteries, glass, bulbs, paper, plasti") {
            iconUrl = require("./yellow_icon.png");
        } else if (type_color === "batteries, used motor oil, used oil") {
            iconUrl = require("./red_icon.png");
        } else if (type_color === "clothing") {
            iconUrl = require("./beige_icon.png");
        } else if (type_color === "aluminum cans, batteries, glass, bulbs, plastic") {
            iconUrl = require("./yellow_icon.png");
        } else if (type_color === "batteries, glass, paper") {
            iconUrl = require("./pink_icon.png");
        } else if (type_color === "small appliances, batteries, bulbs") {
            iconUrl = require("./yellow_icon.png");
        } else if (type_color === 'cardboard, polystyrene, bulky waste') {
            iconUrl = require("./blue_icon.png");
        } else if (type_color === 'aluminum cans, small appliances, batteries, glass, bulbs, paper, plastic') {
            iconUrl = require("./black_icon.png");
        } else {
            iconUrl = require("./darkpurple_icon.png");
        }
        */
        return new Icon({
            iconUrl,
            iconSize
        });
    };

    const handleDataScopeChange = (event) => {
        setDataScope(dataScopes.find(element => element.key === event.target.value));
    }

    const handleTimeScopeChange = (event) => {
        setTimeScope(event);
    }

    const highlightFeature = (e) => {
        let layer = e.target;
        layer.setStyle({
            color: '#444',
            weight: 2
        });
        layer.bringToFront();
        setHoveredCountry(layer.feature.properties);
    }

    const resetHighlight = (e) => {
        e.target.setStyle({
            color: '#888',
            weight: 1
        });
        setHoveredCountry(null);
    }

    const onEachFeature = useCallback((feature, layer) => {
        var dataName = dataScope.key;
            if (dataScope.key === 'pop') {
                dataName = 'pop' + timeScope;
            }

        if (geoMap.current) {
            const current = geoMap.current.getLayers().find(e => e.feature.properties.iso_a3 === feature.properties.iso_a3);
            current.setTooltipContent(`<div><span>${dataScope.name}</span>: ${Math.round(feature.properties[dataName])}</div>`);
        } else {
            layer.bindTooltip(`<div><span>${dataScope.name}</span>: ${Math.round(feature.properties[dataName])}</div>`, { sticky: true });

            layer.on({
                mouseover: highlightFeature,
                mouseout: resetHighlight,
                click: () => setSelectedCountry(feature.properties)
            });
        }
    }, [dataScope])

    const style = useCallback((feature) => {
        let mapStyle = {
            fillColor: getColor(feature.properties[dataScope.key + timeScope], colors, dataScope.scale),
            weight: 1,
            opacity: 1,
            color: '#888',
            dashArray: '3',
            fillOpacity: 0.7
        };

        return mapStyle;
    }, [dataScope]);

    const geoJsonComponent = useMemo(
        () => <GeoJSON data={countries} style={style} onEachFeature={onEachFeature} ref={geoMap} />,
        [style, onEachFeature]
    );

    const createClusterCustomIcon = function (cluster) {
        return new divIcon({
        html: `<span class="cluster-icon">${cluster.getChildCount()}</span>`,
        className: "custom-marker-cluster",
        iconSize: point(33, 33, true)
        });
    };

    return (
        <div className='mapContainer' >
            <MapContainer center={[45.76, 21.22]}
                zoomControl={false}
                zoom={12}
                maxZoom={18}
                minZoom={10}
                zoomSnap={0.5}
                zoomDelta={0.5}
                wheelPxPerZoomLevel={120}
                maxBoundsViscosity={0.5}
                maxBounds={L.latLngBounds(new L.LatLng(50, 15), new L.LatLng(40, 25))}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {geoJsonComponent}
                <InfoBox data={selectedCountry} year={timeScope}/>
                <Legend scope={dataScope} colors={colors} hoveredCountry={hoveredCountry} />
                <MarkerClusterGroup
                    chunkedLoading
                    iconCreateFunction={createClusterCustomIcon}
                >
                    {trashcans.map((marker) => (
                    <Marker position={marker.geometry.coordinates} icon={customIcon(marker.properties.Type)} key={marker.properties.id}>
                        <Popup>
                            {'Address: ' + marker.properties.adresa}
                            <br />
                            {'Type: ' + marker.properties.Type}
                            <br />
                            {'Responsible Company: ' + marker.properties.companie}
                            <br />
                            {'Company Website: '}
                            <a href={marker.properties.website} target="_blank" rel="noopener noreferrer">
                                {marker.properties.website}
                            </a>
                        </Popup>
                    </Marker>
                    ))}
                </MarkerClusterGroup>
            </MapContainer>
            <DataScopeSelector options={dataScopes} value={dataScope} changeHandler={handleDataScopeChange} />
            <TimeSlider value={timeScope} changeHandler={handleTimeScopeChange}/>
        </div>
    );
}