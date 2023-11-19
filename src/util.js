import { Icon} from "leaflet";

/**
 * Returns the color based on the given value, colors, and scale.
 * @param {number} val - The value to determine the color for.
 * @param {string[]} colors - An array of color codes.
 * @param {number[]} scale - An array of scale values.
 * @returns {string} The color code.
 */
export function getColor(val, colors, scale) {
    if (!val) {
        return '#ddd';
    }

    let colorsToUse = colors[scale.length - 7];

    for (let i = 0; i < scale.length; i++) {
        if (val < scale[i]) {
            return colorsToUse[i];
        }
    }

    return colorsToUse[colorsToUse.length - 1];
}

/**
 * CustomIconType represents the different types of custom icons.
 * @typedef {Object} CustomIconType
 * @property {string} ALL - Represents all custom icons.
 * @property {string} GLASS - Represents the glass custom icon.
 * @property {string} EXPIRED_MEDICINES - Represents the expired medicines custom icon.
 * @property {string} USED_OIL - Represents the used oil custom icon.
 * @property {string} CARDBOARD_PAPER_PLASTIC - Represents the cardboard, paper, plastic custom icon.
 * @property {string} ALUMINUM_CANS_BATTERIES_GLASS_BULBS_PAPER_PLASTIC - Represents the aluminum cans, batteries, glass, bulbs, paper, plastic custom icon.
 * @property {string} BATTERIES_USED_MOTOR_OIL_USED_OIL - Represents the batteries, used motor oil, used oil custom icon.
 * @property {string} CLOTHING - Represents the clothing custom icon.
 * @property {string} ALUMINUM_CANS_BATTERIES_GLASS_BULBS_PLASTIC - Represents the aluminum cans, batteries, glass, bulbs, plastic custom icon.
 * @property {string} BATTERIES_GLASS_PAPER - Represents the batteries, glass, paper custom icon.
 * @property {string} SMALL_APPLIANCES_BATTERIES_BULBS - Represents the small appliances, batteries, bulbs custom icon.
 * @property {string} CARDBOARD_POLYSTYRENE_BULKY_WASTE - Represents the cardboard, polystyrene, bulky waste custom icon.
 * @property {string} ALUMINUM_CANS_SMALL_APPLIANCES_BATTERIES_GLASS_BULBS_PAPER_PLASTIC - Represents the aluminum cans, small appliances, batteries, glass, bulbs, paper, plastic custom icon.
 */
export const CustomIconType = {
    ALL: "all",
    GLASS: "glass",
    EXPIRED_MEDICINES: "expired medicines",
    USED_OIL: "used oil",
    CARDBOARD_PAPER_PLASTIC: "cardboard, paper, plastic",
    ALUMINUM_CANS_BATTERIES_GLASS_BULBS_PAPER_PLASTIC: "aluminum cans, batteries, glass, bulbs, paper, plasti",
    BATTERIES_USED_MOTOR_OIL_USED_OIL: "batteries, used motor oil, used oil",
    CLOTHING: "clothing",
    ALUMINUM_CANS_BATTERIES_GLASS_BULBS_PLASTIC: "aluminum cans, batteries, glass, bulbs, plastic",
    BATTERIES_GLASS_PAPER: "batteries, glass, paper",
    SMALL_APPLIANCES_BATTERIES_BULBS: "small appliances, batteries, bulbs",
    CARDBOARD_POLYSTYRENE_BULKY_WASTE: "cardboard, polystyrene, bulky waste",
    ALUMINUM_CANS_SMALL_APPLIANCES_BATTERIES_GLASS_BULBS_PAPER_PLASTIC: "aluminum cans, small appliances, batteries, glass, bulbs, paper, plastic"
};

/**
 * Returns a custom icon based on the provided type_color.
 * @param {string} type_color - The type color of the icon.
 * @returns {Icon} - The custom icon.
 */
export const getCustomIcon = (type_color) => {
    let iconUrl = require("./icon/icon.png");
    let iconSize = [38, 38];

    switch (type_color) {
        case CustomIconType.GLASS:
            iconUrl = require("./icon/glass_icon.png");
            break;
        case CustomIconType.EXPIRED_MEDICINES:
            iconUrl = require("./icon/pink_icon.png");
            break;
        case CustomIconType.USED_OIL:
            iconUrl = require("./icon/red_icon.png");
            break;
        case CustomIconType.CARDBOARD_PAPER_PLASTIC:
            iconUrl = require("./icon/green_icon.png");
            break;
        case CustomIconType.ALUMINUM_CANS_BATTERIES_GLASS_BULBS_PAPER_PLASTIC:
            iconUrl = require("./icon/yellow_icon.png");
            break;
        case CustomIconType.BATTERIES_USED_MOTOR_OIL_USED_OIL:
            iconUrl = require("./icon/red_batteries_icon.png");
            break;
        case CustomIconType.CLOTHING:
            iconUrl = require("./icon/beige_icon.png");
            break;
        case CustomIconType.ALUMINUM_CANS_BATTERIES_GLASS_BULBS_PLASTIC:
            iconUrl = require("./icon/yellow_cans_icon.png");
            break;
        case CustomIconType.BATTERIES_GLASS_PAPER:
            iconUrl = require("./icon/pink_icon.png");
            break;
        case CustomIconType.SMALL_APPLIANCES_BATTERIES_BULBS:
            iconUrl = require("./icon/yellow_batteries_icon.png");
            break;
        case CustomIconType.CARDBOARD_POLYSTYRENE_BULKY_WASTE:
            iconUrl = require("./icon/blue_icon.png");
            break;
        case CustomIconType.ALUMINUM_CANS_SMALL_APPLIANCES_BATTERIES_GLASS_BULBS_PAPER_PLASTIC:
            iconUrl = require("./icon/black_icon.png");
            break;
        default:
            iconUrl = require("./icon/darkpurple_icon.png");
            break;
    }

    return new Icon({
        iconUrl,
        iconSize
    });
};