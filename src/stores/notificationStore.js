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

    function error(error, options = {}) {
        return add('error', getErrorMessage(error), options);
    }
    function warning(message, options = {}) {
        return add('warning', message, options);
    }

    function info(message, options = {}) {
        return add('info', message, options);
    }

    function formatDetails(details) {
        return Object.entries(details)
            .map(([field, value]) => {
                if (Array.isArray(value)) {
                    return `${field}: ${value.join(', ')}`;
                }

                return `${field}: ${value}`;
            })
            .join('\n');
    }

    function getErrorMessage(error) {
        if (typeof error === 'string') {
            return error;
        }

        if (error?.error) {
            let message = error.error.message ?? 'Ett okänt fel inträffade.';

            if (error.error.details && Object.keys(error.error.details).length > 0) {
                message += '\n' + formatDetails(error.error.details);
            }

            return message;
        }

        if (error?.message) {
            return error.message;
        }

        return 'Ett okänt fel inträffade.';
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
