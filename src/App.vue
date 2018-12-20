<template>
  <div id="material-kit">
    <notifications position="bottom right" group="artwork-actions" />
    <div :class="{'nav-open': NavbarStore.showNavbar}">
      <router-view name="header"/>
      <div>
        <router-view/>
      </div>
      <router-view name="footer"/>
    </div>
  </div>
</template>
