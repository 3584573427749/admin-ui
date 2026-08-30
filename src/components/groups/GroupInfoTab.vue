<script setup>
import { onMounted, ref } from 'vue';
import { useGroupStore } from '@/stores/groupStore.js';
import { storeToRefs } from 'pinia';
import ConfirmDialog from '@/components/ConfirmDialog.vue';
import router from '@/router/index.js';
import { useGroupLevelStore } from '@/stores/groupLevelStore.js';

const groupStore = useGroupStore();
const groupLevelStore = useGroupLevelStore();

const { selectedGroup } = storeToRefs(groupStore);
const { groupLevels } = storeToRefs(groupLevelStore);
const showDeleteDialog = ref(false);

onMounted(async () => {
    await groupLevelStore.loadGroupLevels();
});

async function removeGroup() {
    const id = await groupStore.deleteSelectedGroup();

    if (id) {
        await router.push(`/grupp/${id}`);
    } else {
        await router.push('/grupp');
    }
}

async function saveGroup() {
    await groupStore.saveGroup();

    router.push(`/grupp/${selectedGroup.value.id}`);
}
</script>
<template>
  <ConfirmDialog
    v-model="showDeleteDialog"
    title="Ta bort grupp"
    text="Vill du verkligen ta bort gruppen?"
    confirm-text="Ta bort"
    @confirm="removeGroup"
  />
  <v-window-item value="info">
    <div
      class="group-form"
      density="compact"
    >
      <v-text-field
        v-model="selectedGroup.name"
        label="Namn"
      />
      <v-select
        v-model="selectedGroup.groupLevelId"
        label="Gruppnivå"
        :items="groupLevels"
        item-title="name"
        item-value="id"
      />
      <v-select
        v-model="selectedGroup.venue"
        label="Anläggning"
        :items="['Mariebad', 'Ålands Idrottscenter']"
      />
      <v-checkbox
        v-model="selectedGroup.active"
        :true-value="1"
        :false-value="0"
        label="Aktiv"
      />
      <v-checkbox
        v-model="selectedGroup.competitive"
        :true-value="1"
        :false-value="0"
        label="Tävlar"
      />
      <v-textarea
        v-model="selectedGroup.description"
        label="Beskrivning"
        rows="4"
      />

      <div class="button-row">
        <v-btn
          color="primary"
          @click="saveGroup"
        >
          Spara
        </v-btn>
        <v-btn
          color="error"
          variant="outlined"
          @click="showDeleteDialog = true"
        >
          Radera
        </v-btn>
        <v-btn
          color="success"
          variant="outlined"
          @click="groupStore.createNewGroup"
        >
          Ny
        </v-btn>
      </div>
    </div>
  </v-window-item>
</template>

<style scoped>
.group-form {
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
.role-panel :deep(.v-checkbox) {
    --v-input-control-height: 28px;
}
</style>
