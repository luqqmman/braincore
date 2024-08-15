export function createResponse(code: number, message: string, data: any = null) {
    return {
        status: {
            code,
            message,
        },
        data,
    };
}
