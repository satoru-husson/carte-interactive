export function showCountryCounts(map, l1TreeData, l1, l2) {
    // Retire l'ancien marker France si présent
    if (map._franceMarker) {
        map.removeLayer(map._franceMarker);
        map._franceMarker = null;
    }

    // Récupère tous les items pour ce L1/L2
    const items = l1TreeData[l1][l2];
    if (!items) return;

    // Calcule le nombre d'items pour la France
    const franceCount = items.filter(item => item.countries && item.countries.includes("France")).length;

    // Centre géographique de la France
    const franceCenter = [46.603354, 1.888334];

    // Crée un marker avec le nombre
    const marker = L.marker(franceCenter, {
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
            ">${franceCount}</div>`
        })
    }).addTo(map);

    map._franceMarker = marker;
}