import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { mount } from '@vue/test-utils';

import UserInfoTab from '@/components/users/UserInfoTab.vue';
import { useUserStore } from '@/stores/userStore';
import { useRoleStore } from '@/stores/roleStore';
import router from '@/router';

vi.mock('@/router', () => ({
    default: {
        push: vi.fn()
    }
}));

vi.mock('@/components/ConfirmDialog.vue', () => ({
    default: {
        template: `
            <div
                class="confirm-dialog"
                @click="$emit('confirm')"
            />
        `,
        emits: ['confirm', 'update:modelValue'],
        props: ['modelValue', 'title', 'text', 'confirmText']
    }
}));

describe('UserInfoTab', () => {
    beforeEach(() => {
        setActivePinia(createPinia());

        vi.clearAllMocks();
    });

    function createStores() {
        const userStore = useUserStore();
        const roleStore = useRoleStore();

        userStore.selectedUser = {
            id: 'user-1',
            email: 'anna@example.com',
            firstName: 'Anna',
            lastName: 'Andersson',
            roles: ['role-1']
        };

        userStore.saveUser = vi.fn();
        userStore.deleteSelectedUser = vi.fn();
        userStore.createNewUser = vi.fn();

        roleStore.roles = [
            {
                id: 'role-1',
                name: 'Admin'
            },
            {
                id: 'role-2',
                name: 'User'
            }
        ];

        roleStore.loadRoles = vi.fn();

        return {
            userStore,
            roleStore
        };
    }

    function createWrapper() {
        return mount(UserInfoTab, {
            global: {
                stubs: {
                    VWindowItem: {
                        template: '<div><slot /></div>'
                    },
                    VTextField: {
                        template: '<input />'
                    },
                    VCheckbox: {
                        template: '<input type="checkbox" />'
                    },
                    VBtn: {
                        template: '<button @click="$emit(\'click\', $event)"><slot /></button>'
                    }
                }
            }
        });
    }

    it('loads roles on mount', () => {
        const { roleStore } = createStores();

        createWrapper();

        expect(roleStore.loadRoles).toHaveBeenCalled();
    });

    it('renders available roles', () => {
        createStores();

        const wrapper = createWrapper();

        expect(wrapper.text()).toContain('Roller');
    });

    it('calls createNewUser when New button is clicked', async () => {
        const { userStore } = createStores();

        const wrapper = createWrapper();

        const buttons = wrapper.findAll('button');

        await buttons[2].trigger('click');

        expect(userStore.createNewUser).toHaveBeenCalled();
    });

    it('calls saveUser when Save button is clicked', async () => {
        const { userStore } = createStores();

        const wrapper = createWrapper();

        const buttons = wrapper.findAll('button');

        await buttons[0].trigger('click');

        expect(userStore.saveUser).toHaveBeenCalled();
    });

    it('navigates to user after save', async () => {
        const { userStore } = createStores();

        userStore.saveUser.mockResolvedValue();

        const wrapper = createWrapper();

        const buttons = wrapper.findAll('button');

        await buttons[0].trigger('click');

        expect(router.push).toHaveBeenCalledWith('/anvandare/user-1');
    });

    it('calls deleteSelectedUser after confirmation', async () => {
        const { userStore } = createStores();

        userStore.deleteSelectedUser.mockResolvedValue('user-2');

        const wrapper = createWrapper();

        const buttons = wrapper.findAll('button');

        await buttons[1].trigger('click');

        await wrapper.find('.confirm-dialog').trigger('click');

        expect(userStore.deleteSelectedUser).toHaveBeenCalled();
    });

    it('navigates to next user after delete', async () => {
        const { userStore } = createStores();

        userStore.deleteSelectedUser.mockResolvedValue('user-2');

        const wrapper = createWrapper();

        const buttons = wrapper.findAll('button');

        await buttons[1].trigger('click');

        await wrapper.find('.confirm-dialog').trigger('click');

        expect(router.push).toHaveBeenCalledWith('/anvandare/user-2');
    });

    it('navigates to user list when no user remains', async () => {
        const { userStore } = createStores();

        userStore.deleteSelectedUser.mockResolvedValue(undefined);

        const wrapper = createWrapper();

        const buttons = wrapper.findAll('button');

        await buttons[1].trigger('click');

        await wrapper.find('.confirm-dialog').trigger('click');

        expect(router.push).toHaveBeenCalledWith('/anvandare');
    });
});
