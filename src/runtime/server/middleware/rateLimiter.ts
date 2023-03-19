// Most of the code for the this middleware is taken from the following repository:
//  https://github.com/Baroshem/nuxt-security

import { RateLimiter } from "limiter";
import { defineEventHandler, getRequestHeader, createError } from "h3";
import cache from "memory-cache";
import { useRuntimeConfig } from '#imports'

const config = useRuntimeConfig();

const securityConfig = {
  rateLimiter: {
    throwError: config.rateLimiter.throwError,
    tokensPerInterval: config.rateLimiter.tokensPerInterval,
    interval: config.rateLimiter.interval,
    fireImmediately: config.rateLimiter.fireImmediately,
  },
};

export default defineEventHandler(async (event) => {
  const ip = getRequestHeader(event, "x-forwarded-for");

  if (!cache.get(ip)) {
    // TODO: send rate limiting configuration from the module
    const cachedLimiter = new RateLimiter({
      tokensPerInterval: securityConfig.rateLimiter.tokensPerInterval,
      interval: securityConfig.rateLimiter.interval,
      fireImmediately: securityConfig.rateLimiter.fireImmediately,
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
