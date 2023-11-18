import Slider, { createSliderWithTooltip } from 'rc-slider';
import 'rc-slider/assets/index.css';
import './timeslider.css';
import {useState} from 'react';

export function TimeSlider({changeHandler}) {
    const TooltipSlider = createSliderWithTooltip(Slider);

    const [currentValue, setCurrentValue] = useState(2023);
   
    return (
      <TooltipSlider
        min={2023}
        max={2030}
        defaultValue={2023}
        value={currentValue}
        onChange={(value) => {changeHandler(value); setCurrentValue(value);}}
        tipFormatter={(value) => `Year: ${value}`}
      />
    );
   }
   