import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { mount } from '@vue/test-utils';

import ToastItem from '@/components/ToastItem.vue';

const mockRemove = vi.fn();

vi.mock('@/stores/notificationStore', () => ({
    useNotificationStore: () => ({
        remove: mockRemove
    })
}));

describe('ToastItem', () => {
    beforeEach(() => {
        setActivePinia(createPinia());

        vi.clearAllMocks();
    });

    it('renders message', () => {
        const wrapper = mount(ToastItem, {
            props: {
                toast: {
                    id: '1',
                    type: 'success',
                    message: 'Användaren sparades.',
                    duration: 3000
                }
            }
        });

        expect(wrapper.text()).toContain('Användaren sparades.');
    });

    it('removes toast when close button is clicked', async () => {
        const wrapper = mount(ToastItem, {
            props: {
                toast: {
                    id: '1',
                    type: 'success',
                    message: 'Användaren sparades.',
                    duration: 3000
                }
            }
        });

        await wrapper.find('.toast__close').trigger('click');

        expect(mockRemove).toHaveBeenCalledWith('1');
    });

    it('removes toast after duration', async () => {
        vi.useFakeTimers();

        const wrapper = mount(ToastItem, {
            props: {
                toast: {
                    id: '1',
                    type: 'success',
                    message: 'Användaren sparades.',
                    duration: 3000
                }
            }
        });

        expect(mockRemove).not.toHaveBeenCalled();
        vi.advanceTimersByTime(3000);

        expect(mockRemove).toHaveBeenCalledWith('1');
        wrapper.unmount();

        vi.useRealTimers();
    });

    it('pauses timer on hover', async () => {
        vi.useFakeTimers();

        const wrapper = mount(ToastItem, {
            props: {
                toast: {
                    id: '1',
                    type: 'success',
                    message: 'Användaren sparades.',
                    duration: 3000
                }
            }
        });

        await wrapper.trigger('mouseenter');
        vi.advanceTimersByTime(3000);

        expect(mockRemove).not.toHaveBeenCalled();
        wrapper.unmount();
        vi.useRealTimers();
    });

    it('resumes timer after hover', async () => {
        vi.useFakeTimers();

        const wrapper = mount(ToastItem, {
            props: {
                toast: {
                    id: '1',
                    type: 'success',
                    message: 'Användaren sparades.',
                    duration: 3000
                }
            }
        });

        // 1 sekund passerar
        vi.advanceTimersByTime(1000);
        // Pausa
        await wrapper.trigger('mouseenter');
        // Hur mycket tid som helst passerar
        vi.advanceTimersByTime(10000);

        expect(mockRemove).not.toHaveBeenCalled();
        // Återuppta
        await wrapper.trigger('mouseleave');
        // Det ska återstå 2 sekunder
        vi.advanceTimersByTime(1999);
        expect(mockRemove).not.toHaveBeenCalled();
        vi.advanceTimersByTime(1);
        expect(mockRemove).toHaveBeenCalledWith('1');

        wrapper.unmount();
        vi.useRealTimers();
    });
});
