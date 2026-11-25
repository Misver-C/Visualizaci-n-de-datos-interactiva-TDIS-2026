// ==========================================================
// 1. CONFIGURACIÓN GENERAL DE ESCENA, CROMATISMO E INTERACCIÓN
// ==========================================================
// Escala espacial: 1 unidad = 1 cm.
// Elevación máxima de las bandas: 5.0 unidades (~5 cm).

const SCENE_CONFIG = {
    surface: {
        width: 40,               // Proporción 4 (40 cm entre ejes extremos en X)
        depth: 30,               // Proporción 3 (30 cm entre ejes extremos en Z)
        columns: 4,              // 4 columnas entre las 5 bandas verticales
        rows: 3,                 // 3 filas entre las 4 bandas horizontales
        tabExtension: 2.6,       // Extensión perimetral de las bandas
        gridColor: 0x4a4a4a,     // Color base de líneas de cuadrícula (#4a4a4a)
        gridLineWidth: 0.12,
        baseColor: 0x15161a,
        baseOpacity: 0.85,
        recuadroOuterSize: 6.2,
        recuadroInnerSize: 4.5,
        recuadroDepth: -0.18,
        recuadroDarkColor: 0x0b0d0f,
        recuadroMidColor: 0x202320
    },
    camera: {
        fov: 42,
        near: 0.1,
        far: 500,
        initialRadius: 66,
        minRadius: 34,
        maxRadius: 115,
        initialPolarAngle: 0.86, // Ángulo picado
        initialAzimuthAngle: 0.50,
        minPolarAngle: 0.28,
        maxPolarAngle: 1.36,
        autoRotateSpeed: 0.095,  // Rotación orbital lenta y continua (rad/s)
        pauseDecelSpeed: 6.0,    // Desaceleración suave al activar una banda
        resumeAccelSpeed: 2.2,   // Aceleración progresiva al finalizar la interacción
        dragSensitivity: 0.0065,
        dampingFactor: 10.0
    },
    bandDefaults: {
        width: 2.1,
        thickness: 0.22,
        maxElevation: 5.0,       // ~5 cm
        animationSpeed: 6.8,
        returnDuration: 1.0,     // ~1 segundo de retorno al salir del hover
        maxLateralOffset: 1.4,
        lateralSensitivity: 0.42,
        lengthSegments: 96,      // Alta resolución longitudinal para cruces e intersecciones
        hitboxWidthRatio: 0.86   // Hitbox ajustada para evitar activaciones involuntarias
    },
    chromatic: {
        // Rango de normalización para la cantidad absoluta de la categoría predominante
        // Se ajusta automáticamente con los datos reales [minDominant..maxDominant]
        minNormalizedIntensity: 0.22, // Evita que bandas con pocas respuestas desaparezcan
        maxNormalizedIntensity: 1.00, // Evita saturación excesiva que oculte el relieve 3D
        categories: {
            green: {
                hue: 144 / 360,
                minSat: 0.44,
                maxSat: 0.80,
                minLight: 0.34,
                maxLight: 0.54
            },
            yellow: {
                hue: 43 / 360,
                minSat: 0.58,
                maxSat: 0.90,
                minLight: 0.40,
                maxLight: 0.58
            },
            red: {
                hue: 7 / 360,
                minSat: 0.54,
                maxSat: 0.84,
                minLight: 0.38,
                maxLight: 0.54
            }
        }
    },
    bandLabelDefaults: {
        initialHeight: 0.42,
        hoverHeight: 1.25,
        separation: 0.20,
        textSize: 1.16,
        orientationInDuration: 0.22,  // Giro completo hacia cámara en la fase inicial del hover
        orientationOutDuration: 0.82, // Regreso progresivo a orientación acostada al salir
        maxBloomIntensity: 0.38
    },
    intertramoLabelDefaults: {
        size: 0.62,
        depth: -0.13
    }
};

// ==========================================================
// 2. BASE DE DATOS CENTRALIZADA (16 REGISTROS INDIVIDUALES)
// ==========================================================
// Los valores absolutos (green, yellow, red) son la fuente principal de verdad.

const INITIAL_RAW_RECORDS = [
    // 4 Bandas Horizontales
    {
        id: "banda-uruguay",
        type: "horizontal",
        name: "Uruguay",
        green: 6,
        yellow: 4,
        red: 1,
        rowIndex: 0
    },
    {
        id: "banda-talcahuano",
        type: "horizontal",
        name: "Talcahuano",
        green: 17,
        yellow: 4,
        red: 2,
        rowIndex: 1
    },
    {
        id: "banda-libertad",
        type: "horizontal",
        name: "Libertad",
        green: 18,
        yellow: 5,
        red: 0,
        rowIndex: 2
    },
    {
        id: "banda-cerrito",
        type: "horizontal",
        name: "Cerrito",
        green: 8,
        yellow: 10,
        red: 3,
        rowIndex: 3
    },

    // 3 Intertramos Horizontales
    {
        id: "intertramo-h-uruguay-talcahuano",
        type: "intertramo_horizontal",
        name: "Entre Uruguay y Talcahuano",
        shortLabel: "Uruguay – Talcahuano",
        green: 1,
        yellow: 1,
        red: 0,
        betweenRows: [0, 1]
    },
    {
        id: "intertramo-h-talcahuano-libertad",
        type: "intertramo_horizontal",
        name: "Entre Talcahuano y Libertad",
        shortLabel: "Talcahuano – Libertad",
        green: 0,
        yellow: 1,
        red: 0,
        betweenRows: [1, 2]
    },
    {
        id: "intertramo-h-libertad-cerrito",
        type: "intertramo_horizontal",
        name: "Entre Libertad y Cerrito",
        shortLabel: "Libertad – Cerrito",
        green: 1,
        yellow: 1,
        red: 0,
        betweenRows: [2, 3]
    },

    // 5 Bandas Verticales
    {
        id: "banda-av-corrientes",
        type: "vertical",
        name: "Av. Corrientes",
        green: 5,
        yellow: 4,
        red: 3,
        colIndex: 0
    },
    {
        id: "banda-lavalle",
        type: "vertical",
        name: "Lavalle",
        green: 3,
        yellow: 5,
        red: 2,
        colIndex: 1
    },
    {
        id: "banda-tucuman",
        type: "vertical",
        name: "Tucumán",
        green: 8,
        yellow: 1,
        red: 0,
        colIndex: 2
    },
    {
        id: "banda-viamonte",
        type: "vertical",
        name: "Viamonte",
        green: 4,
        yellow: 3,
        red: 0,
        colIndex: 3
    },
    {
        id: "banda-av-cordoba",
        type: "vertical",
        name: "Av. Córdoba",
        green: 5,
        yellow: 3,
        red: 3,
        colIndex: 4
    },

    // 3 Intertramos Verticales
    {
        id: "intertramo-v-corrientes-lavalle",
        type: "intertramo_vertical",
        name: "Entre Av. Corrientes y Lavalle",
        shortLabel: "Corrientes – Lavalle",
        green: 0,
        yellow: 2,
        red: 2,
        betweenCols: [0, 1]
    },
    {
        id: "intertramo-v-lavalle-tucuman",
        type: "intertramo_vertical",
        name: "Entre Lavalle y Tucumán",
        shortLabel: "Lavalle – Tucumán",
        green: 2,
        yellow: 0,
        red: 0,
        betweenCols: [1, 2]
    },
    {
        id: "intertramo-v-tucuman-viamonte",
        type: "intertramo_vertical",
        name: "Entre Tucumán y Viamonte",
        shortLabel: "Tucumán – Viamonte",
        green: 1,
        yellow: 0,
        red: 0,
        betweenCols: [2, 3]
    },

    // 1 Referencia Vertical
    {
        id: "referencia-v-costado-cordoba",
        type: "referencia_vertical",
        name: "Al costado derecho de Av. Córdoba",
        shortLabel: "Paraguay / Costado Av. Córdoba",
        green: 2,
        yellow: 0,
        red: 0,
        referenceCol: 4
    }
];

// Referencia de validación del total general (no asignada a ninguna banda)
const EXPECTED_GLOBAL_VALIDATION = {
    green: 81,
    yellow: 44,
    red: 16,
    total: 141
};

// ==========================================================
// 3. MOTOR CROMÁTICO Y DE DATOS (ChromaticDataEngine)
// ==========================================================

class ChromaticDataEngine {
    constructor(rawRecords) {
        this.recordsById = new Map();
        this.minDominantCount = 1;
        this.maxDominantCount = 18;
        this.validationSummary = null;

        this.loadRecords(rawRecords);
    }

    loadRecords(rawRecords) {
        this.recordsById.clear();

        // 1. Determinar el rango real [minDominantCount, maxDominantCount] a partir de los valores absolutos
        let minDom = Infinity;
        let maxDom = -Infinity;

        rawRecords.forEach((rec) => {
            const domCount = Math.max(rec.green, rec.yellow, rec.red);
            if (domCount > 0) {
                if (domCount < minDom) minDom = domCount;
                if (domCount > maxDom) maxDom = domCount;
            }
        });

        this.minDominantCount = Number.isFinite(minDom) ? minDom : 1;
        this.maxDominantCount = Number.isFinite(maxDom) && maxDom > this.minDominantCount
            ? maxDom
            : this.minDominantCount + 1;

        // 2. Procesar cada registro individualmente
        rawRecords.forEach((raw) => {
            const processed = this.processRecord(raw);
            this.recordsById.set(processed.id, processed);
        });

        // 3. Validar totales generales (81 verde, 44 amarillo, 16 rojo, 141 total)
        this.validationSummary = this.validateGlobalTotals();
    }

    // Calcula porcentajes, categoría predominante, intensidad normalizada y color visual resultante
    processRecord(raw) {
        const green = Number(raw.green) || 0;
        const yellow = Number(raw.yellow) || 0;
        const red = Number(raw.red) || 0;
        const total = green + yellow + red;

        const pctGreen = total > 0 ? Number(((green / total) * 100).toFixed(1)) : 0.0;
        const pctYellow = total > 0 ? Number(((yellow / total) * 100).toFixed(1)) : 0.0;
        const pctRed = total > 0 ? Number(((red / total) * 100).toFixed(1)) : 0.0;

        const maxCount = Math.max(green, yellow, red);
        const dominantKeys = [];
        if (green === maxCount && maxCount > 0) dominantKeys.push("green");
        if (yellow === maxCount && maxCount > 0) dominantKeys.push("yellow");
        if (red === maxCount && maxCount > 0) dominantKeys.push("red");

        let predominantCategory = "Mixta";
        if (dominantKeys.length === 1) {
            const key = dominantKeys[0];
            predominantCategory = key === "green" ? "Verde" : (key === "yellow" ? "Amarillo" : "Rojo");
        }

        // Normalización consistente basada en la cantidad absoluta de la categoría predominante
        const normRange = Math.max(1, this.maxDominantCount - this.minDominantCount);
        const rawNorm = THREE.MathUtils.clamp((maxCount - this.minDominantCount) / normRange, 0, 1);

        const { minNormalizedIntensity, maxNormalizedIntensity } = SCENE_CONFIG.chromatic;
        const normalizedIntensity = THREE.MathUtils.lerp(
            minNormalizedIntensity,
            maxNormalizedIntensity,
            Math.pow(rawNorm, 0.85)
        );

        const chromaticResult = this.computeVisualColor(
            { green, yellow, red },
            dominantKeys,
            normalizedIntensity
        );

        return {
            ...raw,
            green,
            yellow,
            red,
            total,
            pctGreen,
            pctYellow,
            pctRed,
            dominantCount: maxCount,
            dominantKeys,
            predominantCategory,
            normalizedIntensity,
            visualColor: chromaticResult.primaryColor,
            visualColorHex: `#${chromaticResult.primaryColor.getHexString()}`,
            componentColors: chromaticResult.componentColors,
            isMixed: dominantKeys.length > 1
        };
    }

    getCategoryColorAtIntensity(categoryKey, intensity) {
        const catCfg = SCENE_CONFIG.chromatic.categories[categoryKey];
        if (!catCfg) return new THREE.Color(0x888888);

        const sat = THREE.MathUtils.lerp(catCfg.minSat, catCfg.maxSat, intensity);
        const light = THREE.MathUtils.lerp(catCfg.minLight, catCfg.maxLight, intensity);

        const color = new THREE.Color();
        color.setHSL(catCfg.hue, sat, light);
        return color;
    }

    computeVisualColor(counts, dominantKeys, intensity) {
        if (dominantKeys.length === 1) {
            const singleColor = this.getCategoryColorAtIntensity(dominantKeys[0], intensity);
            return {
                primaryColor: singleColor,
                componentColors: [singleColor.clone()]
            };
        }

        // Composición cromática mixta: contribución proporcional / equivalente entre categorías empatadas
        const activeKeys = dominantKeys.length > 0 ? dominantKeys : ["green", "yellow", "red"];
        const componentColors = activeKeys.map((k) =>
            this.getCategoryColorAtIntensity(k, Math.max(0.45, intensity))
        );

        const blended = this.mixColorsPerceptually(
            componentColors,
            activeKeys.map((k) => Math.max(1, counts[k]))
        );

        return {
            primaryColor: blended,
            componentColors
        };
    }

    // Mezcla perceptual limpia evitando tonos sucios o desaturados entre verde, amarillo y rojo
    mixColorsPerceptually(colors, weights) {
        if (colors.length === 0) return new THREE.Color(0x808080);
        if (colors.length === 1) return colors[0].clone();

        let totalW = 0;
        let rAcc = 0;
        let gAcc = 0;
        let bAcc = 0;
        let satAcc = 0;
        let lightAcc = 0;

        const hslTemp = { h: 0, s: 0, l: 0 };

        for (let i = 0; i < colors.length; i++) {
            const w = weights[i] !== undefined ? weights[i] : 1;
            const c = colors[i];
            c.getHSL(hslTemp);

            totalW += w;
            // Promedio en espacio gamma expandido para conservar luminosidad y limpieza cromática
            rAcc += Math.pow(c.r, 1.8) * w;
            gAcc += Math.pow(c.g, 1.8) * w;
            bAcc += Math.pow(c.b, 1.8) * w;
            satAcc += hslTemp.s * w;
            lightAcc += hslTemp.l * w;
        }

        const mixed = new THREE.Color(
            Math.pow(rAcc / totalW, 1 / 1.8),
            Math.pow(gAcc / totalW, 1 / 1.8),
            Math.pow(bAcc / totalW, 1 / 1.8)
        );

        // Preservar saturación y claridad de la mezcla
        mixed.getHSL(hslTemp);
        const targetSat = Math.max(hslTemp.s, (satAcc / totalW) * 0.92);
        const targetLight = THREE.MathUtils.clamp((lightAcc / totalW) * 1.04, 0.36, 0.62);
        mixed.setHSL(hslTemp.h, targetSat, targetLight);

        return mixed;
    }

    // Calcula el color de intersección entre una banda horizontal y una vertical según sus datos
    computeIntersectionColor(recordH, recordV) {
        const sameSingleCategory =
            !recordH.isMixed &&
            !recordV.isMixed &&
            recordH.dominantKeys[0] === recordV.dominantKeys[0];

        if (sameSingleCategory) {
            // Ambas bandas comparten la misma categoría: mayor intensidad proporcional a la suma
            const categoryKey = recordH.dominantKeys[0];
            const combinedDominant = recordH.dominantCount + recordV.dominantCount;
            const maxPossibleCombo = this.maxDominantCount * 1.65;
            const comboNorm = THREE.MathUtils.clamp(
                (combinedDominant - this.minDominantCount) / Math.max(1, maxPossibleCombo - this.minDominantCount),
                0,
                1
            );

            const baseCat = SCENE_CONFIG.chromatic.categories[categoryKey];
            const sat = THREE.MathUtils.clamp(
                THREE.MathUtils.lerp(baseCat.minSat + 0.12, Math.min(0.96, baseCat.maxSat + 0.12), comboNorm),
                0,
                0.96
            );
            const light = THREE.MathUtils.clamp(
                THREE.MathUtils.lerp(baseCat.minLight + 0.08, Math.min(0.66, baseCat.maxLight + 0.10), comboNorm),
                0.35,
                0.66
            );

            const boosted = new THREE.Color();
            boosted.setHSL(baseCat.hue, sat, light);
            return boosted;
        }

        // Bandas de categorías distintas o composiciones mixtas: mezcla ponderada por sus datos
        const wH = Math.max(1, recordH.dominantCount);
        const wV = Math.max(1, recordV.dominantCount);
        return this.mixColorsPerceptually(
            [recordH.visualColor, recordV.visualColor],
            [wH, wV]
        );
    }

    // Deriva el color oscuro pero legible para la etiqueta inactiva de una banda (Sección 8.1)
    computeInactiveLabelColors(record) {
        const baseHSL = { h: 0, s: 0, l: 0 };
        record.visualColor.getHSL(baseHSL);

        // Tono significativamente más oscuro de la misma familia cromática
        const darkFill = new THREE.Color();
        const darkLight = THREE.MathUtils.clamp(baseHSL.l * 0.28, 0.13, 0.20);
        const darkSat = THREE.MathUtils.clamp(baseHSL.s * 1.05, 0.48, 0.90);
        darkFill.setHSL(baseHSL.h, darkSat, darkLight);

        // Borde/halo cromático sutil derivado de la banda para asegurar legibilidad sobre zonas oscuras
        const rimColor = new THREE.Color();
        rimColor.setHSL(
            baseHSL.h,
            THREE.MathUtils.clamp(baseHSL.s * 0.95, 0.45, 0.88),
            THREE.MathUtils.clamp(baseHSL.l * 1.18, 0.48, 0.68)
        );

        return { darkFill, rimColor };
    }

    // Calcula el color de contraste dinámico para la etiqueta activa orientada hacia cámara (Sección 8.3)
    computeActiveDynamicContrast(record, camera, labelWorldPos, bandElevationRatio) {
        const baseHSL = { h: 0, s: 0, l: 0 };
        record.visualColor.getHSL(baseHSL);

        // Evaluar qué proporción de fondo detrás de la etiqueta corresponde a la banda vs fondo oscuro
        let viewPitchFactor = 0.35;
        if (camera) {
            const toCam = new THREE.Vector3().subVectors(camera.position, labelWorldPos).normalize();
            // Si la cámara mira muy desde arriba (toCam.y alto), la banda queda detrás de la etiqueta;
            // Si mira en ángulo oblicuo, el fondo oscuro de la escena predomina detrás de la etiqueta
            viewPitchFactor = THREE.MathUtils.clamp(Math.pow(Math.max(0, toCam.y), 1.8), 0, 1);
        }

        const sceneBgColor = new THREE.Color(SCENE_CONFIG.surface.baseColor);
        const effectiveBg = sceneBgColor.clone().lerp(
            record.visualColor,
            viewPitchFactor * (1.0 - bandElevationRatio * 0.45)
        );

        // Luminancia relativa perceptual del fondo proyectado detrás de la etiqueta
        const bgLum = 0.2126 * effectiveBg.r + 0.7152 * effectiveBg.g + 0.0722 * effectiveBg.b;

        const activeTextColor = new THREE.Color();
        let contrastNeedFactor = 0.5;

        if (bgLum < 0.34) {
            // Fondo percibido oscuro -> tono cromático luminoso de alto contraste manteniendo identidad
            const targetLight = THREE.MathUtils.clamp(0.84 + (0.34 - bgLum) * 0.25, 0.80, 0.92);
            const targetSat = THREE.MathUtils.clamp(baseHSL.s * 0.85, 0.52, 0.88);
            activeTextColor.setHSL(baseHSL.h, targetSat, targetLight);
            contrastNeedFactor = THREE.MathUtils.clamp(0.55 + (0.34 - bgLum) * 0.9, 0.45, 0.95);
        } else {
            // Fondo percibido luminoso -> tono cromático profundo muy oscuro de alto contraste
            const targetLight = THREE.MathUtils.clamp(0.12, 0.08, 0.16);
            const targetSat = THREE.MathUtils.clamp(baseHSL.s * 1.1, 0.55, 0.92);
            activeTextColor.setHSL(baseHSL.h, targetSat, targetLight);
            contrastNeedFactor = 0.45;
        }

        const glowColor = new THREE.Color();
        glowColor.setHSL(baseHSL.h, THREE.MathUtils.clamp(baseHSL.s, 0.55, 0.92), 0.58);

        return { activeTextColor, glowColor, contrastNeedFactor };
    }

    validateGlobalTotals() {
        let sumG = 0;
        let sumY = 0;
        let sumR = 0;

        this.recordsById.forEach((rec) => {
            sumG += rec.green;
            sumY += rec.yellow;
            sumR += rec.red;
        });

        const total = sumG + sumY + sumR;
        const pctG = total > 0 ? Number(((sumG / total) * 100).toFixed(1)) : 0;
        const pctY = total > 0 ? Number(((sumY / total) * 100).toFixed(1)) : 0;
        const pctR = total > 0 ? Number(((sumR / total) * 100).toFixed(1)) : 0;

        const isValid =
            sumG === EXPECTED_GLOBAL_VALIDATION.green &&
            sumY === EXPECTED_GLOBAL_VALIDATION.yellow &&
            sumR === EXPECTED_GLOBAL_VALIDATION.red &&
            total === EXPECTED_GLOBAL_VALIDATION.total;

        return {
            green: sumG,
            yellow: sumY,
            red: sumR,
            total,
            pctGreen: pctG,
            pctYellow: pctY,
            pctRed: pctR,
            isValid
        };
    }

    getRecord(id) {
        return this.recordsById.get(id) || null;
    }

    updateRecord(id, partialCounts) {
        const existing = this.recordsById.get(id);
        if (!existing) return null;

        const updatedRaw = [];
        this.recordsById.forEach((rec) => {
            if (rec.id === id) {
                updatedRaw.push({
                    ...rec,
                    green: partialCounts.green !== undefined ? partialCounts.green : rec.green,
                    yellow: partialCounts.yellow !== undefined ? partialCounts.yellow : rec.yellow,
                    red: partialCounts.red !== undefined ? partialCounts.red : rec.red
                });
            } else {
                updatedRaw.push(rec);
            }
        });

        this.loadRecords(updatedRaw);
        return this.recordsById.get(id);
    }
}

const DATA_ENGINE = new ChromaticDataEngine(INITIAL_RAW_RECORDS);

// ==========================================================
// 4. GENERADOR DE TEXTURAS PARA ETIQUETAS 3D Y RESPLANDOR TRASERO
// ==========================================================

function createBandLabelTextures(text) {
    const canvasW = 512;
    const canvasH = 128;
    const aspect = canvasW / canvasH;

    // 1. Textura de glifos en blanco puro con micro-contorno suave para permitir
    // coloreado dinámico en GPU (textMat.color) tanto en reposo oscuro como en hover
    const glyphCanvas = document.createElement("canvas");
    glyphCanvas.width = canvasW;
    glyphCanvas.height = canvasH;
    const ctx = glyphCanvas.getContext("2d");

    ctx.clearRect(0, 0, canvasW, canvasH);
    ctx.font = '800 54px "Inter", "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(text, canvasW * 0.5, canvasH * 0.5);

    const glyphTexture = new THREE.CanvasTexture(glyphCanvas);
    glyphTexture.minFilter = THREE.LinearFilter;
    glyphTexture.magFilter = THREE.LinearFilter;
    glyphTexture.needsUpdate = true;

    // 2. Textura de placa/contorno trasero para garantizar contraste del tono oscuro inactivo
    // y resplandor trasero sutil durante el hover sin cubrir ni difuminar los caracteres
    const backplateCanvas = document.createElement("canvas");
    backplateCanvas.width = canvasW;
    backplateCanvas.height = canvasH;
    const bCtx = backplateCanvas.getContext("2d");

    bCtx.clearRect(0, 0, canvasW, canvasH);
    bCtx.font = '800 54px "Inter", "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
    bCtx.textAlign = "center";
    bCtx.textBaseline = "middle";

    // Contorno nítido detrás de los caracteres
    bCtx.lineJoin = "round";
    bCtx.lineWidth = 10;
    bCtx.strokeStyle = "rgba(255, 255, 255, 0.92)";
    bCtx.strokeText(text, canvasW * 0.5, canvasH * 0.5);

    const outlineTexture = new THREE.CanvasTexture(backplateCanvas);
    outlineTexture.minFilter = THREE.LinearFilter;
    outlineTexture.magFilter = THREE.LinearFilter;
    outlineTexture.needsUpdate = true;

    // 3. Textura de resplandor trasero tipo Bloom sutil (situada estrictamente detrás del texto)
    const bloomCanvas = document.createElement("canvas");
    bloomCanvas.width = canvasW;
    bloomCanvas.height = canvasH;
    const gCtx = bloomCanvas.getContext("2d");

    gCtx.clearRect(0, 0, canvasW, canvasH);
    const radial = gCtx.createRadialGradient(
        canvasW * 0.5, canvasH * 0.5, 4,
        canvasW * 0.5, canvasH * 0.5, canvasW * 0.34
    );
    radial.addColorStop(0, "rgba(255, 255, 255, 0.42)");
    radial.addColorStop(0.55, "rgba(255, 255, 255, 0.16)");
    radial.addColorStop(1, "rgba(255, 255, 255, 0.0)");

    gCtx.fillStyle = radial;
    gCtx.fillRect(0, 0, canvasW, canvasH);

    gCtx.font = '800 54px "Inter", "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
    gCtx.textAlign = "center";
    gCtx.textBaseline = "middle";
    gCtx.shadowColor = "#ffffff";
    gCtx.shadowBlur = 22;
    gCtx.fillStyle = "rgba(255, 255, 255, 0.65)";
    gCtx.fillText(text, canvasW * 0.5, canvasH * 0.5);

    const bloomTexture = new THREE.CanvasTexture(bloomCanvas);
    bloomTexture.minFilter = THREE.LinearFilter;
    bloomTexture.magFilter = THREE.LinearFilter;
    bloomTexture.needsUpdate = true;

    return { glyphTexture, outlineTexture, bloomTexture, aspect };
}

function createIntertramoLabelTexture(text, colorHex) {
    const canvasW = 512;
    const canvasH = 96;
    const aspect = canvasW / canvasH;

    const canvas = document.createElement("canvas");
    canvas.width = canvasW;
    canvas.height = canvasH;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvasW, canvasH);
    ctx.font = '700 36px "Inter", "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.lineJoin = "round";
    ctx.lineWidth = 6;
    ctx.strokeStyle = "rgba(10, 12, 16, 0.88)";
    ctx.strokeText(text, canvasW * 0.5, canvasH * 0.5);

    ctx.fillStyle = colorHex;
    ctx.fillText(text, canvasW * 0.5, canvasH * 0.5);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.needsUpdate = true;

    return { texture, aspect };
}

// ==========================================================
// 5. ETIQUETA 3D DE BANDA (Orientación Independiente + Contraste Dinámico)
// ==========================================================

class BandLabel3D {
    constructor(config, band, scene) {
        this.config = config;
        this.id = config.id;
        this.bandId = config.bandId;
        this.band = band;
        this.scene = scene;

        // Progreso de orientación [0..1] INDEPENDIENTE de la altura de la banda (Sección 8.2)
        this.orientationProgress = 0;

        this.qInactive = new THREE.Quaternion();
        this.qActive = new THREE.Quaternion();
        this.lookMatrix = new THREE.Matrix4();
        this.upVector = new THREE.Vector3(0, 1, 0);

        this.inactiveDarkColor = new THREE.Color(0x102818);
        this.inactiveRimColor = new THREE.Color(0x52c478);
        this.currentTextColor = new THREE.Color();
        this.currentOutlineColor = new THREE.Color();
        this.darkOutlineTarget = new THREE.Color(0x090b0e);
        this.lightOutlineTarget = new THREE.Color(0xf8fafc);

        this.buildMesh();
        this.refreshChromaticColors();
        this.updateTransform(null, 0);
    }

    buildMesh() {
        const { glyphTexture, outlineTexture, bloomTexture, aspect } = createBandLabelTextures(
            this.config.text
        );

        this.aspect = aspect;
        this.group = new THREE.Group();
        this.group.name = this.id;

        const planeH = this.config.textSize;
        const planeW = planeH * aspect;

        // 1. Capa trasera de resplandor (estrictamente detrás del texto: z = -0.04)
        const bloomGeo = new THREE.PlaneGeometry(planeW * 1.10, planeH * 1.30);
        this.bloomMat = new THREE.MeshBasicMaterial({
            map: bloomTexture,
            color: 0xffffff,
            transparent: true,
            opacity: 0,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            side: THREE.DoubleSide
        });
        this.bloomMesh = new THREE.Mesh(bloomGeo, this.bloomMat);
        this.bloomMesh.position.set(0, 0, -0.04);
        this.group.add(this.bloomMesh);

        // 2. Capa de borde de contraste cromático trasero (z = -0.012)
        const outlineGeo = new THREE.PlaneGeometry(planeW, planeH);
        this.outlineMat = new THREE.MeshBasicMaterial({
            map: outlineTexture,
            color: this.inactiveRimColor.clone(),
            transparent: true,
            opacity: 0.78,
            depthWrite: false,
            side: THREE.DoubleSide
        });
        this.outlineMesh = new THREE.Mesh(outlineGeo, this.outlineMat);
        this.outlineMesh.position.set(0, 0, -0.012);
        this.group.add(this.outlineMesh);

        // 3. Capa frontal de caracteres nítidos (z = 0)
        const textGeo = new THREE.PlaneGeometry(planeW, planeH);
        this.textMat = new THREE.MeshBasicMaterial({
            map: glyphTexture,
            color: this.inactiveDarkColor.clone(),
            transparent: true,
            opacity: 0.98,
            depthWrite: false,
            side: THREE.DoubleSide
        });
        this.textMesh = new THREE.Mesh(textGeo, this.textMat);
        this.group.add(this.textMesh);

        const initEuler = new THREE.Euler(
            this.config.initialOrientation.x,
            this.config.initialOrientation.y,
            this.config.initialOrientation.z,
            "XYZ"
        );
        this.qInactive.setFromEuler(initEuler);
        this.group.quaternion.copy(this.qInactive);

        this.scene.add(this.group);
    }

    refreshChromaticColors() {
        const record = this.band.getDataRecord();
        if (!record) return;

        const { darkFill, rimColor } = DATA_ENGINE.computeInactiveLabelColors(record);
        this.inactiveDarkColor.copy(darkFill);
        this.inactiveRimColor.copy(rimColor);
    }

    setText(newText) {
        this.config.text = newText;
        const { glyphTexture, outlineTexture, bloomTexture } = createBandLabelTextures(newText);
        this.textMat.map.dispose();
        this.textMat.map = glyphTexture;
        this.outlineMat.map.dispose();
        this.outlineMat.map = outlineTexture;
        this.bloomMat.map.dispose();
        this.bloomMat.map = bloomTexture;
    }

    updateTransform(camera, dt) {
        const band = this.band;
        const record = band.getDataRecord();
        const isHorizontal = band.config.orientation === "horizontal";

        // 1. Animación de orientación INDEPENDIENTE de la altura de la banda (Sección 8.2)
        if (band.isHovered) {
            const inRate = 1 / Math.max(0.05, this.config.orientationInDuration);
            this.orientationProgress = Math.min(1.0, this.orientationProgress + dt * inRate);
        } else {
            const outRate = 1 / Math.max(0.08, this.config.orientationOutDuration);
            this.orientationProgress = Math.max(0.0, this.orientationProgress - dt * outRate);
        }

        // Curva suave (ease-out al entrar, ease-in-out al salir)
        const p = this.orientationProgress;
        const orientationBlend = band.isHovered
            ? (1 - Math.pow(1 - p, 2.6))
            : (p * p * (3 - 2 * p));

        // 2. Posición espacial sincronizada con la elevación y desplazamiento de la banda
        const sampleCoord = isHorizontal ? this.config.position.x : this.config.position.z;
        const { elevationAtPoint, lateralAtPoint } = band.getDisplacementAtCoordinate(sampleCoord);

        const baseTopY = band.config.thickness + this.config.separation;
        const restY = Math.max(baseTopY, this.config.initialHeight);
        const extraHoverY = this.config.hoverHeight * orientationBlend;

        const worldX = isHorizontal
            ? this.config.position.x
            : this.config.position.x + lateralAtPoint;

        const worldZ = isHorizontal
            ? this.config.position.z + lateralAtPoint
            : this.config.position.z;

        const worldY = restY + elevationAtPoint + extraHoverY;
        this.group.position.set(worldX, worldY, worldZ);

        // 3. Interpolación angular por el camino más corto hacia la cámara activa
        const initEuler = new THREE.Euler(
            this.config.initialOrientation.x,
            this.config.initialOrientation.y,
            this.config.initialOrientation.z,
            "XYZ"
        );
        this.qInactive.setFromEuler(initEuler);

        if (camera) {
            this.lookMatrix.lookAt(camera.position, this.group.position, this.upVector);
            this.qActive.setFromRotationMatrix(this.lookMatrix);
            // Evitar giros de 360 grados asegurando hemisferio positivo en Slerp
            if (this.qInactive.dot(this.qActive) < 0) {
                this.qActive.x = -this.qActive.x;
                this.qActive.y = -this.qActive.y;
                this.qActive.z = -this.qActive.z;
                this.qActive.w = -this.qActive.w;
            }
        } else {
            this.qActive.copy(this.qInactive);
        }

        this.group.quaternion.copy(this.qInactive).slerp(this.qActive, orientationBlend);

        // 4. Contraste dinámico y resplandor trasero ligero durante el hover (Secciones 8.1 y 8.3)
        if (record) {
            const elevRatio = THREE.MathUtils.clamp(
                band.currentElevation / Math.max(0.01, band.config.maxElevation),
                0,
                1
            );

            const { activeTextColor, glowColor, contrastNeedFactor } =
                DATA_ENGINE.computeActiveDynamicContrast(
                    record,
                    camera,
                    this.group.position,
                    elevRatio
                );

            // Transición fluida entre el tono oscuro cromático inactivo y el tono de contraste activo
            this.currentTextColor.copy(this.inactiveDarkColor).lerp(activeTextColor, orientationBlend);
            this.textMat.color.copy(this.currentTextColor);

            // El borde pasa del tono cromático de la banda en reposo a un borde oscuro de definición en hover
            const activeOutlineTarget = activeTextColor.r > 0.45
                ? this.darkOutlineTarget
                : this.lightOutlineTarget;
            this.currentOutlineColor.copy(this.inactiveRimColor).lerp(activeOutlineTarget, orientationBlend);
            this.outlineMat.color.copy(this.currentOutlineColor);
            this.outlineMat.opacity = THREE.MathUtils.lerp(0.82, 0.92, orientationBlend);

            // Resplandor trasero proporcional al contraste necesario, estrictamente detrás del texto
            this.bloomMat.color.copy(glowColor);
            this.bloomMat.opacity =
                this.config.maxBloomIntensity * contrastNeedFactor * orientationBlend;
        }
    }
}

// ==========================================================
// 6. ENTIDAD VISUAL DE INTERTRAMO Y REFERENCIA (Secciones 3, 4.3 y 5)
// ==========================================================

class IntertramoEntity3D {
    constructor(recordId, config, scene) {
        this.id = recordId;
        this.config = config;
        this.scene = scene;

        this.group = new THREE.Group();
        this.group.name = this.id;

        this.buildVisuals();
    }

    getDataRecord() {
        return DATA_ENGINE.getRecord(this.id);
    }

    createSegmentTexture(record) {
        const canvas = document.createElement("canvas");
        canvas.width = 256;
        canvas.height = 64;
        const ctx = canvas.getContext("2d");

        if (record.isMixed && record.componentColors.length >= 2) {
            // Composición cromática mixta: gradiente suave entre las categorías empatadas
            const grad = ctx.createLinearGradient(0, 0, canvas.width, 0);
            const c1 = `#${record.componentColors[0].getHexString()}`;
            const cMid = `#${record.visualColor.getHexString()}`;
            const c2 = `#${record.componentColors[1].getHexString()}`;

            grad.addColorStop(0.0, c1);
            grad.addColorStop(0.32, c1);
            grad.addColorStop(0.50, cMid);
            grad.addColorStop(0.68, c2);
            grad.addColorStop(1.0, c2);
            ctx.fillStyle = grad;
        } else {
            ctx.fillStyle = `#${record.visualColor.getHexString()}`;
        }

        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const tex = new THREE.CanvasTexture(canvas);
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.needsUpdate = true;
        return tex;
    }

    buildVisuals() {
        const record = this.getDataRecord();
        if (!record) return;

        const { position, barLength, barWidth, orientation, depth, labelOffset } = this.config;
        const isHorizontal = orientation === "horizontal";

        // Barra cromática 3D localizada en el intertramo (hundida sutilmente para no interferir con bandas)
        const sx = isHorizontal ? barLength : barWidth;
        const sz = isHorizontal ? barWidth : barLength;
        const barGeo = new THREE.BoxGeometry(sx, 0.08, sz);

        const segTexture = this.createSegmentTexture(record);
        this.barMat = new THREE.MeshStandardMaterial({
            map: segTexture,
            roughness: 0.55,
            metalness: 0.08
        });

        this.barMesh = new THREE.Mesh(barGeo, this.barMat);
        this.barMesh.position.set(position.x, depth - 0.03, position.z);
        this.group.add(this.barMesh);

        // Etiqueta 3D acostada y ligeramente hundida con la nomenclatura e identidad cromática del intertramo
        const labelHSL = { h: 0, s: 0, l: 0 };
        record.visualColor.getHSL(labelHSL);
        const readableTint = new THREE.Color().setHSL(
            labelHSL.h,
            THREE.MathUtils.clamp(labelHSL.s * 0.9, 0.45, 0.85),
            THREE.MathUtils.clamp(labelHSL.l * 1.28, 0.58, 0.78)
        );

        const displayText = record.shortLabel || record.name;
        const { texture, aspect } = createIntertramoLabelTexture(
            displayText,
            `#${readableTint.getHexString()}`
        );

        const planeH = SCENE_CONFIG.intertramoLabelDefaults.size;
        const planeW = planeH * aspect;
        const labelGeo = new THREE.PlaneGeometry(planeW, planeH);
        this.labelMat = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            opacity: 0.92,
            depthWrite: false,
            side: THREE.DoubleSide
        });

        this.labelMesh = new THREE.Mesh(labelGeo, this.labelMat);
        this.labelMesh.position.set(
            position.x + (labelOffset ? labelOffset.x : 0),
            depth,
            position.z + (labelOffset ? labelOffset.z : 0)
        );
        this.labelMesh.rotation.order = "XYZ";
        this.labelMesh.rotation.set(
            -Math.PI * 0.5,
            0,
            isHorizontal ? 0 : Math.PI * 0.5
        );

        this.group.add(this.labelMesh);
        this.scene.add(this.group);
    }

    refreshFromData() {
        while (this.group.children.length > 0) {
            const child = this.group.children[0];
            this.group.remove(child);
            if (child.geometry) child.geometry.dispose();
        }
        this.buildVisuals();
    }
}

// ==========================================================
// 7. CLASE ELASTIC BAND (Color por Datos + Cruces Cromáticos)
// ==========================================================

class ElasticBand {
    constructor(config, scene) {
        this.config = config;
        this.id = config.id;
        this.name = config.name;
        this.scene = scene;
        this.label = null;
        this.perpendicularBands = [];

        // Estado: 'IDLE' | 'HOVERED' | 'RETURNING'
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

        this.buildGeometry();
    }

    getDataRecord() {
        return DATA_ENGINE.getRecord(this.id);
    }

    setPerpendicularBands(perpBands) {
        this.perpendicularBands = perpBands;
        this.applyVertexChromaticProfile();
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

        // Atributo de color por vértice para representar tanto el color base de la banda
        // como la superposición cromática exacta en las intersecciones (Sección 5)
        const colorArray = new Float32Array(posAttr.count * 3);
        this.geometry.setAttribute("color", new THREE.BufferAttribute(colorArray, 3));

        this.material = new THREE.MeshStandardMaterial({
            vertexColors: true,
            roughness: 0.38,
            metalness: 0.08
        });

        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.name = this.id;
        this.mesh.position.set(position.x, position.y, position.z);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        this.mesh.userData.band = this;

        // Hitbox de núcleo ajustada en reposo para detección precisa sin solapamientos amplios
        const hitWidth = width * SCENE_CONFIG.bandDefaults.hitboxWidthRatio;
        const hitSizeX = isHorizontal ? length : hitWidth;
        const hitSizeZ = isHorizontal ? hitWidth : length;

        const restColliderGeo = new THREE.BoxGeometry(hitSizeX, sizeY * 1.1, hitSizeZ);
        restColliderGeo.translate(0, sizeY * 0.5 + layerOffset, 0);
        this.restColliderMesh = new THREE.Mesh(
            restColliderGeo,
            new THREE.MeshBasicMaterial({ visible: false })
        );
        this.restColliderMesh.position.set(position.x, position.y, position.z);
        this.restColliderMesh.userData.band = this;

        this.scene.add(this.mesh);
        this.scene.add(this.restColliderMesh);

        this.applyVertexChromaticProfile();
    }

    // Evalúa y asigna los colores por vértice de la banda y de sus 20 intersecciones (Secciones 4 y 5)
    applyVertexChromaticProfile() {
        const record = this.getDataRecord();
        if (!record) return;

        const posAttr = this.geometry.attributes.position;
        const colorAttr = this.geometry.attributes.color;
        const rest = this.restPositions;

        const { orientation, width, length } = this.config;
        const isHorizontal = orientation === "horizontal";
        const halfBandW = width * 0.56;

        // Precalcular colores de intersección con cada banda perpendicular
        const crossings = this.perpendicularBands.map((perpBand) => {
            const perpRecord = perpBand.getDataRecord();
            const coord = isHorizontal ? perpBand.config.position.x : perpBand.config.position.z;
            const interColor = isHorizontal
                ? DATA_ENGINE.computeIntersectionColor(record, perpRecord)
                : DATA_ENGINE.computeIntersectionColor(perpRecord, record);
            return { coord, color: interColor };
        });

        const baseColor = record.visualColor;
        const tempColor = new THREE.Color();

        // Sutil realce lumínico cuando la banda está elevada en hover
        const hoverBoost = THREE.MathUtils.clamp(
            this.currentElevation / Math.max(0.01, this.config.maxElevation),
            0,
            1
        ) * 0.10;

        for (let i = 0; i < posAttr.count; i++) {
            const idx3 = i * 3;
            const rx = rest[idx3];
            const rz = rest[idx3 + 2];
            const uCoord = isHorizontal ? rx : rz;

            // Si la banda tiene composición mixta, interpolar sus colores componentes longitudinalmente
            if (record.isMixed && record.componentColors.length >= 2) {
                const s = THREE.MathUtils.clamp((uCoord + length * 0.5) / length, 0, 1);
                tempColor.copy(record.componentColors[0]).lerp(record.componentColors[1], s);
            } else {
                tempColor.copy(baseColor);
            }

            // Superposición cromática en los puntos de intersección con bandas perpendiculares
            for (let c = 0; c < crossings.length; c++) {
                const dist = Math.abs(uCoord - crossings[c].coord);
                if (dist < halfBandW * 1.35) {
                    const t = 1 - THREE.MathUtils.smoothstep(dist, halfBandW * 0.55, halfBandW * 1.35);
                    tempColor.lerp(crossings[c].color, t);
                }
            }

            if (hoverBoost > 0) {
                tempColor.offsetHSL(0, 0.03, hoverBoost);
            }

            colorAttr.setXYZ(i, tempColor.r, tempColor.g, tempColor.b);
        }

        colorAttr.needsUpdate = true;
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
        return { normU, transCoord, absTransDist: Math.abs(transCoord) };
    }

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
            const riseBlend = 1 - Math.exp(-this.config.animationSpeed * dt);
            this.currentElevation = THREE.MathUtils.lerp(
                this.currentElevation,
                this.config.maxElevation,
                riseBlend
            );

            const followLerp = 1 - Math.exp(-14.0 * dt);
            this.currentLateral = THREE.MathUtils.lerp(this.currentLateral, this.targetLateral, followLerp);
            this.contactNormU = THREE.MathUtils.lerp(this.contactNormU, this.targetNormU, followLerp);

            this.applyDeformation();
            this.applyVertexChromaticProfile();
        } else if (this.state === "RETURNING") {
            this.returnElapsed += dt;
            const duration = Math.max(0.05, this.config.returnDuration);
            const p = Math.min(this.returnElapsed / duration, 1.0);

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
                this.applyVertexChromaticProfile();
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

        const { orientation, length } = this.config;
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
        this.applyVertexChromaticProfile();
    }
}

// ==========================================================
// 8. CONSTRUCCIÓN DE BANDAS, INTERTRAMOS Y SUPERFICIE BASE
// ==========================================================

function buildSceneConfigurations() {
    const { width: surfW, depth: surfD, columns, rows, tabExtension } = SCENE_CONFIG.surface;
    const bandDef = SCENE_CONFIG.bandDefaults;
    const labelDef = SCENE_CONFIG.bandLabelDefaults;
    const interDef = SCENE_CONFIG.intertramoLabelDefaults;

    const halfW = surfW * 0.5;
    const halfD = surfD * 0.5;

    const horizontalLength = surfW + bandDef.width + tabExtension * 2;
    const verticalLength = surfD + bandDef.width + tabExtension * 2;

    const bandsConfig = [];
    const bandLabelsConfig = [];
    const intertramosConfig = [];

    DATA_ENGINE.recordsById.forEach((rec) => {
        if (rec.type === "horizontal") {
            const zPos = -halfD + (rec.rowIndex / rows) * surfD;

            bandsConfig.push({
                id: rec.id,
                name: rec.name,
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
                layerOffset: rec.rowIndex * 0.0015
            });

            bandLabelsConfig.push({
                id: `etiqueta-${rec.id}`,
                bandId: rec.id,
                text: rec.name,
                position: { x: 0, y: 0, z: zPos },
                initialHeight: labelDef.initialHeight,
                hoverHeight: labelDef.hoverHeight,
                separation: labelDef.separation,
                initialOrientation: { x: -Math.PI * 0.5, y: 0, z: 0 },
                orientationInDuration: labelDef.orientationInDuration,
                orientationOutDuration: labelDef.orientationOutDuration,
                maxBloomIntensity: labelDef.maxBloomIntensity,
                textSize: labelDef.textSize
            });
        } else if (rec.type === "vertical") {
            const xPos = -halfW + (rec.colIndex / columns) * surfW;

            bandsConfig.push({
                id: rec.id,
                name: rec.name,
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
                layerOffset: 0.007 + rec.colIndex * 0.0015
            });

            bandLabelsConfig.push({
                id: `etiqueta-${rec.id}`,
                bandId: rec.id,
                text: rec.name,
                position: { x: xPos, y: 0, z: 0 },
                initialHeight: labelDef.initialHeight,
                hoverHeight: labelDef.hoverHeight,
                separation: labelDef.separation,
                initialOrientation: { x: -Math.PI * 0.5, y: 0, z: Math.PI * 0.5 },
                orientationInDuration: labelDef.orientationInDuration,
                orientationOutDuration: labelDef.orientationOutDuration,
                maxBloomIntensity: labelDef.maxBloomIntensity,
                textSize: labelDef.textSize * 0.92
            });
        } else if (rec.type === "intertramo_horizontal") {
            // Ubicado en la franja horizontal entre las dos calles correspondientes (c=3, x=+15)
            const rMid = (rec.betweenRows[0] + rec.betweenRows[1]) * 0.5;
            const zPos = -halfD + (rMid / rows) * surfD;

            intertramosConfig.push({
                id: rec.id,
                orientation: "horizontal",
                position: { x: 15.0, z: zPos },
                barLength: 5.4,
                barWidth: 0.52,
                depth: interDef.depth,
                labelOffset: { x: 0, z: 0.95 }
            });
        } else if (rec.type === "intertramo_vertical") {
            // Ubicado en la franja vertical entre las dos calles correspondientes (r=0, z=-10)
            const cMid = (rec.betweenCols[0] + rec.betweenCols[1]) * 0.5;
            const xPos = -halfW + (cMid / columns) * surfW;

            intertramosConfig.push({
                id: rec.id,
                orientation: "vertical",
                position: { x: xPos, z: -10.0 },
                barLength: 5.4,
                barWidth: 0.52,
                depth: interDef.depth,
                labelOffset: { x: 0.95, z: 0 }
            });
        } else if (rec.type === "referencia_vertical") {
            // Al costado derecho de Av. Córdoba
            intertramosConfig.push({
                id: rec.id,
                orientation: "vertical",
                position: { x: halfW + 2.45, z: 0.0 },
                barLength: 7.5,
                barWidth: 0.48,
                depth: interDef.depth,
                labelOffset: { x: 0.85, z: 0 }
            });
        }
    });

    return { bandsConfig, bandLabelsConfig, intertramosConfig };
}

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

    const baseGeo = new THREE.PlaneGeometry(totalW, totalD);
    baseGeo.rotateX(-Math.PI * 0.5);
    baseGeo.translate(0, recuadroDepth - 0.05, 0);

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

    for (let c = 0; c <= columns; c++) {
        const x = -halfW + (c / columns) * width;
        const stripGeo = new THREE.PlaneGeometry(gridLineWidth, totalD);
        stripGeo.rotateX(-Math.PI * 0.5);
        stripGeo.translate(x, 0.001, 0);
        surfaceGroup.add(new THREE.Mesh(stripGeo, gridMat));
        linePositions.push(x, 0.002, -totalD * 0.5, x, 0.002, totalD * 0.5);
    }

    for (let r = 0; r <= rows; r++) {
        const z = -halfD + (r / rows) * depth;
        const stripGeo = new THREE.PlaneGeometry(totalW, gridLineWidth);
        stripGeo.rotateX(-Math.PI * 0.5);
        stripGeo.translate(0, 0.001, z);
        surfaceGroup.add(new THREE.Mesh(stripGeo, gridMat));
        linePositions.push(-totalW * 0.5, 0.002, z, totalW * 0.5, 0.002, z);
    }

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

    const cellW = width / columns;
    const cellD = depth / rows;
    const startX = -halfW + cellW * 0.5;
    const startZ = -halfD + cellD * 0.5;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            const cx = startX + c * cellW;
            const cz = startZ + r * cellD;
            const halfOuter = recuadroOuterSize * 0.5;
            const yFrame = 0.003;

            linePositions.push(
                cx - halfOuter, yFrame, cz - halfOuter, cx + halfOuter, yFrame, cz - halfOuter,
                cx + halfOuter, yFrame, cz - halfOuter, cx + halfOuter, yFrame, cz + halfOuter,
                cx + halfOuter, yFrame, cz + halfOuter, cx - halfOuter, yFrame, cz + halfOuter,
                cx - halfOuter, yFrame, cz + halfOuter, cx - halfOuter, yFrame, cz - halfOuter
            );

            const innerGeo = new THREE.PlaneGeometry(recuadroInnerSize, recuadroInnerSize);
            innerGeo.rotateX(-Math.PI * 0.5);
            innerGeo.translate(cx, recuadroDepth, cz);

            const isMidRowHighlight = (r === 1 && c >= 1);
            const innerMesh = new THREE.Mesh(
                innerGeo,
                isMidRowHighlight ? midBlockMat : darkBlockMat
            );
            innerMesh.receiveShadow = true;
            surfaceGroup.add(innerMesh);

            if (r === 2 && c === 0) {
                const passageGroup = new THREE.Group();
                passageGroup.position.set(cx, recuadroDepth + 0.012, cz);
                passageGroup.rotation.y = Math.PI * 0.25;

                const numRungs = 9;
                const span = recuadroInnerSize * 1.12;
                for (let k = 0; k < numRungs; k++) {
                    const offset = -span * 0.5 + (k / (numRungs - 1)) * span;
                    const rungGeo = new THREE.PlaneGeometry(0.28, 0.72);
                    rungGeo.rotateX(-Math.PI * 0.5);
                    rungGeo.translate(offset, 0, 0);
                    passageGroup.add(new THREE.Mesh(rungGeo, stripeMat));
                }
                surfaceGroup.add(passageGroup);
            }
        }
    }

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.Float32BufferAttribute(linePositions, 3));
    surfaceGroup.add(
        new THREE.LineSegments(lineGeo, new THREE.LineBasicMaterial({ color: gridColor }))
    );

    scene.add(surfaceGroup);
    return surfaceGroup;
}

// ==========================================================
// 9. SISTEMA DE SELECCIÓN EXCLUSIVA TEMPORAL (Sección 6)
// ==========================================================

class BandInteractionManager {
    constructor(camera, domElement, bands) {
        this.camera = camera;
        this.domElement = domElement;
        this.bands = bands;

        // Banda con selección exclusiva activa
        this.exclusiveBand = null;
        // Banda que acaba de salir de hover y está en fase inicial de retorno
        this.returningLockedBand = null;

        this.allRaycastTargets = [];
        bands.forEach((b) => {
            this.allRaycastTargets.push(b.mesh, b.restColliderMesh);
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
            this.releaseExclusiveBand();
        });
    }

    // Indica a la cámara si debe pausar suavemente la rotación automática (Sección 7)
    hasActiveBandInteraction() {
        return this.exclusiveBand !== null;
    }

    releaseExclusiveBand() {
        if (this.exclusiveBand) {
            this.returningLockedBand = this.exclusiveBand;
            this.exclusiveBand.onCursorLeave();
            this.exclusiveBand = null;
        }
        this.domElement.classList.remove("is-hovering-band");
    }

    // Evalúa si un punto 3D se encuentra cerca de una intersección entre bandas
    isPointNearIntersection(worldPoint) {
        const halfBandW = SCENE_CONFIG.bandDefaults.width * 0.72;
        let nearH = false;
        let nearV = false;

        for (let i = 0; i < this.bands.length; i++) {
            const b = this.bands[i];
            if (b.config.orientation === "horizontal") {
                if (Math.abs(worldPoint.z - b.config.position.z) < halfBandW) nearH = true;
            } else {
                if (Math.abs(worldPoint.x - b.config.position.x) < halfBandW) nearV = true;
            }
        }
        return nearH && nearV;
    }

    update(isDraggingCamera) {
        if (!this.hasValidPointer || isDraggingCamera) {
            this.releaseExclusiveBand();
            return;
        }

        // Liberar automáticamente el bloqueo de retorno cuando la banda termina de bajar
        if (this.returningLockedBand && this.returningLockedBand.state === "IDLE") {
            this.returningLockedBand = null;
        }

        this.raycaster.setFromCamera(this.pointerNDC, this.camera);

        // 1. MODO DE SELECCIÓN EXCLUSIVA TEMPORAL:
        // Mientras una banda está seleccionada, solo se evalúa esa banda.
        // Las demás bandas quedan bloqueadas para evitar cambios involuntarios en intersecciones.
        if (this.exclusiveBand) {
            const band = this.exclusiveBand;
            const exclusiveTargets = [band.mesh, band.restColliderMesh];
            const exclusiveHits = this.raycaster.intersectObjects(exclusiveTargets, false);

            this.horizontalPlane.constant = -band.currentElevation * 0.45;
            const hasPlaneHit = this.raycaster.ray.intersectPlane(
                this.horizontalPlane,
                this.planeHitPoint
            );

            let stillInElasticCorridor = false;
            if (hasPlaneHit) {
                const isHorizontal = band.config.orientation === "horizontal";
                const longDelta = isHorizontal
                    ? Math.abs(this.planeHitPoint.x - band.config.position.x)
                    : Math.abs(this.planeHitPoint.z - band.config.position.z);
                const transCoord = isHorizontal
                    ? (this.planeHitPoint.z - band.config.position.z)
                    : (this.planeHitPoint.x - band.config.position.x);

                const maxLong = band.config.length * 0.5;
                const maxTrans = band.config.width * 0.82;
                if (
                    longDelta <= maxLong &&
                    Math.abs(transCoord - band.currentLateral * 0.5) <= maxTrans
                ) {
                    stillInElasticCorridor = true;
                }
            }

            if (exclusiveHits.length > 0 || stillInElasticCorridor) {
                const trackPoint = hasPlaneHit ? this.planeHitPoint : exclusiveHits[0].point;
                band.onCursorHover(trackPoint);
                this.domElement.classList.add("is-hovering-band");
                return;
            }

            // El cursor abandonó la banda seleccionada: iniciar retorno
            this.releaseExclusiveBand();
        }

        // 2. MODO DE BÚSQUEDA DE NUEVA BANDA:
        const hits = this.raycaster.intersectObjects(this.allRaycastTargets, false);
        if (hits.length === 0) {
            this.domElement.classList.remove("is-hovering-band");
            return;
        }

        // Si existen múltiples candidatos cercanos (p. ej. cerca de un cruce), elegir la banda
        // cuyo eje central esté más próximo al punto de impacto
        let bestBand = null;
        let bestPoint = null;
        let minCenterlineDist = Infinity;

        for (let i = 0; i < hits.length; i++) {
            const candidateBand = hits[i].object.userData.band;
            if (!candidateBand) continue;

            const { absTransDist } = candidateBand.extractLocalCoordinates(hits[i].point);
            if (absTransDist < minCenterlineDist) {
                minCenterlineDist = absTransDist;
                bestBand = candidateBand;
                bestPoint = hits[i].point;
            }
        }

        if (!bestBand) return;

        // Evitar cambios involuntarios hacia otra banda durante la animación de retorno
        if (this.returningLockedBand && this.returningLockedBand.state === "RETURNING") {
            if (bestBand !== this.returningLockedBand) {
                const returnProgress =
                    this.returningLockedBand.returnElapsed /
                    Math.max(0.1, this.returningLockedBand.config.returnDuration);

                // Bloquear cambio si el retorno recién comenzó o si el cursor está en una intersección
                const inIntersection = this.isPointNearIntersection(bestPoint);
                if (returnProgress < 0.30 || inIntersection) {
                    this.domElement.classList.remove("is-hovering-band");
                    return;
                }
            }
            this.returningLockedBand = null;
        }

        // Activar nueva selección exclusiva temporal
        this.exclusiveBand = bestBand;
        this.exclusiveBand.onCursorHover(bestPoint);
        this.domElement.classList.add("is-hovering-band");
    }
}

// ==========================================================
// 10. CONTROLADOR DE CÁMARA ORBITAL SINCRONIZADO (Sección 7)
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

        // Velocidad angular normalizada [0..1] para parada y reanudación progresiva
        this.autoRotateBlend = 1.0;

        this.bindEvents();
        this.updateCameraTransform();
    }

    bindEvents() {
        this.domElement.addEventListener("pointerdown", (e) => {
            if (e.button !== 0) return;
            this.isDragging = true;
            this.previousPointerPos.x = e.clientX;
            this.previousPointerPos.y = e.clientY;
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
        });

        const endDrag = () => {
            if (!this.isDragging) return;
            this.isDragging = false;
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

    update(dt, isBandInteractionActive) {
        if (this.isDragging) {
            this.autoRotateBlend = 0;
        } else if (isBandInteractionActive) {
            // Detenimiento progresivo y suave cuando una banda está activa (sin frenada brusca)
            const decel = 1 - Math.exp(-this.cfg.pauseDecelSpeed * dt);
            this.autoRotateBlend = THREE.MathUtils.lerp(this.autoRotateBlend, 0.0, decel);
        } else {
            // Reanudación progresiva y suave vinculada directamente al fin de la interacción
            const accel = 1 - Math.exp(-this.cfg.resumeAccelSpeed * dt);
            this.autoRotateBlend = THREE.MathUtils.lerp(this.autoRotateBlend, 1.0, accel);
        }

        if (!this.isDragging) {
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
// 11. REGISTRO GLOBAL Y API DE ACTUALIZACIÓN DE DATOS
// ==========================================================

const SCENE_REGISTRY = {
    dataEngine: DATA_ENGINE,
    bandsById: new Map(),
    bandLabelsById: new Map(),
    intertramosById: new Map(),

    getBand(id) {
        return this.bandsById.get(id) || null;
    },
    getBandLabel(id) {
        return this.bandLabelsById.get(id) || null;
    },
    getIntertramo(id) {
        return this.intertramosById.get(id) || null;
    },
    getDataRecord(id) {
        return this.dataEngine.getRecord(id);
    },

    // Permite actualizar datos dinámicamente sin reconstruir las geometrías de las bandas
    updateRecordData(id, newCounts) {
        const updated = this.dataEngine.updateRecord(id, newCounts);
        if (!updated) return null;

        this.bandsById.forEach((band) => {
            band.applyVertexChromaticProfile();
            if (band.label) band.label.refreshChromaticColors();
        });

        this.intertramosById.forEach((inter) => {
            inter.refreshFromData();
        });

        return updated;
    }
};

window.SCENE_REGISTRY = SCENE_REGISTRY;

// ==========================================================
// 12. INICIALIZACIÓN Y BUCLE DE RENDERIZADO
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

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.78);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.92);
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

    const rimLight = new THREE.DirectionalLight(0x9fb3c8, 0.32);
    rimLight.position.set(-24, 20, -22);
    scene.add(rimLight);

    // 1. Construir superficie base 4:3 y recuadros hundidos
    buildBaseSurfaceAndRecuadros(scene);

    // 2. Generar configuraciones a partir del motor de datos
    const { bandsConfig, bandLabelsConfig, intertramosConfig } = buildSceneConfigurations();

    // 3. Construir las 9 bandas (4H + 5V)
    const bands = bandsConfig.map((cfg) => {
        const band = new ElasticBand(cfg, scene);
        SCENE_REGISTRY.bandsById.set(band.id, band);
        return band;
    });

    const horizontalBands = bands.filter((b) => b.config.orientation === "horizontal");
    const verticalBands = bands.filter((b) => b.config.orientation === "vertical");

    // Vincular bandas perpendiculares para el cálculo cromático de las 20 intersecciones
    horizontalBands.forEach((hBand) => hBand.setPerpendicularBands(verticalBands));
    verticalBands.forEach((vBand) => vBand.setPerpendicularBands(horizontalBands));

    // 4. Construir y vincular etiquetas 3D de las bandas
    bandLabelsConfig.forEach((labelCfg) => {
        const band = SCENE_REGISTRY.getBand(labelCfg.bandId);
        if (band) {
            const label = new BandLabel3D(labelCfg, band, scene);
            band.label = label;
            SCENE_REGISTRY.bandLabelsById.set(label.id, label);
        }
    });

    // 5. Construir entidades visuales 3D de los intertramos y referencia vertical
    intertramosConfig.forEach((interCfg) => {
        const interEntity = new IntertramoEntity3D(interCfg.id, interCfg, scene);
        SCENE_REGISTRY.intertramosById.set(interEntity.id, interEntity);
    });

    // 6. Controlador de cámara orbital y gestor de selección exclusiva temporal
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

        interactionManager.update(cameraController.isDragging);
        cameraController.update(dt, interactionManager.hasActiveBandInteraction());

        for (let i = 0; i < bands.length; i++) {
            bands[i].update(dt, camera);
        }

        renderer.render(scene, camera);
    }

    requestAnimationFrame(animate);
}

document.addEventListener("DOMContentLoaded", initInteractiveScene);
