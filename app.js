document.addEventListener('DOMContentLoaded', () => {
    // Initialize app
    app.init();
});

const app = {
    init() {
        this.cacheDOM();
        this.bindEvents();
        // Load default page
        this.navigateTo('home');
    },

    cacheDOM() {
        this.navLinks = document.querySelectorAll('.nav-links li');
        this.mainContent = document.getElementById('main-content');
    },

    bindEvents() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const page = e.currentTarget.getAttribute('data-page');
                this.navigateTo(page);
            });
        });
    },

    navigateTo(pageId) {
        // Update active class on nav
        this.navLinks.forEach(link => {
            if (link.getAttribute('data-page') === pageId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Get template content
        const template = document.getElementById(`page-${pageId}`);
        if (!template) return;

        // Clone and inject content
        const content = template.content.cloneNode(true);
        this.mainContent.innerHTML = '';
        this.mainContent.appendChild(content);

        // Run page specific logic
        if (pageId === 'calculator') {
            this.initCalculator();
        }
    },

    initCalculator() {
        const form = document.getElementById('calc-form');
        const resultContainer = document.getElementById('calc-result');
        const resultNumber = document.getElementById('result-number');
        const resultMessage = document.getElementById('result-message');

        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const transport = parseFloat(document.getElementById('calc-transport').value) || 0;
            const energy = parseFloat(document.getElementById('calc-energy').value) || 0;
            const diet = document.getElementById('calc-diet').value;

            // Simple carbon footprint calculation logic (mock/approximate values)
            // Transport: ~0.15 kg CO2 per km
            const transportCO2 = (transport * 4) * 0.15; // monthly
            
            // Energy: roughly ~0.4 kg CO2 per kWh (assuming 1 TL = 0.5 kWh for mock calculation)
            const energyKwh = energy * 0.5;
            const energyCO2 = energyKwh * 0.4;
            
            // Diet: monthly baselines
            let dietCO2 = 0;
            switch(diet) {
                case 'high': dietCO2 = 250; break;
                case 'medium': dietCO2 = 150; break;
                case 'low': dietCO2 = 100; break;
                case 'vegetarian': dietCO2 = 60; break;
                case 'vegan': dietCO2 = 40; break;
            }

            const totalCO2 = Math.round(transportCO2 + energyCO2 + dietCO2);

            // Animate counting
            resultContainer.classList.remove('hidden');
            this.animateValue(resultNumber, 0, totalCO2, 1000);

            // Set message based on total
            if (totalCO2 < 200) {
                resultMessage.textContent = "Harika! Doğaya etkiniz oldukça düşük. 🌿";
                resultMessage.style.color = "var(--primary)";
            } else if (totalCO2 < 400) {
                resultMessage.textContent = "Fena değil, ama eko-görevlerle daha da azaltabilirsiniz. 🌎";
                resultMessage.style.color = "#f59e0b";
            } else {
                resultMessage.textContent = "Karbon ayak iziniz ortalamanın üzerinde. Hemen harekete geçin! ⚠️";
                resultMessage.style.color = "#ef4444";
            }
        });
    },

    animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    },

    completeTask(button) {
        const card = button.closest('.task-card');
        card.classList.add('completed');
        button.innerHTML = '<i class="ph ph-check"></i> Tamamlandı';
        
        // Optional: show a small toast or confetti animation here
        // We will keep it simple for now
    }
};
