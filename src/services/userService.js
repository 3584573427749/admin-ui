import { api } from '@/services/apiService';

/**
 * Hämtar alla användare.
 *
 * @returns {Promise<Array>}
 */
export async function getUsers() {
    const response = await api.get('/users');

    return response.data;
}

/**
 * Hämtar en användare.
 *
 * @param {string} id
 * @returns {Promise<Object>}
 */
export async function getUser(id) {
    const response = await api.get(`/users/${id}`);

    return response.data;
}

/**
 * Skapar en användare.
 *
 * @param {Object} user
 * @returns {Promise<Object>}
 */
export async function createUser(user) {
    const response = await api.post('/users', user);

    return response.data;
}

/**
 * Uppdaterar en användare.
 *
 * @param {string} id
 * @param {Object} user
 * @returns {Promise<Object>}
 */
export async function updateUser(id, user) {
    const response = await api.put(`/users/${id}`, user);

    return response.data;
}

/**
 * Tar bort en användare.
 *
 * @param {string} id
 */
export async function deleteUser(id) {
    await api.delete(`/users/${id}`);
}
