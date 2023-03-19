import { useFetch, useRoute } from "#app";
import { FeedbackBody } from "../server/api/feedback.post";

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
    const { data, pending, error } = await useFetch('/api/feedback', {
      method: 'POST',
      body,
      onResponse({ response }) {
        // Process the response data
        return response._data
      },
      onResponseError({ response }) {
        throw createError({
          statusCode: response.status,
          message: response.statusText,
        })
      }
    })

    return { data, pending, error }
  }

  return { submitFeedback }
}
