import { defineStore } from 'pinia';
import { ref, toRaw } from 'vue';
import { useNotificationStore } from '@/stores/notificationStore';

import * as groupLevelService from '@/services/groupLevelService.js';

function newGroupLevel() {
    return {
        id: null,
        name: '',
        description: '',
        sortOrder: 0,
        createdAt: null,
        updatedAt: null
    };
}

export const useGroupLevelStore = defineStore('groupLevelStore', () => {
    const notificationStore = useNotificationStore();
    const groupLevels = ref([]);
    const selectedGroupLevel = ref(newGroupLevel());

    const loading = ref(false);

    function selectGroupLevel(groupLevel) {
        selectedGroupLevel.value = structuredClone(toRaw(groupLevel));
    }

    function createNewGroupLevel() {
        selectedGroupLevel.value = newGroupLevel();
    }

    async function loadGroupLevels() {
        loading.value = true;

        try {
            groupLevels.value = await groupLevelService.getGroupLevels();

            if (groupLevels.value.length > 0 && !selectedGroupLevel.value.id) {
                selectGroupLevel(groupLevels.value[0]);
            }
        } finally {
            loading.value = false;
        }
    }

    async function loadGroupLevel(id) {
        loading.value = true;

        try {
            selectedGroupLevel.value = await groupLevelService.getGroupLevel(id);
        } finally {
            loading.value = false;
        }
    }

    async function saveGroupLevel() {
        const groupLevel = selectedGroupLevel.value;
        try {
            if (groupLevel.id) {
                selectedGroupLevel.value = await groupLevelService.updateGroupLevel(
                    groupLevel.id,
                    groupLevel
                );
                notificationStore.success('Gruppnivån uppdaterades.');
            } else {
                selectedGroupLevel.value = await groupLevelService.createGroupLevel({
                    name: groupLevel.name,
                    description: groupLevel.description,
                    sortOrder: groupLevel.sortOrder
                });
                notificationStore.success('Gruppnivå skapades.');
            }

            await loadGroupLevels();
        } catch (error) {
            notificationStore.error(error);

            throw error;
        }
    }

    async function deleteSelectedGroupLevel() {
        const { id } = selectedGroupLevel.value;

        if (!id) {
            createNewGroupLevel();
            return;
        }
        try {
            await groupLevelService.deleteGroupLevel(id);
            notificationStore.success('Gruppnivån togs bort.');

            await loadGroupLevels();
            if (groupLevels.value.length > 0) {
                selectGroupLevel(groupLevels.value[0]);
            } else {
                createNewGroupLevel();
            }
            return selectedGroupLevel.value.id;
        } catch (error) {
            notificationStore.error(error);

            throw error;
        }
    }

    return {
        groupLevels,
        selectedGroupLevel,
        loading,

        selectGroupLevel,
        createNewGroupLevel,

        loadGroupLevels,
        loadGroupLevel,
        saveGroupLevel,
        deleteSelectedGroupLevel
    };
});
