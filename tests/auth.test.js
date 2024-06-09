const jwt = require("jsonwebtoken");
const { auth } = require("../middlewares/auth");
const UnauthorizedError = require("../errors/unauthorized-err");
// const { JWT_SECRET } = require("../utils/config");

describe("Auth Middleware", () => {
  it("should call next with UnauthorizedError if token is invalid", () => {
    const req = {
      headers: {
        authorization: "Bearer InvalidToken"
      }
    };
    const res = {};
    const next = jest.fn();

    jest.spyOn(jwt, "verify").mockImplementation(() => {
      throw new Error("Invalid token");
    });

    auth(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    // expect(next.mock.calls[0][0].message).toBe("Unauthorized Token in auth.js");
  });

  it("should attach user to request and call next if token is valid", () => {
    const req = {
      headers: {
        authorization: "Bearer ValidToken"
      }
    };
    const res = {};
    const next = jest.fn();
    const payload = { _id: "userId" };

    jest.spyOn(jwt, "verify").mockImplementation(() => payload);

    auth(req, res, next);

    expect(req.user).toEqual(payload);
    expect(next).toHaveBeenCalledWith();
  });
});
