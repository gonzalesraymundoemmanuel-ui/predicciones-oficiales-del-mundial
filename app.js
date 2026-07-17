// Base de datos inicial de las selecciones
const INITIAL_TEAMS = {
    "england": {
        name: "Inglaterra",
        flag: "GB-ENG", // Representación interna o SVG
        color: "#E0000F",
        accentColor: "rgba(224, 0, 15, 0.15)",
        matches: 5,
        goalsScored: 11,
        goalsConceded: 4,
        possession: 58,
        shotsOnTarget: 24,
        keyPlayers: "Jude Bellingham, Harry Kane, Phil Foden",
        form: ["W", "D", "W", "W", "L"],
        image: "assets/bellingham.jpg"
    },
    "france": {
        name: "Francia",
        flag: "FR",
        color: "#002395",
        accentColor: "rgba(0, 35, 149, 0.15)",
        matches: 5,
        goalsScored: 10,
        goalsConceded: 3,
        possession: 55,
        shotsOnTarget: 28,
        keyPlayers: "Kylian Mbappé, Antoine Griezmann, Ousmane Dembélé",
        form: ["W", "W", "L", "W", "D"],
        image: "assets/mbappe.jpg"
    },
    "spain": {
        name: "España",
        flag: "ES",
        color: "#C60B1E",
        accentColor: "rgba(198, 11, 30, 0.15)",
        matches: 5,
        goalsScored: 14,
        goalsConceded: 2,
        possession: 62,
        shotsOnTarget: 35,
        keyPlayers: "Lamine Yamal, Rodri, Nico Williams",
        form: ["W", "W", "W", "W", "W"],
        image: "assets/yamal.jpg"
    },
    "argentina": {
        name: "Argentina",
        flag: "AR",
        color: "#74ACDF",
        accentColor: "rgba(116, 172, 223, 0.15)",
        matches: 5,
        goalsScored: 12,
        goalsConceded: 1,
        possession: 60,
        shotsOnTarget: 30,
        keyPlayers: "Lionel Messi, Lautaro Martínez, Alexis Mac Allister",
        form: ["W", "W", "W", "D", "W"],
        image: "assets/messi.jpg"
    }
};

// Cargar de LocalStorage o inicializar
let teams = JSON.parse(localStorage.getItem('mundial_teams')) || INITIAL_TEAMS;

// Guardar en LocalStorage
function saveTeams() {
    localStorage.setItem('mundial_teams', JSON.stringify(teams));
}

// Inicialización de la aplicación
document.addEventListener("DOMContentLoaded", () => {
    initApp();
    setupNavigation();
    setupForms();
    setupFileHandlers();
    renderAll();
});

function initApp() {
    console.log("Mundial Predictor Inicializado.");
}

// Navegación SPA
function setupNavigation() {
    const navLinks = document.querySelectorAll("nav a, .nav-btn");
    const sections = document.querySelectorAll("main section");

    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const targetId = link.getAttribute("href").substring(1);
            
            // Activar link
            navLinks.forEach(l => l.classList.remove("active"));
            link.classList.add("active");

            // Activar sección
            sections.forEach(section => {
                if (section.id === targetId) {
                    section.classList.add("active");
                    section.scrollIntoView({ behavior: "smooth" });
                } else {
                    section.classList.remove("active");
                }
            });

            // Si es la sección de estadísticas o predicciones, refrescar gráficos
            if (targetId === "analisis") {
                renderCharts();
            }
            if (targetId === "predicciones") {
                generateWorldCupFinalPredictions();
            }
        });
    });
}

// Renderizar todo
function renderAll() {
    renderHome();
    renderTeamsSection();
    renderComparisonOptions();
    generateWorldCupFinalPredictions();
}

// Render Home
function renderHome() {
    const teamsGrid = document.getElementById("home-teams-grid");
    if (!teamsGrid) return;
    
    teamsGrid.innerHTML = "";
    
    Object.keys(teams).forEach(key => {
        const team = teams[key];
        const card = document.createElement("div");
        card.className = "team-card glassmorphic";
        card.style.borderTop = `4px solid ${team.color}`;
        
        card.innerHTML = `
            <div class="card-image-container">
                <img src="${team.image}" alt="${team.keyPlayers.split(',')[0]}" class="card-player-img" onerror="this.src='https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=500'">
                <div class="card-flag-overlay">${getFlagSvg(key)}</div>
            </div>
            <div class="card-body">
                <h3>${team.name}</h3>
                <p class="featured-player">⭐ <strong>Estrella:</strong> ${team.keyPlayers.split(',')[0]}</p>
                <div class="card-mini-stats">
                    <div><span>PJ</span><strong>${team.matches}</strong></div>
                    <div><span>GF</span><strong>${team.goalsScored}</strong></div>
                    <div><span>GC</span><strong>${team.goalsConceded}</strong></div>
                    <div><span>POS</span><strong>${team.possession}%</strong></div>
                </div>
                <div class="form-container">
                    <span class="form-label">Forma:</span>
                    <div class="form-badges">
                        ${team.form.map(f => `<span class="badge badge-${f.toLowerCase()}">${f}</span>`).join('')}
                    </div>
                </div>
                <a href="#selecciones" class="btn btn-secondary card-link-btn" onclick="document.querySelector('a[href=\\'#selecciones\\']').click()">Ver Detalles</a>
            </div>
        `;
        teamsGrid.appendChild(card);
    });
}

// Render Selecciones Detalle
function renderTeamsSection() {
    const container = document.getElementById("detailed-teams-container");
    if (!container) return;
    
    container.innerHTML = "";
    
    Object.keys(teams).forEach(key => {
        const team = teams[key];
        const panel = document.createElement("div");
        panel.className = "detailed-team-panel glassmorphic";
        panel.style.boxShadow = `0 8px 32px 0 ${team.accentColor}`;
        
        panel.innerHTML = `
            <div class="panel-header">
                <div class="panel-title-area">
                    <div class="panel-flag">${getFlagSvg(key)}</div>
                    <h2>${team.name}</h2>
                </div>
                <div class="panel-color-indicator" style="background-color: ${team.color}"></div>
            </div>
            <div class="panel-content">
                <div class="panel-stats">
                    <div class="stat-item">
                        <span class="stat-name">Partidos Disputados</span>
                        <span class="stat-val">${team.matches}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-name">Goles Anotados</span>
                        <span class="stat-val text-green">${team.goalsScored}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-name">Goles Recibidos</span>
                        <span class="stat-val text-red">${team.goalsConceded}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-name">Posesión Promedio</span>
                        <span class="stat-val">${team.possession}%</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-name">Tiros a Portería</span>
                        <span class="stat-val">${team.shotsOnTarget}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-name">Precisión de Tiros</span>
                        <span class="stat-val">${((team.shotsOnTarget / (team.goalsScored || 1)) * 10).toFixed(1)}%</span>
                    </div>
                </div>
                <div class="panel-desc">
                    <div class="player-highlight">
                        <img src="${team.image}" alt="Jugador representativo" class="player-highlight-img" onerror="this.src='https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=500'">
                        <div>
                            <h4>Jugadores Destacados</h4>
                            <p>${team.keyPlayers}</p>
                        </div>
                    </div>
                    <div class="form-trend">
                        <h4>Rendimiento Reciente (Últimos 5 Partidos)</h4>
                        <div class="form-badges large">
                            ${team.form.map(f => `<span class="badge badge-${f.toLowerCase()}">${f}</span>`).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(panel);
    });
}

// Cargar selectores para el comparador estadístico
function renderComparisonOptions() {
    const selectA = document.getElementById("compare-team-a");
    const selectB = document.getElementById("compare-team-b");
    const predictA = document.getElementById("predict-team-a");
    const predictB = document.getElementById("predict-team-b");
    
    if (!selectA || !selectB) return;
    
    const teamKeys = Object.keys(teams);
    
    // Rellenar selectores
    [selectA, selectB, predictA, predictB].forEach(sel => {
        if (!sel) return;
        const currentVal = sel.value;
        sel.innerHTML = "";
        teamKeys.forEach(key => {
            const opt = document.createElement("option");
            opt.value = key;
            opt.textContent = teams[key].name;
            sel.appendChild(opt);
        });
        if (currentVal && teamKeys.includes(currentVal)) {
            sel.value = currentVal;
        }
    });

    // Valores iniciales por defecto diferentes
    if (selectA.value === selectB.value && teamKeys.length > 1) {
        selectB.value = teamKeys[1];
    }
    if (predictA && predictB && predictA.value === predictB.value && teamKeys.length > 1) {
        predictB.value = teamKeys[1];
    }
}

// Render de Gráficos Comparativos (Usando Chart.js si se carga correctamente, si no SVG)
let myChart = null;
function renderCharts() {
    const teamAKey = document.getElementById("compare-team-a").value;
    const teamBKey = document.getElementById("compare-team-b").value;
    
    const teamA = teams[teamAKey];
    const teamB = teams[teamBKey];
    
    if (!teamA || !teamB) return;

    // Actualizar nombres en UI
    document.getElementById("compare-name-a").textContent = teamA.name;
    document.getElementById("compare-name-b").textContent = teamB.name;
    document.getElementById("compare-flag-a").innerHTML = getFlagSvg(teamAKey);
    document.getElementById("compare-flag-b").innerHTML = getFlagSvg(teamBKey);

    // Comparativa numérica simple
    document.getElementById("stat-compare-goals-a").textContent = teamA.goalsScored;
    document.getElementById("stat-compare-goals-b").textContent = teamB.goalsScored;
    document.getElementById("stat-compare-conceded-a").textContent = teamA.goalsConceded;
    document.getElementById("stat-compare-conceded-b").textContent = teamB.goalsConceded;
    document.getElementById("stat-compare-poss-a").textContent = `${teamA.possession}%`;
    document.getElementById("stat-compare-poss-b").textContent = `${teamB.possession}%`;
    document.getElementById("stat-compare-shots-a").textContent = teamA.shotsOnTarget;
    document.getElementById("stat-compare-shots-b").textContent = teamB.shotsOnTarget;

    // Destacar el mejor con una clase
    compareAndHighlight("stat-compare-goals-a", "stat-compare-goals-b", teamA.goalsScored, teamB.goalsScored, true);
    compareAndHighlight("stat-compare-conceded-a", "stat-compare-conceded-b", teamA.goalsConceded, teamB.goalsConceded, false); // Menos es mejor
    compareAndHighlight("stat-compare-poss-a", "stat-compare-poss-b", teamA.possession, teamB.possession, true);
    compareAndHighlight("stat-compare-shots-a", "stat-compare-shots-b", teamA.shotsOnTarget, teamB.shotsOnTarget, true);

    // Gráfico de Barras Chart.js
    const ctx = document.getElementById("comparisonChart");
    if (!ctx) return;
    
    const data = {
        labels: ['Goles Anotados', 'Goles Recibidos', 'Posesión (%)', 'Tiros a Portería'],
        datasets: [
            {
                label: teamA.name,
                data: [teamA.goalsScored, teamA.goalsConceded, teamA.possession, teamA.shotsOnTarget],
                backgroundColor: teamA.color,
                borderColor: '#ffffff',
                borderWidth: 1
            },
            {
                label: teamB.name,
                data: [teamB.goalsScored, teamB.goalsConceded, teamB.possession, teamB.shotsOnTarget],
                backgroundColor: teamB.color,
                borderColor: '#ffffff',
                borderWidth: 1
            }
        ]
    };

    if (myChart) {
        myChart.destroy();
    }

    if (typeof Chart !== 'undefined') {
        myChart = new Chart(ctx, {
            type: 'bar',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#ffffff',
                            font: { family: 'Outfit', size: 14 }
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: { color: '#e0e0e0', font: { family: 'Inter' } },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    },
                    y: {
                        ticks: { color: '#e0e0e0', font: { family: 'Inter' } },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        beginAtZero: true
                    }
                }
            }
        });
    } else {
        // Fallback si Chart.js no carga
        ctx.style.display = 'none';
        const fallback = document.getElementById("chart-fallback");
        if (fallback) {
            fallback.style.display = 'block';
            fallback.innerHTML = `
                <div style="padding: 20px; text-align: center;">
                    <p>Visualización de Barras de Rendimiento (SVG Integrado)</p>
                    <div style="margin-top: 15px;">
                        <strong>${teamA.name}:</strong> Goles: ${teamA.goalsScored} | Posesión: ${teamA.possession}%<br>
                        <strong>${teamB.name}:</strong> Goles: ${teamB.goalsScored} | Posesión: ${teamB.possession}%
                    </div>
                </div>
            `;
        }
    }
}

function compareAndHighlight(idA, idB, valA, valB, higherIsBetter) {
    const elA = document.getElementById(idA);
    const elB = document.getElementById(idB);
    if (!elA || !elB) return;

    elA.className = "compare-val";
    elB.className = "compare-val";

    if (valA === valB) return;

    const isWinnerA = higherIsBetter ? (valA > valB) : (valA < valB);
    if (isWinnerA) {
        elA.classList.add("text-green", "font-bold");
    } else {
        elB.classList.add("text-green", "font-bold");
    }
}

// Configuración de Formularios
function setupForms() {
    // Selector de Comparación
    const selectA = document.getElementById("compare-team-a");
    const selectB = document.getElementById("compare-team-b");
    if (selectA && selectB) {
        selectA.addEventListener("change", renderCharts);
        selectB.addEventListener("change", renderCharts);
    }

    // Formulario de Captura Manual
    const manualForm = document.getElementById("manual-capture-form");
    if (manualForm) {
        // Rellenar selector de edición del formulario manual
        const editSelect = document.getElementById("edit-team-select");
        Object.keys(teams).forEach(key => {
            const opt = document.createElement("option");
            opt.value = key;
            opt.textContent = teams[key].name;
            editSelect.appendChild(opt);
        });

        // Cuando se selecciona una selección, rellenar los inputs del formulario
        editSelect.addEventListener("change", () => {
            const key = editSelect.value;
            if (!key) return;
            const team = teams[key];
            document.getElementById("inp-matches").value = team.matches;
            document.getElementById("inp-goals-scored").value = team.goalsScored;
            document.getElementById("inp-goals-conceded").value = team.goalsConceded;
            document.getElementById("inp-possession").value = team.possession;
            document.getElementById("inp-shots").value = team.shotsOnTarget;
            document.getElementById("inp-players").value = team.keyPlayers;
            document.getElementById("inp-form").value = team.form.join(",");
        });

        // Disparar primer rellenado
        editSelect.dispatchEvent(new Event("change"));

        manualForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const key = editSelect.value;
            if (!key) return;

            // Actualizar datos
            teams[key].matches = parseInt(document.getElementById("inp-matches").value) || 0;
            teams[key].goalsScored = parseInt(document.getElementById("inp-goals-scored").value) || 0;
            teams[key].goalsConceded = parseInt(document.getElementById("inp-goals-conceded").value) || 0;
            teams[key].possession = parseFloat(document.getElementById("inp-possession").value) || 0;
            teams[key].shotsOnTarget = parseInt(document.getElementById("inp-shots").value) || 0;
            teams[key].keyPlayers = document.getElementById("inp-players").value;
            teams[key].form = document.getElementById("inp-form").value.split(",").map(s => s.trim().toUpperCase());

            saveTeams();
            renderAll();
            showStatusMessage("¡Datos de selección guardados con éxito!", "success");
        });
    }

    // Simulador de Enlaces URL
    const urlForm = document.getElementById("url-import-form");
    if (urlForm) {
        urlForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const url = document.getElementById("inp-url").value;
            const targetTeam = document.getElementById("url-team-select").value;
            
            if (!url || !targetTeam) return;

            showScanningEffect(`Escaneando enlace deportivo: ${url}...`, () => {
                // Simulación de scraping deportivo
                const changeGoals = Math.floor(Math.random() * 3) + 1; // +1 a +3 goles
                const changeShots = Math.floor(Math.random() * 6) + 2; // +2 a +8 tiros
                
                // Aplicar cambio
                teams[targetTeam].matches += 1;
                teams[targetTeam].goalsScored += changeGoals;
                teams[targetTeam].shotsOnTarget += changeShots;
                // Añadir una victoria a la forma
                teams[targetTeam].form.shift();
                teams[targetTeam].form.push("W");

                saveTeams();
                renderAll();
                
                showStatusMessage(`¡Importación exitosa! Enlace procesado. Se ha registrado 1 partido adicional para ${teams[targetTeam].name} con +${changeGoals} goles y +${changeShots} tiros a puerta basados en el reporte web.`, "success");
                document.getElementById("inp-url").value = "";
            });
        });
        
        // Rellenar selector de importación web
        const urlSelect = document.getElementById("url-team-select");
        Object.keys(teams).forEach(key => {
            const opt = document.createElement("option");
            opt.value = key;
            opt.textContent = teams[key].name;
            urlSelect.appendChild(opt);
        });
    }

    // Simulador del Personalizado de Predicciones
    const customPredictBtn = document.getElementById("run-custom-prediction");
    if (customPredictBtn) {
        customPredictBtn.addEventListener("click", () => {
            const keyA = document.getElementById("predict-team-a").value;
            const keyB = document.getElementById("predict-team-b").value;
            
            if (keyA === keyB) {
                alert("Por favor selecciona selecciones diferentes para simular un enfrentamiento.");
                return;
            }

            const pred = calculateMatchPrediction(keyA, keyB);
            
            const resultsDiv = document.getElementById("custom-prediction-results");
            resultsDiv.style.display = "block";
            resultsDiv.scrollIntoView({ behavior: "smooth" });

            resultsDiv.innerHTML = `
                <div class="prediction-card glassmorphic highlighted">
                    <div class="pred-header">SIMULACIÓN DE ENCUENTRO</div>
                    <div class="pred-match">
                        <div class="pred-team">
                            <div class="pred-flag">${getFlagSvg(keyA)}</div>
                            <h3>${pred.teamAName}</h3>
                        </div>
                        <div class="pred-score">
                            <span class="score-val">${pred.teamAGoals}</span>
                            <span class="score-sep">-</span>
                            <span class="score-val">${pred.teamBGoals}</span>
                        </div>
                        <div class="pred-team">
                            <div class="pred-flag">${getFlagSvg(keyB)}</div>
                            <h3>${pred.teamBName}</h3>
                        </div>
                    </div>
                    <div class="pred-winner-banner">
                        ${pred.winnerName === "Empate" ? 
                            `⚡ <strong>Predicción:</strong> Empate en tiempo reglamentario` : 
                            `🏆 <strong>Ganador Estimado:</strong> ${pred.winnerName}`}
                    </div>
                    <div class="pred-justification">
                        <h4>Justificación Estadística</h4>
                        <p>${pred.justification}</p>
                    </div>
                </div>
            `;
        });
    }
}

// Configurar Manejadores de Archivos
function setupFileHandlers() {
    const fileZone = document.getElementById("file-drop-zone");
    const fileInput = document.getElementById("file-upload-input");

    if (!fileZone || !fileInput) return;

    // Click en la zona abre el selector de archivos
    fileZone.addEventListener("click", () => fileInput.click());

    // Drag-and-drop
    fileZone.addEventListener("dragover", (e) => {
        e.preventDefault();
        fileZone.classList.add("dragging");
    });

    fileZone.addEventListener("dragleave", () => {
        fileZone.classList.remove("dragging");
    });

    fileZone.addEventListener("drop", (e) => {
        e.preventDefault();
        fileZone.classList.remove("dragging");
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleUploadedFile(files[0]);
        }
    });

    fileInput.addEventListener("change", (e) => {
        if (fileInput.files.length > 0) {
            handleUploadedFile(fileInput.files[0]);
        }
    });
}

// Procesar Archivos Subidos
function handleUploadedFile(file) {
    const extension = file.name.split('.').pop().toLowerCase();
    
    showScanningEffect(`Escaneando archivo: ${file.name} (${(file.size/1024).toFixed(1)} KB)...`, () => {
        if (extension === "csv") {
            // Leer y procesar CSV
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target.result;
                parseCSVStats(text);
            };
            reader.readAsText(file);
        } else if (["xlsx", "xls"].includes(extension)) {
            // Simular lectura de excel
            showStatusMessage(`¡Archivo Excel "${file.name}" leído con éxito! Se cargaron estadísticas adicionales para España y Argentina.`, "success");
            // Modificar ligeramente los datos de forma mock
            teams.spain.goalsScored += 1;
            teams.argentina.possession = 61;
            saveTeams();
            renderAll();
        } else if (["pdf", "doc", "docx"].includes(extension)) {
            // Simulación PDF
            showStatusMessage(`¡Documento PDF "${file.name}" analizado con IA! Encontradas menciones sobre la forma de Inglaterra (+1 victoria reciente).`, "success");
            teams.england.form.shift();
            teams.england.form.push("W");
            saveTeams();
            renderAll();
        } else if (["png", "jpg", "jpeg", "webp"].includes(extension)) {
            // Simulación Imagen
            showStatusMessage(`¡Imagen de pizarra táctica "${file.name}" escaneada! Identificado nuevo jugador destacado para Francia: Bradley Barcola.`, "success");
            if (!teams.france.keyPlayers.includes("Barcola")) {
                teams.france.keyPlayers += ", Bradley Barcola";
            }
            saveTeams();
            renderAll();
        } else {
            showStatusMessage(`Archivo "${file.name}" cargado. Tipo de archivo simulado para análisis básico de texto.`, "success");
        }
    });
}

// Lector/Parser de CSV Real
function parseCSVStats(csvText) {
    try {
        const lines = csvText.split('\n');
        let updatedCount = 0;
        
        // Formato esperado en CSV:
        // seleccion,partidos,goles_favor,goles_contra,posesion,tiros,jugadores,forma
        // españa,6,16,2,63,40,"Lamine Yamal, Rodri","W,W,W,W,W"
        
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            
            // Un split rudimentario respetando comillas para la lista de jugadores
            const parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
            if (parts.length < 8) continue;
            
            const rawKey = parts[0].toLowerCase().trim();
            // Mapear nombre en español a clave de base de datos
            let key = null;
            if (rawKey.includes("espa") || rawKey.includes("spain")) key = "spain";
            else if (rawKey.includes("ingla") || rawKey.includes("england")) key = "england";
            else if (rawKey.includes("fran") || rawKey.includes("france")) key = "france";
            else if (rawKey.includes("argen") || rawKey.includes("argentina")) key = "argentina";
            
            if (key && teams[key]) {
                teams[key].matches = parseInt(parts[1]) || teams[key].matches;
                teams[key].goalsScored = parseInt(parts[2]) || teams[key].goalsScored;
                teams[key].goalsConceded = parseInt(parts[3]) || teams[key].goalsConceded;
                teams[key].possession = parseFloat(parts[4]) || teams[key].possession;
                teams[key].shotsOnTarget = parseInt(parts[5]) || teams[key].shotsOnTarget;
                teams[key].keyPlayers = parts[6].replace(/"/g, '').trim() || teams[key].keyPlayers;
                
                const formString = parts[7].replace(/"/g, '').trim();
                teams[key].form = formString.split('-').map(s => s.trim().toUpperCase());
                
                updatedCount++;
            }
        }
        
        if (updatedCount > 0) {
            saveTeams();
            renderAll();
            showStatusMessage(`¡CSV procesado con éxito! Se actualizaron datos para ${updatedCount} selecciones.`, "success");
        } else {
            showStatusMessage("El CSV no contenía ninguna selección válida (Inglaterra, Francia, España, Argentina).", "warning");
        }
    } catch (err) {
        console.error(err);
        showStatusMessage("Error al parsear el archivo CSV. Verifica el formato.", "error");
    }
}

// Algoritmo del Motor de Predicción (Deterministic xG Simulation)
function calculateMatchPrediction(keyA, keyB) {
    const teamA = teams[keyA];
    const teamB = teams[keyB];

    // Goles por partido anotados y encajados
    const attacksA = teamA.goalsScored / (teamA.matches || 1);
    const defenseA = teamA.goalsConceded / (teamA.matches || 1);
    const attacksB = teamB.goalsScored / (teamB.matches || 1);
    const defenseB = teamB.goalsConceded / (teamB.matches || 1);

    // Ajustes basados en posesión y disparos a portería
    const shotsPerMatchA = teamA.shotsOnTarget / (teamA.matches || 1);
    const shotsPerMatchB = teamB.shotsOnTarget / (teamB.matches || 1);
    
    // xG Base
    let xGA = (attacksA + defenseB) / 2;
    let xGB = (attacksB + defenseA) / 2;

    // Modificadores de posesión (5% de influencia por cada 5% de diferencia)
    const possDiff = teamA.possession - teamB.possession;
    xGA += (possDiff / 100) * 0.5;
    xGB -= (possDiff / 100) * 0.5;

    // Modificadores de tiros a puerta
    const shotsDiff = shotsPerMatchA - shotsPerMatchB;
    xGA += shotsDiff * 0.05;
    xGB -= shotsDiff * 0.05;

    // Modificadores de Forma (últimos 5 partidos)
    // Contamos "W" como +0.1, "D" como 0, "L" como -0.1
    const formWeight = (formArr) => formArr.reduce((sum, f) => sum + (f === "W" ? 0.1 : (f === "L" ? -0.1 : 0)), 0);
    xGA += formWeight(teamA.form) * 0.2;
    xGB += formWeight(teamB.form) * 0.2;

    // Asegurar valores mínimos
    xGA = Math.max(0.1, xGA);
    xGB = Math.max(0.1, xGB);

    // Redondear a marcador realista
    let scoreA = Math.round(xGA);
    let scoreB = Math.round(xGB);

    // Si los goles estimados son idénticos pero queremos forzar un ganador o empate
    let winner = "Empate";
    let winnerName = "Empate";
    if (scoreA > scoreB) {
        winner = keyA;
        winnerName = teamA.name;
    } else if (scoreB > scoreA) {
        winner = keyB;
        winnerName = teamB.name;
    }

    // Construcción de justificación detallada basada en las estadísticas
    let justification = "";
    if (scoreA > scoreB) {
        justification = `El modelo de IA predice una victoria de **${teamA.name}** sobre **${teamB.name}** con un marcador estimado de ${scoreA}-${scoreB}. Esta predicción se basa principalmente en la eficiencia ofensiva de ${teamA.name} que registra un promedio de ${(attacksA).toFixed(1)} goles por partido y un volumen alto de disparos a portería (${(shotsPerMatchA).toFixed(1)} por partido), superando el bloque defensivo de ${teamB.name} que permite ${(defenseB).toFixed(1)} goles. La posesión de balón inclinada hacia ${teamA.name} (${teamA.possession}% vs ${teamB.possession}%) será un factor dominante para controlar los ritmos del partido.`;
    } else if (scoreB > scoreA) {
        justification = `El modelo de IA predice una victoria de **${teamB.name}** sobre **${teamA.name}** con un marcador estimado de ${scoreB}-${scoreA}. La clave del encuentro recae en el poderío de **${teamB.name}**, quienes promedian ${(attacksB).toFixed(1)} goles anotados por encuentro frente a una defensa de ${teamA.name} que ha encajado ${(defenseA).toFixed(1)} goles de media. A su vez, el volumen de tiros de ${teamB.name} (${(shotsPerMatchB).toFixed(1)} tiros/partido) y su racha reciente de victorias proporcionan una ventaja estadística sobre su rival.`;
    } else {
        justification = `Se estima un duelo sumamente parejo que finalizaría en un empate ${scoreA}-${scoreA} en los 90 minutos reglamentarios. Ambos equipos presentan métricas muy equilibradas. ${teamA.name} tiene una posesión promedio del ${teamA.possession}% con un promedio de ${(attacksA).toFixed(1)} goles, mientras que ${teamB.name} ostenta el ${teamB.possession}% con ${(attacksB).toFixed(1)} goles de media. El control del mediocampo neutralizará las ofensivas de ambos lados, resultando en un encuentro de alta táctica pero pocas transiciones definitivas.`;
    }

    return {
        teamAName: teamA.name,
        teamBName: teamB.name,
        teamAGoals: scoreA,
        teamBGoals: scoreB,
        winner: winner,
        winnerName: winnerName,
        justification: justification
    };
}

// Generar Automáticamente Pronósticos del Cierre del Mundial (Últimos 2 Partidos)
function generateWorldCupFinalPredictions() {
    const finalContainer = document.getElementById("world-cup-finals-predictions");
    if (!finalContainer) return;

    finalContainer.innerHTML = "";

    // Para simular las finales, planteamos unas semifinales fijas ficticias:
    // Semifinal 1: Argentina vs Inglaterra -> Ganador va a la Final, Perdedor al 3er Lugar
    // Semifinal 2: España vs Francia -> Ganador va a la Final, Perdedor al 3er Lugar
    
    const sf1 = calculateMatchPrediction("argentina", "england");
    const sf2 = calculateMatchPrediction("spain", "france");

    let finalist1 = sf1.teamAGoals >= sf1.teamBGoals ? "argentina" : "england";
    let thirdPlace1 = finalist1 === "argentina" ? "england" : "argentina";

    let finalist2 = sf2.teamAGoals >= sf2.teamBGoals ? "spain" : "france";
    let thirdPlace2 = finalist2 === "spain" ? "france" : "spain";

    // 1. Predicción del Partido por el Tercer Lugar (Losers of SF)
    const thirdPlaceMatch = calculateMatchPrediction(thirdPlace1, thirdPlace2);
    // Asegurar que no quede en empate ya que se define sí o sí. Si empata, simular penales de forma estadística.
    let penaltyShootoutText3 = "";
    if (thirdPlaceMatch.teamAGoals === thirdPlaceMatch.teamBGoals) {
        // Desempatar basado en tiros a portería
        const teamA = teams[thirdPlace1];
        const teamB = teams[thirdPlace2];
        if (teamA.shotsOnTarget > teamB.shotsOnTarget) {
            thirdPlaceMatch.winnerName = teamA.name;
            penaltyShootoutText3 = ` (Definido en penaltis a favor de ${teamA.name})`;
        } else {
            thirdPlaceMatch.winnerName = teamB.name;
            penaltyShootoutText3 = ` (Definido en penaltis a favor de ${teamB.name})`;
        }
    }

    // 2. Predicción de la Gran Final (Winners of SF)
    const finalMatch = calculateMatchPrediction(finalist1, finalist2);
    let penaltyShootoutTextFinal = "";
    if (finalMatch.teamAGoals === finalMatch.teamBGoals) {
        const teamA = teams[finalist1];
        const teamB = teams[finalist2];
        if (teamA.shotsOnTarget > teamB.shotsOnTarget) {
            finalMatch.winnerName = teamA.name;
            penaltyShootoutTextFinal = ` (Definido en penaltis a favor de ${teamA.name})`;
        } else {
            finalMatch.winnerName = teamB.name;
            penaltyShootoutTextFinal = ` (Definido en penaltis a favor de ${teamB.name})`;
        }
    }

    // Renderizar Partido por Tercer Lugar
    const thirdCard = document.createElement("div");
    thirdCard.className = "prediction-card glassmorphic";
    thirdCard.innerHTML = `
        <div class="pred-header bg-bronze">PARTIDO POR EL TERCER PUESTO</div>
        <div class="pred-match">
            <div class="pred-team">
                <div class="pred-flag">${getFlagSvg(thirdPlace1)}</div>
                <h3>${teams[thirdPlace1].name}</h3>
            </div>
            <div class="pred-score">
                <span class="score-val">${thirdPlaceMatch.teamAGoals}</span>
                <span class="score-sep">-</span>
                <span class="score-val">${thirdPlaceMatch.teamBGoals}</span>
            </div>
            <div class="pred-team">
                <div class="pred-flag">${getFlagSvg(thirdPlace2)}</div>
                <h3>${teams[thirdPlace2].name}</h3>
            </div>
        </div>
        <div class="pred-winner-banner">
            🥉 <strong>Tercer Puesto Estimado:</strong> ${thirdPlaceMatch.winnerName}${penaltyShootoutText3}
        </div>
        <div class="pred-justification">
            <h4>Justificación Basada en Datos</h4>
            <p>${thirdPlaceMatch.justification}</p>
        </div>
    `;

    // Renderizar Gran Final
    const finalCard = document.createElement("div");
    finalCard.className = "prediction-card glassmorphic gold-border";
    finalCard.innerHTML = `
        <div class="pred-header bg-gold">🏆 LA GRAN FINAL DEL MUNDIAL 🏆</div>
        <div class="pred-match">
            <div class="pred-team">
                <div class="pred-flag">${getFlagSvg(finalist1)}</div>
                <h3>${teams[finalist1].name}</h3>
            </div>
            <div class="pred-score">
                <span class="score-val">${finalMatch.teamAGoals}</span>
                <span class="score-sep">-</span>
                <span class="score-val">${finalMatch.teamBGoals}</span>
            </div>
            <div class="pred-team">
                <div class="pred-flag">${getFlagSvg(finalist2)}</div>
                <h3>${teams[finalist2].name}</h3>
            </div>
        </div>
        <div class="pred-winner-banner font-large bg-gold-gradient">
            👑 <strong>CAMPEÓN MUNDIAL PREDICTIVO:</strong> ${finalMatch.winnerName}${penaltyShootoutTextFinal}
        </div>
        <div class="pred-justification">
            <h4>Justificación Basada en Datos</h4>
            <p>${finalMatch.justification}</p>
        </div>
    `;

    finalContainer.appendChild(thirdCard);
    finalContainer.appendChild(finalCard);
}

// Banderas SVG integradas de alta resolución
function getFlagSvg(teamKey) {
    const flags = {
        "england": `
            <svg class="svg-flag" viewBox="0 0 100 60" width="100%" height="100%">
                <rect width="100%" height="100%" fill="#FFFFFF" />
                <rect x="42.5" width="15" height="60" fill="#E0000F" />
                <rect y="22.5" width="100%" height="15" fill="#E0000F" />
            </svg>
        `,
        "france": `
            <svg class="svg-flag" viewBox="0 0 100 60" width="100%" height="100%">
                <rect width="33.3" height="60" fill="#002395" />
                <rect x="33.3" width="33.4" height="60" fill="#FFFFFF" />
                <rect x="66.7" width="33.3" height="60" fill="#ED2939" />
            </svg>
        `,
        "spain": `
            <svg class="svg-flag" viewBox="0 0 100 60" width="100%" height="100%">
                <rect width="100%" height="15" fill="#C60B1E" />
                <rect y="15" width="100%" height="30" fill="#FFC400" />
                <rect y="45" width="100%" height="15" fill="#C60B1E" />
                <!-- Escudo de España simplificado -->
                <circle cx="25" cy="30" r="7" fill="#C60B1E" />
                <rect x="23" y="27" width="4" height="6" fill="#FFC400" />
            </svg>
        `,
        "argentina": `
            <svg class="svg-flag" viewBox="0 0 100 60" width="100%" height="100%">
                <rect width="100%" height="20" fill="#74ACDF" />
                <rect y="20" width="100%" height="20" fill="#FFFFFF" />
                <rect y="40" width="100%" height="20" fill="#74ACDF" />
                <!-- Sol de Mayo simplificado -->
                <circle cx="50" cy="30" r="5" fill="#F9A825" />
                <line x1="50" y1="22" x2="50" y2="38" stroke="#F9A825" stroke-width="1.5" />
                <line x1="42" y1="30" x2="58" y2="30" stroke="#F9A825" stroke-width="1.5" />
            </svg>
        `
    };
    return flags[teamKey] || '';
}

// Efecto Táctico de Carga (Futurista / Escaneo)
function showScanningEffect(message, callback) {
    const scanner = document.getElementById("file-scanner-overlay");
    if (!scanner) {
        callback();
        return;
    }
    
    const text = scanner.querySelector(".scanner-text");
    text.textContent = message;
    scanner.classList.add("active");

    setTimeout(() => {
        scanner.classList.remove("active");
        callback();
    }, 2500); // 2.5s de animación táctica
}

// Mostrar mensajes de estado
function showStatusMessage(msg, type) {
    const box = document.getElementById("status-message-box");
    if (!box) return;

    box.className = `status-box status-${type}`;
    box.textContent = msg;
    box.style.display = "block";

    setTimeout(() => {
        box.style.display = "none";
    }, 7000);
}
