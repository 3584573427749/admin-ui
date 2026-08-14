import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';

import { useRoleStore } from '@/stores/roleStore';

import * as roleService from '@/services/roleService';
import { useNotificationStore } from '@/stores/notificationStore';

const mockSuccess = vi.fn();
const mockError = vi.fn();

vi.mock('@/services/roleService', () => ({
    getRoles: vi.fn(),
    getRole: vi.fn(),
    createRole: vi.fn(),
    updateRole: vi.fn(),
    deleteRole: vi.fn(),
    getRoleUsers: vi.fn(),
    removeRoleUser: vi.fn()
}));

vi.mock('@/stores/notificationStore', () => ({
    useNotificationStore: () => ({
        success: mockSuccess,
        error: mockError
    })
}));

describe('roleStore', () => {
    beforeEach(() => {
        setActivePinia(createPinia());

        vi.clearAllMocks();
    });

    it('creates a new role with default values', () => {
        const store = useRoleStore();

        store.createNewRole();

        expect(store.selectedRole.id).toBeNull();
        expect(store.selectedRole.name).toBe('');
        expect(store.selectedRole.description).toBe('');
        expect(store.selectedRole.adminLevel).toBe(0);
    });

    it('selects a role', async () => {
        const store = useRoleStore();

        const role = {
            id: 'role-1',
            name: 'Admin',
            description: 'Administrator',
            adminLevel: 100
        };

        roleService.getRoleUsers.mockResolvedValue([]);

        await store.selectRole(role);

        expect(store.selectedRole.id).toBe('role-1');
        expect(store.selectedRole.name).toBe('Admin');
    });

    it('creates a copy when selecting a role', async () => {
        const store = useRoleStore();

        const role = {
            id: 'role-1',
            name: 'Admin',
            description: 'Administrator',
            adminLevel: 100
        };

        roleService.getRoleUsers.mockResolvedValue([]);

        await store.selectRole(role);

        store.selectedRole.name = 'Changed';

        expect(role.name).toBe('Admin');
    });

    it('loads roles and sorts by adminLevel descending', async () => {
        const store = useRoleStore();

        roleService.getRoles.mockResolvedValue([
            {
                id: 'role-1',
                name: 'User',
                adminLevel: 1
            },
            {
                id: 'role-2',
                name: 'Admin',
                adminLevel: 100
            }
        ]);

        roleService.getRoleUsers.mockResolvedValue([]);

        await store.loadRoles();

        expect(store.roles[0].name).toBe('Admin');
        expect(store.roles[1].name).toBe('User');
    });

    it('loads role users when selecting a role', async () => {
        const store = useRoleStore();

        const role = {
            id: 'role-1',
            name: 'Admin'
        };

        roleService.getRoleUsers.mockResolvedValue([]);

        await store.selectRole(role);

        expect(roleService.getRoleUsers).toHaveBeenCalledWith('role-1');
    });

    it('loads role and users', async () => {
        const store = useRoleStore();

        roleService.getRole.mockResolvedValue({
            id: 'role-1',
            name: 'Admin'
        });

        roleService.getRoleUsers.mockResolvedValue([
            {
                id: 'user-1',
                firstName: 'Anna'
            }
        ]);

        await store.loadRole('role-1');

        expect(roleService.getRole).toHaveBeenCalledWith('role-1');

        expect(roleService.getRoleUsers).toHaveBeenCalledWith('role-1');

        expect(store.roleUsers).toHaveLength(1);
    });

    it('removes user from role', async () => {
        const store = useRoleStore();

        store.selectedRole.id = 'role-1';

        roleService.removeRoleUser.mockResolvedValue();
        roleService.getRoleUsers.mockResolvedValue([]);

        await store.removeUserFromRole('user-1');

        expect(roleService.removeRoleUser).toHaveBeenCalledWith('role-1', 'user-1');

        expect(mockSuccess).toHaveBeenCalledWith('Användaren togs bort från rollen.');
    });
    it('creates a new role', async () => {
        const store = useRoleStore();

        const role = {
            id: 'role-1',
            name: 'Admin',
            description: 'Administrator',
            adminLevel: 100
        };

        roleService.createRole.mockResolvedValue(role);
        roleService.getRoles.mockResolvedValue([]);

        store.createNewRole();

        store.selectedRole.name = 'Admin';
        store.selectedRole.description = 'Administrator';
        store.selectedRole.adminLevel = 100;

        await store.saveRole();

        expect(roleService.createRole).toHaveBeenCalledOnce();

        expect(mockSuccess).toHaveBeenCalledWith('Rollen skapades.');

        expect(store.selectedRole).toMatchObject(role);
    });
    it('updates an existing role', async () => {
        const store = useRoleStore();

        const role = {
            id: 'role-1',
            name: 'Admin',
            description: 'Administrator',
            adminLevel: 100
        };

        await store.selectRole(role);

        roleService.updateRole.mockResolvedValue(role);
        roleService.getRoles.mockResolvedValue([]);
        roleService.getRoleUsers.mockResolvedValue([]);

        await store.saveRole();

        expect(roleService.updateRole).toHaveBeenCalledOnce();

        expect(roleService.createRole).not.toHaveBeenCalled();

        expect(mockSuccess).toHaveBeenCalledWith('Rollen uppdaterades.');
    });
    it('deletes the selected role', async () => {
        const store = useRoleStore();

        const role = {
            id: 'role-1',
            name: 'Admin',
            description: 'Administrator',
            adminLevel: 100
        };

        await store.selectRole(role);

        roleService.deleteRole.mockResolvedValue();
        roleService.getRoles.mockResolvedValue([]);

        const result = await store.deleteSelectedRole();

        expect(roleService.deleteRole).toHaveBeenCalledWith('role-1');

        expect(mockSuccess).toHaveBeenCalledWith('Rollen togs bort.');

        expect(store.selectedRole.id).toBeNull();

        expect(result).toBeNull();
    });
    it('does nothing when deleting a new role', async () => {
        const store = useRoleStore();

        store.createNewRole();

        await store.deleteSelectedRole();

        expect(roleService.deleteRole).not.toHaveBeenCalled();
    });
});
