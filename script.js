// ==========================================================
// 1. CONFIGURACIÓN GENERAL DE ESCENA, CROMATISMO E INTERACCIÓN
// ==========================================================
// Escala espacial: 1 unidad = 1 cm.
// Elevación máxima de las bandas: 5.0 unidades (~5 cm).

const SCENE_CONFIG = {
    surface: {
        width: 40,
        depth: 30,
        columns: 4,
        rows: 3,
        tabExtension: 2.6,
        gridColor: 0x4a4a4a,
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
        autoRotateSpeed: 0.095,
        pauseDecelSpeed: 6.0,
        resumeAccelSpeed: 2.2,
        dragSensitivity: 0.0065,
        dampingFactor: 10.0,
        transitionAscentDuration: 1.05,
        transitionDescentDuration: 1.15
    },
    bandDefaults: {
        width: 2.1,
        thickness: 0.24,
        minPrincipalHeight: 0.20,
        maxPrincipalHeight: 1.06,
        maxElevation: 5.2,
        minHoverElevation: 4.8,
        maxHoverElevation: 6.4,
        maxSecondaryBands: 9,
        secondaryThicknessMax: 0.16,
        secondaryThicknessMin: 0.12,
        secondaryWidthRatio: 0.90,
        secondaryFloorClearance: 0.05,
        animationSpeed: 6.8,
        returnDuration: 1.0,
        maxLateralOffset: 1.4,
        lateralSensitivity: 0.42,
        lengthSegments: 96,
        hitboxWidthRatio: 0.86,
        filterTransitionSpeed: 3.4,
        silhouetteColor: 0x252830
    },
    chromatic: {
        minNormalizedIntensity: 0.24,
        maxNormalizedIntensity: 1.00,
        singleColorScaleMax: 9,
        baseHex: {
            green: "#2ee56d",
            yellow: "#f0bf2d",
            red: "#e84331"
        },
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
        initialHeight: 0.44,
        hoverHeight: 1.30,
        separation: 0.22,
        textSize: 1.16,
        hoverScale: 1.22,
        orientationInDuration: 0.22,
        orientationOutDuration: 0.82,
        maxBloomIntensity: 0.40,
        disabledTextColor: 0x5c6270
    }
};

// ==========================================================
// 2. DATOS DEL MODELO 1: BARRIO DE SAN NICOLÁS (BUENOS AIRES)
// ==========================================================

const BUENOS_AIRES_RAW_RECORDS = [
    // 4 Bandas Horizontales
    { id: "banda-uruguay",    type: "horizontal", name: "Uruguay",    green: 6,  yellow: 4,  red: 1, rowIndex: 0 },
    { id: "banda-talcahuano", type: "horizontal", name: "Talcahuano", green: 17, yellow: 4,  red: 2, rowIndex: 1 },
    { id: "banda-libertad",   type: "horizontal", name: "Libertad",   green: 18, yellow: 5,  red: 0, rowIndex: 2 },
    { id: "banda-cerrito",    type: "horizontal", name: "Cerrito",    green: 8,  yellow: 10, red: 3, rowIndex: 3 },

    // 3 Intertramos Horizontales
    { id: "intertramo-h-uruguay-talcahuano",  type: "intertramo_horizontal", name: "Entre Uruguay y Talcahuano",  green: 1, yellow: 1, red: 0, betweenRows: [0, 1] },
    { id: "intertramo-h-talcahuano-libertad", type: "intertramo_horizontal", name: "Entre Talcahuano y Libertad", green: 0, yellow: 1, red: 0, betweenRows: [1, 2] },
    { id: "intertramo-h-libertad-cerrito",    type: "intertramo_horizontal", name: "Entre Libertad y Cerrito",    green: 1, yellow: 1, red: 0, betweenRows: [2, 3] },

    // 5 Bandas Verticales
    { id: "banda-av-corrientes", type: "vertical", name: "Av. Corrientes", green: 5, yellow: 4, red: 3, colIndex: 0 },
    { id: "banda-lavalle",       type: "vertical", name: "Lavalle",        green: 3, yellow: 5, red: 2, colIndex: 1 },
    { id: "banda-tucuman",       type: "vertical", name: "Tucumán",        green: 8, yellow: 1, red: 0, colIndex: 2 },
    { id: "banda-viamonte",      type: "vertical", name: "Viamonte",       green: 4, yellow: 3, red: 0, colIndex: 3 },
    { id: "banda-av-cordoba",    type: "vertical", name: "Av. Córdoba",    green: 5, yellow: 3, red: 3, colIndex: 4 },

    // 3 Intertramos Verticales
    { id: "intertramo-v-corrientes-lavalle", type: "intertramo_vertical", name: "Entre Av. Corrientes y Lavalle", green: 0, yellow: 2, red: 2, betweenCols: [0, 1] },
    { id: "intertramo-v-lavalle-tucuman",    type: "intertramo_vertical", name: "Entre Lavalle y Tucumán",       green: 2, yellow: 0, red: 0, betweenCols: [1, 2] },
    { id: "intertramo-v-tucuman-viamonte",   type: "intertramo_vertical", name: "Entre Tucumán y Viamonte",      green: 1, yellow: 0, red: 0, betweenCols: [2, 3] },

    // 1 Referencia Vertical
    { id: "referencia-v-costado-cordoba", type: "referencia_vertical", name: "Al costado derecho de Av. Córdoba", green: 2, yellow: 0, red: 0, referenceCol: 4 }
];

const BUENOS_AIRES_VALIDATION = { green: 81, yellow: 44, red: 16, total: 141 };

const BUENOS_AIRES_STREET_DETAILS = {
    "banda-av-corrientes": {
        id: "banda-av-corrientes",
        name: "Av. Corrientes",
        difficultyStats: { mayorDificultad: 9, menorDificultad: 1, mediaDificultad: 2.11 },
        urbanAspects: {
            estadoCallesVeredas: { si: 0, no: 10 },
            crucesOrientacion: { si: 2, no: 8 },
            ruido: { si: 1, no: 9 },
            iluminacion: { si: 1, no: 9 },
            espaciosDescanso: { si: 0, no: 10 }
        },
        comentariosNegativos: [
            "No vengo seguido, vine por salud, Buenos Aires está bien adaptado, pero la empatía de los autos 0. Tengo que ir asistido.",
            "A la noche inseguridad, apagan las luces y se vuelve un nido de drogadictos.",
            "Yo crecí acá, te producen adrenalina los cambios, hay más tránsito de autos que antes.",
            "No me gustan los espacios con mucha gente.",
            "Cruzar no es seguro, los autos no paran."
        ],
        comentariosPositivos: [
            "Tengo momentos muy lindos, muchos recuerdos.",
            "Siempre venía aquí con mi familia de pequeño.",
            "Es lindo pasar aquí, está todo pastizado, está el Teatro Colón y las plazas.",
            "Es mi casa.",
            "Yo conozco aquí de chiquita, yo jugaba acá, ahora vivo, hago taichí y salgo a caminar, es re lindo.",
            "Hay mucha gente, hay policías, la gente se ve amable, es lindo."
        ],
        otrosAspectos: [
            { texto: "Tránsito de autos muy ordenado", contexto: "Mayor" },
            { texto: "Muy seguro", contexto: "Mayor" },
            { texto: "Buenas veredas, luz, bancas y vegetación", contexto: "Mayor" },
            { texto: "Tráfico vehicular", contexto: "Mayor" },
            { texto: "Seguridad", contexto: "Mayor" },
            { texto: "Cambio del sentido de las calles", contexto: "Mayor" },
            { texto: "Los perros sin bozal", contexto: "Mayor" },
            { texto: "Poca seguridad de noche", contexto: "Mayor" },
            { texto: "Tráfico vehicular", contexto: "Menor" }
        ],
        emociones: [
            { texto: "Alegría y melancolía", contexto: "Mayor" },
            { texto: "Nostalgia", contexto: "Mayor" },
            { texto: "Seguridad", contexto: "Mayor" },
            { texto: "Falta empatía", contexto: "Mayor" },
            { texto: "Adrenalina", contexto: "Mayor" },
            { texto: "Naturalidad", contexto: "Mayor" },
            { texto: "Amor", contexto: "Mayor" },
            { texto: "Seguridad", contexto: "Menor" }
        ]
    },
    "banda-cerrito": {
        id: "banda-cerrito",
        name: "Cerrito",
        difficultyStats: { mayorDificultad: 5, menorDificultad: 5, mediaDificultad: 2.60 },
        urbanAspects: {
            estadoCallesVeredas: { si: 0, no: 10 },
            crucesOrientacion: { si: 3, no: 7 },
            ruido: { si: 0, no: 10 },
            iluminacion: { si: 0, no: 10 },
            espaciosDescanso: { si: 0, no: 10 }
        },
        comentariosNegativos: [
            "A la noche es más inseguro, he visto arrebatos a los turistas. Lamentablemente hay muchas personas en situación de calle.",
            "No vengo seguido, vine por salud, Buenos Aires está bien adaptado, pero la empatía de los autos 0. Tengo que ir asistido.",
            "Yo crecí acá, te producen adrenalina los cambios, hay más tránsito de autos que antes.",
            "Cruzar no es seguro, los autos no paran.",
            "Depende de la hora, de noche es muy oscuro, de día está bien."
        ],
        comentariosPositivos: [
            "Tengo momentos muy lindos, muchos recuerdos.",
            "Me gusta venir los días soleados los findes.",
            "Me encanta venir y tirarme al pasto con sol.",
            "Es mi casa.",
            "Es muy seguro. Vivo en Tucumán.",
            "Hay mucha gente, hay policías, la gente se ve amable, es lindo.",
            "Cerrito la calle es más abierta. Aquí es como un pulmón verde, a veces vengo 1 vez por semana.",
            "Cerrito parece una calle ancha."
        ],
        otrosAspectos: [
            { texto: "Tránsito de autos muy ordenado", contexto: "Mayor" },
            { texto: "Poca seguridad de noche, poco tráfico", contexto: "Mayor" },
            { texto: "Tráfico vehicular", contexto: "Mayor" },
            { texto: "Cambio del sentido de las calles", contexto: "Mayor" },
            { texto: "Buenas veredas, luz, bancas y vegetación", contexto: "Menor" },
            { texto: "Buena señalización y circulación", contexto: "Menor" },
            { texto: "Tráfico vehicular", contexto: "Menor" },
            { texto: "Tribunales y colegios dificultan el tránsito", contexto: "Menor" },
            { texto: "Oscuridad, falta seguridad", contexto: "Menor" }
        ],
        emociones: [
            { texto: "Alegría y melancolía", contexto: "Mayor" },
            { texto: "Tranquilidad", contexto: "Mayor" },
            { texto: "Paz", contexto: "Mayor" },
            { texto: "Falta empatía", contexto: "Mayor" },
            { texto: "Adrenalina", contexto: "Mayor" },
            { texto: "Seguridad", contexto: "Menor" },
            { texto: "Relajo", contexto: "Menor" },
            { texto: "Curiosidad", contexto: "Menor" }
        ]
    },
    "banda-libertad": {
        id: "banda-libertad",
        name: "Libertad",
        difficultyStats: { mayorDificultad: 4, menorDificultad: 5, mediaDificultad: 1.00 },
        urbanAspects: {
            estadoCallesVeredas: { si: 0, no: 9 },
            crucesOrientacion: { si: 0, no: 9 },
            ruido: { si: 0, no: 9 },
            iluminacion: { si: 0, no: 9 },
            espaciosDescanso: { si: 0, no: 9 }
        },
        comentariosNegativos: [
            "En Libertad a veces no es tan fácil por los colegios, la gente se junta.",
            "El horario me dificulta un poco porque duermo en la plaza."
        ],
        comentariosPositivos: [
            "Me encanta. Es jubilada y practica taichí, me siento segura.",
            "Me gusta, se siente cómodo.",
            "Yo conozco aquí de chiquita, yo jugaba acá, ahora vivo, hago taichí y salgo a caminar, es re lindo.",
            "Aquí es como un pulmón verde, a veces vengo 1 vez por semana.",
            "Vivo a tres cuadras de aquí, me encanta el sector.",
            "Tengo momentos muy lindos, muchos recuerdos.",
            "Es muy seguro. Vivo en Tucumán.",
            "Yo me relajo mucho, me siento bien, hay una sombra espectacular. Vengo 2-3 veces a la semana unas 3-5 horas.",
            "Vengo a tomar aire, como 10 veces a la semana."
        ],
        otrosAspectos: [
            { texto: "Seguridad positiva", contexto: "Mayor" },
            { texto: "Lugar cómodo sin mucha gente", contexto: "Mayor" },
            { texto: "Poca seguridad de noche", contexto: "Mayor" },
            { texto: "Tribunales y colegios dificultan el tránsito", contexto: "Mayor" },
            { texto: "Tránsito de autos muy ordenado", contexto: "Menor" },
            { texto: "Buena señalización y circulación", contexto: "Menor" },
            { texto: "Destaca ruido, iluminación y descanso", contexto: "Menor" }
        ],
        emociones: [
            { texto: "Paz", contexto: "Mayor" },
            { texto: "Comodidad", contexto: "Mayor" },
            { texto: "Amor", contexto: "Mayor" },
            { texto: "Relajo", contexto: "Mayor" },
            { texto: "Tranquilidad cerca de la plaza", contexto: "Menor" },
            { texto: "Alegría y melancolía", contexto: "Menor" },
            { texto: "Relajo", contexto: "Menor" },
            { texto: "Tranquilidad", contexto: "Menor" }
        ]
    },
    "banda-uruguay": {
        id: "banda-uruguay",
        name: "Uruguay",
        difficultyStats: { mayorDificultad: 4, menorDificultad: 1, mediaDificultad: 2.00 },
        urbanAspects: {
            estadoCallesVeredas: { si: 0, no: 5 },
            crucesOrientacion: { si: 1, no: 4 },
            ruido: { si: 0, no: 5 },
            iluminacion: { si: 0, no: 5 },
            espaciosDescanso: { si: 0, no: 5 }
        },
        comentariosNegativos: [
            "El horario me dificulta un poco porque duermo en la plaza.",
            "No me gustan los espacios con mucha gente.",
            "Cruzar no es seguro, los autos no paran."
        ],
        comentariosPositivos: [
            "Vivo a tres cuadras de aquí, me encanta el sector.",
            "Siempre que puedo, vengo.",
            "Hay mucha gente, hay policías, la gente se ve amable, es lindo.",
            "Me encanta. Es jubilada y practica taichí, me siento segura."
        ],
        otrosAspectos: [
            { texto: "Mucho tránsito de autos que no dejan cruzar", contexto: "Mayor" },
            { texto: "Los perros sin bozal", contexto: "Mayor" },
            { texto: "Tráfico vehicular", contexto: "Mayor" },
            { texto: "Seguridad positiva", contexto: "Menor" }
        ],
        emociones: [
            { texto: "Tranquilidad cerca de la plaza", contexto: "Mayor" },
            { texto: "Tranquilidad", contexto: "Mayor" },
            { texto: "Naturalidad", contexto: "Mayor" },
            { texto: "Seguridad", contexto: "Mayor" },
            { texto: "Paz", contexto: "Menor" }
        ]
    },
    "banda-talcahuano": {
        id: "banda-talcahuano",
        name: "Talcahuano",
        difficultyStats: { mayorDificultad: 3, menorDificultad: 12, mediaDificultad: 1.33 },
        urbanAspects: {
            estadoCallesVeredas: { si: 1, no: 14 },
            crucesOrientacion: { si: 1, no: 14 },
            ruido: { si: 0, no: 15 },
            iluminacion: { si: 0, no: 15 },
            espaciosDescanso: { si: 0, no: 15 }
        },
        comentariosNegativos: [
            "Hay lugares con un amotinamiento de personas en situación de calle, es un poco peligroso.",
            "En Talcahuano están los tribunales y hay obras, está un poco complicado con tanta gente.",
            "A la noche es más inseguro, he visto arrebatos a los turistas. Lamentablemente hay muchas personas en situación de calle.",
            "En auto es difícil de transitar por la plaza.",
            "Cruzar no es seguro, los autos no paran."
        ],
        comentariosPositivos: [
            "Si no conoces y preguntas la gente te ayuda, son todos muy solidarios.",
            "Aquí es como un pulmón verde, a veces vengo 1 vez por semana.",
            "Me encanta.",
            "Vivo a 25 cuadras de aquí y tengo una librería.",
            "Me gusta, se siente cómodo.",
            "Tengo momentos muy lindos, muchos recuerdos.",
            "Me gusta venir los días soleados los findes.",
            "Siempre venía aquí con mi familia de pequeño.",
            "Siempre que puedo, vengo.",
            "Vivo aquí hace años. En general es muy tranquilo.",
            "Yo me relajo mucho, me siento bien, hay una sombra espectacular. Vengo 2-3 veces a la semana unas 3-5 horas.",
            "Vengo a tomar aire, como 10 veces a la semana.",
            "Hay mucha gente, hay policías, la gente se ve amable, es lindo."
        ],
        otrosAspectos: [
            { texto: "Con manifestaciones todo es inseguro", contexto: "Mayor" },
            { texto: "Tribunales y colegios dificultan el tránsito", contexto: "Mayor" },
            { texto: "Mucha gente", contexto: "Menor" },
            { texto: "Lugar cómodo sin mucha gente", contexto: "Menor" },
            { texto: "Tránsito de autos muy ordenado", contexto: "Menor" },
            { texto: "Poca seguridad de noche, poco tráfico", contexto: "Menor" },
            { texto: "Mucho tránsito que no deja cruzar", contexto: "Menor" },
            { texto: "Tráfico vehicular", contexto: "Menor" },
            { texto: "Destaca ruido, iluminación y descanso", contexto: "Menor" }
        ],
        emociones: [
            { texto: "Familiaridad", contexto: "Mayor" },
            { texto: "Tranquilidad", contexto: "Mayor" },
            { texto: "Relajo", contexto: "Mayor" },
            { texto: "Alegría", contexto: "Menor" },
            { texto: "Emoción, tranquilidad y felicidad", contexto: "Menor" },
            { texto: "Comodidad", contexto: "Menor" },
            { texto: "Alegría y melancolía", contexto: "Menor" },
            { texto: "Nostalgia", contexto: "Menor" },
            { texto: "Gusto", contexto: "Menor" },
            { texto: "Familiaridad", contexto: "Menor" },
            { texto: "Relajo", contexto: "Menor" },
            { texto: "Seguridad", contexto: "Menor" }
        ]
    },
    "banda-av-cordoba": {
        id: "banda-av-cordoba",
        name: "Av. Córdoba",
        difficultyStats: { mayorDificultad: 3, menorDificultad: 2, mediaDificultad: 2.33 },
        urbanAspects: {
            estadoCallesVeredas: { si: 0, no: 5 },
            crucesOrientacion: { si: 1, no: 4 },
            ruido: { si: 0, no: 5 },
            iluminacion: { si: 0, no: 5 },
            espaciosDescanso: { si: 0, no: 5 }
        },
        comentariosNegativos: [
            "El horario me dificulta un poco porque duermo en la plaza.",
            "Córdoba no me gusta por una cuestión de estética. Depende de la hora, de noche es muy oscuro, de día está bien.",
            "No me gustan los espacios con mucha gente."
        ],
        comentariosPositivos: [
            "Vivo a tres cuadras de aquí, me encanta el sector.",
            "Es juez, le gusta Av. Córdoba. Volvió 4 veces a seguir conversando.",
            "Me encanta venir y tirarme al pasto con sol."
        ],
        otrosAspectos: [
            { texto: "Oscuridad, falta seguridad", contexto: "Mayor" },
            { texto: "Los perros sin bozal", contexto: "Menor" }
        ],
        emociones: [
            { texto: "Tranquilidad cerca de la plaza", contexto: "Mayor" },
            { texto: "Gusto", contexto: "Mayor" },
            { texto: "Curiosidad", contexto: "Mayor" },
            { texto: "Paz", contexto: "Menor" },
            { texto: "Naturalidad", contexto: "Menor" }
        ]
    },
    "banda-lavalle": {
        id: "banda-lavalle",
        name: "Lavalle",
        difficultyStats: { mayorDificultad: 3, menorDificultad: 5, mediaDificultad: 1.00 },
        urbanAspects: {
            estadoCallesVeredas: { si: 1, no: 7 },
            crucesOrientacion: { si: 0, no: 8 },
            ruido: { si: 0, no: 8 },
            iluminacion: { si: 0, no: 8 },
            espaciosDescanso: { si: 0, no: 8 }
        },
        comentariosNegativos: [
            "En auto es difícil de transitar por la plaza.",
            "En Lavalle los abogados se juntan en la calle, es complicado.",
            "De noche post 7 se pone peligroso, hay algunas personas en situación de calle."
        ],
        comentariosPositivos: [
            "Vivo aquí hace años. En general es muy tranquilo.",
            "Yo conozco aquí de chiquita, yo jugaba acá, ahora vivo, hago taichí y salgo a caminar, es re lindo.",
            "Aquí es como un pulmón verde, a veces vengo 1 vez por semana.",
            "Está todo bien cuidado. Tomo el Obelisco como punto de referencia cada vez que vengo.",
            "Siento que aquí puedo respirar.",
            "Es lindo, está fresco."
        ],
        otrosAspectos: [
            { texto: "Tráfico vehicular", contexto: "Mayor" },
            { texto: "Poca seguridad de noche", contexto: "Mayor" },
            { texto: "Tribunales y colegios dificultan el tránsito", contexto: "Mayor" },
            { texto: "Buen estado de veredas, poco ruido y buena señalización", contexto: "Menor" },
            { texto: "Seguridad", contexto: "Menor" }
        ],
        emociones: [
            { texto: "Familiaridad", contexto: "Mayor" },
            { texto: "Amor", contexto: "Mayor" },
            { texto: "Relajo", contexto: "Mayor" },
            { texto: "Tranquilidad", contexto: "Menor" },
            { texto: "Alivio", contexto: "Menor" },
            { texto: "Frescura, alivio, contento", contexto: "Menor" },
            { texto: "Algo inseguro", contexto: "Menor" },
            { texto: "Satisfacción", contexto: "Menor" }
        ]
    },
    "banda-tucuman": {
        id: "banda-tucuman",
        name: "Tucumán",
        difficultyStats: { mayorDificultad: 0, menorDificultad: 11, mediaDificultad: null },
        urbanAspects: {
            estadoCallesVeredas: { si: 1, no: 10 },
            crucesOrientacion: { si: 0, no: 11 },
            ruido: { si: 1, no: 10 },
            iluminacion: { si: 1, no: 10 },
            espaciosDescanso: { si: 0, no: 11 }
        },
        comentariosNegativos: [
            "A la noche inseguridad, apagan las luces y se vuelve un nido de drogadictos."
        ],
        comentariosPositivos: [
            "Tengo momentos muy lindos, muchos recuerdos.",
            "Está todo bien cuidado. Tomo el Obelisco como punto de referencia cada vez que vengo.",
            "Me emociona ver lo lindo que está.",
            "Siento que aquí puedo respirar.",
            "Me gusta lo que he visto hasta ahora.",
            "Es lindo pasar aquí, está todo pastizado, está el Teatro Colón y las plazas.",
            "Es muy seguro. Vivo en Tucumán.",
            "Yo me relajo mucho, me siento bien, hay una sombra espectacular. Vengo 2-3 veces a la semana unas 3-5 horas.",
            "Vengo a tomar aire, como 10 veces a la semana.",
            "Aquí es como un pulmón verde, a veces vengo 1 vez por semana."
        ],
        otrosAspectos: [
            { texto: "Tránsito de autos muy ordenado", contexto: "Menor" },
            { texto: "Buen estado de veredas, poco ruido y buena señalización", contexto: "Menor" },
            { texto: "Seguridad", contexto: "Menor" },
            { texto: "Muy seguro", contexto: "Menor" },
            { texto: "Buena señalización y circulación", contexto: "Menor" },
            { texto: "Destaca ruido, iluminación y descanso", contexto: "Menor" },
            { texto: "Tribunales y colegios dificultan el tránsito", contexto: "Menor" }
        ],
        emociones: [
            { texto: "Alegría y melancolía", contexto: "Menor" },
            { texto: "Tranquilidad", contexto: "Menor" },
            { texto: "Emoción", contexto: "Menor" },
            { texto: "Alivio", contexto: "Menor" },
            { texto: "Paz y tranquilidad", contexto: "Menor" },
            { texto: "Seguridad", contexto: "Menor" },
            { texto: "Nostalgia", contexto: "Menor" },
            { texto: "Relajo", contexto: "Menor" }
        ]
    },
    "banda-viamonte": {
        id: "banda-viamonte",
        name: "Viamonte",
        difficultyStats: { mayorDificultad: 0, menorDificultad: 10, mediaDificultad: null },
        urbanAspects: {
            estadoCallesVeredas: { si: 2, no: 8 },
            crucesOrientacion: { si: 1, no: 9 },
            ruido: { si: 1, no: 9 },
            iluminacion: { si: 1, no: 9 },
            espaciosDescanso: { si: 0, no: 10 }
        },
        comentariosNegativos: [
            "Cuando hay tribunales se me hace complicado transitar.",
            "A la noche inseguridad, apagan las luces y se vuelve un nido de drogadictos.",
            "Los autos no respetan, si quieren te pasan por encima."
        ],
        comentariosPositivos: [
            "Tengo momentos muy lindos, muchos recuerdos.",
            "Siento que aquí puedo respirar.",
            "He vivido aquí toda mi vida, de muy chico mis papás trabajaban en el sector.",
            "Yo me relajo mucho, me siento bien, hay una sombra espectacular. Vengo 2-3 veces a la semana unas 3-5 horas.",
            "Vengo a tomar aire, como 10 veces a la semana.",
            "Es lindo, me gustan las plantas.",
            "Aquí es como un pulmón verde, a veces vengo 1 vez por semana."
        ],
        otrosAspectos: [
            { texto: "Tránsito de autos muy ordenado", contexto: "Menor" },
            { texto: "Seguridad", contexto: "Menor" },
            { texto: "Le gustan las calles amplias", contexto: "Menor" },
            { texto: "Manifestaciones", contexto: "Menor" },
            { texto: "Destaca ruido, iluminación y descanso", contexto: "Menor" },
            { texto: "Tráfico vehicular", contexto: "Menor" },
            { texto: "Tribunales y colegios dificultan el tránsito", contexto: "Menor" }
        ],
        emociones: [
            { texto: "Alegría y melancolía", contexto: "Menor" },
            { texto: "Alivio", contexto: "Menor" },
            { texto: "Tranquilidad", contexto: "Menor" },
            { texto: "Entretención", contexto: "Menor" },
            { texto: "Inseguridad", contexto: "Menor" },
            { texto: "Nostalgia", contexto: "Menor" },
            { texto: "Relajo", contexto: "Menor" }
        ]
    }
};

// ==========================================================
// 3. DATOS DEL MODELO 2: BARRIO PUERTO (VALPARAÍSO)
// ==========================================================
// 22 registros oficiales proporcionados en la tabla adjunta (Total: 53V, 46A, 66R = 165).

const VALPARAISO_RAW_RECORDS = [
    // Bandas Horizontales (4 ejes horizontales; el eje superior se divide en los 3 tramos de la tabla y el mapa: Prat, Sotomayor, Serrano)
    {
        id: "valpo-banda-prat-sotomayor",
        type: "horizontal",
        name: "Prat y Sotomayor",
        labelText: "Prat",
        green: 6,
        yellow: 4,
        red: 0,
        customGeom: { x: -19.95, z: -15.0, length: 7.3, width: 2.1, labelOffsetX: -1.1 }
    },
    {
        id: "valpo-banda-prat-sotomayor-serrano",
        type: "horizontal",
        name: "Prat, Sotomayor y Serrano",
        labelText: "Sotomayor",
        green: 3,
        yellow: 0,
        red: 0,
        customGeom: { x: -12.4, z: -15.0, length: 9.8, width: 2.1, labelOffsetX: 0.0 }
    },
    {
        id: "valpo-banda-serrano",
        type: "horizontal",
        name: "Serrano",
        labelText: "Serrano",
        green: 9,
        yellow: 5,
        red: 0,
        customGeom: { x: 8.05, z: -15.0, length: 31.1, width: 2.1, labelOffsetX: -9.5 }
    },
    {
        id: "valpo-banda-cochrane",
        type: "horizontal",
        name: "Cochrane",
        labelText: "Cochrane",
        green: 1,
        yellow: 7,
        red: 20,
        customGeom: { x: 0.0, z: -5.0, length: 47.2, width: 2.1, labelOffsetX: -1.5 }
    },
    {
        id: "valpo-banda-blanco",
        type: "horizontal",
        name: "Blanco",
        labelText: "Blanco",
        green: 1,
        yellow: 7,
        red: 15,
        customGeom: { x: 0.0, z: 5.0, length: 47.2, width: 2.1, labelOffsetX: -2.2 }
    },
    {
        id: "valpo-banda-errazuriz",
        type: "horizontal",
        name: "Errázuriz",
        labelText: "Errázuriz",
        green: 11,
        yellow: 8,
        red: 2,
        customGeom: { x: 0.0, z: 15.0, length: 47.2, width: 2.1, labelOffsetX: -1.5 }
    },

    // Bandas Verticales (6 calles/pasajes verticales + referencia Echaurren / San Martín en el borde derecho)
    {
        id: "valpo-banda-sotomayor-1",
        type: "vertical",
        name: "Sotomayor 1",
        labelText: "Sotomayor",
        green: 2,
        yellow: 2,
        red: 1,
        customGeom: { x: -17.3, z: -1.0, length: 34.4, width: 2.1, labelOffsetZ: 1.0 }
    },
    {
        id: "valpo-banda-sotomayor-2",
        type: "vertical",
        name: "Sotomayor 2",
        labelText: "Sotomayor",
        green: 4,
        yellow: 3,
        red: 1,
        customGeom: { x: -7.5, z: -1.0, length: 34.4, width: 2.1, labelOffsetZ: 1.0 }
    },
    {
        id: "valpo-banda-almte-munoz",
        type: "vertical",
        name: "Almirante Muñoz",
        labelText: "Almte. Muñoz",
        green: 0,
        yellow: 0,
        red: 2,
        customGeom: { x: 1.8, z: 0.0, length: 30.0, width: 1.35, labelOffsetZ: 5.0, textSizeScale: 0.78 }
    },
    {
        id: "valpo-banda-almte-goni",
        type: "vertical",
        name: "Almirante Goñi",
        labelText: "Almte. Goñi",
        green: 0,
        yellow: 1,
        red: 3,
        customGeom: { x: 7.2, z: 0.0, length: 30.0, width: 1.95, labelOffsetZ: 0.0, textSizeScale: 0.86 }
    },
    {
        id: "valpo-banda-almte-perez",
        type: "vertical",
        name: "Almirante Pérez",
        labelText: "Almte. Pérez",
        green: 0,
        yellow: 2,
        red: 1,
        // En el mapa de referencia, Almte. Pérez va desde Serrano (z=-15) hasta Blanco (z=+5)
        customGeom: { x: 12.1, z: -5.0, length: 20.0, width: 1.35, labelOffsetZ: 0.0, textSizeScale: 0.78 }
    },
    {
        id: "valpo-banda-clave",
        type: "vertical",
        name: "Clave",
        labelText: "Clave",
        green: 0,
        yellow: 4,
        red: 6,
        customGeom: { x: 17.0, z: 0.0, length: 30.0, width: 2.1, labelOffsetZ: 0.0 }
    },
    {
        id: "valpo-referencia-echaurren",
        type: "vertical",
        name: "Echaurren",
        labelText: "San Martín",
        green: 0,
        yellow: 1,
        red: 5,
        customGeom: { x: 22.5, z: 0.0, length: 30.0, width: 1.85, labelOffsetZ: 0.0 }
    },

    // Registros de Intertramos y tramo sin calle indicada (almacenados en el motor de datos)
    { id: "valpo-intertramo-v-sotomayor-goni",  type: "intertramo_vertical",   name: "Entre Sotomayor y Almirante Goñi",    green: 1, yellow: 0, red: 0 },
    { id: "valpo-intertramo-h-cochrane-blanco", type: "intertramo_horizontal", name: "Entre Cochrane y Blanco",             green: 0, yellow: 0, red: 6 },
    { id: "valpo-intertramo-v-sotomayor-1-2",   type: "intertramo_vertical",   name: "Entre Sotomayor 1 y 2",               green: 4, yellow: 0, red: 1 },
    { id: "valpo-intertramo-v-izq-sotomayor-1", type: "intertramo_vertical",   name: "A la izquierda de Sotomayor 1",       green: 1, yellow: 0, red: 1 },
    { id: "valpo-intertramo-h-sotomayor-coch",  type: "intertramo_horizontal", name: "Entre Sotomayor y Cochrane",          green: 1, yellow: 0, red: 0 },
    { id: "valpo-intertramo-v-soto2-munoz",     type: "intertramo_vertical",   name: "Entre Sotomayor 2 y Almirante Muñoz", green: 3, yellow: 0, red: 2 },
    { id: "valpo-horizontal-sin-identificar",   type: "horizontal_aux",        name: "Sin calle indicada (T12)",            green: 2, yellow: 1, red: 0 },
    { id: "valpo-intertramo-h-serrano-coch",    type: "intertramo_horizontal", name: "Entre Serrano y Cochrane",            green: 2, yellow: 0, red: 0 },
    { id: "valpo-intertramo-h-blanco-errazuriz",type: "intertramo_horizontal", name: "Entre Blanco y Errázuriz",            green: 2, yellow: 1, red: 0 }
];

const VALPARAISO_VALIDATION = { green: 53, yellow: 46, red: 66, total: 165 };

// ==========================================================
// 3.2. ENCUESTAS Y TESTIMONIOS DE BARRIO PUERTO, VALPARAÍSO (56 REGISTROS)
// ==========================================================
// Cada fila conserva íntegramente la respuesta individual original sin inventar ni completar celdas vacías.
// Equivalencias de bandas en el modelo 3D:
// - "cochrane"  -> ["valpo-banda-cochrane"]
// - "blanco"    -> ["valpo-banda-blanco"]
// - "errazuriz" -> ["valpo-banda-errazuriz"]
// - "serrano"   -> ["valpo-banda-serrano"]
// - "prat"      -> ["valpo-banda-prat-sotomayor"]
// - "sotomayor" -> ["valpo-banda-sotomayor-1", "valpo-banda-sotomayor-2", "valpo-banda-prat-sotomayor-serrano"]
// - "clave"     -> ["valpo-banda-clave"]
// - "goni"      -> ["valpo-banda-almte-goni"]
// - "munoz"     -> ["valpo-banda-almte-munoz"]
// - "perez"     -> ["valpo-banda-almte-perez"]
// - "echaurren" -> ["valpo-referencia-echaurren"]

const VALPO_BAND_GROUPS = {
    cochrane:  ["valpo-banda-cochrane"],
    blanco:    ["valpo-banda-blanco"],
    errazuriz: ["valpo-banda-errazuriz"],
    serrano:   ["valpo-banda-serrano"],
    prat:      ["valpo-banda-prat-sotomayor"],
    sotomayor: ["valpo-banda-sotomayor-1", "valpo-banda-sotomayor-2", "valpo-banda-prat-sotomayor-serrano"],
    clave:     ["valpo-banda-clave"],
    goni:      ["valpo-banda-almte-goni"],
    munoz:     ["valpo-banda-almte-munoz"],
    perez:     ["valpo-banda-almte-perez"],
    echaurren: ["valpo-referencia-echaurren"]
};

function expandValpoKeys(keys) {
    const set = new Set();
    (keys || []).forEach((k) => {
        const mapped = VALPO_BAND_GROUPS[k];
        if (mapped) {
            mapped.forEach((id) => set.add(id));
        }
    });
    return Array.from(set);
}

const VALPARAISO_SURVEY_RESPONSES = [
    {
        id: 1, dificultad: 5,
        mayorRaw: "Cochrane", menorRaw: "Serrano,Prat",
        mayorKeys: ["cochrane"], menorKeys: ["serrano", "prat"],
        veredas: "si", cruces: "si", ruido: "no", iluminacion: "no", descanso: "no",
        otro: null, emociones: "Comodidad ya que vive ahí",
        comentario: "Prefiere caminar más desde Serrano a Prat incluso bajando tras pasar por Sotomayor que hacer un viaje corto por Cochrane o Blanco.",
        testimonios: [
            { texto: "Prefiere caminar más desde Serrano a Prat incluso bajando tras pasar por Sotomayor que hacer un viaje corto por Cochrane o Blanco.", tipo: "negativo", keys: ["cochrane", "blanco"] },
            { texto: "Prefiere caminar desde Serrano a Prat pasando por Sotomayor por mayor comodidad.", tipo: "positivo", keys: ["serrano", "prat", "sotomayor"] }
        ]
    },
    {
        id: 2, dificultad: 4,
        mayorRaw: "Sotomayor", menorRaw: "Almte. Muños, Blanco",
        mayorKeys: ["sotomayor"], menorKeys: ["munoz", "blanco"],
        veredas: "no", cruces: "si", ruido: "no", iluminacion: "no", descanso: "no",
        otro: null, emociones: "Confianza",
        comentario: "Prefiere cruces declarados que adivinar por dónde cruzar.",
        testimonios: [
            { texto: "Prefiere cruces declarados que adivinar por dónde cruzar.", tipo: "negativo", keys: ["sotomayor", "munoz", "blanco"] }
        ]
    },
    {
        id: 3, dificultad: 4,
        mayorRaw: "Cochrane", menorRaw: "Serrano, Sotomayor",
        mayorKeys: ["cochrane"], menorKeys: ["serrano", "sotomayor"],
        veredas: "no", cruces: "no", ruido: "no", iluminacion: "no", descanso: "si",
        otro: null, emociones: "Molestia",
        comentario: "Le molesta saber que las bancas para descansar están ocupadas por vendedores.",
        testimonios: [
            { texto: "Le molesta saber que las bancas para descansar están ocupadas por vendedores.", tipo: "negativo", keys: ["cochrane", "serrano", "sotomayor"] }
        ]
    },
    {
        id: 4, dificultad: 2,
        mayorRaw: "Blanco", menorRaw: "Sotomayor, Errazúriz",
        mayorKeys: ["blanco"], menorKeys: ["sotomayor", "errazuriz"],
        veredas: "si", cruces: "no", ruido: "no", iluminacion: "no", descanso: "no",
        otro: null, emociones: "Nostalgia",
        comentario: "Vivió aquí en su juventud y le apena las condiciones en las que se encuentra Barrio Puerto.",
        testimonios: [
            { texto: "Vivió aquí en su juventud y le apena las condiciones en las que se encuentra Barrio Puerto.", tipo: "mixto", keys: ["blanco", "sotomayor", "errazuriz"] }
        ]
    },
    {
        id: 5, dificultad: 4,
        mayorRaw: "Blanco,Clave, Cochrane, Echaurren", menorRaw: "Sotomayor, Serrano",
        mayorKeys: ["blanco", "clave", "cochrane", "echaurren"], menorKeys: ["sotomayor", "serrano"],
        veredas: "si", cruces: "si", ruido: "no", iluminacion: "no", descanso: "si",
        otro: null, emociones: "Inseguridad",
        comentario: null, testimonios: []
    },
    {
        id: 6, dificultad: 3,
        mayorRaw: "Almte. Goñi, Clave", menorRaw: "Sotomayor, Serrano, Mall",
        mayorKeys: ["goni", "clave"], menorKeys: ["sotomayor", "serrano"],
        espacios: [{ nombre: "Mall", rol: "Menor", keys: [] }],
        veredas: "si", cruces: "no", ruido: "si", iluminacion: "no", descanso: "no",
        otro: null, emociones: "Molestia y cansancio",
        comentario: null, testimonios: []
    },
    {
        id: 7, dificultad: 4,
        mayorRaw: "Almte. Goñi, Clave, Blanco, Cochrane", menorRaw: "Sotomayor, Serrano, Errazúriz",
        mayorKeys: ["goni", "clave", "blanco", "cochrane"], menorKeys: ["sotomayor", "serrano", "errazuriz"],
        veredas: "si", cruces: "si", ruido: "no", iluminacion: "no", descanso: "si",
        otro: null, emociones: "Cansancio",
        comentario: "Menciona pocos lugares para descansar.",
        testimonios: [
            { texto: "Menciona pocos lugares para descansar.", tipo: "negativo", keys: ["goni", "clave", "blanco", "cochrane", "sotomayor", "serrano", "errazuriz"] }
        ]
    },
    {
        id: 8, dificultad: 2,
        mayorRaw: "Cruces Sotomayor a Cochrane, Blanco y Serrano", menorRaw: "Prat, Sotomayor, Serrano",
        mayorKeys: [], menorKeys: ["prat", "sotomayor", "serrano"],
        crucesEsp: [{ nombre: "Cruces Sotomayor a Cochrane, Blanco y Serrano", rol: "Mayor", keys: ["sotomayor", "cochrane", "blanco", "serrano"] }],
        veredas: "no", cruces: "si", ruido: "no", iluminacion: "no", descanso: "no",
        otro: "Tránsito vehicular", emociones: "Inseguridad",
        comentario: "Sobre todo se siente insegura al cruzar las calles.",
        testimonios: [
            { texto: "Sobre todo se siente insegura al cruzar las calles (Cruces Sotomayor a Cochrane, Blanco y Serrano).", tipo: "negativo", keys: ["sotomayor", "cochrane", "blanco", "serrano", "prat"] }
        ]
    },
    {
        id: 9, dificultad: 3,
        mayorRaw: "Almte. Goñi, Clave, Blanco, Cochrane", menorRaw: "Prat, Sotomayor, Serrano",
        mayorKeys: ["goni", "clave", "blanco", "cochrane"], menorKeys: ["prat", "sotomayor", "serrano"],
        veredas: "si", cruces: "no", ruido: "no", iluminacion: "si", descanso: "si",
        otro: "Seguridad", emociones: "Inseguridad",
        comentario: null, testimonios: []
    },
    {
        id: 10, dificultad: 1,
        mayorRaw: "Cochrane", menorRaw: "Serrano",
        mayorKeys: ["cochrane"], menorKeys: ["serrano"],
        veredas: "si", cruces: "no", ruido: "no", iluminacion: "no", descanso: "no",
        otro: null, emociones: "Pena por su estado",
        comentario: null, testimonios: []
    },
    {
        id: 11, dificultad: 2,
        mayorRaw: "Blanco", menorRaw: "Serrano",
        mayorKeys: ["blanco"], menorKeys: ["serrano"],
        veredas: "si", cruces: "no", ruido: "no", iluminacion: "no", descanso: "no",
        otro: null, emociones: "Pena por su estado",
        comentario: null, testimonios: []
    },
    {
        id: 12, dificultad: 1,
        mayorRaw: "Cochrane", menorRaw: "Serrano",
        mayorKeys: ["cochrane"], menorKeys: ["serrano"],
        veredas: "si", cruces: "no", ruido: "no", iluminacion: "no", descanso: "no",
        otro: null, emociones: "Me encanta",
        comentario: null, testimonios: []
    },
    {
        id: 13, dificultad: 2,
        mayorRaw: "Blanco", menorRaw: "Serrano",
        mayorKeys: ["blanco"], menorKeys: ["serrano"],
        veredas: "si", cruces: "si", ruido: "no", iluminacion: "no", descanso: "no",
        otro: null, emociones: "Le agrada",
        comentario: null, testimonios: []
    },
    {
        id: 14, dificultad: 2,
        mayorRaw: "Cochrane", menorRaw: "Serrano",
        mayorKeys: ["cochrane"], menorKeys: ["serrano"],
        veredas: "si", cruces: "no", ruido: "no", iluminacion: "no", descanso: "no",
        otro: null, emociones: "Costumbre",
        comentario: null, testimonios: []
    },
    {
        id: 15, dificultad: 1,
        mayorRaw: "Cochrane", menorRaw: "Serrano, Sotomayor, Blanco, Errázuriz",
        mayorKeys: ["cochrane"], menorKeys: ["serrano", "sotomayor", "blanco", "errazuriz"],
        veredas: "no", cruces: "no", ruido: "no", iluminacion: "no", descanso: "no",
        otro: "Seguridad", emociones: "Me encanta, lo adoro, nací aquí.",
        comentario: "Salgo todos los días, me encanta, camino por todas las calles, conozco a los malandrines.",
        testimonios: [
            { texto: "Salgo todos los días, me encanta, camino por todas las calles, conozco a los malandrines.", tipo: "positivo", keys: ["cochrane", "serrano", "sotomayor", "blanco", "errazuriz"] }
        ]
    },
    {
        id: 16, dificultad: 1,
        mayorRaw: "Todos de noche", menorRaw: "Todos de día",
        mayorKeys: [], menorKeys: [],
        generalTag: "Todos de noche / Todos de día",
        veredas: "si", cruces: "no", ruido: "no", iluminacion: "si", descanso: "si",
        otro: null, emociones: "Lo bueno, lo malo, uno se queda con lo antiguo. Yo puedo caminar de noche, pero los asaltos ocurren.",
        comentario: "Nacido y criado, uno relaciona el recuerdo a la década que marca la vida. Me es cómodo, yo bajo del cerro y voy caminando al centro, me voy tranquilo.",
        testimonios: [
            { texto: "Nacido y criado, uno relaciona el recuerdo a la década que marca la vida. Me es cómodo, yo bajo del cerro y voy caminando al centro, me voy tranquilo (aunque de noche los asaltos ocurren).", tipo: "mixto", keys: [], esGeneral: true }
        ]
    },
    {
        id: 17, dificultad: 5,
        mayorRaw: "Todos", menorRaw: "",
        mayorKeys: [], menorKeys: [],
        generalTag: "Todos",
        veredas: "si", cruces: "si", ruido: "no", iluminacion: "si", descanso: "si",
        otro: null, emociones: "Disconformidad y decepción",
        comentario: "Soy un argentino que viene de turista, está todo mal señalizado, las calles están sucias y dejan mucho que desear.",
        testimonios: [
            { texto: "Soy un argentino que viene de turista, está todo mal señalizado, las calles están sucias y dejan mucho que desear.", tipo: "negativo", keys: [], esGeneral: true }
        ]
    },
    {
        id: 18, dificultad: 3,
        mayorRaw: "Clave", menorRaw: "Serrano y Sotomayor",
        mayorKeys: ["clave"], menorKeys: ["serrano", "sotomayor"],
        veredas: "si", cruces: "si", ruido: "si", iluminacion: "si", descanso: "si",
        otro: "«No hay nada» (Falta de espacios para adultos mayores)", emociones: "Interés por conversar",
        comentario: "Alejandro, 72 años. «En las calles no caben las sillas de ruedas», «El único acceso amplio es Sotomayor», «Hace falta lugar adecuado para la gente mayor». Los arreglos de la plaza suman 1300 millones. ¿Dónde uno se sienta? ¿Dónde traigo a mis nietos? La ciudad necesita espacios de esparcimiento y descanso.",
        testimonios: [
            { texto: "«En las calles no caben las sillas de ruedas». «Hace falta lugar adecuado para la gente mayor. ¿Dónde uno se sienta? ¿Dónde traigo a mis nietos? La ciudad necesita espacios de esparcimiento y descanso».", tipo: "negativo", keys: ["clave", "serrano"] },
            { texto: "«El único acceso amplio es Sotomayor. Si el adulto mayor sale, le ayuda a la familia».", tipo: "positivo", keys: ["sotomayor"] }
        ]
    },
    {
        id: 19, dificultad: 2,
        mayorRaw: "Clave", menorRaw: "",
        mayorKeys: ["clave"], menorKeys: [],
        veredas: null, cruces: null, ruido: null, iluminacion: null, descanso: null,
        otro: "«Nunca me ha pasado nada»", emociones: null,
        comentario: "«Ahora camino por Clave porque como cambiaron los recorridos de las micros, pasa locomoción, pero no me gusta caminar la calle entera, los ladrones arrancan por Clave, tienen calles, esquinas para escapar». «Nunca me ha pasado nada, para mí es seguro porque todos te conocen, yo tengo 67, toda la vida he vivido cerca de la plaza, que me encanta pero está deteriorado, algunos pintan murales y se ve lindo, pero no me gustan los rayados».",
        testimonios: [
            { texto: "«Ahora camino por Clave porque como cambiaron los recorridos de las micros, pasa locomoción, pero no me gusta caminar la calle entera, los ladrones arrancan por Clave, tienen calles y esquinas para escapar».", tipo: "negativo", keys: ["clave"] },
            { texto: "«Nunca me ha pasado nada, para mí es seguro porque todos te conocen, toda la vida he vivido cerca de la plaza, que me encanta pero está deteriorado; algunos pintan murales y se ve lindo, pero no me gustan los rayados».", tipo: "mixto", keys: ["clave"] }
        ]
    },
    {
        id: 20, dificultad: 5,
        mayorRaw: "Todos", menorRaw: "",
        mayorKeys: [], menorKeys: [],
        generalTag: "Todos",
        veredas: "si", cruces: "si", ruido: "si", iluminacion: "si", descanso: "si",
        otro: "«Mucho miedo»", emociones: null,
        comentario: "«He vivido toda mi vida aquí». Mujer.",
        testimonios: [
            { texto: "«He vivido toda mi vida aquí» (expresa mucho miedo al circular).", tipo: "negativo", keys: [], esGeneral: true }
        ]
    },
    {
        id: 21, dificultad: 1,
        mayorRaw: "", menorRaw: "",
        mayorKeys: [], menorKeys: [],
        veredas: "no", cruces: "no", ruido: "no", iluminacion: "no", descanso: "no",
        otro: "«Me encanta»", emociones: null,
        comentario: "«Llegué hace dos años». Mujer.",
        testimonios: [
            { texto: "«Llegué hace dos años. Me encanta».", tipo: "positivo", keys: [], esGeneral: true }
        ]
    },
    {
        id: 22, dificultad: 1,
        mayorRaw: "", menorRaw: "",
        mayorKeys: [], menorKeys: [],
        commentKeys: ["blanco"],
        veredas: "no", cruces: "no", ruido: "no", iluminacion: "no", descanso: "no",
        otro: "«Uno ya cacha» (Mochila por delante)", emociones: null,
        comentario: "Mujer. Yo hago gimnasia, encuentro que Blanco es una calle piola; sobre la seguridad, uno ya cacha (indica su mochila colgada por delante).",
        testimonios: [
            { texto: "«Yo hago gimnasia, encuentro que Blanco es una calle piola; sobre la seguridad, uno ya cacha» (lleva su mochila colgada por delante por precaución).", tipo: "mixto", keys: ["blanco"] }
        ]
    },
    {
        id: 23, dificultad: 5,
        mayorRaw: "Cochrane", menorRaw: "Prat",
        mayorKeys: ["cochrane"], menorKeys: ["prat"],
        commentKeys: ["errazuriz"],
        veredas: "si", cruces: "si", ruido: "si", iluminacion: "no", descanso: "si",
        otro: null, emociones: null,
        comentario: "Me gusta Prat, en Cochrane se estacionan los autos en las dos veredas. En Errázuriz no transita. «Me encanta (el Barrio Puerto), transito con cuidado, es un 5 de difícil, las calles están en mal estado».",
        testimonios: [
            { texto: "«En Cochrane se estacionan los autos en las dos veredas. Transito con cuidado, es un 5 de difícil, las calles están en mal estado».", tipo: "negativo", keys: ["cochrane"] },
            { texto: "«Me gusta Prat. Me encanta el Barrio Puerto».", tipo: "positivo", keys: ["prat"] },
            { texto: "En Errázuriz prefiere no transitar por el mal estado de las calles.", tipo: "negativo", keys: ["errazuriz"] }
        ]
    },
    {
        id: 24, dificultad: 5,
        mayorRaw: "Blanco", menorRaw: "",
        mayorKeys: ["blanco"], menorKeys: [],
        veredas: "si", cruces: "si", ruido: "no", iluminacion: "si", descanso: "si",
        otro: "Abandono", emociones: "Preocupación",
        comentario: "«Todas las calles están rotas, Blanco está abandonado, todo destruido, no hay propuestas para el escándalo del patrimonio».",
        testimonios: [
            { texto: "«Todas las calles están rotas, Blanco está abandonado, todo destruido, no hay propuestas para el escándalo del patrimonio».", tipo: "negativo", keys: ["blanco"] }
        ]
    },
    {
        id: 25, dificultad: 5,
        mayorRaw: "Todas", menorRaw: "Prat",
        mayorKeys: [], menorKeys: ["prat"],
        generalTag: "Todas",
        veredas: "si", cruces: "si", ruido: "si", iluminacion: "si", descanso: "si",
        otro: "Es muy difícil", emociones: null,
        comentario: "«Yo tengo 85, voy al gimnasio, sobre las calles del Barrio Puerto no las recomiendo jamás, es muy difícil».",
        testimonios: [
            { texto: "«Yo tengo 85, voy al gimnasio, sobre las calles del Barrio Puerto no las recomiendo jamás, es muy difícil» (rescata Prat como menor dificultad).", tipo: "negativo", keys: ["prat"], esGeneral: true }
        ]
    },
    {
        id: 26, dificultad: 1,
        mayorRaw: "Cochrane", menorRaw: "Serrano",
        mayorKeys: ["cochrane"], menorKeys: ["serrano"],
        veredas: "si", cruces: "no", ruido: "no", iluminacion: "si", descanso: "no",
        otro: "Delincuencia", emociones: "Tranquilidad",
        comentario: "«No tengo ninguna discapacidad, soy buena para caminar, me encanta el Barrio Puerto, en Viña me desespero porque no conozco, soy nacida y criada en Valparaíso».",
        testimonios: [
            { texto: "«No tengo ninguna discapacidad, soy buena para caminar, me encanta el Barrio Puerto, en Viña me desespero porque no conozco, soy nacida y criada en Valparaíso».", tipo: "positivo", keys: ["cochrane", "serrano"] }
        ]
    },
    {
        id: 27, dificultad: 1,
        mayorRaw: "Blanco", menorRaw: "Serrano, Cochrane",
        mayorKeys: ["blanco"], menorKeys: ["serrano", "cochrane"],
        espacios: [{ nombre: "Plaza Echaurren", rol: "Referencia", keys: ["echaurren"] }],
        veredas: "si", cruces: "si", ruido: "no", iluminacion: "si", descanso: "si",
        otro: "Paradero de colectivos y taxis en Plaza Echaurren", emociones: "Se sentía seguro de lo que hablaba",
        comentario: "Explicó que los colectivos llegaban hasta Cordillera y los demás eran taxis ($1500). «Serrano es la más fácil de caminar».",
        testimonios: [
            { texto: "«Serrano es la más fácil de caminar».", tipo: "positivo", keys: ["serrano"] },
            { texto: "En el paradero de Plaza Echaurren los colectivos llegan hasta Cordillera y los taxis asisten a personas mayores.", tipo: "positivo", keys: ["echaurren", "cochrane", "blanco"] }
        ]
    },
    {
        id: 28, dificultad: 1,
        mayorRaw: "Blanco", menorRaw: "Serrano, Cochrane",
        mayorKeys: ["blanco"], menorKeys: ["serrano", "cochrane"],
        espacios: [{ nombre: "Plaza Echaurren", rol: "Referencia", keys: ["echaurren"] }],
        veredas: "no", cruces: "no", ruido: "no", iluminacion: "si", descanso: "si",
        otro: "Paradero de colectivos y taxis en Plaza Echaurren", emociones: "Explicaba sus ideas conversando con su amigo de 87 años",
        comentario: "«Hay un poco de inseguridad, somos habituales, aquí no entran los turistas». «Cochrane es caminable, Blanco no, es muy solo».",
        testimonios: [
            { texto: "«Hay un poco de inseguridad, somos habituales, aquí no entran los turistas. Blanco no es caminable, es muy solo».", tipo: "negativo", keys: ["blanco", "echaurren"] },
            { texto: "«Cochrane y Serrano son caminables».", tipo: "positivo", keys: ["cochrane", "serrano"] }
        ]
    },
    {
        id: 29, dificultad: 2,
        mayorRaw: "Ninguno", menorRaw: "",
        mayorKeys: [], menorKeys: [],
        generalTag: "Ninguno",
        espacios: [{ nombre: "Plaza Echaurren", rol: "Referencia", keys: ["echaurren"] }],
        veredas: "si", cruces: "no", ruido: "no", iluminacion: "si", descanso: "si",
        otro: "Desorden administrativo, suciedad, droga", emociones: "Enojo con el mundo, pero aceptó acceder a la encuesta",
        comentario: "83 años, sentado en la Plaza Echaurren esperando a su hijo para ir a pescar: «Me da nostalgia el Barrio Puerto, yo soy de toda la vida de aquí, soy jibiero, tengo una embarcación del paralelo 33. No te confíes de nadie».",
        testimonios: [
            { texto: "«Me da nostalgia el Barrio Puerto, yo soy de toda la vida de aquí, soy jibiero, tengo una embarcación. No te confíes de nadie» (sentado en Plaza Echaurren).", tipo: "mixto", keys: ["echaurren"], esGeneral: true }
        ]
    },
    {
        id: 30, dificultad: 1,
        mayorRaw: "Ninguno", menorRaw: "",
        mayorKeys: [], menorKeys: [],
        generalTag: "Ninguno",
        espacios: [{ nombre: "Plaza Echaurren", rol: "Referencia", keys: ["echaurren"] }],
        veredas: "no", cruces: "no", ruido: "no", iluminacion: "si", descanso: "si",
        otro: "Compañía del sector", emociones: "Nostalgia y disposición en conversar",
        comentario: "«Muy lindo el recuerdo, siempre te encuentras con la misma gente, aquí en la plaza nos cuidamos, les llamamos la atención a la gente que vemos destruyendo. Es pacífico, nos conocemos».",
        testimonios: [
            { texto: "«Muy lindo el recuerdo, siempre te encuentras con la misma gente, aquí en la plaza nos cuidamos, les llamamos la atención a la gente que vemos destruyendo. Es pacífico, nos conocemos».", tipo: "positivo", keys: ["echaurren"], esGeneral: true }
        ]
    },
    {
        id: 31, dificultad: 3,
        mayorRaw: "", menorRaw: "",
        mayorKeys: [], menorKeys: [],
        veredas: "si", cruces: "si", ruido: "si", iluminacion: "si", descanso: "si",
        otro: "Movilidad colectiva en adultos mayores", emociones: "Disposición en conversar",
        comentario: "52 años: «Uso mucho la micro, los choferes andan drogados... el que haya harto cerro impide la movilidad, es una aventura, y el transporte no para; ven a la abuelita con el burrito y le hacen el quite».",
        testimonios: [
            { texto: "«El que haya harto cerro impide la movilidad, es una aventura, y el transporte público no para; ven a la abuelita con el burrito y le hacen el quite».", tipo: "negativo", keys: [], esGeneral: true }
        ]
    },
    {
        id: 32, dificultad: 5,
        mayorRaw: "Todos", menorRaw: "",
        mayorKeys: [], menorKeys: [],
        generalTag: "Todos",
        espacios: [{ nombre: "Plaza Echaurren", rol: "Referencia", keys: ["echaurren"] }],
        veredas: "si", cruces: "si", ruido: "no", iluminacion: "si", descanso: "si",
        otro: "Estado de los árboles en la Plaza Echaurren", emociones: "Tranquilidad, sentado con sus amigos",
        comentario: "«Es difícil caminar porque las raíces de los árboles levantan el suelo y eso lo hace irregular, están llenas de hoyos las calles, está abandonado, dejado».",
        testimonios: [
            { texto: "«Es difícil caminar porque las raíces de los árboles levantan el suelo en la Plaza Echaurren y eso lo hace irregular; están llenas de hoyos las calles, está abandonado, dejado».", tipo: "negativo", keys: ["echaurren"], esGeneral: true }
        ]
    },
    {
        id: 33, dificultad: 5,
        mayorRaw: "Todos", menorRaw: "",
        mayorKeys: [], menorKeys: [],
        generalTag: "Todos",
        commentKeys: ["serrano"],
        veredas: "si", cruces: "si", ruido: "si", iluminacion: "si", descanso: "si",
        otro: "Falta de espacios con sombra", emociones: "Aceptación, ligero optimismo y agradecimiento con Dios",
        comentario: "Lorena, 54 años (vende en la vereda de Serrano): «En el entorno todos me conocen, me ubican todos. Bajo todos los días tipo 3-4 y a las 5 me encierro, sólo ando de día.Aquí me regalaron este balde con almohada y me siento. Tengo que estar mirando mis cosas, el otro día una persona en situación de calle me pateó las cosas».",
        testimonios: [
            { texto: "«Me dedico a mi trabajo en la vereda de Serrano, en el entorno todos me conocen, me ubican todos».", tipo: "positivo", keys: ["serrano"] },
            { texto: "«Sólo ando de día, a las 5 me encierro. Me siento en un balde con almohada y tengo que estar mirando mis cosas por agresiones en la calle».", tipo: "negativo", keys: ["serrano"], esGeneral: true }
        ]
    },
    {
        id: 34, dificultad: 2,
        mayorRaw: "Cochrane", menorRaw: "Serrano, Prat",
        mayorKeys: ["cochrane"], menorKeys: ["serrano", "prat"],
        veredas: "si", cruces: "no", ruido: "si", iluminacion: "no", descanso: "no",
        otro: null, emociones: "Costumbre y cariño",
        comentario: "Baja todos los sábados al mercado a comprar pescado. «En Cochrane las micros pasan pegadas a la vereda». Mujer.",
        testimonios: [
            { texto: "«En Cochrane las micros pasan pegadas a la vereda».", tipo: "negativo", keys: ["cochrane"] },
            { texto: "Baja todos los sábados con costumbre y cariño al mercado por Serrano y Prat.", tipo: "positivo", keys: ["serrano", "prat"] }
        ]
    },
    {
        id: 35, dificultad: 4,
        mayorRaw: "Blanco, Clave", menorRaw: "Serrano",
        mayorKeys: ["blanco", "clave"], menorKeys: ["serrano"],
        veredas: "si", cruces: "si", ruido: "no", iluminacion: "no", descanso: "si",
        otro: null, emociones: "Inseguridad y cansancio",
        comentario: "«Las baldosas sueltas son una trampa, uno pisa y salta el agua sucia». «Para sentarse hay que irse a la plaza y casi siempre está llena». Hombre.",
        testimonios: [
            { texto: "«Las baldosas sueltas son una trampa, uno pisa y salta el agua sucia. Para sentarse hay que irse a la plaza y casi siempre está llena».", tipo: "negativo", keys: ["blanco", "clave", "serrano"] }
        ]
    },
    {
        id: 36, dificultad: 4,
        mayorRaw: "Cochrane, Almte. Goñi", menorRaw: "Sotomayor",
        mayorKeys: ["cochrane", "goni"], menorKeys: ["sotomayor"],
        veredas: "si", cruces: "si", ruido: "si", iluminacion: "no", descanso: "si",
        otro: null, emociones: "Preocupación (por las caídas)",
        comentario: "«Por Sotomayor se puede ir más tranquila porque es ancha, pero para cruzar hay que esperar harto». Mujer.",
        testimonios: [
            { texto: "«Por Sotomayor se puede ir más tranquila porque es ancha».", tipo: "positivo", keys: ["sotomayor"] },
            { texto: "«Para cruzar hay que esperar harto» (preocupación por caídas en Cochrane y Almte. Goñi).", tipo: "negativo", keys: ["cochrane", "goni", "sotomayor"] }
        ]
    },
    {
        id: 37, dificultad: 5,
        mayorRaw: "Todos, sobre todo Cochrane y Blanco", menorRaw: "Prat",
        mayorKeys: ["cochrane", "blanco"], menorKeys: ["prat"],
        generalTag: "Todos",
        veredas: "si", cruces: "si", ruido: "si", iluminacion: "no", descanso: "si",
        otro: "Tiempo de los semáforos", emociones: "Miedo y rabia",
        comentario: "«Me operaron hace tres meses y salir al centro es una pesadilla, el semáforo dura nada y con la muleta no alcanzo a cruzar». Cruza solo cuando hay más gente esperando. Mujer.",
        testimonios: [
            { texto: "«Me operaron hace tres meses y salir al centro es una pesadilla, el semáforo dura nada y con la muleta no alcanzo a cruzar» (cruza solo cuando hay más gente esperando).", tipo: "negativo", keys: ["cochrane", "blanco", "prat"], esGeneral: true }
        ]
    },
    {
        id: 38, dificultad: 3,
        mayorRaw: "Cochrane, Almte. Muñoz", menorRaw: "Plaza Sotomayor, Serrano",
        mayorKeys: ["cochrane", "munoz"], menorKeys: ["serrano"],
        espacios: [{ nombre: "Plaza Sotomayor", rol: "Menor", keys: ["sotomayor"] }],
        veredas: "si", cruces: "si", ruido: "no", iluminacion: "no", descanso: "no",
        otro: null, emociones: "Desorientación",
        comentario: "«Hace años que no venía, el barrio es lindo pero está muy descuidado».",
        testimonios: [
            { texto: "«Hace años que no venía, el barrio es lindo pero está muy descuidado».", tipo: "mixto", keys: ["cochrane", "munoz", "serrano", "sotomayor"] }
        ]
    },
    {
        id: 39, dificultad: 2,
        mayorRaw: "Cochrane", menorRaw: "Serrano",
        mayorKeys: ["cochrane"], menorKeys: ["serrano"],
        veredas: "si", cruces: "no", ruido: "si", iluminacion: "no", descanso: "no",
        otro: null, emociones: "Resignación",
        comentario: "Mujer, vende en Serrano hace como 20 años. «Una ya se acostumbró, pero los sábados se llena de gente y la vereda no da». «Los parlantes de los locales a veces no dejan ni conversar».",
        testimonios: [
            { texto: "«Una ya se acostumbró, pero los sábados se llena de gente y la vereda no da. Los parlantes de los locales a veces no dejan ni conversar».", tipo: "negativo", keys: ["cochrane", "serrano"] }
        ]
    },
    {
        id: 40, dificultad: 1,
        mayorRaw: "Ninguno", menorRaw: "Serrano, Sotomayor, Prat, Errázuriz",
        mayorKeys: [], menorKeys: ["serrano", "sotomayor", "prat", "errazuriz"],
        generalTag: "Ninguno",
        espacios: [{ nombre: "Plaza Echaurren", rol: "Referencia", keys: ["echaurren"] }],
        veredas: "no", cruces: "no", ruido: "no", iluminacion: "no", descanso: "no",
        otro: "Miedo a las caídas", emociones: "Tranquilidad, me siento en casa",
        comentario: "Hombre, vive en el sector desde niño y se junta con amigos en la Plaza Echaurren los sábados. «Uno ya sabe por dónde ir, el que viene de afuera se pierde».",
        testimonios: [
            { texto: "Vive en el sector desde niño y se junta con amigos en la Plaza Echaurren los sábados: «Uno ya sabe por dónde ir, me siento en casa; el que viene de afuera se pierde».", tipo: "positivo", keys: ["serrano", "sotomayor", "prat", "errazuriz", "echaurren"] }
        ]
    },
    {
        id: 41, dificultad: 5,
        mayorRaw: "Todas", menorRaw: "Sotomayor",
        mayorKeys: [], menorKeys: ["sotomayor"],
        generalTag: "Todas",
        veredas: "si", cruces: "si", ruido: "no", iluminacion: "si", descanso: "si",
        otro: null, emociones: "Miedo e impotencia",
        comentario: "«Antes caminaba solo hasta el puerto, ahora ni a la esquina me atrevo».",
        testimonios: [
            { texto: "«Antes caminaba solo hasta el puerto, ahora ni a la esquina me atrevo».", tipo: "negativo", keys: ["sotomayor"], esGeneral: true }
        ]
    },
    {
        id: 42, dificultad: 3,
        mayorRaw: "Clave, Almte. Goñi", menorRaw: "Serrano, Sotomayor",
        mayorKeys: ["clave", "goni"], menorKeys: ["serrano", "sotomayor"],
        veredas: "si", cruces: "no", ruido: "no", iluminacion: "no", descanso: "si",
        otro: "Falta de sombra", emociones: "Cansancio y calor",
        comentario: null, testimonios: []
    },
    {
        id: 43, dificultad: 4,
        mayorRaw: "Cochrane con Sotomayor, Blanco", menorRaw: "Prat",
        mayorKeys: ["blanco"], menorKeys: ["prat"],
        crucesEsp: [{ nombre: "Cruce Cochrane con Sotomayor", rol: "Mayor", keys: ["cochrane", "sotomayor"] }],
        veredas: "si", cruces: "si", ruido: "si", iluminacion: "si", descanso: "si",
        otro: "Locomoción y paraderos", emociones: "Molestia y ansiedad",
        comentario: "«Las micros no paran donde uno les hace la seña, hay que subirse casi corriendo». «No hay paradero con techo ni dónde sentarse». Hombre.",
        testimonios: [
            { texto: "«Las micros no paran donde uno les hace la seña, hay que subirse casi corriendo. No hay paradero con techo ni dónde sentarse».", tipo: "negativo", keys: ["cochrane", "sotomayor", "blanco", "prat"] }
        ]
    },
    {
        id: 44, dificultad: 3,
        mayorRaw: "Cochrane, Errázuriz", menorRaw: "Serrano",
        mayorKeys: ["cochrane", "errazuriz"], menorKeys: ["serrano"],
        veredas: "si", cruces: "si", ruido: "si", iluminacion: "no", descanso: "si",
        otro: null, emociones: "Preocupación",
        comentario: "«En Serrano por lo menos se puede andar».",
        testimonios: [
            { texto: "«En Serrano por lo menos se puede andar» (en contraste con Cochrane y Errázuriz).", tipo: "positivo", keys: ["serrano"] },
            { texto: "Preocupación al transitar por Cochrane y Errázuriz por estado de veredas, cruces, ruido y falta de descanso.", tipo: "negativo", keys: ["cochrane", "errazuriz"] }
        ]
    },
    {
        id: 45, dificultad: 1,
        mayorRaw: "Ninguno", menorRaw: "Serrano, Sotomayor",
        mayorKeys: [], menorKeys: ["serrano", "sotomayor"],
        commentKeys: ["blanco"],
        generalTag: "Ninguno",
        veredas: "no", cruces: "no", ruido: "si", iluminacion: "si", descanso: "si",
        otro: "Delincuencia de noche", emociones: "Nostalgia y pena",
        comentario: "Hombre, jubilado, trabajó en el puerto de joven. «Antes esto era otra cosa, había movimiento de verdad, ahora está botado». «De día no tengo problema, de noche no ando ni loco por Blanco».",
        testimonios: [
            { texto: "«Antes esto era otra cosa, había movimiento de verdad, ahora está botado. De día no tengo problema, de noche no ando ni loco por Blanco».", tipo: "negativo", keys: ["blanco"] },
            { texto: "De día transita sin problema por Serrano y Sotomayor.", tipo: "positivo", keys: ["serrano", "sotomayor"] }
        ]
    },
    {
        id: 46, dificultad: 5,
        mayorRaw: "Todas", menorRaw: "Sotomayor",
        mayorKeys: [], menorKeys: ["sotomayor"],
        generalTag: "Todas",
        veredas: "si", cruces: "si", ruido: "si", iluminacion: "si", descanso: "si",
        otro: null, emociones: "Frustración e impotencia",
        comentario: "«Solo se puede por Sotomayor y aun así hay que esquivar hoyos». La cuidadora cuenta que no salen los días de lluvia.",
        testimonios: [
            { texto: "«Solo se puede por Sotomayor y aun así hay que esquivar hoyos» (la cuidadora cuenta que no salen los días de lluvia).", tipo: "mixto", keys: ["sotomayor"], esGeneral: true }
        ]
    },
    {
        id: 47, dificultad: 4,
        mayorRaw: "Prat, Sotomayor Serrano", menorRaw: "Blanco, Errázuriz",
        mayorKeys: ["prat", "sotomayor", "serrano"], menorKeys: ["blanco", "errazuriz"],
        veredas: "si", cruces: "si", ruido: "no", iluminacion: "no", descanso: "no",
        otro: null, emociones: "Sorpresa y atención",
        comentario: null, testimonios: []
    },
    {
        id: 48, dificultad: 3,
        mayorRaw: "Cochrane, Sotomayor", menorRaw: "Errázuriz",
        mayorKeys: ["cochrane", "sotomayor"], menorKeys: ["errazuriz"],
        veredas: "no", cruces: "si", ruido: "si", iluminacion: "no", descanso: "no",
        otro: null, emociones: "Desorientación y atención activa",
        comentario: null, testimonios: []
    },
    {
        id: 49, dificultad: 2,
        mayorRaw: "Prat, Errázuriz blanco", menorRaw: "Cochrane a la izquierda y Serrano",
        mayorKeys: ["prat", "errazuriz", "blanco"], menorKeys: ["cochrane", "serrano"],
        veredas: "no", cruces: "no", ruido: "si", iluminacion: "si", descanso: "no",
        otro: null, emociones: "Miedo",
        comentario: "En general, busca comodidad.",
        testimonios: [
            { texto: "En general, busca comodidad al elegir por dónde caminar (prefiere Cochrane a la izquierda y Serrano frente a Prat, Errázuriz y Blanco).", tipo: "mixto", keys: ["prat", "errazuriz", "blanco", "cochrane", "serrano"] }
        ]
    },
    {
        id: 50, dificultad: 2,
        mayorRaw: "Blanco", menorRaw: "Prat, Plaza Sotomayor",
        mayorKeys: ["blanco"], menorKeys: ["prat"],
        espacios: [{ nombre: "Plaza Sotomayor", rol: "Menor", keys: ["sotomayor"] }],
        veredas: "si", cruces: "no", ruido: "si", iluminacion: "no", descanso: "no",
        otro: null, emociones: "Desagrado",
        comentario: "Menciona veredas con excremento de perro.",
        testimonios: [
            { texto: "Menciona veredas con excremento de perro en Blanco.", tipo: "negativo", keys: ["blanco"] }
        ]
    },
    {
        id: 51, dificultad: 4,
        mayorRaw: "Cruce de Cochrane con Sotomayor", menorRaw: "Serrano",
        mayorKeys: [], menorKeys: ["serrano"],
        crucesEsp: [{ nombre: "Cruce de Cochrane con Sotomayor", rol: "Mayor", keys: ["cochrane", "sotomayor"] }],
        veredas: "no", cruces: "si", ruido: "no", iluminacion: "si", descanso: "no",
        otro: null, emociones: "Inseguridad al cruzar",
        comentario: "No alcanza a distinguir bien el color del semáforo; cruza siguiendo a la gente que va adelante.",
        testimonios: [
            { texto: "En el cruce de Cochrane con Sotomayor no alcanza a distinguir bien el color del semáforo y cruza siguiendo a la gente que va adelante.", tipo: "negativo", keys: ["cochrane", "sotomayor"] }
        ]
    },
    {
        id: 52, dificultad: 3,
        mayorRaw: "Almte. Goñi, Clave", menorRaw: "Plaza Echaurren",
        mayorKeys: ["goni", "clave"], menorKeys: [],
        espacios: [{ nombre: "Plaza Echaurren", rol: "Menor", keys: ["echaurren"] }],
        veredas: "si", cruces: "no", ruido: "no", iluminacion: "no", descanso: "si",
        otro: "Escaleras sin baranda", emociones: "Agobio",
        comentario: null, testimonios: []
    },
    {
        id: 53, dificultad: 2,
        mayorRaw: "Cochrane", menorRaw: "Sotomayor, Serrano, Prat",
        mayorKeys: ["cochrane"], menorKeys: ["sotomayor", "serrano", "prat"],
        veredas: "no", cruces: "no", ruido: "si", iluminacion: "no", descanso: "no",
        otro: null, emociones: "Orgullo de poder salir solo",
        comentario: "Dice que claramente sería más fácil si las calles estuvieran mejor cuidadas.",
        testimonios: [
            { texto: "Siente orgullo de poder salir solo, aunque señala que claramente sería más fácil si las calles estuvieran mejor cuidadas.", tipo: "mixto", keys: ["cochrane", "sotomayor", "serrano", "prat"] }
        ]
    },
    {
        id: 54, dificultad: 5,
        mayorRaw: "Todas", menorRaw: "Ninguno",
        mayorKeys: [], menorKeys: [],
        generalTag: "Todas",
        veredas: "si", cruces: "si", ruido: "si", iluminacion: "si", descanso: "si",
        otro: "Tráfico", emociones: "Temor",
        comentario: "Sin su hijo no sale a la calle, dice que los autos pasan muy rápido.",
        testimonios: [
            { texto: "Sin su hijo no sale a la calle, dice que los autos pasan muy rápido.", tipo: "negativo", keys: [], esGeneral: true }
        ]
    },
    {
        id: 55, dificultad: 1,
        mayorRaw: "Ninguno", menorRaw: "Plaza Echaurren, Sotomayor, Cochrane",
        mayorKeys: [], menorKeys: ["sotomayor", "cochrane"],
        generalTag: "Ninguno",
        espacios: [{ nombre: "Plaza Echaurren", rol: "Menor", keys: ["echaurren"] }],
        veredas: "no", cruces: "no", ruido: "no", iluminacion: "no", descanso: "no",
        otro: null, emociones: "Pertenencia y orgullo",
        comentario: "Siempre ha vivido aquí, entonces no se le hace difícil movilizarse.",
        testimonios: [
            { texto: "Siempre ha vivido aquí, siente pertenencia y orgullo y no se le hace difícil movilizarse por Plaza Echaurren, Sotomayor y Cochrane.", tipo: "positivo", keys: ["echaurren", "sotomayor", "cochrane"] }
        ]
    },
    {
        id: 56, dificultad: 3,
        mayorRaw: "Almirante Goñi, Almirante Pérez, almirante Muñoz", menorRaw: "Sotomayor, puerto",
        mayorKeys: ["goni", "perez", "munoz"], menorKeys: ["sotomayor"],
        espacios: [{ nombre: "Puerto", rol: "Menor", keys: [] }],
        veredas: "si", cruces: "si", ruido: "no", iluminacion: "no", descanso: "si",
        otro: "Seguridad", emociones: "Miedo",
        comentario: "Evita lo más posible los pasajes pequeños, sobre todo después de las cinco de la tarde.",
        testimonios: [
            { texto: "Evita lo más posible los pasajes pequeños (Almirante Goñi, Almirante Pérez y Almirante Muñoz), sobre todo después de las cinco de la tarde.", tipo: "negativo", keys: ["goni", "perez", "munoz"] },
            { texto: "Prefiere circular por Sotomayor y el sector del Puerto.", tipo: "positivo", keys: ["sotomayor"] }
        ]
    }
];

function buildValparaisoStreetDetailsFromSurvey() {
    const detailsMap = {};

    // Resumen global de menciones generales en las 56 encuestas (sin mezclarlas con conteos de calles)
    let globalTodosCount = 0;
    let globalNingunoCount = 0;
    const generalTestimonies = [];

    VALPARAISO_SURVEY_RESPONSES.forEach((row) => {
        if (row.generalTag && row.generalTag.includes("Tod")) globalTodosCount++;
        if (row.generalTag && row.generalTag.includes("Ninguno")) globalNingunoCount++;
        (row.testimonios || []).forEach((t) => {
            if (t.esGeneral) {
                generalTestimonies.push(`[Encuesta general Barrio Puerto • Dif. ${row.dificultad}/5] ${t.texto}`);
            }
        });
    });

    VALPARAISO_RAW_RECORDS.forEach((rec) => {
        if (rec.type !== "horizontal" && rec.type !== "vertical") return;

        const bandId = rec.id;

        let mayorDirectCount = 0;
        let menorDirectCount = 0;
        const mayorDiffValues = [];
        const menorDiffValues = [];
        const associatedRows = [];
        const associatedRowIds = new Set();

        const crucesMap = new Map();
        const espaciosMap = new Map();
        const otrosAspectos = [];
        const emociones = [];
        const comentariosNegativos = [];
        const comentariosPositivos = [];
        const comentariosMixtos = [];

        VALPARAISO_SURVEY_RESPONSES.forEach((row) => {
            const mayorBandIds = expandValpoKeys(row.mayorKeys);
            const menorBandIds = expandValpoKeys(row.menorKeys);
            const commentBandIds = expandValpoKeys(row.commentKeys);

            const isMayor = mayorBandIds.includes(bandId);
            const isMenor = menorBandIds.includes(bandId);
            const isCommentRef = commentBandIds.includes(bandId);

            let isCruceRef = false;
            (row.crucesEsp || []).forEach((cr) => {
                const crBandIds = expandValpoKeys(cr.keys);
                if (crBandIds.includes(bandId)) {
                    isCruceRef = true;
                    const key = `${cr.nombre} (${cr.rol})`;
                    crucesMap.set(key, (crucesMap.get(key) || 0) + 1);
                }
            });

            let isEspacioRef = false;
            (row.espacios || []).forEach((esp) => {
                const espBandIds = expandValpoKeys(esp.keys);
                if (espBandIds.includes(bandId)) {
                    isEspacioRef = true;
                    const key = `${esp.nombre} (${esp.rol})`;
                    espaciosMap.set(key, (espaciosMap.get(key) || 0) + 1);
                }
            });

            if (isMayor) {
                mayorDirectCount++;
                if (typeof row.dificultad === "number") mayorDiffValues.push(row.dificultad);
            }
            if (isMenor) {
                menorDirectCount++;
                if (typeof row.dificultad === "number") menorDiffValues.push(row.dificultad);
            }

            const isAssociated = isMayor || isMenor || isCruceRef || isEspacioRef || isCommentRef;
            if (isAssociated && !associatedRowIds.has(row.id)) {
                associatedRowIds.add(row.id);
                associatedRows.push(row);

                const ctxLabel = isMayor
                    ? "Mayor"
                    : (isMenor ? "Menor" : (isCruceRef ? "Cruce" : "Ref."));

                if (row.otro) {
                    otrosAspectos.push({ texto: row.otro, contexto: ctxLabel });
                }
                if (row.emociones) {
                    emociones.push({ texto: row.emociones, contexto: ctxLabel });
                }
            }

            // Testimonios específicos asociados a esta banda
            (row.testimonios || []).forEach((t) => {
                const tBandIds = expandValpoKeys(t.keys);
                if (tBandIds.includes(bandId)) {
                    if (t.tipo === "negativo" && !comentariosNegativos.includes(t.texto)) {
                        comentariosNegativos.push(t.texto);
                    } else if (t.tipo === "positivo" && !comentariosPositivos.includes(t.texto)) {
                        comentariosPositivos.push(t.texto);
                    } else if (t.tipo === "mixto" && !comentariosMixtos.includes(t.texto)) {
                        comentariosMixtos.push(t.texto);
                    }
                }
            });
        });

        // Cálculos de dificultad percibida (escala 1 a 5) sin duplicar encuestados
        const allDiffValues = associatedRows
            .map((r) => r.dificultad)
            .filter((v) => typeof v === "number");

        const calcMean = (arr) => (arr.length > 0
            ? arr.reduce((a, b) => a + b, 0) / arr.length
            : null);

        const mediaGeneral = calcMean(allDiffValues);
        const mediaEnMayor = calcMean(mayorDiffValues);
        const mediaEnMenor = calcMean(menorDiffValues);

        const levelCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        allDiffValues.forEach((v) => {
            if (levelCounts[v] !== undefined) levelCounts[v]++;
        });

        const distribucionNiveles = [1, 2, 3, 4, 5].map((lvl) => {
            const count = levelCounts[lvl];
            const pct = allDiffValues.length > 0 ? (count / allDiffValues.length) * 100 : 0;
            return { nivel: lvl, count, pct };
        });

        // Cálculos de las 5 dimensiones urbanas (excluyendo respuestas sin información del denominador)
        function computeUrbanDim(fieldKey) {
            let si = 0;
            let no = 0;
            let sinInfo = 0;

            associatedRows.forEach((r) => {
                if (r[fieldKey] === "si") si++;
                else if (r[fieldKey] === "no") no++;
                else sinInfo++;
            });

            const validTotal = si + no;
            if (validTotal === 0) return null;

            return {
                si,
                no,
                validTotal,
                sinInfo,
                pctSi: (si / validTotal) * 100,
                pctNo: (no / validTotal) * 100
            };
        }

        // Incorporar referencias de cruces, plazas y resumen general del barrio sin mezclarlos con las calles
        crucesMap.forEach((count, label) => {
            otrosAspectos.unshift({
                texto: `${label}: ${count} ${count === 1 ? "mención" : "menciones"}`,
                contexto: "Cruce"
            });
        });

        espaciosMap.forEach((count, label) => {
            otrosAspectos.push({
                texto: `Espacio vinculado — ${label}: ${count}`,
                contexto: "Ref."
            });
        });

        // Añadir contexto general del barrio («Todos / Todas») debidamente identificado en testimonios mixtos/contextuales
        const contextualMixtos = [...comentariosMixtos];
        generalTestimonies.slice(0, 3).forEach((gt) => {
            if (!contextualMixtos.includes(gt)) {
                contextualMixtos.push(gt);
            }
        });

        detailsMap[bandId] = {
            id: bandId,
            name: rec.name,
            isValparaisoSurvey: true,
            difficultyStats: {
                mayorDificultad: mayorDirectCount,
                menorDificultad: menorDirectCount,
                mediaDificultad: mediaGeneral,
                mediaEnMayor,
                mediaEnMenor,
                totalEncuestasAsociadas: associatedRows.length,
                distribucionNiveles,
                globalTodosCount,
                globalNingunoCount
            },
            urbanAspects: {
                estadoCallesVeredas: computeUrbanDim("veredas"),
                crucesOrientacion: computeUrbanDim("cruces"),
                ruido: computeUrbanDim("ruido"),
                iluminacion: computeUrbanDim("iluminacion"),
                espaciosDescanso: computeUrbanDim("descanso")
            },
            comentariosNegativos,
            comentariosPositivos,
            comentariosMixtos: contextualMixtos,
            otrosAspectos,
            emociones
        };
    });

    return detailsMap;
}

const VALPARAISO_STREET_DETAILS = buildValparaisoStreetDetailsFromSurvey();

// ==========================================================
// 4. MÓDULO DE COMPOSICIÓN VISUAL DE BANDAS Y MOTOR CROMÁTICO
//    (Altura proporcional, Mezcla perceptual, Escala 1-9 y Descomposición en 9 capas)
// ==========================================================

const COLOR_TIE_PRIORITY = {
    green: 1,
    yellow: 2,
    red: 3
};

/**
 * Calcula el rango global de respuestas totales [minTotal, maxTotal] entre los modelos
 * para mantener proporciones visuales de altura coherentes entre Buenos Aires y Valparaíso.
 */
function computeGlobalBandTotalScale(recordSets = [BUENOS_AIRES_RAW_RECORDS, VALPARAISO_RAW_RECORDS]) {
    let minTotal = Infinity;
    let maxTotal = -Infinity;

    recordSets.forEach((records) => {
        (records || []).forEach((rec) => {
            if (rec.type !== "horizontal" && rec.type !== "vertical") return;
            const total = (Number(rec.green) || 0) + (Number(rec.yellow) || 0) + (Number(rec.red) || 0);
            if (total > 0) {
                if (total < minTotal) minTotal = total;
                if (total > maxTotal) maxTotal = total;
            }
        });
    });

    const safeMin = Number.isFinite(minTotal) ? minTotal : 1;
    const safeMax = Number.isFinite(maxTotal) && maxTotal > safeMin ? maxTotal : Math.max(28, safeMin + 1);

    return {
        minTotal: safeMin,
        maxTotal: safeMax
    };
}

/**
 * Calcula la altura física estable de la banda principal (en reposo y durante el hover)
 * y su elevación máxima en hover proporcionalmente al total real de respuestas de la calle.
 * Es completamente independiente del límite de 9 bandas secundarias.
 */
function computePrincipalBandHeight(totalResponses, totalScale = null) {
    const scale = totalScale || computeGlobalBandTotalScale();
    const {
        minPrincipalHeight,
        maxPrincipalHeight,
        minHoverElevation,
        maxHoverElevation
    } = SCENE_CONFIG.bandDefaults;

    const safeTotal = Math.max(0, Number(totalResponses) || 0);
    const span = Math.max(1, scale.maxTotal - scale.minTotal);
    const normalizedTotal = safeTotal > 0
        ? THREE.MathUtils.clamp((safeTotal - scale.minTotal) / span, 0, 1)
        : 0;

    // Escala proporcional suavizada para conservar diferencias claras entre pocas y muchas respuestas
    const heightCurve = Math.pow(normalizedTotal, 0.92);
    const principalHeight = THREE.MathUtils.lerp(minPrincipalHeight, maxPrincipalHeight, heightCurve);
    const hoverElevation = THREE.MathUtils.lerp(minHoverElevation, maxHoverElevation, heightCurve);

    return {
        totalResponses: safeTotal,
        normalizedTotal,
        principalHeight: Number(principalHeight.toFixed(4)),
        hoverElevation: Number(hoverElevation.toFixed(4))
    };
}

/**
 * Conversiones perceptuales sRGB <-> OKLab para mezclar colores manteniendo
 * luminosidad, saturación e identidad cromática sin producir tonos marrones ni apagados.
 */
function srgbChannelToLinear(c) {
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function linearChannelToSrgb(c) {
    const clamped = THREE.MathUtils.clamp(c, 0, 1);
    return clamped <= 0.0031308
        ? 12.92 * clamped
        : 1.055 * Math.pow(clamped, 1 / 2.4) - 0.055;
}

function srgbToOklab(r, g, b) {
    const lr = srgbChannelToLinear(r);
    const lg = srgbChannelToLinear(g);
    const lb = srgbChannelToLinear(b);

    const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
    const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
    const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);

    return {
        L: 0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
        a: 1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
        b: 0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s
    };
}

function oklabToSrgb(L, a, b) {
    const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
    const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
    const s_ = L - 0.0894841775 * a - 1.2914855480 * b;

    const l = l_ * l_ * l_;
    const m = m_ * m_ * m_;
    const s = s_ * s_ * s_;

    const lr = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
    const lg = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
    const lb = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

    return {
        r: linearChannelToSrgb(lr),
        g: linearChannelToSrgb(lg),
        b: linearChannelToSrgb(lb)
    };
}

/**
 * Obtiene el color base de referencia del sistema para una categoría ('green' | 'yellow' | 'red').
 */
function getBaseCategoryReferenceColor(categoryKey) {
    const hexMap = SCENE_CONFIG.chromatic.baseHex;
    const hex = (hexMap && hexMap[categoryKey]) || "#888888";
    return new THREE.Color(hex);
}

/**
 * Escala de intensidad de 1 a 9 cuando una banda tiene respuestas de UN SOLO color (Sección 7).
 * - Nivel 1 (1 respuesta): color claro con mayor presencia de blanco.
 * - Niveles 2..8: transición progresiva y suave hacia el tono base.
 * - Nivel 9 (9 o más respuestas): color más saturado, intenso y cercano al tono base.
 */
function computeSingleColorIntensity(categoryKey, count) {
    const maxScale = SCENE_CONFIG.chromatic.singleColorScaleMax || 9;
    const safeCount = Math.max(1, Number(count) || 1);
    const clampedLevel = THREE.MathUtils.clamp(safeCount, 1, maxScale);
    const linearT = (clampedLevel - 1) / Math.max(1, maxScale - 1);
    const smoothT = Math.pow(linearT, 0.86);

    const baseColor = getBaseCategoryReferenceColor(categoryKey);
    const baseHSL = { h: 0, s: 0, l: 0 };
    baseColor.getHSL(baseHSL);

    // Nivel 1: alta luminosidad (blanquecino con identidad de matiz clara) -> Nivel 9: tono base intenso
    const lightAtLevel1 = categoryKey === "yellow" ? 0.86 : 0.84;
    const satAtLevel1 = categoryKey === "yellow" ? 0.56 : 0.48;
    const targetSat = THREE.MathUtils.lerp(satAtLevel1, Math.max(0.80, baseHSL.s), smoothT);
    const targetLight = THREE.MathUtils.lerp(lightAtLevel1, THREE.MathUtils.clamp(baseHSL.l, 0.48, 0.55), smoothT);

    const resultColor = new THREE.Color();
    resultColor.setHSL(baseHSL.h, targetSat, targetLight);

    return {
        color: resultColor,
        intensityLevel: clampedLevel,
        normalizedIntensity: THREE.MathUtils.lerp(
            SCENE_CONFIG.chromatic.minNormalizedIntensity,
            SCENE_CONFIG.chromatic.maxNormalizedIntensity,
            smoothT
        ),
        isSingleColor: true
    };
}

/**
 * Calcula el color representativo de la banda principal a partir de la composición
 * completa de respuestas verdes, amarillas y rojas (Secciones 6 y 7).
 * - Si solo existe 1 color con respuestas > 0: aplica la escala de intensidad 1 a 9.
 * - Si existen 2 o 3 colores: realiza una mezcla cromática proporcional y perceptualmente
 *   equilibrada en OKLab con preservación de croma y luminosidad.
 */
function computeProportionalChromaticMix(counts) {
    const green = Math.max(0, Number(counts.green) || 0);
    const yellow = Math.max(0, Number(counts.yellow) || 0);
    const red = Math.max(0, Number(counts.red) || 0);
    const total = green + yellow + red;

    const activeEntries = [
        { key: "green", count: green },
        { key: "yellow", count: yellow },
        { key: "red", count: red }
    ].filter((item) => item.count > 0);

    if (activeEntries.length === 0 || total === 0) {
        const neutral = new THREE.Color(0x808080);
        return {
            primaryColor: neutral,
            componentColors: [neutral.clone()],
            activeColorCount: 0,
            intensityLevel: 0,
            normalizedIntensity: SCENE_CONFIG.chromatic.minNormalizedIntensity
        };
    }

    // Caso 1: Un único color presente -> Escala de intensidad de 1 a 9 (Sección 7)
    if (activeEntries.length === 1) {
        const only = activeEntries[0];
        const singleResult = computeSingleColorIntensity(only.key, only.count);
        return {
            primaryColor: singleResult.color,
            componentColors: [singleResult.color.clone()],
            activeColorCount: 1,
            intensityLevel: singleResult.intensityLevel,
            normalizedIntensity: singleResult.normalizedIntensity
        };
    }

    // Caso 2: Dos o tres colores presentes -> Mezcla cromática proporcional en OKLab + preservación perceptual (Sección 6)
    const pG = green / total;
    const pY = yellow / total;
    const pR = red / total;

    const cG = getBaseCategoryReferenceColor("green");
    const cY = getBaseCategoryReferenceColor("yellow");
    const cR = getBaseCategoryReferenceColor("red");

    const labG = srgbToOklab(cG.r, cG.g, cG.b);
    const labY = srgbToOklab(cY.r, cY.g, cY.b);
    const labR = srgbToOklab(cR.r, cR.g, cR.b);

    const chromaG = Math.hypot(labG.a, labG.b);
    const chromaY = Math.hypot(labY.a, labY.b);
    const chromaR = Math.hypot(labR.a, labR.b);

    const Lmix = pG * labG.L + pY * labY.L + pR * labR.L;
    let amix = pG * labG.a + pY * labY.a + pR * labR.a;
    let bmix = pG * labG.b + pY * labY.b + pR * labR.b;

    // Preservar el croma perceptual para evitar que mezclas verde+rojo se vuelvan marrones o grisáceas
    const rawChroma = Math.hypot(amix, bmix);
    const idealChroma = pG * chromaG + pY * chromaY + pR * chromaR;
    const targetChroma = THREE.MathUtils.lerp(rawChroma, idealChroma, 0.74);

    if (rawChroma > 0.0001) {
        const scale = targetChroma / rawChroma;
        amix *= scale;
        bmix *= scale;
    } else {
        // Equilibrio exacto entre verde y rojo: orientar hacia el eje cálido ámbar (+b)
        amix = 0.0;
        bmix = targetChroma;
    }

    const targetL = THREE.MathUtils.clamp(Lmix * 1.02, 0.66, 0.83);
    const srgb = oklabToSrgb(targetL, amix, bmix);
    const mixedColor = new THREE.Color(srgb.r, srgb.g, srgb.b);

    // Ajuste fino en HSL para garantizar saturación viva y contraste óptimo sobre el tablero oscuro
    const hsl = { h: 0, s: 0, l: 0 };
    mixedColor.getHSL(hsl);
    const finalSat = THREE.MathUtils.clamp(Math.max(hsl.s, 0.62), 0.60, 0.88);
    const finalLight = THREE.MathUtils.clamp(hsl.l, 0.46, 0.58);
    mixedColor.setHSL(hsl.h, finalSat, finalLight);

    const componentColors = activeEntries.map((entry) => getBaseCategoryReferenceColor(entry.key));
    const clampedTotalLevel = THREE.MathUtils.clamp(total, 1, 9);
    const normalizedIntensity = THREE.MathUtils.lerp(
        SCENE_CONFIG.chromatic.minNormalizedIntensity,
        SCENE_CONFIG.chromatic.maxNormalizedIntensity,
        (clampedTotalLevel - 1) / 8
    );

    return {
        primaryColor: mixedColor,
        componentColors,
        activeColorCount: activeEntries.length,
        intensityLevel: clampedTotalLevel,
        normalizedIntensity
    };
}

/**
 * Ordena dinámicamente los grupos de colores con respuestas (> 0) de mayor a menor cantidad.
 * En caso de empate utiliza un criterio determinista consistente (verde -> amarillo -> rojo).
 */
function orderSecondaryColorGroups(counts) {
    const entries = [
        { key: "green", label: "Verde", count: Math.max(0, Number(counts.green) || 0) },
        { key: "yellow", label: "Amarillo", count: Math.max(0, Number(counts.yellow) || 0) },
        { key: "red", label: "Rojo", count: Math.max(0, Number(counts.red) || 0) }
    ].filter((item) => item.count > 0);

    entries.sort((a, b) => {
        if (b.count !== a.count) {
            return b.count - a.count;
        }
        return (COLOR_TIE_PRIORITY[a.key] || 99) - (COLOR_TIE_PRIORITY[b.key] || 99);
    });

    return entries;
}

/**
 * Calcula la distribución de hasta 9 bandas secundarias (Secciones 2, 3, 4 y 8).
 * - Si total <= 9: representación exacta 1 a 1 (cada respuesta genera 1 banda secundaria).
 * - Si total > 9: distribuye exactamente 9 bandas de forma proporcional (Método de Restos Mayores
 *   con garantía de mínimo 1 banda para cada color presente con respuestas > 0 y preservación de orden).
 * - Nunca asigna bandas a colores con 0 respuestas ni altera el total real de la calle.
 */
function distributeSecondaryBands(counts, maxBands = SCENE_CONFIG.bandDefaults.maxSecondaryBands) {
    const orderedGroups = orderSecondaryColorGroups(counts);
    const realTotal = orderedGroups.reduce((acc, g) => acc + g.count, 0);

    if (realTotal === 0 || orderedGroups.length === 0) {
        return {
            realTotal: 0,
            totalSecondaryBands: 0,
            isApproximated: false,
            groups: [],
            layers: []
        };
    }

    let allocatedGroups = [];
    const isApproximated = realTotal > maxBands;

    if (!isApproximated) {
        // Representación 1:1 exacta cuando el total es <= 9
        allocatedGroups = orderedGroups.map((g, idx) => ({
            ...g,
            rank: idx,
            exactQuota: g.count,
            allocatedBands: g.count
        }));
    } else {
        // Aproximación matemática proporcional a exactamente `maxBands` (9) capas
        const quotas = orderedGroups.map((g, idx) => {
            const exactQuota = (g.count / realTotal) * maxBands;
            // Garantizar al menos 1 banda para cada color presente (> 0 respuestas)
            const baseBands = Math.max(1, Math.floor(exactQuota));
            return {
                ...g,
                rank: idx,
                exactQuota,
                allocatedBands: baseBands,
                remainder: exactQuota - baseBands
            };
        });

        let currentSum = quotas.reduce((acc, q) => acc + q.allocatedBands, 0);

        // Si quedan bandas por repartir hasta completar 9, asignar por restos mayores
        while (currentSum < maxBands) {
            const remaining = maxBands - currentSum;

            // Si hay un empate exacto en conteo entre dos grupos y solo queda 1 banda,
            // priorizar un grupo no empatado para no romper la igualdad visual del empate
            let candidateOrder = [...quotas].sort((a, b) => {
                if (Math.abs(b.remainder - a.remainder) > 1e-6) {
                    return b.remainder - a.remainder;
                }
                return a.rank - b.rank;
            });

            if (remaining === 1 && quotas.length === 3) {
                const topCandidate = candidateOrder[0];
                const tiedPartner = quotas.find(
                    (q) => q.key !== topCandidate.key &&
                        q.count === topCandidate.count &&
                        q.allocatedBands === topCandidate.allocatedBands
                );
                if (tiedPartner) {
                    const untied = quotas.find((q) => q.count !== topCandidate.count);
                    if (untied) {
                        untied.allocatedBands += 1;
                        untied.remainder -= 1;
                        currentSum += 1;
                        continue;
                    }
                }
            }

            const best = candidateOrder[0];
            best.allocatedBands += 1;
            best.remainder -= 1;
            currentSum += 1;
        }

        // Si por garantía de mínimo 1 se excedió maxBands, reducir del grupo con mayor holgura (> 1)
        while (currentSum > maxBands) {
            const reducible = [...quotas]
                .filter((q) => q.allocatedBands > 1)
                .sort((a, b) => a.remainder - b.remainder || b.allocatedBands - a.allocatedBands);

            if (reducible.length === 0) break;
            reducible[0].allocatedBands -= 1;
            currentSum -= 1;
        }

        // Garantizar monotonía respecto al orden de mayor a menor cantidad real
        for (let i = 0; i < quotas.length - 1; i++) {
            if (quotas[i].count > quotas[i + 1].count && quotas[i].allocatedBands < quotas[i + 1].allocatedBands) {
                const temp = quotas[i].allocatedBands;
                quotas[i].allocatedBands = quotas[i + 1].allocatedBands;
                quotas[i + 1].allocatedBands = temp;
            }
        }

        allocatedGroups = quotas;
    }

    // Construir la lista plana de capas secundarias de arriba (debajo de la banda principal) hacia abajo (superficie)
    const layers = [];
    const totalSecondaryBands = allocatedGroups.reduce((acc, g) => acc + g.allocatedBands, 0);

    allocatedGroups.forEach((group) => {
        const baseColor = getBaseCategoryReferenceColor(group.key);
        for (let idxInGroup = 0; idxInGroup < group.allocatedBands; idxInGroup++) {
            layers.push({
                layerIndex: layers.length,
                totalLayers: totalSecondaryBands,
                categoryKey: group.key,
                categoryLabel: group.label,
                groupRank: group.rank,
                indexInGroup: idxInGroup,
                groupAllocatedCount: group.allocatedBands,
                groupRawCount: group.count,
                color: baseColor.clone()
            });
        }
    });

    return {
        realTotal,
        totalSecondaryBands,
        isApproximated,
        groups: allocatedGroups,
        layers
    };
}

class ChromaticDataEngine {
    constructor(rawRecords, streetDetailsMap, expectedValidation, globalTotalScale = null) {
        this.recordsById = new Map();
        this.streetDetailsById = streetDetailsMap || {};
        this.expectedValidation = expectedValidation || null;
        this.globalTotalScale = globalTotalScale || computeGlobalBandTotalScale();
        this.minDominantCount = 1;
        this.maxDominantCount = 18;
        this.validationSummary = null;

        this.loadRecords(rawRecords);
    }

    loadRecords(rawRecords) {
        this.recordsById.clear();

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

        rawRecords.forEach((raw) => {
            const processed = this.processRecord(raw);
            this.recordsById.set(processed.id, processed);
        });

        this.validationSummary = this.validateGlobalTotals();
    }

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

        // 1. Mezcla cromática proporcional (2-3 colores) o escala de intensidad 1-9 (1 solo color)
        const chromaticResult = this.computeVisualColor(
            { green, yellow, red },
            dominantKeys
        );

        // 2. Altura de la banda principal basada exclusivamente en el total real de respuestas
        const heightMetrics = computePrincipalBandHeight(total, this.globalTotalScale);

        // 3. Descomposición en hasta 9 bandas secundarias ordenadas de mayor a menor cantidad
        const secondaryDistribution = distributeSecondaryBands(
            { green, yellow, red },
            SCENE_CONFIG.bandDefaults.maxSecondaryBands
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
            normalizedIntensity: chromaticResult.normalizedIntensity,
            intensityLevel: chromaticResult.intensityLevel,
            activeColorCount: chromaticResult.activeColorCount,
            visualColor: chromaticResult.primaryColor,
            visualColorHex: `#${chromaticResult.primaryColor.getHexString()}`,
            componentColors: chromaticResult.componentColors,
            isMixed: chromaticResult.activeColorCount > 1,
            principalHeight: heightMetrics.principalHeight,
            hoverElevation: heightMetrics.hoverElevation,
            normalizedTotalHeight: heightMetrics.normalizedTotal,
            secondaryDistribution,
            details: this.streetDetailsById[raw.id] || null
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

    computeVisualColor(counts) {
        return computeProportionalChromaticMix(counts);
    }

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

        mixed.getHSL(hslTemp);
        const targetSat = Math.max(hslTemp.s, (satAcc / totalW) * 0.92);
        const targetLight = THREE.MathUtils.clamp((lightAcc / totalW) * 1.04, 0.36, 0.62);
        mixed.setHSL(hslTemp.h, targetSat, targetLight);

        return mixed;
    }

    computeIntersectionColor(recordH, recordV) {
        const sameSingleCategory =
            !recordH.isMixed &&
            !recordV.isMixed &&
            recordH.dominantKeys[0] === recordV.dominantKeys[0];

        if (sameSingleCategory) {
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

        const wH = Math.max(1, recordH.dominantCount);
        const wV = Math.max(1, recordV.dominantCount);
        return this.mixColorsPerceptually(
            [recordH.visualColor, recordV.visualColor],
            [wH, wV]
        );
    }

    computeInactiveLabelColors(record) {
        const baseHSL = { h: 0, s: 0, l: 0 };
        record.visualColor.getHSL(baseHSL);

        const darkFill = new THREE.Color();
        const darkLight = THREE.MathUtils.clamp(baseHSL.l * 0.28, 0.13, 0.20);
        const darkSat = THREE.MathUtils.clamp(baseHSL.s * 1.05, 0.48, 0.90);
        darkFill.setHSL(baseHSL.h, darkSat, darkLight);

        const rimColor = new THREE.Color();
        rimColor.setHSL(
            baseHSL.h,
            THREE.MathUtils.clamp(baseHSL.s * 0.95, 0.45, 0.88),
            THREE.MathUtils.clamp(baseHSL.l * 1.18, 0.48, 0.68)
        );

        return { darkFill, rimColor };
    }

    computeActiveDynamicContrast(record, camera, labelWorldPos, bandElevationRatio) {
        const baseHSL = { h: 0, s: 0, l: 0 };
        record.visualColor.getHSL(baseHSL);

        let viewPitchFactor = 0.35;
        if (camera) {
            const toCam = new THREE.Vector3().subVectors(camera.position, labelWorldPos).normalize();
            viewPitchFactor = THREE.MathUtils.clamp(Math.pow(Math.max(0, toCam.y), 1.8), 0, 1);
        }

        const sceneBgColor = new THREE.Color(SCENE_CONFIG.surface.baseColor);
        const effectiveBg = sceneBgColor.clone().lerp(
            record.visualColor,
            viewPitchFactor * (1.0 - bandElevationRatio * 0.45)
        );

        const bgLum = 0.2126 * effectiveBg.r + 0.7152 * effectiveBg.g + 0.0722 * effectiveBg.b;

        const activeTextColor = new THREE.Color();
        let contrastNeedFactor = 0.5;

        if (bgLum < 0.34) {
            const targetLight = THREE.MathUtils.clamp(0.86 + (0.34 - bgLum) * 0.22, 0.82, 0.94);
            const targetSat = THREE.MathUtils.clamp(baseHSL.s * 0.85, 0.52, 0.88);
            activeTextColor.setHSL(baseHSL.h, targetSat, targetLight);
            contrastNeedFactor = THREE.MathUtils.clamp(0.55 + (0.34 - bgLum) * 0.9, 0.45, 0.95);
        } else {
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

        const isValid = this.expectedValidation
            ? (
                sumG === this.expectedValidation.green &&
                sumY === this.expectedValidation.yellow &&
                sumR === this.expectedValidation.red &&
                total === this.expectedValidation.total
            )
            : true;

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

    getStreetDetails(id) {
        return this.streetDetailsById[id] || null;
    }
}

// ==========================================================
// 5. GENERADORES DE TEXTURAS CON TIPOGRAFÍA POPPINS Y HALO 3D
// ==========================================================

function createBandLabelTextures(text) {
    const canvasW = 512;
    const canvasH = 128;
    const aspect = canvasW / canvasH;
    const fontSpec = '600 48px "Poppins", "Segoe UI", sans-serif';

    const glyphCanvas = document.createElement("canvas");
    glyphCanvas.width = canvasW;
    glyphCanvas.height = canvasH;
    const ctx = glyphCanvas.getContext("2d");

    ctx.clearRect(0, 0, canvasW, canvasH);
    ctx.font = fontSpec;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(text, canvasW * 0.5, canvasH * 0.5);

    const glyphTexture = new THREE.CanvasTexture(glyphCanvas);
    glyphTexture.minFilter = THREE.LinearFilter;
    glyphTexture.magFilter = THREE.LinearFilter;
    glyphTexture.needsUpdate = true;

    const backplateCanvas = document.createElement("canvas");
    backplateCanvas.width = canvasW;
    backplateCanvas.height = canvasH;
    const bCtx = backplateCanvas.getContext("2d");

    bCtx.clearRect(0, 0, canvasW, canvasH);
    bCtx.font = fontSpec;
    bCtx.textAlign = "center";
    bCtx.textBaseline = "middle";
    bCtx.lineJoin = "round";
    bCtx.lineWidth = 10;
    bCtx.strokeStyle = "rgba(255, 255, 255, 0.94)";
    bCtx.strokeText(text, canvasW * 0.5, canvasH * 0.5);

    const outlineTexture = new THREE.CanvasTexture(backplateCanvas);
    outlineTexture.minFilter = THREE.LinearFilter;
    outlineTexture.magFilter = THREE.LinearFilter;
    outlineTexture.needsUpdate = true;

    const bloomCanvas = document.createElement("canvas");
    bloomCanvas.width = canvasW;
    bloomCanvas.height = canvasH;
    const gCtx = bloomCanvas.getContext("2d");

    gCtx.clearRect(0, 0, canvasW, canvasH);
    const radial = gCtx.createRadialGradient(
        canvasW * 0.5, canvasH * 0.5, 4,
        canvasW * 0.5, canvasH * 0.5, canvasW * 0.34
    );
    radial.addColorStop(0, "rgba(255, 255, 255, 0.44)");
    radial.addColorStop(0.55, "rgba(255, 255, 255, 0.16)");
    radial.addColorStop(1, "rgba(255, 255, 255, 0.0)");

    gCtx.fillStyle = radial;
    gCtx.fillRect(0, 0, canvasW, canvasH);

    gCtx.font = fontSpec;
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

function createStaticLandmarkTexture(lines, options = {}) {
    const {
        color = "#94a3b8",
        fontWeight = "600",
        italic = false
    } = options;

    const canvasW = 512;
    const canvasH = 160;
    const aspect = canvasW / canvasH;

    const canvas = document.createElement("canvas");
    canvas.width = canvasW;
    canvas.height = canvasH;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvasW, canvasH);
    const stylePrefix = italic ? "italic " : "";
    ctx.font = `${stylePrefix}${fontWeight} 38px "Poppins", "Segoe UI", sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = color;

    const lineArray = Array.isArray(lines) ? lines : [lines];
    const lineHeight = 44;
    const startY = canvasH * 0.5 - ((lineArray.length - 1) * lineHeight) * 0.5;

    lineArray.forEach((line, idx) => {
        ctx.fillText(line, canvasW * 0.5, startY + idx * lineHeight);
    });

    const tex = new THREE.CanvasTexture(canvas);
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.needsUpdate = true;

    return { texture: tex, aspect };
}

function createBandAuraTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");

    const grad = ctx.createRadialGradient(64, 64, 6, 64, 64, 62);
    grad.addColorStop(0.0, "rgba(255, 255, 255, 0.85)");
    grad.addColorStop(0.45, "rgba(255, 255, 255, 0.38)");
    grad.addColorStop(1.0, "rgba(255, 255, 255, 0.0)");

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);

    const tex = new THREE.CanvasTexture(canvas);
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.needsUpdate = true;
    return tex;
}

const SHARED_BAND_AURA_TEXTURE = createBandAuraTexture();

// ==========================================================
// 6. ETIQUETA 3D DE BANDA (Crecimiento en Hover + Silueta Gris)
// ==========================================================

class BandLabel3D {
    constructor(config, band, parentGroup, dataEngine) {
        this.config = config;
        this.id = config.id;
        this.bandId = config.bandId;
        this.band = band;
        this.parentGroup = parentGroup;
        this.dataEngine = dataEngine;

        this.orientationProgress = 0;
        this.currentScale = 1.0;

        this.qInactive = new THREE.Quaternion();
        this.qActive = new THREE.Quaternion();
        this.lookMatrix = new THREE.Matrix4();
        this.upVector = new THREE.Vector3(0, 1, 0);

        this.inactiveDarkColor = new THREE.Color(0x102818);
        this.inactiveRimColor = new THREE.Color(0x52c478);
        this.disabledGrayColor = new THREE.Color(SCENE_CONFIG.bandLabelDefaults.disabledTextColor);
        this.disabledOutlineColor = new THREE.Color(0x16181d);

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

        const bloomGeo = new THREE.PlaneGeometry(planeW * 1.12, planeH * 1.32);
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

        this.parentGroup.add(this.group);
    }

    refreshChromaticColors() {
        const record = this.band.getDataRecord();
        if (!record) return;

        const { darkFill, rimColor } = this.dataEngine.computeInactiveLabelColors(record);
        this.inactiveDarkColor.copy(darkFill);
        this.inactiveRimColor.copy(rimColor);
    }

    rebuildFontTextures() {
        this.setText(this.config.text);
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
        const isActiveOrSelected = (band.isHovered || band.isSelected) && band.isFilterEnabled;

        if (isActiveOrSelected) {
            const inRate = 1 / Math.max(0.05, this.config.orientationInDuration);
            this.orientationProgress = Math.min(1.0, this.orientationProgress + dt * inRate);
        } else {
            const outRate = 1 / Math.max(0.08, this.config.orientationOutDuration);
            this.orientationProgress = Math.max(0.0, this.orientationProgress - dt * outRate);
        }

        const p = this.orientationProgress;
        const orientationBlend = isActiveOrSelected
            ? (1 - Math.pow(1 - p, 2.6))
            : (p * p * (3 - 2 * p));

        const targetScale = THREE.MathUtils.lerp(1.0, this.config.hoverScale, orientationBlend);
        this.currentScale = THREE.MathUtils.lerp(
            this.currentScale,
            targetScale,
            dt > 0 ? (1 - Math.exp(-14 * dt)) : 1
        );
        this.group.scale.setScalar(this.currentScale);

        const sampleCoord = isHorizontal ? this.config.position.x : this.config.position.z;
        const { elevationAtPoint, lateralAtPoint } = band.getDisplacementAtCoordinate(sampleCoord);

        // Asegurar que la etiqueta en reposo quede por encima de la altura propia de la banda
        // y de cualquier banda perpendicular más alta que cruce en la posición del texto
        let localSurfaceHeight = band.config.thickness;
        if (band.perpendicularBands && band.perpendicularBands.length > 0) {
            for (let i = 0; i < band.perpendicularBands.length; i++) {
                const perp = band.perpendicularBands[i];
                if (!band.doesPerpendicularBandIntersect(perp)) continue;
                const perpCoord = isHorizontal ? perp.config.position.x : perp.config.position.z;
                if (Math.abs(sampleCoord - perpCoord) <= (perp.config.width * 0.85 + this.config.textSize * 0.9)) {
                    localSurfaceHeight = Math.max(localSurfaceHeight, perp.config.thickness);
                }
            }
        }

        const baseTopY = localSurfaceHeight + this.config.separation;
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

        if (record) {
            const visBlend = band.filterVisibility;

            const elevRatio = THREE.MathUtils.clamp(
                band.currentElevation / Math.max(0.01, band.config.maxElevation),
                0,
                1
            );

            const { activeTextColor, glowColor, contrastNeedFactor } =
                this.dataEngine.computeActiveDynamicContrast(
                    record,
                    camera,
                    this.group.position,
                    elevRatio
                );

            this.currentTextColor.copy(this.inactiveDarkColor).lerp(activeTextColor, orientationBlend);
            this.currentTextColor.lerp(this.disabledGrayColor, 1.0 - visBlend);
            this.textMat.color.copy(this.currentTextColor);

            const activeOutlineTarget = activeTextColor.r > 0.45
                ? this.darkOutlineTarget
                : this.lightOutlineTarget;
            this.currentOutlineColor.copy(this.inactiveRimColor).lerp(activeOutlineTarget, orientationBlend);
            this.currentOutlineColor.lerp(this.disabledOutlineColor, 1.0 - visBlend);
            this.outlineMat.color.copy(this.currentOutlineColor);
            this.outlineMat.opacity = THREE.MathUtils.lerp(0.45, 0.88, visBlend);

            this.bloomMat.color.copy(glowColor);
            this.bloomMat.opacity =
                this.config.maxBloomIntensity * contrastNeedFactor * orientationBlend * visBlend;
        }
    }
}

// ==========================================================
// 7. COMPOSICIÓN DE BANDAS SECUNDARIAS APILADAS (SecondaryBandStack3D)
//    Y CLASE ELASTIC BAND (Altura proporcional, Mezcla y Descomposición en Hover)
// ==========================================================

class SecondaryBandStack3D {
    constructor(band, parentGroup) {
        this.band = band;
        this.parentGroup = parentGroup;

        const record = band.getDataRecord();
        this.distribution = (record && record.secondaryDistribution)
            ? record.secondaryDistribution
            : distributeSecondaryBands(record || { green: 0, yellow: 0, red: 0 });

        this.layers = this.distribution.layers || [];
        this.layerItems = [];

        this.group = new THREE.Group();
        this.group.name = `${band.id}-secondary-stack`;
        this.group.visible = false;
        this.parentGroup.add(this.group);

        this.silhouetteColor = new THREE.Color(SCENE_CONFIG.bandDefaults.silhouetteColor);
        this.whiteReliefColor = new THREE.Color(0xffffff);

        this.buildLayerMeshes();
    }

    buildLayerMeshes() {
        if (this.layers.length === 0) return;

        const { orientation, width, length, position } = this.band.config;
        const isHorizontal = orientation === "horizontal";
        const segments = SCENE_CONFIG.bandDefaults.lengthSegments;
        const secWidth = width * (SCENE_CONFIG.bandDefaults.secondaryWidthRatio || 0.90);

        const sizeX = isHorizontal ? length : secWidth;
        const sizeZ = isHorizontal ? secWidth : length;
        const segX = isHorizontal ? segments : 1;
        const segZ = isHorizontal ? 1 : segments;

        for (let k = 0; k < this.layers.length; k++) {
            const layerDesc = this.layers[k];

            // Geometría unitaria en Y [-0.5, +0.5] para posicionar con precisión caras superior e inferior
            const geometry = new THREE.BoxGeometry(sizeX, 1.0, sizeZ, segX, 1, segZ);
            const posAttr = geometry.attributes.position;
            const restPositions = new Float32Array(posAttr.array.length);
            restPositions.set(posAttr.array);

            const colorArray = new Float32Array(posAttr.count * 3);
            const baseColor = layerDesc.color.clone();
            const topColor = baseColor.clone().offsetHSL(0, 0.02, 0.06);
            const bottomColor = baseColor.clone().offsetHSL(0, 0.0, -0.04);

            for (let i = 0; i < posAttr.count; i++) {
                const idx3 = i * 3;
                const ry = restPositions[idx3 + 1];
                const vCol = ry >= 0 ? topColor : bottomColor;
                colorArray[idx3] = vCol.r;
                colorArray[idx3 + 1] = vCol.g;
                colorArray[idx3 + 2] = vCol.b;
            }

            geometry.setAttribute("color", new THREE.BufferAttribute(colorArray, 3));

            const material = new THREE.MeshStandardMaterial({
                vertexColors: true,
                roughness: 0.30,
                metalness: 0.08,
                emissive: baseColor.clone(),
                emissiveIntensity: 0.16,
                transparent: true,
                opacity: 0.0
            });

            const mesh = new THREE.Mesh(geometry, material);
            mesh.name = `${this.band.id}-sec-layer-${k + 1}-${layerDesc.categoryKey}`;
            mesh.position.set(position.x, position.y, position.z);
            mesh.castShadow = false;
            mesh.receiveShadow = true;

            // Desactivar raycasting en bandas secundarias para que jamás interfieran con hover/click/selección
            mesh.raycast = () => {};

            this.group.add(mesh);
            this.layerItems.push({
                index: k,
                layerDesc,
                geometry,
                restPositions,
                baseColor,
                topColor,
                bottomColor,
                material,
                mesh
            });
        }
    }

    update() {
        const K = this.layerItems.length;
        if (K === 0) return;

        const maxElev = Math.max(0.01, this.band.config.maxElevation);
        const elevRatio = THREE.MathUtils.clamp(this.band.currentElevation / maxElev, 0, 1);
        const visBlend = this.band.filterVisibility;

        if (this.band.currentElevation <= 0.012 || visBlend <= 0.01 || this.band.state === "IDLE") {
            if (this.group.visible) {
                this.group.visible = false;
            }
            return;
        }

        this.group.visible = true;

        const { orientation, length, layerOffset = 0 } = this.band.config;
        const isHorizontal = orientation === "horizontal";
        const halfLen = length * 0.5;
        const floorY = (SCENE_CONFIG.bandDefaults.secondaryFloorClearance || 0.05) + layerOffset;

        const maxThick = SCENE_CONFIG.bandDefaults.secondaryThicknessMax || 0.16;
        const minThick = SCENE_CONFIG.bandDefaults.secondaryThicknessMin || 0.12;
        const idealThickness = THREE.MathUtils.lerp(maxThick, minThick, Math.max(0, K - 1) / 8);

        const pulseWave = Math.sin(this.band.continuousGlowPhase) * 0.5 + 0.5;
        const emissiveBoost =
            (0.15 + 0.12 * this.band.hoverVisualBlend + 0.14 * this.band.continuousGlowBlend * pulseWave) *
            visBlend;

        for (let k = 0; k < K; k++) {
            const item = this.layerItems[k];
            // Fracción vertical uniforme de arriba (k=0, justo debajo de la banda principal) hacia abajo (k=K-1)
            const slotFraction = (K - k) / (K + 1);

            // Despliegue y retracción progresiva en cascada suave
            const staggerDelay = (k / Math.max(1, K)) * 0.16;
            const rawLayerT = THREE.MathUtils.clamp(
                (elevRatio - staggerDelay * 0.38) / Math.max(0.01, 1 - staggerDelay * 0.38),
                0,
                1
            );
            const layerDeploy = rawLayerT * rawLayerT * (3 - 2 * rawLayerT);

            const opacityEnvelope = THREE.MathUtils.smoothstep(elevRatio, 0.02, 0.28);
            item.material.opacity = THREE.MathUtils.clamp(opacityEnvelope * layerDeploy * visBlend * 0.96, 0, 0.96);
            item.material.emissiveIntensity = emissiveBoost;

            const posAttr = item.geometry.attributes.position;
            const arr = posAttr.array;
            const rest = item.restPositions;

            for (let i = 0; i < arr.length; i += 3) {
                const rx = rest[i];
                const ry = rest[i + 1];
                const rz = rest[i + 2];

                const uCoord = isHorizontal ? rx : rz;
                const s = THREE.MathUtils.clamp((uCoord + halfLen) / length, 0, 1);
                const archProfile = this.band.computeArchProfileAtNormalizedS(s);

                // Límite inferior de la banda principal elevada en la coordenada longitudinal s
                const principalUndersideY = layerOffset + this.band.currentElevation * archProfile;
                const availSpan = Math.max(0, principalUndersideY - floorY);
                const slotStep = availSpan / (K + 1);

                // Posición vertical objetivo dentro del espacio entre la superficie y la banda principal
                const deployedCenterY = floorY + slotFraction * availSpan;
                const collapsedOriginY = Math.max(floorY, principalUndersideY - 0.015 * (k + 1));
                const centerY = THREE.MathUtils.lerp(collapsedOriginY, deployedCenterY, layerDeploy);

                // Grosor local acotado a <= 54% del paso vertical para garantizar separación uniforme sin solapamiento
                const localThickness = Math.min(idealThickness, slotStep * 0.54) * layerDeploy;
                const halfLocalThick = localThickness * 0.5;
                const vy = Math.max(
                    floorY * 0.75,
                    centerY + (ry >= 0 ? halfLocalThick : -halfLocalThick)
                );

                // Alineación horizontal/vertical solidaria con la deformación lateral de la banda principal
                const dLat = this.band.currentLateral * archProfile;

                arr[i] = isHorizontal ? rx : rx + dLat;
                arr[i + 1] = vy;
                arr[i + 2] = isHorizontal ? rz + dLat : rz;
            }

            posAttr.needsUpdate = true;
            item.geometry.computeVertexNormals();
        }
    }

    reset() {
        this.group.visible = false;
        for (let k = 0; k < this.layerItems.length; k++) {
            this.layerItems[k].material.opacity = 0.0;
        }
    }
}

class ElasticBand {
    constructor(config, parentGroup, dataEngine) {
        this.config = config;
        this.id = config.id;
        this.name = config.name;
        this.parentGroup = parentGroup;
        this.dataEngine = dataEngine;
        this.label = null;
        this.perpendicularBands = [];

        // Sincronizar automáticamente altura física en reposo y elevación de hover con el total real de respuestas
        const record = this.getDataRecord();
        if (record) {
            if (typeof record.principalHeight === "number") {
                this.config.thickness = record.principalHeight;
            }
            if (typeof record.hoverElevation === "number") {
                this.config.maxElevation = record.hoverElevation;
            }
        }

        this.state = "IDLE";
        this.isHovered = false;
        this.isSelected = false;
        this.returnElapsed = 0;

        this.isFilterEnabled = true;
        this.filterVisibility = 1.0;
        this.fadeInGlowPulse = 0.0;

        this.hoverVisualBlend = 0.0;

        this.clickFlashActive = false;
        this.clickFlashProgress = 0.0;
        this.continuousGlowPhase = 0.0;
        this.continuousGlowBlend = 0.0;

        // Progreso [0..1] del destello de vidrio global al finalizar transición entre modelos (Sección 4)
        this.globalSurfaceSweepActive = false;
        this.globalSurfaceSweepProgress = 0.0;

        this.currentElevation = 0;
        this.currentLateral = 0;
        this.targetLateral = 0;
        this.returnStartElevation = 0;
        this.returnStartLateral = 0;

        this.contactNormU = 0.5;
        this.targetNormU = 0.5;
        this.initialContactTransverse = null;

        this.silhouetteColor = new THREE.Color(SCENE_CONFIG.bandDefaults.silhouetteColor);
        this.whiteReliefColor = new THREE.Color(0xffffff);

        this.buildGeometry();
        this.secondaryStack = new SecondaryBandStack3D(this, this.parentGroup);
    }

    getDataRecord() {
        return this.dataEngine.getRecord(this.id);
    }

    setPerpendicularBands(perpBands) {
        this.perpendicularBands = perpBands;
        this.applyVertexChromaticProfile();
        if (this.label) {
            this.label.updateTransform(null, 0);
        }
    }

    setFilterEnabled(enabled) {
        if (this.isFilterEnabled === enabled) return;
        this.isFilterEnabled = enabled;

        if (enabled) {
            this.fadeInGlowPulse = 1.0;
        } else {
            if (this.isHovered) {
                this.onCursorLeave();
            }
            if (this.isSelected) {
                this.setSelected(false);
            }
        }
    }

    setSelected(selected) {
        if (selected) {
            this.isSelected = true;
            this.state = "HOVERED";
            this.clickFlashActive = true;
            this.clickFlashProgress = 0.0;
        } else {
            const wasSelected = this.isSelected;
            this.isSelected = false;
            this.clickFlashActive = false;
            if (wasSelected && !this.isHovered) {
                this.startReturnAnimation();
            }
        }
    }

    triggerGlobalSurfaceSweep() {
        this.globalSurfaceSweepActive = true;
        this.globalSurfaceSweepProgress = 0.0;
    }

    startReturnAnimation() {
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

        const colorArray = new Float32Array(posAttr.count * 3);
        this.geometry.setAttribute("color", new THREE.BufferAttribute(colorArray, 3));

        this.material = new THREE.MeshStandardMaterial({
            vertexColors: true,
            roughness: 0.34,
            metalness: 0.10,
            emissive: new THREE.Color(0x000000),
            emissiveIntensity: 0.0
        });

        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.name = this.id;
        this.mesh.position.set(position.x, position.y, position.z);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        this.mesh.userData.band = this;

        const auraW = isHorizontal ? length * 1.02 : width * 2.45;
        const auraD = isHorizontal ? width * 2.45 : length * 1.02;
        const auraSegX = isHorizontal ? segments : 1;
        const auraSegZ = isHorizontal ? 1 : segments;

        this.auraGeo = new THREE.PlaneGeometry(auraW, auraD, auraSegX, auraSegZ);
        this.auraGeo.rotateX(-Math.PI * 0.5);
        this.auraGeo.translate(0, 0.03 + layerOffset, 0);

        const auraPos = this.auraGeo.attributes.position;
        this.auraRestPositions = new Float32Array(auraPos.array.length);
        this.auraRestPositions.set(auraPos.array);

        this.auraMat = new THREE.MeshBasicMaterial({
            map: SHARED_BAND_AURA_TEXTURE,
            color: 0xffffff,
            transparent: true,
            opacity: 0.0,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            side: THREE.DoubleSide
        });

        this.auraMesh = new THREE.Mesh(this.auraGeo, this.auraMat);
        this.auraMesh.position.set(position.x, position.y, position.z);

        const hitWidth = width * SCENE_CONFIG.bandDefaults.hitboxWidthRatio;
        const hitSizeX = isHorizontal ? length : hitWidth;
        const hitSizeZ = isHorizontal ? hitWidth : length;

        const restColliderGeo = new THREE.BoxGeometry(hitSizeX, sizeY * 1.15, hitSizeZ);
        restColliderGeo.translate(0, sizeY * 0.5 + layerOffset, 0);
        this.restColliderMesh = new THREE.Mesh(
            restColliderGeo,
            new THREE.MeshBasicMaterial({ visible: false })
        );
        this.restColliderMesh.position.set(position.x, position.y, position.z);
        this.restColliderMesh.userData.band = this;

        this.parentGroup.add(this.auraMesh);
        this.parentGroup.add(this.mesh);
        this.parentGroup.add(this.restColliderMesh);

        this.applyVertexChromaticProfile();
    }

    // Comprueba si una banda perpendicular realmente cruza este tramo geométrico
    doesPerpendicularBandIntersect(perpBand) {
        const isHorizontal = this.config.orientation === "horizontal";
        const myMinU = (isHorizontal ? this.config.position.x : this.config.position.z) - this.config.length * 0.5;
        const myMaxU = (isHorizontal ? this.config.position.x : this.config.position.z) + this.config.length * 0.5;
        const perpU = isHorizontal ? perpBand.config.position.x : perpBand.config.position.z;

        if (perpU < myMinU - perpBand.config.width * 0.6 || perpU > myMaxU + perpBand.config.width * 0.6) {
            return false;
        }

        const perpMinV = (isHorizontal ? perpBand.config.position.z : perpBand.config.position.x) - perpBand.config.length * 0.5;
        const perpMaxV = (isHorizontal ? perpBand.config.position.z : perpBand.config.position.x) + perpBand.config.length * 0.5;
        const myV = isHorizontal ? this.config.position.z : this.config.position.x;

        return (myV >= perpMinV - this.config.width * 0.6 && myV <= perpMaxV + this.config.width * 0.6);
    }

    applyVertexChromaticProfile() {
        const record = this.getDataRecord();
        if (!record) return;

        const posAttr = this.geometry.attributes.position;
        const colorAttr = this.geometry.attributes.color;
        const rest = this.restPositions;

        const { orientation, width, thickness, length, position } = this.config;
        const isHorizontal = orientation === "horizontal";
        const halfLen = length * 0.5;
        const myVis = this.filterVisibility;

        // Precalcular cruces reales con bandas perpendiculares
        const crossings = [];
        for (let k = 0; k < this.perpendicularBands.length; k++) {
            const perpBand = this.perpendicularBands[k];
            if (!this.doesPerpendicularBandIntersect(perpBand)) continue;

            const perpRecord = perpBand.getDataRecord();
            const worldCoord = isHorizontal ? perpBand.config.position.x : perpBand.config.position.z;
            const localCoord = worldCoord - (isHorizontal ? position.x : position.z);
            const halfCrossW = Math.max(width, perpBand.config.width) * 0.56;

            const interColor = isHorizontal
                ? this.dataEngine.computeIntersectionColor(record, perpRecord)
                : this.dataEngine.computeIntersectionColor(perpRecord, record);

            crossings.push({
                localCoord,
                halfCrossW,
                interColor,
                perpColor: perpRecord.visualColor,
                perpVis: perpBand.filterVisibility
            });
        }

        const baseColor = record.visualColor;
        const tempColor = new THREE.Color();
        const crossTargetColor = new THREE.Color();

        const pulseWave = Math.sin(this.continuousGlowPhase) * 0.5 + 0.5;
        const continuousBoost = this.continuousGlowBlend * (0.06 + 0.14 * pulseWave);

        for (let i = 0; i < posAttr.count; i++) {
            const idx3 = i * 3;
            const rx = rest[idx3];
            const ry = rest[idx3 + 1];
            const rz = rest[idx3 + 2];

            const uCoord = isHorizontal ? rx : rz;
            const vCoord = isHorizontal ? rz : rx;
            const s = THREE.MathUtils.clamp((uCoord + halfLen) / length, 0, 1);

            // Color propio de la banda principal derivado de la mezcla proporcional completa de respuestas
            tempColor.copy(baseColor);

            tempColor.lerp(this.silhouetteColor, 1.0 - myVis);

            // Superposición cromática en cruces reales
            for (let c = 0; c < crossings.length; c++) {
                const cr = crossings[c];
                const dist = Math.abs(uCoord - cr.localCoord);
                if (dist < cr.halfCrossW * 1.32) {
                    const spatialT = 1 - THREE.MathUtils.smoothstep(dist, cr.halfCrossW * 0.52, cr.halfCrossW * 1.32);

                    const bothActive = myVis * cr.perpVis;
                    const onlyPerpActive = (1.0 - myVis) * cr.perpVis;

                    crossTargetColor.copy(tempColor);
                    crossTargetColor.lerp(cr.perpColor, onlyPerpActive);
                    crossTargetColor.lerp(cr.interColor, bothActive);

                    tempColor.lerp(crossTargetColor, spatialT);
                }
            }

            // Relieve blanco en hover
            if (this.hoverVisualBlend > 0.001 && myVis > 0.05) {
                const isTopFace = ry > thickness * 0.45 ? 1.0 : 0.35;
                const edgeRatio = THREE.MathUtils.clamp(Math.abs(vCoord) / (width * 0.5), 0, 1);
                const whiteReliefFactor =
                    this.hoverVisualBlend *
                    isTopFace *
                    (0.76 - 0.32 * Math.pow(edgeRatio, 1.6));

                tempColor.lerp(this.whiteReliefColor, whiteReliefFactor * myVis);
            }

            // Brillo continuo de selección
            if (continuousBoost > 0.001 && myVis > 0.05) {
                tempColor.offsetHSL(0, 0.05 * this.continuousGlowBlend, continuousBoost * myVis);
            }

            // Reflejo especular de luz al seleccionar individualmente la banda
            if (this.clickFlashActive && myVis > 0.05) {
                const sweepCenter = -0.15 + this.clickFlashProgress * 1.30;
                const skewS = s + (vCoord / width) * 0.06;
                const distToBeam = Math.abs(skewS - sweepCenter);
                const mainBeam = Math.exp(-Math.pow(distToBeam / 0.075, 2));
                const secondarySheen = 0.35 * Math.exp(-Math.pow((skewS - (sweepCenter - 0.09)) / 0.04, 2));
                const flashEnvelope = Math.sin(Math.PI * THREE.MathUtils.clamp(this.clickFlashProgress, 0, 1));
                const glassSheen = THREE.MathUtils.clamp((mainBeam + secondarySheen) * flashEnvelope * 0.92, 0, 0.95);

                tempColor.lerp(this.whiteReliefColor, glassSheen);
            }

            // Reflejo de luz global sobre toda la superficie al finalizar transición entre modelos (Sección 4)
            if (this.globalSurfaceSweepActive) {
                const worldX = position.x + rx;
                const worldZ = position.z + rz;
                // Onda diagonal normalizada en [0..1] desde esquina superior-izquierda (-X, -Z) a inferior-derecha (+X, +Z)
                const diagNorm = ((worldX / 24.0) + (worldZ / 18.0) + 2.0) * 0.25;
                const sweepCenter = -0.18 + this.globalSurfaceSweepProgress * 1.36;
                const dist = Math.abs(diagNorm - sweepCenter);
                const beam = Math.exp(-Math.pow(dist / 0.085, 2));
                const trail = 0.38 * Math.exp(-Math.pow((diagNorm - (sweepCenter - 0.09)) / 0.045, 2));
                const env = Math.sin(Math.PI * THREE.MathUtils.clamp(this.globalSurfaceSweepProgress, 0, 1));
                const surfaceGlassSheen = THREE.MathUtils.clamp((beam + trail) * env * 0.88, 0, 0.92);

                tempColor.lerp(this.whiteReliefColor, surfaceGlassSheen);
            }

            colorAttr.setXYZ(i, tempColor.r, tempColor.g, tempColor.b);
        }

        colorAttr.needsUpdate = true;

        const globalSweepGlow = this.globalSurfaceSweepActive
            ? Math.sin(Math.PI * THREE.MathUtils.clamp(this.globalSurfaceSweepProgress, 0, 1)) * 0.36
            : 0.0;

        const activeAuraStrength = Math.max(
            this.hoverVisualBlend * 0.48,
            this.continuousGlowBlend * (0.28 + 0.24 * pulseWave),
            this.fadeInGlowPulse * 0.42,
            globalSweepGlow
        ) * myVis;

        this.material.emissive.copy(baseColor);
        this.material.emissiveIntensity = activeAuraStrength * 0.55;

        this.auraMat.color.copy(baseColor);
        this.auraMat.opacity = activeAuraStrength * 0.65;
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
        if (!this.isFilterEnabled) return;

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

        if (this.isSelected) {
            this.state = "HOVERED";
            this.targetNormU = 0.5;
            return;
        }

        this.startReturnAnimation();
    }

    update(dt, camera) {
        let needsColorUpdate = false;

        const targetVis = this.isFilterEnabled ? 1.0 : 0.0;
        if (Math.abs(this.filterVisibility - targetVis) > 0.001) {
            const step = dt * SCENE_CONFIG.bandDefaults.filterTransitionSpeed;
            if (this.filterVisibility < targetVis) {
                this.filterVisibility = Math.min(targetVis, this.filterVisibility + step);
            } else {
                this.filterVisibility = Math.max(targetVis, this.filterVisibility - step);
            }
            needsColorUpdate = true;
        }

        if (this.fadeInGlowPulse > 0.001) {
            this.fadeInGlowPulse = Math.max(0, this.fadeInGlowPulse - dt * 1.35);
            needsColorUpdate = true;
        }

        let targetHoverVisual = 0.0;
        if (this.isFilterEnabled) {
            if (this.isHovered) {
                targetHoverVisual = this.isSelected ? 0.38 : 1.0;
            } else if (this.isSelected) {
                targetHoverVisual = 0.24;
            }
        }
        if (Math.abs(this.hoverVisualBlend - targetHoverVisual) > 0.001) {
            const hLerp = 1 - Math.exp(-11.0 * dt);
            this.hoverVisualBlend = THREE.MathUtils.lerp(
                this.hoverVisualBlend,
                targetHoverVisual,
                hLerp
            );
            if (Math.abs(this.hoverVisualBlend - targetHoverVisual) < 0.002) {
                this.hoverVisualBlend = targetHoverVisual;
            }
            needsColorUpdate = true;
        }

        if (this.clickFlashActive) {
            this.clickFlashProgress += dt * 1.55;
            if (this.clickFlashProgress >= 1.0) {
                this.clickFlashProgress = 1.0;
                this.clickFlashActive = false;
            }
            needsColorUpdate = true;
        }

        if (this.globalSurfaceSweepActive) {
            this.globalSurfaceSweepProgress += dt * 1.25; // ~0.80s de barrido sobre toda la superficie
            if (this.globalSurfaceSweepProgress >= 1.0) {
                this.globalSurfaceSweepProgress = 1.0;
                this.globalSurfaceSweepActive = false;
            }
            needsColorUpdate = true;
        }

        const targetContGlow = (this.isSelected && this.isFilterEnabled) ? 1.0 : 0.0;
        if (this.isSelected || this.continuousGlowBlend > 0.001) {
            this.continuousGlowPhase += dt * 2.4;
            const gLerp = 1 - Math.exp(-5.0 * dt);
            this.continuousGlowBlend = THREE.MathUtils.lerp(
                this.continuousGlowBlend,
                targetContGlow,
                gLerp
            );
            if (!this.isSelected && this.continuousGlowBlend < 0.002) {
                this.continuousGlowBlend = 0.0;
                this.continuousGlowPhase = 0.0;
            }
            needsColorUpdate = true;
        }

        if (this.state === "HOVERED" || this.isSelected) {
            this.state = "HOVERED";
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
            needsColorUpdate = true;
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
            }
            needsColorUpdate = true;
        }

        if (needsColorUpdate) {
            this.applyVertexChromaticProfile();
            if (this.secondaryStack) {
                this.secondaryStack.update();
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

        const auraPos = this.auraGeo.attributes.position;
        const auraArr = auraPos.array;
        const auraRest = this.auraRestPositions;

        for (let j = 0; j < auraArr.length; j += 3) {
            const arx = auraRest[j];
            const ary = auraRest[j + 1];
            const arz = auraRest[j + 2];

            const uCoord = isHorizontal ? arx : arz;
            const s = THREE.MathUtils.clamp((uCoord + halfLen) / length, 0, 1);
            const archProfile = this.computeArchProfileAtNormalizedS(s);

            const dy = this.currentElevation * archProfile * 0.92;
            const dLat = this.currentLateral * archProfile;

            auraArr[j] = isHorizontal ? arx : arx + dLat;
            auraArr[j + 1] = ary + dy;
            auraArr[j + 2] = isHorizontal ? arz + dLat : arz;
        }
        auraPos.needsUpdate = true;

        if (this.secondaryStack) {
            this.secondaryStack.update();
        }
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

        const auraPos = this.auraGeo.attributes.position;
        auraPos.array.set(this.auraRestPositions);
        auraPos.needsUpdate = true;

        if (this.secondaryStack) {
            this.secondaryStack.reset();
        }

        this.geometry.computeVertexNormals();
        this.geometry.computeBoundingBox();
        this.geometry.computeBoundingSphere();
        this.applyVertexChromaticProfile();
    }
}

// ==========================================================
// 8. CAPA DE REFLEJO DE VIDRIO SOBRE TODA LA SUPERFICIE (Sección 4)
// ==========================================================

class SurfaceGlassReflectionLayer {
    constructor(parentGroup, width, depth) {
        this.width = width;
        this.depth = depth;
        this.active = false;
        this.progress = 0.0;

        this.geo = new THREE.PlaneGeometry(width, depth, 48, 36);
        this.geo.rotateX(-Math.PI * 0.5);
        this.geo.translate(0, 0.025, 0);

        const posAttr = this.geo.attributes.position;
        const colorArr = new Float32Array(posAttr.count * 3);
        this.geo.setAttribute("color", new THREE.BufferAttribute(colorArr, 3));

        this.mat = new THREE.MeshBasicMaterial({
            vertexColors: true,
            transparent: true,
            opacity: 0.0,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            side: THREE.DoubleSide
        });

        this.mesh = new THREE.Mesh(this.geo, this.mat);
        this.mesh.visible = false;
        parentGroup.add(this.mesh);
    }

    trigger() {
        this.active = true;
        this.progress = 0.0;
        this.mesh.visible = true;
    }

    update(dt) {
        if (!this.active) return;

        this.progress += dt * 1.25;
        if (this.progress >= 1.0) {
            this.progress = 1.0;
            this.active = false;
            this.mat.opacity = 0.0;
            this.mesh.visible = false;
            return;
        }

        const posAttr = this.geo.attributes.position;
        const colorAttr = this.geo.attributes.color;
        const sweepCenter = -0.18 + this.progress * 1.36;
        const env = Math.sin(Math.PI * this.progress);

        for (let i = 0; i < posAttr.count; i++) {
            const x = posAttr.getX(i);
            const z = posAttr.getZ(i);
            const diagNorm = ((x / (this.width * 0.5)) + (z / (this.depth * 0.5)) + 2.0) * 0.25;

            const dist = Math.abs(diagNorm - sweepCenter);
            const mainBeam = Math.exp(-Math.pow(dist / 0.09, 2));
            const secondaryBeam = 0.4 * Math.exp(-Math.pow((diagNorm - (sweepCenter - 0.095)) / 0.045, 2));
            const val = THREE.MathUtils.clamp((mainBeam + secondaryBeam) * env, 0, 1);

            colorAttr.setXYZ(i, val * 0.88, val * 0.94, val * 1.0);
        }

        colorAttr.needsUpdate = true;
        this.mat.opacity = 0.34 * env;
    }
}

// ==========================================================
// 9. CONSTRUCTORES DE LOS DOS MODELOS 3D INDEPENDIENTES
// ==========================================================

// 9.1 Constructor del Modelo de Buenos Aires (Barrio de San Nicolás)
function createBuenosAiresModel(scene) {
    const rootGroup = new THREE.Group();
    rootGroup.name = "modelo-buenos-aires";
    scene.add(rootGroup);

    const dataEngine = new ChromaticDataEngine(
        BUENOS_AIRES_RAW_RECORDS,
        BUENOS_AIRES_STREET_DETAILS,
        BUENOS_AIRES_VALIDATION
    );

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

    const bandDef = SCENE_CONFIG.bandDefaults;
    const labelDef = SCENE_CONFIG.bandLabelDefaults;
    const totalW = width + bandDef.width + tabExtension * 2;
    const totalD = depth + bandDef.width + tabExtension * 2;

    // Superficie base y recuadros
    const surfaceGroup = new THREE.Group();
    const baseGeo = new THREE.PlaneGeometry(totalW, totalD);
    baseGeo.rotateX(-Math.PI * 0.5);
    baseGeo.translate(0, recuadroDepth - 0.05, 0);

    const baseMesh = new THREE.Mesh(
        baseGeo,
        new THREE.MeshStandardMaterial({
            color: baseColor,
            roughness: 0.92,
            metalness: 0.02,
            transparent: true,
            opacity: baseOpacity
        })
    );
    baseMesh.receiveShadow = true;
    surfaceGroup.add(baseMesh);

    const gridMat = new THREE.MeshBasicMaterial({ color: gridColor, side: THREE.DoubleSide });
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

    const darkBlockMat = new THREE.MeshStandardMaterial({ color: recuadroDarkColor, roughness: 0.88, metalness: 0.04 });
    const midBlockMat = new THREE.MeshStandardMaterial({ color: recuadroMidColor, roughness: 0.85, metalness: 0.05 });
    const stripeMat = new THREE.MeshBasicMaterial({ color: 0xd8dee9, side: THREE.DoubleSide });

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
            const innerMesh = new THREE.Mesh(innerGeo, isMidRowHighlight ? midBlockMat : darkBlockMat);
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
    surfaceGroup.add(new THREE.LineSegments(lineGeo, new THREE.LineBasicMaterial({ color: gridColor })));
    rootGroup.add(surfaceGroup);

    // Bandas y etiquetas 3D
    const bands = [];
    const bandsById = new Map();
    const bandLabelsById = new Map();

    dataEngine.recordsById.forEach((rec) => {
        if (rec.type !== "horizontal" && rec.type !== "vertical") return;

        const isH = rec.type === "horizontal";
        const zPos = isH ? (-halfD + (rec.rowIndex / rows) * surfDFromCfg()) : 0;
        const xPos = isH ? 0 : (-halfW + (rec.colIndex / columns) * width);
        const len = isH ? totalW : totalD;
        const layerOffset = isH ? (rec.rowIndex * 0.0015) : (0.007 + rec.colIndex * 0.0015);

        const bandCfg = {
            id: rec.id,
            name: rec.name,
            orientation: rec.type,
            width: bandDef.width,
            thickness: rec.principalHeight || bandDef.thickness,
            length: len,
            position: { x: xPos, y: 0, z: zPos },
            maxElevation: rec.hoverElevation || bandDef.maxElevation,
            animationSpeed: bandDef.animationSpeed,
            returnDuration: bandDef.returnDuration,
            maxLateralOffset: bandDef.maxLateralOffset,
            lateralSensitivity: bandDef.lateralSensitivity,
            layerOffset
        };

        const band = new ElasticBand(bandCfg, rootGroup, dataEngine);
        bands.push(band);
        bandsById.set(band.id, band);

        const labelCfg = {
            id: `etiqueta-${rec.id}`,
            bandId: rec.id,
            text: rec.name,
            position: { x: xPos, y: 0, z: zPos },
            initialHeight: labelDef.initialHeight,
            hoverHeight: labelDef.hoverHeight,
            separation: labelDef.separation,
            hoverScale: labelDef.hoverScale,
            initialOrientation: { x: -Math.PI * 0.5, y: 0, z: isH ? 0 : Math.PI * 0.5 },
            orientationInDuration: labelDef.orientationInDuration,
            orientationOutDuration: labelDef.orientationOutDuration,
            maxBloomIntensity: labelDef.maxBloomIntensity,
            textSize: isH ? labelDef.textSize : labelDef.textSize * 0.92
        };

        const label = new BandLabel3D(labelCfg, band, rootGroup, dataEngine);
        band.label = label;
        bandLabelsById.set(label.id, label);
    });

    function surfDFromCfg() {
        return SCENE_CONFIG.surface.depth;
    }

    const hBands = bands.filter((b) => b.config.orientation === "horizontal");
    const vBands = bands.filter((b) => b.config.orientation === "vertical");
    hBands.forEach((hb) => hb.setPerpendicularBands(vBands));
    vBands.forEach((vb) => vb.setPerpendicularBands(hBands));

    const surfaceReflection = new SurfaceGlassReflectionLayer(rootGroup, totalW, totalD);

    return {
        key: "buenos-aires",
        city: "Buenos Aires",
        neighborhood: "Barrio de San Nicolás",
        switchButtonText: "Modelo de Valparaíso",
        rootGroup,
        dataEngine,
        bands,
        bandsById,
        bandLabelsById,
        surfaceReflection,
        triggerSurfaceReflection() {
            this.surfaceReflection.trigger();
            this.bands.forEach((b) => b.triggerGlobalSurfaceSweep());
        }
    };
}

// 9.2 Constructor del Modelo de Valparaíso (Barrio Puerto)
// Fiel al mapa de referencia de Barrio Puerto y a los 22 registros de la tabla de Valparaíso
function createValparaisoModel(scene) {
    const rootGroup = new THREE.Group();
    rootGroup.name = "modelo-valparaiso";
    rootGroup.visible = false;
    scene.add(rootGroup);

    const dataEngine = new ChromaticDataEngine(
        VALPARAISO_RAW_RECORDS,
        VALPARAISO_STREET_DETAILS,
        VALPARAISO_VALIDATION
    );

    const {
        gridColor,
        recuadroDepth,
        recuadroDarkColor,
        recuadroMidColor,
        baseColor,
        baseOpacity
    } = SCENE_CONFIG.surface;

    const bandDef = SCENE_CONFIG.bandDefaults;
    const labelDef = SCENE_CONFIG.bandLabelDefaults;

    const totalW = 47.6;
    const totalD = 36.6;

    const surfaceGroup = new THREE.Group();

    // Superficie base discreta 4:3
    const baseGeo = new THREE.PlaneGeometry(totalW, totalD);
    baseGeo.rotateX(-Math.PI * 0.5);
    baseGeo.translate(0, recuadroDepth - 0.05, 0);

    const baseMesh = new THREE.Mesh(
        baseGeo,
        new THREE.MeshStandardMaterial({
            color: baseColor,
            roughness: 0.92,
            metalness: 0.02,
            transparent: true,
            opacity: baseOpacity
        })
    );
    baseMesh.receiveShadow = true;
    surfaceGroup.add(baseMesh);

    const darkBlockMat = new THREE.MeshStandardMaterial({ color: recuadroDarkColor, roughness: 0.88, metalness: 0.04 });
    const midBlockMat = new THREE.MeshStandardMaterial({ color: recuadroMidColor, roughness: 0.85, metalness: 0.05 });
    const rungMat = new THREE.MeshBasicMaterial({ color: 0xd8dee9, side: THREE.DoubleSide });

    const linePositions = [];
    const yFrame = 0.003;

    // Función auxiliar para añadir un bloque/manzana de Barrio Puerto con su marco exterior #4a4a4a,
    // su interior hundido y sus pasajes escalonados verticales según la imagen de referencia
    function addValpoBlock(cx, cz, outerW, outerD, innerW, innerD, isHighlight, passageXCoords = []) {
        const hw = outerW * 0.5;
        const hd = outerD * 0.5;

        linePositions.push(
            cx - hw, yFrame, cz - hd, cx + hw, yFrame, cz - hd,
            cx + hw, yFrame, cz - hd, cx + hw, yFrame, cz + hd,
            cx + hw, yFrame, cz + hd, cx - hw, yFrame, cz + hd,
            cx - hw, yFrame, cz + hd, cx - hw, yFrame, cz - hd
        );

        const innerGeo = new THREE.PlaneGeometry(innerW, innerD);
        innerGeo.rotateX(-Math.PI * 0.5);
        innerGeo.translate(cx, recuadroDepth, cz);

        const innerMesh = new THREE.Mesh(innerGeo, isHighlight ? midBlockMat : darkBlockMat);
        innerMesh.receiveShadow = true;
        surfaceGroup.add(innerMesh);

        // Pasajes escalonados (peldaños blancos que atraviesan los bloques en Almte. Muñoz, Almte. Goñi y Almte. Pérez)
        const numRungs = 9;
        const rungW = 0.78;
        const rungD = 0.30;
        const spanZ = innerD * 0.88;

        passageXCoords.forEach((pxWorld) => {
            for (let k = 0; k < numRungs; k++) {
                const zOff = cz - spanZ * 0.5 + (k / (numRungs - 1)) * spanZ;
                const rGeo = new THREE.PlaneGeometry(rungW, rungD);
                rGeo.rotateX(-Math.PI * 0.5);
                rGeo.translate(pxWorld, recuadroDepth + 0.015, zOff);
                surfaceGroup.add(new THREE.Mesh(rGeo, rungMat));
            }
        });
    }

    // Disposición exacta de las manzanas según el mapa de referencia de Barrio Puerto:
    // Columna 1 (izquierda de Sotomayor 1: x = -21.2)
    addValpoBlock(-21.2, -10.0, 5.4, 6.2, 3.9, 4.5, false);
    addValpoBlock(-21.2,   0.0, 5.4, 6.2, 3.9, 4.5, false);
    addValpoBlock(-21.2,  10.0, 5.4, 6.2, 3.9, 4.5, false);

    // Columna 2 (entre Sotomayor 1 y Sotomayor 2: x = -12.4, con Plaza Sotomayor en el centro)
    addValpoBlock(-12.4, -10.0, 5.8, 6.2, 4.2, 4.5, false);
    addValpoBlock(-12.4,   0.0, 5.8, 6.2, 4.2, 4.5, true); // Plaza Sotomayor
    addValpoBlock(-12.4,  10.0, 5.8, 6.2, 4.2, 4.5, false);

    // Fila 1 Central-Derecha (gran bloque alargado entre Serrano y Cochrane: x de -4.6 a +14.3,
    // atravesado por los 3 pasajes escalonados de Almte. Muñoz, Almte. Goñi y Almte. Pérez)
    addValpoBlock(4.85, -10.0, 18.9, 6.2, 17.2, 4.5, true, [1.8, 7.2, 12.1]);

    // Fila 2 y Fila 3 Central (bloques entre Sotomayor 2 y Almte. Goñi: x = -0.5, atravesados por Almte. Muñoz)
    addValpoBlock(-0.5,  0.0, 8.8, 6.2, 7.2, 4.5, true, [1.8]);
    addValpoBlock(-0.5, 10.0, 8.8, 6.2, 7.2, 4.5, false, [1.8]);

    // Fila 2 Derecha (bloque entre Almte. Goñi y Clave: x = 12.1, atravesado por el pasaje Almte. Pérez)
    addValpoBlock(12.1, 0.0, 5.8, 6.2, 4.2, 4.5, true, [12.1]);

    // Fila 3 Derecha (bloque sólido entre Almte. Goñi y Clave: x = 12.1, sin pasaje porque Almte. Pérez termina en Blanco)
    addValpoBlock(12.1, 10.0, 5.8, 6.2, 4.2, 4.5, false, []);

    // Columna 5 (derecha de Clave / San Martín / Plaza Echaurren: x = 20.3)
    addValpoBlock(20.3, -10.0, 3.8, 6.2, 2.5, 4.5, false);
    addValpoBlock(20.3,   0.0, 3.8, 6.2, 2.5, 4.5, false);
    addValpoBlock(20.3,  10.0, 3.8, 6.2, 2.5, 4.5, false);

    // Contorno superior con las 2 pestañas salientes de Sotomayor 1 y Sotomayor 2 y línea inferior costera
    const topZ = -16.8;
    const tabTopZ = -18.3;
    const botZ = 16.8;
    linePositions.push(
        -23.6, yFrame, topZ, -18.4, yFrame, topZ,
        -18.4, yFrame, topZ, -18.4, yFrame, tabTopZ,
        -18.4, yFrame, tabTopZ, -16.2, yFrame, tabTopZ,
        -16.2, yFrame, tabTopZ, -16.2, yFrame, topZ,
        -16.2, yFrame, topZ,  -8.6, yFrame, topZ,
         -8.6, yFrame, topZ,  -8.6, yFrame, tabTopZ,
         -8.6, yFrame, tabTopZ, -6.4, yFrame, tabTopZ,
         -6.4, yFrame, tabTopZ, -6.4, yFrame, topZ,
         -6.4, yFrame, topZ,  23.6, yFrame, topZ,
        -23.6, yFrame, botZ,  23.6, yFrame, botZ
    );

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.Float32BufferAttribute(linePositions, 3));
    surfaceGroup.add(new THREE.LineSegments(lineGeo, new THREE.LineBasicMaterial({ color: gridColor })));

    // Textos 3D de hitos geográficos acostados y ligeramente hundidos del mapa de Barrio Puerto
    const landmarks = [
        { lines: ["Plaza", "Sotomayor"], x: -12.4, z: 0.0, y: recuadroDepth + 0.03, size: 1.05, rotZ: 0, color: "#94a3b8" },
        { lines: ["Ascensor", "Cordillera"], x: 7.5, z: -17.55, y: -0.08, size: 0.86, rotZ: 0, color: "#8a94a6" },
        { lines: ["Estación", "Puerto"], x: -16.8, z: 17.65, y: -0.08, size: 0.84, rotZ: 0, color: "#8a94a6", italic: true },
        { lines: ["Puerto"], x: 2.2, z: 17.55, y: -0.08, size: 0.90, rotZ: 0, color: "#94a3b8" },
        { lines: ["Plaza", "Echaurren"], x: 23.25, z: -10.0, y: -0.08, size: 0.85, rotZ: Math.PI * 0.5, color: "#8a94a6" }
    ];

    const landmarkMeshes = [];
    landmarks.forEach((lm) => {
        const { texture, aspect } = createStaticLandmarkTexture(lm.lines, {
            color: lm.color,
            italic: Boolean(lm.italic)
        });
        const g = new THREE.PlaneGeometry(lm.size * aspect, lm.size);
        const m = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            opacity: 0.9,
            depthWrite: false,
            side: THREE.DoubleSide
        });
        const mesh = new THREE.Mesh(g, m);
        mesh.position.set(lm.x, lm.y, lm.z);
        mesh.rotation.order = "XYZ";
        mesh.rotation.set(-Math.PI * 0.5, 0, lm.rotZ || 0);
        surfaceGroup.add(mesh);
        landmarkMeshes.push({ mesh, config: lm });
    });

    rootGroup.add(surfaceGroup);

    // Construcción de las bandas 3D de Valparaíso y sus etiquetas
    const bands = [];
    const bandsById = new Map();
    const bandLabelsById = new Map();

    let hLayerIdx = 0;
    let vLayerIdx = 0;

    dataEngine.recordsById.forEach((rec) => {
        if ((rec.type !== "horizontal" && rec.type !== "vertical") || !rec.customGeom) return;

        const isH = rec.type === "horizontal";
        const g = rec.customGeom;
        const layerOffset = isH ? (hLayerIdx++ * 0.0014) : (0.009 + vLayerIdx++ * 0.0014);

        const bandCfg = {
            id: rec.id,
            name: rec.name,
            orientation: rec.type,
            width: g.width || bandDef.width,
            thickness: rec.principalHeight || bandDef.thickness,
            length: g.length,
            position: { x: g.x, y: 0, z: g.z },
            maxElevation: rec.hoverElevation || bandDef.maxElevation,
            animationSpeed: bandDef.animationSpeed,
            returnDuration: bandDef.returnDuration,
            maxLateralOffset: bandDef.maxLateralOffset,
            lateralSensitivity: bandDef.lateralSensitivity,
            layerOffset
        };

        const band = new ElasticBand(bandCfg, rootGroup, dataEngine);
        bands.push(band);
        bandsById.set(band.id, band);

        const textScale = g.textSizeScale || (isH ? 1.0 : 0.90);
        const labelCfg = {
            id: `etiqueta-${rec.id}`,
            bandId: rec.id,
            text: rec.labelText || rec.name,
            position: {
                x: g.x + (g.labelOffsetX || 0),
                y: 0,
                z: g.z + (g.labelOffsetZ || 0)
            },
            initialHeight: labelDef.initialHeight,
            hoverHeight: labelDef.hoverHeight,
            separation: labelDef.separation,
            hoverScale: labelDef.hoverScale,
            initialOrientation: { x: -Math.PI * 0.5, y: 0, z: isH ? 0 : Math.PI * 0.5 },
            orientationInDuration: labelDef.orientationInDuration,
            orientationOutDuration: labelDef.orientationOutDuration,
            maxBloomIntensity: labelDef.maxBloomIntensity,
            textSize: labelDef.textSize * textScale
        };

        const label = new BandLabel3D(labelCfg, band, rootGroup, dataEngine);
        band.label = label;
        bandLabelsById.set(label.id, label);
    });

    const hBands = bands.filter((b) => b.config.orientation === "horizontal");
    const vBands = bands.filter((b) => b.config.orientation === "vertical");
    hBands.forEach((hb) => hb.setPerpendicularBands(vBands));
    vBands.forEach((vb) => vb.setPerpendicularBands(hBands));

    const surfaceReflection = new SurfaceGlassReflectionLayer(rootGroup, totalW, totalD);

    return {
        key: "valparaiso",
        city: "Valparaíso",
        neighborhood: "Barrio Puerto",
        switchButtonText: "Modelo de Buenos Aires",
        rootGroup,
        dataEngine,
        bands,
        bandsById,
        bandLabelsById,
        landmarkMeshes,
        surfaceReflection,
        triggerSurfaceReflection() {
            this.surfaceReflection.trigger();
            this.bands.forEach((b) => b.triggerGlobalSurfaceSweep());
        }
    };
}

// ==========================================================
// 10. ICONOS SVG Y CONTROLADOR DEL PANEL DE INFORMACIÓN
// ==========================================================

const PANEL_ICONS = {
    mayorDificultad: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
    menorDificultad: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
    mediaDificultad: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
    veredas: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19L8 5"/><path d="M16 5l4 14"/><line x1="12" y1="6" x2="12" y2="8"/><line x1="12" y1="11" x2="12" y2="13"/><line x1="12" y1="16" x2="12" y2="18"/></svg>`,
    cruces: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>`,
    ruido: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>`,
    iluminacion: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`,
    descanso: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h16"/><path d="M5 12v6"/><path d="M19 12v6"/><path d="M6 8h12a1 1 0 0 1 1 1v3H5V9a1 1 0 0 1 1-1z"/></svg>`
};

class StreetInfoPanelController {
    constructor(onPanelCloseCallback) {
        this.panelEl = document.getElementById("street-info-panel");
        this.closeBtn = document.getElementById("panel-close-btn");
        this.streetNameEl = document.getElementById("panel-street-name");
        this.activeTabBadgeEl = document.getElementById("panel-active-tab-badge");
        this.activeTabLabelEl = document.getElementById("panel-active-tab-label");
        this.distBarEl = document.getElementById("panel-distribution-bar");
        this.distLegendEl = document.getElementById("panel-distribution-legend");
        this.scrollBodyEl = document.getElementById("panel-scroll-body");

        this.difficultyStatsEl = document.getElementById("panel-difficulty-stats");
        this.urbanStatsEl = document.getElementById("panel-urban-stats");
        this.commentsNegEl = document.getElementById("panel-comments-negative");
        this.commentsPosEl = document.getElementById("panel-comments-positive");
        this.commentsMixWrapEl = document.getElementById("panel-comments-mixed-wrap");
        this.commentsMixEl = document.getElementById("panel-comments-mixed");
        this.otherAspectsEl = document.getElementById("panel-other-aspects");
        this.emotionsEl = document.getElementById("panel-emotions");

        this.currentBandId = null;
        this.isOpen = false;
        this.activeTab = "informacion";
        this.onPanelCloseCallback = onPanelCloseCallback;

        this.bindEvents();
    }

    bindEvents() {
        this.closeBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            this.close(true);
        });

        window.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && this.isOpen) {
                this.close(true);
            }
        });
    }

    openForBand(band, tabName = "informacion") {
        if (!band) return;
        const record = band.getDataRecord();
        if (!record) return;

        const details = band.dataEngine.getStreetDetails(band.id) || {
            id: band.id,
            name: record.name,
            isPendingDetailedData: true,
            difficultyStats: { mayorDificultad: null, menorDificultad: null, mediaDificultad: null },
            urbanAspects: {},
            comentariosNegativos: [],
            comentariosPositivos: [],
            otrosAspectos: [],
            emociones: []
        };

        this.currentBandId = band.id;
        this.isOpen = true;
        this.activeTab = tabName;

        if (this.activeTabBadgeEl) {
            this.activeTabBadgeEl.setAttribute("data-active-tab", this.activeTab);
        }
        if (this.activeTabLabelEl) {
            this.activeTabLabelEl.textContent =
                this.activeTab === "informacion" ? "Información" : this.activeTab;
        }

        this.streetNameEl.textContent = record.name;
        const titleColor = record.visualColor.clone();
        const hsl = { h: 0, s: 0, l: 0 };
        titleColor.getHSL(hsl);
        titleColor.setHSL(hsl.h, Math.max(0.65, hsl.s), Math.max(0.62, hsl.l));
        const titleHex = `#${titleColor.getHexString()}`;
        this.streetNameEl.style.color = titleHex;

        const badgeDot = this.activeTabBadgeEl
            ? this.activeTabBadgeEl.querySelector(".badge-dot")
            : null;
        if (badgeDot) {
            badgeDot.style.backgroundColor = titleHex;
            badgeDot.style.boxShadow = `0 0 8px ${titleHex}`;
        }

        this.renderChromaticDistribution(record);
        this.renderQuantitativeStats(details, record);
        this.renderComments(details);
        this.renderSecondaryMetadata(details);

        this.scrollBodyEl.scrollTop = 0;
        this.panelEl.classList.add("is-open");
        this.panelEl.setAttribute("aria-hidden", "false");
    }

    renderChromaticDistribution(record) {
        const total = record.green + record.yellow + record.red;
        const pctG = total > 0 ? (record.green / total) * 100 : 0;
        const pctY = total > 0 ? (record.yellow / total) * 100 : 0;
        const pctR = total > 0 ? (record.red / total) * 100 : 0;

        this.distBarEl.innerHTML = "";

        const segments = [
            { key: "green", pct: pctG, cls: "dist-green" },
            { key: "yellow", pct: pctY, cls: "dist-yellow" },
            { key: "red", pct: pctR, cls: "dist-red" }
        ];

        segments.forEach((seg) => {
            if (seg.pct > 0) {
                const div = document.createElement("div");
                div.className = `dist-segment ${seg.cls}`;
                div.style.width = `${seg.pct.toFixed(2)}%`;
                this.distBarEl.appendChild(div);
            }
        });

        const fmt = (val) => `${val.toFixed(1).replace(".", ",")}%`;

        this.distLegendEl.innerHTML = `
            <span class="legend-item ${pctG === 0 ? "is-zero" : ""}">
                <span class="legend-dot dot-green"></span>
                Verde: <strong>${fmt(pctG)}</strong>
            </span>
            <span class="legend-item ${pctY === 0 ? "is-zero" : ""}">
                <span class="legend-dot dot-yellow"></span>
                Amarillo: <strong>${fmt(pctY)}</strong>
            </span>
            <span class="legend-item ${pctR === 0 ? "is-zero" : ""}">
                <span class="legend-dot dot-red"></span>
                Rojo: <strong>${fmt(pctR)}</strong>
            </span>
        `;
    }

    renderQuantitativeStats(details, record) {
        const d = details.difficultyStats || {};
        const u = details.urbanAspects || {};

        if (details.isValparaisoSurvey) {
            const fmtNum = (val) => (val !== null && val !== undefined)
                ? `${val.toFixed(2).replace(".", ",")} / 5`
                : null;

            const mediaGenStr = fmtNum(d.mediaDificultad);
            const mediaMayorStr = fmtNum(d.mediaEnMayor);

            const mediaGeneralHtml = mediaGenStr
                ? `<span class="stat-value">${mediaGenStr}</span>`
                : `<span class="stat-value is-unavailable">Sin datos suficientes</span>`;

            const mediaMayorHtml = mediaMayorStr
                ? `<span class="stat-value">${mediaMayorStr}</span>`
                : `<span class="stat-value is-unavailable">Sin menciones en mayor dif.</span>`;

            const levelsHtml = (d.distribucionNiveles || [])
                .map((item) => `
                    <div class="diff-level-cell ${item.count > 0 ? "has-count" : ""}">
                        <span class="diff-level-num">Nivel ${item.nivel}</span>
                        <span class="diff-level-val">${item.count}</span>
                        <span class="diff-level-pct">${item.pct.toFixed(0)}%</span>
                    </div>
                `)
                .join("");

            this.difficultyStatsEl.innerHTML = `
                <div class="stat-row">
                    <span class="stat-icon" aria-hidden="true">${PANEL_ICONS.mayorDificultad}</span>
                    <span class="stat-label">Menciones en mayor dificultad</span>
                    <span class="stat-value">${d.mayorDificultad}</span>
                </div>
                <div class="stat-row">
                    <span class="stat-icon" aria-hidden="true">${PANEL_ICONS.menorDificultad}</span>
                    <span class="stat-label">Menciones en menor dificultad</span>
                    <span class="stat-value">${d.menorDificultad}</span>
                </div>
                <div class="stat-row">
                    <span class="stat-icon" aria-hidden="true">${PANEL_ICONS.mediaDificultad}</span>
                    <span class="stat-label">Promedio de dificultad (${d.totalEncuestasAsociadas} enc.)</span>
                    ${mediaGeneralHtml}
                </div>
                <div class="stat-row">
                    <span class="stat-icon" aria-hidden="true">${PANEL_ICONS.mediaDificultad}</span>
                    <span class="stat-label">Promedio en mayor dificultad</span>
                    ${mediaMayorHtml}
                </div>
                <div class="difficulty-levels-row">
                    <div class="difficulty-levels-header">
                        <span>Distribución por niveles (Escala 1 a 5)</span>
                        <span>n = ${d.totalEncuestasAsociadas}</span>
                    </div>
                    <div class="difficulty-levels-grid">
                        ${levelsHtml}
                    </div>
                </div>
            `;
        } else {
            const mayorHtml = (d.mayorDificultad !== null && d.mayorDificultad !== undefined)
                ? `<span class="stat-value">${d.mayorDificultad}</span>`
                : `<span class="stat-value is-unavailable">Sin datos</span>`;

            const menorHtml = (d.menorDificultad !== null && d.menorDificultad !== undefined)
                ? `<span class="stat-value">${d.menorDificultad}</span>`
                : `<span class="stat-value is-unavailable">Sin datos</span>`;

            const mediaHtml = (d.mediaDificultad !== null && d.mediaDificultad !== undefined)
                ? `<span class="stat-value">${d.mediaDificultad.toFixed(2).replace(".", ",")}</span>`
                : `<span class="stat-value is-unavailable">Sin datos</span>`;

            this.difficultyStatsEl.innerHTML = `
                <div class="stat-row">
                    <span class="stat-icon" aria-hidden="true">${PANEL_ICONS.mayorDificultad}</span>
                    <span class="stat-label">Veces en mayor dificultad</span>
                    ${mayorHtml}
                </div>
                <div class="stat-row">
                    <span class="stat-icon" aria-hidden="true">${PANEL_ICONS.menorDificultad}</span>
                    <span class="stat-label">Veces en menor dificultad</span>
                    ${menorHtml}
                </div>
                <div class="stat-row">
                    <span class="stat-icon" aria-hidden="true">${PANEL_ICONS.mediaDificultad}</span>
                    <span class="stat-label">Media de dificultad percibida</span>
                    ${mediaHtml}
                </div>
            `;
        }

        const urbanItems = [
            { icon: PANEL_ICONS.veredas, label: "Estado de calles y veredas", data: u.estadoCallesVeredas },
            { icon: PANEL_ICONS.cruces, label: "Cruces y orientación", data: u.crucesOrientacion },
            { icon: PANEL_ICONS.ruido, label: "Ruido", data: u.ruido },
            { icon: PANEL_ICONS.iluminacion, label: "Iluminación", data: u.iluminacion },
            { icon: PANEL_ICONS.descanso, label: "Espacios de descanso", data: u.espaciosDescanso }
        ];

        this.urbanStatsEl.innerHTML = urbanItems
            .map((item) => {
                if (!item.data) {
                    return `
                        <div class="stat-row">
                            <span class="stat-icon" aria-hidden="true">${item.icon}</span>
                            <span class="stat-label">${item.label}</span>
                            <span class="stat-value is-unavailable">Sin datos suficientes</span>
                        </div>
                    `;
                }
                const si = item.data.si;
                const no = item.data.no;
                const hasPct = typeof item.data.pctSi === "number";
                const pctSiHtml = hasPct ? `<span class="yn-pct">(${item.data.pctSi.toFixed(0)}%)</span>` : "";
                const pctNoHtml = hasPct ? `<span class="yn-pct">(${item.data.pctNo.toFixed(0)}%)</span>` : "";

                return `
                    <div class="stat-row">
                        <span class="stat-icon" aria-hidden="true">${item.icon}</span>
                        <span class="stat-label">${item.label}</span>
                        <span class="stat-yesno">
                            <span class="yn-pill yn-yes ${si > 0 ? "has-yes" : ""}">Sí: <strong>${si}</strong>${pctSiHtml}</span>
                            <span class="yn-pill yn-no">No: <strong>${no}</strong>${pctNoHtml}</span>
                        </span>
                    </div>
                `;
            })
            .join("");
    }

    renderComments(details) {
        const negList = details.comentariosNegativos || [];
        const posList = details.comentariosPositivos || [];
        const mixList = details.comentariosMixtos || [];

        if (negList.length === 0) {
            this.commentsNegEl.innerHTML = `<div class="comments-empty">No hay comentarios negativos específicos registrados para esta calle.</div>`;
        } else {
            this.commentsNegEl.innerHTML = negList
                .map((text) => `<article class="comment-card comment-neg">“${text}”</article>`)
                .join("");
        }

        if (posList.length === 0) {
            this.commentsPosEl.innerHTML = `<div class="comments-empty">No hay comentarios positivos específicos registrados para esta calle.</div>`;
        } else {
            this.commentsPosEl.innerHTML = posList
                .map((text) => `<article class="comment-card comment-pos">“${text}”</article>`)
                .join("");
        }

        if (this.commentsMixWrapEl && this.commentsMixEl) {
            if (details.isValparaisoSurvey && mixList.length > 0) {
                this.commentsMixWrapEl.style.display = "flex";
                this.commentsMixEl.innerHTML = mixList
                    .map((text) => `<article class="comment-card comment-mix">${text}</article>`)
                    .join("");
            } else {
                this.commentsMixWrapEl.style.display = "none";
                this.commentsMixEl.innerHTML = "";
            }
        }
    }

    renderSecondaryMetadata(details) {
        const aspects = details.otrosAspectos || [];
        const emotions = details.emociones || [];

        const getCtxClass = (ctx) => {
            if (ctx === "Mayor") return "ctx-mayor";
            if (ctx === "Menor") return "ctx-menor";
            if (ctx === "Cruce") return "ctx-cruce";
            return "ctx-general";
        };

        if (aspects.length === 0) {
            this.otherAspectsEl.innerHTML = `<span class="comments-empty">Sin observaciones adicionales registradas</span>`;
        } else {
            this.otherAspectsEl.innerHTML = aspects
                .map((item) => `
                    <span class="meta-tag">
                        <span>${item.texto}</span>
                        <span class="meta-tag-ctx ${getCtxClass(item.contexto)}">${item.contexto}</span>
                    </span>
                `)
                .join("");
        }

        if (emotions.length === 0) {
            this.emotionsEl.innerHTML = `<span class="comments-empty">Sin emociones registradas</span>`;
        } else {
            this.emotionsEl.innerHTML = emotions
                .map((item) => `
                    <span class="meta-tag">
                        <span>${item.texto}</span>
                        <span class="meta-tag-ctx ${getCtxClass(item.contexto)}">${item.contexto}</span>
                    </span>
                `)
                .join("");
        }
    }

    close(notifyCallback = true) {
        if (!this.isOpen) return;
        this.isOpen = false;
        this.currentBandId = null;

        this.panelEl.classList.remove("is-open");
        this.panelEl.setAttribute("aria-hidden", "true");

        if (notifyCallback && typeof this.onPanelCloseCallback === "function") {
            this.onPanelCloseCallback();
        }
    }
}

// ==========================================================
// 11. GESTOR DE INTERACCIÓN 3D, SELECCIÓN EXCLUSIVA Y CLIC
// ==========================================================

class BandInteractionManager {
    constructor(camera, domElement, initialBands, infoPanel) {
        this.camera = camera;
        this.domElement = domElement;
        this.bands = initialBands || [];
        this.infoPanel = infoPanel;

        this.hoveredBand = null;
        this.selectedBand = null;
        this.isInfoPanelOpen = false;
        this.activePanelTab = "informacion";

        // Bloqueo temporal durante la transición cinematográfica entre modelos
        this.isTransitionLocked = false;

        this.bandAtPointerDown = null;
        this.returningLockedBand = null;
        this.pointerDownPos = { x: 0, y: 0 };

        this.raycaster = new THREE.Raycaster();
        this.pointerNDC = new THREE.Vector2(-999, -999);
        this.hasValidPointer = false;
        this.horizontalPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
        this.planeHitPoint = new THREE.Vector3();

        this.bindEvents();
    }

    // Cambia el conjunto de bandas activas al alternar entre Buenos Aires y Valparaíso
    setActiveModelBands(newBands) {
        this.clearSelectedBand(true);
        this.releaseHoveredBand();
        this.returningLockedBand = null;
        this.bandAtPointerDown = null;
        this.bands = newBands || [];
    }

    setTransitionLocked(locked) {
        this.isTransitionLocked = locked;
        if (locked) {
            this.clearSelectedBand(true);
            this.releaseHoveredBand();
        }
    }

    updatePointerNDCFromEvent(e) {
        const rect = this.domElement.getBoundingClientRect();
        this.pointerNDC.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        this.pointerNDC.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        this.hasValidPointer = true;
    }

    bindEvents() {
        this.domElement.addEventListener("pointermove", (e) => {
            this.updatePointerNDCFromEvent(e);
        });

        this.domElement.addEventListener("pointerleave", () => {
            this.hasValidPointer = false;
            this.releaseHoveredBand();
        });

        this.domElement.addEventListener("pointerdown", (e) => {
            if (e.button !== 0 || this.isTransitionLocked) return;
            this.updatePointerNDCFromEvent(e);
            this.pointerDownPos.x = e.clientX;
            this.pointerDownPos.y = e.clientY;
            this.bandAtPointerDown = this.hoveredBand || this.pickBandAtCurrentPointer();
        });

        this.domElement.addEventListener("pointerup", (e) => {
            if (e.button !== 0 || this.isTransitionLocked) return;
            const moveDist = Math.hypot(
                e.clientX - this.pointerDownPos.x,
                e.clientY - this.pointerDownPos.y
            );

            if (moveDist < 7) {
                this.updatePointerNDCFromEvent(e);
                this.handleSceneClick();
            }
            this.bandAtPointerDown = null;
        });
    }

    pickBandAtCurrentPointer() {
        if (!this.hasValidPointer || this.isTransitionLocked) return null;

        this.raycaster.setFromCamera(this.pointerNDC, this.camera);
        const enabledTargets = this.getEnabledRaycastTargets();
        if (enabledTargets.length === 0) return null;

        const hits = this.raycaster.intersectObjects(enabledTargets, false);
        if (hits.length === 0) return null;

        let bestBand = null;
        let minCenterlineDist = Infinity;

        for (let i = 0; i < hits.length; i++) {
            const candidateBand = hits[i].object.userData.band;
            if (!candidateBand || !candidateBand.isFilterEnabled) continue;

            const { absTransDist } = candidateBand.extractLocalCoordinates(hits[i].point);
            if (absTransDist < minCenterlineDist) {
                minCenterlineDist = absTransDist;
                bestBand = candidateBand;
            }
        }

        return bestBand;
    }

    handleSceneClick() {
        if (this.isTransitionLocked) return;

        const targetBand =
            this.hoveredBand ||
            this.bandAtPointerDown ||
            this.pickBandAtCurrentPointer();

        if (targetBand && targetBand.isFilterEnabled) {
            this.selectBand(targetBand);
        }
    }

    selectBand(band) {
        if (!band || !band.isFilterEnabled || this.isTransitionLocked) return;

        if (this.selectedBand && this.selectedBand !== band) {
            const previousBand = this.selectedBand;
            previousBand.setSelected(false);
            if (this.hoveredBand !== previousBand) {
                previousBand.onCursorLeave();
            }
        }

        this.selectedBand = band;
        this.hoveredBand = band;
        this.isInfoPanelOpen = true;
        this.activePanelTab = "informacion";

        band.setSelected(true);
        this.infoPanel.openForBand(band, this.activePanelTab);
    }

    clearSelectedBand(closePanelToo = false) {
        if (this.selectedBand) {
            const prev = this.selectedBand;
            this.selectedBand = null;
            prev.setSelected(false);
            if (this.hoveredBand === prev) {
                this.hoveredBand = null;
            }
            prev.onCursorLeave();
            this.returningLockedBand = prev;
        }

        this.isInfoPanelOpen = false;
        this.domElement.classList.remove("is-hovering-band");

        if (closePanelToo && this.infoPanel && this.infoPanel.isOpen) {
            this.infoPanel.close(false);
        }
    }

    onFilterCategoryChanged() {
        if (this.selectedBand && !this.selectedBand.isFilterEnabled) {
            this.clearSelectedBand(true);
        }
        if (this.hoveredBand && !this.hoveredBand.isFilterEnabled) {
            this.releaseHoveredBand();
        }
    }

    hasActiveBandInteraction() {
        return this.hoveredBand !== null || this.selectedBand !== null;
    }

    releaseHoveredBand() {
        if (this.hoveredBand) {
            const prevHover = this.hoveredBand;
            this.hoveredBand = null;
            this.returningLockedBand = prevHover;
            prevHover.onCursorLeave();
        }
        this.domElement.classList.remove("is-hovering-band");
    }

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

    getEnabledRaycastTargets() {
        const targets = [];
        for (let i = 0; i < this.bands.length; i++) {
            const b = this.bands[i];
            if (b.isFilterEnabled) {
                targets.push(b.mesh, b.restColliderMesh);
            }
        }
        return targets;
    }

    update(isDraggingCamera) {
        if (this.isTransitionLocked) {
            this.domElement.classList.remove("is-hovering-band");
            return;
        }

        if (this.selectedBand && !this.selectedBand.isFilterEnabled) {
            this.clearSelectedBand(true);
        }

        if (!this.hasValidPointer || isDraggingCamera) {
            this.releaseHoveredBand();
            return;
        }

        if (this.returningLockedBand && this.returningLockedBand.state === "IDLE") {
            this.returningLockedBand = null;
        }

        this.raycaster.setFromCamera(this.pointerNDC, this.camera);

        if (this.hoveredBand) {
            if (!this.hoveredBand.isFilterEnabled) {
                this.releaseHoveredBand();
                return;
            }

            const band = this.hoveredBand;
            const hoverTargets = [band.mesh, band.restColliderMesh];
            const hoverHits = this.raycaster.intersectObjects(hoverTargets, false);

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

            if (hoverHits.length > 0 || stillInElasticCorridor) {
                const trackPoint = hasPlaneHit ? this.planeHitPoint : hoverHits[0].point;
                band.onCursorHover(trackPoint);
                this.domElement.classList.add("is-hovering-band");
                return;
            }

            this.releaseHoveredBand();
        }

        const enabledTargets = this.getEnabledRaycastTargets();
        if (enabledTargets.length === 0) {
            this.domElement.classList.remove("is-hovering-band");
            return;
        }

        const hits = this.raycaster.intersectObjects(enabledTargets, false);
        if (hits.length === 0) {
            this.domElement.classList.remove("is-hovering-band");
            return;
        }

        let bestBand = null;
        let bestPoint = null;
        let minCenterlineDist = Infinity;

        for (let i = 0; i < hits.length; i++) {
            const candidateBand = hits[i].object.userData.band;
            if (!candidateBand || !candidateBand.isFilterEnabled) continue;

            const { absTransDist } = candidateBand.extractLocalCoordinates(hits[i].point);
            if (absTransDist < minCenterlineDist) {
                minCenterlineDist = absTransDist;
                bestBand = candidateBand;
                bestPoint = hits[i].point;
            }
        }

        if (!bestBand) return;

        if (this.returningLockedBand && this.returningLockedBand.state === "RETURNING") {
            if (bestBand !== this.returningLockedBand) {
                const returnProgress =
                    this.returningLockedBand.returnElapsed /
                    Math.max(0.1, this.returningLockedBand.config.returnDuration);

                const inIntersection = this.isPointNearIntersection(bestPoint);
                if (returnProgress < 0.30 || inIntersection) {
                    this.domElement.classList.remove("is-hovering-band");
                    return;
                }
            }
            this.returningLockedBand = null;
        }

        this.hoveredBand = bestBand;
        this.hoveredBand.onCursorHover(bestPoint);
        this.domElement.classList.add("is-hovering-band");
    }
}

// ==========================================================
// 12. CONTROLADOR DE FILTROS CROMÁTICOS (Multimodelo)
// ==========================================================

class ChromaticFilterController {
    constructor(models, interactionManager) {
        this.models = models;
        this.interactionManager = interactionManager;

        this.activeCategories = {
            green: true,
            yellow: true,
            red: true
        };

        this.checkboxes = {
            green: document.getElementById("filter-green"),
            yellow: document.getElementById("filter-yellow"),
            red: document.getElementById("filter-red")
        };

        this.bindEvents();
    }

    bindEvents() {
        Object.keys(this.checkboxes).forEach((catKey) => {
            const input = this.checkboxes[catKey];
            if (!input) return;

            input.addEventListener("change", () => {
                this.activeCategories[catKey] = input.checked;
                this.applyFiltersToAllModels();
            });
        });
    }

    applyFiltersToAllModels() {
        this.models.forEach((model) => {
            model.bands.forEach((band) => {
                const record = band.getDataRecord();
                if (!record) return;

                const isEnabled = record.dominantKeys.some((k) => this.activeCategories[k]);
                band.setFilterEnabled(isEnabled);
            });
        });

        if (this.interactionManager) {
            this.interactionManager.onFilterCategoryChanged();
        }
    }
}

// ==========================================================
// 13. CONTROLADOR DE CÁMARA ORBITAL Y TRANSICIÓN CINEMATOGRÁFICA
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

        this.isPointerDown = false;
        this.isDragging = false;
        this.dragThresholdPx = 5;
        this.pointerDownPos = { x: 0, y: 0 };
        this.previousPointerPos = { x: 0, y: 0 };

        this.autoRotateBlend = 1.0;

        // Estado de transición cinematográfica entre modelos (Sección 3)
        this.transitionState = "NONE"; // 'NONE' | 'ASCENDING' | 'DESCENDING'
        this.transitionElapsed = 0;
        this.startTransAzimuth = 0;
        this.startTransPolar = 0;
        this.startTransRadius = 0;
        this.onHiddenSwapCallback = null;
        this.onTransitionCompleteCallback = null;

        this.bindEvents();
        this.updateCameraTransform();
    }

    bindEvents() {
        this.domElement.addEventListener("pointerdown", (e) => {
            if (e.button !== 0 || this.transitionState !== "NONE") return;
            this.isPointerDown = true;
            this.isDragging = false;
            this.pointerDownPos.x = e.clientX;
            this.pointerDownPos.y = e.clientY;
            this.previousPointerPos.x = e.clientX;
            this.previousPointerPos.y = e.clientY;
        });

        window.addEventListener("pointermove", (e) => {
            if (!this.isPointerDown || this.transitionState !== "NONE") return;

            if (!this.isDragging) {
                const distFromDown = Math.hypot(
                    e.clientX - this.pointerDownPos.x,
                    e.clientY - this.pointerDownPos.y
                );
                if (distFromDown < this.dragThresholdPx) return;
                this.isDragging = true;
                this.domElement.classList.add("is-dragging");
            }

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
            this.isPointerDown = false;
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
                if (this.transitionState !== "NONE") return;
                this.targetRadius = THREE.MathUtils.clamp(
                    this.targetRadius + e.deltaY * 0.035,
                    this.cfg.minRadius,
                    this.cfg.maxRadius
                );
            },
            { passive: false }
        );
    }

    // Inicia la transición cinematográfica en dos fases (Ascenso a contrapicado -> Cambio -> Descenso a picado)
    startModelTransition(onHiddenSwap, onComplete) {
        if (this.transitionState !== "NONE") return;

        this.isPointerDown = false;
        this.isDragging = false;
        this.domElement.classList.remove("is-dragging");

        this.transitionState = "ASCENDING";
        this.transitionElapsed = 0;

        this.startTransAzimuth = this.azimuthAngle;
        this.startTransPolar = this.polarAngle;
        this.startTransRadius = this.radius;

        this.onHiddenSwapCallback = onHiddenSwap;
        this.onTransitionCompleteCallback = onComplete;
    }

    update(dt, isBandInteractionActive) {
        // 1. Transición cinematográfica entre modelos
        if (this.transitionState === "ASCENDING") {
            this.transitionElapsed += dt;
            const dur1 = this.cfg.transitionAscentDuration;
            const t = Math.min(1.0, this.transitionElapsed / dur1);
            // Curva suave de aceleración que mantiene continuidad al llegar al cenit del giro
            const easeIn = t * t * (2.2 - 1.2 * t);

            // Giro ligero hacia la derecha y ascenso mientras la mirada sube a ángulo contrapicado (+Y alto)
            // De este modo la superficie queda completamente fuera del borde inferior del campo de visión
            this.azimuthAngle = this.startTransAzimuth + easeIn * 0.56;
            this.polarAngle = THREE.MathUtils.lerp(this.startTransPolar, 0.72, easeIn);
            this.radius = THREE.MathUtils.lerp(this.startTransRadius, this.cfg.initialRadius * 1.05, easeIn);
            this.target.set(0, easeIn * 124.0, 0);

            this.updateCameraTransform();

            if (t >= 1.0) {
                // La superficie está 100% fuera de cámara: ejecutar el cambio de modelo y esperar a que esté listo
                if (typeof this.onHiddenSwapCallback === "function") {
                    this.onHiddenSwapCallback();
                }
                this.transitionState = "DESCENDING";
                this.transitionElapsed = 0;
                this.startTransAzimuth = this.azimuthAngle;
            }
            return;
        }

        if (this.transitionState === "DESCENDING") {
            this.transitionElapsed += dt;
            const dur2 = this.cfg.transitionDescentDuration;
            const t = Math.min(1.0, this.transitionElapsed / dur2);
            // Desaceleración suave desde el lado izquierdo pasando de contrapicado a ángulo picado
            const easeOut = 1 - Math.pow(1 - t, 3.0);

            this.azimuthAngle = this.startTransAzimuth + easeOut * 0.56;
            this.polarAngle = THREE.MathUtils.lerp(0.72, this.cfg.initialPolarAngle, easeOut);
            this.radius = THREE.MathUtils.lerp(this.cfg.initialRadius * 1.05, this.cfg.initialRadius, easeOut);
            this.target.set(0, (1.0 - easeOut) * 124.0, 0);

            this.targetAzimuthAngle = this.azimuthAngle;
            this.targetPolarAngle = this.polarAngle;
            this.targetRadius = this.radius;

            this.updateCameraTransform();

            if (t >= 1.0) {
                this.target.set(0, 0, 0);
                this.transitionState = "NONE";
                this.autoRotateBlend = 0.25;
                this.updateCameraTransform();

                if (typeof this.onTransitionCompleteCallback === "function") {
                    this.onTransitionCompleteCallback();
                }
            }
            return;
        }

        // 2. Comportamiento orbital normal
        if (this.isDragging) {
            this.autoRotateBlend = 0;
        } else if (isBandInteractionActive) {
            const decel = 1 - Math.exp(-this.cfg.pauseDecelSpeed * dt);
            this.autoRotateBlend = THREE.MathUtils.lerp(this.autoRotateBlend, 0.0, decel);
        } else {
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
            this.radius * sinPhi * sinTheta,
            this.radius * cosPhi,
            this.radius * sinPhi * cosTheta
        );

        this.camera.lookAt(this.target);
    }
}

// ==========================================================
// 14. REGISTRO GLOBAL Y API MULTIMODELO
// ==========================================================

const SCENE_REGISTRY = {
    activeModelKey: "buenos-aires",
    models: {},
    infoPanel: null,
    filterController: null,
    interactionManager: null,
    cameraController: null,
    compositionModule: {
        computeGlobalBandTotalScale,
        computePrincipalBandHeight,
        computeSingleColorIntensity,
        computeProportionalChromaticMix,
        orderSecondaryColorGroups,
        distributeSecondaryBands
    },

    getActiveModel() {
        return this.models[this.activeModelKey] || null;
    },
    getBand(id) {
        const active = this.getActiveModel();
        return (active && active.bandsById.get(id)) || null;
    },
    getBandLabel(id) {
        const active = this.getActiveModel();
        return (active && active.bandLabelsById.get(id)) || null;
    },
    getDataRecord(id) {
        const active = this.getActiveModel();
        return active ? active.dataEngine.getRecord(id) : null;
    }
};

window.SCENE_REGISTRY = SCENE_REGISTRY;

// ==========================================================
// 15. INICIALIZACIÓN, ALTERNANCIA DE MODELOS Y RENDERIZADO
// ==========================================================

function initInteractiveScene() {
    const container = document.getElementById("scene-container");
    const switchBtn = document.getElementById("model-switch-btn");
    const switchLabel = document.getElementById("model-switch-label");
    const geoCityEl = document.getElementById("geo-city-label");
    const geoNeighborhoodEl = document.getElementById("geo-neighborhood-label");

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

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.94);
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

    const rimLight = new THREE.DirectionalLight(0x9fb3c8, 0.34);
    rimLight.position.set(-24, 20, -22);
    scene.add(rimLight);

    // 1. Construir ambos modelos 3D de manera independiente y precompilarlos en GPU
    const buenosAiresModel = createBuenosAiresModel(scene);
    const valparaisoModel = createValparaisoModel(scene);

    SCENE_REGISTRY.models["buenos-aires"] = buenosAiresModel;
    SCENE_REGISTRY.models["valparaiso"] = valparaisoModel;
    SCENE_REGISTRY.activeModelKey = "buenos-aires";

    // Precompilar shaders de ambos modelos para garantizar cambio instantáneo sin tirones
    valparaisoModel.rootGroup.visible = true;
    renderer.compile(scene, camera);
    valparaisoModel.rootGroup.visible = false;
    buenosAiresModel.rootGroup.visible = true;

    // 2. Actualizar texturas de texto 3D de ambos modelos una vez cargada la fuente Poppins
    let fontsReadyResolved = false;
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => {
            fontsReadyResolved = true;
            [buenosAiresModel, valparaisoModel].forEach((mdl) => {
                mdl.bandLabelsById.forEach((label) => label.rebuildFontTextures());
            });
        });
    } else {
        fontsReadyResolved = true;
    }

    // 3. Inicializar panel de información, cámara, interacción y filtros cromáticos
    let interactionManager = null;

    const infoPanel = new StreetInfoPanelController(() => {
        if (interactionManager) {
            interactionManager.clearSelectedBand(false);
        }
    });

    const cameraController = new OrbitalCameraController(camera, renderer.domElement);
    interactionManager = new BandInteractionManager(
        camera,
        renderer.domElement,
        buenosAiresModel.bands,
        infoPanel
    );
    const filterController = new ChromaticFilterController(
        [buenosAiresModel, valparaisoModel],
        interactionManager
    );

    SCENE_REGISTRY.infoPanel = infoPanel;
    SCENE_REGISTRY.interactionManager = interactionManager;
    SCENE_REGISTRY.filterController = filterController;
    SCENE_REGISTRY.cameraController = cameraController;

    // 4. Lógica del botón flotante superior para alternar entre Buenos Aires y Valparaíso
    if (switchBtn) {
        switchBtn.addEventListener("click", () => {
            if (cameraController.transitionState !== "NONE") return;

            const targetKey = SCENE_REGISTRY.activeModelKey === "buenos-aires"
                ? "valparaiso"
                : "buenos-aires";

            const outgoingModel = SCENE_REGISTRY.getActiveModel();
            const incomingModel = SCENE_REGISTRY.models[targetKey];
            if (!incomingModel) return;

            // Bloquear interacciones y cerrar panel activo antes de iniciar el ascenso
            switchBtn.disabled = true;
            interactionManager.setTransitionLocked(true);

            cameraController.startModelTransition(
                // Callback ejecutado cuando el mapa está 100% fuera del campo de visión (en ángulo contrapicado)
                () => {
                    outgoingModel.rootGroup.visible = false;
                    outgoingModel.bands.forEach((b) => b.resetToRest());

                    // Asegurar que las bandas, etiquetas y filtros del nuevo modelo estén 100% listos antes del descenso
                    filterController.applyFiltersToAllModels();
                    incomingModel.bands.forEach((b) => {
                        b.resetToRest();
                        if (b.label) b.label.updateTransform(camera, 0);
                    });
                    if (fontsReadyResolved) {
                        incomingModel.bandLabelsById.forEach((lbl) => lbl.refreshChromaticColors());
                    }

                    incomingModel.rootGroup.visible = true;
                    SCENE_REGISTRY.activeModelKey = targetKey;
                    interactionManager.setActiveModelBands(incomingModel.bands);

                    // Actualizar identidad geográfica y etiqueta del botón
                    if (geoCityEl) geoCityEl.textContent = incomingModel.city;
                    if (geoNeighborhoodEl) geoNeighborhoodEl.textContent = incomingModel.neighborhood;
                    if (switchLabel) switchLabel.textContent = incomingModel.switchButtonText;
                },
                // Callback ejecutado cuando la cámara finaliza el descenso y recupera el ángulo picado
                () => {
                    interactionManager.setTransitionLocked(false);
                    switchBtn.disabled = false;

                    // Reproducir el reflejo de luz tipo vidrio sobre toda la superficie del nuevo modelo
                    incomingModel.triggerSurfaceReflection();
                }
            );
        });
    }

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

        const activeModel = SCENE_REGISTRY.getActiveModel();

        interactionManager.update(cameraController.isDragging);
        cameraController.update(dt, interactionManager.hasActiveBandInteraction());

        if (activeModel) {
            let anyFilterTransition = false;
            const activeBands = activeModel.bands;

            for (let i = 0; i < activeBands.length; i++) {
                const b = activeBands[i];
                const targetVis = b.isFilterEnabled ? 1.0 : 0.0;
                if (Math.abs(b.filterVisibility - targetVis) > 0.001) {
                    anyFilterTransition = true;
                }
                b.update(dt, camera);
            }

            if (anyFilterTransition) {
                for (let i = 0; i < activeBands.length; i++) {
                    activeBands[i].applyVertexChromaticProfile();
                }
            }

            activeModel.surfaceReflection.update(dt);
        }

        renderer.render(scene, camera);
    }

    requestAnimationFrame(animate);
}

document.addEventListener("DOMContentLoaded", initInteractiveScene);
