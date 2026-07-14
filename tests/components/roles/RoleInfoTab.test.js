import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { mount } from '@vue/test-utils';

import RoleInfoTab from '@/components/roles/RoleInfoTab.vue';
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

describe('RoleInfoTab', () => {
    beforeEach(() => {
        setActivePinia(createPinia());

        vi.clearAllMocks();
    });

    function createStore() {
        const store = useRoleStore();

        store.selectedRole = {
            id: 'role-1',
            name: 'Admin',
            description: 'Administrator',
            adminLevel: 100
        };

        store.roleUsers = [{ id: 'user-1' }, { id: 'user-2' }, { id: 'user-3' }];

        store.saveRole = vi.fn();
        store.deleteSelectedRole = vi.fn();
        store.createNewRole = vi.fn();

        return store;
    }

    function createWrapper() {
        return mount(RoleInfoTab, {
            global: {
                stubs: {
                    VTextField: {
                        template: '<input />'
                    },
                    VTextarea: {
                        template: '<textarea />'
                    },
                    VBtn: {
                        template: '<button @click="$emit(\'click\', $event)"><slot /></button>'
                    }
                }
            }
        });
    }

    it('shows number of users', () => {
        createStore();

        const wrapper = createWrapper();

        expect(wrapper.text()).toContain('Antal användare: 3');
    });

    it('calls saveRole when save button is clicked', async () => {
        const store = createStore();

        const wrapper = createWrapper();

        await wrapper.findAll('button')[0].trigger('click');

        expect(store.saveRole).toHaveBeenCalled();
    });

    it('calls createNewRole when new button is clicked', async () => {
        const store = createStore();

        const wrapper = createWrapper();

        await wrapper.findAll('button')[2].trigger('click');

        expect(store.createNewRole).toHaveBeenCalled();
    });

    it('calls deleteSelectedRole after confirmation', async () => {
        const store = createStore();

        store.deleteSelectedRole.mockResolvedValue('role-2');

        const wrapper = createWrapper();

        await wrapper.findAll('button')[1].trigger('click');

        await wrapper.find('.confirm-dialog').trigger('click');

        expect(store.deleteSelectedRole).toHaveBeenCalled();
    });

    it('navigates to next role after delete', async () => {
        const store = createStore();

        store.deleteSelectedRole.mockResolvedValue('role-2');

        const wrapper = createWrapper();

        await wrapper.findAll('button')[1].trigger('click');

        await wrapper.find('.confirm-dialog').trigger('click');

        expect(router.push).toHaveBeenCalledWith('/roller/role-2');
    });

    it('navigates to role list when no role remains', async () => {
        const store = createStore();

        store.deleteSelectedRole.mockResolvedValue(undefined);

        const wrapper = createWrapper();

        await wrapper.findAll('button')[1].trigger('click');

        await wrapper.find('.confirm-dialog').trigger('click');

        expect(router.push).toHaveBeenCalledWith('/roller');
    });
});
