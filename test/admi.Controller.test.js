const app = require("../app");
const request = require("supertest");

const globalData = require("../controller/admin.Controller");
const verifyotpData = require("../testFunction/otpFunction");
var newOtp;

describe("admin signUp", () => {
  test("should admin respond with a 200 status code & correct response", async () => {
    const response = await request(app).post("/admin/signup").send({
      fName: "gurmeet",
      lName: "singh",
      emailId: "arjunsingh@gmail.com",
      password: "123456789",
    });
    newOtp = response._body.globalData;

    expect(response.body).toMatchObject({
      message: "email successfully sent",
      success: true,
    });
    expect(response.statusCode).toBe(200);
  });
});

describe("checking admin signUp Verifying ", () => {
  test("signUp admin Verifying", async () => {
    const response = await request(app).post("/admin/signupverify").send({
      otp: newOtp,
    });

    expect(response._body).toMatchObject({
      message: "Admin save",
      success: true,
    });
    expect(response.statusCode).toBe(200);
  });
});

describe(" admin login ", () => {
  test("admin Login", async () => {
    const response = await request(app).post("/admin/login").send({
      emailId: "rahulansarii@gmail.com",
      password: "123456789",
    });

    expect(response._body).toMatchObject({
      message: " admin  Welcome ",
      success: true,
    });
    expect(response.statusCode).toBe(200);
  });
});

describe("admin Update", () => {
  test("Update Verifying", async () => {
    const response = await request(app)
      .put("/admin/update")
      .set(
        "Authorization",
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpbmZvIjp7Il9pZCI6IjYyM2IwMjc5NDJkYTE0NDJlYzQzMzZmMiIsImZOYW1lIjoicmFodWwiLCJsTmFtZSI6ImFuc2FyaSIsImVtYWlsSWQiOiJhbnNhcmlyaXBwZXJAZ21haWwuY29tIiwicGFzc3dvcmQiOiIxMDk4NzY1NDMyMSIsInJvbGUiOiJ1c2VyIiwiX192IjowfSwiaWF0IjoxNjQ4MDM1MTE0fQ.-DtWR7BNYxt9D96ltpAE2YKclzY6dD17ojGqCPeJUD8"
      )
      .send({
        emailId: "gurmeet@gmail.com",
        newPassword: "1234567897",
      });

    expect(response._body).toMatchObject({
      message: "admin update",
      success: true,
    });
    expect(response.statusCode).toBe(200);
  });
});

describe(" admin forget", () => {
  test("admin Forget", async () => {
    const response = await request(app)
      .post("/admin/forget")
      .set(
        "Authorization",
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpbmZvIjp7Il9pZCI6IjYyM2IwMjc5NDJkYTE0NDJlYzQzMzZmMiIsImZOYW1lIjoicmFodWwiLCJsTmFtZSI6ImFuc2FyaSIsImVtYWlsSWQiOiJhbnNhcmlyaXBwZXJAZ21haWwuY29tIiwicGFzc3dvcmQiOiIxMDk4NzY1NDMyMSIsInJvbGUiOiJ1c2VyIiwiX192IjowfSwiaWF0IjoxNjQ4MDM1MTE0fQ.-DtWR7BNYxt9D96ltpAE2YKclzY6dD17ojGqCPeJUD8"
      )
      .send({
        emailId: "gurmeet@gmail.com",
      });
    newOtp = response._body.globalData;

    expect(response._body).toMatchObject({
      message: "email send seccessfully",
      success: true,
    });
    expect(response.statusCode).toBe(200);
  });
});

describe(" admin Reset", () => {
  test("admin Reset", async () => {
    const response = await request(app)
      .put("/admin/reset")
      .set(
        "Authorization",
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpbmZvIjp7Il9pZCI6IjYyM2IwMjc5NDJkYTE0NDJlYzQzMzZmMiIsImZOYW1lIjoicmFodWwiLCJsTmFtZSI6ImFuc2FyaSIsImVtYWlsSWQiOiJhbnNhcmlyaXBwZXJAZ21haWwuY29tIiwicGFzc3dvcmQiOiIxMDk4NzY1NDMyMSIsInJvbGUiOiJ1c2VyIiwiX192IjowfSwiaWF0IjoxNjQ4MDM1MTE0fQ.-DtWR7BNYxt9D96ltpAE2YKclzY6dD17ojGqCPeJUD8"
      )``.send({
      emailId: "gurmeet@gmail.com",
      otp: `${newOtp}`,
      newPassword: "814665394033333",
    });

    expect(response._body).toMatchObject({
      message: "password reset successfully",
      success: true,
    });
    expect(response.statusCode).toBe(200);
  });
});
