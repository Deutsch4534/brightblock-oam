import Router from "vue-router";

import Admin from "./views/Admin.vue";
import AdminSettings from "./views/components/admin/AdminSettings";
import AdminBitcoin from "./views/components/admin/AdminBitcoin";
import AdminRegistrations from "./views/components/admin/AdminRegistrations";
import AdminBuildIndex from "./views/components/admin/AdminBuildIndex";
import AdminQueryIndex from "./views/components/admin/AdminQueryIndex";

import Index from "./views/Index.vue";
import Landing from "./views/Landing.vue";
import Gallery from "./views/Gallery.vue";
import GalleryUpload from "./views/GalleryUpload.vue";
import GalleryUpdate from "./views/GalleryUpdate.vue";
import MyGalleries from "./views/MyGalleries.vue";

import Artist from "./views/Artist.vue";
import Artists from "./views/Artists.vue";
import Login from "./views/Login.vue";
import Profile from "./views/Profile.vue";
import ProfileUpdate from "./views/ProfileUpdate.vue";
import TeamProfile from "./views/TeamProfile.vue";
import Navbar from "./layout/Navbar.vue";
import Footer from "./layout/Footer.vue";

import Artwork from "./views/Artwork";
import Orders from "./views/Orders";
import Order from "./views/Order";

import Search from "./views/Search";

import MyArtworks from "./views/MyArtworks";
import MyArtwork from "./views/MyArtwork";
import Registration from "./views/components/myArtwork/Registration";
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

import About from "./views/About";

import myAccountService from "@/services/myAccountService";

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: "/index",
      name: "index",
      components: {
        default: Index,
        header: Navbar,
        footer: Footer
      },
      meta: { requiresAuth: false }
    },
    {
      path: "/home",
      name: "home",
      components: {
        default: Index,
        header: Navbar,
        footer: Footer
      },
      meta: { requiresAuth: false }
    },
    {
      path: "/",
      name: "index",
      components: {
        default: Index,
        header: Navbar,
        footer: Footer
      },
      meta: { requiresAuth: false }
    },
    {
      path: "/my-galleries",
      name: "my-galleries",
      components: {
        default: MyGalleries,
        header: Navbar,
        footer: Footer
      },
      meta: { requiresAuth: true },
    },
    {
      path: "/gallery",
      name: "gallery1",
      components: { default: Gallery, header: Navbar, footer: Footer },
      meta: { requiresAuth: false }
    },
    {
      path: "/gallery/upload",
      name: "galleryUpload",
      components: {
        default: GalleryUpload,
        header: Navbar,
        footer: Footer
      },
      meta: { requiresAuth: true }
    },
    {
      path: "/gallery/update/:galleryId",
      name: "galleryUpdate",
      components: {
        default: GalleryUpdate,
        header: Navbar,
        footer: Footer
      },
      meta: { requiresAuth: true }
    },
    {
      path: "/login",
      name: "login",
      components: { default: Login, header: Navbar, footer: Footer },
      props: {
        header: { colorOnScroll: 400 }
      },
      meta: { requiresAuth: false }
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
      path: "/profile/user/:blockstackId",
      name: "profile",
      components: {
        default: Profile,
        header: Navbar,
        footer: Footer
      },
      props: {
        header: { colorOnScroll: 400 },
        footer: { backgroundColor: "black" }
      },
      meta: { requiresAuth: true }
    },
    {
      path: "/profile/update",
      name: "profileUpdate",
      components: {
        default: ProfileUpdate,
        header: Navbar,
        footer: Footer
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
      path: "/order/:orderId",
      name: "order",
      components: { default: Order, header: Navbar, footer: Footer },
      meta: { requiresAuth: true }
    },
    {
      path: "/orders",
      name: "orders",
      components: { default: Orders, header: Navbar, footer: Footer },
      meta: { requiresAuth: true }
    },
    {
      path: "/artworks/:artworkId",
      name: "artwork",
      components: { default: Artwork, header: Navbar, footer: Footer },
      props: {
        header: { colorOnScroll: 400 },
        footer: { backgroundColor: "black" }
      },
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
      path: "/my-artwork/register/:artworkId",
      name: "registration",
      components: {
        default: Registration,
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
    },
    {
      path: "/my-artworks/:artworkId",
      name: "my-artwork",
      components: {
        default: MyArtwork,
        header: Navbar,
        footer: Footer
      },
      meta: { requiresAuth: true },
    },
    {
      path: "/my-artwork/register-for-sale/:artworkId/:amount/:currency",
      name: "registerForSale",
      components: {
        default: RegisterForSale,
        header: Navbar,
        footer: Footer
      },
      meta: { requiresAuth: true }
    },
    {
      path:
        "/my-artwork/register-for-auction/" +
        ":artworkId/:auctionId/:reserve/:increment/:currency",
      name: "registerForAuction",
      components: {
        default: RegisterForAuction,
        header: Navbar,
        footer: Footer
      },
      meta: { requiresAuth: true }
    },
    {
      path: "/online-auction/:username/:auctionId",
      name: "onlineAuction",
      components: {
        default: OnlineAuction,
        header: Navbar,
        footer: Footer
      },
      meta: { requiresAuth: true }
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
      components: {
        default: MyAuctionManage,
        header: Navbar,
        footer: Footer
      },
      meta: { requiresAuth: true }
    },
    {
      path: "/my-auctions/update/:auctionId",
      components: {
        default: MyAuctionUpdate,
        header: Navbar,
        footer: Footer
      },
      meta: { requiresAuth: true }
    },
    {
      path: "/my-auctions/upload",
      components: {
        default: MyAuctionUpload,
        header: Navbar,
        footer: Footer
      },
      meta: { requiresAuth: true }
    },
    {
      path: "/my-auctions",
      name: "myAuctions",
      components: {
        default: MyAuctions,
        header: Navbar,
        footer: Footer
      },
      meta: { requiresAuth: true }
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
          path: "/admin/bitcoin",
          name: "adminBitcoin",
          component: AdminBitcoin
        },
        {
          path: "/admin/registrations",
          name: "adminRegistrations",
          component: AdminRegistrations
        }
      ]
    },
    {
      path: '/about/:pageid',
      name: "about",
      components: {
        default: About,
        header: Navbar,
        footer: Footer
      }
    }
  ],
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (myAccountService.myProfile() && myAccountService.myProfile().loggedIn) {
      return next();
    } else {
      return next({
        path: "/index",
        query: { redirect: to.fullPath }
      });
    }
  } else {
    return next(); // make sure to always call next()!
  }
});

export default router;
