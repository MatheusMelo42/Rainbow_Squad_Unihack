import Control from "react-leaflet-custom-control";

import './infobox.css';

/**
 * Rounds a number to the nearest integer.
 * @param {number} x - The number to be rounded.
 * @returns {number|string} - The rounded number or an empty string if the input is null.
 */
function numberRounded(x) {
  if (x != null) {
    return Math.round(x);
  } else {
    return '';
  }
}

/**
 * Renders an information box component.
 * @param {Object} props - The component props.
 * @param {Object} props.data - The data object containing information.
 * @param {number} props.year - The year for which data is displayed.
 * @returns {JSX.Element} The rendered information box component.
 */
export function InfoBox({ data, year }) {
  let infoBox;
  if (data != null) {
    infoBox = <div className="info"><h4>{data.name}</h4>
      <br></br>
      <b>GRD_ID:</b> {data.GRD_ID}
      <br></br>
      <b>Population:</b> {numberRounded(data['pop' + year])} 
      <br></br>
      <b>Trashcans:</b> {numberRounded(data['trashcans'])} 
      <br></br>
      <b>Trashcans per 1000 People:</b> {numberRounded(data['trashcans1000'])} </div>
      ;
  } else {
    infoBox = <h4><i>select a country</i></h4>;
  }

  return (
    <Control position='topright'>
      {infoBox}
    </Control>
  )
}