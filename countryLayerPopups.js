export function attachCountryLayerPopups(countryLayers, map, l1TreeData) {
    // Récupère tous les items de toutes L1/L2
    let allItems = [];
    Object.values(l1TreeData).forEach(l2s => {
        Object.values(l2s).forEach(itemsArr => {
            allItems = allItems.concat(itemsArr);
        });
    });

    Object.keys(countryLayers).forEach(country => {
        const layer = countryLayers[country];
        layer.on('click', function () {
            const filtered = allItems.filter(item => item.countries && item.countries.includes(country));
            if (filtered.length === 0) {
                L.popup()
                    .setLatLng(layer.getBounds().getCenter())
                    .setContent(`<b>${country}</b><br>Aucun item`)
                    .openOn(map);
            } else {
                // Groupe par fonction
                const grouped = {};
                filtered.forEach(item => {
                    const func = item.function || "Autre";
                    if (!grouped[func]) grouped[func] = [];
                    grouped[func].push(item.name);
                });

                // Génère le contenu HTML
                let content = `<b>${country}</b><br>`;
                Object.keys(grouped).forEach(func => {
                    content += `<u>${func}</u><br>`;
                    content += grouped[func].map(name => `&nbsp;&nbsp;${name}`).join('<br>');
                    content += '<br>';
                });

                L.popup()
                    .setLatLng(layer.getBounds().getCenter())
                    .setContent(content)
                    .openOn(map);
            }
        });
    });
}