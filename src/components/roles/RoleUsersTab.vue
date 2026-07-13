<script setup>
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useRoleStore } from '@/stores/roleStore.js';
import ConfirmDialog from '@/components/ConfirmDialog.vue';

const roleStore = useRoleStore();
const showDeleteDialog = ref(false);
const selectedUser = ref(null);

const { selectedRole, roleUsers } = storeToRefs(roleStore);
function askRemoveUser(user) {
    selectedUser.value = user;
    showDeleteDialog.value = true;
}
async function removeUser() {
    if (!selectedUser.value) {
        return;
    }

    await roleStore.removeUserFromRole(selectedUser.value.id);
}
</script>

<template>
    <ConfirmDialog
        v-model="showDeleteDialog"
        title="Ta bort användare från roll"
        :text="`Vill du verkligen ta bort ${selectedUser?.firstName ?? ''} ${selectedUser?.lastName ?? ''} från rollen?`"
        confirm-text="Ta bort"
        @confirm="removeUser"
    />

    <div class="role-users-tab">
        <div v-if="roleUsers.length === 0" class="role-users-tab__empty muted">
            Denna roll har inga användare.
        </div>
        <ul v-else class="list">
            <li v-for="user in roleUsers" :key="user.id" class="list-item role-users-tab__row">
                <div>
                    <router-link :to="`/anvandare/${user.id}`" class="link-reset">
                        {{ user.firstName }} {{ user.lastName }}
                    </router-link>

                    <span class="muted"> ({{ user.email }}) </span>
                </div>

                <v-btn
                    icon="mdi-delete"
                    variant="text"
                    color="error"
                    @click="askRemoveUser(user)"
                />
            </li>
        </ul>
    </div>
</template>

<style scoped>
.role-users-tab__row {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.role-users-tab__empty {
    padding: 1rem;
    text-align: center;
}
</style>
