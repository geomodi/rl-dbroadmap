// Enhanced Animation configuration
const animations = {
    fadeIn: {
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 800,
        easing: 'easeOutExpo'
    },
    fadeInLeft: {
        opacity: [0, 1],
        translateX: [-50, 0],
        duration: 1000,
        easing: 'easeOutCubic'
    },
    fadeInRight: {
        opacity: [0, 1],
        translateX: [50, 0],
        duration: 1000,
        easing: 'easeOutCubic'
    },
    scaleIn: {
        opacity: [0, 1],
        scale: [0.8, 1],
        duration: 1200,
        easing: 'easeOutElastic(1, .6)'
    },
    numberCount: {
        duration: 2000,
        easing: 'easeInOutExpo',
        round: 1
    },
    // glowPulse removed as requested
};

// Initialize draggable elements
interact('.cyber-card[data-draggable="true"]').draggable({
    inertia: true,
    modifiers: [
        interact.modifiers.restrictRect({
            restriction: 'parent',
            endOnly: true
        })
    ],
    listeners: {
        move: dragMoveListener
    }
});

function dragMoveListener(event) {
    const target = event.target;
    const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
    const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    target.style.transform = `translate(${x}px, ${y}px)`;
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
}

// Animate numbers
function animateNumbers() {
    document.querySelectorAll('.stat-value').forEach(el => {
        const value = parseInt(el.getAttribute('data-value'));
        anime({
            targets: el,
            innerHTML: [0, value],
            ...animations.numberCount,
            update: function(anim) {
                el.innerHTML = Math.round(anim.animations[0].currentValue);
            }
        });
    });
}

// Enhanced grid background animation with 3D effect
function animateGridBackground() {
    // Create a more dynamic 3D effect that responds to mouse movement
    const grid = document.querySelector('.tech-grid-bg');
    if (!grid) return;

    // Set initial transform origin
    grid.style.transformOrigin = 'center center';

    // Track mouse position
    let mouseX = 0;
    let mouseY = 0;
    let windowHalfX = window.innerWidth / 2;
    let windowHalfY = window.innerHeight / 2;

    // Update dimensions on resize
    window.addEventListener('resize', () => {
        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;
    });

    // Track mouse movement
    document.addEventListener('mousemove', (event) => {
        mouseX = event.clientX - windowHalfX;
        mouseY = event.clientY - windowHalfY;
    });

    // Animate the grid with subtle mouse-following effect
    function updateGrid() {
        // Calculate rotation based on mouse position
        const rotateX = (mouseY / windowHalfY) * 2; // Max 2 degrees
        const rotateY = (mouseX / windowHalfX) * -2; // Max 2 degrees

        // Apply the transform with easing
        anime({
            targets: grid,
            rotateX: rotateX,
            rotateY: rotateY,
            translateZ: [-5, 0],
            duration: 3000,
            easing: 'easeOutQuad',
            update: function() {
                // Add a subtle scale effect
                const scale = 1 + Math.abs(rotateX / 100) + Math.abs(rotateY / 100);
                grid.style.transform = `${grid.style.transform} scale(${scale})`;
            }
        });

        // Request next frame
        requestAnimationFrame(updateGrid);
    }

    // Start the animation loop
    updateGrid();
}

// Create floating particles with enhanced 3D effect and mouse interaction
function createParticles() {
    const particlesContainer = document.querySelector('.particles-container');
    const particleCount = 30; // Increased count for better effect

    // Clear existing particles
    particlesContainer.innerHTML = '';

    // Track mouse position
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Create particles with different properties for variety
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('cyber-particle');
        particle.style.position = 'absolute';

        // Create different types of particles
        const particleType = Math.random();
        let size, color, shape;

        if (particleType > 0.8) {
            // Large glowing orbs
            size = Math.random() * 8 + 4;
            const useAltColor = Math.random() > 0.5;
            color = useAltColor ? 'rgba(157, 0, 255, 0.6)' : 'rgba(0, 243, 255, 0.6)';
            shape = '50%'; // Circle
            particle.style.boxShadow = `0 0 15px ${color}`;
            particle.style.filter = `blur(${Math.random() * 2 + 1}px)`;
        } else if (particleType > 0.5) {
            // Medium data points
            size = Math.random() * 4 + 2;
            color = 'rgba(0, 243, 255, 0.7)';
            shape = Math.random() > 0.3 ? '50%' : '2px'; // Mix of circles and squares
            particle.style.boxShadow = `0 0 8px ${color}`;
        } else {
            // Small dust particles
            size = Math.random() * 2 + 0.5;
            color = Math.random() > 0.7 ? 'rgba(157, 0, 255, 0.5)' : 'rgba(255, 255, 255, 0.5)';
            shape = '50%'; // Circle
            particle.style.boxShadow = `0 0 3px ${color}`;
        }

        // Apply styles
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.backgroundColor = color;
        particle.style.borderRadius = shape;

        // Random starting position
        const posX = Math.random() * window.innerWidth;
        const posY = Math.random() * window.innerHeight;
        const posZ = Math.random() * 200 - 100; // Z position for 3D effect

        particle.style.left = `${posX}px`;
        particle.style.top = `${posY}px`;
        particle.style.zIndex = Math.floor(posZ / 10);

        // Store particle data for animation
        const particleData = {
            element: particle,
            x: posX,
            y: posY,
            z: posZ,
            size: size,
            speed: Math.random() * 0.5 + 0.2,
            type: particleType
        };

        particles.push(particleData);
        particlesContainer.appendChild(particle);
    }

    // Animate particles with mouse interaction
    function animateParticles() {
        particles.forEach(particle => {
            // Calculate distance from mouse
            const dx = mouseX - particle.x;
            const dy = mouseY - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Different behavior based on particle type
            if (particle.type > 0.8) {
                // Large particles are attracted to mouse
                const attractFactor = 100 / (distance + 100) * particle.speed;
                particle.x += dx * attractFactor * 0.05;
                particle.y += dy * attractFactor * 0.05;
            } else if (particle.type > 0.5) {
                // Medium particles move away from mouse
                const repelFactor = 150 / (distance + 150) * particle.speed;
                particle.x -= dx * repelFactor * 0.03;
                particle.y -= dy * repelFactor * 0.03;
            } else {
                // Small particles drift randomly
                particle.x += (Math.random() - 0.5) * particle.speed;
                particle.y += (Math.random() - 0.5) * particle.speed;
            }

            // Add some random movement
            particle.x += (Math.random() - 0.5) * particle.speed;
            particle.y += (Math.random() - 0.5) * particle.speed;
            particle.z += (Math.random() - 0.5) * particle.speed * 2;

            // Keep particles within bounds
            if (particle.x < -50) particle.x = window.innerWidth + 50;
            if (particle.x > window.innerWidth + 50) particle.x = -50;
            if (particle.y < -50) particle.y = window.innerHeight + 50;
            if (particle.y > window.innerHeight + 50) particle.y = -50;
            if (particle.z < -100) particle.z = 100;
            if (particle.z > 100) particle.z = -100;

            // Apply position
            particle.element.style.left = `${particle.x}px`;
            particle.element.style.top = `${particle.y}px`;
            particle.element.style.zIndex = Math.floor(particle.z / 10);

            // Scale based on z position for 3D effect
            const scale = (particle.z + 100) / 200 * 0.5 + 0.5;
            particle.element.style.transform = `scale(${scale})`;

            // Adjust opacity based on z position
            const opacity = (particle.z + 100) / 200 * 0.6 + 0.2;
            particle.element.style.opacity = opacity;
        });

        requestAnimationFrame(animateParticles);
    }

    // Start animation loop
    animateParticles();
}

// Animate glowing elements function removed as requested

// Initialize animations
document.addEventListener('DOMContentLoaded', () => {
    // Initialize base animations
    animateNumbers();
    animateGridBackground();
    createParticles();
    // animateGlowElements() removed as requested

    // Add event listeners for any interactive elements
    document.querySelectorAll('.cyber-button').forEach(button => {
        button.addEventListener('mouseenter', () => {
            anime({
                targets: button,
                scale: 1.1,
                duration: 300,
                easing: 'easeOutQuad'
            });
        });

        button.addEventListener('mouseleave', () => {
            anime({
                targets: button,
                scale: 1,
                duration: 300,
                easing: 'easeOutQuad'
            });
        });
    });
});