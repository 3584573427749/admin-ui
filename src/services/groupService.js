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
