import { useEffect, useRef } from "react";
import * as THREE from 'three';
// import * as THREE from './js/three.js';
import * as d3 from 'd3';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Outline from './image/outline.png';
import mapBg from './image/map-bg.png';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { OutlinePass } from 'three/examples/jsm/postprocessing/outlinePass';
import { EffectComposer } from 'three/examples/jsm/postprocessing/Effectcomposer';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader';
import h337 from 'heatmap.js';
import Mark1 from './image/mark1.png';
// import h337 from './js/heatmap.js';
// import mapBg from './bg01.png';

interface ThreeMapInfo {
  isHeatmap?: boolean; // 是否加载热力图
}


const ThreeMap = (props: ThreeMapInfo) => {
  const { isHeatmap = false } = props;
  const chart_dom: any = useRef(null);
  const heat_dom: any = useRef(null);
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

  // 热力图相关
  let geometry: any, material: any, mesh: any, texture: any;

  // 顶点着色器渲染
  // 根据高度图调整顶点的位置，从而实现对热力图的高度显示效果
  const vertexShader = `
  uniform sampler2D heightMap;
  uniform float heightRatio;
  varying vec2 vUv;
  varying float hValue;
  varying vec3 cl;
  void main() {
      vUv = uv;
      vec3 pos = position;
        cl = texture2D(heightMap, vUv).rgb;
        hValue = texture2D(heightMap, vUv).r;
        pos.y = hValue * heightRatio;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos,1.0);
    }
  `;

  const vertexShaderRef: any = useRef(null);

  // 根据顶点高度值和颜色信息，计算出片段的颜色，从而实现对热力图的渲染效果
  const fragmentShader = `
  varying float hValue;
			varying vec3 cl;
			void main() {
		 		float v = abs(hValue - 1.);
		 		gl_FragColor = vec4(cl, .8 - v * v) ;
		    }
`;
  const fragmentShaderRef: any = useRef(null);


  // 初始化场景对象
  const initScene = () => {
    // 场景
    const scene = new THREE.Scene();
    // 添加点光源
    const pointLight = new THREE.PointLight(0xffffff);
    // pointLight.position.set(10, 10, 10);
    scene.add(pointLight);
    // 添加环境光
    amlight.current = new THREE.AmbientLight(0xffffff);
    // amlight.current.position.set(10, 10, 10);
    scene.add(amlight.current);
    // 添加平行光
    light.current = new THREE.DirectionalLight(0xffffff);
    // light.current.position.set(10, 10, 10);
    scene.add(light.current);


    // 辅助箭头    红色代表 X 轴. 绿色代表 Y 轴. 蓝色代表 Z 轴.
    // const axes = new THREE.AxesHelper(100);
    // scene.add(axes);
    viewScene.current = scene;
  };

  // 初始化相机
  const initCamera = (divWidth: number, divHeight: number) => {
    const camera = new THREE.PerspectiveCamera(2, divWidth / divHeight, 1, 10000);
    // camera.position.set(0.09495576553561131, -1.0789913218408212, 9.961011790443024);
    if (isHeatmap)
      camera.position.set(-13.179706235621579, 895.0838483998507, 83.07607286622547);
    else
      camera.position.set(-41.32864202838264, 831.5910748493473, 340.6301189988112);

    viewCamera.current = camera;
  };

  // 初始化渲染器
  const initRenderer = (divWidth: number, divHeight: number) => {
    // !3、渲染器
    const renderObj = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // 渲染器 alpha: 背景图片
    renderObj.setSize(divWidth, divHeight); // 渲染器大小
    renderObj.setPixelRatio(window.devicePixelRatio);
    renderObj.outputEncoding = 3001;
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
    control.target.set(0, 0, 2);
    // control.minDistance = 8;
    // control.maxDistance = 20;

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
    // outlinePass.pulsePeriod = Number(1.8); //呼吸闪烁的速度 闪烁频率 ，默认0 ，值越大频率越低
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
        encoding: 3001
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
          geometry.scale(100, 100, 100);
          geometry.rotateX(Math.PI * 1.5);
          geometry.translate(0, -3, 0);
          const mesh = new THREE.Mesh(geometry, normalStyle());
          lineGeometry.scale(100, 100, 100);
          lineGeometry.rotateX(Math.PI * 1.5);
          lineGeometry.translate(0, -3, 0);
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

    // if (!isHeatmap)
    //   initoutlinePass(mapObj.current);
    viewScene.current.add(mapObj.current)
  }

  // 加载json文件，准备绘制地图
  const drawShapeOptionFun = function () {
    const loader = new THREE.FileLoader();
    loader.load('/jsonData/510112_full.json', (data: any) => {
      drawMap(JSON.parse(data))
    });
  };


  const getRandom = (max: any, min: any) => {
    return Math.round((Math.random() * (max - min + 1) + min) * 10) / 10;
  }

  const animateHeatmap = () => {
    let time = 0;
    const maxHeight = 6; // 最大高度
    const minHeight = 4; // 最小高度
    const animationSpeed = 0.04; // 动画速度调整

    const animate = () => {
      time += animationSpeed;
      const height = minHeight + Math.sin(time) * (maxHeight - minHeight); // 根据正弦函数计算高度

      material.uniforms.heightRatio.value = height; // 设置高度

      requestAnimationFrame(animate); // 递归调用requestAnimationFrame，实现动画效果
    };

    animate();
  };

  // 添加标注
  const addMark = (position_: any) => {
    const projection = d3.geoMercator().center([104.300989, 30.607689]).scale(5000).translate([0, 0]);
    const [x, y] = projection(position_);
    const position = new THREE.Vector3(x, -y, 0);

    // 创建一个点位图片
    const textureLoader = new THREE.TextureLoader();
    const spriteTexture = textureLoader.load(Mark1); // 替换为实际的图片路径
    const spriteMaterial = new THREE.SpriteMaterial({ map: spriteTexture });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.position.copy(position); // 设置图片位置

    sprite.scale.set(5, 5, 5); // 设置图片大小

    sprite.rotation.x = Math.PI * 1.5;
    // 设置平移
    console.log(sprite.position);

    const translation = new THREE.Vector3(0, 0, 0); // 平移向量
    sprite.position.add(translation); // 平移点位
    viewScene.current.add(sprite);
    // viewCamera.current.look
  };


  const onWindowResize = () => {
    // const width = chart_dom.current?.offsetWidth;
    // const height = chart_dom.current?.offsetHeight;
    // viewCamera.current.aspect = width / height;
    // viewCamera.current.updateProjectionMatrix();
    // renderer.current.setSize( width, height);

    console.log(chart_dom.current);

    viewCamera.current.aspect = chart_dom.current.clientWidth / chart_dom.current.clientHeight;
    console.log(chart_dom.current.clientWidth,  chart_dom.current.clientHeight);

    viewCamera.current.updateProjectionMatrix();
    renderer.current.setSize(chart_dom.current.clientWidth, chart_dom.current.clientHeight);

    if (renderer.current) {
      const rendererDomElement = renderer.current.domElement;
      if (rendererDomElement.parentNode === chart_dom.current) {
        chart_dom.current.removeChild(rendererDomElement);
      }

      if (chart_dom?.current) {
        const containrtWidth = chart_dom.current?.offsetWidth;
        const containrtHeight = chart_dom.current?.offsetHeight;
        initMap(containrtWidth, containrtHeight)

      }
    }
  }

  // 添加热力图
  const initHeatmap = () => {
    let heatmap = h337.create({
      container: heat_dom.current,
      width: 256,
      height: 256,
      blur: '.8',
      radius: 6
    });
    const projection = d3.geoMercator().center([104.300989, 30.607689]).scale(5000).translate([0, 0]);
    let i = 0, max = 6, data = [];
    while (i < 200) {
      // 生成指定范围内的随机经度
      const randomLon = 104.20566118664469 + Math.random() * (104.43389055234029 - 104.20566118664469);
      // 生成指定范围内的随机纬度
      const randomLat = 30.490946342140475 + Math.random() * (30.674863928145456 - 30.490946342140475);
      const lont = [randomLon, randomLat]
      const [x, y] = projection(lont)
      // data.push({ x: getRandom( 128 + x * (256 / 50), 128 + x * (256 / 50)), y: getRandom(28 + y * (256 / 50), 128 + y * (256 / 50)), value: getRandom(1, 6) });
      data.push({ x: parseFloat((128 + x * (256 / 50)).toFixed(1)), y: parseFloat((128 + y * (256 / 50)).toFixed(1)), value: getRandom(1, 6) });
      i++;
    }

    heatmap.setData({
      max: max,
      data: data
    });

    texture = new THREE.Texture(heatmap._renderer.canvas);
    geometry = new THREE.PlaneGeometry(50, 50, 1000, 1000);
    geometry.rotateX(-Math.PI * 0.5);
    material = new THREE.ShaderMaterial({
      uniforms: {
        heightMap: { value: texture },
        heightRatio: { value: 5 }
      },
      vertexShader: vertexShaderRef.current.textContent,
      fragmentShader: fragmentShaderRef.current.textContent,
      transparent: true,
    });

    // console.log(vertexShaderRef.current.textContent);
    // console.log(fragmentShaderRef.current.textContent);
    mesh = new THREE.Mesh(geometry, material);
    viewScene.current.add(mesh);
    // initGui();
    // animateHeatmap();
  }

  // 初始化三维场景
  const initMap = (width: number, height: number) => {
    mapObj.current = new THREE.Object3D()
    initScene();
    initCamera(width, height);
    initRenderer(width, height);
    initControls()
    drawShapeOptionFun()
    window.addEventListener( 'resize', onWindowResize );

    if (isHeatmap)
      initHeatmap();

    function animate() {
      requestAnimationFrame(animate);
      if (texture)
        texture.needsUpdate = true;
      controls.current.update();
      // console.log(viewCamera.current.position);

      // if (!isHeatmap && composer.current)
      //   composer.current.render();
      // if (isHeatmap)
        renderer.current.render(viewScene.current, viewCamera.current);

    }
    animate();
  };

  useEffect(() => {
    if (chart_dom?.current) {
      const containrtWidth = chart_dom.current?.offsetWidth;
      const containrtHeight = chart_dom.current?.offsetHeight;
      initMap(containrtWidth, containrtHeight)

    }
    return () =>{
      if (chart_dom?.current) {
        window.removeEventListener('resize', onWindowResize);
      }

      // 清空场景中的对象
      // viewScene.current.remove(mapObj.current);

       // 从DOM中移除渲染器的canvas元素
       chart_dom.current?.removeChild(renderer.current.domElement);

       // 从DOM中移除渲染器
      // if (renderer.current) {
      //   const rendererDomElement = renderer.current.domElement;
      //   if (rendererDomElement.parentNode === chart_dom.current) {
      //     chart_dom.current.removeChild(rendererDomElement);
      //   }
      // }
    }
  }, []);

  return <>
    <script type="x-shader/x-vertex" ref={vertexShaderRef}>
      {vertexShader}
    </script>
    <script type="x-shader/x-vertex" ref={fragmentShaderRef}>
      {fragmentShader}
    </script>

    { isHeatmap && <div id="heatmap-canvas" style={{ display: 'none' }} ref={heat_dom}></div>}
    <div id="three-map" style={{ width: '100%', height: '100%' }} ref={chart_dom}></div>

  </>

}
export default ThreeMap
