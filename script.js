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

// ==========================================================
// Funciones de cálculo y utilidades
// ==========================================================

// Calcula el total físico por calle
function getPhysicalTotal(street) {
    const p = street.physical;
    return p.baches + p.faltaSenales + p.pocoEspacio;
}

// Suma total general de condiciones físicas (64)
const TOTAL_PHYSICAL_ALL = STREETS_DATA.reduce((acc, st) => acc + getPhysicalTotal(st), 0);

// Calcula el color RGB ponderado según cantidades de Verde, Amarillo y Rojo
function calculateBlendedColor(difficulty) {
    const { green, yellow, red } = difficulty;
    const total = green + yellow + red;

    if (total === 0) {
        return "rgb(180, 190, 200)"; // Color neutro en caso de 0
    }

    const r = Math.round((green * COLOR_GREEN[0] + yellow * COLOR_YELLOW[0] + red * COLOR_RED[0]) / total);
    const g = Math.round((green * COLOR_GREEN[1] + yellow * COLOR_YELLOW[1] + red * COLOR_RED[1]) / total);
    const b = Math.round((green * COLOR_GREEN[2] + yellow * COLOR_YELLOW[2] + red * COLOR_RED[2]) / total);

    return `rgb(${r}, ${g}, ${b})`;
}

// Barajar array de forma aleatoria (Fisher-Yates)
function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// Ordena los datos: primero la calle con mayor cantidad de datos, el resto aleatorio
function getOrderedStreets() {
    // Encontrar la calle con mayor cantidad de datos (Blanco con 10)
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
    const shuffledRemaining = shuffleArray(remaining);

    return [maxItem, ...shuffledRemaining];
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
// Renderizado de Vistas
// ==========================================================

const cracksContainer = document.getElementById("cracks-container");
const viewOverview = document.getElementById("view-overview");
const viewDetail = document.getElementById("view-detail");
const btnBackOverview = document.getElementById("btn-back-overview");

// Renderizar las líneas/grietas en la vista general
function renderCracks() {
    cracksContainer.innerHTML = "";
    const streets = getOrderedStreets();

    // Rango de grosor: mín 28px (para total 2) a máx 76px (para total 10)
    const minHeight = 28;
    const maxHeight = 76;
    const minTotal = 2;
    const maxTotal = 10;

    streets.forEach(street => {
        const total = getPhysicalTotal(street);
        const percentage = ((total / TOTAL_PHYSICAL_ALL) * 100).toFixed(1);

        // Proporción de altura
        const height = minHeight + ((total - minTotal) / (maxTotal - minTotal)) * (maxHeight - minHeight);

        const crackRow = document.createElement("div");
        crackRow.className = "crack-row";
        crackRow.style.height = `${height}px`;

        const content = document.createElement("div");
        content.className = "crack-content";

        const label = document.createElement("span");
        label.className = "street-label";
        label.textContent = `${street.name} - ${percentage}%`;
        content.appendChild(label);

        // Barra inferior de colores al hacer hover
        const diffBar = createDifficultyBar(street.difficulty);

        crackRow.appendChild(content);
        crackRow.appendChild(diffBar);

        // Al hacer click, ir a la vista de detalle de esa calle
        crackRow.addEventListener("click", () => {
            showDetailView(street, percentage);
        });

        cracksContainer.appendChild(crackRow);
    });
}

// Mostrar vista de detalle
function showDetailView(street, percentage) {
    viewOverview.classList.add("hidden");
    viewDetail.classList.remove("hidden");

    // Llenar desglose de condiciones físicas
    const breakdownContainer = document.getElementById("detail-breakdown");
    breakdownContainer.innerHTML = `
        <ul>
            <li>Baches y desniveles: ${street.physical.baches}</li>
            <li>Falta de señaléticas: ${street.physical.faltaSenales}</li>
            <li>Poco espacio peatonal: ${street.physical.pocoEspacio}</li>
        </ul>
    `;

    // Configurar barra de detalle con el color ponderado
    const detailBar = document.getElementById("detail-crack-bar");
    const detailTitle = document.getElementById("detail-street-title");
    const detailDiffBarContainer = document.getElementById("detail-difficulty-bar");

    detailTitle.textContent = `${street.name} - ${percentage}%`;

    // Aplicar el color de mezcla ponderada
    const blendedColor = calculateBlendedColor(street.difficulty);
    detailBar.style.backgroundColor = blendedColor;

    // Actualizar barra de segmentos inferior
    detailDiffBarContainer.innerHTML = "";
    const newDiffBar = createDifficultyBar(street.difficulty);
    while (newDiffBar.firstChild) {
        detailDiffBarContainer.appendChild(newDiffBar.firstChild);
    }

    // Scroll suave hacia la sección si es necesario
    viewDetail.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

// Volver al listado general
btnBackOverview.addEventListener("click", () => {
    viewDetail.classList.add("hidden");
    viewOverview.classList.remove("hidden");
    viewOverview.scrollIntoView({ behavior: "smooth", block: "nearest" });
});

// Inicializar la visualización
document.addEventListener("DOMContentLoaded", () => {
    renderCracks();
});
