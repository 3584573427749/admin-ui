<script setup>
import { useRoleStore } from '@/stores/roleStore';
import { onMounted, ref } from 'vue';
import { useUserStore } from '@/stores/userStore.js';
import { storeToRefs } from 'pinia';
import ConfirmDialog from '@/components/ConfirmDialog.vue';
import router from '@/router/index.js';

const emit = defineEmits(['saved']);
const userStore = useUserStore();
const roleStore = useRoleStore();

const { selectedUser } = storeToRefs(userStore);
const { roles } = storeToRefs(roleStore);
const showDeleteDialog = ref(false);

onMounted(async () => {
    await roleStore.loadRoles();
});

function isRoleSelected(roleId) {
    return selectedUser.value.roles.includes(roleId);
}

function toggleRole(roleId) {
    const roles = selectedUser.value.roles;

    const index = roles.indexOf(roleId);

    if (index >= 0) {
        roles.splice(index, 1);
    } else {
        roles.push(roleId);
    }
}
async function removeUser() {
    const id = await userStore.deleteSelectedUser();

    if (id) {
        await router.push(`/anvandare/${id}`);
    } else {
        await router.push('/anvandare');
    }
}

async function saveUser() {
    await userStore.saveUser();
    emit('saved');
    router.push(`/anvandare/${selectedUser.value.id}`);
}
</script>
<template>
  <ConfirmDialog
    v-model="showDeleteDialog"
    title="Ta bort användare"
    text="Vill du verkligen ta bort användaren?"
    confirm-text="Ta bort"
    @confirm="removeUser"
  />
  <v-window-item value="info">
    <div
      class="user-form"
      density="compact"
    >
      <v-text-field
        v-model="selectedUser.firstName"
        label="Förnamn"
      />
      <v-text-field
        v-model="selectedUser.lastName"
        label="Efternamn"
      />
      <v-text-field
        v-model="selectedUser.email"
        label="E-post"
      />
      <h4>Roller</h4>
      <div class="role-panel">
        <v-checkbox
          v-for="role in roles"
          :key="role.id"
          :label="role.name"
          :model-value="isRoleSelected(role.id)"
          density="compact"
          @update:model-value="toggleRole(role.id)"
        />
      </div>

      <div class="button-row">
        <v-btn
          color="primary"
          @click="saveUser"
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
          @click="userStore.createNewUser"
        >
          Ny
        </v-btn>
      </div>
    </div>
  </v-window-item>
</template>

<style scoped>
.user-form {
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
