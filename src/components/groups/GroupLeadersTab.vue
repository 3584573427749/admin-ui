<script setup>
import { onMounted, ref, watch } from 'vue';
import { useGroupStore } from '@/stores/groupStore.js';
import { storeToRefs } from 'pinia';
import ConfirmDialog from '@/components/ConfirmDialog.vue';

const groupStore = useGroupStore();
const { selectedGroup, selectedLeader, users, groupLeaders } = storeToRefs(groupStore);

const roles = ['Ledare', 'Assistent', 'Utbildare'];
const showDeleteDialog = ref(false);
const leaderToDelete = ref(null);

onMounted(async () => {
    await groupStore.loadUsers();
});

watch(
    () => selectedGroup.value.id,
    async (id) => {
        if (!id) {
            return;
        }

        await groupStore.loadGroupLeaders();
    },
    {
        immediate: true
    }
);

function removeLeader(leader) {
    leaderToDelete.value = leader;
    showDeleteDialog.value = true;
}
function selectLeader(leader) {
    selectedLeader.value = {
        userId: leader.userId,
        role: leader.role
    };
}

function saveLeader() {
    groupStore.saveLeader();
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
    :text="`Vill du verkligen ta bort ${leaderToDelete?.fullName ?? ''} från gruppen?`"
    confirm-text="Ta bort"
    @confirm="groupStore.deleteLeader(leaderToDelete.id)"
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
  <div class="list-header">
    <span>Namn</span>
    <span>Roll</span>
  </div>
  <ul class="list">
    <li
      v-for="leader in groupLeaders"
      :key="leader.id"
      class="list-item leader-row"
    >
      <span> {{ leader.fullName }} </span>

      <span>
        {{ leader.role }}
      </span>

      <div class="leader-row__actions">
        <v-icon
          icon="mdi-pencil"
          @click="selectLeader(leader)"
        />

        <v-icon
          icon="mdi-delete"
          color="error"
          @click="removeLeader(leader)"
        />
      </div>
    </li>
  </ul>
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
.leader-row {
    display: grid;
    grid-template-columns: 1fr 120px 80px;
    align-items: center;
}

.leader-row__actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
}

.list-header {
    display: grid;
    grid-template-columns: 1fr 120px 80px;

    padding: 0.5rem;

    font-weight: 600;
}

.leader-row :deep(.v-icon) {
    cursor: pointer;
}
</style>
