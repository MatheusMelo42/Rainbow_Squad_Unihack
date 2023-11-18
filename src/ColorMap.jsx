import {useState, useRef, useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'
import L from 'leaflet';
import { InfoBox } from './InfoBox';
import { Legend } from './Legend';
import { DataScopeSelector } from './DataScopeSelector';
import { getColor } from './util';

import './index.css';

import countries from './romania-with-regions.json';

const dataScopes = [
    {
        name: "Population",
        key: "pop_est",
        description: "The population of the country",
        unit: "",
        scale: [5000000, 10000000, 25000000, 50000000, 75000000, 100000000, 200000000, 1000000000]
    },
    {
        name: "GDP",
        key: "gdp_md_est",
        description: "The GDP of the country",
        unit: "USD",
        scale: [100000, 250000, 500000, 1000000, 2500000, 5000000, 15000000]
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

    const geoMap = useRef(null);

    const handleDataScopeChange = (event) => {
        setDataScope(dataScopes.find(element => element.key === event.target.value));
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
        

        if (geoMap.current) {
            const current = geoMap.current.getLayers().find(e => e.feature.properties.iso_a3 === feature.properties.iso_a3);

            current.setTooltipContent(`<div><span>${dataScope.name}</span>: ${feature.properties[dataScope.key]}</div>`);
        } else {
            layer.bindTooltip(`<div><span>${dataScope.name}</span>: ${feature.properties[dataScope.key]}</div>`, { sticky: true });

            layer.on({
                mouseover: highlightFeature,
                mouseout: resetHighlight,
                click: () => setSelectedCountry(feature.properties)
            });
        }
    }, [dataScope])

    const style = useCallback((feature) => {
        let mapStyle = {
            fillColor: getColor(feature.properties[dataScope.key], colors, dataScope.scale),
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

    return (
        <div className='mapContainer' >
            <MapContainer center={[47, 25]}
                zoomControl={false}
                zoom={6}
                maxZoom={10}
                minZoom={6}
                zoomSnap={0.5}
                zoomDelta={0.5}
                wheelPxPerZoomLevel={120}
                maxBoundsViscosity={0.5}
                maxBounds={L.latLngBounds(new L.LatLng(70, 0), new L.LatLng(20, 50))}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {geoJsonComponent}
                <InfoBox data={selectedCountry} scope={dataScope} />
                <Legend scope={dataScope} colors={colors} hoveredCountry={hoveredCountry} />
            </MapContainer>
            <DataScopeSelector options={dataScopes} value={dataScope} changeHandler={handleDataScopeChange} />
        </div>
    );
}