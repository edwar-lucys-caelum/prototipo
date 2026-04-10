/**
 * KALI-OPS Lógica de Suite Táctica de Pentesting
 */

// --- ESTADO GLOBAL ---
let currentScanType = 'basic'; 

// --- DATOS SIMULADOS (MOCK) ---
const MOCK_RESULTS = [
    {
        port: "22", service: "SSH", version: "OpenSSH 7.6p1",
        cves: [
            { id: "CVE-2018-15473", type: "Enumeración de Usuarios", score: 5, link: "#" },
            { id: "CVE-2020-15778", type: "Ejecución Remota (RCE)", score: 7, link: "#" },
            { id: "CVE-2016-0777", type: "Fuga de Información", score: 4, link: "#" },
            { id: "CVE-2015-5600", type: "Denegación de Servicio (DoS)", score: 3, link: "#" }
        ]
    },
    {
        port: "80", service: "HTTP", version: "Apache 2.4.29",
        cves: [
            { id: "CVE-2017-15715", type: "Inyección de Archivos", score: 6, link: "#" },
            { id: "CVE-2019-0211", type: "Escalamiento de Privilegios", score: 8, link: "#" },
            { id: "CVE-2018-1312", type: "XSS Persistente", score: 5, link: "#" },
            { id: "CVE-2017-9788", type: "Falsificación de Petición", score: 4, link: "#" }
        ]
    },
    {
        port: "443", service: "HTTPS", version: "OpenSSL 1.1.1",
        cves: [
            { id: "CVE-2014-0160", type: "Heartbleed Vulnerability", score: 9, link: "#" },
            { id: "CVE-2021-3449", type: "DoS por Renegociación", score: 5, link: "#" },
            { id: "CVE-2022-0778", type: "Bucle Infinito en Certs", score: 7, link: "#" },
            { id: "CVE-2019-1559", type: "Ataque de Oráculo", score: 4, link: "#" }
        ]
    },
    {
        port: "3306", service: "MySQL", version: "MySQL 5.7.22",
        cves: [
            { id: "CVE-2016-6662", type: "Inyección SQL Crítica", score: 10, link: "#" },
            { id: "CVE-2017-3302", type: "Crash de Memoria", score: 6, link: "#" },
            { id: "CVE-2012-2122", type: "Salto de Autenticación", score: 8, link: "#" },
            { id: "CVE-1999-1186", type: "Desbordamiento de Búfer", score: 9, link: "#" }
        ]
    }
];

// --- NAVEGACIÓN ---
function showView(viewId) {
    document.querySelectorAll('section').forEach(s => s.classList.remove('active'));
    setTimeout(() => {
        const target = document.getElementById(viewId);
        if (target) target.classList.add('active');
    }, 100);
}

// --- LOGIN ---
document.getElementById('login-btn').addEventListener('click', () => {
    const pass = document.getElementById('password-input').value;
    const btn = document.getElementById('login-btn');
    const error = document.getElementById('login-error');

    if (pass === 'kali') {
        btn.innerText = "DESENCRIPTANDO...";
        error.classList.add('hidden');
        setTimeout(() => showView('menu-section'), 1000);
    } else {
        error.classList.remove('hidden');
        document.getElementById('password-input').value = "";
    }
});

document.getElementById('password-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') document.getElementById('login-btn').click();
});

// --- SIMULACIÓN DE ESCANEO ---
function startScan(type) {
    currentScanType = type;
    const targetIp = (type === 'basic') 
        ? document.getElementById('target-ip-basic').value 
        : document.getElementById('target-ip-advanced').value;

    if (targetIp !== '192.168.18.2') {
        alert("En este prototipo solo se acepta la IP 192.168.18.2");
        return;
    }

    const loader = document.getElementById(`${type}-loading`);
    loader.classList.remove('hidden');

    // Simular diferentes tiempos según la intensidad
    let duration = 2500;
    if (type === 'advanced') {
        const speed = document.getElementById('scan-speed').value;
        if (speed === 'sigiloso') duration = 6000;
        else if (speed === 'agresivo') duration = 3000;
        else duration = 4500;
    }

    setTimeout(() => {
        loader.classList.add('hidden');
        renderResults(targetIp, type);
        showView('results-section');
    }, duration);
}

// --- RENDERIZADO DE RESULTADOS ---
function renderResults(ip, type) {
    const tbody = document.getElementById('results-tbody');
    const sidePanel = document.getElementById('advanced-side-panel');
    const badge = document.getElementById('scan-badge');
    const displayTarget = document.getElementById('display-target');
    
    displayTarget.innerText = ip;
    tbody.innerHTML = '';
    
    if (type === 'basic') {
        sidePanel.classList.add('hidden');
        badge.innerText = "RECONOCIMIENTO BÁSICO";
        badge.className = "tag-score score-low";
    } else {
        sidePanel.classList.remove('hidden');
        badge.innerText = "ANÁLISIS DE VULNERABILIDADES";
        badge.className = "tag-score score-high";
    }

    MOCK_RESULTS.forEach(res => {
        // Fila Principal de Puerto
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><span class="text-neon">${res.port}</span></td>
            <td>${res.service}</td>
            <td style="color: var(--clr-text-dim);">${res.version}</td>
        `;
        tbody.appendChild(row);

        // Si es Avanzado, inyectar las sub-filas de CVE
        if (type === 'advanced') {
            res.cves.forEach(cve => {
                const cveRow = document.createElement('tr');
                cveRow.style.background = "rgba(255,255,255,0.02)";
                
                let scoreClass = 'score-low';
                if (cve.score > 3) scoreClass = 'score-med';
                if (cve.score >= 8) scoreClass = 'score-high';

                cveRow.innerHTML = `
                    <td colspan="3" style="font-size: 0.75rem; padding-left: 40px; border-left: 2px solid var(--clr-secondary);">
                        <span style="opacity: 0.5;">[CVE]</span> 
                        <strong class="text-cyan">${cve.id}</strong> | 
                        ${cve.type} | 
                        <span class="tag-score ${scoreClass}">${cve.score}</span>
                    </td>
                `;
                tbody.appendChild(cveRow);
            });
        }
    });

    if (type === 'advanced') {
        initCharts();
    }
}

// --- LÓGICA DE GRÁFICOS ---
let chart1 = null;
let chart2 = null;

function initCharts() {
    const ctx1 = document.getElementById('cveChart');
    const ctx2 = document.getElementById('severityChart');

    if (chart1) chart1.destroy();
    if (chart2) chart2.destroy();

    chart1 = new Chart(ctx1, {
        type: 'pie',
        data: {
            labels: ['SSH', 'HTTP', 'HTTPS', 'MySQL'],
            datasets: [{
                data: [4, 4, 4, 4],
                backgroundColor: ['#00ff41', '#0088ff', '#ff003c', '#ffaa00'],
                borderColor: 'rgba(0,0,0,0.5)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { color: '#8892b0', font: { size: 10 } } }
            }
        }
    });

    chart2 = new Chart(ctx2, {
        type: 'bar',
        data: {
            labels: ['Bajo', 'Medio', 'Crítico'],
            datasets: [{
                label: 'Cantidad',
                data: [4, 6, 6],
                backgroundColor: ['rgba(0,255,0,0.3)', 'rgba(255,170,0,0.3)', 'rgba(255,0,60,0.3)'],
                borderColor: ['#00ff00', '#ffaa00', '#ff003c'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8892b0' } },
                x: { grid: { display: false }, ticks: { color: '#8892b0' } }
            },
            plugins: { legend: { display: false } }
        }
    });
}

// --- EXPORTAR PDF (REAL) ---
function downloadPDF() {
    const element = document.getElementById('capture-area');
    const opt = {
        margin:       0.5,
        filename:     'Reporte_Pentesting_KaliOps.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, backgroundColor: '#020205' },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    // Usar la librería html2pdf para generar el PDF
    html2pdf().set(opt).from(element).save();
}
