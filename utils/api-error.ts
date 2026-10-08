export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }

  static badRequest(msg = "Bad request") {
    return new ApiError(400, msg);
  }
  static unauthorized(msg = "Authentication required") {
    return new ApiError(401, msg);
  }
  static forbidden(msg = "Forbidden") {
    return new ApiError(403, msg);
  }
  static notFound(msg = "Not found") {
    return new ApiError(404, msg);
  }
  static conflict(msg = "Conflict") {
    return new ApiError(409, msg);
  }
  static tooMany(msg = "Too many requests") {
    return new ApiError(429, msg);
  }

  static payloadTooLarge(msg = "Payload too large") {
    return new ApiError(413, msg);
  }
  static unsupportedMedia(msg = "Unsupported media type") {
    return new ApiError(415, msg);
  }
}
