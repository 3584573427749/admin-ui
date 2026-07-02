<script setup>
import { storeToRefs } from 'pinia';

import { useNotificationStore } from '@/stores/notificationStore';
import ToastItem from './ToastItem.vue';

const notificationStore = useNotificationStore();

const { toasts } = storeToRefs(notificationStore);
</script>

<template>
    <div class="toast-container">
        <ToastItem
            v-for="toast in toasts"
            :key="toast.id"
            :toast="toast"
        />
    </div>
</template>

<style scoped>
.toast-container {
    position: fixed;

    top: 1rem;
    right: 1rem;

    display: flex;
    flex-direction: column;

    gap: 0.75rem;

    z-index: 9999;

    pointer-events: none;
}

.toast-container :deep(.toast) {
    pointer-events: auto;
}
</style>