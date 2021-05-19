import React from "react";

const Home = React.lazy(() => import("./views/nintube/home/Home"));
const Fire = React.lazy(() => import("./views/nintube/fire/Fire"));
const Inscription = React.lazy(() =>
  import("./views/nintube/inscriptions/Inscriptions")
);
const Library = React.lazy(() => import("./views/nintube/library/Library"));
const View = React.lazy(() => import("./views/nintube/view/View"));
const viewPlaylist = React.lazy(() =>
  import("./views/nintube/view/viewPlaylist")
);
const Profile = React.lazy(() => import("./views/nintube/profile/Profile"));
const EditProfile = React.lazy(() =>
  import("./views/nintube/profile/editProfile")
);
const Playlist = React.lazy(() => import("./views/nintube/playlist/Playlist"));
const Channel = React.lazy(() => import("./views/nintube/channel/Channel"));
const Historic = React.lazy(() => import("./views/nintube/historic/Historic"));
const Upload = React.lazy(() => import("./views/nintube/upload/Upload"));
const Studio = React.lazy(() => import("./views/nintube/studio/Studio"));
const UploadEdit = React.lazy(() =>
  import("./views/nintube/upload/uploadEdit")
);
const Statistics = React.lazy(() =>
  import("./views/nintube/statistics/Statistics")
);

const Search = React.lazy(() => import("./views/nintube/components/Search"));

const bar = React.lazy(() => import("./views/charts/Charts"));

const routes = [
  { path: "/", exact: true, name: "Home" },
  { path: "/home", name: "Home", component: Home },
  { path: "/fire", name: "Fire", component: Fire },
  { path: "/inscription", name: "Incription", component: Inscription },
  { path: "/library", name: "Library", component: Library },
  { path: "/view/:id", name: "View", component: View },
  {
    path: "/viewPlaylist/:playlistid/:id",
    name: "ViewPlaylist",
    component: viewPlaylist,
  },
  { path: "/profile", name: "Profile", component: Profile },
  { path: "/edit/profile", name: "EditProfile", component: EditProfile },
  { path: "/playlist/:id", name: "Playlist", component: Playlist },
  { path: "/channel/:id", name: "Channel", component: Channel },
  { path: "/history", name: "History", component: Historic },
  { path: "/upload/", name: "Upload", component: Upload },
  { path: "/edit/upload/:id", name: "UploadEdit", component: UploadEdit },
  { path: "/studio", name: "Studio", component: Studio },
  { path: "/statistics", name: "Statistics", component: Statistics },
  { path: "/search/:search", name: "Search", component: Search },
  // { path: "/bar", name: "bar", component: bar },
];

export default routes;
