<script setup>
import ConfirmDialog from '@/components/ConfirmDialog.vue';
import { ref } from 'vue';
const showDeleteDialog = ref(false);

const roleUsers = [
    {
        id: 1,
        firstName: 'Förnamn',
        lastName: 'Efternamn',
        email: 'epost@example.com'
    },
    {
        id: 2,
        firstName: 'Förnamn',
        lastName: 'Efternamn',
        email: 'epost@example.com'
    },
    {
        id: 3,
        firstName: 'Förnamn',
        lastName: 'Efternamn',
        email: 'epost@example.com'
    },
    {
        id: 4,
        firstName: 'Förnamn',
        lastName: 'Efternamn',
        email: 'epost@example.com'
    }
];

function removeUser() {
    console.log('Ta bort användare från rollen');
}
</script>

<template>
    <ConfirmDialog
        v-model="showDeleteDialog"
        title="Ta bort användare"
        text="Vill du verkligen ta bort användaren från rollen?"
        confirm-text="Ta bort"
        @confirm="removeUser"
    />
    <div class="role-users-tab">
        <div class="role-users-list">
            <div v-for="user in roleUsers" :key="user.id" class="role-user-row">
                <span>
                    {{ user.firstName }}
                    {{ user.lastName }}
                    ({{ user.email }})
                </span>

                <v-btn icon variant="text" color="error">
                    <v-icon @click="showDeleteDialog = true"> mdi-delete </v-icon>
                </v-btn>
            </div>
        </div>
    </div>
</template>

<style scoped>
.role-users-tab {
    max-width: 700px;
}

.role-users-list {
    max-height: 400px;

    overflow-y: auto;

    padding: 1rem;

    border: 1px solid var(--color-border);
    border-radius: 4px;

    background-color: var(--color-surface);
}

.role-user-row {
    display: flex;
    justify-content: space-between;
    align-items: center;

    padding: 0.75rem 0;

    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.role-user-row:last-child {
    border-bottom: none;
}
</style>
