import { useEffect, useRef } from "react";
import * as THREE from 'three';
import * as d3 from 'd3';
import * as turf from 'turf';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Outline from './outline.png';

const ThreeMap = () => {
  const chart_dom: any = useRef(null);
  // 场景对象
  const viewScene: any = useRef(null);
  // 相机对象
  const viewCamera: any = useRef(null);
  // 渲染器对象
  const renderer: any = useRef(null);
  // 轨道控制器
  const controls: any = useRef(null);
  // 创建一个空对象，存放map
  const mapObj: any = useRef(null);


    // 初始化场景对象
    const initScene = () => {
      // !场景
      const scene = new THREE.Scene();
      // !添加点光源
      const pointLight = new THREE.PointLight(0xffffff);
      scene.add(pointLight);
      // !添加环境光
      const amlight = new THREE.AmbientLight(0xffffff);
      scene.add(amlight);
      // 添加平行光
      const light = new THREE.DirectionalLight(0xffffff);
      scene.add(light);
      // 辅助箭头    红色代表 X 轴. 绿色代表 Y 轴. 蓝色代表 Z 轴.
      // const axes = new THREE.AxesHelper(100);
      // scene.add(axes);
      viewScene.current = scene;
    };

    // 初始化相机
    const initCamera = (divWidth: number, divHeight: number) => {
      const camera = new THREE.PerspectiveCamera(2, divWidth / divHeight, 0.1, 1000);
      camera.position.set( 0.07495576553561131,  -0.8789913218408212, 9.961011790443024);
      viewCamera.current = camera;
    };

    // 初始化渲染器
    const initRenderer = (divWidth: number, divHeight: number) => {
      // !3、渲染器
      const renderObj = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // 渲染器 alpha: 背景图片
      renderObj.setSize(divWidth, divHeight); // 渲染器大小
      renderObj.setPixelRatio(window.devicePixelRatio);
      renderObj.outputEncoding = THREE.sRGBEncoding;
      renderObj.shadowMap.enabled = true;
      document.getElementById('three-map')?.appendChild(renderObj.domElement); // 渲染器添加到元素中
      renderer.current = renderObj;
    };

      // 初始化控制器
  const initControls = () => {
    // 轨道控制器
    const control = new OrbitControls(viewCamera.current, renderer.current?.domElement);
    // 设置控制器阻尼效果，旋转物体时更加真实
    control.enableDamping = false;
    // 是否可以缩放
    control.enableZoom = true;
    // 是否可以旋转
    control.enableRotate = false;
    // 禁止平移
    control.enablePan = false;
    // 设置控制器中心点
    control.target.set(0, 0, 0);
    control.minDistance = 10;
    control.maxDistance = 22;

    controls.current = control;
  };


    // 地图样式
    const normalStyle = () => {
      const material = new THREE.MeshPhongMaterial({
        color: '#4161ff',
        transparent: true,
        opacity: 0.8,
        side: THREE.FrontSide,
        depthTest: true,
      });
      // 使用TextureLoader加载贴图
      const textureLoader = new THREE.TextureLoader();
      const texture = textureLoader.load(Outline); // 替换为实际的图片路径
      const material2 = new THREE.MeshBasicMaterial({ map: texture });
      return [material, material2];
    };

    // 绘制地图
    const drawMap = (data: any) => {
      // 模型中心位置，该位置信息为坐标数据
      const projection = d3.geoMercator().center([104.300989,30.607689]).scale(50).translate([0, 0]);

      data.features.forEach((elem: any) => {
        // 定一个省份3D对象
        const province = new THREE.Object3D();
        // 每个的 坐标 数组
        const coordinates = elem.geometry.coordinates;

        // 循环坐标数组
        coordinates.forEach((multiPolygon: any) => {
          multiPolygon.forEach((polygon: any) => {
            const shape = new THREE.Shape();
            const lineMaterial = new THREE.LineBasicMaterial({
              // 线的颜色
              color: '#fff',
              transparent: true,
              opacity: 0.8,
              depthFunc: THREE.AlwaysDepth,
            });
            const lineGeometry = new THREE.BufferGeometry();
            const pointsArray = new Array();
            for (let i = 0; i < polygon.length; i++) {
              const [x, y] = projection(polygon[i]);
              if (i === 0) {
                shape.moveTo(x, -y);
              }
              shape.lineTo(x, -y);
              pointsArray.push(new THREE.Vector3(x, -y, 0.1 + 0.01));
            }
            lineGeometry.setFromPoints(pointsArray);
            const extrudeSettings = {
              depth: 0.1,
              bevelEnabled: false, // 对挤出的形状应用是否斜角
            };
            const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
            const mesh = new THREE.Mesh(geometry, normalStyle());
            const line = new THREE.Line(lineGeometry, lineMaterial);
            // 将省份的属性 加进来
            province.properties = elem.properties;

            // 将城市信息放到模型中，后续做动画用
            if (elem.properties.centroid) {
              const [x, y] = projection(elem.properties.centroid); // uv映射坐标
              province.properties._centroid = [x, y];
            }
            province.add(mesh);
            province.add(line);
          });
        });
        mapObj.current.add(province);
      });
      viewScene.current.add(mapObj.current)
    }

  // 加载json文件，准备绘制地图
  const drawShapeOptionFun = function () {
    const loader = new THREE.FileLoader();
    loader.load('/jsonData/510112_full.json', (data: any) => {
      drawMap(JSON.parse(data))
    });
  };


  // 初始化三维场景
  const initMap = (width: number, height: number) => {
    mapObj.current = new THREE.Object3D();
    initScene();
    initCamera(width, height);
    initRenderer(width, height);
    initControls()
    drawShapeOptionFun()
    // 调用渲染器
    function animate() {
      controls.current.update();
      requestAnimationFrame(animate);
      renderer.current.render(viewScene.current, viewCamera.current);
    }
    animate();
  };

  useEffect(() => {
    if (chart_dom?.current) {
      const containrtWidth = chart_dom.current?.offsetWidth;
      const containrtHeight = chart_dom.current?.offsetHeight;
      initMap(containrtWidth, containrtHeight);
    }
  }, []);

  return <div id="three-map" style={{ width: '100%', height: '100%' }} ref={chart_dom}></div>
}
export default ThreeMap
