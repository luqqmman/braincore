import { Elysia, t } from 'elysia'
import { createResponse } from './response'

export const userModel = new Elysia()
    .model({
        'id-model': t.Object({
            id: t.Number({
                error: createResponse(422, "id must be a number")
            }),
        }),
        'user-model': t.Object({
            name: t.String({
                maxLength: 64,
                error: createResponse(422, "name max length = 64")
            }),
            email: t.String({
                format: 'email',
                maxLength: 64,
                error: createResponse(422, "email format please")
            })
        })
    })