const map = L.map('map').setView([20, 0], 2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// On suppose que capabilitiesData et selectedSubCapabilities sont globaux
function getSelectedProducts() {
    const products = [];
    selectedSubCapabilities.forEach(key => {
        const [capName, subName] = key.split('::');
        const cap = capabilitiesData.find(c => c.name === capName);
        if (cap) {
            const sub = cap.subCapabilities.find(s => s.name === subName);
            if (sub) {
                products.push(...sub.products);
            }
        }
    });
    // Retire les doublons
    return [...new Set(products)];
}

fetch('countries.geojson')
    .then(response => response.json())
    .then(data => {
        L.geoJSON(data, {
            onEachFeature: function (feature, layer) {
                layer.on('click', function () {
                    const products = getSelectedProducts();
                    let popupContent = `<strong>${feature.properties.name}</strong><br>`;
                    if (products.length === 0) {
                        popupContent += "Aucun produit sélectionné.";
                    } else {
                        popupContent += "<ul>";
                        products.forEach(p => {
                            popupContent += `<li>${p}</li>`;
                        });
                        popupContent += "</ul>";
                    }
                    layer.bindPopup(popupContent).openPopup();
                });
            }
        }).addTo(map);
    })
    .catch(err => console.error('Erreur chargement GeoJSON:', err));