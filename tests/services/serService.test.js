import { beforeEach, describe, expect, it, vi } from 'vitest';

import { api } from '@/services/apiService';
import * as userService from '@/services/userService';

vi.mock('@/services/apiService', () => ({
    api: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn()
    }
}));

describe('userService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('gets all users', async () => {
        api.get.mockResolvedValue({
            data: []
        });

        await userService.getUsers();

        expect(api.get).toHaveBeenCalledWith('/auth/users');
    });

    it('gets a user', async () => {
        api.get.mockResolvedValue({
            data: {}
        });

        await userService.getUser('user-1');

        expect(api.get).toHaveBeenCalledWith('/auth/users/user-1');
    });

    it('creates a user', async () => {
        const user = {
            email: 'anna@example.com',
            firstName: 'Anna',
            lastName: 'Andersson'
        };

        api.post.mockResolvedValue({
            data: user
        });

        await userService.createUser(user);

        expect(api.post).toHaveBeenCalledWith('/auth/users', user);
    });

    it('updates a user', async () => {
        const user = {
            id: 'user-1',
            email: 'anna@example.com',
            firstName: 'Anna',
            lastName: 'Andersson'
        };

        api.put.mockResolvedValue({
            data: user
        });

        await userService.updateUser('user-1', user);

        expect(api.put).toHaveBeenCalledWith('/auth/users/user-1', user);
    });

    it('deletes a user', async () => {
        api.delete.mockResolvedValue();

        await userService.deleteUser('user-1');

        expect(api.delete).toHaveBeenCalledWith('/auth/users/user-1');
    });

    it('returns users from getUsers', async () => {
        const users = [{ id: 'user-1' }];

        api.get.mockResolvedValue({
            data: users
        });

        const result = await userService.getUsers();

        expect(result).toEqual(users);
    });

    it('returns user from getUser', async () => {
        const user = {
            id: 'user-1'
        };

        api.get.mockResolvedValue({
            data: user
        });

        const result = await userService.getUser('user-1');

        expect(result).toEqual(user);
    });

    it('returns created user from createUser', async () => {
        const user = {
            id: 'user-1'
        };

        api.post.mockResolvedValue({
            data: user
        });

        const result = await userService.createUser(user);

        expect(result).toEqual(user);
    });

    it('returns updated user from updateUser', async () => {
        const user = {
            id: 'user-1'
        };

        api.put.mockResolvedValue({
            data: user
        });

        const result = await userService.updateUser('user-1', user);

        expect(result).toEqual(user);
    });
});
