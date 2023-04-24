export enum RouterKey {
  home = "home",
  cfop = "cfop",
  style = "3-style",
  cube = "cube",
  about = "about"
}

export interface RouterInfo {
  url: string,
  key: RouterKey,
  text: string,
}

export const routers: Array<RouterInfo> = [  
  {
    url: "/",
    key: RouterKey.home,
    text: "Home"
  },
  {
    url: "/style",
    key: RouterKey.style,
    text: "盲拧记忆"
  },
  {
    url: "/cube",
    key: RouterKey.cube,
    text: "虚拟魔方"
  },
  {
    url: "/about",
    key: RouterKey.about,
    text: "About"
  },
];