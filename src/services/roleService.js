import { api } from '@/services/apiService';

export async function getRoles() {
    const response = await api.get('/roles');

    return response.data;
}

export async function getRole(id) {
    const response = await api.get(`/roles/${id}`);

    return response.data;
}

export async function createRole(role) {
    const response = await api.post('/roles', role);

    return response.data;
}

export async function updateRole(id, role) {
    const response = await api.put(`/roles/${id}`, role);

    return response.data;
}

export async function deleteRole(id) {
    await api.delete(`/roles/${id}`);
}

export async function getRoleUsers(id) {
    const response = await api.get(`/roles/${id}/users`);

    return response.data;
}