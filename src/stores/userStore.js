import { defineStore } from 'pinia';
import { ref, toRaw } from 'vue';
import { useNotificationStore } from '@/stores/notificationStore';

import * as userService from '@/services/userService';

function newUser() {
    return {
        id: null,
        email: '',
        firstName: '',
        lastName: '',
        active: true, // tills API:et stödjer detta
        roles: [],
        createdAt: null,
        updatedAt: null
    };
}

export const useUsersStore = defineStore('usersStore', () => {
    const notificationStore = useNotificationStore();
    const users = ref([]);
    const selectedUser = ref(newUser());

    const loading = ref(false);

    function selectUser(user) {
        selectedUser.value = structuredClone(toRaw(user));
    }

    function createNewUser() {
        selectedUser.value = newUser();
    }

    async function loadUsers() {
        loading.value = true;

        try {
            users.value = await userService.getUsers();

            if (users.value.length > 0 && !selectedUser.value.id) {
                selectUser(users.value[0]);
            }
        } finally {
            loading.value = false;
        }
    }

    async function loadUser(id) {
        loading.value = true;

        try {
            selectedUser.value = await userService.getUser(id);
        } finally {
            loading.value = false;
        }
    }

    async function saveUser() {
        const user = selectedUser.value;
        try {
            if (user.id) {
                selectedUser.value = await userService.updateUser(user.id, {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    isActive: 'true',
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt
                });
                notificationStore.success('Användaren uppdaterades.');
            } else {
                selectedUser.value = await userService.createUser({
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName
                });
                notificationStore.success('Användaren skapades.');
            }

            await loadUsers();
        } catch (error) {
            notificationStore.error(error);
        }
    }

    async function deleteSelectedUser() {
        const { id } = selectedUser.value;

        if (!id) {
            createNewUser();
            return;
        }
        try {
            await userService.deleteUser(id);
            notificationStore.success('Användaren togs bort.');

            await loadUsers();

            createNewUser();
        } catch (error) {
            notificationStore.error(error);
        }
    }

    return {
        users,
        selectedUser,
        loading,

        selectUser,
        createNewUser,

        loadUsers,
        loadUser,
        saveUser,
        deleteSelectedUser
    };
});
