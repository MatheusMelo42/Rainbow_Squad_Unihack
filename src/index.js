/**
 * Renders the ColorMap component in the root element of the DOM.
 * @module index
 */
import React from 'react';
import ReactDOM from 'react-dom';
import ColorMap from './ColorMap'

ReactDOM.render(
    <React.StrictMode>
        <ColorMap />
    </React.StrictMode>
    ,
    document.getElementById('root')
);
