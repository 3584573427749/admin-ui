import { api } from '@/services/apiService';

export async function getRoles() {
    const response = await api.get('/auth/roles');

    return response.data;
}

export async function getRole(id) {
    const response = await api.get(`/auth/roles/${id}`);

    return response.data;
}

export async function createRole(role) {
    const response = await api.post('/auth/roles', role);

    return response.data;
}

export async function updateRole(id, role) {
    const response = await api.put(`/auth/roles/${id}`, role);

    return response.data;
}

export async function deleteRole(id) {
    await api.delete(`/auth/roles/${id}`);
}

export async function getRoleUsers(id) {
    const response = await api.get(`/auth/roles/${id}/users`);

    return response.data;
}

export async function removeRoleUser(roleId, userId) {
    await api.delete(`/auth/users/${userId}/roles/${roleId}`);
}
