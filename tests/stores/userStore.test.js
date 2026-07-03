import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useUserStore } from '@/stores/userStore';
import * as userService from '@/services/userService';
import { useNotificationStore } from '@/stores/notificationStore';
const mockSuccess = vi.fn();

vi.mock('@/services/userService', () => ({
    getUsers: vi.fn(),
    getUser: vi.fn(),
    createUser: vi.fn(),
    updateUser: vi.fn(),
    deleteUser: vi.fn()
}));

vi.mock('@/stores/notificationStore', () => ({
    useNotificationStore: () => ({
        success: mockSuccess,
        error: vi.fn()
    })
}));
const USER = {
    id: '019ea89c-e194-71b3-b05a-1fd8b0769ec1',
    email: 'anna@example.com',
    firstName: 'Anna',
    lastName: 'Andersson',
    roles: ['user'],
    updatedAt: null,
    createdAt: '2026-07-03T10:30:00+00:00'
};
const USERS = [
    USER,
    {
        ...USER,
        id: '019ea89c-e194-71b3-b05a-1fd8b0769ec2',
        email: 'kalle@example.com',
        firstName: 'Kalle',
        lastName: 'Kula'
    }
];
const UPDATE_USER_REQUEST = {
    id: USER.id,
    email: USER.email,
    firstName: USER.firstName,
    lastName: USER.lastName,
    isActive: true,
    createdAt: USER.createdAt,
    updatedAt: USER.updatedAt
};
describe('userStore', () => {
    beforeEach(() => {
        setActivePinia(createPinia());

        vi.clearAllMocks();
    });

    it('creates a new user with default values', () => {
        const store = useUserStore();

        store.createNewUser();

        expect(store.selectedUser.id).toBeNull();
        expect(store.selectedUser.email).toBe('');
        expect(store.selectedUser.firstName).toBe('');
        expect(store.selectedUser.lastName).toBe('');
        expect(store.selectedUser.roles).toEqual([]);
        expect(store.selectedUser.active).toBe(true);
    });

    it('selects a user', () => {
        const store = useUserStore();

        store.selectUser(USER);

        expect(store.selectedUser.id).toBe('019ea89c-e194-71b3-b05a-1fd8b0769ec1');
        expect(store.selectedUser.firstName).toBe('Anna');
    });

    it('creates a copy when selecting a user', () => {
        const store = useUserStore();

        store.selectUser(USER);
        store.selectedUser.firstName = 'Kalle';

        expect(USER.firstName).toBe('Anna');
    });

    it('loads users', async () => {
        const store = useUserStore();

        userService.getUsers.mockResolvedValue(USERS);
        await store.loadUsers();

        expect(store.users).toHaveLength(2);
    });

    it('selects first user after load', async () => {
        const store = useUserStore();

        userService.getUsers.mockResolvedValue(USERS);
        await store.loadUsers();

        expect(store.selectedUser.id).toBe('019ea89c-e194-71b3-b05a-1fd8b0769ec1');
    });

    it('creates a new user', async () => {
        const store = useUserStore();

        userService.createUser.mockResolvedValue(USER);
        userService.getUsers.mockResolvedValue([]);
        store.createNewUser();
        store.selectedUser.email = 'anna@example.com';
        store.selectedUser.firstName = 'Anna';
        store.selectedUser.lastName = 'Andersson';
        await store.saveUser();

        expect(userService.createUser).toHaveBeenCalledOnce();
        expect(mockSuccess).toHaveBeenCalledWith('Användaren skapades.');
        expect(store.selectedUser).toMatchObject(USER);
    });

    it('updates an existing user', async () => {
        const store = useUserStore();

        store.selectUser(USER);
        userService.updateUser.mockResolvedValue(USER);
        userService.getUsers.mockResolvedValue([]);
        await store.saveUser();

        expect(userService.updateUser).toHaveBeenCalledOnce();
        expect(userService.updateUser).toHaveBeenCalledWith(USER.id, UPDATE_USER_REQUEST);
        expect(userService.createUser).not.toHaveBeenCalled();
        expect(mockSuccess).toHaveBeenCalledWith('Användaren uppdaterades.');
    });

    it('deletes the selected user', async () => {
        const store = useUserStore();

        store.selectUser(USER);
        userService.deleteUser.mockResolvedValue();
        userService.getUsers.mockResolvedValue([]);
        await store.deleteSelectedUser();

        expect(userService.deleteUser).toHaveBeenCalledWith(USER.id);
        expect(mockSuccess).toHaveBeenCalledWith('Användaren togs bort.');
        expect(store.selectedUser.id).toBeNull();
        expect(store.selectedUser.email).toBe('');
        expect(store.selectedUser.firstName).toBe('');
        expect(store.selectedUser.lastName).toBe('');
    });

    it('does nothing when deleting a new user', async () => {
        const store = useUserStore();

        store.createNewUser();
        await store.deleteSelectedUser();

        expect(userService.deleteUser).not.toHaveBeenCalled();
    });
});
