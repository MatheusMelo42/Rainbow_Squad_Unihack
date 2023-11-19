import Slider, { createSliderWithTooltip } from 'rc-slider';
import 'rc-slider/assets/index.css';
import './timeslider.css';
import {useState} from 'react';

/**
 * Renders a time slider component.
 * @param {Object} props - The component props.
 * @param {Function} props.changeHandler - The function to handle value changes.
 * @returns {JSX.Element} - The rendered time slider component.
 */
export function TimeSlider({changeHandler}) {
        const TooltipSlider = createSliderWithTooltip(Slider);

        const [currentValue, setCurrentValue] = useState(2023);
     
        return (
            <TooltipSlider
                min={2019}
                max={2028}
                defaultValue={2023}
                value={currentValue}
                onChange={(value) => {changeHandler(value); setCurrentValue(value);}}
                tipFormatter={(value) => `Year: ${value}`}
            />
        );
}
   