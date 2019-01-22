import Vue from "vue";
import Router from "vue-router";

import Admin from "./views/Admin.vue";
import AdminSettings from "./views/components/admin/AdminSettings";
import AdminRegistrations from "./views/components/admin/AdminRegistrations";
import SearchIndexManager from "./views/components/admin/SearchIndexManager";
import SearchBuilderTab from "./views/components/admin/SearchBuilderTab";
import SearchDappsTab from "./views/components/admin/SearchDappsTab";

// import Home from "./views/Home.vue";
import BrightBlock from "./views/BrightBlock.vue";
import Index from "./views/Index.vue";
import Landing from "./views/Landing.vue";
import Login from "./views/Login.vue";
import Profile from "./views/Profile.vue";
import TeamProfile from "./views/TeamProfile.vue";
import Navbar1 from "./layout/Navbar1.vue";
// import BBMainNavbar from "./layout/BBMainNavbar.vue";
// import SecondNavbar from "./layout/SecondNavbar.vue";
import MainNavbar from "./layout/MainNavbar.vue";
import MainFooter from "./layout/MainFooter.vue";

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
import MyAuctionList from "./views/components/auction/MyAuctionList";
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
      name: "home",
      components: {
        default: BrightBlock,
        header: Navbar1,
        footer: MainFooter
      },
      props: {
        header: { colorOnScroll: 400 },
        footer: { backgroundColor: "black" }
      }
    },
    {
      path: "/brightBlock",
      name: "brightBlock",
      components: {
        default: BrightBlock,
        header: Navbar1,
        footer: MainFooter
      },
      props: {
        header: { colorOnScroll: 400 },
        footer: { backgroundColor: "black" }
      }
    },
    {
      path: "/profile/team/:profileId",
      name: "teamProfile",
      components: {
        default: TeamProfile,
        header: Navbar1,
        footer: MainFooter
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
        header: MainNavbar,
        footer: MainFooter
      },
      props: {
        header: { colorOnScroll: 400 },
        footer: { backgroundColor: "black" }
      }
    },
    {
      path: "/index",
      name: "index",
      components: { default: Index, header: MainNavbar, footer: MainFooter },
      props: {
        header: { colorOnScroll: 400 },
        footer: { backgroundColor: "black" }
      }
    },
    {
      path: "/landing",
      name: "landing",
      components: { default: Landing, header: MainNavbar, footer: MainFooter },
      props: {
        header: { colorOnScroll: 400 },
        footer: { backgroundColor: "black" }
      }
    },
    {
      path: "/search",
      name: "search",
      components: { default: Search, header: Navbar1, footer: MainFooter },
      props: {
        header: { colorOnScroll: 400 },
        footer: { backgroundColor: "black" }
      }
    },
    {
      path: "/artworks/:owner/:artworkId",
      name: "artwork",
      components: { default: Artwork, header: MainNavbar, footer: MainFooter },
      props: {
        header: { colorOnScroll: 400 },
        footer: { backgroundColor: "black" }
      }
    },
    {
      path: "/login",
      name: "login",
      components: { default: Login, header: MainNavbar, footer: MainFooter },
      props: {
        header: { colorOnScroll: 400 }
      }
    },
    {
      path: "/my-artwork/update/:artworkId",
      name: "myArtworkUpdate",
      components: {
        default: MyArtworkUpdate,
        header: MainNavbar,
        footer: MainFooter
      },
      meta: { requiresAuth: true }
    },
    {
      path: "/my-artwork/upload",
      name: "myArtworkUpload",
      components: {
        default: MyArtworkUpload,
        header: MainNavbar,
        footer: MainFooter
      },
      meta: { requiresAuth: true }
    },
    {
      path: "/my-artworks",
      name: "my-artworks",
      components: {
        default: MyArtworks,
        header: MainNavbar,
        footer: MainFooter
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
        header: MainNavbar,
        footer: MainFooter
      }
    },
    {
      path: "/online-auctions",
      meta: { requiresAuth: true },
      name: "onlineAuctions",
      components: {
        default: OnlineAuctions,
        header: MainNavbar,
        footer: MainFooter
      }
    },
    {
      path: "/my-auctions/manage/:auctionId",
      meta: { requiresAuth: true },
      components: {
        default: MyAuctionManage,
        header: MainNavbar,
        footer: MainFooter
      }
    },
    {
      path: "/my-auctions/update/:auctionId",
      meta: { requiresAuth: true },
      components: {
        default: MyAuctionUpdate,
        header: MainNavbar,
        footer: MainFooter
      }
    },
    {
      path: "/my-auctions/upload",
      meta: { requiresAuth: true },
      components: {
        default: MyAuctionUpload,
        header: MainNavbar,
        footer: MainFooter
      }
    },
    {
      path: "/my-auctions",
      components: {
        default: MyAuctions,
        header: MainNavbar,
        footer: MainFooter
      },
      meta: { requiresAuth: true },
      children: [
        {
          path: "",
          component: MyAuctionList
        }
      ]
    },
    {
      path: "/admin",
      name: "admin",
      meta: { requiresAuth: true },
      components: { default: Admin, header: MainNavbar, footer: MainFooter },
      children: [
        {
          path: "/search-index-manager",
          name: "searchIndexManager",
          component: SearchIndexManager,
          children: [
            {
              path: "/search-index-manager/search-names",
              name: "searchBuilderTab",
              component: SearchBuilderTab
            },
            {
              path: "/search-index-manager/search-dapps",
              name: "searchDappsTab",
              component: SearchDappsTab
            }
          ]
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
