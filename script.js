// ==========================================================
// Base de datos de las 12 calles del Barrio Puerto
// Condiciones Físicas y Dificultad (Verde, Amarillo, Rojo)
// ==========================================================
const STREETS_DATA = [
    {
        name: "Blanco",
        physical: {
            baches: 5,
            faltaSenales: 3,
            pocoEspacio: 2
        },
        difficulty: {
            green: 2.0,
            yellow: 7.5,
            red: 18.0
        }
    },
    {
        name: "Plaza Echaurren",
        physical: {
            baches: 1,
            faltaSenales: 3,
            pocoEspacio: 4
        },
        difficulty: {
            green: 0.0,
            yellow: 1.0,
            red: 5.0
        }
    },
    {
        name: "Clave",
        physical: {
            baches: 2,
            faltaSenales: 2,
            pocoEspacio: 3
        },
        difficulty: {
            green: 0.0,
            yellow: 4.0,
            red: 6.0
        }
    },
    {
        name: "Sotomayor",
        physical: {
            baches: 4,
            faltaSenales: 2,
            pocoEspacio: 0
        },
        difficulty: {
            green: 17.5,
            yellow: 7.0,
            red: 5.0
        }
    },
    {
        name: "Serrano",
        physical: {
            baches: 3,
            faltaSenales: 2,
            pocoEspacio: 1
        },
        difficulty: {
            green: 11.0,
            yellow: 5.0,
            red: 0.0
        }
    },
    {
        name: "Cochrane",
        physical: {
            baches: 2,
            faltaSenales: 3,
            pocoEspacio: 1
        },
        difficulty: {
            green: 2.5,
            yellow: 7.0,
            red: 23.0
        }
    },
    {
        name: "Errázuriz",
        physical: {
            baches: 4,
            faltaSenales: 1,
            pocoEspacio: 0
        },
        difficulty: {
            green: 12.0,
            yellow: 8.5,
            red: 2.0
        }
    },
    {
        name: "Almte Muñoz",
        physical: {
            baches: 2,
            faltaSenales: 0,
            pocoEspacio: 2
        },
        difficulty: {
            green: 1.5,
            yellow: 0.0,
            red: 3.0
        }
    },
    {
        name: "Almte Goñi",
        physical: {
            baches: 1,
            faltaSenales: 0,
            pocoEspacio: 3
        },
        difficulty: {
            green: 0.5,
            yellow: 1.0,
            red: 3.0
        }
    },
    {
        name: "Almte Pérez",
        physical: {
            baches: 0,
            faltaSenales: 0,
            pocoEspacio: 3
        },
        difficulty: {
            green: 0.0,
            yellow: 2.0,
            red: 1.0
        }
    },
    {
        name: "Prat",
        physical: {
            baches: 2,
            faltaSenales: 1,
            pocoEspacio: 0
        },
        difficulty: {
            green: 4.0,
            yellow: 2.0,
            red: 0.0
        }
    },
    {
        name: "San Martín",
        physical: {
            baches: 0,
            faltaSenales: 1,
            pocoEspacio: 1
        },
        difficulty: {
            green: 2.0,
            yellow: 1.0,
            red: 0.0
        }
    }
];

// Colores RGB base para la mezcla ponderada de dificultad
const COLOR_GREEN = [104, 211, 67];  // #68d343
const COLOR_YELLOW = [246, 207, 62]; // #f6cf3e
const COLOR_RED = [224, 68, 26];     // #e0441a

// Descripciones de las 3 categorías para Pantalla 1
const CATEGORY_DESCRIPTIONS = {
    fisicas: "Refieren a los obstáculos que se materializan físicamente en el entorno y dificultan el paso, la estabilidad al caminar, riesgos de caída o lesión.",
    perceptivas: "Refieren a las condiciones visuales, contrastes y señalética que dificultan la orientación espacial y la lectura del entorno.",
    sensoriales: "Refieren a las interferencias acústicas, lumínicas u olores que afectan el bienestar sensorial y confort de los peatones."
};

// ==========================================================
// Cálculos y Utilidades
// ==========================================================

function getPhysicalTotal(street) {
    const p = street.physical;
    return p.baches + p.faltaSenales + p.pocoEspacio;
}

const TOTAL_PHYSICAL_ALL = STREETS_DATA.reduce((acc, st) => acc + getPhysicalTotal(st), 0);

function calculateBlendedColor(difficulty) {
    const { green, yellow, red } = difficulty;
    const total = green + yellow + red;

    if (total === 0) return "rgb(180, 190, 200)";

    const r = Math.round((green * COLOR_GREEN[0] + yellow * COLOR_YELLOW[0] + red * COLOR_RED[0]) / total);
    const g = Math.round((green * COLOR_GREEN[1] + yellow * COLOR_YELLOW[1] + red * COLOR_RED[1]) / total);
    const b = Math.round((green * COLOR_GREEN[2] + yellow * COLOR_YELLOW[2] + red * COLOR_RED[2]) / total);

    return `rgb(${r}, ${g}, ${b})`;
}

function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function getOrderedStreets() {
    let maxItem = STREETS_DATA[0];
    let maxVal = getPhysicalTotal(maxItem);

    STREETS_DATA.forEach(st => {
        const total = getPhysicalTotal(st);
        if (total > maxVal) {
            maxVal = total;
            maxItem = st;
        }
    });

    const remaining = STREETS_DATA.filter(st => st !== maxItem);
    return [maxItem, ...shuffleArray(remaining)];
}

// ==========================================================
// Generador Procedural Aleatorio de Grietas Horizontales
// ==========================================================
function generateRandomCrackClipPath() {
    // Genera quiebres y hendiduras irregulares a lo largo de los bordes superior e inferior
    const topPoints = [];
    const bottomPoints = [];

    // Borde superior: de 0% a 100% con 6 a 9 puntos aleatorios
    const numTopSegments = 7 + Math.floor(Math.random() * 3);
    for (let i = 0; i <= numTopSegments; i++) {
        let x = (i / numTopSegments) * 100;
        // Pequeño jitter horizontal (excepto en los extremos)
        if (i > 0 && i < numTopSegments) {
            x += (Math.random() - 0.5) * (100 / numTopSegments) * 0.45;
        }
        // Variación aleatoria de profundidad de la grieta en px (0 a 4.5px)
        const yOffset = (Math.random() * 4.5).toFixed(1);
        topPoints.push(`${x.toFixed(1)}% ${yOffset}px`);
    }

    // Borde inferior: de 100% a 0% con 6 a 9 puntos aleatorios
    const numBottomSegments = 7 + Math.floor(Math.random() * 3);
    for (let i = numBottomSegments; i >= 0; i--) {
        let x = (i / numBottomSegments) * 100;
        if (i > 0 && i < numBottomSegments) {
            x += (Math.random() - 0.5) * (100 / numBottomSegments) * 0.45;
        }
        const yOffset = (Math.random() * 4.5).toFixed(1);
        bottomPoints.push(`${x.toFixed(1)}% calc(100% - ${yOffset}px)`);
    }

    const allPoints = [...topPoints, ...bottomPoints].join(", ");
    return `polygon(${allPoints})`;
}

// Crea la barra inferior de dificultad segmentada
function createDifficultyBar(difficulty) {
    const bar = document.createElement("div");
    bar.className = "difficulty-bar";

    const total = difficulty.green + difficulty.yellow + difficulty.red;
    if (total === 0) return bar;

    const greenPct = (difficulty.green / total) * 100;
    const yellowPct = (difficulty.yellow / total) * 100;
    const redPct = (difficulty.red / total) * 100;

    if (greenPct > 0) {
        const segG = document.createElement("div");
        segG.className = "segment-green";
        segG.style.width = `${greenPct}%`;
        bar.appendChild(segG);
    }

    if (yellowPct > 0) {
        const segY = document.createElement("div");
        segY.className = "segment-yellow";
        segY.style.width = `${yellowPct}%`;
        bar.appendChild(segY);
    }

    if (redPct > 0) {
        const segR = document.createElement("div");
        segR.className = "segment-red";
        segR.style.width = `${redPct}%`;
        bar.appendChild(segR);
    }

    return bar;
}

// ==========================================================
// Scroll Vertical Automatizado: Rápido al inicio, semi-lento al final
// ==========================================================
function automatedSmoothScroll(targetY, duration = 1200) {
    const startY = window.pageYOffset;
    const diff = targetY - startY;
    let startTime = null;

    function step(currentTime) {
        if (!startTime) startTime = currentTime;
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Curva de desaceleración: inicio muy rápido y desaceleración suave (Quartic Ease-Out)
        const ease = 1 - Math.pow(1 - progress, 3.8);

        window.scrollTo(0, startY + diff * ease);

        if (progress < 1) {
            requestAnimationFrame(step);
        }
    }

    requestAnimationFrame(step);
}

// ==========================================================
// Renderizado y Control de Pantallas
// ==========================================================

const screen1 = document.getElementById("screen-1");
const screen2 = document.getElementById("screen-2");
const screen3Modal = document.getElementById("screen-3-modal");

const cracksContainer = document.getElementById("cracks-container");
const categoryDescriptionText = document.getElementById("category-description-text");
const btnReturnScreen1 = document.getElementById("btn-return-screen1");
const btnCloseModal = document.getElementById("btn-close-modal");

// Configuración de interacción en Pantalla 1 (Hover en categorías)
function setupScreen1Interactions() {
    const categoryBtns = document.querySelectorAll(".category-btn");

    categoryBtns.forEach(btn => {
        const cat = btn.getAttribute("data-category");

        btn.addEventListener("mouseenter", () => {
            if (CATEGORY_DESCRIPTIONS[cat]) {
                categoryDescriptionText.textContent = CATEGORY_DESCRIPTIONS[cat];
                categoryDescriptionText.classList.add("visible");
            }
        });

        btn.addEventListener("mouseleave", () => {
            categoryDescriptionText.classList.remove("visible");
        });

        btn.addEventListener("click", () => {
            if (cat === "fisicas") {
                // Desplazamiento vertical automatizado hacia Pantalla 2
                const targetPos = screen2.offsetTop;
                automatedSmoothScroll(targetPos, 1200);
            }
        });
    });
}

// Renderizar las líneas con patrones de grietas procedurales en Pantalla 2
function renderCracks() {
    cracksContainer.innerHTML = "";
    const streets = getOrderedStreets();

    const minHeight = 32;
    const maxHeight = 82;
    const minTotal = 2;
    const maxTotal = 10;

    streets.forEach(street => {
        const total = getPhysicalTotal(street);
        const percentage = ((total / TOTAL_PHYSICAL_ALL) * 100).toFixed(1);

        const height = minHeight + ((total - minTotal) / (maxTotal - minTotal)) * (maxHeight - minHeight);

        const crackRow = document.createElement("div");
        crackRow.className = "crack-row";
        crackRow.style.height = `${height}px`;

        // Generar patrón de grieta procedural único y aleatorio para cada barra
        crackRow.style.clipPath = generateRandomCrackClipPath();

        const content = document.createElement("div");
        content.className = "crack-content";

        const label = document.createElement("span");
        label.className = "street-label";
        label.textContent = `${street.name} - ${percentage}%`;
        content.appendChild(label);

        // Barra inferior de colores al hover
        const diffBar = createDifficultyBar(street.difficulty);

        crackRow.appendChild(content);
        crackRow.appendChild(diffBar);

        // Al hacer click: abre Pantalla 3 con la transición desde abajo hacia arriba (1s suave)
        crackRow.addEventListener("click", () => {
            openScreen3(street, percentage);
        });

        cracksContainer.appendChild(crackRow);
    });
}

// ==========================================================
// Transiciones de Pantalla 3
// ==========================================================

// Abrir Pantalla 3: Desde abajo hacia arriba (rápida con final suave, 1s)
function openScreen3(street, percentage) {
    // Inyectar datos de la calle
    const breakdownContainer = document.getElementById("detail-breakdown");
    breakdownContainer.innerHTML = `
        <ul>
            <li>Baches y desniveles: ${street.physical.baches}</li>
            <li>Falta de señaléticas: ${street.physical.faltaSenales}</li>
            <li>Poco espacio peatonal: ${street.physical.pocoEspacio}</li>
        </ul>
    `;

    const detailBar = document.getElementById("detail-crack-bar");
    const detailTitle = document.getElementById("detail-street-title");
    const detailDiffBarContainer = document.getElementById("detail-difficulty-bar");

    detailTitle.textContent = `${street.name} - ${percentage}%`;

    // Asignar el color resultante de la mezcla ponderada
    const blendedColor = calculateBlendedColor(street.difficulty);
    detailBar.style.backgroundColor = blendedColor;

    // Generar la barra segmentada inferior
    detailDiffBarContainer.innerHTML = "";
    const newDiffBar = createDifficultyBar(street.difficulty);
    while (newDiffBar.firstChild) {
        detailDiffBarContainer.appendChild(newDiffBar.firstChild);
    }

    // Iniciar transición de entrada desde abajo
    screen3Modal.classList.remove("exiting");
    // Forzar reflow para asegurar animación fluida
    void screen3Modal.offsetWidth;
    screen3Modal.classList.add("entering");
    screen3Modal.setAttribute("aria-hidden", "false");
}

// Cerrar Pantalla 3: Rápida, sin final suave, hacia la derecha hasta salir
function closeScreen3() {
    screen3Modal.classList.remove("entering");
    screen3Modal.classList.add("exiting");

    // Cuando termine la transición de salida (0.35s), volver al estado base
    setTimeout(() => {
        screen3Modal.classList.remove("exiting");
        screen3Modal.setAttribute("aria-hidden", "true");
    }, 360);
}

// Botón de retorno de Pantalla 2 a Pantalla 1
btnReturnScreen1.addEventListener("click", () => {
    automatedSmoothScroll(0, 1100);
});

// Botón para cerrar Pantalla 3
btnCloseModal.addEventListener("click", () => {
    closeScreen3();
});

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
    setupScreen1Interactions();
    renderCracks();
});
