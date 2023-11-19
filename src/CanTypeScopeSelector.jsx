import { CustomIconType } from './util';
import './CanTypeScopeSelector.css';

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