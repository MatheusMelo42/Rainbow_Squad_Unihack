import { CustomIconType } from './util';
import './CanTypeScopeSelector.css';

/**
 * Renders a select input for selecting a can type scope.
 * 
 * @param {Object} props - The component props.
 * @param {string} props.value - The currently selected value.
 * @param {function} props.changeHandler - The change handler function.
 * @returns {JSX.Element} The rendered select input.
 */
export function CanTypeScopeSelector({ value, changeHandler }) {
    const optionsArray = Object.keys(CustomIconType).map(key => ({
        key: key,
        name: CustomIconType[key]
      }));

    return (
        <select className="can-scope-selector" value={value.key} onChange={changeHandler}>
            {optionsArray.map((e) => {
                return <option key={e.key} value={e.key}>{e.name}</option>
            })}
        </select>
    );
}