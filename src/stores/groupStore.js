import { defineStore } from 'pinia';
import { ref, toRaw } from 'vue';
import { useNotificationStore } from '@/stores/notificationStore';

import * as groupService from '@/services/groupService';

function newGroup() {
    return {
        id: null,
        name: '',
        groupLevelId: '',
        venue: '',
        description: '',
        active: false,
        competitive: false,
        createdAt: null,
        updatedAt: null
    };
}

export const useGroupStore = defineStore('groupsStore', () => {
    const notificationStore = useNotificationStore();
    const groups = ref([]);
    const selectedGroup = ref(newGroup());

    const loading = ref(false);

    function selectGroup(group) {
        selectedGroup.value = structuredClone(toRaw(group));
    }

    function createNewGroup() {
        selectedGroup.value = newGroup();
    }

    async function loadGroups() {
        loading.value = true;

        try {
            groups.value = await groupService.getGroups();

            if (groups.value.length > 0 && !selectedGroup.value.id) {
                selectGroup(groups.value[0]);
            }
        } finally {
            loading.value = false;
        }
    }

    async function loadGroup(id) {
        loading.value = true;

        try {
            selectedGroup.value = await groupService.getGroup(id);
        } finally {
            loading.value = false;
        }
    }

    async function saveGroup() {
        const group = selectedGroup.value;
        try {
            if (group.id) {
                selectedGroup.value = await groupService.updateGroup(group.id, group);
                notificationStore.success('Gruppen uppdaterades.');
            } else {
                selectedGroup.value = await groupService.createGroup({
                    name: group.name,
                    groupLevelId: group.groupLevelId,
                    venue: group.venue,
                    description: group.description,
                    active: group.active,
                    competitive: group.competitive
                });
                notificationStore.success('Gruppen skapades.');
            }

            await loadGroups();
        } catch (error) {
            notificationStore.error(error);

            throw error;
        }
    }

    async function deleteSelectedGroup() {
        const { id } = selectedGroup.value;

        if (!id) {
            createNewGroup();
            return;
        }
        try {
            await groupService.deleteGroup(id);
            notificationStore.success('Gruppen togs bort.');

            await loadGroups();
            if (groups.value.length > 0) {
                selectGroup(groups.value[0]);
            } else {
                createNewGroup();
            }
            return selectedGroup.value.id;
        } catch (error) {
            notificationStore.error(error);

            throw error;
        }
    }

    return {
        groups,
        selectedGroup,
        loading,

        selectGroup,
        createNewGroup,

        loadGroups,
        loadGroup,
        saveGroup,
        deleteSelectedGroup
    };
});
