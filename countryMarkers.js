export function showCountryMarkers(map, items, countryLayers) {
    // Retire les anciens marqueurs
    if (window.countryMarkers) {
        window.countryMarkers.forEach(marker => map.removeLayer(marker));
    }
    window.countryMarkers = [];

    // Pour chaque pays concerné, affiche un marker au centre
    const countriesSet = new Set();
    items.forEach(item => {
        if (item.countries) {
            item.countries.forEach(country => countriesSet.add(country));
        }
    });

    countriesSet.forEach(country => {
        const layer = countryLayers[country];
        if (!layer) return;
        // Calcule le nombre d'items pour ce pays
        const count = items.filter(it => it.countries && it.countries.includes(country)).length;
        if (count === 0) return;
        // Centre géométrique du pays
        const center = layer.getBounds().getCenter();
        // Crée le marker interactif
        const marker = L.marker(center, {
            icon: L.divIcon({
                className: 'country-count-icon',
                html: `<div style="
                    background: #388e3c;
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
                    cursor: pointer;
                ">${count}</div>`,
                iconSize: [32, 32],
                iconAnchor: [16, 16]
            }),
            interactive: true
        }).addTo(map);

        // Affiche la popup avec la liste des noms d'applications pour ce pays
        marker.on('click', function () {
            const content = items
                .filter(it => it.countries && it.countries.includes(country))
                .map(it => it.name)
                .join('<br>');
            L.popup()
                .setLatLng(center)
                .setContent(`<b>${country}</b><br>${content}`)
                .openOn(map);
        });

        window.countryMarkers.push(marker);
    });
}