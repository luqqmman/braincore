// @ts-nocheck


// middleware.ts
import { Context } from "elysia";
import { createResponse } from "./response";

export function accessLog({ url }: Context) {
    console.log(`${new Date().toUTCString()} - Route: ${url}`);
    // const logEntry = `${new Date().toUTCString()} - Route: ${url}\n`;
    // const writer = Bun.file("server.log").writer();
    // await writer.write(logEntry);
    // await writer.flush(); 
}

export function setStatusCode({ response, set }: Context) {
    if (response && response.status?.code) {
        set.status = response.status.code;
    }
}

export async function getId({ jwt, cookie: { auth } }: Context) {
    const { id } = await jwt.verify(auth.value);

    return {
        userId: id
    }
}

export async function verifyId({ userId, params: { id } }: Context) {
    if (userId != id) {
        return createResponse(401, "Unauthorized")
    }
}
