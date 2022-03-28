const app = require("../app");
const request = require("supertest");
// gitHUb Test

const globalData = require("../controller/user.Controller");
const verifyotpData = require("../testFunction/otpFunction");
var newOtp;

describe("give all the details signUp", () => {
  test("should respond with a 200 status code & correct response", async () => {
    const response = await request(app).post("/users/signup").send({
      fName: "rahul",
      lName: "ansari",
      emailId: "rahullllll@gmail.com",
      password: "123456789",
    });
    newOtp = response._body.globalData;

    console.log(newOtp + "firts");
    expect(response.body).toMatchObject({
      message: "email successfully sent",
      success: true,
    });
    expect(response.statusCode).toBe(200);
  });
});

describe(" checking signUp Verifying ", () => {
  test("signUp Verifying", async () => {
    const response = await request(app).post("/users/signupverify").send({
      otp: newOtp,
    });

    expect(response._body).toMatchObject({
      message: "User Successfully Register",
      success: true,
    });
    expect(response.statusCode).toBe(200);
  });
});

describe(" user login ", () => {
  test("user Login", async () => {
    const response = await request(app).post("/users/login").send({
      emailId: "rahull@gmail.com",
      password: "123456789",
    });

    expect(response._body).toMatchObject({
      message: " user  Welcome ",
      success: true,
    });
    expect(response.statusCode).toBe(200);
  });
});

describe(" user Update", () => {
  test("Update Verifying", async () => {
    const response = await request(app)
      .put("/users/update")
      .set(
        "Authorization",
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpbmZvIjp7Il9pZCI6IjYyM2IwMjc5NDJkYTE0NDJlYzQzMzZmMiIsImZOYW1lIjoicmFodWwiLCJsTmFtZSI6ImFuc2FyaSIsImVtYWlsSWQiOiJhbnNhcmlyaXBwZXJAZ21haWwuY29tIiwicGFzc3dvcmQiOiIxMDk4NzY1NDMyMSIsInJvbGUiOiJ1c2VyIiwiX192IjowfSwiaWF0IjoxNjQ4MDM1MTE0fQ.-DtWR7BNYxt9D96ltpAE2YKclzY6dD17ojGqCPeJUD8"
      )
      .send({
        emailId: "rahul@gmail.com",
        newPassword: "1234656789000000",
      });

    expect(response._body).toMatchObject({
      message: "user update",
    });
    expect(response.statusCode).toBe(200);
  });
});

describe(" user forget", () => {
  test("user Forget", async () => {
    const response = await request(app)
      .post("/users/forget")
      .set(
        "Authorization",
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpbmZvIjp7Il9pZCI6IjYyM2IwMjc5NDJkYTE0NDJlYzQzMzZmMiIsImZOYW1lIjoicmFodWwiLCJsTmFtZSI6ImFuc2FyaSIsImVtYWlsSWQiOiJhbnNhcmlyaXBwZXJAZ21haWwuY29tIiwicGFzc3dvcmQiOiIxMDk4NzY1NDMyMSIsInJvbGUiOiJ1c2VyIiwiX192IjowfSwiaWF0IjoxNjQ4MDM1MTE0fQ.-DtWR7BNYxt9D96ltpAE2YKclzY6dD17ojGqCPeJUD8"
      )
      .send({
        emailId: "rahul@gmail.com",
      });
    newOtp = response._body.globalData;

    expect(response._body).toMatchObject({
      message: "email send seccessfully",
      success: true,
    });
    expect(response.statusCode).toBe(200);
  });
});

describe(" user Reset", () => {
  test("user Reset", async () => {
    const response = await request(app)
      .put("/users/reset")
      .set(
        "Authorization",
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpbmZvIjp7Il9pZCI6IjYyM2IwMjc5NDJkYTE0NDJlYzQzMzZmMiIsImZOYW1lIjoicmFodWwiLCJsTmFtZSI6ImFuc2FyaSIsImVtYWlsSWQiOiJhbnNhcmlyaXBwZXJAZ21haWwuY29tIiwicGFzc3dvcmQiOiIxMDk4NzY1NDMyMSIsInJvbGUiOiJ1c2VyIiwiX192IjowfSwiaWF0IjoxNjQ4MDM1MTE0fQ.-DtWR7BNYxt9D96ltpAE2YKclzY6dD17ojGqCPeJUD8"
      )
      .send({
        emailId: "rahul@gmail.com",
        otp: `${newOtp}`,
        newPassword: "63652610003215648888",
      });

    expect(response._body).toMatchObject({
      message: "password reset successfully",
      success: true,
    });
    expect(response.statusCode).toBe(200);
  });
});

describe(" friend request send ", () => {
  test("request send ", async () => {
    const response = await request(app)
      .post("/users/friendRequest")

      .send({
        requestSender: "6240ff6416ccd93a66b2af5c",
        requestReciver: "6240ff64889a5d2a660e5570",
      });

    expect(response._body).toMatchObject({
      message: "Request successfully send",
      success: true,
    });
    expect(response.statusCode).toBe(200);

    //   expect(response.statusCode).toBe(200);
  });
});

describe("   friend request  requestApproved ", () => {
  test("request  requestApproved", async () => {
    const response = await request(app)
      .post("/users/requestApprove")

      .send({
        requestDetails: "6240ff6416ccd93a66b2af5c",
        requestReciver: "6240ff64889a5d2a660e5570`",
      });

    expect(response._body).toMatchObject({
      message: "Request successfully accepted",
      success: true,
    });

    expect(response.statusCode).toBe(200);
  });
});
