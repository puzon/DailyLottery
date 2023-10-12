<script setup>
import {ref} from "vue";

const emit = defineEmits(['add']);

let dialog = ref(false);
let participantName = ref('');
const participantNameRules = [
  (value) => {
    if (value && value.length > 2) {
      return true;
    }

    return 'Name must have at least 3 characters';
  }
];

const submit = async (event) => {
  const results = await event;
  if (results.valid) {
    emit('add', participantName.value)
    participantName.value = '';
    dialog.value = false;
  }
}
</script>

<template>
  <v-dialog
      v-model="dialog"
      persistent
      width="1024"
  >
    <template v-slot:activator="{ props }">
      <slot name="activator" :props="props">
        <v-btn icon="mdi-plus" size="large" elevation="8" color="primary" v-bind="props"></v-btn>
      </slot>
    </template>
    <v-card>
      <v-card-title>
        <span class="text-h5">Dodaj uczestnika</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-form id="form" @submit.prevent="submit">
            <v-row>
              <v-col
                  cols="12"
              >
                <v-text-field
                    label="Imię*"
                    :rules="participantNameRules"
                    v-model="participantName"
                    required
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
            color="blue-darken-1"
            variant="text"
            @click="dialog = false"
        >
          Anuluj
        </v-btn>
        <v-btn
            type="submit"
            form="form"
            color="blue-darken-1"
            variant="text"
        >
          Dodaj
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>

</style>
