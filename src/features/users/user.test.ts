import request from "supertest";
import app from "../../app";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

beforeAll(async () => {
  await mongoose.connect(process.env.DATABASE_URI as string);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("User Controller", () => {
  let token: string;

  it("should register a user", async () => {
    const res = await request(app).post("/api/users/register").send({
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("user");
  });

  it("should login a user", async () => {
    const res = await request(app).post("/api/users/login").send({
      email: "john@example.com",
      password: "password123",
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    token = res.body.token;
  });

  it("should get a user", async () => {
    const res = await request(app)
      .get("/api/users")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("user");
  });

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

  it("should delete a user", async () => {
    const res = await request(app)
      .delete("/api/users/delete")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("user");
  });
});
