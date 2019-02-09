import Vue from "vue";
import Router from "vue-router";

import Admin from "./views/Admin.vue";
import AdminSettings from "./views/components/admin/AdminSettings";
import AdminRegistrations from "./views/components/admin/AdminRegistrations";
import AdminBuildIndex from "./views/components/admin/AdminBuildIndex";
import AdminQueryIndex from "./views/components/admin/AdminQueryIndex";

import Home from "./views/Home.vue";
import Index from "./views/Index.vue";
import Landing from "./views/Landing.vue";
import Gallery from "./views/Gallery.vue";
import Artist from "./views/Artist.vue";
import Artists from "./views/Artists.vue";
import Login from "./views/Login.vue";
import Profile from "./views/Profile.vue";
import TeamProfile from "./views/TeamProfile.vue";
import Navbar from "./layout/Navbar.vue";
import NavbarSplash from "./layout/NavbarSplash.vue";
import Footer from "./layout/Footer.vue";

import Artwork from "./views/Artwork";

import Search from "./views/Search";

import MyArtworks from "./views/MyArtworks";
import RegisterArtwork from "./views/components/myArtwork/RegisterArtwork";
import RegisterForSale from "./views/components/myArtwork/RegisterForSale";
import RegisterForAuction from "./views/components/myArtwork/RegisterForAuction";
import MyArtworkUpload from "./views/MyArtworkUpload";
import MyArtworkUpdate from "./views/MyArtworkUpdate";

// import SealedAuction from "./views/SealedAuction";
import MyAuctions from "./views/MyAuctions";
import MyAuctionManage from "./views/MyAuctionManage";
import MyAuctionUpload from "./views/MyAuctionUpload";
import MyAuctionUpdate from "./views/MyAuctionUpdate";
import OnlineAuction from "./views/OnlineAuction";
import OnlineAuctions from "./views/OnlineAuctions";

import myAccountService from "@/services/myAccountService";

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: "/",
      name: "index",
      components: {
        default: Index,
        header: NavbarSplash,
        footer: Footer
      },
      props: {
        header: { colorOnScroll: 400 },
        footer: { backgroundColor: "black" }
      }
    },
    {
      path: "/home",
      name: "home",
      components: { default: Home, header: Navbar, footer: Footer },
      props: {
        header: { colorOnScroll: 400 },
        footer: { backgroundColor: "black" }
      }
    },
    {
      path: "/gallery",
      name: "gallery",
      components: { default: Gallery, header: Navbar, footer: Footer },
      props: {
        header: { colorOnScroll: 400 },
        footer: { backgroundColor: "black" }
      }
    },
    {
      path: "/login",
      name: "login",
      components: { default: Login, header: Navbar, footer: Footer },
      props: {
        header: { colorOnScroll: 400 }
      }
    },
    {
      path: "/profile/team/:profileId",
      name: "teamProfile",
      components: {
        default: TeamProfile,
        header: Navbar,
        footer: Footer
      },
      props: {
        header: { colorOnScroll: 400 },
        footer: { backgroundColor: "black" }
      }
    },
    {
      path: "/profile/user/blockstackId",
      name: "profile",
      components: {
        default: Profile,
        header: Navbar,
        footer: Footer
      },
      props: {
        header: { colorOnScroll: 400 },
        footer: { backgroundColor: "black" }
      }
    },
    {
      path: "/landing",
      name: "landing",
      components: { default: Landing, header: Navbar, footer: Footer },
      props: {
        header: { colorOnScroll: 400 },
        footer: { backgroundColor: "black" }
      }
    },
    {
      path: "/search",
      name: "search",
      components: { default: Search, header: Navbar, footer: Footer },
      props: {
        header: { colorOnScroll: 400 },
        footer: { backgroundColor: "black" }
      }
    },
    {
      path: "/artists",
      name: "artists",
      components: { default: Artists, header: Navbar, footer: Footer },
      props: {
        header: { colorOnScroll: 400 },
        footer: { backgroundColor: "black" }
      }
    },
    {
      path: '/artists/:artistId',
      name: 'artistDetails',
      components: { default: Artist, header: Navbar, footer: Footer },
      props: {
        header: { colorOnScroll: 400 },
        footer: { backgroundColor: "black" }
      }
    },
    {
      path: "/artworks/:owner/:artworkId",
      name: "artwork",
      components: { default: Artwork, header: Navbar, footer: Footer },
      props: {
        header: { colorOnScroll: 400 },
        footer: { backgroundColor: "black" }
      }
    },
    {
      path: "/my-artwork/update/:artworkId",
      name: "myArtworkUpdate",
      components: {
        default: MyArtworkUpdate,
        header: Navbar,
        footer: Footer
      },
      meta: { requiresAuth: true }
    },
    {
      path: "/my-artwork/upload",
      name: "myArtworkUpload",
      components: {
        default: MyArtworkUpload,
        header: Navbar,
        footer: Footer
      },
      meta: { requiresAuth: true }
    },
    {
      path: "/my-artworks",
      name: "my-artworks",
      components: {
        default: MyArtworks,
        header: Navbar,
        footer: Footer
      },
      meta: { requiresAuth: true },
      children: [
        {
          path: "/my-artwork/register/:artworkId",
          name: "registerArtwork",
          component: RegisterArtwork
        },
        {
          path: "/my-artwork/register-for-sale/:artworkId/:amount/:currency",
          name: "registerForSale",
          component: RegisterForSale,
          props: true
        },
        {
          path:
            "/my-artwork/register-for-auction/" +
            ":artworkId/:auctionId/:reserve/:increment/:currency",
          name: "registerForAuction",
          component: RegisterForAuction,
          props: true
        }
      ]
    },
    {
      path: "/online-auction/:username/:auctionId",
      name: "onlineAuction",
      components: {
        default: OnlineAuction,
        header: Navbar,
        footer: Footer
      }
    },
    {
      path: "/online-auctions",
      meta: { requiresAuth: false },
      name: "onlineAuctions",
      components: {
        default: OnlineAuctions,
        header: Navbar,
        footer: Footer
      }
    },
    {
      path: "/my-auctions/manage/:auctionId",
      meta: { requiresAuth: true },
      components: {
        default: MyAuctionManage,
        header: Navbar,
        footer: Footer
      }
    },
    {
      path: "/my-auctions/update/:auctionId",
      meta: { requiresAuth: true },
      components: {
        default: MyAuctionUpdate,
        header: Navbar,
        footer: Footer
      }
    },
    {
      path: "/my-auctions/upload",
      meta: { requiresAuth: true },
      components: {
        default: MyAuctionUpload,
        header: Navbar,
        footer: Footer
      }
    },
    {
      path: "/my-auctions",
      name: "myAuctions",
      meta: { requiresAuth: true },
      components: {
        default: MyAuctions,
        header: Navbar,
        footer: Footer
      }
    },
    {
      path: "/admin",
      name: "admin",
      meta: { requiresAuth: true },
      components: { default: Admin, header: Navbar, footer: Footer },
      children: [
        {
          path: "/admin/build-index",
          name: "adminBuildIndex",
          component: AdminBuildIndex
        },
        {
          path: "/admin/query-index",
          name: "adminQueryIndex",
          component: AdminQueryIndex
        },
        {
          path: "/admin/settings",
          name: "adminSettings",
          component: AdminSettings
        },
        {
          path: "/admin/registrations",
          name: "adminRegistrations",
          component: AdminRegistrations
        }
      ]
    }
  ],
  scrollBehavior: to => {
    if (to.hash) {
      return { selector: to.hash };
    }
    return { x: 0, y: 0 };
  }
});
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (myAccountService.myProfile().loggedIn) {
      return next();
    } else {
      return next({
        path: "/",
        query: { redirect: to.fullPath }
      });
    }
  } else {
    return next(); // make sure to always call next()!
  }
});

export default router;
