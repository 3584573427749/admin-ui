import { api } from '@/services/apiService';

export async function getRoles() {
    const response = await api.get('/roles');

    return response.data;
}

