import { RateLimiter } from "limiter";
import { defineEventHandler, getRequestHeader, createError } from "h3";
import cache from "memory-cache";

const securityConfig = {
  rateLimiter: {
    throwError: true,
    value: {
      tokensPerInterval: 150,
      interval: "hour",
      fireImmediately: true,
    },
  },
};

export default defineEventHandler(async (event) => {
  const ip = getRequestHeader(event, "x-forwarded-for");

  if (!cache.get(ip)) {
    // TODO: send rate limiting configuration from the module
    const cachedLimiter = new RateLimiter({
      tokensPerInterval: 150,
      interval: "hour",
      fireImmediately: true,
    });
    cache.put(ip, cachedLimiter, 10000);
  } else {
    const cachedLimiter = cache.get(ip) as RateLimiter;

    if (cachedLimiter.getTokensRemaining() > 1) {
      await cachedLimiter.removeTokens(1);
      cache.put(ip, cachedLimiter, 10000);
    } else {
      if (securityConfig.rateLimiter.throwError) {
        throw createError({
          statusCode: 429,
          statusMessage: "Too Many Requests",
        });
      } else {
        return { statusCode: 429, statusMessage: "Too Many Requests" };
      }
    }
  }
});
