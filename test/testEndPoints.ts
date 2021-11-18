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
    const userId = "61904cb7320c4da68bb8d366";
    const objPurchaseOrder = {
      products: [
        { id: "6191a2d6320c4da68bb8d375", quantity: 1 },
        { id: "6191a578320c4da68bb8d376", quantity: 2 },
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
    const userId = "61904cb7320c4da68bb8d366";
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
      debitUser: "61904cb7320c4da68bb8d366",
      userToTransfer: "61906488dfa2275384af2fcc",
      amountToTransfer: 1,
    };
    return request
      .post("/transferMoney")
      .send(objIncreaseBalance)
      .expect(200)
      .then((res) => {});
  });
});
