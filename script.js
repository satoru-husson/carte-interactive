let capabilitiesData = [];
let countriesData = [];
let selectedCapability = null;
let selectedSubcapability = null;
let selectedProduct = null;
let geoJsonLayer = null;

// Initialisation de la carte
const map = L.map('map').setView([20, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Chargement des données
Promise.all([
    fetch('data.json').then(r => r.json()),
    fetch('countries.geojson').then(r => r.json())
]).then(([data, geojson]) => {
    capabilitiesData = data.capabilities;
    countriesData = geojson;
    renderCapabilities();
});

function renderCapabilities() {
    const container = document.getElementById('capabilities-container');
    container.innerHTML = '';
    capabilitiesData.forEach((cap, i) => {
        const capDiv = document.createElement('div');
        capDiv.className = 'capability';
        const capBtn = document.createElement('button');
        capBtn.textContent = cap.name;
        capBtn.onclick = () => selectCapability(i);
        capBtn.className = selectedCapability === i ? 'active' : '';
        capDiv.appendChild(capBtn);

        // Subcapabilities
        if (selectedCapability === i) {
            cap.subCapabilities.forEach((sub, j) => {
                const subBtn = document.createElement('button');
                subBtn.textContent = sub.name;
                subBtn.onclick = () => selectSubCapability(j);
                subBtn.className = 'sub-cap-btn' + (selectedSubcapability === j ? ' active' : '');
                capDiv.appendChild(subBtn);
            });
        }
        container.appendChild(capDiv);
    });
}

function selectCapability(idx) {
    selectedCapability = idx;
    selectedSubcapability = null;
    selectedProduct = null;
    renderCapabilities();
    clearMap();
}

function selectSubCapability(idx) {
    selectedSubcapability = idx;
    selectedProduct = null;
    renderCapabilities();
    showCountriesForSubcapability();
}

function clearMap() {
    if (geoJsonLayer) {
        map.removeLayer(geoJsonLayer);
        geoJsonLayer = null;
    }
}

function showCountriesForSubcapability() {
    clearMap();
    if (selectedCapability === null || selectedSubcapability === null) return;
    const cap = capabilitiesData[selectedCapability];
    const subcap = cap.subCapabilities[selectedSubcapability];

    geoJsonLayer = L.geoJSON(countriesData, {
        style: {
            color: "#3388ff",
            weight: 1,
            fillOpacity: 0.2
        },
        filter: function(feature) {
            const countryName = feature.properties.ADMIN;
            return subcap.productsByCountry[countryName] && subcap.productsByCountry[countryName].length > 0;
        },
        onEachFeature: function (feature, layer) {
            const countryName = feature.properties.ADMIN;
            const products = subcap.productsByCountry[countryName] || [];
            let popupHtml = `<strong>${countryName}</strong><br/>Produits:<ul>`;
            products.forEach(prod => {
                popupHtml += `<li><a href="#" class="product-link" data-product="${prod}">${prod}</a></li>`;
            });
            popupHtml += '</ul>';
            layer.bindPopup(popupHtml);
        }
    }).addTo(map);

    map.on('popupopen', function(e) {
        const links = document.querySelectorAll('.product-link');
        links.forEach(link => {
            link.onclick = function(ev) {
                ev.preventDefault();
                selectedProduct = this.getAttribute('data-product');
                highlightCountriesForProduct(selectedProduct);
            };
        });
    });
}

function highlightCountriesForProduct(product) {
    clearMap();
    const cap = capabilitiesData[selectedCapability];
    const subcap = cap.subCapabilities[selectedSubcapability];
    geoJsonLayer = L.geoJSON(countriesData, {
        style: function(feature) {
            const countryName = feature.properties.ADMIN;
            const products = subcap.productsByCountry[countryName] || [];
            if (products.includes(product)) {
                return { color: "#ff0000", weight: 2, fillOpacity: 0.5 };
            }
            return { color: "#3388ff", weight: 1, fillOpacity: 0.2 };
        },
        filter: function(feature) {
            const countryName = feature.properties.ADMIN;
            return subcap.productsByCountry[countryName] && subcap.productsByCountry[countryName].length > 0;
        },
        onEachFeature: function (feature, layer) {
            const countryName = feature.properties.ADMIN;
            const products = subcap.productsByCountry[countryName] || [];
            let popupHtml = `<strong>${countryName}</strong><br/>Produits:<ul>`;
            products.forEach(prod => {
                popupHtml += `<li>${prod}</li>`;
            });
            popupHtml += '</ul>';
            layer.bindPopup(popupHtml);
        }
    }).addTo(map);
}