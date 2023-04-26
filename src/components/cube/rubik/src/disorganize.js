import * as THREE from 'three';
import { isPhone } from "./utils/utils.js";
import disorganizeIMG from "../image/disorganize-btn.png";

export default class ResetBtn {
  constructor(main) {
    this.main = main;
    this.isActive = false;

    const self = this;
    this.realWidth = 64;
    this.realHeight = 64;

    this.radio = this.main.originWidth / 750;

    this.width = this.realWidth * this.radio;
    this.height = this.width;
    
    this.screenRect = {
      width: self.width / self.main.uiRadio,
      height: self.height / self.main.uiRadio,
    }

    const loader = new THREE.TextureLoader();
    loader.load(`${disorganizeIMG}`, function(texture){
      const geometry = new THREE.PlaneGeometry(self.width,self.height);
      const material = new THREE.MeshBasicMaterial({map: texture, transparent: true});
      self.plane = new THREE.Mesh(geometry,material);
      self.plane.position.set(0,0,0);
      self.main.scene.add(self.plane);
      self.defaultPosition();
    },function(){},function(){
      console.log("error happened");
    });
  }

  isHover(touch) {
    let isHover = false;
    let x = 0;
    let y = 0;
    if (isPhone()) {
      x = touch.clientX;
      y = touch.clientY;
    } else {
      x = touch.offsetX;
      y = touch.offsetY;
    }
    if (y >= this.screenRect.top && y <= this.screenRect.top + this.screenRect.height && x >= this.screenRect.left && x <= this.screenRect.left + this.screenRect.width) {
      isHover = true;
    }

    return isHover;
  }
  
  defaultPosition() {
    this.plane.position.x = - this.main.originWidth / 2 + this.width / 2 + 50 * this.radio;
    this.plane.position.y = this.main.originHeight / 2 - this.height / 2 * 3 - 35 * this.radio;
    
    this.screenRect.left = (this.main.originWidth / 2 + this.plane.position.x - this.width / 2) / this.main.uiRadio;
    this.screenRect.top = (this.main.originHeight / 2 - this.plane.position.y - this.height / 2) / this.main.uiRadio;
  }
  
  enable() {
    this.isActive = true;
  }

  disable() {
    this.isActive = false;
  }
}