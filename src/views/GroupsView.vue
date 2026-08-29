<script setup>
import { onMounted, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter, useRoute } from 'vue-router';
import { useGroupStore } from '@/stores/userStore.js';
import UserInfoTab from '@/components/groups/UserInfoTab.vue';

const router = useRouter();
const route = useRoute();
const groupStore = useGroupStore();
const { groups: groups, selectedGroup } = storeToRefs(groupStore);

const activeTab = ref('info');

onMounted(async () => {
    await groupStore.loadGroups();

    if (!route.params.id && groups.value.length > 0) {
        router.replace(`/grupp/${groups.value[0].id}`);
    }
});

watch(
    () => route.params.id,
    async (id) => {
        if (!id) {
            return;
        }

        await groupStore.loadGroup(id);
    },
    { immediate: true }
);
</script>

<template>
  <div class="groups-view">
    <div class="groups-view__list">
      <h3>Grupper</h3>

      <v-list density="compact">
        <v-list-item
          v-for="group in groups"
          :key="group.id"
          :title="`${group.name}`"
          :class="[
            'ui-selectable',
            {
              'ui-selected': group.id === selectedGroup?.id
            }
          ]"
          @click="router.push(`/grupp/${group.id}`)"
        />
      </v-list>
    </div>

    <div class="groups-view__editor">
      <div class="tab-panel">
        <v-tabs
          v-model="activeTab"
          color="primary"
        >
          <v-tab value="info">
            Information
          </v-tab>

          <v-tab value="leaders">
            Ledare
          </v-tab>
        </v-tabs>

        <div class="tab-panel__content">
          <v-window v-model="activeTab">
            <GroupInfoTab />

            <v-window-item value="leaders">
              <p>Ledarhantering</p>
            </v-window-item>
          </v-window>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.groups-view {
    display: grid;
    grid-template-columns: 250px 1fr;
    gap: 2rem;
}

.groups-view__list {
    min-height: 500px;
}

.groups-view__editor {
    min-width: 0;
}
</style>
