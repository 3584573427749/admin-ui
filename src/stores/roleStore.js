import { defineStore } from 'pinia';
import { ref } from 'vue';

import * as roleService from '@/services/roleService';

export const useRoleStore = defineStore('roleStore', () => {
    const roles = ref([]);
    const loading = ref(false);

    async function loadRoles() {
        loading.value = true;

        try {
            roles.value = await roleService.getRoles();
        } finally {
            loading.value = false;
        }
    }

    return {
        roles,
        loading,

        loadRoles
    };
});
