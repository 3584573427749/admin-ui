<script setup>
import { computed, onMounted, onUnmounted } from 'vue';

import { useNotificationStore } from '@/stores/notificationStore';

const props = defineProps({
    toast: {
        type: Object,
        required: true
    }
});

const notificationStore = useNotificationStore();

let timerId = null;
let startedAt = null;
let remainingTime = props.toast.duration;

const toastClass = computed(() => ['toast', `toast--${props.toast.type}`]);

function close() {
    stopTimer();

    notificationStore.remove(props.toast.id);
}

function startTimer() {
    startedAt = Date.now();

    timerId = setTimeout(close, remainingTime);
}

function stopTimer() {
    if (timerId) {
        clearTimeout(timerId);
        timerId = null;
    }
}

function pauseTimer() {
    if (!timerId) {
        return;
    }

    const elapsed = Date.now() - startedAt;

    remainingTime -= elapsed;

    stopTimer();
}

function resumeTimer() {
    if (timerId || remainingTime <= 0) {
        return;
    }

    startTimer();
}

onMounted(() => {
    startTimer();
});

onUnmounted(() => {
    stopTimer();
});
</script>

<template>
    <div
        :class="toastClass"
        @mouseenter="pauseTimer"
        @mouseleave="resumeTimer"
        @touchstart="pauseTimer"
        @touchend="resumeTimer"
    >
        <div class="toast__message">
            {{ toast.message }}
        </div>

        <button class="toast__close" type="button" aria-label="Stäng" @click="close">×</button>
    </div>
</template>

<style scoped>
.toast {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;

    min-width: 20rem;
    max-width: 32rem;

    padding: 0.75rem 1rem;

    border-radius: 8px;

    box-shadow: 0 4px 12px rgb(0 0 0 / 20%);
}

.toast__message {
    flex: 1;
    margin-right: 0.75rem;
}

.toast__close {
    background: transparent;
    border: none;

    color: inherit;

    cursor: pointer;

    font-size: 1.25rem;
    line-height: 1;
}

.toast--success {
    background-color: lightgreen;
    color: white;
}

.toast--error {
    background-color: #b3261e;
    color: white;
}

.toast--warning {
    background-color: #ed6c02;
    color: white;
}

.toast--info {
    background-color: #0288d1;
    color: white;
}
</style>
