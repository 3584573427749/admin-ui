<script setup>
import { onMounted, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '@/stores/userStore.js';
import UserInfoTab from '@/components/users/UserInfoTab.vue';
import UserGroupsTab from '@/components/users/UserGroupsTab.vue';

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const { users, selectedUser } = storeToRefs(userStore);

const activeTab = ref('info');

onMounted(async () => {
    await userStore.loadUsers();

    if (!route.params.id && users.value.length > 0) {
        router.replace(`/anvandare/${users.value[0].id}`);
    }
});

watch(
    () => route.params.id,
    async (id) => {
        if (!id) {
            return;
        }

        await userStore.loadUser(id);
    },
    { immediate: true }
);
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
          @click="router.push(`/anvandare/${user.id}`)"
        />
      </v-list>
    </div>

    <div class="users-view__editor">
      <div class="tab-panel">
        <v-tabs
          v-model="activeTab"
          color="primary"
        >
          <v-tab value="info">
            Information
          </v-tab>

          <v-tab value="groups">
            Grupper
          </v-tab>

          <v-tab value="other">
            Övrigt
          </v-tab>
        </v-tabs>

        <div class="tab-panel__content">
          <v-window v-model="activeTab">
            <UserInfoTab />

            <v-window-item value="groups">
              <UserGroupsTab />
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
