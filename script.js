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
        pauseDecelSpeed: 6.0,    // Desaceleración suave al activar o seleccionar una banda
        resumeAccelSpeed: 2.2,   // Aceleración progresiva al finalizar la interacción
        dragSensitivity: 0.0065,
        dampingFactor: 10.0
    },
    bandDefaults: {
        width: 2.1,
        thickness: 0.24,
        maxElevation: 5.0,       // ~5 cm
        animationSpeed: 6.8,
        returnDuration: 1.0,     // ~1 segundo de retorno al salir del hover
        maxLateralOffset: 1.4,
        lateralSensitivity: 0.42,
        lengthSegments: 96,      // Alta resolución longitudinal para cruces e intersecciones
        hitboxWidthRatio: 0.86,  // Hitbox ajustada para evitar activaciones involuntarias
        filterTransitionSpeed: 3.4,
        silhouetteColor: 0x252830 // Silueta grisácea integrada con el fondo al desactivar filtro
    },
    chromatic: {
        minNormalizedIntensity: 0.24,
        maxNormalizedIntensity: 1.00,
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
        hoverScale: 1.22,             // Ligero aumento de tamaño durante el hover (Sección 7)
        orientationInDuration: 0.22,  // Giro hacia cámara en la fase inicial del hover
        orientationOutDuration: 0.82, // Regreso progresivo a orientación acostada al salir
        maxBloomIntensity: 0.40,
        disabledTextColor: 0x5c6270   // Tono gris neutro cuando la banda está filtrada
    }
};

// ==========================================================
// 2. BASE DE DATOS CROMÁTICA (16 REGISTROS INDIVIDUALES)
// ==========================================================

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

    // 3 Intertramos Horizontales (almacenados en el motor de datos sin ocupar recuadros vacíos)
    {
        id: "intertramo-h-uruguay-talcahuano",
        type: "intertramo_horizontal",
        name: "Entre Uruguay y Talcahuano",
        green: 1,
        yellow: 1,
        red: 0,
        betweenRows: [0, 1]
    },
    {
        id: "intertramo-h-talcahuano-libertad",
        type: "intertramo_horizontal",
        name: "Entre Talcahuano y Libertad",
        green: 0,
        yellow: 1,
        red: 0,
        betweenRows: [1, 2]
    },
    {
        id: "intertramo-h-libertad-cerrito",
        type: "intertramo_horizontal",
        name: "Entre Libertad y Cerrito",
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
        green: 0,
        yellow: 2,
        red: 2,
        betweenCols: [0, 1]
    },
    {
        id: "intertramo-v-lavalle-tucuman",
        type: "intertramo_vertical",
        name: "Entre Lavalle y Tucumán",
        green: 2,
        yellow: 0,
        red: 0,
        betweenCols: [1, 2]
    },
    {
        id: "intertramo-v-tucuman-viamonte",
        type: "intertramo_vertical",
        name: "Entre Tucumán y Viamonte",
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
        green: 2,
        yellow: 0,
        red: 0,
        referenceCol: 4
    }
];

const EXPECTED_GLOBAL_VALIDATION = {
    green: 81,
    yellow: 44,
    red: 16,
    total: 141
};

// ==========================================================
// 3. BASE DE DATOS CUALITATIVA Y ESTADÍSTICA POR CALLE (MARKDOWN)
// ==========================================================
// Vinculada por el ID único de cada banda.

const STREET_DETAILS_BY_ID = {
    "banda-av-corrientes": {
        id: "banda-av-corrientes",
        name: "Av. Corrientes",
        difficultyStats: {
            mayorDificultad: 9,
            menorDificultad: 1,
            mediaDificultad: 2.11
        },
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
        difficultyStats: {
            mayorDificultad: 5,
            menorDificultad: 5,
            mediaDificultad: 2.60
        },
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
        difficultyStats: {
            mayorDificultad: 4,
            menorDificultad: 5,
            mediaDificultad: 1.00
        },
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
        difficultyStats: {
            mayorDificultad: 4,
            menorDificultad: 1,
            mediaDificultad: 2.00
        },
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
        difficultyStats: {
            mayorDificultad: 3,
            menorDificultad: 12,
            mediaDificultad: 1.33
        },
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
        difficultyStats: {
            mayorDificultad: 3,
            menorDificultad: 2,
            mediaDificultad: 2.33
        },
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
        difficultyStats: {
            mayorDificultad: 3,
            menorDificultad: 5,
            mediaDificultad: 1.00
        },
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
        difficultyStats: {
            mayorDificultad: 0,
            menorDificultad: 11,
            mediaDificultad: null // Sin datos (0 menciones en Mayor dificultad)
        },
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
        difficultyStats: {
            mayorDificultad: 0,
            menorDificultad: 10,
            mediaDificultad: null // Sin datos (0 menciones en Mayor dificultad)
        },
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
// 4. MOTOR CROMÁTICO Y DE DATOS (ChromaticDataEngine)
// ==========================================================

class ChromaticDataEngine {
    constructor(rawRecords, streetDetailsMap) {
        this.recordsById = new Map();
        this.streetDetailsById = streetDetailsMap || {};
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
            isMixed: dominantKeys.length > 1,
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

    computeVisualColor(counts, dominantKeys, intensity) {
        if (dominantKeys.length === 1) {
            const singleColor = this.getCategoryColorAtIntensity(dominantKeys[0], intensity);
            return {
                primaryColor: singleColor,
                componentColors: [singleColor.clone()]
            };
        }

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

    // Calcula el color de intersección entre una banda horizontal y una vertical
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

    getStreetDetails(id) {
        return this.streetDetailsById[id] || null;
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

const DATA_ENGINE = new ChromaticDataEngine(INITIAL_RAW_RECORDS, STREET_DETAILS_BY_ID);

// ==========================================================
// 5. GENERADORES DE TEXTURAS CON TIPOGRAFÍA POPPINS Y HALO 3D
// ==========================================================

function createBandLabelTextures(text) {
    const canvasW = 512;
    const canvasH = 128;
    const aspect = canvasW / canvasH;
    const fontSpec = '600 50px "Poppins", "Segoe UI", sans-serif';

    // 1. Glifos blancos nítidos para coloreado dinámico en GPU
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

    // 2. Contorno trasero de contraste
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

    // 3. Resplandor trasero tipo Bloom sutil
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

// Textura suave para el halo de iluminación cromática alrededor de la banda en hover
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
    constructor(config, band, scene) {
        this.config = config;
        this.id = config.id;
        this.bandId = config.bandId;
        this.band = band;
        this.scene = scene;

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

        this.scene.add(this.group);
    }

    refreshChromaticColors() {
        const record = this.band.getDataRecord();
        if (!record) return;

        const { darkFill, rimColor } = DATA_ENGINE.computeInactiveLabelColors(record);
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

        // 1. Transición de orientación independiente de la elevación
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

        // 2. Crecimiento suave de escala durante el hover / selección (Sección 7)
        const targetScale = THREE.MathUtils.lerp(1.0, this.config.hoverScale, orientationBlend);
        this.currentScale = THREE.MathUtils.lerp(
            this.currentScale,
            targetScale,
            dt > 0 ? (1 - Math.exp(-14 * dt)) : 1
        );
        this.group.scale.setScalar(this.currentScale);

        // 3. Posición 3D sincronizada con la banda
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

        // 4. Orientación hacia la cámara activa por el camino más corto
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

        // 5. Color dinámico y transición hacia gris neutro cuando el filtro desactiva la banda
        if (record) {
            const visBlend = band.filterVisibility; // 1 = activa, 0 = silueta gris

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

            // Color cuando la banda está habilitada
            this.currentTextColor.copy(this.inactiveDarkColor).lerp(activeTextColor, orientationBlend);
            // Interpolar hacia gris neutro si la banda está desactivada por filtro
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
// 7. CLASE ELASTIC BAND (Filtros, Relieve Blanco, Destello y Brillo)
// ==========================================================

class ElasticBand {
    constructor(config, scene) {
        this.config = config;
        this.id = config.id;
        this.name = config.name;
        this.scene = scene;
        this.label = null;
        this.perpendicularBands = [];

        // Estado de interacción: 'IDLE' | 'HOVERED' | 'RETURNING'
        this.state = "IDLE";
        this.isHovered = false;
        this.isSelected = false;
        this.returnElapsed = 0;

        // Estado de filtro cromático (Fade Out / Fade In)
        this.isFilterEnabled = true;
        this.filterVisibility = 1.0;   // [0..1] 0 = silueta gris, 1 = color pleno
        this.fadeInGlowPulse = 0.0;    // Resplandor transitorio sutil al reactivar filtro

        // Estado visual de hover (relieve blanco + resplandor cromático)
        this.hoverVisualBlend = 0.0;

        // Animación de clic (Fase 1: reflejo de luz tipo vidrio; Fase 2: brillo continuo)
        this.clickFlashActive = false;
        this.clickFlashProgress = 0.0; // [0..1] barrido especular longitudinal
        this.continuousGlowPhase = 0.0;
        this.continuousGlowBlend = 0.0;

        // Deformación física
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
    }

    getDataRecord() {
        return DATA_ENGINE.getRecord(this.id);
    }

    setPerpendicularBands(perpBands) {
        this.perpendicularBands = perpBands;
        this.applyVertexChromaticProfile();
    }

    setFilterEnabled(enabled) {
        if (this.isFilterEnabled === enabled) return;
        this.isFilterEnabled = enabled;

        if (enabled) {
            // Activar pulso sutil de resplandor durante el Fade In (Sección 4)
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

    // Activa o desactiva la selección por clic (destello inicial + brillo continuo)
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

        // Halo 3D de iluminación cromática alrededor de la banda durante hover / selección
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

        // Hitbox de núcleo ajustada en reposo
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

        this.scene.add(this.auraMesh);
        this.scene.add(this.mesh);
        this.scene.add(this.restColliderMesh);

        this.applyVertexChromaticProfile();
    }

    // Evalúa colores por vértice: datos, filtros, intersecciones, relieve blanco en hover y destello de clic
    applyVertexChromaticProfile() {
        const record = this.getDataRecord();
        if (!record) return;

        const posAttr = this.geometry.attributes.position;
        const colorAttr = this.geometry.attributes.color;
        const rest = this.restPositions;

        const { orientation, width, thickness, length } = this.config;
        const isHorizontal = orientation === "horizontal";
        const halfBandW = width * 0.56;
        const halfLen = length * 0.5;

        const myVis = this.filterVisibility;

        // Precalcular cruces considerando qué bandas están activas según los filtros (Sección 4 y 6)
        const crossings = this.perpendicularBands.map((perpBand) => {
            const perpRecord = perpBand.getDataRecord();
            const coord = isHorizontal ? perpBand.config.position.x : perpBand.config.position.z;
            const perpVis = perpBand.filterVisibility;

            const interColor = isHorizontal
                ? DATA_ENGINE.computeIntersectionColor(record, perpRecord)
                : DATA_ENGINE.computeIntersectionColor(perpRecord, record);

            return {
                coord,
                interColor,
                perpColor: perpRecord.visualColor,
                perpVis
            };
        });

        const baseColor = record.visualColor;
        const tempColor = new THREE.Color();
        const crossTargetColor = new THREE.Color();

        // Modulación de brillo dinámico continuo cuando la banda está seleccionada (Sección 8)
        const pulseWave = Math.sin(this.continuousGlowPhase) * 0.5 + 0.5; // [0..1]
        const continuousBoost = this.continuousGlowBlend * (0.06 + 0.14 * pulseWave);

        for (let i = 0; i < posAttr.count; i++) {
            const idx3 = i * 3;
            const rx = rest[idx3];
            const ry = rest[idx3 + 1];
            const rz = rest[idx3 + 2];

            const uCoord = isHorizontal ? rx : rz;
            const vCoord = isHorizontal ? rz : rx;
            const s = THREE.MathUtils.clamp((uCoord + halfLen) / length, 0, 1);

            // 1. Color cromático propio de la banda
            if (record.isMixed && record.componentColors.length >= 2) {
                tempColor.copy(record.componentColors[0]).lerp(record.componentColors[1], s);
            } else {
                tempColor.copy(baseColor);
            }

            // 2. Transición hacia silueta grisácea si la banda está desactivada por filtro
            tempColor.lerp(this.silhouetteColor, 1.0 - myVis);

            // 3. Superposición cromática exclusivamente en los puntos de cruce reales (Sección 6)
            for (let c = 0; c < crossings.length; c++) {
                const cr = crossings[c];
                const dist = Math.abs(uCoord - cr.coord);
                if (dist < halfBandW * 1.32) {
                    const spatialT = 1 - THREE.MathUtils.smoothstep(dist, halfBandW * 0.52, halfBandW * 1.32);

                    // Si ambas bandas están activas -> color de intersección combinado;
                    // Si solo una está activa -> predomina la banda activa sin contribución artificial de la inactiva;
                    // Si ambas están desactivadas -> silueta neutra
                    const bothActive = myVis * cr.perpVis;
                    const onlyPerpActive = (1.0 - myVis) * cr.perpVis;

                    crossTargetColor.copy(tempColor);
                    crossTargetColor.lerp(cr.perpColor, onlyPerpActive);
                    crossTargetColor.lerp(cr.interColor, bothActive);

                    tempColor.lerp(crossTargetColor, spatialT);
                }
            }

            // 4. Relieve blanco definido durante hover conservando identidad cromática en bordes (Sección 5)
            if (this.hoverVisualBlend > 0.001 && myVis > 0.05) {
                const isTopFace = ry > thickness * 0.45 ? 1.0 : 0.35;
                const edgeRatio = THREE.MathUtils.clamp(Math.abs(vCoord) / (width * 0.5), 0, 1);
                // Centro superior blanco brillante, bordes laterales con fuerte identidad cromática y bisel
                const whiteReliefFactor =
                    this.hoverVisualBlend *
                    isTopFace *
                    (0.76 - 0.32 * Math.pow(edgeRatio, 1.6));

                tempColor.lerp(this.whiteReliefColor, whiteReliefFactor * myVis);
            }

            // 5. Fase 2 de clic: Brillo dinámico continuo suave respetando el color de la banda
            if (continuousBoost > 0.001 && myVis > 0.05) {
                tempColor.offsetHSL(0, 0.05 * this.continuousGlowBlend, continuousBoost * myVis);
            }

            // 6. Fase 1 de clic: Reflejo especular de luz tipo vidrio recorriendo la superficie (Sección 8)
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

            colorAttr.setXYZ(i, tempColor.r, tempColor.g, tempColor.b);
        }

        colorAttr.needsUpdate = true;

        // Actualizar emisión y halo cromático alrededor de la banda
        const activeAuraStrength = Math.max(
            this.hoverVisualBlend * 0.48,
            this.continuousGlowBlend * (0.28 + 0.24 * pulseWave),
            this.fadeInGlowPulse * 0.42
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

        // Si la banda está seleccionada mediante click, permanece elevada y activa
        // aunque el cursor se desplace hacia el panel de información
        if (this.isSelected) {
            this.state = "HOVERED";
            this.targetNormU = 0.5;
            return;
        }

        this.startReturnAnimation();
    }

    update(dt, camera) {
        let needsColorUpdate = false;

        // 1. Transición Fade In / Fade Out del filtro cromático (Sección 4)
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

        // 2. Transición suave del relieve blanco e iluminación en hover (Sección 5)
        // Cuando la banda pasa a estar seleccionada tras el destello, atenúa la capa blanca
        // para que domine la respiración cromática continua de su color propio (Sección 8)
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

        // 3. Animación de clic: Fase 1 (destello tipo vidrio) y Fase 2 (brillo dinámico continuo) (Sección 8)
        if (this.clickFlashActive) {
            this.clickFlashProgress += dt * 1.55; // ~0.65s de recorrido especular
            if (this.clickFlashProgress >= 1.0) {
                this.clickFlashProgress = 1.0;
                this.clickFlashActive = false;
            }
            needsColorUpdate = true;
        }

        const targetContGlow = (this.isSelected && this.isFilterEnabled) ? 1.0 : 0.0;
        if (this.isSelected || this.continuousGlowBlend > 0.001) {
            this.continuousGlowPhase += dt * 2.4; // Respiración lenta, fluida y sutil
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

        // 4. Física de elevación en hover / selección persistente y retorno en ~1s
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

        // Sincronizar geometría del halo cromático con la banda deformada
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

        this.geometry.computeVertexNormals();
        this.geometry.computeBoundingBox();
        this.geometry.computeBoundingSphere();
        this.applyVertexChromaticProfile();
    }
}

// ==========================================================
// 8. CONSTRUCCIÓN DE BANDAS Y SUPERFICIE BASE (Recuadros Limpios)
// ==========================================================

function buildSceneConfigurations() {
    const { width: surfW, depth: surfD, columns, rows, tabExtension } = SCENE_CONFIG.surface;
    const bandDef = SCENE_CONFIG.bandDefaults;
    const labelDef = SCENE_CONFIG.bandLabelDefaults;

    const halfW = surfW * 0.5;
    const halfD = surfD * 0.5;

    const horizontalLength = surfW + bandDef.width + tabExtension * 2;
    const verticalLength = surfD + bandDef.width + tabExtension * 2;

    const bandsConfig = [];
    const bandLabelsConfig = [];

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
                hoverScale: labelDef.hoverScale,
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
                hoverScale: labelDef.hoverScale,
                initialOrientation: { x: -Math.PI * 0.5, y: 0, z: Math.PI * 0.5 },
                orientationInDuration: labelDef.orientationInDuration,
                orientationOutDuration: labelDef.orientationOutDuration,
                maxBloomIntensity: labelDef.maxBloomIntensity,
                textSize: labelDef.textSize * 0.92
            });
        }
    });

    return { bandsConfig, bandLabelsConfig };
}

// Los espacios cuadrados vacíos permanecen limpios e independientes sin recibir datos de intersecciones (Sección 6)
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
// 9. ICONOS SVG PARA LAS ESTADÍSTICAS DEL PANEL (Sección 11)
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

// ==========================================================
// 10. CONTROLADOR DEL PANEL DE INFORMACIÓN DINÁMICO (Secciones 9-14)
// ==========================================================

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
        const details = DATA_ENGINE.getStreetDetails(band.id);
        if (!record || !details) return;

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

        // 1. Nombre de la calle con color vinculado a la identidad cromática de la banda
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

        // 2. Barra de distribución cromática calculada desde los valores absolutos
        this.renderChromaticDistribution(record);

        // 3. Primera sección: Datos cuantificables (Participación, Dificultad y Aspectos urbanos)
        this.renderQuantitativeStats(details);

        // 4. Segunda sección: Comentarios negativos y positivos
        this.renderComments(details);

        // 5. Datos secundarios: Otros aspectos mencionados y Emociones percibidas
        this.renderSecondaryMetadata(details);

        // Restablecer scroll interno al inicio y mostrar panel en sección «Información»
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

        // Si una categoría tiene 0%, no ocupa espacio visible en la barra
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

    renderQuantitativeStats(details) {
        const d = details.difficultyStats;
        const u = details.urbanAspects;

        // Diferenciar ceros reales de valores no disponibles (null -> "Sin datos")
        const mediaHtml = (d.mediaDificultad !== null && d.mediaDificultad !== undefined)
            ? `<span class="stat-value">${d.mediaDificultad.toFixed(2).replace(".", ",")}</span>`
            : `<span class="stat-value is-unavailable">Sin datos</span>`;

        this.difficultyStatsEl.innerHTML = `
            <div class="stat-row">
                <span class="stat-icon" aria-hidden="true">${PANEL_ICONS.mayorDificultad}</span>
                <span class="stat-label">Veces en mayor dificultad</span>
                <span class="stat-value">${d.mayorDificultad}</span>
            </div>
            <div class="stat-row">
                <span class="stat-icon" aria-hidden="true">${PANEL_ICONS.menorDificultad}</span>
                <span class="stat-label">Veces en menor dificultad</span>
                <span class="stat-value">${d.menorDificultad}</span>
            </div>
            <div class="stat-row">
                <span class="stat-icon" aria-hidden="true">${PANEL_ICONS.mediaDificultad}</span>
                <span class="stat-label">Media de dificultad percibida</span>
                ${mediaHtml}
            </div>
        `;

        const urbanItems = [
            { icon: PANEL_ICONS.veredas, label: "Estado de calles y veredas", data: u.estadoCallesVeredas },
            { icon: PANEL_ICONS.cruces, label: "Cruces y orientación", data: u.crucesOrientacion },
            { icon: PANEL_ICONS.ruido, label: "Ruido", data: u.ruido },
            { icon: PANEL_ICONS.iluminacion, label: "Iluminación", data: u.iluminacion },
            { icon: PANEL_ICONS.descanso, label: "Espacios de descanso", data: u.espaciosDescanso }
        ];

        this.urbanStatsEl.innerHTML = urbanItems
            .map((item) => {
                const si = item.data.si;
                const no = item.data.no;
                return `
                    <div class="stat-row">
                        <span class="stat-icon" aria-hidden="true">${item.icon}</span>
                        <span class="stat-label">${item.label}</span>
                        <span class="stat-yesno">
                            <span class="yn-pill yn-yes ${si > 0 ? "has-yes" : ""}">Sí: <strong>${si}</strong></span>
                            <span class="yn-pill yn-no">No: <strong>${no}</strong></span>
                        </span>
                    </div>
                `;
            })
            .join("");
    }

    renderComments(details) {
        const negList = details.comentariosNegativos || [];
        const posList = details.comentariosPositivos || [];

        if (negList.length === 0) {
            this.commentsNegEl.innerHTML = `<div class="comments-empty">No hay comentarios negativos registrados para esta calle.</div>`;
        } else {
            this.commentsNegEl.innerHTML = negList
                .map((text) => `<article class="comment-card comment-neg">“${text}”</article>`)
                .join("");
        }

        if (posList.length === 0) {
            this.commentsPosEl.innerHTML = `<div class="comments-empty">No hay comentarios positivos registrados para esta calle.</div>`;
        } else {
            this.commentsPosEl.innerHTML = posList
                .map((text) => `<article class="comment-card comment-pos">“${text}”</article>`)
                .join("");
        }
    }

    renderSecondaryMetadata(details) {
        const aspects = details.otrosAspectos || [];
        const emotions = details.emociones || [];

        if (aspects.length === 0) {
            this.otherAspectsEl.innerHTML = `<span class="comments-empty">Sin aspectos adicionales</span>`;
        } else {
            this.otherAspectsEl.innerHTML = aspects
                .map((item) => {
                    const ctxClass = item.contexto === "Mayor" ? "ctx-mayor" : "ctx-menor";
                    return `
                        <span class="meta-tag">
                            <span>${item.texto}</span>
                            <span class="meta-tag-ctx ${ctxClass}">${item.contexto}</span>
                        </span>
                    `;
                })
                .join("");
        }

        if (emotions.length === 0) {
            this.emotionsEl.innerHTML = `<span class="comments-empty">Sin emociones registradas</span>`;
        } else {
            this.emotionsEl.innerHTML = emotions
                .map((item) => {
                    const ctxClass = item.contexto === "Mayor" ? "ctx-mayor" : "ctx-menor";
                    return `
                        <span class="meta-tag">
                            <span>${item.texto}</span>
                            <span class="meta-tag-ctx ${ctxClass}">${item.contexto}</span>
                        </span>
                    `;
                })
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
    constructor(camera, domElement, bands, infoPanel) {
        this.camera = camera;
        this.domElement = domElement;
        this.bands = bands;
        this.infoPanel = infoPanel;

        // Estado centralizado de interacción:
        // - hoveredBand: banda actualmente bajo el cursor (previsualización)
        // - selectedBand: banda seleccionada mediante click (panel abierto)
        // - isInfoPanelOpen: estado de visibilidad del panel de información
        // - activePanelTab: sección activa del panel («informacion»)
        this.hoveredBand = null;
        this.selectedBand = null;
        this.isInfoPanelOpen = false;
        this.activePanelTab = "informacion";

        // Banda capturada en pointerdown para garantizar precisión del click
        this.bandAtPointerDown = null;
        // Banda en fase de retorno para evitar cambios involuntarios en intersecciones
        this.returningLockedBand = null;

        this.pointerDownPos = { x: 0, y: 0 };

        this.raycaster = new THREE.Raycaster();
        this.pointerNDC = new THREE.Vector2(-999, -999);
        this.hasValidPointer = false;
        this.horizontalPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
        this.planeHitPoint = new THREE.Vector3();

        this.bindEvents();
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
            // Al salir del lienzo 3D (por ejemplo, hacia el panel HTML), se libera solo el hover,
            // manteniendo intacta la banda seleccionada (selectedBand) y el panel abierto
            this.releaseHoveredBand();
        });

        this.domElement.addEventListener("pointerdown", (e) => {
            if (e.button !== 0) return;
            this.updatePointerNDCFromEvent(e);
            this.pointerDownPos.x = e.clientX;
            this.pointerDownPos.y = e.clientY;

            // Capturar la banda en hover o bajo el rayo en el instante exacto del pointerdown
            this.bandAtPointerDown = this.hoveredBand || this.pickBandAtCurrentPointer();
        });

        this.domElement.addEventListener("pointerup", (e) => {
            if (e.button !== 0) return;
            const moveDist = Math.hypot(
                e.clientX - this.pointerDownPos.x,
                e.clientY - this.pointerDownPos.y
            );

            // Si no hubo arrastre de cámara, procesar el click sobre la banda
            if (moveDist < 7) {
                this.updatePointerNDCFromEvent(e);
                this.handleSceneClick();
            }
            this.bandAtPointerDown = null;
        });
    }

    // Raycast directo en el instante del click para máxima fiabilidad
    pickBandAtCurrentPointer() {
        if (!this.hasValidPointer) return null;

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
        const targetBand =
            this.hoveredBand ||
            this.bandAtPointerDown ||
            this.pickBandAtCurrentPointer();

        if (targetBand && targetBand.isFilterEnabled) {
            this.selectBand(targetBand);
        }
    }

    // Selecciona una banda de forma exclusiva y abre/actualiza el panel en la sección «Información»
    selectBand(band) {
        if (!band || !band.isFilterEnabled) return;

        // Si había otra banda seleccionada previamente, deseleccionarla (regla de selección exclusiva)
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

    // Si se desactiva mediante filtro la categoría de la banda actualmente seleccionada o en hover
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
        // Si la banda seleccionada fue deshabilitada por filtro, cerrar y limpiar
        if (this.selectedBand && !this.selectedBand.isFilterEnabled) {
            this.clearSelectedBand(true);
        }

        // Si el cursor está fuera del canvas o arrastrando la cámara, liberar solo el hover
        // (la banda seleccionada permanece activa con su panel abierto)
        if (!this.hasValidPointer || isDraggingCamera) {
            this.releaseHoveredBand();
            return;
        }

        if (this.returningLockedBand && this.returningLockedBand.state === "IDLE") {
            this.returningLockedBand = null;
        }

        this.raycaster.setFromCamera(this.pointerNDC, this.camera);

        // 1. Mantener estabilidad sobre la banda actualmente en hover (hoveredBand)
        // para que cruzar una intersección a lo largo de la misma banda no cambie el hover por error
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

            // El cursor salió de la banda en hover
            this.releaseHoveredBand();
        }

        // 2. Detectar hover sobre cualquier banda habilitada (permitiendo previsualizar otra banda
        // y hacer click en ella para cambiar la selección activa del panel)
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
// 12. CONTROLADOR DE FILTROS CROMÁTICOS (Secciones 4 y 15)
// ==========================================================

class ChromaticFilterController {
    constructor(bands, interactionManager) {
        this.bands = bands;
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
                this.applyFiltersToBands();
            });
        });
    }

    applyFiltersToBands() {
        this.bands.forEach((band) => {
            const record = band.getDataRecord();
            if (!record) return;

            // Determinar si la categoría predominante de la banda está activa en los filtros
            const isEnabled = record.dominantKeys.some((k) => this.activeCategories[k]);
            band.setFilterEnabled(isEnabled);
        });

        if (this.interactionManager) {
            this.interactionManager.onFilterCategoryChanged();
        }
    }
}

// ==========================================================
// 13. CONTROLADOR DE CÁMARA ORBITAL SINCRONIZADO
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

        this.bindEvents();
        this.updateCameraTransform();
    }

    bindEvents() {
        this.domElement.addEventListener("pointerdown", (e) => {
            if (e.button !== 0) return;
            this.isPointerDown = true;
            this.isDragging = false;
            this.pointerDownPos.x = e.clientX;
            this.pointerDownPos.y = e.clientY;
            this.previousPointerPos.x = e.clientX;
            this.previousPointerPos.y = e.clientY;
        });

        window.addEventListener("pointermove", (e) => {
            if (!this.isPointerDown) return;

            if (!this.isDragging) {
                const distFromDown = Math.hypot(
                    e.clientX - this.pointerDownPos.x,
                    e.clientY - this.pointerDownPos.y
                );
                // Solo activar modo arrastre de cámara si supera el umbral de 5px,
                // evitando que un click normal cancele el hover sobre una banda
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
            this.target.x + this.radius * sinPhi * sinTheta,
            this.target.y + this.radius * cosPhi,
            this.target.z + this.radius * sinPhi * cosTheta
        );

        this.camera.lookAt(this.target);
    }
}

// ==========================================================
// 14. REGISTRO GLOBAL Y API DE DATOS
// ==========================================================

const SCENE_REGISTRY = {
    dataEngine: DATA_ENGINE,
    bandsById: new Map(),
    bandLabelsById: new Map(),
    infoPanel: null,
    filterController: null,
    interactionManager: null,

    getBand(id) {
        return this.bandsById.get(id) || null;
    },
    getBandLabel(id) {
        return this.bandLabelsById.get(id) || null;
    },
    getDataRecord(id) {
        return this.dataEngine.getRecord(id);
    },
    getStreetDetails(id) {
        return this.dataEngine.getStreetDetails(id);
    },

    updateRecordData(id, newCounts) {
        const updated = this.dataEngine.updateRecord(id, newCounts);
        if (!updated) return null;

        this.bandsById.forEach((band) => {
            band.applyVertexChromaticProfile();
            if (band.label) band.label.refreshChromaticColors();
        });

        if (this.filterController) {
            this.filterController.applyFiltersToBands();
        }

        return updated;
    }
};

window.SCENE_REGISTRY = SCENE_REGISTRY;

// ==========================================================
// 15. INICIALIZACIÓN Y BUCLE PRINCIPAL DE RENDERIZADO
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

    // 1. Construir superficie base 4:3 y recuadros vacíos limpios e independientes
    buildBaseSurfaceAndRecuadros(scene);

    // 2. Generar configuraciones de las 9 bandas y sus etiquetas
    const { bandsConfig, bandLabelsConfig } = buildSceneConfigurations();

    // 3. Construir las 9 bandas (4H + 5V)
    const bands = bandsConfig.map((cfg) => {
        const band = new ElasticBand(cfg, scene);
        SCENE_REGISTRY.bandsById.set(band.id, band);
        return band;
    });

    const horizontalBands = bands.filter((b) => b.config.orientation === "horizontal");
    const verticalBands = bands.filter((b) => b.config.orientation === "vertical");

    horizontalBands.forEach((hBand) => hBand.setPerpendicularBands(verticalBands));
    verticalBands.forEach((vBand) => vBand.setPerpendicularBands(horizontalBands));

    // 4. Construir y vincular etiquetas 3D con tipografía Poppins
    bandLabelsConfig.forEach((labelCfg) => {
        const band = SCENE_REGISTRY.getBand(labelCfg.bandId);
        if (band) {
            const label = new BandLabel3D(labelCfg, band, scene);
            band.label = label;
            SCENE_REGISTRY.bandLabelsById.set(label.id, label);
        }
    });

    // Actualizar texturas de texto 3D una vez que la fuente Poppins haya terminado de cargar
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => {
            SCENE_REGISTRY.bandLabelsById.forEach((label) => {
                label.rebuildFontTextures();
            });
        });
    }

    // 5. Inicializar panel de información, cámara, interacción y filtros cromáticos
    let interactionManager = null;

    const infoPanel = new StreetInfoPanelController(() => {
        if (interactionManager) {
            interactionManager.clearSelectedBand(false);
        }
    });

    const cameraController = new OrbitalCameraController(camera, renderer.domElement);
    interactionManager = new BandInteractionManager(camera, renderer.domElement, bands, infoPanel);
    const filterController = new ChromaticFilterController(bands, interactionManager);

    SCENE_REGISTRY.infoPanel = infoPanel;
    SCENE_REGISTRY.interactionManager = interactionManager;
    SCENE_REGISTRY.filterController = filterController;

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

        // Si alguna banda está en transición de filtro, actualizar cruces de bandas perpendiculares
        let anyFilterTransition = false;
        for (let i = 0; i < bands.length; i++) {
            const b = bands[i];
            const targetVis = b.isFilterEnabled ? 1.0 : 0.0;
            if (Math.abs(b.filterVisibility - targetVis) > 0.001) {
                anyFilterTransition = true;
            }
            b.update(dt, camera);
        }

        if (anyFilterTransition) {
            for (let i = 0; i < bands.length; i++) {
                bands[i].applyVertexChromaticProfile();
            }
        }

        renderer.render(scene, camera);
    }

    requestAnimationFrame(animate);
}

document.addEventListener("DOMContentLoaded", initInteractiveScene);
