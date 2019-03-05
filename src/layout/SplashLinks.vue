<template>
  <div>
    <div class="mb-4"></div>
    <li class="nav-item ripple-parent">
    <router-link to="/" name="sectionUrl('AboutSection')" class="nav-link navbar-link">About</router-link>
  </li>
    <li class="nav-item ripple-parent">
      <router-link to="/" name="sectionUrl('TeamSectionSection')" class="nav-link navbar-link">Team</router-link>
    </li>
    <li class="nav-item ripple-parent">
      <router-link to="/" name="sectionUrl('ContactSection')" class="nav-link navbar-link">Contact</router-link>
    </li>
  </div>
</template>
<script>
  export default {
    name: 'SplashLinks',
    methods: {
      scrollToElement(element, event) {
        let domain = location.href;
        let element_id = document.getElementById(element);
        if (element_id) {
          element_id.scrollIntoView({ block: "start", behavior: "smooth" });
        }
      },
    }
  }
</script>
