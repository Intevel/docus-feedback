import { defineNuxtPlugin } from '#app';
import { v4 as uuidv4 } from 'uuid';

export default defineNuxtPlugin(() => {
  if (typeof window !== 'undefined') {
    const storage = window.localStorage;

    if (!storage.getItem("docus-feedback-user")) {
      storage.setItem("fdocus-feedback-user", uuidv4());
    }
  }
});
