import {
  defineNuxtModule,
  addPlugin,
  createResolver,
  addServerHandler,
  addImportsDir,
} from "@nuxt/kit";
import { fileURLToPath } from "url";
import defu from "defu";

export interface DocusFeedbackOptions {
  /**
   * Setting to `true` gives the user an id stored in the local storage
   * @default true
   * @description Use this for unique user tracking.
   */
  autoUserTracking?: boolean;
  /**
   * Setting to `false` disables the module.
   * @default true
   * @description Use this setting to disable the module.
   */
  isEnabled?: boolean;
  rateLimiter: {
    throwError?: boolean;
    /**
     * createError in nuxt
     * @type boolean
     */
    tokensPerInterval?: number;
    /**
     * jow many requests per interval
     * @type number
     */
    interval?: string;
    /**
     * interval in which the tokens are refilled
     * @type string
     */
    fireImmediately?: boolean;
    /**
     * if true, the limiter will fire immediately
     * @type boolean
     */
  };
}
export interface FeedbackBody {
  feedback: string;
  user_id?: string;
  route: string;
}

export default defineNuxtModule<DocusFeedbackOptions>({
  meta: {
    name: "docus-feedback",
    configKey: "feedback",
    compatibility: {
      nuxt: "^3.0.0",
    },
  },
  // Default configuration options of the Nuxt module
  defaults: {
    isEnabled: true,
    autoUserTracking: true,
    rateLimiter: {
      throwError: false,
      tokensPerInterval: 150,
      interval: "hour",
      fireImmediately: true,
    },
  },
  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url);

    if (!options.isEnabled) {
      // eslint-disable-next-line no-console
      return console.warn(
        `[docus-feedback] module is disabled and will not be loaded.`
      );
    }

    const runtimeDir = fileURLToPath(new URL("./runtime", import.meta.url));

    // Nuxt 3
    nuxt.options.runtimeConfig.public = nuxt.options.runtimeConfig.public || {};
    nuxt.options.runtimeConfig.public.feedback = defu(
      nuxt.options.runtimeConfig.feedback,
      {
        isEnabled: options.isEnabled,
        autoUserTracking: options.autoUserTracking,
        rateLimiter: {
          throwError: options.rateLimiter.throwError,
          tokensPerInterval: options.rateLimiter.tokensPerInterval,
          interval: options.rateLimiter.interval,
          fireImmediately: options.rateLimiter.fireImmediately,
        },
      }
    );

    if (options.autoUserTracking) {
      // Registers plugin for generating user ids
      addPlugin(resolve(runtimeDir, "./plugin"));
    }

    addImportsDir(resolve(runtimeDir, "composables"));

    // Add rate limit middleware
    addServerHandler({
      route: "/api/feedback",
      middleware: true,
      handler: resolve(runtimeDir, "server/middleware/rateLimiter"),
    });

    // Add server handler
    addServerHandler({
      route: "/api/feedback",
      method: "post",
      handler: resolve(runtimeDir, "server/api/feedback.post"),
    });
  },
});

declare module "@nuxt/schema" {
  interface ConfigSchema {
    publicRuntimeConfig?: {
      feedback?: DocusFeedbackOptions;
    };
  }
}
