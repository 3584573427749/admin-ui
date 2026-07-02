import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useNotificationStore = defineStore('notification', () => {
    const toasts = ref([]);

    function add(type, message, options = {}) {
        const toast = {
            id: crypto.randomUUID(),
            type,
            message,
            duration: options.duration ?? 3000
        };

        toasts.value.push(toast);

        return toast.id;
    }

    function remove(id) {
        const index = toasts.value.findIndex((toast) => toast.id === id);

        if (index >= 0) {
            toasts.value.splice(index, 1);
        }
    }

    function success(message, options = {}) {
        return add('success', message, options);
    }

    function error(message, options = {}) {
        return add('error', message, options);
    }

    function warning(message, options = {}) {
        return add('warning', message, options);
    }

    function info(message, options = {}) {
        return add('info', message, options);
    }

    return {
        toasts,

        remove,

        success,
        error,
        warning,
        info
    };
});
