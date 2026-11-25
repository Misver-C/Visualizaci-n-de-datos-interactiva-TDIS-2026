// ==========================================================
// 1. CONFIGURACIÓN CENTRALIZADA DE LA ESCENA Y PARÁMETROS
// ==========================================================
// Escala espacial: 1 unidad = 1 cm.
// La elevación máxima de 5.0 unidades equivale a ~5 cm sobre la superficie.

const SCENE_CONFIG = {
    surface: {
        width: 40,               // Proporción 4 (40 cm entre ejes extremos en X)
        depth: 30,               // Proporción 3 (30 cm entre ejes extremos en Z)
        columns: 4,              // 4 columnas de recuadros entre las 5 bandas verticales
        rows: 3,                 // 3 filas de recuadros entre las 4 bandas horizontales
        tabExtension: 2.4,       // Extensión perimetral de las bandas según imagen de referencia
        gridColor: 0x4a4a4a,     // Color solicitado #4a4a4a para líneas de cuadrícula
        gridLineWidth: 0.12,     // Grosor fino y uniforme de línea en el plano XZ
        baseColor: 0x16161a,     // Superficie soporte discreta
        baseOpacity: 0.82,
        recuadroOuterSize: 6.2,  // Marco exterior del recuadro no ocupado por bandas
        recuadroInnerSize: 4.5,  // Recuadro interior hundido (manzana)
        recuadroDepth: -0.18,    // Nivel de hundimiento sutil del recuadro respecto al plano Y=0
        recuadroDarkColor: 0x0b0d0f,
        recuadroMidColor: 0x222522
    },
    camera: {
        fov: 42,
        near: 0.1,
        far: 500,
        initialRadius: 66,
        minRadius: 34,
        maxRadius: 115,
        initialPolarAngle: 0.88, // Ángulo picado para apreciar relieve, bandas y etiquetas
        initialAzimuthAngle: 0.52,
        minPolarAngle: 0.30,     // Evita vista completamente cenital
        maxPolarAngle: 1.36,     // Evita vista frontal/rasante o atravesar la superficie
        autoRotateSpeed: 0.095,  // Velocidad orbital lenta, sutil y constante (rad/s)
        resumeRampSpeed: 1.8,    // Reanudación progresiva tras soltar el ratón
        dragSensitivity: 0.0065,
        dampingFactor: 10.0
    },
    bandDefaults: {
        width: 2.1,              // Ancho de banda plana según proporción de la referencia (cm)
        thickness: 0.22,         // Grosor / volumen tridimensional sutil (cm)
        maxElevation: 5.0,       // Altura de elevación máxima: ~5 cm
        animationSpeed: 6.5,     // Velocidad de respuesta suave al mantener hover
        returnDuration: 1.0,     // Retorno a posición original en ~1 segundo al salir del hover
        maxLateralOffset: 1.45,  // Límite de desplazamiento lateral elástico (cm)
        lateralSensitivity: 0.42,// Proporción de seguimiento horizontal del cursor
        lengthSegments: 88,      // Subdivisiones longitudinales para curvatura orgánica
        restColor: 0x8f949c,     // Acabado limpio y minimalista en estado inactivo
        activeColor: 0xd0d6e0    // Realce lumínico al elevarse en hover
    },
    bandLabelDefaults: {
        initialHeight: 0.42,     // Altura base flotando ligeramente sobre la banda inactiva
        hoverHeight: 1.15,       // Elevación adicional de la etiqueta sobre la banda en hover
        separation: 0.20,        // Separación mínima respecto a la cara superior de la banda
        textSize: 1.18,          // Tamaño de fuente en unidades 3D (cm)
        bloomIntensity: 0.52,    // Intensidad sutil del resplandor tipo Bloom en hover
        textColor: "#f1f5f9",
        bloomColor: "#93c5fd"
    },
    recuadroLabelDefaults: {
        size: 0.76,              // Tamaño del texto en los recuadros vacíos (cm)
        depth: -0.14,            // Hundimiento sutil por debajo del nivel de bandas (Y < 0)
        textColor: "#8a929e"     // Tono legible e integrado con la superficie hundida
    }
};

// ==========================================================
// 2. IDENTIFICACIÓN INDIVIDUAL DE LAS 9 BANDAS Y SUS ETIQUETAS
// ==========================================================
// Nomenclatura extraída directamente de la imagen de referencia:
// - 4 Bandas Horizontales (de norte/-Z a sur/+Z): Uruguay, Talcahuano, Libertad, Cerrito
// - 5 Bandas Verticales (de oeste/-X a este/+X): Av. Corrientes, Lavalle, Tucumán, Viamonte, Av. Córdoba

const HORIZONTAL_BAND_DEFINITIONS = [
    { id: "banda-uruguay",    labelId: "etiqueta-uruguay",    name: "Uruguay",    rowIndex: 0, labelOffsetX: 0.0 },
    { id: "banda-talcahuano", labelId: "etiqueta-talcahuano", name: "Talcahuano", rowIndex: 1, labelOffsetX: 0.0 },
    { id: "banda-libertad",   labelId: "etiqueta-libertad",   name: "Libertad",   rowIndex: 2, labelOffsetX: 0.0 },
    { id: "banda-cerrito",    labelId: "etiqueta-cerrito",    name: "Cerrito",    rowIndex: 3, labelOffsetX: 0.0 }
];

const VERTICAL_BAND_DEFINITIONS = [
    { id: "banda-av-corrientes", labelId: "etiqueta-av-corrientes", name: "Av. Corrientes", colIndex: 0, labelOffsetZ: 0.0 },
    { id: "banda-lavalle",       labelId: "etiqueta-lavalle",       name: "Lavalle",        colIndex: 1, labelOffsetZ: 0.0 },
    { id: "banda-tucuman",       labelId: "etiqueta-tucuman",       name: "Tucumán",        colIndex: 2, labelOffsetZ: 0.0 },
    { id: "banda-viamonte",      labelId: "etiqueta-viamonte",      name: "Viamonte",       colIndex: 3, labelOffsetZ: 0.0 },
    { id: "banda-av-cordoba",    labelId: "etiqueta-av-cordoba",    name: "Av. Córdoba",    colIndex: 4, labelOffsetZ: 0.0 }
];

function createBandsAndLabelsConfig() {
    const { width: surfW, depth: surfD, columns, rows, tabExtension } = SCENE_CONFIG.surface;
    const bandDef = SCENE_CONFIG.bandDefaults;
    const labelDef = SCENE_CONFIG.bandLabelDefaults;

    const halfW = surfW * 0.5;
    const halfD = surfD * 0.5;

    // Las bandas incluyen las pestañas perimetrales de la imagen de referencia
    const horizontalLength = surfW + bandDef.width + tabExtension * 2;
    const verticalLength = surfD + bandDef.width + tabExtension * 2;

    const bandsConfig = [];
    const bandLabelsConfig = [];

    // 4 Bandas Horizontales
    HORIZONTAL_BAND_DEFINITIONS.forEach((item, i) => {
        const t = item.rowIndex / rows; // 0, 1/3, 2/3, 1 -> z = -15, -5, +5, +15
        const zPos = -halfD + t * surfD;

        bandsConfig.push({
            id: item.id,
            name: item.name,
            labelId: item.labelId,
            orientation: "horizontal",
            width: bandDef.width,
            thickness: bandDef.thickness,
            length: horizontalLength,
            position: { x: 0, y: 0, z: zPos },
            maxElevation: bandDef.maxElevation,
            animationSpeed: bandDef.animationSpeed,
            returnDuration: bandDef.returnDuration,
            maxLateralOffset: bandDef.maxLateralOffset,
            lateralSensitivity: bandDef.lateralSensitivity,
            layerOffset: i * 0.0015
        });

        bandLabelsConfig.push({
            id: item.labelId,
            bandId: item.id,
            text: item.name,
            position: { x: item.labelOffsetX, y: 0, z: zPos },
            initialHeight: labelDef.initialHeight,
            hoverHeight: labelDef.hoverHeight,
            separation: labelDef.separation,
            initialOrientation: { x: -Math.PI * 0.5, y: 0, z: 0 },
            hoverOrientation: "camera",
            bloomIntensity: labelDef.bloomIntensity,
            textSize: labelDef.textSize
        });
    });

    // 5 Bandas Verticales
    VERTICAL_BAND_DEFINITIONS.forEach((item, j) => {
        const t = item.colIndex / columns; // 0, 1/4, 2/4, 3/4, 1 -> x = -20, -10, 0, +10, +20
        const xPos = -halfW + t * surfW;

        bandsConfig.push({
            id: item.id,
            name: item.name,
            labelId: item.labelId,
            orientation: "vertical",
            width: bandDef.width,
            thickness: bandDef.thickness,
            length: verticalLength,
            position: { x: xPos, y: 0, z: 0 },
            maxElevation: bandDef.maxElevation,
            animationSpeed: bandDef.animationSpeed,
            returnDuration: bandDef.returnDuration,
            maxLateralOffset: bandDef.maxLateralOffset,
            lateralSensitivity: bandDef.lateralSensitivity,
            layerOffset: 0.007 + j * 0.0015
        });

        bandLabelsConfig.push({
            id: item.labelId,
            bandId: item.id,
            text: item.name,
            position: { x: xPos, y: 0, z: item.labelOffsetZ },
            initialHeight: labelDef.initialHeight,
            hoverHeight: labelDef.hoverHeight,
            separation: labelDef.separation,
            // Orientado hacia arriba y alineado verticalmente con la banda (-90° en plano XZ)
            initialOrientation: { x: -Math.PI * 0.5, y: 0, z: Math.PI * 0.5 },
            hoverOrientation: "camera",
            bloomIntensity: labelDef.bloomIntensity,
            textSize: labelDef.textSize * 0.92
        });
    });

    return { bandsConfig, bandLabelsConfig };
}

// ==========================================================
// 3. CONFIGURACIÓN DE LOS RECUADROS NO OCUPADOS POR BANDAS
// ==========================================================
// En la imagen de referencia existen 12 recuadros interiores (4 columnas x 3 filas)
// delimitados por las bandas, además de la referencia lateral derecha "Paraguay".
// Dado que los cuadrados interiores de la imagen tienen relleno negro sólido sin texto
// legible en su interior, se asignan identificadores provisionales claramente diferenciados
// (isProvisional: true) según la regla de la Sección 3, modificables individualmente.

function createRecuadrosConfig() {
    const { width: surfW, depth: surfD, columns, rows } = SCENE_CONFIG.surface;
    const recLabelDef = SCENE_CONFIG.recuadroLabelDefaults;

    const cellW = surfW / columns; // 10 cm
    const cellD = surfD / rows;    // 10 cm
    const startX = -surfW * 0.5 + cellW * 0.5; // -15 cm
    const startZ = -surfD * 0.5 + cellD * 0.5; // -10 cm

    const recuadros = [];
    let index = 1;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            const cx = startX + c * cellW;
            const cz = startZ + r * cellD;
            const code = String(index).padStart(2, "0");

            // En la imagen de referencia:
            // - Los recuadros centrales de la fila media (r === 1, c >= 1) tienen tono gris oscuro (#222522)
            // - El recuadro inferior izquierdo (r === 2, c === 0) incluye una franja diagonal segmentada
            const isMidRowHighlight = (r === 1 && c >= 1);
            const hasDiagonalPassage = (r === 2 && c === 0);

            recuadros.push({
                id: `recuadro-${code}`,
                row: r,
                col: c,
                isProvisional: true,
                text: `R-${code}`, // Identificación provisional claramente diferenciada
                position: { x: cx, z: cz },
                size: recLabelDef.size,
                depth: recLabelDef.depth,
                rotationZ: 0,
                isMidRowHighlight,
                hasDiagonalPassage
            });

            index++;
        }
    }

    // Referencia lateral derecha "Paraguay" presente en el borde derecho de la fila central
    recuadros.push({
        id: "recuadro-paraguay",
        row: 1,
        col: 4,
        isProvisional: false,
        text: "Paraguay",
        position: { x: surfW * 0.5 + 2.35, z: 0 },
        size: recLabelDef.size * 1.05,
        depth: recLabelDef.depth,
        rotationZ: Math.PI * 0.5,
        isOuterReferenceOnly: true
    });

    return recuadros;
}

const { bandsConfig: BANDS_CONFIG, bandLabelsConfig: BAND_LABELS_CONFIG } = createBandsAndLabelsConfig();
const RECUADROS_CONFIG = createRecuadrosConfig();

// ==========================================================
// 4. GENERADOR DE TEXTURAS DE TEXTO Y BLOOM PARA ETIQUETAS 3D
// ==========================================================

function createLabelTextures(text, options = {}) {
    const {
        textColor = "#f1f5f9",
        bloomColor = "#93c5fd",
        fontWeight = "700",
        withBloom = true
    } = options;

    const canvasW = 512;
    const canvasH = 128;
    const aspect = canvasW / canvasH;

    // 1. Textura nítida principal del texto
    const textCanvas = document.createElement("canvas");
    textCanvas.width = canvasW;
    textCanvas.height = canvasH;
    const ctx = textCanvas.getContext("2d");

    ctx.clearRect(0, 0, canvasW, canvasH);
    ctx.font = `${fontWeight} 54px "Inter", "Segoe UI", Roboto, Helvetica, Arial, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = textColor;
    ctx.fillText(text, canvasW * 0.5, canvasH * 0.5);

    const textTexture = new THREE.CanvasTexture(textCanvas);
    textTexture.minFilter = THREE.LinearFilter;
    textTexture.magFilter = THREE.LinearFilter;
    textTexture.needsUpdate = true;

    let bloomTexture = null;

    // 2. Textura difuminada tipo Bloom detrás del texto (solo para etiquetas de bandas)
    if (withBloom) {
        const bloomCanvas = document.createElement("canvas");
        bloomCanvas.width = canvasW;
        bloomCanvas.height = canvasH;
        const bCtx = bloomCanvas.getContext("2d");

        bCtx.clearRect(0, 0, canvasW, canvasH);

        // Halo elíptico suave de fondo + silueta de texto con desenfoque múltiple
        const radial = bCtx.createRadialGradient(
            canvasW * 0.5, canvasH * 0.5, 6,
            canvasW * 0.5, canvasH * 0.5, canvasW * 0.36
        );
        radial.addColorStop(0, "rgba(147, 197, 253, 0.38)");
        radial.addColorStop(0.55, "rgba(147, 197, 253, 0.14)");
        radial.addColorStop(1, "rgba(147, 197, 253, 0.0)");

        bCtx.fillStyle = radial;
        bCtx.fillRect(0, 0, canvasW, canvasH);

        bCtx.font = `${fontWeight} 54px "Inter", "Segoe UI", Roboto, Helvetica, Arial, sans-serif`;
        bCtx.textAlign = "center";
        bCtx.textBaseline = "middle";
        bCtx.shadowColor = bloomColor;
        bCtx.shadowBlur = 24;
        bCtx.fillStyle = bloomColor;
        bCtx.fillText(text, canvasW * 0.5, canvasH * 0.5);
        bCtx.shadowBlur = 14;
        bCtx.fillText(text, canvasW * 0.5, canvasH * 0.5);

        bloomTexture = new THREE.CanvasTexture(bloomCanvas);
        bloomTexture.minFilter = THREE.LinearFilter;
        bloomTexture.magFilter = THREE.LinearFilter;
        bloomTexture.needsUpdate = true;
    }

    return { textTexture, bloomTexture, aspect };
}

// ==========================================================
// 5. COMPONENTE DE ETIQUETA 3D DE BANDA (BandLabel3D)
// ==========================================================

class BandLabel3D {
    constructor(config, band, scene) {
        this.config = config;
        this.id = config.id;
        this.bandId = config.bandId;
        this.band = band;
        this.scene = scene;

        // Factor de interpolación suave entre estado inactivo (0) y estado activo en hover (1)
        this.activeBlend = 0;

        this.qInactive = new THREE.Quaternion();
        this.qActive = new THREE.Quaternion();
        this.lookMatrix = new THREE.Matrix4();
        this.upVector = new THREE.Vector3(0, 1, 0);

        this.buildLabelMesh();
    }

    buildLabelMesh() {
        const { textTexture, bloomTexture, aspect } = createLabelTextures(this.config.text, {
            textColor: SCENE_CONFIG.bandLabelDefaults.textColor,
            bloomColor: SCENE_CONFIG.bandLabelDefaults.bloomColor,
            withBloom: true
        });

        this.aspect = aspect;
        this.group = new THREE.Group();
        this.group.name = this.id;

        const planeHeight = this.config.textSize;
        const planeWidth = planeHeight * aspect;

        // Plano de resplandor tipo Bloom sutil situado detrás del texto
        const bloomGeo = new THREE.PlaneGeometry(planeWidth * 1.12, planeHeight * 1.35);
        this.bloomMat = new THREE.MeshBasicMaterial({
            map: bloomTexture,
            transparent: true,
            opacity: 0,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            side: THREE.DoubleSide
        });
        this.bloomMesh = new THREE.Mesh(bloomGeo, this.bloomMat);
        this.bloomMesh.position.set(0, 0, -0.03);
        this.group.add(this.bloomMesh);

        // Plano principal del texto 3D
        const textGeo = new THREE.PlaneGeometry(planeWidth, planeHeight);
        this.textMat = new THREE.MeshBasicMaterial({
            map: textTexture,
            transparent: true,
            opacity: 0.94,
            depthWrite: false,
            side: THREE.DoubleSide
        });
        this.textMesh = new THREE.Mesh(textGeo, this.textMat);
        this.group.add(this.textMesh);

        // Orientación inicial acostada horizontalmente sobre la banda mirando hacia arriba (+Y)
        const initEuler = new THREE.Euler(
            this.config.initialOrientation.x,
            this.config.initialOrientation.y,
            this.config.initialOrientation.z,
            "XYZ"
        );
        this.qInactive.setFromEuler(initEuler);
        this.group.quaternion.copy(this.qInactive);

        this.updateTransform(null, 0);
        this.scene.add(this.group);
    }

    // Permite modificar el texto de la etiqueta de manera independiente
    setText(newText) {
        this.config.text = newText;
        const { textTexture, bloomTexture } = createLabelTextures(newText, {
            textColor: SCENE_CONFIG.bandLabelDefaults.textColor,
            bloomColor: SCENE_CONFIG.bandLabelDefaults.bloomColor,
            withBloom: true
        });
        this.textMat.map.dispose();
        this.textMat.map = textTexture;
        this.bloomMat.map.dispose();
        this.bloomMat.map = bloomTexture;
    }

    updateTransform(camera, dt) {
        const band = this.band;
        const isHorizontal = band.config.orientation === "horizontal";

        // Evaluar elevación y desplazamiento lateral de la banda en la posición de la etiqueta
        const sampleCoord = isHorizontal ? this.config.position.x : this.config.position.z;
        const { elevationAtPoint, lateralAtPoint } = band.getDisplacementAtCoordinate(sampleCoord);

        // Sincronizar factor de activación [0..1] con el estado de hover y elevación de la banda
        const elevationRatio = THREE.MathUtils.clamp(
            band.currentElevation / Math.max(0.001, band.config.maxElevation),
            0,
            1
        );
        const targetBlend = band.isHovered ? Math.max(0.25, elevationRatio) : elevationRatio;
        const smoothFactor = dt > 0 ? (1 - Math.exp(-10.0 * dt)) : 1.0;
        this.activeBlend = THREE.MathUtils.lerp(this.activeBlend, targetBlend, smoothFactor);

        // Posición 3D sincronizada con la geometría elevada y desplazada de la banda
        const baseTopY = band.config.thickness + this.config.separation;
        const restY = Math.max(baseTopY, this.config.initialHeight);
        const extraHoverY = this.config.hoverHeight * this.activeBlend;

        const worldX = isHorizontal
            ? this.config.position.x
            : this.config.position.x + lateralAtPoint;

        const worldZ = isHorizontal
            ? this.config.position.z + lateralAtPoint
            : this.config.position.z;

        const worldY = restY + elevationAtPoint + extraHoverY;

        this.group.position.set(worldX, worldY, worldZ);

        // Orientación inicial (acostada mirando hacia +Y)
        const initEuler = new THREE.Euler(
            this.config.initialOrientation.x,
            this.config.initialOrientation.y,
            this.config.initialOrientation.z,
            "XYZ"
        );
        this.qInactive.setFromEuler(initEuler);

        // Orientación en hover hacia la cámara activa (billboard suave)
        if (camera && this.config.hoverOrientation === "camera") {
            this.lookMatrix.lookAt(camera.position, this.group.position, this.upVector);
            this.qActive.setFromRotationMatrix(this.lookMatrix);
        } else {
            this.qActive.copy(this.qInactive);
        }

        // Interpolación esférica fluida entre orientación inactiva y activa
        this.group.quaternion.copy(this.qInactive).slerp(this.qActive, this.activeBlend);

        // Activación y desaparición gradual del resplandor Bloom sutil
        this.bloomMat.opacity = this.config.bloomIntensity * this.activeBlend;
        this.textMat.opacity = THREE.MathUtils.lerp(0.90, 1.0, this.activeBlend);
    }
}

// ==========================================================
// 6. COMPONENTE DE ETIQUETA EN RECUADRO VACÍO (RecuadroLabel3D)
// ==========================================================

class RecuadroLabel3D {
    constructor(config, scene) {
        this.config = config;
        this.id = config.id;
        this.scene = scene;

        this.buildMesh();
    }

    buildMesh() {
        const { textTexture, aspect } = createLabelTextures(this.config.text, {
            textColor: SCENE_CONFIG.recuadroLabelDefaults.textColor,
            fontWeight: "600",
            withBloom: false
        });

        const planeHeight = this.config.size;
        const planeWidth = planeHeight * aspect;

        const geo = new THREE.PlaneGeometry(planeWidth, planeHeight);
        this.material = new THREE.MeshBasicMaterial({
            map: textTexture,
            transparent: true,
            opacity: 0.85,
            depthWrite: false,
            side: THREE.DoubleSide
        });

        this.mesh = new THREE.Mesh(geo, this.material);
        this.mesh.name = this.id;

        // Posicionado dentro del recuadro, ligeramente más hundido que las bandas (depth < 0)
        this.mesh.position.set(
            this.config.position.x,
            this.config.depth,
            this.config.position.z
        );

        // Acostado sobre el plano de la superficie, orientado hacia arriba (+Y)
        this.mesh.rotation.order = "XYZ";
        this.mesh.rotation.set(-Math.PI * 0.5, 0, this.config.rotationZ || 0);

        this.scene.add(this.mesh);
    }

    setText(newText) {
        this.config.text = newText;
        const { textTexture } = createLabelTextures(newText, {
            textColor: SCENE_CONFIG.recuadroLabelDefaults.textColor,
            fontWeight: "600",
            withBloom: false
        });
        this.material.map.dispose();
        this.material.map = textTexture;
    }
}

// ==========================================================
// 7. CLASE ELASTIC BAND (Hover Persistente y Retorno en ~1s)
// ==========================================================

class ElasticBand {
    constructor(config, scene) {
        this.config = config;
        this.id = config.id;
        this.name = config.name;
        this.scene = scene;
        this.label = null;

        // Estado: 'IDLE' | 'HOVERED' | 'RETURNING'
        this.state = "IDLE";
        this.isHovered = false;
        this.returnElapsed = 0;

        // Variables físicas de deformación
        this.currentElevation = 0;
        this.currentLateral = 0;
        this.targetLateral = 0;
        this.returnStartElevation = 0;
        this.returnStartLateral = 0;

        // Punto longitudinal normalizado [0.18..0.82] donde el cursor concentra la tensión
        this.contactNormU = 0.5;
        this.targetNormU = 0.5;
        this.initialContactTransverse = null;

        this.baseColor = new THREE.Color(SCENE_CONFIG.bandDefaults.restColor);
        this.activeColor = new THREE.Color(SCENE_CONFIG.bandDefaults.activeColor);

        this.buildGeometry();
    }

    buildGeometry() {
        const {
            orientation,
            width,
            thickness,
            length,
            position,
            layerOffset = 0
        } = this.config;

        const segments = SCENE_CONFIG.bandDefaults.lengthSegments;
        const isHorizontal = orientation === "horizontal";

        const sizeX = isHorizontal ? length : width;
        const sizeY = thickness;
        const sizeZ = isHorizontal ? width : length;
        const segX = isHorizontal ? segments : 1;
        const segZ = isHorizontal ? 1 : segments;

        this.geometry = new THREE.BoxGeometry(sizeX, sizeY, sizeZ, segX, 1, segZ);
        this.geometry.translate(0, sizeY * 0.5 + layerOffset, 0);

        const posAttr = this.geometry.attributes.position;
        this.restPositions = new Float32Array(posAttr.array.length);
        this.restPositions.set(posAttr.array);

        this.material = new THREE.MeshStandardMaterial({
            color: this.baseColor.clone(),
            roughness: 0.42,
            metalness: 0.08
        });

        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.name = this.id;
        this.mesh.position.set(position.x, position.y, position.z);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        this.mesh.userData.band = this;

        // Geometría colisionadora en posición de reposo exacta para mantener el hover estable
        // cuando la malla visual se eleva bajo el cursor, sin ampliar la zona de detección
        const restColliderGeo = new THREE.BoxGeometry(sizeX, sizeY, sizeZ);
        restColliderGeo.translate(0, sizeY * 0.5 + layerOffset, 0);
        const restColliderMat = new THREE.MeshBasicMaterial({
            visible: false
        });
        this.restColliderMesh = new THREE.Mesh(restColliderGeo, restColliderMat);
        this.restColliderMesh.position.set(position.x, position.y, position.z);
        this.restColliderMesh.userData.band = this;

        this.scene.add(this.mesh);
        this.scene.add(this.restColliderMesh);
    }

    extractLocalCoordinates(worldPoint) {
        const { orientation, length, position } = this.config;
        const isHorizontal = orientation === "horizontal";

        const longCoord = isHorizontal
            ? (worldPoint.x - position.x)
            : (worldPoint.z - position.z);

        const transCoord = isHorizontal
            ? (worldPoint.z - position.z)
            : (worldPoint.x - position.x);

        const normU = THREE.MathUtils.clamp((longCoord / length) + 0.5, 0.18, 0.82);
        return { normU, transCoord };
    }

    // Evalúa el perfil de arco elástico para una coordenada longitudinal dada
    computeArchProfileAtNormalizedS(s) {
        const peakU = this.contactNormU;
        let warpedS;
        if (s <= peakU) {
            warpedS = 0.5 * (s / Math.max(0.001, peakU));
        } else {
            warpedS = 0.5 + 0.5 * ((s - peakU) / Math.max(0.001, 1 - peakU));
        }
        return Math.pow(Math.sin(Math.PI * warpedS), 1.25);
    }

    getDisplacementAtCoordinate(longitudinalWorldCoord) {
        const { orientation, length, position } = this.config;
        const centerCoord = orientation === "horizontal" ? position.x : position.z;
        const localU = longitudinalWorldCoord - centerCoord;
        const s = THREE.MathUtils.clamp((localU + length * 0.5) / length, 0, 1);
        const profile = this.computeArchProfileAtNormalizedS(s);

        return {
            elevationAtPoint: this.currentElevation * profile,
            lateralAtPoint: this.currentLateral * profile
        };
    }

    // Activa o mantiene el hover persistente mientras el cursor permanece sobre la banda
    onCursorHover(worldPoint) {
        const { normU, transCoord } = this.extractLocalCoordinates(worldPoint);

        if (!this.isHovered) {
            this.isHovered = true;
            this.state = "HOVERED";
            this.initialContactTransverse = transCoord;
            this.targetNormU = normU;
            if (this.currentElevation < 0.05) {
                this.contactNormU = normU;
            }
        }

        this.updateCursorTracking(worldPoint);
    }

    // Actualiza la posición longitudinal y el desplazamiento lateral mientras dura el hover
    updateCursorTracking(worldPoint) {
        if (!this.isHovered || !worldPoint) return;

        const { normU, transCoord } = this.extractLocalCoordinates(worldPoint);
        this.targetNormU = normU;

        if (this.initialContactTransverse === null) {
            this.initialContactTransverse = transCoord;
        }

        const rawDelta = transCoord - this.initialContactTransverse;
        const maxLat = this.config.maxLateralOffset;
        const sens = this.config.lateralSensitivity;

        this.targetLateral = maxLat * Math.tanh((rawDelta * sens) / Math.max(0.001, maxLat));
    }

    // Inicia el retorno (~1 segundo) únicamente cuando el cursor abandona la banda
    onCursorLeave() {
        if (!this.isHovered) return;
        this.isHovered = false;
        this.initialContactTransverse = null;
        this.targetLateral = 0;

        if (this.currentElevation <= 0.001 && Math.abs(this.currentLateral) <= 0.001) {
            this.resetToRest();
            return;
        }

        this.state = "RETURNING";
        this.returnElapsed = 0;
        this.returnStartElevation = this.currentElevation;
        this.returnStartLateral = this.currentLateral;
    }

    update(dt, camera) {
        if (this.state === "HOVERED") {
            // Elevación suave y sostenida hacia maxElevation (~5 cm) mientras continúe el hover
            const riseBlend = 1 - Math.exp(-this.config.animationSpeed * dt);
            this.currentElevation = THREE.MathUtils.lerp(
                this.currentElevation,
                this.config.maxElevation,
                riseBlend
            );

            // Seguimiento continuo de la posición horizontal del cursor
            const followLerp = 1 - Math.exp(-14.0 * dt);
            this.currentLateral = THREE.MathUtils.lerp(this.currentLateral, this.targetLateral, followLerp);
            this.contactNormU = THREE.MathUtils.lerp(this.contactNormU, this.targetNormU, followLerp);

            this.applyDeformation();
        } else if (this.state === "RETURNING") {
            this.returnElapsed += dt;
            const duration = Math.max(0.05, this.config.returnDuration);
            const p = Math.min(this.returnElapsed / duration, 1.0);

            // Retorno progresivo en ~1 segundo con interpolación suave y relajación elástica
            const cosineEase = 0.5 * (1 + Math.cos(Math.PI * p));
            const verticalFactor = cosineEase * Math.pow(1 - p, 0.75);
            const lateralFactor = Math.pow(1 - p, 2.1) * Math.cos(1.45 * Math.PI * p);

            this.currentElevation = this.returnStartElevation * verticalFactor;
            this.currentLateral = this.returnStartLateral * lateralFactor;
            this.contactNormU = THREE.MathUtils.lerp(this.contactNormU, 0.5, dt * 3.5);

            if (p >= 1.0) {
                this.resetToRest();
            } else {
                this.applyDeformation();
            }
        }

        if (this.label) {
            this.label.updateTransform(camera, dt);
        }
    }

    applyDeformation() {
        const posAttr = this.geometry.attributes.position;
        const arr = posAttr.array;
        const rest = this.restPositions;

        const { orientation, length, maxElevation } = this.config;
        const isHorizontal = orientation === "horizontal";
        const halfLen = length * 0.5;

        for (let i = 0; i < arr.length; i += 3) {
            const rx = rest[i];
            const ry = rest[i + 1];
            const rz = rest[i + 2];

            const uCoord = isHorizontal ? rx : rz;
            const s = THREE.MathUtils.clamp((uCoord + halfLen) / length, 0, 1);
            const archProfile = this.computeArchProfileAtNormalizedS(s);

            const dy = this.currentElevation * archProfile;
            const dLat = this.currentLateral * archProfile;

            arr[i] = isHorizontal ? rx : rx + dLat;
            arr[i + 1] = ry + dy;
            arr[i + 2] = isHorizontal ? rz + dLat : rz;
        }

        posAttr.needsUpdate = true;
        this.geometry.computeVertexNormals();
        this.geometry.computeBoundingBox();
        this.geometry.computeBoundingSphere();

        const tensionRatio = THREE.MathUtils.clamp(
            this.currentElevation / Math.max(0.01, maxElevation),
            0,
            1
        );
        this.material.color.lerpColors(this.baseColor, this.activeColor, tensionRatio);
    }

    resetToRest() {
        this.state = "IDLE";
        this.isHovered = false;
        this.returnElapsed = 0;
        this.currentElevation = 0;
        this.currentLateral = 0;
        this.targetLateral = 0;
        this.returnStartElevation = 0;
        this.returnStartLateral = 0;
        this.contactNormU = 0.5;
        this.targetNormU = 0.5;
        this.initialContactTransverse = null;

        const posAttr = this.geometry.attributes.position;
        posAttr.array.set(this.restPositions);
        posAttr.needsUpdate = true;

        this.geometry.computeVertexNormals();
        this.geometry.computeBoundingBox();
        this.geometry.computeBoundingSphere();
        this.material.color.copy(this.baseColor);
    }
}

// ==========================================================
// 8. CONSTRUCCIÓN DE LA SUPERFICIE BASE Y RECUADROS (4x3)
// ==========================================================

function buildBaseSurfaceAndRecuadros(scene) {
    const {
        width,
        depth,
        columns,
        rows,
        tabExtension,
        gridColor,
        gridLineWidth,
        baseColor,
        baseOpacity,
        recuadroOuterSize,
        recuadroInnerSize,
        recuadroDepth,
        recuadroDarkColor,
        recuadroMidColor
    } = SCENE_CONFIG.surface;

    const bandW = SCENE_CONFIG.bandDefaults.width;
    const totalW = width + bandW + tabExtension * 2;
    const totalD = depth + bandW + tabExtension * 2;

    const surfaceGroup = new THREE.Group();
    surfaceGroup.name = "superficie-base";

    // Plano general de soporte discreto en XZ
    const baseGeo = new THREE.PlaneGeometry(totalW, totalD);
    baseGeo.rotateX(-Math.PI * 0.5);
    baseGeo.translate(0, recuadroDepth - 0.04, 0);

    const baseMat = new THREE.MeshStandardMaterial({
        color: baseColor,
        roughness: 0.92,
        metalness: 0.02,
        transparent: true,
        opacity: baseOpacity
    });

    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.receiveShadow = true;
    surfaceGroup.add(baseMesh);

    const gridMat = new THREE.MeshBasicMaterial({
        color: gridColor,
        side: THREE.DoubleSide
    });

    const linePositions = [];
    const halfW = width * 0.5;
    const halfD = depth * 0.5;

    // 5 ejes verticales de la cuadrícula (#4a4a4a)
    for (let c = 0; c <= columns; c++) {
        const x = -halfW + (c / columns) * width;
        const stripGeo = new THREE.PlaneGeometry(gridLineWidth, totalD);
        stripGeo.rotateX(-Math.PI * 0.5);
        stripGeo.translate(x, 0.001, 0);
        surfaceGroup.add(new THREE.Mesh(stripGeo, gridMat));

        linePositions.push(x, 0.002, -totalD * 0.5, x, 0.002, totalD * 0.5);
    }

    // 4 ejes horizontales de la cuadrícula (#4a4a4a)
    for (let r = 0; r <= rows; r++) {
        const z = -halfD + (r / rows) * depth;
        const stripGeo = new THREE.PlaneGeometry(totalW, gridLineWidth);
        stripGeo.rotateX(-Math.PI * 0.5);
        stripGeo.translate(0, 0.001, z);
        surfaceGroup.add(new THREE.Mesh(stripGeo, gridMat));

        linePositions.push(-totalW * 0.5, 0.002, z, totalW * 0.5, 0.002, z);
    }

    // Construcción 3D de los recuadros que no están ocupados por bandas (según imagen de referencia)
    const darkBlockMat = new THREE.MeshStandardMaterial({
        color: recuadroDarkColor,
        roughness: 0.88,
        metalness: 0.04
    });

    const midBlockMat = new THREE.MeshStandardMaterial({
        color: recuadroMidColor,
        roughness: 0.85,
        metalness: 0.05
    });

    const stripeMat = new THREE.MeshBasicMaterial({
        color: 0xd8dee9,
        side: THREE.DoubleSide
    });

    RECUADROS_CONFIG.forEach((rec) => {
        if (rec.isOuterReferenceOnly) return;

        const { x: cx, z: cz } = rec.position;
        const halfOuter = recuadroOuterSize * 0.5;

        // Marco fino #4a4a4a del recuadro sobre la superficie
        const yFrame = 0.003;
        linePositions.push(
            cx - halfOuter, yFrame, cz - halfOuter, cx + halfOuter, yFrame, cz - halfOuter,
            cx + halfOuter, yFrame, cz - halfOuter, cx + halfOuter, yFrame, cz + halfOuter,
            cx + halfOuter, yFrame, cz + halfOuter, cx - halfOuter, yFrame, cz + halfOuter,
            cx - halfOuter, yFrame, cz + halfOuter, cx - halfOuter, yFrame, cz - halfOuter
        );

        // Cuadrado interior hundido respecto al nivel de las bandas
        const innerGeo = new THREE.PlaneGeometry(recuadroInnerSize, recuadroInnerSize);
        innerGeo.rotateX(-Math.PI * 0.5);
        innerGeo.translate(cx, recuadroDepth, cz);

        const innerMesh = new THREE.Mesh(
            innerGeo,
            rec.isMidRowHighlight ? midBlockMat : darkBlockMat
        );
        innerMesh.receiveShadow = true;
        surfaceGroup.add(innerMesh);

        // Elemento diagonal segmentado en el recuadro inferior izquierdo (fiel a la referencia)
        if (rec.hasDiagonalPassage) {
            const passageGroup = new THREE.Group();
            passageGroup.position.set(cx, recuadroDepth + 0.012, cz);
            passageGroup.rotation.y = Math.PI * 0.25;

            const numRungs = 9;
            const span = recuadroInnerSize * 1.12;
            const rungW = 0.28;
            const rungD = 0.72;

            for (let k = 0; k < numRungs; k++) {
                const offset = -span * 0.5 + (k / (numRungs - 1)) * span;
                const rungGeo = new THREE.PlaneGeometry(rungW, rungD);
                rungGeo.rotateX(-Math.PI * 0.5);
                rungGeo.translate(offset, 0, 0);
                passageGroup.add(new THREE.Mesh(rungGeo, stripeMat));
            }
            surfaceGroup.add(passageGroup);
        }
    });

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.Float32BufferAttribute(linePositions, 3));
    const lineSegments = new THREE.LineSegments(
        lineGeo,
        new THREE.LineBasicMaterial({ color: gridColor })
    );
    surfaceGroup.add(lineSegments);

    scene.add(surfaceGroup);
    return surfaceGroup;
}

// ==========================================================
// 9. CONTROLADOR DE CÁMARA ORBITAL (Auto-rotación + Órbita libre)
// ==========================================================

class OrbitalCameraController {
    constructor(camera, domElement) {
        this.camera = camera;
        this.domElement = domElement;
        this.cfg = SCENE_CONFIG.camera;

        this.target = new THREE.Vector3(0, 0, 0);

        this.radius = this.cfg.initialRadius;
        this.targetRadius = this.cfg.initialRadius;

        this.polarAngle = this.cfg.initialPolarAngle;
        this.targetPolarAngle = this.cfg.initialPolarAngle;

        this.azimuthAngle = this.cfg.initialAzimuthAngle;
        this.targetAzimuthAngle = this.cfg.initialAzimuthAngle;

        this.isDragging = false;
        this.previousPointerPos = { x: 0, y: 0 };

        this.autoRotateBlend = 1.0;
        this.timeSinceInteraction = 10.0;

        this.bindEvents();
        this.updateCameraTransform();
    }

    bindEvents() {
        this.domElement.addEventListener("pointerdown", (e) => {
            if (e.button !== 0) return;
            this.isDragging = true;
            this.previousPointerPos.x = e.clientX;
            this.previousPointerPos.y = e.clientY;

            this.autoRotateBlend = 0;
            this.timeSinceInteraction = 0;
            this.domElement.classList.add("is-dragging");
        });

        window.addEventListener("pointermove", (e) => {
            if (!this.isDragging) return;

            const dx = e.clientX - this.previousPointerPos.x;
            const dy = e.clientY - this.previousPointerPos.y;
            this.previousPointerPos.x = e.clientX;
            this.previousPointerPos.y = e.clientY;

            this.targetAzimuthAngle -= dx * this.cfg.dragSensitivity;
            this.targetPolarAngle = THREE.MathUtils.clamp(
                this.targetPolarAngle - dy * this.cfg.dragSensitivity,
                this.cfg.minPolarAngle,
                this.cfg.maxPolarAngle
            );

            this.autoRotateBlend = 0;
            this.timeSinceInteraction = 0;
        });

        const endDrag = () => {
            if (!this.isDragging) return;
            this.isDragging = false;
            this.timeSinceInteraction = 0;
            this.domElement.classList.remove("is-dragging");
        };

        window.addEventListener("pointerup", endDrag);
        window.addEventListener("pointercancel", endDrag);

        this.domElement.addEventListener(
            "wheel",
            (e) => {
                e.preventDefault();
                this.targetRadius = THREE.MathUtils.clamp(
                    this.targetRadius + e.deltaY * 0.035,
                    this.cfg.minRadius,
                    this.cfg.maxRadius
                );
            },
            { passive: false }
        );
    }

    update(dt) {
        if (!this.isDragging) {
            this.timeSinceInteraction += dt;
            if (this.timeSinceInteraction > 0.25) {
                this.autoRotateBlend = THREE.MathUtils.clamp(
                    this.autoRotateBlend + dt * this.cfg.resumeRampSpeed,
                    0,
                    1
                );
            }
            this.targetAzimuthAngle += this.cfg.autoRotateSpeed * this.autoRotateBlend * dt;
        }

        const smooth = 1 - Math.exp(-this.cfg.dampingFactor * dt);
        this.azimuthAngle = THREE.MathUtils.lerp(this.azimuthAngle, this.targetAzimuthAngle, smooth);
        this.polarAngle = THREE.MathUtils.lerp(this.polarAngle, this.targetPolarAngle, smooth);
        this.radius = THREE.MathUtils.lerp(this.radius, this.targetRadius, smooth);

        this.updateCameraTransform();
    }

    updateCameraTransform() {
        const sinPhi = Math.sin(this.polarAngle);
        const cosPhi = Math.cos(this.polarAngle);
        const sinTheta = Math.sin(this.azimuthAngle);
        const cosTheta = Math.cos(this.azimuthAngle);

        this.camera.position.set(
            this.target.x + this.radius * sinPhi * sinTheta,
            this.target.y + this.radius * cosPhi,
            this.target.z + this.radius * sinPhi * cosTheta
        );

        this.camera.lookAt(this.target);
    }
}

// ==========================================================
// 10. SISTEMA DE INTERACCIÓN ESPACIAL 3D (HOVER PERSISTENTE)
// ==========================================================

class BandInteractionManager {
    constructor(camera, domElement, bands) {
        this.camera = camera;
        this.domElement = domElement;
        this.bands = bands;
        this.activeHoveredBand = null;

        // Lista de geometrías de detección (malla visual + huella en reposo de cada banda)
        // Las etiquetas de texto quedan excluidas para no interferir nunca con el raycasting
        this.raycastTargets = [];
        bands.forEach((b) => {
            this.raycastTargets.push(b.mesh, b.restColliderMesh);
        });

        this.raycaster = new THREE.Raycaster();
        this.pointerNDC = new THREE.Vector2(-999, -999);
        this.hasValidPointer = false;
        this.horizontalPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
        this.planeHitPoint = new THREE.Vector3();

        this.bindEvents();
    }

    bindEvents() {
        this.domElement.addEventListener("pointermove", (e) => {
            const rect = this.domElement.getBoundingClientRect();
            this.pointerNDC.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            this.pointerNDC.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
            this.hasValidPointer = true;
        });

        this.domElement.addEventListener("pointerleave", () => {
            this.hasValidPointer = false;
            this.clearActiveHover();
        });
    }

    clearActiveHover() {
        if (this.activeHoveredBand) {
            this.activeHoveredBand.onCursorLeave();
            this.activeHoveredBand = null;
        }
        this.domElement.classList.remove("is-hovering-band");
    }

    update(isDraggingCamera) {
        if (!this.hasValidPointer || isDraggingCamera) {
            this.clearActiveHover();
            return;
        }

        this.raycaster.setFromCamera(this.pointerNDC, this.camera);

        // Intersección directa contra la geometría 3D de las bandas
        const hits = this.raycaster.intersectObjects(this.raycastTargets, false);

        if (hits.length > 0) {
            // Priorizar la banda actualmente activa si el cursor sigue en contacto con ella
            let selectedHit = hits[0];
            if (this.activeHoveredBand) {
                const activeMatch = hits.find((h) => h.object.userData.band === this.activeHoveredBand);
                if (activeMatch) {
                    selectedHit = activeMatch;
                }
            }

            const hitBand = selectedHit.object.userData.band;

            if (this.activeHoveredBand && this.activeHoveredBand !== hitBand) {
                this.activeHoveredBand.onCursorLeave();
            }

            this.activeHoveredBand = hitBand;

            // Proyectar sobre el plano horizontal de la banda para seguimiento lateral continuo
            this.horizontalPlane.constant = -hitBand.currentElevation * 0.45;
            if (this.raycaster.ray.intersectPlane(this.horizontalPlane, this.planeHitPoint)) {
                hitBand.onCursorHover(this.planeHitPoint);
            } else {
                hitBand.onCursorHover(selectedHit.point);
            }

            this.domElement.classList.add("is-hovering-band");
        } else {
            this.clearActiveHover();
        }
    }
}

// ==========================================================
// 11. REGISTRO GLOBAL Y ACCESO POR IDENTIFICADOR
// ==========================================================

const SCENE_REGISTRY = {
    bandsById: new Map(),
    bandLabelsById: new Map(),
    recuadroLabelsById: new Map(),

    getBand(id) {
        return this.bandsById.get(id) || null;
    },
    getBandLabel(id) {
        return this.bandLabelsById.get(id) || null;
    },
    getRecuadroLabel(id) {
        return this.recuadroLabelsById.get(id) || null;
    }
};

window.SCENE_REGISTRY = SCENE_REGISTRY;

// ==========================================================
// 12. INICIALIZACIÓN Y BUCLE PRINCIPAL DE RENDERIZADO
// ==========================================================

function initInteractiveScene() {
    const container = document.getElementById("scene-container");

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
        SCENE_CONFIG.camera.fov,
        window.innerWidth / window.innerHeight,
        SCENE_CONFIG.camera.near,
        SCENE_CONFIG.camera.far
    );

    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance"
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // Iluminación para resaltar volumen 3D de las bandas y relieve de los recuadros
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.74);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.95);
    dirLight.position.set(18, 44, 26);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.near = 10;
    dirLight.shadow.camera.far = 120;
    dirLight.shadow.camera.left = -32;
    dirLight.shadow.camera.right = 32;
    dirLight.shadow.camera.top = 32;
    dirLight.shadow.camera.bottom = -32;
    dirLight.shadow.bias = -0.0008;
    scene.add(dirLight);

    const rimLight = new THREE.DirectionalLight(0x9fb3c8, 0.35);
    rimLight.position.set(-24, 20, -22);
    scene.add(rimLight);

    // 1. Construir superficie 4:3, cuadrícula #4a4a4a y recuadros hundidos de la referencia
    buildBaseSurfaceAndRecuadros(scene);

    // 2. Construir las 9 bandas identificadas individualmente (4H + 5V)
    const bands = BANDS_CONFIG.map((cfg) => {
        const band = new ElasticBand(cfg, scene);
        SCENE_REGISTRY.bandsById.set(band.id, band);
        return band;
    });

    // 3. Construir y vincular las etiquetas 3D de cada banda
    BAND_LABELS_CONFIG.forEach((labelCfg) => {
        const band = SCENE_REGISTRY.getBand(labelCfg.bandId);
        if (band) {
            const label = new BandLabel3D(labelCfg, band, scene);
            band.label = label;
            SCENE_REGISTRY.bandLabelsById.set(label.id, label);
        }
    });

    // 4. Construir los textos 3D acostados y ligeramente hundidos en los recuadros vacíos
    RECUADROS_CONFIG.forEach((recCfg) => {
        const recLabel = new RecuadroLabel3D(recCfg, scene);
        SCENE_REGISTRY.recuadroLabelsById.set(recLabel.id, recLabel);
    });

    // 5. Controlador de cámara orbital y gestor de interacción de hover persistente
    const cameraController = new OrbitalCameraController(camera, renderer.domElement);
    const interactionManager = new BandInteractionManager(camera, renderer.domElement, bands);

    window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    });

    let lastTime = performance.now();

    function animate(now) {
        requestAnimationFrame(animate);

        const dt = Math.min((now - lastTime) * 0.001, 0.05);
        lastTime = now;

        cameraController.update(dt);
        interactionManager.update(cameraController.isDragging);

        for (let i = 0; i < bands.length; i++) {
            bands[i].update(dt, camera);
        }

        renderer.render(scene, camera);
    }

    requestAnimationFrame(animate);
}

document.addEventListener("DOMContentLoaded", initInteractiveScene);
