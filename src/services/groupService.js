import { api } from '@/services/apiService';

/**
 * Hämtar alla grupper.
 *
 * @returns {Promise<Array>}
 */
export async function getGroups() {
    const response = await api.get('/group/groups');

    return response.data;
}

/**
 * Hämtar en grupp.
 *
 * @param {string} id
 * @returns {Promise<Object>}
 */
export async function getGroup(id) {
    const response = await api.get(`/group/groups/${id}`);

    return response.data;
}

/**
 * Skapar en grupp.
 *
 * @param {Object} group
 * @returns {Promise<Object>}
 */
export async function createGroup(group) {
    const response = await api.post('/group/groups', group);

    return response.data;
}

/**
 * Uppdaterar en grupp.
 *
 * @param {string} id
 * @param {Object} group
 * @returns {Promise<Object>}
 */
export async function updateGroup(id, group) {
    const response = await api.put(`/group/groups/${id}`, group);

    return response.data;
}

/**
 * Tar bort en grupp.
 *
 * @param {string} id
 */
export async function deleteGroup(id) {
    await api.delete(`/group/groups/${id}`);
}

/*
 * Group leaders
 */
/**
 * Hämtar gruppens ledare
 * @param groupId
 * @returns {Promise<*>}
 */
export async function getGroupLeaders(groupId) {
    const response = await api.get(`/group/groups/${groupId}/users`);

    return response.data;
}

/**
 * Lägger till/Uppdaterar ledarinfo för aktuell grupp
 * @param groupId
 * @param leader
 * @returns {Promise<void>}
 */
export async function saveGroupLeader(groupId, leader) {
    await api.post(`/group/groups/${groupId}/users`, leader);
}

/**
 * Raderar ledare för gruppen
 * @param groupId
 * @param userId
 * @returns {Promise<void>}
 */
export async function deleteGroupLeader(groupId, userId) {
    await api.delete(`/group/groups/${groupId}/users/${userId}`);
}

/**
 * Hämtar alla ledare
 * @returns {Promise<*>}
 */
export async function getUsers() {
    const response = await api.get('/group/users');

    return response.data;
}

/**
 * Hämtar alla grupper för en ledare
 * @param userId
 * @returns {Promise<*>}
 */
export async function getUserGroups(userId) {
    const response = await api.get(`/group/users/${userId}/groups`);

    return response.data;
}
