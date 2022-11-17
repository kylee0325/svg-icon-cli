// https://github.com/ant-design/ant-design-icons/blob/master/packages/icons-vue
var containers = [];

var styleElements = [];

var usage =
  "insert-css: You need to provide a CSS string. Usage: insertCss(cssString[, options]).";

function createStyleElement() {
  var styleElement = document.createElement("style");
  styleElement.setAttribute("type", "text/css");
  return styleElement;
}

function insertCss(css, options) {
  options = options || {};

  if (css === undefined) {
    throw new Error(usage);
  }

  var position = options.prepend === true ? "prepend" : "append";
  var container =
    options.container !== undefined
      ? options.container
      : document.querySelector("head");
  var containerId = containers.indexOf(container);

  if (containerId === -1) {
    containerId = containers.push(container) - 1;
    styleElements[containerId] = {};
  }

  var styleElement;

  if (
    styleElements[containerId] !== undefined &&
    styleElements[containerId][position] !== undefined
  ) {
    styleElement = styleElements[containerId][position];
  } else {
    styleElement = styleElements[containerId][position] = createStyleElement();

    if (position === "prepend") {
      container.insertBefore(styleElement, container.childNodes[0]);
    } else {
      container.appendChild(styleElement);
    }
  }

  if (css.charCodeAt(0) === 0xfeff) {
    css = css.substr(1, css.length);
  }

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText += css;
  } else {
    styleElement.textContent += css;
  }

  return styleElement;
}

export default insertCss;
