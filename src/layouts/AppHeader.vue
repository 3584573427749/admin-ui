<script setup>
import NavBar from '@/components/NavBar.vue';

defineProps({
    items: {
        type: Array,
        required: true
    }
});

const emit = defineEmits(['navigate']);

function navigate(route) {
    emit('navigate', route);
}
</script>

<template>
    <header class="app-header">
        <img src="@/assets/images/logo.svg" alt="Simning.ax" class="app-header__logo" />

        <NavBar :items="items" @navigate="navigate" />
    </header>
</template>
