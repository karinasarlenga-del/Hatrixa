const translations = {
    en: {
        "nav_home": "Home",
        "nav_work": "Work",
        "nav_studio": "Studio",
        "nav_services": "Services",
        "nav_recent": "Recent Projects",
        "nav_contact": "Contact",
        "hero_title": "VISUALS THAT BUILD TRUST.",
        "hero_desc": "Photography and audiovisual production for companies, brands and spaces that understand the value of perception.",
        "btn_view_work": "VIEW WORK",
        "btn_start_project": "START A PROJECT",
        "marq_1": "HATRIXA VISUAL STUDIO",
        "marq_2": "AESTHETICS AS LOGIC",
        "marq_3": "BUILDING TRUST",
        "phil_tag": "Philosophy",
        "phil_title": "Your image speaks <br> before you do.",
        "phil_desc": "We are a photography and audiovisual production studio for companies, brands, and spaces that understand the value of perception. With over 10 years in the industry, we specialize in distilling the essence through high-end visual storytelling. Our approach is surgical: eliminating distraction to elevate the core value of your perception.",
        "work_tag": "Selected Work",
        "work_title": "Recent Projects",
        "serv_tag_1": "01 / Services",
        "serv_title_1": "Architecture",
        "btn_explore": "EXPLORE WORK",
        "serv_tag_2": "02 / Services",
        "serv_title_2": "Corporate & Industrial",
        "serv_tag_3": "03 / Services",
        "serv_title_3": "Gastronomy",
        "man_tag": "Manifesto",
        "man_quote": "\"WE BELIEVE THAT <span class='text-accent-rust'>BEAUTY</span> WITHOUT STRATEGY IS DECORATIVE, AND <span class='text-secondary'>STRATEGY</span> WITHOUT BEAUTY IS INVISIBLE.\"",
        "man_desc": "At Hatrixa, we navigate the thin line between art and commerce. Every frame is a calculated move to establish authority and desire.",
        "btn_get_touch": "GET IN TOUCH",
        "foot_desc": "Elevating brands through the lens of sophisticated visual culture.",
        "foot_title_studio": "Studio",
        "foot_process": "Process",
        "foot_about": "About",
        "foot_journal": "Journal",
        "foot_title_social": "Social",
        "foot_title_nl": "Newsletter",
        "foot_nl_desc": "Stay updated with our latest productions and insights.",
        "foot_nl_placeholder": "YOUR EMAIL",
        "foot_copyright": "© 2026 HATRIXA STUDIO. ALL RIGHTS RESERVED.",
        "foot_privacy": "Privacy Policy",
        "foot_terms": "Terms of Service",
        "gal_back": "Back",
        "gal_arch_title": "Architecture",
        "gal_arch_desc": "Explore our curated selection of architectural photography, focusing on structure, light, and material logic.",
        "gal_corp_title": "Corporate & Industrial",
        "gal_corp_desc": "Explore our visual narratives capturing the essence of corporate dynamics and industrial scale.",
        "gal_gastro_title": "Gastronomy",
        "gal_gastro_desc": "Explore our rich and appetizing visual documentation of culinary experiences."
    },
    es: {
        "nav_home": "Inicio",
        "nav_work": "Trabajo",
        "nav_studio": "Estudio",
        "nav_services": "Servicios",
        "nav_recent": "Proyectos Recientes",
        "nav_contact": "Contacto",
        "hero_title": "IMÁGENES QUE INSPIRAN CONFIANZA.",
        "hero_desc": "Fotografía y producción audiovisual para empresas, marcas y espacios que entienden el valor de la percepción.",
        "btn_view_work": "VER TRABAJO",
        "btn_start_project": "INICIAR UN PROYECTO",
        "marq_1": "HATRIXA ESTUDIO VISUAL",
        "marq_2": "LA ESTÉTICA COMO LÓGICA",
        "marq_3": "CONSTRUYENDO CONFIANZA",
        "phil_tag": "Filosofía",
        "phil_title": "Tu imagen habla <br> antes que vos.",
        "phil_desc": "Somos un estudio de fotografía y producción audiovisual para empresas, marcas y espacios que entienden el valor de la percepción. Con más de 10 años en el rubro, nos especializamos en destilar la esencia a través de narrativas visuales de alto nivel. Nuestro enfoque es quirúrgico: eliminar la distracción para elevar el valor central de tu percepción.",
        "work_tag": "Trabajo Destacado",
        "work_title": "Proyectos Recientes",
        "serv_tag_1": "01 / Servicios",
        "serv_title_1": "Arquitectura",
        "btn_explore": "EXPLORAR TRABAJO",
        "serv_tag_2": "02 / Servicios",
        "serv_title_2": "Corporativo e Industrial",
        "serv_tag_3": "03 / Servicios",
        "serv_title_3": "Gastronomía",
        "man_tag": "Manifiesto",
        "man_quote": "\"CREEMOS QUE LA <span class='text-accent-rust'>BELLEZA</span> SIN ESTRATEGIA ES DECORATIVA, Y LA <span class='text-secondary'>ESTRATEGIA</span> SIN BELLEZA ES INVISIBLE.\"",
        "man_desc": "En Hatrixa, navegamos la fina línea entre el arte y el comercio. Cada cuadro es un movimiento calculado para establecer autoridad y deseo.",
        "btn_get_touch": "CONTACTANOS",
        "foot_desc": "Elevando marcas a través de la lente de una cultura visual sofisticada.",
        "foot_title_studio": "Estudio",
        "foot_process": "Proceso",
        "foot_about": "Nosotros",
        "foot_journal": "Revista",
        "foot_title_social": "Social",
        "foot_title_nl": "Boletín",
        "foot_nl_desc": "Mantenete actualizado con nuestras últimas producciones y novedades.",
        "foot_nl_placeholder": "TU CORREO",
        "foot_copyright": "© 2026 HATRIXA STUDIO. TODOS LOS DERECHOS RESERVADOS.",
        "foot_privacy": "Política de Privacidad",
        "foot_terms": "Términos de Servicio",
        "gal_back": "Volver",
        "gal_arch_title": "Arquitectura",
        "gal_arch_desc": "Explorá nuestra cuidada selección de fotografía arquitectónica, enfocada en la estructura, la luz y la lógica material.",
        "gal_corp_title": "Corporativo e Industrial",
        "gal_corp_desc": "Explorá nuestras narrativas visuales que capturan la esencia de la dinámica corporativa y la escala industrial.",
        "gal_gastro_title": "Gastronomía",
        "gal_gastro_desc": "Explorá nuestra rica y apetitosa documentación visual de experiencias culinarias."
    }
};

let currentLang = 'es'; // default to Spanish as requested for local user

function setLanguage(lang) {
    currentLang = lang;
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            if (el.tagName === 'INPUT' && el.hasAttribute('placeholder')) {
                el.placeholder = translations[lang][key];
            } else if (el.id === 'animated-heading') {
                // Apply animation logic for the heading
                const text = translations[lang][key];
                const lines = text.split('\n'); // Split by \n or we can just split by word/char directly
                // If it's the title, we might not have \n in translations, so we'll just animate it as one line or let it wrap.
                el.innerHTML = '';
                
                let charDelay = 30;
                let initialDelay = 50; // faster initial delay on lang switch
                
                // If the translation doesn't have \n, we just treat it as one line.
                // The spans are inline-block so they will wrap naturally.
                text.split('').forEach((char, charIndex) => {
                    const span = document.createElement('span');
                    span.textContent = char === ' ' ? '\u00A0' : char;
                    span.style.opacity = '0';
                    span.style.transform = 'translateX(-18px)';
                    span.style.display = 'inline-block';
                    span.style.transition = 'opacity 500ms ease, transform 500ms ease';
                    
                    const delay = initialDelay + (charIndex * charDelay);
                    
                    setTimeout(() => {
                        span.style.opacity = '1';
                        span.style.transform = 'translateX(0)';
                    }, delay);
                    
                    el.appendChild(span);
                });
            } else {
                el.innerHTML = translations[lang][key];
            }
        }
    });

    // Update active state on language buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        if (btn.getAttribute('data-lang') === lang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    setLanguage(currentLang);

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            setLanguage(e.target.getAttribute('data-lang'));
        });
    });

    // Header shadow on scroll
    window.addEventListener('scroll', () => {
        const nav = document.querySelector('nav');
        if (window.scrollY > 50) {
            nav.classList.add('shadow-sm');
        } else {
            nav.classList.remove('shadow-sm');
        }
    });
});
