<script setup>
import { computed, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useRoleStore } from '@/stores/roleStore.js';
import ConfirmDialog from '@/components/ConfirmDialog.vue';
import router from '@/router/index.js';

const roleStore = useRoleStore();
const showDeleteDialog = ref(false);

const { selectedRole, roleUsers } = storeToRefs(roleStore);
const userCount = computed(() => roleUsers.value.length);

async function removeUser() {
    const id = await roleStore.deleteSelectedRole();

    if (id) {
        await router.push(`/roller/${id}`);
    } else {
        await router.push('/roller');
    }
}

async function saveRole() {
    await roleStore.saveRole();
    await router.push(`/roller/${selectedRole.value.id}`);
}
</script>

<template>
  <ConfirmDialog
    v-model="showDeleteDialog"
    title="Ta bort roll"
    text="Vill du verkligen ta bort rollen?"
    confirm-text="Ta bort"
    @confirm="removeUser"
  />

  <div class="role-form">
    <v-text-field
      v-model="selectedRole.name"
      label="Namn"
    />

    <v-textarea
      v-model="selectedRole.description"
      label="Beskrivning"
      rows="4"
    />

    <v-text-field
      v-model.number="selectedRole.adminLevel"
      label="Administrationsnivå"
      type="number"
      max="100"
      min="0"
      step="10"
    />
    <p>Antal användare: {{ userCount }}</p>
    <div class="button-row">
      <v-btn
        color="primary"
        @click="saveRole"
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
        @click="roleStore.createNewRole"
      >
        Ny
      </v-btn>
    </div>
  </div>
</template>

<style scoped>
.role-form {
    max-width: 600px;
}

.button-row {
    display: flex;
    gap: 1rem;

    margin-top: 2rem;
}
</style>
