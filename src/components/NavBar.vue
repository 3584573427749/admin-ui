<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const props = defineProps({
    items: {
        type: Array,
        required: true
    }
});

const emit = defineEmits(['navigate']);

const openMenu = ref(null);

const hasHover = window.matchMedia('(hover: hover)').matches;

function isActive(item) {
    if (item.route && route.path === item.route) {
        return true;
    }

    if (item.subItems) {
        return item.subItems.some((subItem) => subItem.route === route.path);
    }

    return false;
}

function navigate(route) {
    if (route) {
        emit('navigate', route);
    }
}

function handleTopLevelClick(item) {
    const hasRoute = !!item.route;
    const hasSubMenu = item.subItems?.length > 0;

    // Vanlig länk
    if (hasRoute && !hasSubMenu) {
        navigate(item.route);
        return;
    }

    // Menygrupp
    if (!hasRoute && hasSubMenu) {
        if (!hasHover) {
            toggleMenu(item.label);
        }

        return;
    }

    // Hybrid
    if (hasRoute && hasSubMenu) {
        if (hasHover) {
            navigate(item.route);
            return;
        }

        if (openMenu.value !== item.label) {
            openMenu.value = item.label;
            return;
        }

        navigate(item.route);
    }
}

function toggleMenu(label) {
    openMenu.value = openMenu.value === label ? null : label;
}

function openHoverMenu(label) {
    if (hasHover) {
        openMenu.value = label;
    }
}

function closeHoverMenu(label) {
    if (hasHover && openMenu.value === label) {
        openMenu.value = null;
    }
}

function closeAllMenus() {
    openMenu.value = null;
}
</script>

<template>
    <nav class="nav-bar">
        <div
            v-for="item in items"
            :key="item.label"
            class="nav-bar__item"
            @mouseenter="openHoverMenu(item.label)"
            @mouseleave="closeHoverMenu(item.label)"
        >
            <button
                :class="[
                    'nav-bar__button',
                    {
                        'nav-bar__button--active': isActive(item)
                    }
                ]"
                @click="handleTopLevelClick(item)"
            >
                {{ item.label }}

                <span v-if="item.subItems?.length" class="nav-bar__arrow"> ▼ </span>
            </button>

            <div
                v-if="item.subItems?.length"
                v-show="openMenu === item.label"
                class="nav-bar__submenu"
            >
                <template v-for="subItem in item.subItems" :key="`${item.label}-${subItem.label}`">
                    <div v-if="subItem.label === '-'" class="nav-bar__separator" />

                    <button
                        v-else
                        :class="[
                            'nav-bar__submenu-item',
                            {
                                'nav-bar__submenu-item--active': subItem.route === route.path
                            }
                        ]"
                        @click="
                            navigate(subItem.route);
                            closeAllMenus();
                        "
                    >
                        {{ subItem.label }}
                    </button>
                </template>
            </div>
        </div>
    </nav>
</template>

<style scoped>
.nav-bar {
    display: flex;
}

.nav-bar__item {
    position: relative;
}

.nav-bar__button {
    display: flex;
    align-items: center;
    justify-content: space-between;

    min-width: 10rem;

    padding: 0.75rem 1rem;

    background-color: var(--color-background);

    cursor: pointer;

    transition:
        background-color 0.15s,
        color 0.15s;
}

.nav-bar__button:hover {
    background-color: var(--color-list-row-dark);
}

.nav-bar__button--active {
    background-color: var(--color-primary);
    color: white;
}

.nav-bar__arrow {
    margin-left: 0.5rem;
    font-size: 0.7rem;
}

.nav-bar__submenu {
    position: absolute;

    top: 100%;
    left: 0;

    min-width: 14rem;

    background-color: var(--color-background);

    border: 1px solid var(--color-border);

    box-shadow: 0 4px 10px rgb(0 0 0 / 15%);

    z-index: 1000;
}

.nav-bar__submenu-item {
    display: block;

    width: 100%;

    padding: 0.75rem 1rem;

    text-align: left;

    background-color: var(--color-background);
    color: var(--color-text);

    border: none;

    cursor: pointer;

    transition:
        background-color 0.15s,
        color 0.15s;
}

.nav-bar__submenu-item:hover {
    background-color: var(--color-list-row-dark);
}

.nav-bar__submenu-item--active {
    background-color: var(--color-primary);
    color: white;
}

.nav-bar__separator {
    height: 1px;

    margin: 0.25rem 0;

    background-color: var(--color-border);
}
</style>
