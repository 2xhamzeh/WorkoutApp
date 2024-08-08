import request from "supertest";
import app from "../../app";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { CreateUserDTO } from "./user.dto";

dotenv.config();

beforeAll(async () => {
  await mongoose.connect(process.env.DATABASE_URI as string);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("User Controller", () => {
  let token: string;
  let userData: CreateUserDTO = {
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
  };
  describe("POST /register", () => {
    it("should register a user", async () => {
      const res = await request(app).post("/api/users/register").send(userData);
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("user");
    });

    it("should not register a user with the same email", async () => {
      const res = await request(app).post("/api/users/register").send(userData);

      expect(res.status).toBe(409);
      expect(res.body).toHaveProperty("message", "User already exists");
    });

    it("should not register a user with invalid data", async () => {
      const res = await request(app).post("/api/users/register").send({
        hello: "name not provided",
      });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("message", "Invalid data");
    });
  });

  describe("POST /login", () => {
    it("should login a user", async () => {
      const res = await request(app).post("/api/users/login").send({
        email: "john@example.com",
        password: "password123",
      });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("token");
      token = res.body.token;
    });

    it("should not login a user with invalid credentials", async () => {
      const res = await request(app).post("/api/users/login").send({
        email: userData.email,
        password: "wrongpassword",
      });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("message", "Invalid password");
    });

    it("should not login a user that does not exist", async () => {
      const res = await request(app).post("/api/users/login").send({
        email: "notanemail@example.com",
        password: "password123",
      });

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("message", "User not found");
    });

    it("should not login a user with invalid data", async () => {
      const res = await request(app).post("/api/users/login").send({
        hello: "name not provided",
      });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("message", "Invalid data");
    });
  });

  describe("GET /", () => {
    it("should get a user", async () => {
      const res = await request(app)
        .get("/api/users")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("user");
    });

    it("should not get a user without a token", async () => {
      const res = await request(app).get("/api/users");

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("message", "Unauthorized");
    });

    it("should not get a user with an invalid token", async () => {
      const res = await request(app)
        .get("/api/users")
        .set("Authorization", `Bearer invalidToken`);

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("message", "Token is not valid");
    });
  });

  describe("PUT /update", () => {
    it("should update a user", async () => {
      const res = await request(app)
        .put("/api/users/update")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "Jane Smith",
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("user.name", "Jane Smith");
    });

    it("should not update a user without a token", async () => {
      const res = await request(app).put("/api/users/update").send({
        name: "Jane Smith",
      });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("message", "Unauthorized");
    });

    it("should not update a user with an invalid token", async () => {
      const res = await request(app)
        .put("/api/users/update")
        .set("Authorization", `Bearer invalidToken`)
        .send({
          name: "Jane Smith",
        });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("message", "Token is not valid");
    });

    it("should not update a user with invalid data", async () => {
      const res = await request(app)
        .put("/api/users/update")
        .set("Authorization", `Bearer ${token}`)
        .send({
          hello: "name not provided",
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("message", "Invalid data");
    });
  });

  describe("DELETE /delete", () => {
    it("should delete a user", async () => {
      const res = await request(app)
        .delete("/api/users/delete")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("user");
    });

    it("should not delete a user without a token", async () => {
      const res = await request(app).delete("/api/users/delete");

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("message", "Unauthorized");
    });

    it("should not delete a user with an invalid token", async () => {
      const res = await request(app)
        .delete("/api/users/delete")
        .set("Authorization", `Bearer invalidToken`);

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("message", "Token is not valid");
    });

    it("should not delete a user that does not exist", async () => {
      const res = await request(app)
        .delete("/api/users/delete")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("message", "User not found");
    });
  });
});
