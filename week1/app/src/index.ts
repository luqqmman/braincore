// @ts-nocheck

import { Elysia } from "elysia";
import { jwt } from '@elysiajs/jwt';
import { userModel } from "./models";
import { accessLog, setStatusCode, getId, verifyId } from "./middleware";
import { addUser, getAllUsers, getUserById, updateUserById, deleteUserById, getProfile, getProfileById, signIn } from "./handler";

new Elysia()
  // Task 1: Hello World dan middleware pencatat waktu saat request
  .onRequest(accessLog)
  .get("/", () => "Hello World")


  // Task 2: CRUD untuk user dengan integrasi database
  // Menggunakan userModel untuk validasi dan error handling
  .use(userModel)

  // Memastikan status code sesuai dengan response yang di-return main handler
  .onAfterHandle(setStatusCode)

  // CRUD user berdasarkan user-model yaitu dengan name dan email
  .get('/users', getAllUsers)

  .post('/user', addUser, {
    body: 'user-model'
  })

  .get('/user/:id', getUserById, {
    params: 'id-model'
  })

  .put('/user/:id', updateUserById, {
    params: 'id-model',
    body: 'user-model'
  })

  .delete('/user/:id', deleteUserById, {
    params: 'id-model',
  })

  // Task 3: JWT
  .use(
    jwt({
      name: 'jwt',
      secret: Bun.env.JWT_SECRET!
    })
  )

  // Sign in menggunakan name dan email
  .post('/sign', signIn)

  // Grouping route untuk profile dengan JWT authorization
  .group(
    '/profile',
    (app) => 
      app
        // Mengambil id dari JWT
        .resolve(getId)
        .get('', getProfile)

        // Mengecek apakah id dari JWT dan id yg direquest sama
        .onBeforeHandle(verifyId)
        .get('/:id', getProfileById)
  )

  // Menjalankan server di port 3000 dengan https
  .listen({
    port: 3000,
    // tls: {
    //   key: Bun.file("key.pem"),
    //   cert: Bun.file("cert.pem"),
    // },
    // hostname: "0.0.0.0",
  });
console.log("running");
