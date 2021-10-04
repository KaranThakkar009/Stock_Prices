// Karan Thakkar [14-07-21] creating script for user sign up

// required imports
const request = require("supertest");
const app = require("../../index");
const db = require("../../db-init/dbConn");

// closing db connection
afterAll(() => {
  return db.$pool.end();
});

// 1. POST API should return error code of 400 and a message "All parameters required!" if email,fname,lname,phone_no,is_admin, password any one of them is not provided in the body
describe("Test Sign Up API ", () => {
  it("should return a status code of 400 and a message 'All parameters required!' if email or password is not provided in the body", async () => {
    const response = await request(app)
      .post("/api/signUp/")
      .set("Content-type", "application/json");
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toEqual("All parameters required!");
  });

  // 2. POST API should return error code of 400 and a message "Email already in use!" if email provided in the body already exists in the database
  it("should return a status code of 400 and a message 'Email already in use!' if email provided in the body already exists in the database", async () => {
    let payload = JSON.stringify({
      email: "test",
      fname: "Karan",
      lname: "Thakkar",
      phoneNo: 48981,
      isAdmin: true,
      password: "Karan@123",
    });
    const response = await request(app)
      .post("/api/signUp/")
      .send(payload)
      .set("Content-type", "application/json");
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toEqual("Email already in use!");
  });
  //   3. POST API should return success code of 200 and a message "sign up successful" if all parameters are provided in the body
  it("should return error code of 400 and a message 'sign up successful' if if all parameters are provided in the body", async () => {
    let payload = JSON.stringify({
      email: "karan.thakkar@headstrait.com",
      fname: "Karan",
      lname: "Thakkar",
      phoneNo: 8828088551,
      isAdmin: true,
      password: "Karan",
    });
    const response = await request(app)
      .post("/api/signUp/")
      .send(payload)
      .set("Content-type", "application/json");
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toEqual("sign up successful");
  });
});
