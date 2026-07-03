import { beforeEach, describe, expect, it } from 'vitest';

import { createPinia, setActivePinia } from 'pinia';

import { useNotificationStore } from '@/stores/notificationStore';

describe('notificationStore', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });

    it('adds a success toast', () => {
        const store = useNotificationStore();

        store.success('Operationen lyckades.');

        expect(store.toasts).toHaveLength(1);

        expect(store.toasts[0].type).toBe('success');
        expect(store.toasts[0].message).toBe('Operationen lyckades.');
    });
    it('adds an error toast from string', () => {
        const store = useNotificationStore();

        store.error('Något gick fel.');

        expect(store.toasts).toHaveLength(1);

        expect(store.toasts[0].type).toBe('error');
        expect(store.toasts[0].message).toBe('Något gick fel.');
    });
    it('extracts message from OpenAPI error response', () => {
        const store = useNotificationStore();

        store.error({
            statusCode: 404,
            error: {
                type: 'UserNotFound',
                message: 'Användaren kunde inte hittas.'
            }
        });

        expect(store.toasts[0].message).toBe('Användaren kunde inte hittas.');
    });
    it('formats OpenAPI validation details', () => {
        const store = useNotificationStore();

        store.error({
            statusCode: 422,
            error: {
                type: 'ValidationError',
                message: 'Validering misslyckades.',
                details: {
                    email: 'Ogiltig e-postadress',
                    firstName: 'Minst 2 tecken'
                }
            }
        });

        expect(store.toasts[0].message).toContain('Validering misslyckades.');

        expect(store.toasts[0].message).toContain('email: Ogiltig e-postadress');

        expect(store.toasts[0].message).toContain('firstName: Minst 2 tecken');
    });

    it('removes a toast', () => {
        const store = useNotificationStore();

        const id = store.success('Operationen lyckades.');

        expect(store.toasts).toHaveLength(1);

        store.remove(id);

        expect(store.toasts).toHaveLength(0);
    });
});
