export function attachCountryPopups(countryLayers, map, l1TreeData, getSelectedL1, getSelectedL2) {
    Object.keys(countryLayers).forEach(countryName => {
        const layer = countryLayers[countryName];
        layer.on('click', function () {
            const selectedL1 = getSelectedL1();
            const selectedL2 = getSelectedL2();
            if (!selectedL1 || !selectedL2) return;
            const items = l1TreeData[selectedL1][selectedL2] || [];
            const filtered = items.filter(item => item.countries && item.countries.includes(countryName));
            if (filtered.length === 0) {
                L.popup()
                    .setLatLng(layer.getBounds().getCenter())
                    .setContent(`<b>${countryName}</b><br>Aucun item`)
                    .openOn(map);
            } else {
                const content = filtered.map(item => item.name).join('<br>');
                L.popup()
                    .setLatLng(layer.getBounds().getCenter())
                    .setContent(`<b>${countryName}</b><br>${content}`)
                    .openOn(map);
            }
        });
    });
}