const fs = require('fs');
const valid = JSON.parse(fs.readFileSync('valid_ids.json', 'utf8'));

function generateGrid(cat, ids) {
    let imgFirst = cat === 'Gastronomía' ? 'Gastronomía.jpg' : `${cat}.jpeg`;
    let res = `                <img src="${imgFirst}" class="w-full h-80 object-cover rounded-xl cursor-pointer hover:opacity-80 transition-opacity" alt="${cat}">\n`;
    for (let i = 1; i < 18; i++) {
        res += `                <img src="https://images.unsplash.com/photo-${ids[i]}?q=80&w=1200&h=720&auto=format&fit=crop" class="w-full h-80 object-cover rounded-xl cursor-pointer hover:opacity-80 transition-opacity" alt="${cat}">\n`;
    }
    return res;
}

let archHtml = fs.readFileSync('architecture.html', 'utf8');
archHtml = archHtml.replace(/<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 gallery-grid">[\s\S]*?<\/div>/, `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 gallery-grid">\n${generateGrid('Arquitectura', valid.arch)}            </div>`);
fs.writeFileSync('architecture.html', archHtml);

let corpHtml = fs.readFileSync('corporate.html', 'utf8');
corpHtml = corpHtml.replace(/<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 gallery-grid">[\s\S]*?<\/div>/, `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 gallery-grid">\n${generateGrid('Corporativo e industrial', valid.corp)}            </div>`);
fs.writeFileSync('corporate.html', corpHtml);

let gastHtml = fs.readFileSync('gastronomy.html', 'utf8');
gastHtml = gastHtml.replace(/<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 gallery-grid">[\s\S]*?<\/div>/, `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 gallery-grid">\n${generateGrid('Gastronomía', valid.gast)}            </div>`);
fs.writeFileSync('gastronomy.html', gastHtml);

let indexHtml = fs.readFileSync('index.html', 'utf8');

// Update Recent Work Grid to have valid IDs and be a gallery
const indexGridHtml = `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 reveal-up gallery-grid" style="transition-delay: 300ms;">
            <img src="https://images.unsplash.com/photo-${valid.arch[0]}?q=80&w=800&h=600&auto=format&fit=crop" class="w-full h-80 object-cover rounded-xl hover:opacity-80 transition-opacity cursor-pointer" alt="Architecture Work">
            <img src="https://images.unsplash.com/photo-${valid.corp[0]}?q=80&w=800&h=600&auto=format&fit=crop" class="w-full h-80 object-cover rounded-xl hover:opacity-80 transition-opacity cursor-pointer" alt="Corporate Work">
            <img src="https://images.unsplash.com/photo-${valid.gast[0]}?q=80&w=800&h=600&auto=format&fit=crop" class="w-full h-80 object-cover rounded-xl hover:opacity-80 transition-opacity cursor-pointer" alt="Gastronomy Work">
            <img src="https://images.unsplash.com/photo-${valid.gast[1]}?q=80&w=800&h=600&auto=format&fit=crop" class="w-full h-80 object-cover rounded-xl hover:opacity-80 transition-opacity cursor-pointer" alt="Gastronomy Work 2">
            <img src="https://images.unsplash.com/photo-${valid.arch[1]}?q=80&w=800&h=600&auto=format&fit=crop" class="w-full h-80 object-cover rounded-xl hover:opacity-80 transition-opacity cursor-pointer" alt="Architecture Work 2">
            <img src="https://images.unsplash.com/photo-${valid.corp[1]}?q=80&w=800&h=600&auto=format&fit=crop" class="w-full h-80 object-cover rounded-xl hover:opacity-80 transition-opacity cursor-pointer" alt="Corporate Work 2">
        </div>`;
indexHtml = indexHtml.replace(/<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 reveal-up" style="transition-delay: 300ms;">[\s\S]*?<\/div>/, indexGridHtml);

// Add Lightbox HTML right before script tags
const lightboxHtml = `
    <!-- Slideshow Lightbox Modal -->
    <div class="lightbox" id="lightbox">
        <button id="lightbox-close" class="material-symbols-outlined text-white text-4xl absolute top-8 right-8 z-50 hover:text-accent-rust transition-colors cursor-pointer bg-black/50 p-2 rounded-full">close</button>
        <button id="lightbox-prev" class="material-symbols-outlined text-white text-5xl absolute left-4 md:left-8 z-50 hover:text-accent-rust transition-colors cursor-pointer bg-black/50 p-2 rounded-full">chevron_left</button>
        
        <div class="lightbox-content relative w-full h-full flex justify-center items-center" id="lightbox-close-area">
            <img src="" alt="Enlarged view" id="lightbox-img" class="relative z-40 shadow-2xl">
        </div>
        
        <button id="lightbox-next" class="material-symbols-outlined text-white text-5xl absolute right-4 md:right-8 z-50 hover:text-accent-rust transition-colors cursor-pointer bg-black/50 p-2 rounded-full">chevron_right</button>
    </div>

    <script src="translations.js"></script>`;

if (!indexHtml.includes('id="lightbox"')) {
    indexHtml = indexHtml.replace('    <script src="translations.js"></script>', lightboxHtml);
}

// Add gallery.js right after translations.js
if (!indexHtml.includes('<script src="gallery.js"></script>')) {
    indexHtml = indexHtml.replace('<script src="translations.js"></script>', '<script src="translations.js"></script>\n    <script src="gallery.js"></script>');
}

// Ensure style for lightbox exists
if (!indexHtml.includes('.lightbox {') && !indexHtml.includes('id="lightbox"')) {
    // Actually the style is in styles.css or needs to be in index.html.
    // wait, I put lightbox styles directly in head of the gallery html pages! Let's put it in index.html too.
    const css = `
    <style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .lightbox {
            display: none;
            position: fixed;
            z-index: 999;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            justify-content: center;
            align-items: center;
        }
        .lightbox.active { display: flex; }
        #lightbox-img {
            max-width: 90vw;
            max-height: 90vh;
            object-fit: contain;
            border-radius: 4px;
        }
    </style>`;
    indexHtml = indexHtml.replace(/<style>[\s\S]*?<\/style>/, css);
}

fs.writeFileSync('index.html', indexHtml);
