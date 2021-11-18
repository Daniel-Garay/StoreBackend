const url = "http://localhost:3000/dev";
const request = require("supertest")(url);
var uuid = require("uuid");

describe("/All Enpoints", () => {
  it("GET /All Products", () => {
    return request
      .get("/getProducts")
      .expect(200)
      .then((res) => {});
  });
  //Create user
  it("POST /create User", () => {
    const objUser = {
      Name: "Pedro Orquesta",
      Email: uuid.v1() + "@gmail.com",
      balance: 100,
    };

    return request
      .post("/users")
      .send(objUser)
      .expect(200)
      .then((res) => {});
  });
  //Create purchase order
  it("POST /purchase order", () => {
    const userId = 1;
    const objPurchaseOrder = {
      products: [
        { id: 1, quantity: 1 },
        { id: 2, quantity: 2 },
      ],
    };
    return request
      .post("/CreatePurchaseOrder?userId=" + userId)
      .send(objPurchaseOrder)
      .expect(200)
      .then((res) => {});
  });
  //increaseBalance
  it("POST /increaseBalance", () => {
    const userId = 1;
    const objIncreaseBalance = {
      balance: 2,
    };
    return request
      .post("/increaseBalance?userId=" + userId)
      .send(objIncreaseBalance)
      .expect(200)
      .then((res) => {});
  });
  //transferMoney
  it("POST /transferMoney", () => {
    const objIncreaseBalance = {
      debitUser: 1,
      userToTransfer: 2,
      amountToTransfer: 1,
    };
    return request
      .post("/transferMoney")
      .send(objIncreaseBalance)
      .expect(200)
      .then((res) => {});
  });
});
