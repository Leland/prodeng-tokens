const StyleDictionary = require("style-dictionary").extend("config.json");

StyleDictionary.registerTransform({
  name: "typography/px-to-rem",
  type: "value",
  matcher(prop) {
    const transformable =
      prop.attributes.type === "type" &&
      (prop.attributes.item === "line-height" ||
        prop.attributes.item === "font-size");
    // Figma's pixel values are unitless
    return transformable && !isNaN(prop.original.value);
  },
  transformer(prop) {
    const BASE_FONT_PIXEL_SIZE = 16;
    const remValue = prop.original.value.toFixed(3) / BASE_FONT_PIXEL_SIZE;
    return `${remValue.toString()}rem`;
  },
});

StyleDictionary.registerTransform({
  name: "typography/percent-line-heights-to-unitless",
  type: "value",
  matcher(prop) {
    const transformable =
      prop.attributes.type === "type" && prop.attributes.item === "line-height";

    return (
      transformable &&
      typeof prop.original.value === "string" &&
      prop.original.value.endsWith("%")
    );
  },
  transformer(prop) {
    const unitlessVal = (prop.original.value.slice(0, -1)) / 100;
    return unitlessVal.toFixed(2);
  },
});

StyleDictionary.registerTransform({
  name: "typography/weight-strings-to-vals",
  type: "value",
  matcher(prop) {
    const transformable =
      prop.attributes.type === "type" && prop.attributes.item === "font-weight";

    return transformable && isNaN(prop.original.value);
  },
  transformer(prop) {
    switch (prop.original.value) {
      case "Regular":
        return 400;
      case "Bold":
        return 700;
      case "Bold Display":
        return 800;
      default:
        return prop.original.value;
    }
  },
});

StyleDictionary.registerTransformGroup({
  name: "custom/css",
  transforms: StyleDictionary.transformGroup["css"].concat([
    "typography/px-to-rem",
    "typography/weight-strings-to-vals",
    "typography/percent-line-heights-to-unitless"
  ]),
});

StyleDictionary.buildAllPlatforms();
