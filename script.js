// Definição de unidades e suas conversões
const units = {
    temperature: {
        celsius: { name: 'Celsius (°C)', symbol: '°C', toBase: (v) => v, fromBase: (v) => v },
        fahrenheit: { name: 'Fahrenheit (°F)', symbol: '°F', toBase: (v) => (v - 32) * 5/9, fromBase: (v) => v * 9/5 + 32 },
        kelvin: { name: 'Kelvin (K)', symbol: 'K', toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 }
    },
    length: {
        meter: { name: 'Metro (m)', symbol: 'm', toBase: (v) => v, fromBase: (v) => v },
        kilometer: { name: 'Quilômetro (km)', symbol: 'km', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
        centimeter: { name: 'Centímetro (cm)', symbol: 'cm', toBase: (v) => v / 100, fromBase: (v) => v * 100 },
        millimeter: { name: 'Milímetro (mm)', symbol: 'mm', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
        mile: { name: 'Milha (mi)', symbol: 'mi', toBase: (v) => v * 1609.34, fromBase: (v) => v / 1609.34 },
        yard: { name: 'Jarda (yd)', symbol: 'yd', toBase: (v) => v * 0.9144, fromBase: (v) => v / 0.9144 },
        foot: { name: 'Pé (ft)', symbol: 'ft', toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
        inch: { name: 'Polegada (in)', symbol: 'in', toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 }
    },
    weight: {
        kilogram: { name: 'Quilograma (kg)', symbol: 'kg', toBase: (v) => v, fromBase: (v) => v },
        gram: { name: 'Grama (g)', symbol: 'g', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
        milligram: { name: 'Miligrama (mg)', symbol: 'mg', toBase: (v) => v / 1000000, fromBase: (v) => v * 1000000 },
        ton: { name: 'Tonelada (t)', symbol: 't', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
        pound: { name: 'Libra (lb)', symbol: 'lb', toBase: (v) => v * 0.453592, fromBase: (v) => v / 0.453592 },
        ounce: { name: 'Onça (oz)', symbol: 'oz', toBase: (v) => v * 0.0283495, fromBase: (v) => v / 0.0283495 }
    },
    volume: {
        liter: { name: 'Litro (L)', symbol: 'L', toBase: (v) => v, fromBase: (v) => v },
        milliliter: { name: 'Mililitro (mL)', symbol: 'mL', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
        cubicMeter: { name: 'Metro Cúbico (m³)', symbol: 'm³', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
        gallon: { name: 'Galão (gal)', symbol: 'gal', toBase: (v) => v * 3.78541, fromBase: (v) => v / 3.78541 },
        quart: { name: 'Quarto (qt)', symbol: 'qt', toBase: (v) => v * 0.946353, fromBase: (v) => v / 0.946353 },
        pint: { name: 'Pinta (pt)', symbol: 'pt', toBase: (v) => v * 0.473176, fromBase: (v) => v / 0.473176 },
        cup: { name: 'Xícara (cup)', symbol: 'cup', toBase: (v) => v * 0.236588, fromBase: (v) => v / 0.236588 }
    }
};

// Elementos DOM
const categoryBtns = document.querySelectorAll('.category-btn');
const fromValue = document.getElementById('fromValue');
const toValue = document.getElementById('toValue');
const fromUnit = document.getElementById('fromUnit');
const toUnit = document.getElementById('toUnit');
const swapBtn = document.getElementById('swapBtn');
const resultDisplay = document.getElementById('resultDisplay');
const quickConversions = document.getElementById('quickConversions');

// Estado atual
let currentCategory = 'temperature';

// Inicialização
function init() {
    loadUnits(currentCategory);
    setupEventListeners();
    updateQuickConversions();
}

// Configurar event listeners
function setupEventListeners() {
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.dataset.category;
            changeCategory(category);
        });
    });

    fromValue.addEventListener('input', convert);
    fromUnit.addEventListener('change', convert);
    toUnit.addEventListener('change', convert);
    swapBtn.addEventListener('click', swapUnits);

    // Animação ao focar no input
    fromValue.addEventListener('focus', () => {
        fromValue.parentElement.style.transform = 'scale(1.02)';
    });
    fromValue.addEventListener('blur', () => {
        fromValue.parentElement.style.transform = 'scale(1)';
    });
}

// Mudar categoria
function changeCategory(category) {
    currentCategory = category;
    
    // Atualizar botões ativos
    categoryBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.category === category);
    });

    // Carregar novas unidades
    loadUnits(category);
    convert();
    updateQuickConversions();
}

// Carregar unidades no select
function loadUnits(category) {
    const unitsList = units[category];
    fromUnit.innerHTML = '';
    toUnit.innerHTML = '';

    let index = 0;
    for (const [key, unit] of Object.entries(unitsList)) {
        const option1 = document.createElement('option');
        option1.value = key;
        option1.textContent = unit.name;
        fromUnit.appendChild(option1);

        const option2 = document.createElement('option');
        option2.value = key;
        option2.textContent = unit.name;
        toUnit.appendChild(option2);

        if (index === 1) {
            toUnit.value = key;
        }
        index++;
    }
}

// Converter valores
function convert() {
    const value = parseFloat(fromValue.value);
    
    if (isNaN(value) || fromValue.value === '') {
        toValue.value = '';
        resultDisplay.innerHTML = '<div class="result-text">Digite um valor para converter</div>';
        updateQuickConversions();
        return;
    }

    const fromUnitKey = fromUnit.value;
    const toUnitKey = toUnit.value;
    
    const fromUnitObj = units[currentCategory][fromUnitKey];
    const toUnitObj = units[currentCategory][toUnitKey];

    // Converter para unidade base e depois para unidade de destino
    const baseValue = fromUnitObj.toBase(value);
    const result = toUnitObj.fromBase(baseValue);

    // Formatar resultado
    const formattedResult = formatNumber(result);
    toValue.value = formattedResult;

    // Atualizar display de resultado
    resultDisplay.innerHTML = `
        <div class="result-text calculated">
            ${formatNumber(value)} ${fromUnitObj.symbol} = ${formattedResult} ${toUnitObj.symbol}
        </div>
    `;

    updateQuickConversions();
}

// Trocar unidades
function swapUnits() {
    const tempUnit = fromUnit.value;
    fromUnit.value = toUnit.value;
    toUnit.value = tempUnit;

    const tempValue = fromValue.value;
    fromValue.value = toValue.value;
    
    convert();
}

// Atualizar conversões rápidas
function updateQuickConversions() {
    const value = parseFloat(fromValue.value);
    
    if (isNaN(value) || fromValue.value === '') {
        quickConversions.innerHTML = '<p style="text-align: center; color: #6c757d;">Digite um valor para ver conversões rápidas</p>';
        return;
    }

    const fromUnitKey = fromUnit.value;
    const fromUnitObj = units[currentCategory][fromUnitKey];
    const baseValue = fromUnitObj.toBase(value);

    let html = '';
    for (const [key, unit] of Object.entries(units[currentCategory])) {
        if (key !== fromUnitKey) {
            const convertedValue = unit.fromBase(baseValue);
            html += `
                <div class="quick-card">
                    <div class="quick-value">${formatNumber(convertedValue)}</div>
                    <div class="quick-label">${unit.symbol}</div>
                </div>
            `;
        }
    }

    quickConversions.innerHTML = html;
}

// Formatar número
function formatNumber(num) {
    if (Math.abs(num) < 0.01 && num !== 0) {
        return num.toExponential(4);
    }
    
    if (Math.abs(num) >= 1000000) {
        return num.toExponential(4);
    }

    // Arredondar para até 6 casas decimais
    const rounded = Math.round(num * 1000000) / 1000000;
    
    // Remover zeros desnecessários
    return rounded.toString().replace(/\.?0+$/, '');
}

// Iniciar aplicação
init();