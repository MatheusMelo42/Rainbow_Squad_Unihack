import Control from "react-leaflet-custom-control";

import './infobox.css';

function numberRounded(x) {
  if (x != null) {
    return Math.round(x);
  } else {
    return '';
  }
}

export function InfoBox({ data, year }) {
  let infoBox;
  if (data != null) {
    infoBox = <div className="info"><h4>{data.name}</h4>
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