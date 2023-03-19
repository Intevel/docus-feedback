import { useRoute, useRuntimeConfig } from "#app";
import { $fetch } from "ohmyfetch";
import { FeedbackBody } from "../../module";

export function useDocusFeedback() {
  const route = useRoute();
  const config = useRuntimeConfig();

  const submitFeedback = async (feedback: string) => {
    if (!feedback) {
      throw new Error('Missing required fields')
    }

    let body: FeedbackBody = {
      feedback,
      route: route.path
    }

    if (config.autoUserTracking) {
      if (typeof window !== "undefined") {
        const user = window.localStorage.getItem('docus-feedback-user');
        if (user) {
          body = {
            ...body,
            user_id: user
          }
        }
      }
    }
    const res = await $fetch('/api/feedback', {
      method: 'POST',
      body,
      onResponseError() {
        throw createError({
          statusCode: 500,
          message: "Internal Server Error",
        })
      }
    })

    return res;
  }

  return { submitFeedback }
}
