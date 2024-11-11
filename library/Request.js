const axios = require("axios");
const { Agent } = require("https");

class Request {
  __baseUrls;
  __method = "GET";
  __responseType = "json"; 
  __timeout = 60000;
  __rejectUnauthorized = false;
  __requestCert = true;
  __headers = {
      Accept: 'application/json, text/plain, */*',
    };

  __defaultPath = "/";
  __instance;
  __METHODS = {
   GET: "get", 
   POST: "post", 
   PUT: "put", 
   DELETE: "delete", 
   PATCH: "patch", 
  }

  __STATUS = {
    INTERNAL_ERROR: 500
  }
  __REFUSED_STATUS_LIST = [
    this.__STATUS.INTERNAL_ERROR
  ];
  _contextRequest;
  _baseUrlInUsing = 0;
  _response;
  _methodDefinedByUser;

  constructor(props) {
    this.responseType = props.responseType;
    this.timeout = props.timeout;
    this.rejectUnauthorized = props.rejectUnauthorized;
    this.requestCert = props.requestCert;
    this.headers = props.headers;
    this.method = props.method;
    this.baseUrls = props.baseUrls

    this.__createInstance();
    this.__defineAutoRedirect(this.__resend);
  }

  async send({ path, body, method, json, data }) {
    try {
      this._methodDefinedByUser = method;
      this.body = body;
      this.path = path;
      this.json = json;
      this.data = data;

      this.__prepareObjectRequest();
      console.log(`Tentativa ${this._baseUrlInUsing + 1}, url: ${this.__getCurrentBaseURL()} path: ${this.contextRequest.url}`);
      
      this.response = await this.__send();
      return this.response?.data ?? this.response;
    } catch (error) {
      console.log("-------------->", error);
      throw new Error(JSON.stringify(error));
    }
  }

  setHeaders(headers) {
    this.headers = Object.assign(this.headers, headers);
  }

  async __send() {
    try {
      return await this.instance.request(this.contextRequest);
    } catch (error) {
      throw new Error(JSON.stringify(error));
    }
  }

  __prepareObjectRequest() {
    this.contextRequest = {
      baseURL: this.__getCurrentBaseURL(),
      url: this.path,
      method: this._methodDefinedByUser,
      responseType: this.responseType,
      timeout: this.timeout,
      rejectUnauthorized: this.rejectUnauthorized,
      requestCert: this.requestCert,
      headers: this.headers,
      body: this.body,
      json: this.json,
      data: this.data,
      httpsAgent: new Agent({rejectUnauthorized: false, requestCert: true}),
    }

    if (!this.contextRequest.method) this.contextRequest.method = this.methods[this.method]
    if (!this.contextRequest.path) this.contextRequest.path = this.defaultPath;
    if (!this.contextRequest.body) delete this.contextRequest.body;
    if (!this.contextRequest.json) delete this.contextRequest.json;
    if (!this.contextRequest.data) delete this.contextRequest.data;
  }

  __defineBackupBaseUrl() {
    this._baseUrlInUsing += 1;
  }

  __isExistsOtherBaseURL() {
    const totalUrls = this.baseUrls.length;
    if (this._baseUrlInUsing === totalUrls) return false;
    return true;
  }

  __getCurrentBaseURL() {
    return this.baseUrls[this._baseUrlInUsing]
  }

  async __resend(errorInstance) {
    try {
      if (errorInstance.response && [ ...this.__REFUSED_STATUS_LIST ].includes(errorInstance.response.status)) {
        this.__defineBackupBaseUrl();
        if (!this.__isExistsOtherBaseURL()) throw new Error("Internal error");

        this.response = await this.send({
          path: this.contextRequest.url,
          method: this.contextRequest.method,
          json: this.contextRequest?.json,
          body: this.contextRequest?.body,
        });
        return this.response;
      }
      return Promise.reject(errorInstance);
    } catch (error) {
      throw new Error(JSON.stringify(error));
    } 
  }

  __defineAutoRedirect(callback) {
    const boundCallback = callback.bind(this);
    this.instance.defaults.maxRedirects = 0 ;
    this.instance.interceptors.response.use(
      response => response, 
      async (error) => await boundCallback(error)
    )
  }

  __createInstance() {
    this.__instance = axios.create({
      baseURL: this.__getCurrentBaseURL(),
      timeout: this.timeout,
      headers: this.headers
    });
  }

  get response() {
    return this._response;
  }

  set response(value) {
    let response = value;
    if (!response) response = this._response;
    this._response = response;
  }

  get instance() {
    return this.__instance;
  }

  get baseUrls() {
    return this.__baseUrls;
  }

  set baseUrls(value) {
    let urls = value;
    if (!urls) urls = this.__baseUrls;
    if (!Array.isArray(urls)) urls = [urls];
    this.__baseUrls = urls;
  }

  get defaultPath() {
    return this.__defaultPath;
  }

  get methods() {
    return this.__METHODS;
  }

  get method() {
    return this.__method;
  }

  set method(value) {
    let method;
    if (!!value) method = value.toUpperCase();
    if (!method || !this.methods[method]) method = this.__method;
    this.__method = method;
  }

  get responseType() {
    return this.__responseType;
  }

  set responseType(value) {
    let responseType = value;
    if (!responseType) responseType = this.__responseType;
    this.__responseType = responseType;
  }

  get timeout() {
    return this.__timeout;
  }

  set timeout(value) {
    let timeout = value;
    if (!timeout || typeof timeout !== "number") timeout = this.__timeout;
    this.__timeout = timeout;
  }

  get rejectUnauthorized() {
    return this.__rejectUnauthorized;
  }

  set rejectUnauthorized(value) {
    let rejectUnauthorized = value;
    if (!rejectUnauthorized && typeof rejectUnauthorized !== "boolean") rejectUnauthorized = this.__rejectUnauthorized
    this.__rejectUnauthorized = rejectUnauthorized;
  }

  get requestCert() {
    return this.__requestCert;
  }

  set requestCert(value) {
    let requestCert = value;
    if (!requestCert && typeof requestCert !== "boolean") requestCert = this.__requestCert;
    this.__requestCert = requestCert;
  }

  get headers() {
    return this.__headers;
  }

  set headers(value) {
    let headers = value;
    if (!headers || typeof headers !== "object") headers = this.__headers;
    if (!headers.Accept) headers = Object.assign(headers, this.__headers);
    this.__headers = headers;
  }


  get contextRequest() {
    return this._contextRequest;
  }

  set contextRequest(value) {
    let context = value;
    if (!context || typeof context !== "object") context = this._contextRequest;
    this._contextRequest = context;
  }

}

module.exports = Request;
