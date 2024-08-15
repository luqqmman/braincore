// @ts-nocheck

import { Context } from "elysia";

import db from "./database";
import { createResponse } from "./response";

export async function addUser({ body: { name, email } }: Context) {
  const emailTaken = db.query("SELECT * FROM users WHERE email = ?").get(email);
  if (emailTaken) {
    return createResponse(400, "Email already taken");
  } else {
    const user = db.run("INSERT INTO users (name, email) VALUES (?, ?)", name, email);
    return createResponse(201, "User added successfully", user);
  }
}

export async function getAllUsers(_: Context) {
  const users = db.query("SELECT * FROM users").all();
  return createResponse(200, "Users fetched successfully", users);
}

export async function getUserById({ params: { id } }: Context) {
  const user = db.query("SELECT * FROM users WHERE id = ?").get(id);
  if (user) {
    return createResponse(200, "User fetched successfully", user);
  } else {
    return createResponse(404, "User not found");
  }
}

export async function updateUserById({ params: { id }, body: { name, email } }: Context) {
  const user = db.query("SELECT * FROM users WHERE id = ?").get(id);
  if (!user) {
    return createResponse(404, "User not found");
  }

  const changes = db.run("UPDATE users SET name = ?, email = ? WHERE id = ?", name, email, id);
  if (changes) {
    return createResponse(200, "User updated successfully", changes);
  } else {
    return createResponse(404, "User not found");
  }
}

export async function deleteUserById({ params: { id } }: Context) {
  const changes = db.run("DELETE FROM users WHERE id = ?", id);
  if (changes) {
    return createResponse(200, "User deleted successfully", changes);
  } else {
    return createResponse(404, "User not found");
  }
}

  // Sign in berdasarkan email dan name
export async function signIn({ jwt, cookie: { auth }, body: { name, email } }: Context) {
  const user = db.query("SELECT * FROM users WHERE email LIKE ?").get(email);

  if (!user) {
    return createResponse(401, "Unauthorized! name or email mismatch");
  } else if (user.name !== name) {
    return createResponse(401, "Unauthorized! name or email mismatch");
  } else {
    // sign JWT berisi user id
    auth.set({
      value: await jwt.sign({id: user.id}),
      httpOnly: true,
      maxAge: 7 * 86400,
      path: '/',
    });

    return createResponse(200, `Sign in as ${email}`);
  }
}

// get profile berdasarkan JWT
export async function getProfile({ userId }: Context) {
  const user = db.query("SELECT * FROM users WHERE id = ?").get(userId);

  if (user) {
    return createResponse(200, `Hello ${user.name}`, user);
  } else {
    return createResponse(404, "User not found");
  }
}

// get profile berdasarkan id yang di request (untuk ngecek middleware verify ID work)
export async function getProfileById({ params: { id } }: Context) {
  const user = db.query("SELECT * FROM users WHERE id = ?").get(id);

  if (user) {
    return createResponse(200, `Hello ${user.name}`, user);
  } else {
    return createResponse(404, "User not found");
  }
}