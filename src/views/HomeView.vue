<script setup>
import { useNotificationStore } from '@/stores/notificationStore';

const notifications = useNotificationStore();

notifications.success('Användaren sparades.');
notifications.error('Användaren kunde inte sparas.');
notifications.warning('Lösenordet går snart ut.');
notifications.info('Ny version finns tillgänglig.');
</script>
<template>
    <main>
        <h1>Vue Web-UI Template</h1>
        <p>Mallen är korrekt installerad.</p>

        <v-btn color="primary"> Test </v-btn>
    </main>
</template>