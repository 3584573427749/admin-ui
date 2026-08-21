import { beforeEach, describe, expect, it, vi } from 'vitest';

import { api } from '@/services/apiService';
import * as roleService from '@/services/roleService';

vi.mock('@/services/apiService', () => ({
    api: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn()
    }
}));

describe('roleService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('gets all roles', async () => {
        api.get.mockResolvedValue({
            data: []
        });

        await roleService.getRoles();

        expect(api.get).toHaveBeenCalledWith('/auth/roles');
    });

    it('gets a role', async () => {
        api.get.mockResolvedValue({
            data: {}
        });

        await roleService.getRole('role-1');

        expect(api.get).toHaveBeenCalledWith('/auth/roles/role-1');
    });

    it('creates a role', async () => {
        const role = {
            name: 'Admin',
            description: 'Administrator',
            adminLevel: 100
        };

        api.post.mockResolvedValue({
            data: role
        });

        await roleService.createRole(role);

        expect(api.post).toHaveBeenCalledWith('/auth/roles', role);
    });

    it('updates a role', async () => {
        const role = {
            id: 'role-1',
            name: 'Admin',
            description: 'Administrator',
            adminLevel: 100
        };

        api.put.mockResolvedValue({
            data: role
        });

        await roleService.updateRole('role-1', role);

        expect(api.put).toHaveBeenCalledWith('/auth/roles/role-1', role);
    });

    it('deletes a role', async () => {
        api.delete.mockResolvedValue();

        await roleService.deleteRole('role-1');

        expect(api.delete).toHaveBeenCalledWith('/auth/roles/role-1');
    });

    it('gets users for a role', async () => {
        api.get.mockResolvedValue({
            data: []
        });

        await roleService.getRoleUsers('role-1');

        expect(api.get).toHaveBeenCalledWith('/auth/roles/role-1/users');
    });

    it('removes a user from a role', async () => {
        api.delete.mockResolvedValue();

        await roleService.removeRoleUser('role-1', 'user-1');

        expect(api.delete).toHaveBeenCalledWith('/auth/users/user-1/roles/role-1');
    });

    it('returns roles from getRoles', async () => {
        const roles = [{ id: 'role-1' }];

        api.get.mockResolvedValue({
            data: roles
        });

        const result = await roleService.getRoles();

        expect(result).toEqual(roles);
    });

    it('returns role from getRole', async () => {
        const role = {
            id: 'role-1'
        };

        api.get.mockResolvedValue({
            data: role
        });

        const result = await roleService.getRole('role-1');

        expect(result).toEqual(role);
    });
});
