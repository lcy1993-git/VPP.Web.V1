import { useEffect, useRef } from "react";
import * as THREE from 'three';
import * as d3 from 'd3';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Outline from './image/outline.png';
import mapBg from './image/map-bg.png';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { OutlinePass } from 'three/examples/jsm/postprocessing/outlinePass';
import { EffectComposer } from 'three/examples/jsm/postprocessing/Effectcomposer';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader';
// import mapBg from './bg01.png';

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

  // 后期处理器
  const composer: any = useRef(null);

  // 光源
  const light: any = useRef(null);
 // 光源
  const amlight: any = useRef(null);


  // 初始化场景对象
  const initScene = () => {
    // !场景
    const scene = new THREE.Scene();
    // !添加点光源
    const pointLight = new THREE.PointLight(0xffffff);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);
    // // !添加环境光
    amlight.current = new THREE.AmbientLight(0xffffff);
    amlight.current.position.set(10, 10, 10);
    scene.add(amlight.current);
    // // 添加平行光
    light.current = new THREE.DirectionalLight(0xffffff);
    light.current.position.set(10, 10, 10);
    scene.add(light.current);


    // 辅助箭头    红色代表 X 轴. 绿色代表 Y 轴. 蓝色代表 Z 轴.
    // const axes = new THREE.AxesHelper(100);
    // scene.add(axes);
    viewScene.current = scene;
  };

  // 初始化相机
  const initCamera = (divWidth: number, divHeight: number) => {
    const camera = new THREE.PerspectiveCamera(2, divWidth / divHeight, 0.1, 1000);
    camera.position.set(0.09495576553561131, -1.0789913218408212, 9.961011790443024);
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
    control.enableRotate = true;
    // 禁止平移
    control.enablePan = false;
    // 设置控制器中心点
    control.target.set(0, 0, 0);
    control.minDistance = 8;
    control.maxDistance = 20;

    controls.current = control;
  };


  // 地图样式
  const normalStyle = () => {

    const textureLoader1 = new THREE.TextureLoader();
    const texture1 = textureLoader1.load(mapBg);
    // 替换为实际的图片路径
    texture1.wrapS = THREE.ClampToEdgeWrapping; // 水平方向纹理拉伸
    texture1.wrapT = THREE.ClampToEdgeWrapping; // 垂直方向纹理拉伸
    texture1.repeat.set(3, 3); // 纹理重复
    texture1.offset.set(0.5, 0.58); // 纹理偏移
    const material1 = new THREE.MeshStandardMaterial({ map: texture1 });
    // material1.opacity = 1; // 设置透明度为 0.5

    const textureLoader2 = new THREE.TextureLoader();
    const texture2 = textureLoader2.load(Outline);
    // 替换为实际的图片路径
    texture2.wrapS = THREE.ClampToEdgeWrapping; // 水平方向纹理拉伸
    texture2.wrapT = THREE.ClampToEdgeWrapping; // 垂直方向纹理拉伸
    texture2.repeat.set(3, 3); // 纹理重复
    texture2.offset.set(0.5, 0.58); // 纹理偏移
    const material2 = new THREE.MeshStandardMaterial({ map: texture2 });

    // 创建多重材质数组
    const materials = [material1, material2];
    return materials;
  };


// 使mesh轮廓发光
  const initoutlinePass = (mesh: any) => {
    const containrtWidth = chart_dom.current?.offsetWidth;
    const containrtHeight = chart_dom.current?.offsetHeight;
    const renderScene = new RenderPass(viewScene.current, viewCamera.current);
    const outlinePass = new OutlinePass(
      new THREE.Vector2(containrtWidth, containrtHeight),
      viewScene.current,
      viewCamera.current,
      [mesh]
    );
    // 将此通道结果渲染到屏幕
    // outlinePass.renderToScreen = true
    // outlinePass.edgeGlow = 1// 发光强度
    // // outlinePass.usePatternTexture = false // 是否使用纹理图案
    // outlinePass.edgeThickness = 10//边缘浓度
    // outlinePass.edgeStrength = 10 // 边缘的强度，值越高边框范围越大
    // outlinePass.pulsePeriod = 2//闪烁频率，值越大频率越低
    // outlinePass.visibleEdgeColor.set(0x87CEEB)// 呼吸显示的颜色outlinePass.hiddenEdgecolor.set('#ff0000')// 不可见边缘的颜色

    outlinePass.visibleEdgeColor.set(0xffffff); // 边缘可见部分发颜色 sColor[0].color
    outlinePass.hiddenEdgeColor.set(0xffffff); // 边缘遮挡部分发光颜色 sColor[1].color
    outlinePass.edgeStrength = Number(10.0); //边框的亮度
    outlinePass.edgeGlow = Number(1); //光晕[0,1]
    outlinePass.edgeThickness = Number(1.0); //边缘浓度
    outlinePass.pulsePeriod = Number(1.8); //呼吸闪烁的速度 闪烁频率 ，默认0 ，值越大频率越低
    outlinePass.usePatternTexture = false; //是否使用父级的材质
    outlinePass.downSampleRatio = 2; // 边框弯曲度
    outlinePass.clear = true;
    //将通道加入组合器
    const size = renderer.current.getSize(new THREE.Vector2());
    const _pixelRatio = renderer.current.getPixelRatio();
    const _width = size.width;
    const _height = size.height;
    const renderTarget = new THREE.WebGLRenderTarget(
      _width * _pixelRatio,
      _height * _pixelRatio,
      {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
        encoding: THREE.sRGBEncoding
      }
    );
    renderTarget.texture.name = "EffectComposer.rt1";
    composer.current = new EffectComposer(renderer.current, renderTarget);

    // composer.current = new EffectComposer(renderer.current); 

    const effectFXAA = new ShaderPass(FXAAShader);
    effectFXAA.uniforms['resolution'].value.set(1 / containrtWidth, 1 / containrtHeight);
    effectFXAA.renderToScreen = true;
    composer.current.addPass(effectFXAA);

    composer.current.addPass(renderScene);
    composer.current.addPass(outlinePass);
  }

  // 绘制地图
  const drawMap = (data: any) => {
    // 模型中心位置，该位置信息为坐标数据
    const projection = d3.geoMercator().center([104.300989, 30.607689]).scale(50).translate([0, 0]);

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
            pointsArray.push(new THREE.Vector3(x, -y, 0.05));
          }
          lineGeometry.setFromPoints(pointsArray);
          const extrudeSettings = {
            depth: 0.05,
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

    initoutlinePass(mapObj.current);
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
 
    function animate() {
      requestAnimationFrame(animate);

      controls.current.update();
      if (composer.current) {
        composer.current.render();
      }
      // renderer.current.render(viewScene.current, viewCamera.current);

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
