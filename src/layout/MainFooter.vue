<template>
  <footer
    class="footer"
    :class="{ [`footer-${type}`]: type }"
    :data-background-color="backgroundColor"
  >
      <div class="md-layout md-alignment-center-center" style="text-align: right;">
        <div class="md-layout-item md-size-80 md-xsmall-size-80">
          <div class="copyright">
            &copy; {{ year }}, with <md-icon>favorite</md-icon>&nbsp; <a href="https://www.brightblock.org">brightblock.org</a>
          </div>
        </div>
      </div>
  </footer>
</template>
<script>
export default {
  props: {
    backgroundColor: String,
    type: String
  },
  data() {
    return {
      year: new Date().getFullYear()
    };
  },
  methods: {}
};
</script>
