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
        active: 0,
        competitive: 0,
        createdAt: null,
        updatedAt: null
    };
}

function newLeader() {
    return {
        userId: '',
        role: ''
    };
}
export const useGroupStore = defineStore('groupsStore', () => {
    const notificationStore = useNotificationStore();
    const groups = ref([]);
    const selectedGroup = ref(newGroup());
    const groupLeaders = ref([]);
    const selectedLeader = ref({
        userId: '',
        role: ''
    });

    const users = ref([]);

    const loading = ref(false);

    function selectGroup(group) {
        selectedGroup.value = structuredClone(toRaw(group));
    }

    function createNewGroup() {
        selectedGroup.value = newGroup();
    }

    function createNewLeader() {
        selectedLeader.value = newLeader();
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
    /*
Gruppledare
 */
    /**
     * Hämta alla aktuella ledare
     * @returns {Promise<void>}
     */
    async function loadUsers() {
        try {
            users.value = (await groupService.getUsers()).map((user) => ({
                ...user,
                fullName: `${user.firstName} ${user.lastName}`
            }));
        } catch (error) {
            notificationStore.error(error);

            throw error;
        }
    }

    /**
     * Hämta gruppens ledare
     * @returns {Promise<void>}
     */
    async function loadGroupLeaders() {
        const { id } = selectedGroup.value;

        if (!id) {
            groupLeaders.value = [];
            return;
        }

        try {
            groupLeaders.value = (await groupService.getGroupLeaders(id)).map((leader) => ({
                ...leader,
                fullName: `${leader.firstName} ${leader.lastName}`
            }));
        } catch (error) {
            notificationStore.error(error);

            throw error;
        }
    }

    /**
     * Välj ledare att redigera
     * @param leader
     */
    function selectLeader(leader) {
        selectedLeader.value = {
            userId: leader.id,
            role: leader.role
        };
    }

    /**
     * Spara ledare
     * @returns {Promise<void>}
     */
    async function saveLeader() {
        try {
            await groupService.saveGroupLeader(selectedGroup.value.id, {
                ...selectedLeader.value,
                groupId: selectedGroup.value.id
            });

            notificationStore.success('Ledaren sparades.');

            await loadGroupLeaders();

            createNewLeader();
        } catch (error) {
            notificationStore.error(error);

            throw error;
        }
    }

    /**
     * Radera ledare
     * @param userId
     * @returns {Promise<void>}
     */
    async function deleteLeader(userId) {
        try {
            await groupService.deleteGroupLeader(selectedGroup.value.id, userId);

            notificationStore.success('Ledaren togs bort.');

            await loadGroupLeaders();
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
        deleteSelectedGroup,

        groupLeaders,
        selectedLeader,
        users,

        createNewLeader,

        loadGroupLeaders,
        loadUsers,

        selectLeader,
        saveLeader,
        deleteLeader
    };
});
