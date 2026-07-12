<script setup>
import { useRoleStore } from '@/stores/roleStore';
import { onMounted } from 'vue';
import { useUserStore } from '@/stores/userStore.js';
import { storeToRefs } from 'pinia';

const userStore = useUserStore();
const { selectedUser } = storeToRefs(userStore);

const roleStore = useRoleStore();

const { roles } = storeToRefs(roleStore);

onMounted(async () => {
    await roleStore.loadRoles();
});

function isRoleSelected(roleId) {
    return selectedUser.value.roles.includes(roleId);
}

function toggleRole(roleId) {
    const roles = selectedUser.value.roles;

    const index = roles.indexOf(roleId);

    if (index >= 0) {
        roles.splice(index, 1);
    } else {
        roles.push(roleId);
    }
}
</script>
<template>
    <v-window-item value="info">
        <div class="user-form" density="compact">
            <v-text-field v-model="selectedUser.firstName" label="Förnamn" />
            <v-text-field v-model="selectedUser.lastName" label="Efternamn" />
            <v-text-field v-model="selectedUser.email" label="E-post" />
            <h4>Roller</h4>
            <div class="role-panel">
                <v-checkbox
                    v-for="role in roles"
                    :key="role.id"
                    :label="role.name"
                    :model-value="isRoleSelected(role.id)"
                    @update:model-value="toggleRole(role.id)"
                />
            </div>

            <div class="button-row">
                <v-btn color="primary" @click="userStore.saveUser"> Spara </v-btn>
                <v-btn color="error" variant="outlined" @click="userStore.deleteSelectedUser">
                    Radera
                </v-btn>
                <v-btn color="success" variant="outlined" @click="userStore.createNewUser">
                    Ny
                </v-btn>
            </div>
        </div>
    </v-window-item>
</template>

<style scoped>
.user-form {
    max-width: 600px;
}

.role-panel {
    max-height: 200px;
    overflow-y: auto;

    padding: 0.5rem;

    background-color: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 4px;
}

.button-row {
    display: flex;
    gap: 1rem;

    margin-top: 2rem;
}
</style>