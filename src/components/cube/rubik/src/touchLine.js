import * as THREE from 'three';
import { isPhone } from "./utils/utils.js";
import lineIMG from "../image/line.png";

export default class TouchLine {
  constructor(main,originalWidth,originalHeight){
    this.main = main;
    this.activate = false;
    // 图片尺寸
    this.realWidth = 750;
    this.realHeight = 64;

    const self = this;
    this.originalHeight = originalHeight;
    // 逻辑尺寸,3d
    this.width = originalWidth;
    this.height = this.realHeight * this.width / this.realWidth;
    //屏幕尺寸
    this.screenRect = {
      width: self.width,
      height: self.realHeight * self.main.height / self.realWidth,
      left: 0,
      top: self.main.height / 2  - this.height / 2
    }
    let loader = new THREE.TextureLoader();
    loader.load(`${lineIMG}`,function(texture){
      let geometry = new THREE.PlaneGeometry(self.width,self.height);
      let material = new THREE.MeshBasicMaterial({map:texture,transparent:true});
      self.plane = new THREE.Mesh(geometry, material);
      self.plane.position.set(0,0,0);
      self.main.scene.add(self.plane);
      // self.defaultPosition();
    },function(err){
      console.log(err);
    })
  }
  isHover(touch){
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

    if (y >= this.screenRect.top && y <= this.screenRect.top + this.screenRect.height) {
      isHover = true;
    }
    return isHover;
  }
  enable(){
    this.activate = true;
  }
  disable(){
    this.activate = false;
  }
  move(y){
    if(this.activate){
      if(y < this.main.height * this.main.minPercent ||  y > this.main.height * (1-this.main.minPercent)){
        if(y < this.main.height * this.main.minPercent){
          y = this.main.height * this.main.minPercent;
        }else{
          y = this.main.height * (1 - this.main.minPercent);
        }
      }
      let len = this.screenRect.top + this.screenRect.height / 2 - y ; //屏幕移动距离
      let percent = len / this.main.height;
      let len2 = this.originalHeight * percent;
      this.plane.position.y += len2;
      this.screenRect.top = y - this.screenRect.height / 2;
    }
  }
  
  defaultPosition(){
    this.enable();
    this.move(this.main.height * (1 - this.main.minPercent));
    this.disable();
  }
}