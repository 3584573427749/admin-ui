<script setup>
import { computed, onMounted, ref } from 'vue';
import { useUsersStore } from '@/stores/userStore.js';
import { storeToRefs } from 'pinia';

const usersStore = useUsersStore();
const { users, selectedUser, loading } = storeToRefs(usersStore);
const availableRoles = ['Verksamhetsledare', 'Ledare', 'Styrelse', 'Domare'];

const activeTab = ref('info');

onMounted(async () => {
    await usersStore.loadUsers();
});

function isRoleSelected(role) {
    return selectedUser.value.roles.includes(role);
}

function toggleRole(role) {
    const roles = selectedUser.value.roles;

    const index = roles.indexOf(role);

    if (index >= 0) {
        roles.splice(index, 1);
    } else {
        roles.push(role);
    }
}
</script>

<template>
    <div class="users-view">
        <div class="users-view__list">
            <h3>Användare</h3>

            <v-list density="compact">
                <v-list-item
                    v-for="user in users"
                    :key="user.id"
                    :title="`${user.firstName} ${user.lastName}`"
                    :class="[
                        'ui-selectable',
                        {
                            'ui-selected': user.id === selectedUser?.id
                        }
                    ]"
                    @click="usersStore.selectUser(user)"
                />
            </v-list>
        </div>

        <div class="users-view__editor">
            <div class="tab-panel">
                <v-tabs v-model="activeTab" color="primary">
                    <v-tab value="info"> Information </v-tab>

                    <v-tab value="groups"> Grupper </v-tab>

                    <v-tab value="other"> Övrigt </v-tab>
                </v-tabs>

                <div class="tab-panel__content">
                    <v-window v-model="activeTab">
                        <v-window-item value="info">
                            <div class="user-form" density="compact">
                                <v-text-field v-model="selectedUser.firstName" label="Förnamn" />
                                <v-text-field v-model="selectedUser.lastName" label="Efternamn" />
                                <v-text-field v-model="selectedUser.email" label="E-post" />
                                <h4>Roller</h4>
                                <div class="role-panel">
                                    <v-checkbox
                                        v-for="role in availableRoles"
                                        :key="role"
                                        :model-value="isRoleSelected(role)"
                                        :label="role"
                                        hide-details
                                        density="compact"
                                        @update:model-value="toggleRole(role)"
                                    />
                                </div>

                                <div class="button-row">
                                    <v-btn color="primary" @click="usersStore.saveUser">
                                        Spara
                                    </v-btn>
                                    <v-btn
                                        color="error"
                                        variant="outlined"
                                        @click="usersStore.deleteSelectedUser"
                                    >
                                        Radera
                                    </v-btn>
                                    <v-btn
                                        color="success"
                                        variant="outlined"
                                        @click="usersStore.createNewUser"
                                    >
                                        Ny
                                    </v-btn>
                                </div>
                            </div>
                        </v-window-item>

                        <v-window-item value="groups">
                            <p>Grupphantering kommer i senare version.</p>
                        </v-window-item>

                        <v-window-item value="other">
                            <p>Platshållare för framtida funktionalitet.</p>
                        </v-window-item>
                    </v-window>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.users-view {
    display: grid;
    grid-template-columns: 250px 1fr;
    gap: 2rem;
}

.users-view__list {
    min-height: 500px;
}

.users-view__editor {
    min-width: 0;
}

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
