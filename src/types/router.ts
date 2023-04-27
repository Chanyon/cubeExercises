export enum RouterKey {
  home = "home",
  cfop = "cfop",
  cycle = "3-cycle",
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
    key: RouterKey.cycle,
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