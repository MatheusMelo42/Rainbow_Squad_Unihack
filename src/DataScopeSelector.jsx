import './DataScopeSelector.css';

/**
 * Renders a data scope selector component.
 *
 * @param {Object[]} options - The options for the selector.
 * @param {string} options[].key - The key of the option.
 * @param {string} options[].name - The name of the option.
 * @param {Object} value - The selected value.
 * @param {string} value.key - The key of the selected value.
 * @param {function} changeHandler - The change handler function.
 * @returns {JSX.Element} The data scope selector component.
 */
export function DataScopeSelector({ options, value, changeHandler }) {
    return (
        <select className="data-scope-selector" value={value.key} onChange={changeHandler}>
            {options.map((e) => {
                return <option key={e.key} value={e.key}>{e.name}</option>
            })}
        </select>
    );
}