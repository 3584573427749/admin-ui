<script setup>
import { onMounted, ref } from 'vue';
import { useGroupStore } from '@/stores/groupStore.js';
import { storeToRefs } from 'pinia';
import ConfirmDialog from '@/components/ConfirmDialog.vue';
import router from '@/router/index.js';
import { useGroupLevelStore } from '@/stores/groupLevelStore.js';

const groupStore = useGroupStore();

const { selectedLeader, users } = storeToRefs(groupStore);
const showDeleteDialog = ref(false);

onMounted(async () => {
    await groupStore.loadUsers();
});

const roles = ['Ledare', 'Assistent', 'Utbildare'];

function saveLeader() {
    groupStore.saveLeader();
}
function removeLeader() {
    console.log(selectedLeader.value);
}

function createNewLeader() {
    selectedLeader.value = {
        groupId: null,
        userId: null,
        role: 'Ledare'
    };
}
</script>
<template>
  <ConfirmDialog
    v-model="showDeleteDialog"
    title="Ta bort gruppledare"
    text="Vill du verkligen ta bort  gruppen?"
    confirm-text="Ta bort"
    @confirm="removeLeader"
  />

  <div class="leader-form">
    <v-select
      v-model="selectedLeader.userId"
      :items="users"
      item-title="fullName"
      item-value="id"
      label="Namn"
    />

    <v-select
      v-model="selectedLeader.role"
      :items="roles"
      label="Roll"
    />

    <div class="button-row">
      <v-btn
        color="primary"
        @click="saveLeader"
      >
        Spara
      </v-btn>

      <v-btn
        color="success"
        variant="outlined"
        @click="createNewLeader"
      >
        Ny
      </v-btn>
    </div>
  </div>
</template>

<style scoped>
.leader-form {
    max-width: 600px;
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
