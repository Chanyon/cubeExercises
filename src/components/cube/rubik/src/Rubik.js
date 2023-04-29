import * as THREE from 'three';
import { randInt, RandomStep } from "./utils/utils";

const BasicParams = {
	x: 0,
	y: 0,
	z: 0,
	num: 3,
	len: 50,
	colors: [
		'#ff6b02', '#dd422f',
		'#fdcd02', '#ffffff',
		'#019d53', '#3d81f7'
	]
}
class Rubik {
	constructor() {
		this.cubes = [];

		this.initStatus = [];
		this.defaultTotalTime = 150;//默认转动动画时长

		this.xLine = new THREE.Vector3(1, 0, 0);
		this.xLineAd = new THREE.Vector3(-1, 0, 0);
		this.yLine = new THREE.Vector3(0, 1, 0);
		this.yLineAd = new THREE.Vector3(0, -1, 0);
		this.zLine = new THREE.Vector3(0, 0, 1);
		this.zLineAd = new THREE.Vector3(0, 0, -1);

		//move step
		const self = this;
		this.moveStep = {
			"U": self.U.bind(self),
			"U'": self.UP.bind(self),
			"R": self.R.bind(self),
			"R'": self.RP.bind(self),
			"L": self.L.bind(self),
			"L'": self.LP.bind(self),
			"D": self.D.bind(self),
			"D'": self.DP.bind(self),
			"B": self.B.bind(self),
			"B'": self.BP.bind(self),
			"F": self.F.bind(self),
			"F'": self.FP.bind(self),
			"M": self.M.bind(self),
			"M'": self.MP.bind(self),
			"E": self.E.bind(self),
			"E'": self.EP.bind(self),
			"S": self.S.bind(self),
			"S'": self.SP.bind(self),
			"R2": self.R2.bind(self),
			"F2": self.F2.bind(self),
			"L2": self.L2.bind(self),
			"U2": self.U2.bind(self),
			"B2": self.B2.bind(self),
			"D2": self.D2.bind(self),
			"Rw": self.Rw.bind(self),
			"Rw'": self.RwP.bind(self),
			"Fw": self.Fw.bind(self),
			"Fw'": self.FwP.bind(self),
			"Uw": self.Uw.bind(self),
			"Uw'": self.UwP.bind(self),
			"Dw": self.Dw.bind(self),
			"Dw'": self.DwP.bind(self),
			"Rw2": self.Rw2.bind(self),
			"Dw2": self.Dw2.bind(self),
			"Fw2": self.Fw2.bind(self),
			"Rw2'": self.Rw2P.bind(self),
			"Fw2'": self.Fw2P.bind(self),
			"Dw2'": self.Dw2P.bind(self),
		};
	}
	model(type) {
		this.group = new THREE.Group();
		this.group.childType = type;
		this.cubes = SimpleCube(BasicParams.x, BasicParams.y, BasicParams.z, BasicParams.num, BasicParams.len, BasicParams.colors);
		this.cubes.forEach(item => {
			this.initStatus.push({
				x: item.position.x,
				y: item.position.y,
				z: item.position.z,
				cubeIndex: item.id,
			});
			// console.log(item.id);
			item.cubeIndex = item.id;
			this.group.add(item);
		});

		const width = BasicParams.num * BasicParams.len;
		const cubeGeo = new THREE.BoxGeometry(width, width, width);
		const cubeMat = new THREE.MeshBasicMaterial({ opacity: 0, transparent: true });
		const cube = new THREE.Mesh(cubeGeo, cubeMat);
		cube.cubeType = 'coverCube';
		this.group.add(cube);

		if (type === 'front-rubik') {
			this.group.rotateY(45 / 180 * Math.PI);
		} else {
			this.group.rotateY(235 / 180 * Math.PI);
		}
		this.group.rotateOnAxis(new THREE.Vector3(1, 0, 1), 25 / 180 * Math.PI);

		this.getMinCubeIndex();
		return this.group;
	}

	resizeHeight(percent, transformTag, minPercent, originHeight) {
		if (percent < minPercent) {
			percent = minPercent;
		}
		if (percent > 1 - minPercent) {
			percent = 1 - minPercent;
		}
		this.group.scale.set(percent, percent, percent);
		this.group.position.y = originHeight * (0.5 - percent / 2) * transformTag;
	}
	// 计算方向，sub 向量
	getDirection(sub, normalize) {
		this.updateCurLocalAxisInWorld();
		const xAngle = sub.angleTo(this.xLine);
		const xAngleAd = sub.angleTo(this.xLineAd);
		const yAngle = sub.angleTo(this.yLine);
		const yAngleAd = sub.angleTo(this.yLineAd);
		const zAngle = sub.angleTo(this.zLine);
		const zAngleAd = sub.angleTo(this.zLineAd);
		const minAngle = Math.min(xAngle, xAngleAd, yAngle, yAngleAd, zAngle, zAngleAd);

		const xLine = new THREE.Vector3(1, 0, 0);
		const xLineAd = new THREE.Vector3(-1, 0, 0);
		const yLine = new THREE.Vector3(0, 1, 0);
		const yLineAd = new THREE.Vector3(0, -1, 0);
		const zLine = new THREE.Vector3(0, 0, 1);
		const zLineAd = new THREE.Vector3(0, 0, -1);

		let direction = 0;
		switch (minAngle) {
			case xAngle:
				direction = 0;
				if (normalize.equals(yLine)) {
					direction += 0.1;
				} else if (normalize.equals(yLineAd)) {
					direction += 0.2;
				} else if (normalize.equals(zLine)) {
					direction += 0.3;
				} else {
					direction += 0.4;
				}
				break;
			case xAngleAd:
				direction = 1;//向x轴反方向旋转90度
				if (normalize.equals(yLine)) {
					direction = direction + 0.1;
				} else if (normalize.equals(yLineAd)) {
					direction = direction + 0.2;
				} else if (normalize.equals(zLine)) {
					direction = direction + 0.3;
				} else {
					direction = direction + 0.4;
				}
				break;
			case yAngle:
				direction = 2;//向y轴正方向旋转90度
				if (normalize.equals(zLine)) {
					direction = direction + 0.1;
				} else if (normalize.equals(zLineAd)) {
					direction = direction + 0.2;
				} else if (normalize.equals(xLine)) {
					direction = direction + 0.3;
				} else {
					direction = direction + 0.4;
				}
				break;
			case yAngleAd:
				direction = 3;//向y轴反方向旋转90度
				if (normalize.equals(zLine)) {
					direction = direction + 0.1;
				} else if (normalize.equals(zLineAd)) {
					direction = direction + 0.2;
				} else if (normalize.equals(xLine)) {
					direction = direction + 0.3;
				} else {
					direction = direction + 0.4;
				}
				break;
			case zAngle:
				direction = 4;//向z轴正方向旋转90度
				if (normalize.equals(yLine)) {
					direction = direction + 0.1;
				} else if (normalize.equals(yLineAd)) {
					direction = direction + 0.2;
				} else if (normalize.equals(xLine)) {
					direction = direction + 0.3;
				} else {
					direction = direction + 0.4;
				}
				break;
			case zAngleAd:
				direction = 5;//向z轴反方向旋转90度
				if (normalize.equals(yLine)) {
					direction = direction + 0.1;
				} else if (normalize.equals(yLineAd)) {
					direction = direction + 0.2;
				} else if (normalize.equals(xLine)) {
					direction = direction + 0.3;
				} else {
					direction = direction + 0.4;
				}
				break;
			default:
				break;
		}
		return direction;
	}

	/**
	* 获得自身坐标系的坐标轴在世界坐标系中坐标
	*/	updateCurLocalAxisInWorld() {
		const center = new THREE.Vector3(0, 0, 0);
		const xPoint = new THREE.Vector3(1, 0, 0);
		const xPointAd = new THREE.Vector3(-1, 0, 0);
		const yPoint = new THREE.Vector3(0, 1, 0);
		const yPointAd = new THREE.Vector3(0, -1, 0);
		const zPoint = new THREE.Vector3(0, 0, 1);
		const zPointAd = new THREE.Vector3(0, 0, -1);

		const matrix = this.group.matrixWorld;//魔方的在世界坐标系的变换矩阵
		center.applyMatrix4(matrix);
		xPoint.applyMatrix4(matrix);
		xPointAd.applyMatrix4(matrix);
		yPoint.applyMatrix4(matrix);
		yPointAd.applyMatrix4(matrix);
		zPoint.applyMatrix4(matrix);
		zPointAd.applyMatrix4(matrix);

		this.center = center;
		this.xLine = xPoint.sub(center);
		this.xLineAd = xPointAd.sub(center);
		this.yLine = yPoint.sub(center);
		this.yLineAd = yPointAd.sub(center);
		this.zLine = zPoint.sub(center);
		this.zLineAd = zPointAd.sub(center);
	}
	/**
 * 根据触摸方块的索引以及滑动方向获得转动元素
 */
	getBoxs(cubeIndex, direction) {
		let targetIndex = cubeIndex - this.minCubeIndex;
		let numI = parseInt(targetIndex / 9);
		let numJ = targetIndex % 9;
		let boxs = [];
		//根据绘制时的规律判断 no = i*9+j
		switch (direction) {
			case 0.1:
			case 0.2:
			case 1.1:
			case 1.2:
			case 2.3:
			case 2.4:
			case 3.3:
			case 3.4:
				for (let i = 0; i < this.cubes.length; i++) {
					let tempId = this.cubes[i].cubeIndex - this.minCubeIndex;
					if (numI === parseInt(tempId / 9)) {
						boxs.push(this.cubes[i]);
					}
				}
				break;
			case 0.3:
			case 0.4:
			case 1.3:
			case 1.4:
			case 4.3:
			case 4.4:
			case 5.3:
			case 5.4:
				for (let i = 0; i < this.cubes.length; i++) {
					let tempId = this.cubes[i].cubeIndex - this.minCubeIndex;
					if (parseInt(numJ / 3) === parseInt(tempId % 9 / 3)) {
						boxs.push(this.cubes[i]);
					}
				}
				break;
			case 2.1:
			case 2.2:
			case 3.1:
			case 3.2:
			case 4.1:
			case 4.2:
			case 5.1:
			case 5.2:
				for (let i = 0; i < this.cubes.length; i++) {
					let tempId = this.cubes[i].cubeIndex - this.minCubeIndex;
					if (tempId % 9 % 3 === numJ % 3) {
						boxs.push(this.cubes[i]);
					}
				}
				break;
			default:
				break;
		}
		return boxs;
	}

	/**
	 * 转动动画
	 * currentstamp 当前时间
	 * startstamp   开始时间
	 */
	rotateAnimation(elements, direction, currentstamp, startstamp, laststamp, callback, totalTime) {
		let self = this;
		let isAnimationEnd = false;//动画是否结束

		if (startstamp === 0) {
			startstamp = currentstamp;
			laststamp = currentstamp;
		}
		if (currentstamp - startstamp >= totalTime) {
			isAnimationEnd = true;
			currentstamp = startstamp + totalTime;
		}
		let rotateMatrix = new THREE.Matrix4();//旋转矩阵
		const origin = new THREE.Vector3(0, 0, 0);
		const xLine = new THREE.Vector3(1, 0, 0);
		const yLine = new THREE.Vector3(0, 1, 0);
		const zLine = new THREE.Vector3(0, 0, 1);

		switch (direction) {
			case 0.1:
			case 1.2:
			case 2.4:
			case 3.3:
				rotateMatrix = this.rotateAroundWorldAxis(origin, zLine, -90 * Math.PI / 180 * (currentstamp - laststamp) / totalTime);
				break;
			case 0.2:
			case 1.1:
			case 2.3:
			case 3.4:
				rotateMatrix = this.rotateAroundWorldAxis(origin, zLine, 90 * Math.PI / 180 * (currentstamp - laststamp) / totalTime);
				break;
			case 0.4:
			case 1.3:
			case 4.3:
			case 5.4:
				rotateMatrix = this.rotateAroundWorldAxis(origin, yLine, -90 * Math.PI / 180 * (currentstamp - laststamp) / totalTime);
				break;
			case 1.4:
			case 0.3:
			case 4.4:
			case 5.3:
				rotateMatrix = this.rotateAroundWorldAxis(origin, yLine, 90 * Math.PI / 180 * (currentstamp - laststamp) / totalTime);
				break;
			case 2.2:
			case 3.1:
			case 4.1:
			case 5.2:
				rotateMatrix = this.rotateAroundWorldAxis(origin, xLine, 90 * Math.PI / 180 * (currentstamp - laststamp) / totalTime);
				break;
			case 2.1:
			case 3.2:
			case 4.2:
			case 5.1:
				rotateMatrix = this.rotateAroundWorldAxis(origin, xLine, -90 * Math.PI / 180 * (currentstamp - laststamp) / totalTime);
				break;
			default:
				break;
		}
		for (let i = 0; i < elements.length; i++) {
			elements[i].applyMatrix4(rotateMatrix);
		}
		if (!isAnimationEnd) {
			requestAnimationFrame(function (timestamp) {
				self.rotateAnimation(elements, direction, timestamp, startstamp, currentstamp, callback, totalTime);
			});
		} else {
			callback();
		}
	}

	/**
	 * 更新位置索引
	 */
	updateCubeIndex(elements) {
		for (let i = 0; i < elements.length; i++) {
			let temp1 = elements[i];
			for (let j = 0; j < this.initStatus.length; j++) {
				let temp2 = this.initStatus[j];
				if (Math.abs(temp1.position.x - temp2.x) <= BasicParams.len / 2 &&
					Math.abs(temp1.position.y - temp2.y) <= BasicParams.len / 2 &&
					Math.abs(temp1.position.z - temp2.z) <= BasicParams.len / 2) {
					temp1.cubeIndex = temp2.cubeIndex;
					break;
				}
			}
		}
	}

	/**
	 * 转动魔方
	 */
	rotateMove(cubeIndex, direction, callback, totalTime) {
		let self = this;
		totalTime = totalTime ? totalTime : this.defaultTotalTime;
		let elements = this.getBoxs(cubeIndex, direction);
		requestAnimationFrame(function (timestamp) {
			self.rotateAnimation(elements, direction, timestamp, 0, 0, function () {
				self.updateCubeIndex(elements);
				if (callback) {
					callback();
				}
			}, totalTime);
		});
	}

	/**
	 * 获取最小索引值
	 */
	getMinCubeIndex() {
		let ids = [];
		for (let i = 0; i < this.cubes.length; i++) {
			ids.push(this.cubes[i].cubeIndex);
		}
		this.minCubeIndex = Math.min.apply(null, ids);
	}

	/**
	 * 绕过点p的向量vector旋转一定角度
	 */
	rotateAroundWorldAxis(p, vector, rad) {
		vector.normalize();
		let u = vector.x;
		let v = vector.y;
		let w = vector.z;

		let a = p.x;
		let b = p.y;
		let c = p.z;

		let matrix4 = new THREE.Matrix4();

		matrix4.set(u * u + (v * v + w * w) * Math.cos(rad), u * v * (1 - Math.cos(rad)) - w * Math.sin(rad), u * w * (1 - Math.cos(rad)) + v * Math.sin(rad), (a * (v * v + w * w) - u * (b * v + c * w)) * (1 - Math.cos(rad)) + (b * w - c * v) * Math.sin(rad),
			u * v * (1 - Math.cos(rad)) + w * Math.sin(rad), v * v + (u * u + w * w) * Math.cos(rad), v * w * (1 - Math.cos(rad)) - u * Math.sin(rad), (b * (u * u + w * w) - v * (a * u + c * w)) * (1 - Math.cos(rad)) + (c * u - a * w) * Math.sin(rad),
			u * w * (1 - Math.cos(rad)) - v * Math.sin(rad), v * w * (1 - Math.cos(rad)) + u * Math.sin(rad), w * w + (u * u + v * v) * Math.cos(rad), (c * (u * u + v * v) - w * (a * u + b * v)) * (1 - Math.cos(rad)) + (a * v - b * u) * Math.sin(rad),
			0, 0, 0, 1);

		return matrix4;
	}

	//
	/*
	* E=>0.3, E'=>5.4
	* M=>2.4, M'=>3.4
	* S=>4.1, S'=>2.1
	*/
	U(next) {
		this.rotateMove(this.minCubeIndex, 1.3, next, 70);
	}
	R(next) {
		this.rotateMove(this.minCubeIndex, 2.4, next, 70);
	}
	F(next) {
		this.rotateMove(this.minCubeIndex, 3.1, next, 70);
	}
	D(next) {
		this.rotateMove(this.minCubeIndex + 6, 4.4, next, 70);
	}
	L(next) {
		this.rotateMove(this.minCubeIndex + 18, 1.1, next, 70);
	}
	B(next) {
		this.rotateMove(this.minCubeIndex + 2, 2.1, next, 70);
	}
	UP(next) {
		this.rotateMove(this.minCubeIndex, 4.4, next, 70);
	}
	RP(next) {
		this.rotateMove(this.minCubeIndex, 3.4, next, 70);
	}
	BP(next) {
		this.rotateMove(this.minCubeIndex + 2, 4.1, next, 70);
	}
	LP(next) {
		this.rotateMove(this.minCubeIndex + 18, 2.4, next, 70);
	}
	FP(next) {
		this.rotateMove(this.minCubeIndex, 2.1, next, 70);
	}
	DP(next) {
		this.rotateMove(this.minCubeIndex + 6, 1.3, next, 70);
	}
	E(next) {
		this.rotateMove(this.minCubeIndex + 4, 5.4, next, 70);
	}
	S(next) {
		this.rotateMove(this.minCubeIndex + 13, 4.1, next, 70);
	}
	M(next) {
		this.rotateMove(this.minCubeIndex + 10, 3.4, next, 70);
	}
	EP(next) {
		this.rotateMove(this.minCubeIndex + 4, 4.4, next, 70);
	}
	SP(next) {
		this.rotateMove(this.minCubeIndex + 13, 5.1, next, 70);
	}
	MP(next) {
		this.rotateMove(this.minCubeIndex + 10, 1.2, next, 70);
	}
	U2(next) {
		this.rotateMove(this.minCubeIndex, 1.3, () => {
			this.rotateMove(this.minCubeIndex, 1.3, next, 70);
		}, 70);
	}
	R2(next) {
		this.rotateMove(this.minCubeIndex, 2.4, () => {
			this.rotateMove(this.minCubeIndex, 2.4, next, 70);
		}, 70);
	}
	F2(next) {
		this.rotateMove(this.minCubeIndex, 4.1, () => {
			this.rotateMove(this.minCubeIndex, 4.1, next, 70);
		}, 70);
	}
	D2(next) {
		this.rotateMove(this.minCubeIndex, 4.4, () => {
			this.rotateMove(this.minCubeIndex, 4.4, next, 70);
		}, 70);
	}
	L2(next) {
		this.rotateMove(this.minCubeIndex + 18, 1.1, () => {
			this.rotateMove(this.minCubeIndex + 18, 1.1, next, 70);
		}, 70);
	}
	B2(next) {
		this.rotateMove(this.minCubeIndex, 3.2, () => {
			this.rotateMove(this.minCubeIndex, 3.2, next, 70);
		}, 70);
	}
	Rw(next) {
		this.rotateMove(this.minCubeIndex, 2.4, () => {
			this.rotateMove(this.minCubeIndex + 10, 1.2, next, 70);
		}, 70);
	}
	RwP(next) {
		this.rotateMove(this.minCubeIndex, 3.4, () => {
			this.rotateMove(this.minCubeIndex + 10, 3.4, next, 70);
		}, 70);
	}
	Uw(next) {
		this.rotateMove(this.minCubeIndex, 1.3, () => {
			this.rotateMove(this.minCubeIndex + 4, 5.4, next, 70);
		}, 70);
	}
	UwP(next) {
		this.rotateMove(this.minCubeIndex, 4.4, () => {
			this.rotateMove(this.minCubeIndex + 4, 4.4, next, 70);
		}, 70);
	}
	Fw(next) {
		this.rotateMove(this.minCubeIndex, 4.1, () => {
			this.rotateMove(this.minCubeIndex + 13, 4.1, next, 70);
		}, 70);
	}
	FwP(next) {
		this.rotateMove(this.minCubeIndex, 2.1, () => {
			this.rotateMove(this.minCubeIndex + 13, 5.1, next, 70);
		}, 70);
	}
	Dw(next) {
		this.rotateMove(this.minCubeIndex + 6, 4.4, () => {
			this.rotateMove(this.minCubeIndex + 4, 4.4, next, 70);
		}, 70);
	}
	DwP(next) {
		this.rotateMove(this.minCubeIndex + 6, 1.3, () => {
			this.rotateMove(this.minCubeIndex + 4, 5.4, next, 70);
		}, 70);
	}
	Rw2(next) {
		this.rotateMove(this.minCubeIndex, 2.4, () => {
			this.rotateMove(this.minCubeIndex + 10, 1.2, () => {
				this.rotateMove(this.minCubeIndex, 2.4, () => {
					this.rotateMove(this.minCubeIndex + 10, 1.2, next, 70);
				}, 70);
			}, 70);
		}, 70);
	}
	Dw2(next) {
		this.rotateMove(this.minCubeIndex + 6, 4.4, () => {
			this.rotateMove(this.minCubeIndex + 4, 4.4, () => {
				this.rotateMove(this.minCubeIndex + 6, 4.4, () => {
					this.rotateMove(this.minCubeIndex + 4, 4.4, next, 70);
				}, 70);
			}, 70);
		}, 70);
	}
	Fw2(next) {
		this.rotateMove(this.minCubeIndex, 4.1, () => {
			this.rotateMove(this.minCubeIndex + 13, 4.1, () => {
				this.rotateMove(this.minCubeIndex, 4.1, () => {
					this.rotateMove(this.minCubeIndex + 13, 4.1, next, 70);
				}, 70);
			}, 70);
		}, 70);
	}
	Rw2P(next) {
		this.rotateMove(this.minCubeIndex, 3.4, () => {
			this.rotateMove(this.minCubeIndex + 10, 3.4, () => {
				this.rotateMove(this.minCubeIndex, 3.4, () => {
					this.rotateMove(this.minCubeIndex + 10, 3.4, next, 70);
				}, 70);
			}, 70);
		}, 70);
	}
	Dw2P(next) {
		this.rotateMove(this.minCubeIndex + 6, 1.3, () => {
			this.rotateMove(this.minCubeIndex + 4, 5.4, () => {
				this.rotateMove(this.minCubeIndex + 6, 1.3, () => {
					this.rotateMove(this.minCubeIndex + 4, 5.4, next, 70);
				}, 70);
			}, 70);
		}, 70);
	}
	Fw2P(next) {
		this.rotateMove(this.minCubeIndex, 2.1, () => {
			this.rotateMove(this.minCubeIndex + 13, 5.1, () => {
				this.rotateMove(this.minCubeIndex, 2.1, () => {
					this.rotateMove(this.minCubeIndex + 13, 5.1, next, 70);
				}, 70);
			}, 70);
		}, 70);
	}

	//randomRotate
	randomRotate(callback) {
		const stepNum = 23;
		const self = this;
		const stepArr = RandomStep(stepNum).split(" ");
		// console.log(stepArr);
		self.runMethodAtNo(stepArr, 0, callback);
		return stepArr;
	}

	runMethodAtNo(stepArr, no, next) {
		const self = this;
		if (no >= stepArr.length - 1) {
			if (next) {
				this.moveStep[stepArr[no]](next);
			} else {
				this.moveStep[stepArr[no]]();
			}
		} else {
			self.moveStep[stepArr[no]](() => {
				if (no < stepArr.length - 1) {
					no++;
					self.runMethodAtNo(stepArr, no, next);
				}
			});
		}
	}

	stepMove(stepArr, no, next) {
		this.runMethodAtNo(stepArr, no, next);
	}

	//reset
	reset() {
		for (let i = 0; i < this.cubes.length; i++) {
			const matrix = this.cubes[i].matrix.clone();
			matrix.copy(matrix).invert();
			const cube = this.cubes[i];
			cube.applyMatrix4(matrix);

			for (let j = 0; j < this.initStatus.length; j++) {
				let status = this.initStatus[j];
				if (cube.id === status.cubeIndex) {
					cube.position.x = status.x;
					cube.position.y = status.y;
					cube.position.z = status.z;
					cube.cubeIndex = cube.id;
					break;
				}
			}
		}
	}

	rotateMoveWhole(cubeIndex, direction, callback, totalTime) {
		const self = this;
		if (cubeIndex && direction) {
			const time = totalTime ? totalTime : self.defaultTotalTime;
			const elements = self.cubes;
			requestAnimationFrame(function (timestamp) {
				self.rotateAnimation(elements, direction, timestamp, 0, 0, function () {
					self.updateCubeIndex(elements);
					callback && callback();
				}, time);
			}, totalTime);
		}
	}
}


/**
 * 返回一个正方体面
 * @param {*} rgbColor 
 * @returns canvas
 */
function face(rgbColor) {
	let canvas = document.createElement("canvas");
	canvas.width = 256;
	canvas.height = 256;
	let ctx = canvas.getContext("2d");
	ctx.save();
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.rect(16, 16, canvas.width - 16, canvas.height - 16);
	ctx.lineJoin = "round";
	ctx.lineWidth = 25;
	ctx.fillStyle = rgbColor;
	ctx.fill();
	ctx.strokeStyle = rgbColor;
	ctx.stroke();
	ctx.restore();
	return canvas;
}

/**
 * 返回立方体
 * @param {*} x 
 * @param {*} y 
 * @param {*} z 
 * @param {*} num 
 * @param {*} len 
 * @param {*} colors 
 * @returns cubes
 */
function SimpleCube(x, y, z, num, len, colors) {
	// 左上角坐标
	let [leftUpX, leftUpY, leftUpZ] = [(x - num / 2 * len), (y + num / 2 * len), (z + num / 2 * len)];
	let cubes = [];
	for (let i = 0; i < num; i++) {
		for (let j = 0; j < num * num; j++) {
			let facesArray = [];
			for (let k = 0; k < 6; k++) {
				facesArray[k] = face(colors[k])
			}
			let materials = [];
			for (let k = 0; k < 6; k++) {
				let texture = new THREE.Texture(facesArray[k]);
				texture.needsUpdate = true;
				materials.push(new THREE.MeshBasicMaterial({
					map: texture
				}));
			}
			let cubeGeometry = new THREE.BoxGeometry(len, len, len);
			let cube = new THREE.Mesh(cubeGeometry, materials);

			cube.position.x = (leftUpX + len / 2) + (j % num) * len;
			cube.position.y = (leftUpY - len / 2) - parseInt(j / num) * len;
			cube.position.z = (leftUpZ - len / 2) - i * len;
			// cube.scale.set(1,1,1);
			cubes.push(cube);
		}
	}
	return cubes;
}

export {
	Rubik
}