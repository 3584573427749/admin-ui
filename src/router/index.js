import { createRouter, createWebHistory } from 'vue-router';

import AppLayout from '@/layouts/AppLayout.vue';
import LoginView from '@/views/LoginView.vue';
import HomeView from '@/views/HomeView.vue';
import AboutView from '@/views/AboutView.vue';
import NotFoundView from '@/views/404View.vue';

import { registerAuthGuard } from './guard';

export const router = createRouter({
    history: createWebHistory(),
    routes: [
        // Login – ligger utanför app-layouten
        {
            path: '/login',
            name: 'login',
            component: LoginView
        },

        // App-layout – alla inloggade vyer
        {
            path: '/',
            component: AppLayout,
            //           meta: { requiresAuth: true },
            children: [
                {
                    path: '',
                    name: 'home',
                    component: HomeView
                },
                {
                    path: 'anvandare',
                    name: 'users',
                    component: () => import('../views/UsersView.vue')
                },
                {
                    path: 'anvandare/:id',
                    name: 'user',
                    component: () => import('../views/UsersView.vue')
                },
                {
                    path: 'roller',
                    name: 'roles',
                    component: () => import('../views/RolesView.vue')
                },
                {
                    path: 'roller/:id',
                    name: 'role',
                    component: () => import('../views/RolesView.vue')
                },
                {
                    path: 'anvandare/raderade',
                    name: 'deletedusers',
                    component: () => import('../views/DeletedUsersView.vue')
                },
                {
                    path: 'gruppniva',
                    name: 'grouplevels',
                    component: () => import('../views/GroupLevelsView.vue')
                },
                {
                    path: 'gruppniva/:id',
                    name: 'grouplevel',
                    component: () => import('../views/GroupLevelsView.vue')
                },
                {
                    path: 'grupp',
                    name: 'groups',
                    component: () => import('../views/GroupsView.vue')
                },
                {
                    path: 'grupp/:id',
                    name: 'group',
                    component: () => import('../views/GroupsView.vue')
                },
                {
                    path: 'about',
                    name: 'about',
                    component: AboutView
                },
                {
                    path: '/:pathMatch(.*)*',
                    name: 'notFound',
                    component: NotFoundView
                }
            ]
        }
    ]
});

// Global auth-guard (redan byggd)
registerAuthGuard(router);

export default router;
