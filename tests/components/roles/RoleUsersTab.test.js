import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { mount } from '@vue/test-utils';

import RoleUsersTab from '@/components/roles/RoleUsersTab.vue';
import { useRoleStore } from '@/stores/roleStore';

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

describe('RoleUsersTab', () => {
    beforeEach(() => {
        setActivePinia(createPinia());

        vi.clearAllMocks();
    });

    function createStore() {
        const store = useRoleStore();

        store.removeUserFromRole = vi.fn();

        return store;
    }

    it('shows empty message when role has no users', () => {
        const store = createStore();

        store.roleUsers = [];

        const wrapper = mount(RoleUsersTab, {
            global: {
                stubs: {
                    RouterLink: {
                        template: '<a><slot /></a>'
                    },
                    VBtn: {
                        template: '<button @click="$emit(\'click\')" />'
                    }
                }
            }
        });

        expect(wrapper.text()).toContain('Denna roll har inga användare.');
    });

    it('renders role users', () => {
        const store = createStore();

        store.roleUsers = [
            {
                id: 'user-1',
                firstName: 'Anna',
                lastName: 'Andersson',
                email: 'anna@example.com'
            }
        ];

        const wrapper = mount(RoleUsersTab, {
            global: {
                stubs: {
                    RouterLink: {
                        template: '<a><slot /></a>'
                    },
                    VBtn: {
                        template: '<button @click="$emit(\'click\')" />'
                    }
                }
            }
        });

        expect(wrapper.text()).toContain('Anna Andersson');

        expect(wrapper.text()).toContain('anna@example.com');
    });

    it('renders link to user page', () => {
        const store = useRoleStore();

        store.roleUsers = [
            {
                id: 'user-1',
                firstName: 'Anna',
                lastName: 'Andersson',
                email: 'anna@example.com'
            }
        ];

        const wrapper = mount(RoleUsersTab, {
            global: {
                stubs: {
                    RouterLink: {
                        props: ['to'],
                        template: `
                            <span
                                class="router-link"
                                :data-to="to"
                            >
                            <slot />
                        </span>
                        `
                    },
                    VBtn: {
                        template: '<button @click="$emit(\'click\')" />'
                    }
                }
            }
        });

        const link = wrapper.find('.router-link');

        expect(link.attributes('data-to')).toBe('/anvandare/user-1');
    });
    it('opens dialog when delete button is clicked', async () => {
        const store = createStore();

        store.roleUsers = [
            {
                id: 'user-1',
                firstName: 'Anna',
                lastName: 'Andersson',
                email: 'anna@example.com'
            }
        ];

        const wrapper = mount(RoleUsersTab, {
            global: {
                stubs: {
                    RouterLink: {
                        template: '<a><slot /></a>'
                    },
                    VBtn: {
                        template: '<button @click="$emit(\'click\')" />'
                    }
                }
            }
        });

        await wrapper.find('button').trigger('click');

        expect(wrapper.findComponent('.confirm-dialog').exists()).toBe(true);
    });

    it('removes user after confirmation', async () => {
        const store = createStore();

        store.roleUsers = [
            {
                id: 'user-1',
                firstName: 'Anna',
                lastName: 'Andersson',
                email: 'anna@example.com'
            }
        ];

        const wrapper = mount(RoleUsersTab, {
            global: {
                stubs: {
                    RouterLink: true,
                    VBtn: {
                        template: '<button @click="$emit(\'click\')" />'
                    }
                }
            }
        });

        // Klick på papperskorgen
        await wrapper.find('button').trigger('click');

        // Bekräfta dialogen
        await wrapper.find('.confirm-dialog').trigger('click');

        expect(store.removeUserFromRole).toHaveBeenCalledWith('user-1');
    });
});
