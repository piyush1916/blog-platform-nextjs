// @vitest-environment node

import { beforeEach, describe, expect, it } from "vitest";
import { GET as authCheckGet } from "../app/api/auth-check/route";
import { POST as loginPost } from "../app/api/login/route";
import { GET as postDetailGet } from "../app/api/posts/[id]/route";
import { GET as postsGet } from "../app/api/posts/route";
import { POST as registerPost } from "../app/api/register/route";

function jsonRequest(url, body) {
  return new Request(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

async function readJson(response) {
  return response.json();
}

async function registerUser() {
  return registerPost(
    jsonRequest("http://localhost/api/register", {
      name: "Test User",
      email: "test@example.com",
      password: "Password1!",
    }),
  );
}

async function loginUser() {
  const response = await loginPost(
    jsonRequest("http://localhost/api/login", {
      email: "test@example.com",
      password: "Password1!",
    }),
  );
  const data = await readJson(response);
  return data.token;
}

describe("API routes", () => {
  beforeEach(() => {
    if (!globalThis.nebulaUsers) {
      globalThis.nebulaUsers = [];
    }

    globalThis.nebulaUsers.length = 0;
  });

  it("registers a user successfully", async () => {
    const response = await registerUser();
    const data = await readJson(response);

    expect(response.status).toBe(200);
    expect(data).toEqual({ message: "Account created successfully." });
  });

  it("returns errors for invalid register requests", async () => {
    const invalidJsonResponse = await registerPost({
      json: async () => {
        throw new Error("bad json");
      },
    });
    const missingFieldsResponse = await registerPost(
      jsonRequest("http://localhost/api/register", {
        name: "",
        email: "",
        password: "",
      }),
    );
    const duplicateResponse = await (async () => {
      await registerUser();
      return registerUser();
    })();

    expect(invalidJsonResponse.status).toBe(400);
    expect(await readJson(invalidJsonResponse)).toEqual({
      message: "Invalid JSON body.",
    });

    expect(missingFieldsResponse.status).toBe(400);
    expect(await readJson(missingFieldsResponse)).toEqual({
      message: "Name, email, and password are required.",
    });

    expect(duplicateResponse.status).toBe(409);
    expect(await readJson(duplicateResponse)).toEqual({
      message: "An account with this email already exists.",
    });
  });

  it("logs in a registered user successfully", async () => {
    await registerUser();

    const response = await loginPost(
      jsonRequest("http://localhost/api/login", {
        email: "test@example.com",
        password: "Password1!",
      }),
    );
    const data = await readJson(response);

    expect(response.status).toBe(200);
    expect(typeof data.token).toBe("string");
    expect(data.token.length).toBeGreaterThan(10);
  });

  it("returns errors for invalid login requests", async () => {
    const invalidJsonResponse = await loginPost({
      json: async () => {
        throw new Error("bad json");
      },
    });
    const missingFieldsResponse = await loginPost(
      jsonRequest("http://localhost/api/login", {
        email: "",
        password: "",
      }),
    );
    const wrongPasswordResponse = await (async () => {
      await registerUser();
      return loginPost(
        jsonRequest("http://localhost/api/login", {
          email: "test@example.com",
          password: "WrongPassword1!",
        }),
      );
    })();

    expect(invalidJsonResponse.status).toBe(400);
    expect(await readJson(invalidJsonResponse)).toEqual({
      message: "Invalid JSON body.",
    });

    expect(missingFieldsResponse.status).toBe(400);
    expect(await readJson(missingFieldsResponse)).toEqual({
      message: "Email and password are required.",
    });

    expect(wrongPasswordResponse.status).toBe(401);
    expect(await readJson(wrongPasswordResponse)).toEqual({
      message: "Invalid email or password.",
    });
  });

  it("checks authentication correctly", async () => {
    await registerUser();
    const token = await loginUser();

    const successResponse = await authCheckGet(
      new Request("http://localhost/api/auth-check", {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
    );
    const failureResponse = await authCheckGet(
      new Request("http://localhost/api/auth-check"),
    );

    expect(successResponse.status).toBe(200);
    expect(await readJson(successResponse)).toEqual({ authenticated: true });

    expect(failureResponse.status).toBe(200);
    expect(await readJson(failureResponse)).toEqual({ authenticated: false });
  });

  it("returns paginated posts for authenticated requests", async () => {
    await registerUser();
    const token = await loginUser();

    const response = await postsGet(
      new Request("http://localhost/api/posts?page=2&limit=10", {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
    );
    const data = await readJson(response);

    expect(response.status).toBe(200);
    expect(data.page).toBe(2);
    expect(data.total).toBe(20);
    expect(data.posts).toHaveLength(10);
  });

  it("rejects unauthorized post list requests", async () => {
    const response = await postsGet(new Request("http://localhost/api/posts"));

    expect(response.status).toBe(401);
    expect(await readJson(response)).toEqual({ message: "Unauthorized." });
  });

  it("returns a single post for authenticated requests", async () => {
    await registerUser();
    const token = await loginUser();

    const response = await postDetailGet(
      new Request("http://localhost/api/posts/3", {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
      { params: Promise.resolve({ id: "3" }) },
    );
    const data = await readJson(response);

    expect(response.status).toBe(200);
    expect(data.id).toBe("3");
  });

  it("returns errors for invalid post detail requests", async () => {
    await registerUser();
    const token = await loginUser();

    const unauthorizedResponse = await postDetailGet(
      new Request("http://localhost/api/posts/3"),
      { params: Promise.resolve({ id: "3" }) },
    );
    const notFoundResponse = await postDetailGet(
      new Request("http://localhost/api/posts/999", {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
      { params: Promise.resolve({ id: "999" }) },
    );

    expect(unauthorizedResponse.status).toBe(401);
    expect(await readJson(unauthorizedResponse)).toEqual({
      message: "Unauthorized.",
    });

    expect(notFoundResponse.status).toBe(404);
    expect(await readJson(notFoundResponse)).toEqual({
      message: "Post not found.",
    });
  });
});
