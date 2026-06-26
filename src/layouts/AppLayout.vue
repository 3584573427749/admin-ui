<script setup>
import { useRouter } from 'vue-router';

import AppHeader from '@/layouts/AppHeader.vue';
import AppFooter from '@/layouts/AppFooter.vue';

const router = useRouter();

const menuItems = [
    { label: 'Hem', route: '/' },
    {
        label: 'Användare',
        subItems: [
            { label: 'Användare', route: '/usersView' },
            { label: 'Roller', route: '/rolesView' },
            { label: 'Rättigheter', route: '/permissionsView' }
        ]
    },
    {
        label: 'Grupper',
        subItems: [
            { label: 'Gruppinfo', route: '/groupsView' },
            { label: 'Ledare', route: '/leadersView' }
        ]
    },
    {
        label: 'Tidsredovisningar',
        route: '/timeReportsView',
        subItems: [
            { label: 'Översikt', route: '/timeReportsView' },
            { label: 'Avvikande tider', route: '/deviantReportsView' },
            { label: 'Detaljer', route: '/timeDetailsView' },
            { label: 'Attestering', route: '/approvalsView' },
            { label: 'Inmatning', route: '/manualInputsView' },
            { label: '-' },
            { label: 'Inställningar', route: '/timeReportSettingsView' }
        ]
    },
    { label: 'Om', route: '/about' }
];

function navigateTo(route) {
    router.push(route);
}
</script>

<template>
    <div class="app-layout">
        <AppHeader :items="menuItems" @navigate="navigateTo" />
        <main class="app-main">
            <router-view />
        </main>

        <AppFooter />
    </div>
</template>
