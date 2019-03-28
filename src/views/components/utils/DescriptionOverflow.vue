<template>
<div>
  <div v-html="displayable"></div>
  <div v-if="overflow" class="muted">
    <a @click.prevent="truncated = !truncated" v-if="truncated">more..</a>
    <a @click.prevent="truncated = !truncated" v-else>less..</a>
  </div>

</div>
</template>

<script>

// noinspection JSUnusedGlobalSymbols
export default {
  name: "DescriptionOverflow",
  components: {
  },
  props: ["text"],
  data() {
    return {
      limit: 200,
      overflow: false,
      truncated: false
    };
  },
  mounted() {
    if (this.text && this.text.length > this.limit) {
      this.overflow = true;
      this.truncated = true;
    }
  },
  computed: {
    displayable() {
      if (this.overflow && this.truncated) {
        return this.text.substring(0, this.limit) + "...";
      } else {
        return this.text;
      }
    }
  },
  methods: {
  }
};
</script>
<style>

</style>
<style scoped>
</style>
