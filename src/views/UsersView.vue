<script setup>
import { computed, onMounted, ref } from 'vue';
import { useUserStore } from '@/stores/userStore.js';
import { storeToRefs } from 'pinia';
import UserInfoTab from '@/components/users/UserInfoTab.vue';

const userStore = useUserStore();
const { users, selectedUser, loading } = storeToRefs(userStore);

const activeTab = ref('info');

onMounted(async () => {
    await userStore.loadUsers();
});

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
                    @click="userStore.selectUser(user)"
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
                        <UserInfoTab />

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


</style>
