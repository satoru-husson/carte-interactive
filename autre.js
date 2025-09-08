// Exemple de structure de capabilities et sous-capabilities
const capabilitiesData = [
    {
        name: "Capability 1",
        subCapabilities: [
            { name: "Sous-cap 1", products: ["Produit A", "Produit B"] },
            { name: "Sous-cap 2", products: ["Produit C"] }
        ]
    },
    {
        name: "Capability 2",
        subCapabilities: [
            { name: "Sous-cap 3", products: ["Produit D"] },
            { name: "Sous-cap 4", products: ["Produit E", "Produit F"] }
        ]
    },
    // ... Ajoute en tout 6+ capabilities selon ton besoin
];

// Permet de suivre la sélection de sous-capabilities
let selectedSubCapabilities = [];

// Génération des boutons dans le HTML
function renderCapabilities() {
    const container = document.getElementById('capabilities-container');
    container.innerHTML = '';
    capabilitiesData.forEach((cap, i) => {
        const capDiv = document.createElement('div');
        capDiv.className = 'capability';
        capDiv.innerHTML = `<strong>${cap.name}</strong><br/>`;
        cap.subCapabilities.forEach((sub, j) => {
            const btn = document.createElement('button');
            btn.textContent = sub.name;
            btn.onclick = () => toggleSubCapability(cap.name, sub.name);
            btn.className = 'sub-cap-btn';
            capDiv.appendChild(btn);
        });
        container.appendChild(capDiv);
    });
}

// Sélection/déselection des sous-capabilities
function toggleSubCapability(capName, subName) {
    const key = `${capName}::${subName}`;
    const idx = selectedSubCapabilities.indexOf(key);
    if (idx === -1) {
        selectedSubCapabilities.push(key);
    } else {
        selectedSubCapabilities.splice(idx, 1);
    }
}

// Appel initial
window.addEventListener('DOMContentLoaded', () => {
    renderCapabilities();
});