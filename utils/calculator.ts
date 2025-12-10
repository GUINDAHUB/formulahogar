export const TASAS_ITP: Record<string, number> = {
    "Andalucía": 0.07,
    "Aragón": 0.09,
    "Asturias": 0.09,
    "Islas Baleares": 0.11,
    "Canarias": 0.065,
    "Cantabria": 0.09,
    "Castilla-La Mancha": 0.09,
    "Castilla y León": 0.09,
    "Cataluña": 0.11,
    "Ceuta": 0.06,
    "Madrid": 0.06,
    "Comunidad Valenciana": 0.11,
    "Extremadura": 0.10,
    "Galicia": 0.08,
    "La Rioja": 0.07,
    "Melilla": 0.06,
    "Murcia": 0.08,
    "Navarra": 0.06,
    "País Vasco": 0.07
};

export const COSTES_FIJOS = {
    NOTARIA: 0.01,
    COMISION: 0.03
};

export const TABLA_ADELANTOS: Record<number, number> = {
    12: 0.80,
    24: 0.70,
    36: 0.70,
    48: 0.65,
    60: 0.60
};

export const RENTABILIDAD_BRUTA = 0.05;

export interface CalculationInput {
    price: number;
    community: string;
    age: number;
}

export interface CalculationResult {
    traditionalDownPayment: number;
    formulaHogarDownPayment: number;
    savings: number;
    monthlyPayment: number;
    months: number;
}

export const calculateResults = (data: CalculationInput): CalculationResult => {
    const tasaItp = TASAS_ITP[data.community] || 0.06;
    
    // Base calculations
    const porcentajeGastosTotal = tasaItp + COSTES_FIJOS.NOTARIA + COSTES_FIJOS.COMISION;
    const precioTotal = data.price * (1 + porcentajeGastosTotal);
    
    // Bank Entry (Depends on age)
    const porcentajeEntradaBanco = data.age < 30 ? 0.10 : 0.20;
    const entradaBanco = precioTotal * porcentajeEntradaBanco;

    // Rentabilidad
    const rentabilidadBrutaAlquiler = data.price * RENTABILIDAD_BRUTA;
    const rentabilidadMensual = rentabilidadBrutaAlquiler / 12;
    const garantia = rentabilidadMensual;

    // Optimization Algorithm
    let mejorOpcion = null;
    let menorEntradaEncontrada = Infinity;
    const listaOpciones = [12, 24, 36, 48, 60];

    for (const meses of listaOpciones) {
        const coeficiente = TABLA_ADELANTOS[meses];
        const adelantoCalc = (meses * coeficiente * rentabilidadMensual) - garantia;
        const entradaFhCalc = entradaBanco - adelantoCalc;

        if (entradaFhCalc >= 0) {
            if (entradaFhCalc < menorEntradaEncontrada) {
                menorEntradaEncontrada = entradaFhCalc;
                mejorOpcion = {
                    meses,
                    adelanto: adelantoCalc,
                    entradaFh: entradaFhCalc
                };
            }
        }
    }

    // Fallback
    if (!mejorOpcion) {
        const meses = 12;
        const adelantoCalc = (meses * TABLA_ADELANTOS[meses] * rentabilidadMensual) - garantia;
        mejorOpcion = {
            meses,
            adelanto: adelantoCalc,
            entradaFh: entradaBanco - adelantoCalc
        };
    }

    return {
        traditionalDownPayment: Math.round(entradaBanco),
        formulaHogarDownPayment: Math.round(mejorOpcion.entradaFh),
        savings: Math.round(entradaBanco - mejorOpcion.entradaFh),
        monthlyPayment: Math.round(rentabilidadMensual),
        months: mejorOpcion.meses
    };
};

