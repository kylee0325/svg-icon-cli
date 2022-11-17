import { nextTick } from "vue";
import insertCss from "./insert-css.js";

export const iconStyles = `
$target$`;

let cssInjectedFlag = false;

export const useInsertStyles = (styleStr = iconStyles) => {
  nextTick(() => {
    if (!cssInjectedFlag) {
      if (
        typeof window !== "undefined" &&
        window.document &&
        window.document.documentElement
      ) {
        insertCss(styleStr, {
          prepend: true,
        });
      }
      cssInjectedFlag = true;
    }
  });
};
