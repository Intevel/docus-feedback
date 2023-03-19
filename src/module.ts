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
}

export interface FeedbackBody {
  feedback: string
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
    autoUserTracking: true
  },
  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url);

    if (!options.isEnabled) {
      // eslint-disable-next-line no-console
      return console.warn(`[docus-feedback] module is disabled and will not be loaded.`)
    }

    const runtimeDir = fileURLToPath(new URL("./runtime", import.meta.url));

    // Nuxt 3
    nuxt.options.runtimeConfig.public = nuxt.options.runtimeConfig.public || {}
    nuxt.options.runtimeConfig.public.directus = defu(nuxt.options.runtimeConfig.directus, {
      isEnabled: options.isEnabled,
      autoUserTracking: options.autoUserTracking
    })

    if (options.autoUserTracking) {
      // Registers plugin for generating user ids
      addPlugin(resolve(runtimeDir, "./plugin"));
    }

    addImportsDir(resolve(runtimeDir, 'composables'))

    // Add server handler
    addServerHandler({
      route: "/api/feedback",
      method: "post",
      handler: resolve(runtimeDir, "server/api/feedback.post"),
    });
  },
});

declare module '@nuxt/schema' {
  interface ConfigSchema {
    publicRuntimeConfig?: {
      feedback?: DocusFeedbackOptions;
    };
  }
}
