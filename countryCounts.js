export function showCountryCounts(map, l1TreeData, l1, l2, countryLayers) {
    // Retire les anciens marqueurs
    if (!map._countryMarkers) map._countryMarkers = [];
    map._countryMarkers.forEach(marker => map.removeLayer(marker));
    map._countryMarkers = [];

    // Récupère tous les items pour ce L1/L2
    const items = l1TreeData[l1][l2];
    if (!items) return;

    // Liste des pays concernés
    const countriesSet = new Set();
    items.forEach(item => {
        item.countries.forEach(country => countriesSet.add(country));
    });

    countriesSet.forEach(country => {
        // Utilise le layer stocké pour ce pays
        const layer = countryLayers[country];
        if (layer) {
            // Calcule le nombre d'items pour ce pays
            const count = items.filter(it => it.countries.includes(country)).length;
            // Centre géométrique du pays
            const center = layer.getBounds().getCenter();

            // Crée un marker avec le nombre
            const marker = L.marker(center, {
                icon: L.divIcon({
                    className: 'country-count-icon',
                    html: `<div style="
                        background: #1a237e;
                        color: white;
                        border-radius: 50%;
                        width: 32px;
                        height: 32px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-weight: bold;
                        font-size: 1.1em;
                        border: 2px solid #fff;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                    ">${count}</div>`
                })
            }).addTo(map);

            map._countryMarkers.push(marker);
        }
    });
}