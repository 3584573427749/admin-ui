<script setup>
const model = defineModel({ default: false });

defineProps({
    title: {
        type: String,
        default: 'Bekräfta'
    },

    text: {
        type: String,
        required: true
    },

    confirmText: {
        type: String,
        default: 'OK'
    },

    cancelText: {
        type: String,
        default: 'Avbryt'
    },

    color: {
        type: String,
        default: 'error'
    }
});

const emit = defineEmits(['confirm']);

function confirm() {
    emit('confirm');
    model.value = false;
}

function cancel() {
    model.value = false;
}
</script>

<template>
    <v-dialog v-model="model" max-width="500">
        <v-card>
            <v-card-title>
                {{ title }}
            </v-card-title>

            <v-card-text>
                {{ text }}
            </v-card-text>

            <v-card-actions>
                <v-spacer />

                <v-btn variant="text" @click="cancel">
                    {{ cancelText }}
                </v-btn>

                <v-btn :color="color" @click="confirm">
                    {{ confirmText }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
`
