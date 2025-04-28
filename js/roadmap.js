// Helper function to set up SVG path drawing animations
function setupSVGAnimation(pathElement, duration, delay = 0, easing = 'easeInOutQuad') {
    if (!pathElement || !(pathElement instanceof SVGElement)) return;

    // Get the total length of the path
    const totalLength = pathElement.getTotalLength ? pathElement.getTotalLength() : 0;
    if (totalLength === 0) return;

    // Set up initial state - invisible path
    pathElement.style.strokeDasharray = totalLength;
    pathElement.style.strokeDashoffset = totalLength;

    // Create the animation
    anime({
        targets: pathElement,
        strokeDashoffset: [totalLength, 0],
        duration: duration,
        delay: delay,
        easing: easing
    });
}

// Timeline animation removed
function setupScrollBasedTimeline() {
    // Function kept empty to avoid breaking references
    // Timeline line has been removed
}

// Roadmap specific animations and interactions
document.addEventListener('DOMContentLoaded', () => {

    initializeRoadmap();
    setupScrollAnimations();
    setupPhaseNavigation();
    // Use the enhanced scroll-based timeline instead of the basic animation
    setupScrollBasedTimeline();
    setupExpandableDetails();
    setupThemeToggle();
    setupTeamViewToggle();
    drawDependencyArrows();
    // Initialize progress bars
    animateTimelineProgress();
    // Setup date scale progress indicator
    setupDateScaleProgress();
});

// Initialize roadmap elements
function initializeRoadmap() {
    // Set data-text attribute for glitch effect
    document.querySelectorAll('.glitch-text').forEach(el => {
        el.setAttribute('data-text', el.textContent);
    });

    // Animate the title text
    animateTitleText();

    // Enhanced phase card animations with intersection observer
    const phaseCards = document.querySelectorAll('.phase-card');

    // Create an intersection observer for scroll-based animations
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                const card = entry.target;

                // Staggered entrance animation
                anime({
                    targets: card,
                    opacity: [0, 1],
                    translateY: [80, 0],
                    scale: [0.8, 1],
                    rotateX: [10, 0],
                    duration: 1200,
                    delay: 200 + (index % 5) * 150, // Stagger based on phase number
                    easing: 'easeOutElastic(1, .6)',
                    complete: () => {
                        // Add a subtle hover effect after animation completes
                        card.classList.add('animated');

                        // Add a subtle continuous glow animation
                        anime({
                            targets: card,
                            boxShadow: [
                                '0 0 10px rgba(0, 243, 255, 0.3)',
                                '0 0 20px rgba(0, 243, 255, 0.5)',
                                '0 0 10px rgba(0, 243, 255, 0.3)'
                            ],
                            duration: 3000,
                            easing: 'easeInOutSine',
                            direction: 'alternate',
                            loop: true
                        });
                    }
                });

                // Animate the card content with staggered delays
                anime({
                    targets: card.querySelectorAll('.phase-title, .phase-subtitle, .task-item, .team-member'),
                    opacity: [0, 1],
                    translateX: [20, 0],
                    delay: anime.stagger(100, {start: 500 + (index % 5) * 150}),
                    duration: 800,
                    easing: 'easeOutQuad'
                });

                // Unobserve after animation
                cardObserver.unobserve(card);
            }
        });
    }, { threshold: 0.2 }); // Trigger when 20% of the card is visible

    // Observe each card
    phaseCards.forEach(card => {
        // Set initial state
        card.style.opacity = '0';
        card.style.transform = 'translateY(80px) scale(0.8) rotateX(10deg)';

        // Start observing
        cardObserver.observe(card);
    });

    // Animate timeline line drawing
    const timelinePath = document.querySelector('.timeline-line');
    if (timelinePath) {
        setupSVGAnimation(timelinePath, 2000);
    }
}

// Animate the title text with traveling light effect
function animateTitleText() {
    const baseTitle = document.querySelector('.title-text-base');
    const lightTitle = document.querySelector('.title-text-light');
    const travelingLight = document.getElementById('traveling-light');

    if (!baseTitle || !lightTitle || !travelingLight) return;

    // First, make the base text appear with a fade-in effect
    anime({
        targets: baseTitle,
        opacity: [0, 1],
        easing: 'easeInOutSine',
        duration: 1000,
        complete: function() {
            // After the base text appears, start the traveling light animation
            animateTravelingLight();
        }
    });

    // Function to animate the traveling light
    function animateTravelingLight() {
        // Initial state - light at the beginning
        anime.set(travelingLight, {
            x1: '-100%',
            x2: '0%'
        });

        // Make the light text visible
        anime.set(lightTitle, {
            opacity: 1
        });

        // Animate the light traveling through the text
        anime({
            targets: travelingLight,
            x1: ['0%', '100%'],
            x2: ['100%', '200%'],
            easing: 'easeInOutSine',
            duration: 2000,
            complete: function() {
                // After the first pass, set up a continuous animation
                // that repeats every few seconds
                setTimeout(() => {
                    anime({
                        targets: travelingLight,
                        x1: ['-100%', '100%'],
                        x2: ['0%', '200%'],
                        easing: 'easeInOutSine',
                        duration: 3000,
                        delay: 2000,
                        loop: true,
                        loopBegin: function() {
                            // Briefly increase the glow at the start of each loop
                            anime({
                                targets: baseTitle,
                                filter: [
                                    'url(#glow)',
                                    'url(#glow) brightness(1.5)',
                                    'url(#glow)'
                                ],
                                duration: 1000,
                                easing: 'easeOutQuad'
                            });
                        }
                    });
                }, 1000);
            }
        });
    }

    // Animate binary timeline nodes
    anime({
        targets: '.binary-timeline .node',
        opacity: [0, 1],
        translateY: [10, 0],
        delay: anime.stagger(100),
        duration: 800,
        easing: 'easeOutQuad'
    });
}

// Setup scroll-triggered animations
function setupScrollAnimations() {
    // Simple scroll detection for animations
    const animateOnScroll = () => {
        const phases = document.querySelectorAll('.timeline-phase');

        phases.forEach(phase => {
            const phasePosition = phase.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;

            if (phasePosition < screenPosition) {
                // Animate phase card
                const card = phase.querySelector('.phase-card');
                if (!card.classList.contains('animated')) {
                    card.classList.add('animated');

                    // Different animation based on even/odd position
                    const isEven = Array.from(phases).indexOf(phase) % 2 === 0;

                    anime({
                        targets: card,
                        translateX: [isEven ? -30 : 30, 0],
                        opacity: [0, 1],
                        duration: 800,
                        easing: 'easeOutCubic'
                    });

                    // Animate task items with stagger
                    anime({
                        targets: card.querySelectorAll('.task-item'),
                        translateX: [20, 0],
                        opacity: [0, 1],
                        delay: anime.stagger(100),
                        duration: 600,
                        easing: 'easeOutCubic'
                    });
                }

                // Animate progress bar
                const progressBar = phase.querySelector('.progress-bar');
                if (progressBar && !progressBar.classList.contains('animated')) {
                    progressBar.classList.add('animated');

                    // Get progress value
                    const progress = parseInt(progressBar.getAttribute('data-progress'));

                    // Animate progress bar
                    anime({
                        targets: progressBar,
                        width: `${progress}%`,
                        duration: 1500,
                        easing: 'easeOutQuart',
                        delay: 300
                    });
                }

                // We no longer animate arrows here - they're handled by the drawDependencyArrows function
                // This prevents duplicate animations when scrolling
            }
        });
    };

    // Run on initial load
    animateOnScroll();

    // Add scroll event listener
    window.addEventListener('scroll', animateOnScroll);
}

// Setup phase navigation
function setupPhaseNavigation() {
    document.querySelectorAll('.cyber-button[data-phase]').forEach(button => {
        button.addEventListener('click', () => {
            const phaseId = button.getAttribute('data-phase');
            const phaseElement = document.getElementById(phaseId);

            if (phaseElement) {
                // Highlight active button
                document.querySelectorAll('.cyber-button[data-phase]').forEach(btn => {
                    btn.classList.remove('active');
                });
                button.classList.add('active');

                // Scroll to phase with animation
                window.scrollTo({
                    top: phaseElement.offsetTop - 100,
                    behavior: 'smooth'
                });

                // Add highlight animation to the phase
                anime({
                    targets: phaseElement.querySelector('.phase-card'),
                    boxShadow: [
                        '0 0 5px rgba(0, 243, 255, 0.5)',
                        '0 0 30px rgba(0, 243, 255, 0.8)',
                        '0 0 5px rgba(0, 243, 255, 0.5)'
                    ],
                    duration: 1500,
                    easing: 'easeInOutSine'
                });
            }
        });
    });

    // Set first button as active by default
    const firstButton = document.querySelector('.cyber-button[data-phase]');
    if (firstButton) {
        firstButton.classList.add('active');
    }
}

// Animate progress bars
function animateTimelineProgress() {
    // Use Intersection Observer to animate progress bars when they come into view
    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const progress = parseInt(progressBar.getAttribute('data-progress'));

                // Animate the progress bar width
                anime({
                    targets: progressBar,
                    width: `${progress}%`,
                    duration: 1500,
                    easing: 'easeOutQuart',
                    delay: 300
                });

                // Stop observing after animation
                progressObserver.unobserve(progressBar);
            }
        });
    }, { threshold: 0.2 });

    // Observe all progress bars
    document.querySelectorAll('.progress-bar').forEach(bar => {
        progressObserver.observe(bar);
    });
}

// Setup expandable details sections with enhanced animations
function setupExpandableDetails() {
    document.querySelectorAll('.expand-details-btn').forEach(button => {
        // Prepare the details sections for animation
        const card = button.closest('.phase-card');
        const details = card.querySelector('.phase-details');

        // Set initial styles for smooth animations
        if (details.classList.contains('hidden')) {
            details.style.height = '0';
            details.style.overflow = 'hidden';
            details.style.opacity = '0';
            details.style.display = 'none';
        } else {
            details.style.height = 'auto';
            details.style.overflow = 'hidden';
            details.style.opacity = '1';
        }

        // Add click event listener
        button.addEventListener('click', () => {
            const isHidden = details.classList.contains('hidden');

            if (isHidden) {
                // Prepare for animation
                details.classList.remove('hidden');
                details.style.display = 'block';
                details.style.height = '0';
                details.style.overflow = 'hidden';
                details.style.opacity = '0';

                // Force a reflow to ensure the initial state is applied
                void details.offsetHeight;

                // Get the target height
                const targetHeight = details.scrollHeight;

                // Update button state with animation
                anime({
                    targets: button,
                    scale: [1, 1.1, 1],
                    duration: 400,
                    easing: 'easeOutBack'
                });

                // Smoothly change text
                setTimeout(() => {
                    button.textContent = 'Details -';
                }, 200);

                // Create a single, smoother animation for the entire expansion
                anime({
                    targets: details,
                    height: [0, targetHeight],
                    opacity: [0, 1],
                    duration: 600, // Slightly longer than closing for better effect
                    easing: 'easeOutQuad', // Smoother easing
                    begin: () => {
                        // Set initial scale
                        details.style.transform = 'scale(0.98)';
                    },
                    update: (anim) => {
                        // Add a subtle scale effect during the animation
                        const progress = anim.progress / 100;
                        const scaleValue = 0.98 + (0.02 * progress); // Scale from 0.98 to 1
                        details.style.transform = `scale(${scaleValue})`;
                    },
                    complete: () => {
                        // Reset transform properties
                        details.style.transform = '';
                        // Set height to auto after animation completes for responsive behavior
                        details.style.height = 'auto';

                        // Animate content with staggered effect after container expands
                        anime({
                            targets: details.querySelectorAll('h3, h4, p, li'),
                            translateY: [8, 0], // Start slightly below final position
                            opacity: [0, 1],
                            delay: anime.stagger(30), // Stagger from first to last
                            duration: 500,
                            easing: 'easeOutQuad'
                        });
                    }
                });

            } else {
                // Update button state with animation
                anime({
                    targets: button,
                    scale: [1, 1.1, 1],
                    duration: 400,
                    easing: 'easeOutBack'
                });

                // Smoothly change text
                setTimeout(() => {
                    button.textContent = 'Details +';
                }, 200);

                // Store the current height before any changes
                const startHeight = details.scrollHeight;

                // Ensure the height is set to the exact current height to prevent jumping
                details.style.height = `${startHeight}px`;
                details.style.overflow = 'hidden';

                // Force a reflow to ensure the height is applied
                void details.offsetHeight;

                // Create a single, faster animation for the entire collapse
                anime({
                    targets: details,
                    height: [startHeight, 0],
                    opacity: [1, 0],
                    duration: 500, // Faster duration for quicker collapse
                    easing: 'easeOutQuad', // Changed to easeOutQuad for faster start
                    begin: () => {
                        // Fade out content with faster staggered effect
                        anime({
                            targets: details.querySelectorAll('h3, h4, p, li'),
                            translateY: [0, -8], // Subtle upward movement
                            opacity: [1, 0],
                            delay: anime.stagger(10, {from: 'last'}), // Even faster stagger
                            duration: 200, // Faster content fade
                            easing: 'easeOutQuad'
                        });
                    },
                    update: (anim) => {
                        // Add a more subtle scale effect during the animation
                        const progress = anim.progress / 100;
                        const scaleValue = 1 - (0.01 * progress); // More subtle scale from 1 to 0.99
                        details.style.transform = `scale(${scaleValue})`;
                    },
                    complete: () => {
                        // Reset transform properties
                        details.style.transform = '';
                        details.style.height = '0';
                        // Hide after animation completes
                        details.classList.add('hidden');
                        details.style.display = 'none';
                    }
                });
            }
        });
    });
}

// Setup theme toggle (dark/light mode)
function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const modeIcon = themeToggle.querySelector('.mode-icon');
    const moonIcon = themeToggle.querySelector('.moon-icon');
    const sunIcon = themeToggle.querySelector('.sun-icon');
    const travelingLight = document.getElementById('traveling-light');
    const travelingLightLight = document.getElementById('traveling-light-light');
    const baseTitle = document.querySelector('.title-text-base');
    const lightTitle = document.querySelector('.title-text-light');

    // Add tooltip for compact button
    themeToggle.setAttribute('title', 'Toggle Light/Dark Mode');

    themeToggle.addEventListener('click', () => {
        const body = document.body;

        if (body.classList.contains('light-mode')) {
            // Switch to dark mode
            body.classList.remove('light-mode');

            // Animate button
            anime({
                targets: themeToggle,
                scale: [1, 1.2, 1],
                duration: 400,
                easing: 'easeOutBack'
            });

            // Animate transition to dark mode
            anime({
                targets: '.tech-grid-bg',
                opacity: [0.3, 0.9],
                duration: 800,
                easing: 'easeOutQuad',
                complete: function() {
                    // Add a pulse effect to make the grid more noticeable
                    anime({
                        targets: '.tech-grid-bg',
                        filter: [
                            'blur(0.5px)',
                            'blur(0px) brightness(1.2)',
                            'blur(0.5px)'
                        ],
                        duration: 1000,
                        easing: 'easeInOutQuad'
                    });
                }
            });

            // Reset the traveling light animation for dark mode
            if (travelingLight && lightTitle) {
                // Reset positions
                anime.set(travelingLight, {
                    x1: '-100%',
                    x2: '0%'
                });

                // Start the animation again
                anime({
                    targets: travelingLight,
                    x1: ['0%', '100%'],
                    x2: ['100%', '200%'],
                    easing: 'easeInOutSine',
                    duration: 2000
                });

                // Briefly increase the glow
                anime({
                    targets: baseTitle,
                    filter: [
                        'url(#glow)',
                        'url(#glow) brightness(1.5)',
                        'url(#glow)'
                    ],
                    duration: 1000,
                    easing: 'easeOutQuad'
                });
            }
        } else {
            // Switch to light mode
            body.classList.add('light-mode');

            // Animate button
            anime({
                targets: themeToggle,
                scale: [1, 1.2, 1],
                duration: 400,
                easing: 'easeOutBack'
            });

            // Animate transition to light mode
            anime({
                targets: '.tech-grid-bg',
                opacity: [0.9, 0.7],
                duration: 800,
                easing: 'easeOutQuad',
                complete: function() {
                    // Add a pulse effect to make the grid more noticeable
                    anime({
                        targets: '.tech-grid-bg',
                        filter: [
                            'blur(0.5px)',
                            'blur(0px) brightness(1.2)',
                            'blur(0.5px)'
                        ],
                        duration: 1000,
                        easing: 'easeInOutQuad'
                    });
                }
            });

            // Reset the traveling light animation for light mode
            if (travelingLightLight && lightTitle) {
                // Reset positions
                anime.set(travelingLightLight, {
                    x1: '-100%',
                    x2: '0%'
                });

                // Start the animation again
                anime({
                    targets: travelingLightLight,
                    x1: ['0%', '100%'],
                    x2: ['100%', '200%'],
                    easing: 'easeInOutSine',
                    duration: 2000
                });

                // Briefly increase the glow
                anime({
                    targets: [baseTitle, baseSubtitle],
                    filter: [
                        'url(#glow)',
                        'url(#glow) brightness(1.5)',
                        'url(#glow)'
                    ],
                    duration: 1000,
                    easing: 'easeOutQuad'
                });
            }
        }
    });
}

// Setup team view toggle
function setupTeamViewToggle() {
    const teamViewToggle = document.getElementById('team-view-toggle');

    // Add tooltip for compact button
    teamViewToggle.setAttribute('title', 'Toggle Team View');

    teamViewToggle.addEventListener('click', () => {
        const teamAllocations = document.querySelectorAll('.team-allocation');
        const isTeamViewActive = teamViewToggle.classList.contains('active');

        // Toggle active class for styling
        teamViewToggle.classList.toggle('active');

        // Animate button
        anime({
            targets: teamViewToggle,
            scale: [1, 1.2, 1],
            duration: 400,
            easing: 'easeOutBack'
        });

        if (isTeamViewActive) {
            // Hide team view

            teamAllocations.forEach(section => {
                anime({
                    targets: section,
                    opacity: [1, 0],
                    height: [section.scrollHeight, 0],
                    duration: 500,
                    easing: 'easeOutCubic',
                    complete: () => {
                        section.classList.add('hidden');
                    }
                });
            });

            // Remove highlight from task assignees
            document.querySelectorAll('.task-item').forEach(task => {
                task.removeAttribute('style');
            });
        } else {
            // Show team view
            teamViewToggle.classList.add('active');

            teamAllocations.forEach(section => {
                section.classList.remove('hidden');

                anime({
                    targets: section,
                    opacity: [0, 1],
                    height: [0, section.scrollHeight],
                    duration: 500,
                    easing: 'easeOutCubic'
                });
            });

            // Highlight task assignees
            document.querySelectorAll('.task-item').forEach(task => {
                const assignee = task.getAttribute('data-assignee');
                if (assignee) {
                    task.style.borderLeft = '3px solid var(--neon-blue)';
                    task.style.paddingLeft = '1rem';
                }
            });
        }
    });
}

// PDF export functionality removed as requested

// Draw dependency arrows between phases with chevron animation
function drawDependencyArrows() {
    // We'll use an Intersection Observer to animate arrows when they come into view
    const arrowObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const arrow = entry.target;

                // Skip if already animated to prevent re-animation
                if (arrow.classList.contains('animated')) {
                    return;
                }

                // Mark as animated immediately to prevent duplicate animations
                arrow.classList.add('animated');

                // Find the connected phases
                const connection = arrow.getAttribute('data-connects');
                if (connection) {
                    const [fromId, toId] = connection.split('-');
                    const fromPhase = document.getElementById(fromId);
                    const toPhase = document.getElementById(toId);

                    if (fromPhase && toPhase) {
                        // For chevron arrows, we don't need to do anything special
                        // The CSS animations will handle the animation automatically

                        // We can add some entrance animation for the container
                        anime({
                            targets: arrow.querySelector('.arrow-container'),
                            opacity: [0, 1],
                            translateY: [10, 0],
                            duration: 800,
                            easing: 'easeOutQuad'
                        });

                        // Add a slight delay to each chevron's animation
                        const chevrons = arrow.querySelectorAll('.chevron');
                        chevrons.forEach((chevron, index) => {
                            // Reset any existing animations
                            chevron.style.animation = 'none';

                            // Force reflow
                            void chevron.offsetWidth;

                            // Start animation with staggered delay
                            chevron.style.animation = `chevron-fall 2.5s ${index * 0.5}s infinite`;
                        });
                    }
                }

                // Stop observing after animation starts
                arrowObserver.unobserve(arrow);
            }
        });
    }, { threshold: 0.3 }); // Trigger earlier when 30% of the arrow is visible for smoother experience

    // Observe all arrows that haven't been animated yet
    document.querySelectorAll('.dependency-arrow:not(.animated)').forEach(arrow => {
        arrowObserver.observe(arrow);
    });
}

// Interactive hover effects for phase cards removed as requested

// Team member hover effects removed as requested

// Particle effects removed as we're using chevron arrows instead

// Setup binary sequence timeline
function setupDateScaleProgress() {
    const progressLine = document.querySelector('.binary-timeline .progress-line');
    const timelineNodes = document.querySelectorAll('.binary-timeline .node');
    const phases = document.querySelectorAll('.timeline-phase');
    const binaryTimeline = document.querySelector('.binary-timeline');

    if (!progressLine || !timelineNodes.length || !phases.length) return;

    // Activate the timeline animation
    binaryTimeline.classList.add('animated');

    // Get start and end dates from the timeline
    const startDate = new Date(phases[0].getAttribute('data-start-date'));
    const endDate = new Date(phases[phases.length - 1].getAttribute('data-end-date'));
    const totalDuration = endDate - startDate;

    // Track the last active state to detect changes
    let lastActiveNodeIndex = -1;

    // Function to update the progress indicator based on scroll position
    function updateDateProgress() {
        // Calculate how far down the page we've scrolled
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercentage = Math.min(scrollTop / scrollHeight, 1);

        // Update the progress line width directly for smoother scrolling
        progressLine.style.width = `${scrollPercentage * 100}%`;

        // Remove any "just-active" classes from previous update
        document.querySelectorAll('.binary-timeline .just-active').forEach(el => {
            el.classList.remove('just-active');
        });

        // Calculate which nodes should be active based on scroll position
        let activeNodeCount = 0;

        // Determine how many nodes should be active based on scroll percentage
        if (scrollPercentage > 0) {
            activeNodeCount = Math.ceil(scrollPercentage * timelineNodes.length);
            activeNodeCount = Math.min(activeNodeCount, timelineNodes.length);
        }

        // Update node states
        timelineNodes.forEach((node, idx) => {
            if (idx < activeNodeCount) {
                node.classList.add('active');

                // Mark as just activated if this node just became active
                if (idx === activeNodeCount - 1 && idx > lastActiveNodeIndex) {
                    node.classList.add('just-active');
                }
            } else {
                node.classList.remove('active');
            }
        });

        // Update the last active node index
        lastActiveNodeIndex = activeNodeCount - 1;
    }

    // Add scroll event listener with throttling
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateDateProgress();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Initialize on page load with a slight delay to ensure everything is rendered
    setTimeout(() => {
        updateDateProgress();

        // Add initial animation to the progress bar
        anime({
            targets: dateProgressIndicator,
            boxShadow: [
                '0 0 5px var(--neon-blue)',
                '0 0 15px var(--neon-blue)',
                '0 0 5px var(--neon-blue)'
            ],
            duration: 2000,
            easing: 'easeInOutQuad',
            loop: 2
        });
    }, 300);

    // Add click event listeners to timeline nodes
    timelineNodes.forEach(node => {
        node.addEventListener('click', () => {
            const nodeDate = new Date(node.getAttribute('data-date'));

            // Find the phase closest to this date
            let closestPhase = null;
            let minDiff = Infinity;

            phases.forEach(phase => {
                const phaseStartDate = new Date(phase.getAttribute('data-start-date'));
                const phaseEndDate = new Date(phase.getAttribute('data-end-date'));

                // Check if the node date is within this phase
                if (nodeDate >= phaseStartDate && nodeDate <= phaseEndDate) {
                    closestPhase = phase;
                    return;
                }

                // Otherwise find the closest phase
                const diffStart = Math.abs(nodeDate - phaseStartDate);
                const diffEnd = Math.abs(nodeDate - phaseEndDate);
                const minPhaseDiff = Math.min(diffStart, diffEnd);

                if (minPhaseDiff < minDiff) {
                    minDiff = minPhaseDiff;
                    closestPhase = phase;
                }
            });

            // Scroll to the closest phase
            if (closestPhase) {
                // Add animation to the node when clicked
                node.classList.add('just-active');

                // Animate the matrix dot with a rotation effect
                anime({
                    targets: node.querySelector('.matrix-dot'),
                    rotate: [45, 225, 405],
                    scale: [1, 1.3, 1],
                    duration: 800,
                    easing: 'easeOutElastic(1, .6)'
                });

                // Scroll to the phase
                closestPhase.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    });
}