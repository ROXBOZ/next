// Kaleidoscope effect based on TLG Kaleidoscope (MIT License)
// https://github.com/the-lazy-god/tlg-kaleidoscope

let threeLoaded: Promise<void> | null = null;

function loadThree(): Promise<void> {
  if (threeLoaded) return threeLoaded;
  threeLoaded = new Promise((resolve, reject) => {
    if (typeof window !== "undefined" && (window as any).THREE) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/three-js@79.0.0/three.min.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Three.js"));
    document.head.appendChild(script);
  });
  return threeLoaded;
}

const vertex = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const fragment = `
precision mediump float;
uniform sampler2D uTexture;
uniform vec4 resolution;
uniform float uOpacity;
varying vec2 vUv;
const float PI = 3.14159265359;
uniform float segments;
uniform vec2 uOffset;
uniform float uRotation;
uniform float uOffsetAmount;
uniform float uRotationAmount;
uniform float uScaleFactor;
uniform float uImageAspect;

vec2 adjustUV(vec2 uv, vec2 offset, float rotation) {
  vec2 uvOffset = uv + offset * uOffsetAmount;
  float cosRot = cos(rotation * uRotationAmount);
  float sinRot = sin(rotation * uRotationAmount);
  mat2 rotMat = mat2(cosRot, -sinRot, sinRot, cosRot);
  return rotMat * (uvOffset - vec2(0.5)) + vec2(0.5);
}

void main() {
  vec2 newUV = (vUv - vec2(0.5)) * resolution.zw + vec2(0.5);
  vec2 uv = newUV * 2.0 - 1.0;
  float angle = atan(uv.y, uv.x);
  float radius = length(uv);
  float segment = PI * 2.0 / segments;
  angle = mod(angle, segment);
  angle = segment - abs(segment / 2.0 - angle);
  uv = radius * vec2(cos(angle), sin(angle));
  float scale = 1.0 / uScaleFactor;
  vec2 adjustedUV = adjustUV(uv * scale + scale, uOffset, uRotation);
  vec2 aspectCorrectedUV = vec2(adjustedUV.x, adjustedUV.y * uImageAspect);
  vec2 tileIndex = floor(aspectCorrectedUV);
  vec2 oddTile = mod(tileIndex, 2.0);
  vec2 mirroredUV = mix(fract(aspectCorrectedUV), 1.0 - fract(aspectCorrectedUV), oddTile);
  vec4 color = texture2D(uTexture, mirroredUV);
  color.a *= uOpacity;
  gl_FragColor = color;
}`;

interface KaleidoscopeOptions {
  container: HTMLElement;
  imageSrc: string;
  mode?: "loop" | "static" | "mouse" | "scroll";
  segments?: number;
  scale?: number;
  motion?: number;
  imageAspect?: number;
}

class Kaleidoscope {
  private scene: any;
  private camera: any;
  private renderer: any;
  private material: any;
  private container: HTMLElement;
  private width: number;
  private height: number;
  private mouse: { x: number; y: number };
  private isPlaying: boolean;
  private mode: string;
  private scaleFactor: number;
  private motionFactor: number;
  private segments: number;
  private imageAspect: number;
  private lastTime: number;
  private resizeHandler: () => void;
  private scrollHandler: (() => void) | null = null;

  constructor(options: KaleidoscopeOptions) {
    const THREE = (window as any).THREE;

    this.scene = new THREE.Scene();
    this.container = options.container;
    this.container.style.position = "relative";

    this.scaleFactor = options.scale ?? 1;
    this.motionFactor = options.motion ?? 1;
    this.mode = options.mode ?? "loop";
    this.segments = options.segments ?? 6;
    this.imageAspect = options.imageAspect ?? 1;
    this.lastTime = performance.now() / 1000;

    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;

    this.renderer = new THREE.WebGLRenderer({ alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.physicallyCorrectLights = true;
    this.renderer.outputEncoding = THREE.sRGBEncoding;

    const canvas = this.renderer.domElement;
    canvas.style.position = "absolute";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    this.container.appendChild(canvas);

    this.camera = new THREE.OrthographicCamera(
      -0.5,
      0.5,
      0.5,
      -0.5,
      -1000,
      1000,
    );
    this.camera.position.set(0, 0, 2);

    this.mouse = { x: 0, y: 0 };
    this.isPlaying = true;

    const texture = new THREE.TextureLoader().load(options.imageSrc);
    texture.minFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;

    this.material = new THREE.ShaderMaterial({
      extensions: {
        derivatives: "#extension GL_OES_standard_derivatives : enable",
      },
      side: THREE.DoubleSide,
      uniforms: {
        resolution: { value: new THREE.Vector4() },
        uTexture: { value: texture },
        uOpacity: { value: 1 },
        uOffset: { value: new THREE.Vector2(0, 0) },
        uRotation: { value: 0 },
        uRotationAmount: { value: 0.2 },
        uOffsetAmount: { value: 0.2 },
        segments: { value: this.segments },
        uScaleFactor: { value: this.scaleFactor },
        uImageAspect: { value: this.imageAspect },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
    });

    const geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
    const plane = new THREE.Mesh(geometry, this.material);
    this.scene.add(plane);

    this.resize();
    this.render();

    this.resizeHandler = this.resize.bind(this);
    window.addEventListener("resize", this.resizeHandler);

    if (this.mode === "mouse") {
      this.container.addEventListener("mousemove", this.onMouseMove);
      this.container.addEventListener("touchmove", this.onTouchMove);
    }
    if (this.mode === "scroll") {
      this.scrollHandler = this.handleScroll.bind(this);
      window.addEventListener("scroll", this.scrollHandler);
      this.handleScroll();
    }
  }

  private onMouseMove = (e: MouseEvent) => {
    const rect = this.container.getBoundingClientRect();
    this.mouse.x = (e.clientX - rect.left) / this.width;
    this.mouse.y = (e.clientY - rect.top) / this.height;
  };

  private onTouchMove = (e: TouchEvent) => {
    if (e.touches.length > 0) {
      const rect = this.container.getBoundingClientRect();
      this.mouse.x = (e.touches[0].clientX - rect.left) / this.width;
      this.mouse.y = (e.touches[0].clientY - rect.top) / this.height;
    }
  };

  private handleScroll() {
    const rect = this.container.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom >= 0) {
      const totalHeight = window.innerHeight + this.container.offsetHeight;
      const progress = (window.innerHeight - rect.top) / totalHeight;
      this.material.uniforms.uRotation.value =
        progress * Math.PI * 2 * this.motionFactor;
    }
  }

  private resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    if (this.width === 0 || this.height === 0) return;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    let a1: number, a2: number;
    if (this.height / this.width > 1) {
      a1 = (this.width / this.height) * 1;
      a2 = 1;
    } else {
      a1 = 1;
      a2 = this.height / this.width / 1;
    }

    this.material.uniforms.resolution.value.x = this.width;
    this.material.uniforms.resolution.value.y = this.height;
    this.material.uniforms.resolution.value.z = a1;
    this.material.uniforms.resolution.value.w = a2;
    this.camera.updateProjectionMatrix();
  }

  private render(time = 0) {
    if (!this.isPlaying) return;
    if (this.mode === "mouse" || this.mode === "loop") {
      this.updateDataTexture(time);
    }
    requestAnimationFrame(this.render.bind(this));
    this.renderer.render(this.scene, this.camera);
  }

  private updateDataTexture(time: number) {
    time /= 1000;
    if (this.mode === "mouse") {
      const offsetX = (this.mouse.x - 0.5) * 2 * this.motionFactor;
      const offsetY = (this.mouse.y - 0.5) * 2 * this.motionFactor;
      this.material.uniforms.uOffset.value.set(offsetX, offsetY);
      const rotation = Math.PI * (this.mouse.y - 0.5) * 2 * this.motionFactor;
      this.material.uniforms.uRotation.value = rotation;
    } else if (this.mode === "loop") {
      const deltaTime = time - this.lastTime;
      const rotationSpeed = 0.1;
      this.material.uniforms.uRotation.value +=
        rotationSpeed * this.motionFactor * deltaTime;
      this.lastTime = time;
    }
  }

  destroy() {
    this.isPlaying = false;
    window.removeEventListener("resize", this.resizeHandler);
    if (this.scrollHandler) {
      window.removeEventListener("scroll", this.scrollHandler);
    }
    this.container.removeEventListener("mousemove", this.onMouseMove);
    this.container.removeEventListener("touchmove", this.onTouchMove);
    if (
      this.renderer?.domElement &&
      this.container.contains(this.renderer.domElement)
    ) {
      this.container.removeChild(this.renderer.domElement);
    }
    this.renderer?.dispose();
  }
}

export async function createKaleidoscope(
  options: KaleidoscopeOptions,
): Promise<Kaleidoscope> {
  await loadThree();
  return new Kaleidoscope(options);
}
