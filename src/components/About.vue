<template>
  <v-container>
    <h2>v{{ version }}</h2>
    <v-timeline>
      <v-timeline-item
        v-for="(c, i) in changeLog"
        :key="i"
        :color="c.color"
        :small="c.scale == 'small'"
        :large="c.scale == 'large'"
      >
        <span slot="opposite">{{ c.dateTime }}</span>
        <v-card class="elevation-2">
          <v-card-title class="headline">{{ c.version }}</v-card-title>
          <v-card-text>
            <v-list subheader one-line>
              <v-list-item v-for="(item, ind) in c.change" :key="ind">
                <v-list-item-content>
                  <v-list-item-title>
                    {{ Object.keys(item)[0] }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ Object.values(item)[0] }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-timeline-item>
    </v-timeline>
  </v-container>
</template>

<script>
export default {
  computed: {
    version() {
      return this.changeLog[0].version;
    },
    changeLog() {
      return this.$store.state.about.changeLog;
    }
  }
};
</script>

<style></style>
