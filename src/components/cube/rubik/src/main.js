//* 参考 https://github.com/newbieYoung/Threejs_rubik
//*
import * as THREE from 'three';
import { Rubik } from "./Rubik.js";
import TouchLine from "./touchLine.js";
import { isPhone } from "./utils/utils.js";
import ResetBtn from "./reset.js";
import DisorganizeBtn from "./disorganize.js";
import { off } from 'process';

// 坐标系
let axesHelper = new THREE.AxesHelper(250);
//页面加载完成
// const canvas = document.querySelector('canvas');
// const Content = canvas.getContext('webgl');
class Main {
  constructor() {
    this.retina = document.querySelector("#retina");
    this.width = this.retina.clientWidth;
    this.height = this.retina.clientHeight;
    this.devicePixelRatio = window.devicePixelRatio;
    this.viewCenter = new THREE.Vector3(0, 0, 0);
    this.renderer = null;
    this.camera = null;
    this.scene = null;
    this.orbitController = null;
    this.frontViewName = 'front-rubik';
    this.endViewName = 'end-rubik';
    this.minPercent = 0.25; //区域百分比
    this.rayCaster = new THREE.Raycaster();
    this.intersect = undefined; //转动魔方时手指触碰的小方块
    this.normalize = undefined; //转动魔方时手指触碰的平面的法向量
    this.targetRubik = undefined; //转动魔方时手指触碰的魔方
    this.anotherRubik = undefined; //转动魔方时手指没触碰的魔方
    this.startPoint = undefined;
    this.movePoint = undefined;
    this.isRotating = false;
    this.initRender(); //创建渲染器
    this.initCamera(); //创建相机
    this.initLight(); //创建光源
    this.initObject(); //创建物体
    this.initScene(); //初始化场景
    // this.initEvent();
    this.render(); //渲染
  }

  initRender() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      // context: this.context
    })
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(0x000000, 0.2);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    document.getElementById('retina').appendChild(this.renderer.domElement);
  }

  initCamera() {
    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 1, 1000);
    this.camera.position.set(0, 0, 300 / this.camera.aspect);
    this.camera.up.set(0, 1, 0);
    this.camera.lookAt(this.viewCenter);

    this.originHeight = Math.tan(22.5 / 180 * Math.PI) * (this.camera.position.z) * 2; //裁切面高度
    this.originWidth = this.originHeight * this.camera.aspect;

    this.uiRadio = this.originWidth / this.width;
  }

  initLight() {
    this.pointLight = new THREE.PointLight(0xffffff, 1, 2000);
    this.pointLight.position.set(70, 112, 98);
    this.ambientLight = new THREE.AmbientLight(0x333333);
  }

  initObject() {
    this.frontRubik = new Rubik();
    this.frontRubik.model(this.frontViewName);
    this.frontRubik.resizeHeight(0.65, 1, this.minPercent, this.originHeight);

    this.endRubik = new Rubik();
    this.endRubik.model(this.endViewName);
    this.endRubik.resizeHeight(0.65, -1, this.minPercent, this.originHeight);

    this.touchLine = new TouchLine(this, this.originWidth, this.originHeight);
    // this.rubikResize(1 - this.minPercent, this.minPercent);
    this.resetBtn = new ResetBtn(this);
    this.disorganizeBtn = new DisorganizeBtn(this);
    this.startDisturbed();
  }

  initScene() {
    this.scene = new THREE.Scene();
    this.scene.add(this.pointLight);
    this.scene.add(this.ambientLight);
    // this.scene.add(axesHelper)
    this.scene.add(this.frontRubik.group);
    this.scene.add(this.endRubik.group);
  }

  render() {
    this.renderer.clear();
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.render.bind(this));
  }
  // touch event
  initEvent() {
    if (isPhone()) {
      this.retina.addEventListener('touchstart', e => {
        let touch = e.touches[0];
        this.startPoint = touch;
        if (this.touchLine.isHover(e)) {
          this.touchLine.enable();
        } else if (this.resetBtn.isHover(e) && !this.isRotating) {
          this.resetBtn.enable();
          this.resetRubik();
        } else if (this.disorganizeBtn.isHover(e) && !this.isRotating) {
          this.disorganizeBtn.enable();
          this.startDisturbed2();
        } else {
          this.getIntersects(e);
          if (!this.isRotating && !this.intersect) {
            const x = touch.pageX - e.target.offsetLeft;
            const y = touch.pageY - e.target.offsetTop;
            this.startPoint = new THREE.Vector2(x, y);
          }
          if (!this.isRotating && this.intersect) {
            this.startPoint = this.intersect.point;
          }
        }
      });

      this.retina.addEventListener('touchmove', e => {
        let touch = e.touches[0];
        if (this.touchLine.activate) {
          const offsetY = touch.pageY - e.target.offsetTop
          this.touchLine.move(offsetY);
          let frontPercent = offsetY / this.height;
          let endPercent = 1 - frontPercent;
          this.rubikResize(frontPercent, endPercent);
        } else {
          this.getIntersects(e);
          if (!this.isRotating && this.startPoint && this.intersect) {
            this.movePoint = this.intersect.point;
            if (!this.movePoint.equals(this.startPoint)) {
              this.rotateRubik();
            }
          }

          if (!this.isRotating && this.startPoint && this.intersect) {
            this.movePoint = this.intersect.point;
            if (!this.movePoint.equals(this.startPoint)) {
              this.rotateRubik();
            }
          }
        }
      });

      this.retina.addEventListener('touchend', e => {
        this.touchLine.disable();
        this.resetBtn.disable();
        this.disorganizeBtn.disable();
      });
    } else {
      // not phone
      const self = this;
      self.retina.addEventListener('mousedown', e => {
        const touch = e;
        if (this.touchLine.isHover(touch)) {
          this.touchLine.enable();
        } else if (this.resetBtn.isHover(touch) && !this.isRotating) {
          this.resetBtn.enable();
          this.resetRubik();
        } else if (this.disorganizeBtn.isHover(touch) && !this.isRotating) {
          this.disorganizeBtn.enable();
          this.startDisturbed2();
        } else {
          //触摸点不在魔方上
          this.getIntersects(e);
          if (!this.isRotating && !this.intersect) {
            this.startPoint = new THREE.Vector2(touch.offsetX, touch.offsetY);
          }
          if (!this.isRotating && this.intersect) {
            this.startPoint = this.intersect.point;
          }
        }
      });

      self.retina.addEventListener('mousemove', e => {
        const touch = e;
        if (this.touchLine.activate) {
          this.touchLine.move(touch.offsetY);
          let frontPercent = touch.offsetY / self.height;
          let endPercent = 1 - frontPercent;
          this.rubikResize(frontPercent, endPercent);
        } else {
          this.getIntersects(e);
          if (!this.isRotating && this.startPoint && !this.intersect) {
            this.movePoint = new THREE.Vector2(touch.offsetX, touch.offsetY);
            if (!this.movePoint.equals(this.startPoint)) {
              this.rotateView();
            }
          }

          if (!this.isRotating && this.startPoint && this.intersect) {
            this.movePoint = this.intersect.point;
            if (!this.movePoint.equals(this.startPoint)) {
              this.rotateRubik();
            }
          }
        }

      });

      self.retina.addEventListener('mouseup', e => {
        this.touchLine.disable();
        this.resetBtn.disable();
        this.disorganizeBtn.disable();
      });
    }
  }

  rubikResize(fp, ep) {
    this.frontRubik.resizeHeight(fp, 1, this.minPercent, this.originHeight);
    this.endRubik.resizeHeight(ep, -1, this.minPercent, this.originHeight);
  }

  getIntersects(event) {
    let touch;
    let x = 0;
    let y = 0;
    if (isPhone()) {
      touch = event.touches[0];
      x = touch.pageX - event.target.offsetLeft;
      y = touch.pageY - event.target.offsetTop;
    } else {
      touch = event;
      x = touch.offsetX;
      y = touch.offsetY;
    }

    let mouse = new THREE.Vector2();
    mouse.x = (x / this.width) * 2 - 1;
    mouse.y = -(y / this.height) * 2 + 1;

    this.rayCaster.setFromCamera(mouse, this.camera);

    let rubikTypeName = undefined;
    if (this.touchLine.screenRect.top > x) {
      this.targetRubik = this.frontRubik;
      this.anotherRubik = this.endRubik;
      rubikTypeName = this.frontViewName;
    }
    if (this.touchLine.screenRect.top < y) {
      this.targetRubik = this.endRubik;
      this.anotherRubik = this.frontRubik;
      rubikTypeName = this.endViewName;
    }

    let targetIntersect = undefined;
    for (let i = 0; i < this.scene.children.length; i++) {
      if (this.scene.children[i].childType === rubikTypeName) {
        targetIntersect = this.scene.children[i];
        // console.log(targetIntersect,rubikTypeName);
        break;
      }
    }

    if (targetIntersect) {
      const intersects = this.rayCaster.intersectObjects(targetIntersect.children);
      if (intersects.length >= 2) {
        if (intersects[0].object.cubeType === 'coverCube') {
          this.intersect = intersects[1];
          this.normalize = intersects[0].face.normal;
        } else {
          this.intersect = intersects[0];
          this.normalize = intersects[1].face.normal;
        }
      }
    }
  }

  /**
 * 转动魔方
 */
  rotateRubik() {
    const self = this;
    this.isRotating = true;//转动标识置为true
    const sub = this.movePoint.sub(this.startPoint);//计算滑动方向
    const direction = this.targetRubik.getDirection(sub, this.normalize);//计算转动方向
    const cubeIndex = this.intersect.object.cubeIndex;
    this.targetRubik.rotateMove(cubeIndex, direction);
    // console.log(direction);
    const anotherIndex = cubeIndex - this.targetRubik.minCubeIndex + this.anotherRubik.minCubeIndex;
    this.anotherRubik.rotateMove(anotherIndex, direction, function () {
      self.resetRotateParams();
    });
  }

  /**
   * 重置魔方转动参数
   */
  resetRotateParams() {
    this.isRotating = false;
    this.targetRubik = null;
    this.anotherRubik = null;
    this.intersect = null;
    this.normalize = null;
    this.startPoint = null;
    this.movePoint = null;
  }

  //打乱
  startDisturbed() {
    const self = this;
    const stepArr = this.frontRubik.randomRotate();
    this.endRubik.runMethodAtNo(stepArr, 0, () => {
      self.initEvent();
    });
  }
  //reset
  resetRubik() {
    this.frontRubik.reset();
    this.endRubik.reset();
  }

  startDisturbed2(callback) {
    const self = this;
    if (!self.isRotating) {
      this.isRotating = true;
      const stepArr = this.frontRubik.randomRotate();
      self.endRubik.runMethodAtNo(stepArr, 0, () => {
        if (callback) {
          callback();
        }
        self.resetRotateParams();
      });
    }
  }

  keyboardMove(stepArr) {
    const self = this;
    this.frontRubik.stepMove(stepArr, 0);
    self.endRubik.stepMove(stepArr, 0, () => {
      self.resetRotateParams();
    });
  }

  //视图转动
  getViewDirection(type, startPoint, movePoint) {
    let direction = 0;
    const rad = 30 * Math.PI / 180;
    const lenX = movePoint.x - startPoint.x;
    const lenY = movePoint.y - startPoint.y;

    if (type === this.frontViewName) {
      if (startPoint.x > this.width / 2) {
        if (Math.abs(lenY) > Math.abs(lenX) * Math.tan(rad)) {
          if (lenY < 0) {
            direction = 2.1;
          } else {
            direction = 3.1;
          }
        } else {
          if (lenX > 0) {
            direction = 0.3;
          } else {
            direction = 1.3;
          }
        }
      } else {
        if (Math.abs(lenY) > Math.abs(lenX) * Math.tan(rad)) {
          if (lenY < 0) {
            direction = 2.4;
          } else {
            direction = 3.4;
          }
        } else {
          if (lenX > 0) {
            direction = 4.4;
          } else {
            direction = 5.4;
          }
        }
      }
    } else {
      // this.endRubik
      if (startPoint.x > this.width / 2) {
        if (Math.abs(lenY) > Math.abs(lenX) * Math.tan(rad)) {
          if (lenY < 0) {
            direction = 2.2;
          } else {
            direction = 3.2;
          }
        } else {
          if (lenX > 0) {
            direction = 1.4;
          } else {
            direction = 0.4;
          }
        }
      } else {
        if (Math.abs(lenY) > Math.abs(lenX) * Math.tan(rad)) {
          if (lenY < 0) {
            direction = 2.3;
          } else {
            direction = 3.3;
          }
        } else {
          if (lenX > 0) {
            direction = 5.3;
          } else {
            direction = 4.3;
          }
        }
      }
    }

    return direction;
  }

  getViewRotateCubeIndex(type) {
    if (this.frontViewName === type) {
      return 10;
    } else {
      return 65;
    }
  }

  rotateView() {
    const self = this;
    if (this.startPoint.y < this.touchLine.screenRect.top) {
      this.targetRubik = this.frontRubik;
      this.anotherRubik = this.endRubik;
    }
    if (this.startPoint.y > this.touchLine.screenRect.top + this.touchLine.screenRect.height) {
      this.targetRubik = this.endRubik;
      this.anotherRubik = this.frontRubik;
    }

    if (this.targetRubik && this.anotherRubik) {
      this.isRotating = true;
      const targetType = this.targetRubik.group.childType;
      const cubeIndex = this.getViewRotateCubeIndex(targetType);
      const direction = this.getViewDirection(targetType, this.startPoint, this.movePoint);
      this.targetRubik.rotateMoveWhole(cubeIndex, direction);
      this.anotherRubik.rotateMoveWhole(cubeIndex, direction, () => {
        self.resetRotateParams();
      });
    }
  }
}


export {
  Main
}