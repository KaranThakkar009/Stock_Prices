// Karan Thakkar [14-07-21] creating script for user login

// required imports
const request = require("supertest");
const app = require("../../index");
const db = require("../../db-init/dbConn");

// closing db connection
afterAll(() => {
  return db.$pool.end();
});

// 1. POST API should return error code of 400 and a message "All parameters required!" if email, password is not provided in the body
describe("Test login API 'All parameters required!'", () => {
  it("should return a status code of 400 and a message 'All parameters required!' if email or password is not provided in the body", async () => {
    const response = await request(app)
      .post("/api/login/")
      .set("Content-type", "application/json");
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toEqual("All parameters required!");
  });

  // 2. POST API should return error code of 400 and a message "Email not found!" if email provided in the body does not exists in the database
  it("should return a status code of 400 and a message 'Email not found!' if email provided in the body does not exists in the database", async () => {
    let payload = JSON.stringify({
      email: "bbuis89",
      password: "12345",
    });
    const response = await request(app)
      .post("/api/login/")
      .send(payload)
      .set("Content-type", "application/json");
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toEqual("Email not found!");
  });
  // 3. POST API should return error code of 400 and a message "Incorrect password!" if email, password is provided in the body, but the password is wrong.
  it("should return error code of 400 and a message 'Incorrect password!' if email, password is provided in the body, but the password is wrong", async () => {
    let payload = JSON.stringify({
      email: "test",
      password: "bjjbkf7",
    });
    const response = await request(app)
      .post("/api/login/")
      .send(payload)
      .set("Content-type", "application/json");
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toEqual("Incorrect password!");
  });
  // 4. POST API should return success code of 200 and a message "Login Successful" if email,password are in the body and verified from database
  it("should return success code of 200 and a message 'Login Successful' if email,password are in the body and verified from database", async () => {
    let payload = JSON.stringify({
      email: "test",
      password: "test",
    });
    const response = await request(app)
      .post("/api/login/")
      .send(payload)
      .set("Content-type", "application/json");
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toEqual("Login Successful");
  });
});
