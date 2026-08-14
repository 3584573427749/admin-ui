<script setup>
import { onMounted, watch } from 'vue';
import draggable from 'vuedraggable';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useGroupLevelStore } from '@/stores/groupLevelStore.js';

const router = useRouter();
const route = useRoute();
const groupLevelStore = useGroupLevelStore();
const { groupLevels, selectedGroupLevel, newGroupLevel } = storeToRefs(groupLevelStore);

onMounted(async () => {
    await groupLevelStore.loadGroupLevels();

    if (!route.params.id && groupLevels.value.length > 0) {
        router.replace(`/gruppniva/${groupLevels.value[0].id}`);
    }
});

watch(
    () => route.params.id,
    async (id) => {
        if (!id) {
            return;
        }

        await groupLevelStore.loadGroupLevel(id);
    },
    { immediate: true }
);

function selectLevel(level) {
    selectedGroupLevel.value = JSON.parse(JSON.stringify(level));
}

function createNewLevel() {
    selectedGroupLevel.value = newGroupLevel();
}

function saveLevel() {
    console.log('save', selectedGroupLevel.value);
}

function deleteLevel(id) {
    groupLevels.value = groupLevels.value.filter((level) => level.id !== id);
}

function updateSortOrder() {
    groupLevels.value.forEach((level, index) => {
        level.sortOrder = index + 1;
    });

    console.log(groupLevels.value);
}
</script>
<template>
  <div class="group-levels-view">
    <h2>Gruppnivåer</h2>

    <div class="group-level-form">
      <v-text-field
        v-model="selectedGroupLevel.name"
        label="Namn"
      />

      <v-textarea
        v-model="selectedGroupLevel.description"
        label="Beskrivning"
        rows="4"
      />

      <div class="button-row">
        <v-btn
          color="primary"
          @click="saveLevel"
        >
          Spara
        </v-btn>

        <v-btn
          color="success"
          variant="outlined"
          @click="createNewLevel"
        >
          Ny
        </v-btn>
      </div>
    </div>

    <draggable
      v-model="groupLevels"
      item-key="id"
      handle=".drag-handle"
      @end="updateSortOrder"
    >
      <template #item="{ element }">
        <div class="list-item group-level-row">
          <span>
            {{ element.name }}
          </span>

          <div class="group-level-row__actions">
            <v-icon
              class="drag-handle"
              icon="mdi-drag"
            />

            <v-icon
              icon="mdi-pencil"
              @click="selectLevel(element)"
            />

            <v-icon
              icon="mdi-delete"
              color="error"
              @click="deleteLevel(element.id)"
            />
          </div>
        </div>
      </template>
    </draggable>
  </div>
</template>

<style scoped>
.group-level-form {
    max-width: 600px;
    margin-bottom: 2rem;
}

.button-row {
    display: flex;
    gap: 1rem;
}

.group-level-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.group-level-row__actions {
    display: flex;
    align-items: center;
}
.group-level-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.group-level-row__actions {
    display: flex;
    gap: 0.5rem;
}

.drag-handle {
    cursor: move;
}
</style>
