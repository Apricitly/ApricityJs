import { initMixin } from "./init.js";

function Apricity(config) {
  if (typeof config === "object") this._init(config);
  else if (typeof config === "function") {
    const setFunOptions = {
      baseUrl: "",
      timeout: 10000,
      headers: {},
      headerBeforeRequest: null,
      headerAfterRequest: null,
    };
    const setedFunOptions = config(setFunOptions);
    this._init(setedFunOptions);
  }
}

initMixin(Apricity);

export default Apricity;
