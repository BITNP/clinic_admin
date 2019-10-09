<template>
  <v-dialog v-model="dialog" persistent max-width="500">
    <template v-slot:activator="{ on }">
      <v-btn
        id="fab"
        v-on="on"
        color="pink"
        dark
        absolute
        fixed
        bottom
        right
        fab
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </template>
    <NewRecordForm @toggle="dialog = false"></NewRecordForm>
  </v-dialog>
</template>

<script>
import NewRecordForm from "@/components/NewRecordForm";

export default {
  components: {
    NewRecordForm
  },
  data: () => ({
    dialog: false
  }),
  methods: {}
};
</script>

<style>
#fab {
  bottom: 40px;
}
</style>
