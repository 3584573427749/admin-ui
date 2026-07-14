import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';

import ConfirmDialog from '@/components/ConfirmDialog.vue';

import { vuetifyStubs } from '../helpers/mountWithVuetifyStubs';

describe('ConfirmDialog', () => {
    function createWrapper(props = {}) {
        return mount(ConfirmDialog, {
            props: {
                modelValue: true,
                text: 'Testtext',
                ...props
            },
            global: {
                stubs: vuetifyStubs
            }
        });
    }

    it('renders title and text', () => {
        const wrapper = createWrapper({
            title: 'Radera användare',
            text: 'Är du säker?'
        });

        expect(wrapper.text()).toContain('Radera användare');
        expect(wrapper.text()).toContain('Är du säker?');
    });

    it('renders custom button texts', () => {
        const wrapper = createWrapper({
            confirmText: 'Ta bort',
            cancelText: 'Nej'
        });

        expect(wrapper.text()).toContain('Ta bort');
        expect(wrapper.text()).toContain('Nej');
    });

    it('emits confirm when confirm button is clicked', async () => {
        const wrapper = createWrapper();

        const buttons = wrapper.findAll('button');

        expect(buttons).toHaveLength(2);

        await buttons[1].trigger('click');

        expect(wrapper.emitted('confirm')).toBeTruthy();
    });

    it('emits update:modelValue when confirm button is clicked', async () => {
        const wrapper = createWrapper();

        const buttons = wrapper.findAll('button');

        await buttons[1].trigger('click');

        expect(wrapper.emitted('update:modelValue')).toEqual([[false]]);
    });

    it('emits update:modelValue when cancel button is clicked', async () => {
        const wrapper = createWrapper();

        const buttons = wrapper.findAll('button');

        await buttons[0].trigger('click');

        expect(wrapper.emitted('update:modelValue')).toEqual([[false]]);
    });

    it('uses default texts', () => {
        const wrapper = createWrapper();

        expect(wrapper.text()).toContain('Bekräfta');
        expect(wrapper.text()).toContain('OK');
        expect(wrapper.text()).toContain('Avbryt');
    });
});
