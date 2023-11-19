import { CustomIconType } from './util';

export function CanTypeScopeSelector({ value, changeHandler }) {
    const optionsArray = Object.keys(CustomIconType).map(key => ({
        key: key,
        name: CustomIconType[key]
      }));

    return (
        <select value={value.key} onChange={changeHandler}>
            {optionsArray.map((e) => {
                return <option key={e.key} value={e.key}>{e.name}</option>
            })}
        </select>
    );
}