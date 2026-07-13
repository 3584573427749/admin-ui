<script setup>
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useRoleStore } from '@/stores/roleStore.js';
import ConfirmDialog from '@/components/ConfirmDialog.vue';

const roleStore = useRoleStore();
const showDeleteDialog = ref(false);

const { selectedRole, roleUsers } = storeToRefs(roleStore);

function removeUser() {
    roleStore.deleteSelectedRole();
}
</script>

<template>
    <ConfirmDialog
        v-model="showDeleteDialog"
        title="Ta bort roll"
        text="Vill du verkligen ta bort rollen?"
        confirm-text="Ta bort"
        @confirm="removeUser"
    />

    <div class="role-users-tab">
        <ul class="list">
            <li v-for="user in roleUsers" :key="user.id" class="list-item role-users-tab__row">
                <div>
                    <router-link :to="`/anvandare/${user.id}`" class="link-reset">
                        {{ user.firstName }} {{ user.lastName }}
                    </router-link>

                    <span class="muted"> ({{ user.email }}) </span>
                </div>

                <v-btn icon="mdi-delete" variant="text" color="error" />
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
</style>
