import { defineStore } from 'pinia';
import { ref, toRaw } from 'vue';

import { useNotificationStore } from '@/stores/notificationStore';

import * as roleService from '@/services/roleService';

function newRole() {
    return {
        id: null,
        name: '',
        description: '',
        adminLevel: 0,
        createdAt: null,
        updatedAt: null
    };
}

export const useRoleStore = defineStore('roleStore', () => {
    const notificationStore = useNotificationStore();

    const roles = ref([]);
    const selectedRole = ref(newRole());
    const loading = ref(false);
    const roleUsers = ref([]);

    async function selectRole(role) {
        selectedRole.value = structuredClone(toRaw(role));

        await loadRoleUsers(role.id);
    }
    function createNewRole() {
        selectedRole.value = newRole();
    }

    async function loadRoles() {
        loading.value = true;

        try {
            roles.value = await roleService.getRoles();
            roles.value.sort((a, b) => {
                // Sortera efter admin-nivå (fallande) och användarnamn
                if (a.adminLevel === b.adminLevel) {
                    return a.name.localeCompare(b.name);
                }
                return b.adminLevel - a.adminLevel;
            });

            if (roles.value.length > 0 && !selectedRole.value.id) {
                selectRole(roles.value[0]);
            }
        } finally {
            loading.value = false;
        }
    }

    async function loadRole(id) {
        loading.value = true;

        try {
            selectedRole.value = await roleService.getRole(id);

            await loadRoleUsers(id);
        } finally {
            loading.value = false;
        }
    }

    async function saveRole() {
        const role = selectedRole.value;

        try {
            if (role.id) {
                selectedRole.value = await roleService.updateRole(role.id, role);

                notificationStore.success('Rollen uppdaterades.');
            } else {
                selectedRole.value = await roleService.createRole({
                    name: role.name,
                    description: role.description,
                    adminLevel: role.adminLevel
                });

                notificationStore.success('Rollen skapades.');
            }

            await loadRoles();
        } catch (error) {
            notificationStore.error(error);

            throw error;
        }
    }

    async function deleteSelectedRole() {
        const { id } = selectedRole.value;

        if (!id) {
            createNewRole();
            return;
        }

        try {
            await roleService.deleteRole(id);

            notificationStore.success('Rollen togs bort.');

            await loadRoles();

            if (roles.value.length > 0) {
                await selectRole(roles.value[0]);
            } else {
                createNewRole();
            }

            return selectedRole.value.id;
        } catch (error) {
            notificationStore.error(error);

            throw error;
        }
    }

    async function loadRoleUsers(roleId) {
        loading.value = true;

        try {
            roleUsers.value = await roleService.getRoleUsers(roleId);
        } finally {
            loading.value = false;
        }
    }
    async function removeUserFromRole(userId) {
        if (!selectedRole.value.id) {
            return;
        }

        try {
            await roleService.removeRoleUser(selectedRole.value.id, userId);

            notificationStore.success('Användaren togs bort från rollen.');

            await loadRoleUsers(selectedRole.value.id);
        } catch (error) {
            notificationStore.error(error);

            throw error;
        }
    }
    return {
        roles,
        selectedRole,
        roleUsers,
        loading,

        selectRole,
        createNewRole,

        loadRoles,
        loadRole,
        loadRoleUsers,

        saveRole,
        deleteSelectedRole,
        removeUserFromRole
    };
});
