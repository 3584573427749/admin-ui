<script setup>
import { onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useRoleStore } from '@/stores/roleStore.js';
import RoleInfoTab from '@/components/roles/RoleInfoTab.vue';
import RoleUsersTab from '@/components/roles/RoleUsersTab.vue';
import { useRoute } from 'vue-router';
import { watch } from 'vue';
import router from '@/router/index.js';

const route = useRoute();
const roleStore = useRoleStore();

const { roles, selectedRole, loading } = storeToRefs(roleStore);

const activeTab = ref('info');

onMounted(async () => {
    await roleStore.loadRoles();

    if (!route.params.id && roles.value.length > 0) {
        router.replace(`/roller/${roles.value[0].id}`);
    }
});
watch(
    () => route.params.id,
    async (id) => {
        if (!id) {
            return;
        }

        await roleStore.loadRole(id);
    },
    { immediate: true }
);
</script>

<template>
  <div class="roles-view">
    <div class="roles-view__list">
      <h3>Roller</h3>

      <v-list density="compact">
        <v-list-item
          v-for="role in roles"
          :key="role.id"
          :title="role.name"
          :class="[
            'ui-selectable',
            {
              'ui-selected': role.id === selectedRole?.id
            }
          ]"
          @click="router.push(`/roller/${role.id}`)"
        />
      </v-list>
    </div>

    <div class="roles-view__editor">
      <div class="tab-panel">
        <v-tabs
          v-model="activeTab"
          color="primary"
        >
          <v-tab value="info">
            Information
          </v-tab>

          <v-tab value="users">
            Användare
          </v-tab>
        </v-tabs>

        <div class="tab-panel__content">
          <v-window v-model="activeTab">
            <v-window-item value="info">
              <RoleInfoTab />
            </v-window-item>

            <v-window-item value="users">
              <RoleUsersTab />
            </v-window-item>
          </v-window>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.roles-view {
    display: grid;
    grid-template-columns: 250px 1fr;
    gap: 2rem;
}

.roles-view__list {
    min-height: 500px;
}

.roles-view__editor {
    min-width: 0;
}
</style>
