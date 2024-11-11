const Request = require("./library/Request");

(async () => {
  try {
    const requestInstance = new Request({
      baseUrls: "http://localhost:8080/api/",
      method: "get"
    });

    console.log("-aspdibsadoi")

    const response = await requestInstance.send({
      path: "",
    })

    console.log('-----------> response ->', response);
  } catch (error) {
    console.log("----------------->", error);
  }
})()

