import {useState, useRef, useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from 'react-leaflet'
import MarkerClusterGroup from "react-leaflet-cluster";
import L from 'leaflet';
import { InfoBox } from './InfoBox';
import { Legend } from './Legend';
import { TimeSlider } from './timeslider';
import { DataScopeSelector } from './DataScopeSelector';
import { CanTypeScopeSelector }  from './CanTypeScopeSelector';
import { getColor, getCustomIcon, CustomIconType } from './util';
import { divIcon, point } from "leaflet";

import './index.css';

import countries from './population.json';
import trashcans from './trash_cans.json';

/**
 * Array of data scopes.
 * @typedef {Object} DataScope
 * @property {string} name - The name of the data scope.
 * @property {string} key - The key of the data scope.
 * @property {string} description - The description of the data scope.
 * @property {string} unit - The unit of the data scope.
 * @property {number[]} scale - The scale of the data scope.
 */

/**
 * Array of data scopes.
 * @type {DataScope[]}
 */
const dataScopes = [
    {
        name: "Population",
        key: 'pop',
        description: "The population of the region",
        unit: "",
        scale: [100, 500, 1000, 2500, 5000, 10000, 25000]
    },
    {
        name: "Trashcan Availability",
        key: "n_trash_cans_in_buffer_scaled",
        description: "Amount of trashcans in the region",
        unit: "",
        scale: [1, 5, 10, 25, 40, 70, 100]
    },
    {
        name: "Acessibility Index A",
        key: "recycling_acessibility_index_A",
        description: "Amount of trashcans per thousand people",
        unit: "",
        scale: [1, 5, 10, 15, 20, 25, 30]
    },
    {
        name: "Acessibility Index B",
        key: "recycling_acessibility_index_B",
        description: "Amount of trashcans per thousand people",
        unit: "",
        scale: [1, 5, 10, 15, 20, 25, 30]
    },
    {
        name: "Acessibility Index C",
        key: "recycling_acessibility_index_C",
        description: "Amount of trashcans per thousand people",
        unit: "",
        scale: [1, 5, 10, 15, 20, 25, 30]
    },
    {
        name: "Acessibility Index D",
        key: "recycling_acessibility_index_D",
        description: "Amount of trashcans per thousand people",
        unit: "",
        scale: [1, 5, 10, 15, 20, 25, 30]
    }
];

/**
 * Array of color palettes.
 * @type {Array<Array<string>>}
 */
const colors = [
    ['#fcfca7', '#f4e283', '#eec762', '#e8ab44', '#e28d2b', '#dc6e16', '#d4490a', '#cb0c0c']
]

/**
 * Renders a Choropleth Map component.
 *
 * @returns {JSX.Element} The Choropleth Map component.
 */
export default function ChoroplethMap() {
    const [dataScope, setDataScope] = useState(dataScopes[0]);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [hoveredCountry, setHoveredCountry] = useState(null);
    const [timeScope, setTimeScope] = useState(2023);
    const [canScope, setCanScope] = useState('ALL');

    const geoMap = useRef(null);

    const handleDataScopeChange = (event) => {
        setDataScope(dataScopes.find(element => element.key === event.target.value));
    }

    const handleTimeScopeChange = (event) => {
        setTimeScope(event);
    }

    const handleCanScopeChange = (event) => {
        setCanScope(event.target.value);
    }

    /**
     * Highlights a feature on the map and updates the hovered country state.
     * @param {Object} e - The event object.
     */
    const highlightFeature = (e) => {
        let layer = e.target;
        layer.setStyle({
            color: '#444',
            weight: 2
        });
        layer.bringToFront();
        setHoveredCountry(layer.feature.properties);
    }

    /**
     * Resets the highlight of a target element.
     * @param {Event} e - The event object.
     */
    const resetHighlight = (e) => {
        e.target.setStyle({
            color: '#888',
            weight: 1
        });
        setHoveredCountry(null);
    }

    /**
     * Callback function for each feature in the map layer.
     * @param {Object} feature - The feature object.
     * @param {Object} layer - The layer object.
     */
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
    }, [dataScope]);

    /**
     * Returns the style object for a given feature.
     * @param {Object} feature - The feature object.
     * @returns {Object} The style object.
     */
    const style = useCallback((feature) => {
        var data = feature.properties[dataScope.key];
        if (dataScope.key === 'pop') {
            data = feature.properties['pop' + timeScope];
        }
        if (dataScope.key === 'n_trash_cans_in_buffer_scaled') {
            data = data * 100;
        }

        let mapStyle = {
            fillColor: getColor(data, colors, dataScope.scale),
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

    /**
     * Creates a custom icon for a cluster.
     * @param {Object} cluster - The cluster object.
     * @returns {Object} - The custom icon for the cluster.
     */
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
                    {trashcans
                        .filter((marker) => canScope === 'ALL' || marker.properties.Type === CustomIconType[canScope])
                        .map((marker) => (
                            <Marker position={marker.geometry.coordinates} icon={getCustomIcon(marker.properties.Type)} key={marker.properties.id}>
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
            <CanTypeScopeSelector value={canScope} changeHandler={handleCanScopeChange} />
            <TimeSlider value={timeScope} changeHandler={handleTimeScopeChange}/>
        </div>
    );
}