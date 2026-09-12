<script setup>
import { onMounted, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';

import ConfirmDialog from '@/components/ConfirmDialog.vue';
import { useUserStore } from '@/stores/userStore.js';
import { useGroupStore } from '@/stores/groupStore.js';

const userStore = useUserStore();
const groupStore = useGroupStore();

const { selectedUser, selectedGroup, userGroups } = storeToRefs(userStore);

const { groups, selectedLeader } = storeToRefs(groupStore);

const roles = ['Ledare', 'Assistent', 'Utbildare'];

const showDeleteDialog = ref(false);
const groupToDelete = ref(null);

onMounted(async () => {
    await groupStore.loadGroups();
});

watch(
    () => selectedUser.value.id,
    async (id) => {
        if (!id) {
            return;
        }
        selectedLeader.value = { userId: selectedUser.value.id, role: null };
        await userStore.loadUserGroups();
    },
    {
        immediate: true
    }
);

function removeGroup(group) {
    groupToDelete.value = group;
    showDeleteDialog.value = true;
}

function selectGroup(group) {
    selectedGroup.value = {
        groupId: group.groupId,
        role: group.role
    };
}

async function saveGroup() {
    await groupStore.saveLeader();
    await userStore.loadUserGroups();
}

function createNewGroup() {
    selectedGroup.value = {
        groupId: null,
        role: 'Ledare'
    };
}

async function deleteSelectedGroup() {
    if (!groupToDelete.value) {
        return;
    }

    await groupStore.deleteLeader(selectedUser.value.id);
    await userStore.loadUserGroups();

    groupToDelete.value = null;
}
</script>
<template>
  <ConfirmDialog
    v-model="showDeleteDialog"
    title="Ta bort gruppkoppling"
    text="Vill du verkligen ta bort gruppkopplingen?"
    confirm-text="Ta bort"
    @confirm="deleteSelectedGroup"
  />

  <div class="user-groups-form">
    <v-select
      v-model="selectedGroup.groupId"
      :items="groups"
      item-title="name"
      item-value="id"
      label="Grupp"
    />

    <v-select
      v-model="selectedGroup.role"
      :items="roles"
      label="Roll"
    />

    <div class="button-row">
      <v-btn
        color="primary"
        @click="saveGroup"
      >
        Spara
      </v-btn>

      <v-btn
        color="success"
        variant="outlined"
        @click="createNewGroup"
      >
        Ny
      </v-btn>
    </div>

    <v-divider class="my-4" />

    <div class="list-header">
      <span>Grupp</span>
      <span>Roll</span>
      <span />
    </div>

    <ul class="list">
      <li
        v-for="group in userGroups"
        :key="group.id"
        class="list-item user-group-row"
      >
        <span>
          {{ group.name }}
        </span>

        <span>
          {{ group.role }}
        </span>

        <div class="user-group-row__actions">
          <v-icon
            icon="mdi-pencil"
            @click="selectGroup(group)"
          />

          <v-icon
            icon="mdi-delete"
            color="error"
            @click="removeGroup(group)"
          />
        </div>
      </li>
    </ul>
  </div>
</template>
<style scoped>
.user-groups-form {
    max-width: 600px;
}

.button-row {
    display: flex;
    gap: 1rem;

    margin-top: 1rem;
}

.list-header {
    display: grid;
    grid-template-columns: 1fr 120px 80px;

    margin-bottom: 0.5rem;

    font-weight: 600;
}

.user-group-row {
    display: grid;
    grid-template-columns: 1fr 120px 80px;

    align-items: center;
}

.user-group-row__actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
}

.user-group-row :deep(.v-icon) {
    cursor: pointer;
}
</style>
