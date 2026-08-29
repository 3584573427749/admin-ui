import { api } from '@/services/apiService';

export async function getGroupLevels() {
    const response = await api.get('/group/group-levels');

    return response.data;
}

export async function getGroupLevel(id) {
    const response = await api.get(`/group/group-levels/${id}`);

    return response.data;
}

export async function createGroupLevel(groupLevel) {
    const response = await api.post('/group/group-levels', groupLevel);

    return response.data;
}

export async function updateGroupLevel(id, groupLevel) {
    const response = await api.put(`/group/group-levels/${id}`, groupLevel);

    return response.data;
}

export async function deleteGroupLevel(id) {
    await api.delete(`/group/group-levels/${id}`);
}

export async function updateGroupLevelSortOrder(levels) {
    await api.put(`/group/group-levels/sortorder`, levels);
}
