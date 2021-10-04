// Karan Thakkar[13-07-21] Test script for Stock Price

// required packages
const request = require("supertest");
const app = require("../../index");
const db = require("../../db-init/dbConn");
const { generateToken } = require("../../middlewares/auth");

let token;

beforeAll(async () => {
  token = generateToken({
    user_id: 16,
    fname: "test1",
    lname: "test2",
    email: "test",
    phone_no: "8828088551",
    is_admin: true,
  });
});

// closing db connection
afterAll(() => {
  return db.$pool.end();
});

// 1. GET Api should return an error code of 400 and a message "No records found!" if stocks doesn't exits in database
describe("Testing stock price GET API for 'No records found!'", () => {
  it('should return an error code of 400 and a message "No records found!" if stocks doesnt exits in database', async () => {
    const response = await request(app)
      .get("/api/stockPrice/")
      .set("Content-type", "application/json");
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toEqual("No records found!");
  });
});

// 2. POST Api should return an success code of 200 and a message "Stock added successfully" if stockName,date,prevClose,openPrice,highPrice,lowPrice,lastPrice,closePrice,averagePrice,totalTradedQuantity are provided in the request
describe("Testing stock price GET API for 'Stocks added successfully'", () => {
  it('should return an success code of 200 and a message "Stocks added successfully" if stockName,date,prevClose,openPrice,highPrice,lowPrice,lastPrice,closePrice,averagePrice,totalTradedQuantity are provided in the request', async () => {
    let payload = JSON.stringify({
      stockName: "Adani Port",
      date: "31-Dec-2021",
      prevClose: 78.01,
      openPrice: 74,
      highPrice: 82,
      lowPrice: 71,
      lastPrice: 73.11,
      closePrice: 74.01,
      averagePrice: 76.55,
      totalTradedQuantity: 288000,
    });
    const response = await request(app)
      .post("/api/stockPrice/addNewStock")
      .set("Authorization", `Bearer ${token}`)
      .send(payload)
      .set("Content-type", "application/json");
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toEqual("Stock added successfully");
  });
});

// 3. GET Api should return an success code of 200 and a message "Stocks Fetched Successfully" if atleast one stock exists in database
describe("Testing stock price GET API for 'Stocks Fetched Successfully'", () => {
  it('should return an success code of 200 and a message "Stocks Fetched Successfully" if atleast one stock exists in database', async () => {
    const response = await request(app)
      .get("/api/stockPrice/")
      .set("Content-type", "application/json");
    expect(response.statusCode).toBe(200);
    expect(response.body.data).toEqual(expect.any(Object));
    expect(response.body.message).toEqual("Stocks Fetched Successfully");
  });
});

// 4. POST Api should return an error code of 400 and a message "Record already exists cannot add!" if stockName and date already exists in database
describe("Testing stock price POST API 'Record already exists cannot add!' ", () => {
  it('should return an success code of 400 and a message "Record already exists cannot add!" if stockName and date already exists in database', async () => {
    let payload = JSON.stringify({
      stockName: "Adani Port",
      date: "31-Dec-2021",
    });
    const response = await request(app)
      .post("/api/stockPrice/addNewStock")
      .set("Authorization", `Bearer ${token}`)
      .send(payload)
      .set("Content-type", "application/json");
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toEqual("Record already exists cannot add!");
  });
});

// 5. POST Api should return an error code of 400 and a message "All fields required!" if stockName,date,prevClose,openPrice,highPrice,lowPrice,lastPrice,closePrice,averagePrice,totalTradedQuantity any one of them is not provided in the request
describe("Testing stock price POST API 'All fields required!' ", () => {
  it('should return an success code of 400 and a message "All fields required!" if stockName,date,prevClose,openPrice,highPrice,lowPrice,lastPrice,closePrice,averagePrice,totalTradedQuantity any one of them is not provided in the request', async () => {
    let payload = JSON.stringify({
      stockName: "Adani Port",
      averagePrice: 76.55,
      totalTradedQuantity: 288000,
    });
    const response = await request(app)
      .post("/api/stockPrice/addNewStock")
      .set("Authorization", `Bearer ${token}`)
      .send(payload)
      .set("Content-type", "application/json");
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toEqual("All fields required!");
  });
});

// 6. PUT Api should return an error code of 400 and a message "All fields required!" if stockName,date,openPrice any of one is not provided in the request
describe("Testing stock price for PUT Api 'All fields required!' ", () => {
  it('should return an error code of 400 and a message "All fields required!" if stockName,date,openPrice any of one is not provided in the request', async () => {
    let payload = JSON.stringify({
      stockName: "Adani Port",
    });
    const response = await request(app)
      .put("/api/stockPrice/updateStockPrice")
      .set("Authorization", `Bearer ${token}`)
      .send(payload)
      .set("Content-type", "application/json");
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toEqual("All fields required!");
  });
});

// 7. PUT Api should return an success code of 200 and a message "Stock updated successfully" if stockName,date,openPrice is provided in the request
describe("Testing stock price for PUT Api 'Stock updated successfully' ", () => {
  it('should return an success code of 200 and a message "Stock updated successfully" if stockName,date,openPrice is provided in the request', async () => {
    let payload = JSON.stringify({
      stockName: "Adani Port",
      date: "31-Dec-2021",
      openPrice: 5000,
    });
    const response = await request(app)
      .put("/api/stockPrice/updateStockPrice")
      .set("Authorization", `Bearer ${token}`)
      .send(payload)
      .set("Content-type", "application/json");
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toEqual("Stock updated successfully");
  });
});

// 8. DELETE Api should return an error code of 400 and a message "StockName and Date required!" if stockName or date is not provided in the request
describe("Testing stock price for DELETE Api 'StockName and Date required!' ", () => {
  it('should return an error code of 400 and a message "StockName and Date required!" if stockName or date is not provided in the request', async () => {
    let payload = JSON.stringify({
      stockName: "RELIANCE",
    });
    const response = await request(app)
      .delete("/api/stockPrice/deleteStock")
      .set("Authorization", `Bearer ${token}`)
      .send(payload)
      .set("Content-type", "application/json");
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toEqual("StockName and Date required!");
  });
});

// 9. DELETE Api should return an error code of 400 and a message "Stock can not be deleted!" if stockName or date does not exists in the database
describe("Testing stock price for DELETE Api 'Stock can not be deleted!' ", () => {
  it('should return an error code of 400 and a message "Stock can not be deleted!" if stock does not exists or there is some error', async () => {
    let payload = JSON.stringify({
      stockName: "RELIANCE",
      date: "1-Feb-21",
    });
    const response = await request(app)
      .delete("/api/stockPrice/deleteStock")
      .set("Authorization", `Bearer ${token}`)
      .send(payload)
      .set("Content-type", "application/json");
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toEqual("Stock can not be deleted!");
  });
});

// 10. DELETE Api should return an success code of 200 and a message "Stock deleted successfully" if stockName and date is provided in the request.
describe("Testing stock price for DELETE Api 'Stock deleted successfully' ", () => {
  it('should return an success code of 200 and a message "Stock deleted successfully" if stockName and date is provided in the request', async () => {
    let payload = JSON.stringify({
      stockName: "Adani Port",
      date: "31-Dec-2021",
    });
    const response = await request(app)
      .delete("/api/stockPrice/deleteStock")
      .set("Authorization", `Bearer ${token}`)
      .send(payload)
      .set("Content-type", "application/json");
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toEqual("Stock deleted successfully");
  });
});
