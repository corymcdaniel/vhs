// VHS Effects and Interactions

// Background cycling system
let backgroundImages = [
    'backgrounds/20250906_194829.jpg',
    'backgrounds/20250906_201009.jpg',
    'backgrounds/bg.jpg'
];
let currentBackgroundIndex = 0;

function cycleBackgrounds() {
    const vhsContainer = document.querySelector('.vhs-container');

    setInterval(() => {
        // Start VHS transition effect
        triggerVHSTransition(vhsContainer, () => {
            // Change background during the peak of the transition
            currentBackgroundIndex = (currentBackgroundIndex + 1) % backgroundImages.length;
            const newBackground = backgroundImages[currentBackgroundIndex];

            vhsContainer.style.backgroundImage = `linear-gradient(rgba(26, 26, 46, 0.7), rgba(22, 33, 62, 0.7), rgba(15, 52, 96, 0.7)), url('${newBackground}')`;

            console.log(`📺 Background changed to: ${newBackground}`);
        });
    }, 15000); // Change every 15 seconds
}

function triggerVHSTransition(container, onPeak) {
    // Phase 1: Heavy static and distortion
    const staticOverlay = document.querySelector('.static-overlay');
    staticOverlay.style.opacity = '0.9';
    staticOverlay.style.background = `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><filter id="noise"><feTurbulence baseFrequency="3.0" numOctaves="8" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter></defs><rect width="100%" height="100%" filter="url(%23noise)" opacity="0.8"/></svg>')`;

    container.style.filter = `
        contrast(5)
        brightness(0.05)
        saturate(0.01)
        sepia(1.0)
        hue-rotate(${Math.random() * 360}deg)
        blur(4px)
    `;
    container.style.transform = `translateX(${Math.random() * 50 - 25}px) skewX(${Math.random() * 10 - 5}deg)`;

    // Phase 2: Peak distortion - trigger background change
    setTimeout(() => {
        container.style.filter = `
            contrast(8)
            brightness(0.02)
            saturate(0.005)
            sepia(1.0)
            hue-rotate(${Math.random() * 360}deg)
            blur(8px)
        `;
        container.style.transform = `translateX(${Math.random() * 80 - 40}px) skewX(${Math.random() * 15 - 7.5}deg)`;

        // Change background at peak distortion
        onPeak();
    }, 200);

    // Phase 3: Gradual recovery
    setTimeout(() => {
        container.style.filter = `
            contrast(3)
            brightness(0.1)
            saturate(0.02)
            sepia(0.8)
            hue-rotate(${Math.random() * 180}deg)
            blur(2px)
        `;
        container.style.transform = `translateX(${Math.random() * 20 - 10}px) skewX(${Math.random() * 5 - 2.5}deg)`;

        staticOverlay.style.opacity = '0.6';
    }, 400);

    // Phase 4: Return to normal
    setTimeout(() => {
        container.style.filter = '';
        container.style.transform = '';
        staticOverlay.style.opacity = '0.3';
        staticOverlay.style.background = `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><filter id="noise"><feTurbulence baseFrequency="0.9" numOctaves="4" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter></defs><rect width="100%" height="100%" filter="url(%23noise)" opacity="0.1"/></svg>')`;
    }, 800);
}

// Random glitch effects
function addRandomGlitches() {
    const textElement = document.querySelector('.vhs-text');
    
    setInterval(() => {
        if (Math.random() < 0.1) {
            textElement.style.transform = `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)`;
            textElement.style.filter = `hue-rotate(${Math.random() * 360}deg) contrast(${1 + Math.random() * 0.5})`;
            
            setTimeout(() => {
                textElement.style.transform = 'translate(0, 0)';
                textElement.style.filter = 'none';
            }, 50 + Math.random() * 100);
        }
    }, 200);
}

// Update timestamp counter
function updateTimestamp() {
    const timestamp = document.querySelector('.vhs-timestamp');
    let seconds = 257; // Starting at 00:42:17
    
    setInterval(() => {
        seconds++;
        const hours = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        timestamp.textContent = `REC ${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }, 1000);
}

// Random static bursts
function addStaticBursts() {
    setInterval(() => {
        if (Math.random() < 0.02) {
            const staticOverlay = document.querySelector('.static-overlay');
            staticOverlay.style.opacity = '0.6';
            setTimeout(() => {
                staticOverlay.style.opacity = '0.3';
            }, 100 + Math.random() * 200);
        }
    }, 2000);
}

// Typewriter effect for text
function typeWriter() {
    const lines = document.querySelectorAll('.vhs-text .line');
    let currentLine = 0;
    
    function typeLine() {
        if (currentLine >= lines.length) return;
        
        const line = lines[currentLine];
        const text = line.textContent;
        line.textContent = '';
        line.style.opacity = '1';
        
        let charIndex = 0;
        const typeInterval = setInterval(() => {
            if (charIndex < text.length) {
                line.textContent += text.charAt(charIndex);
                charIndex++;
                
                // Add some randomness to typing speed
                if (Math.random() < 0.1) {
                    clearInterval(typeInterval);
                    setTimeout(() => {
                        const newInterval = setInterval(() => {
                            if (charIndex < text.length) {
                                line.textContent += text.charAt(charIndex);
                                charIndex++;
                            } else {
                                clearInterval(newInterval);
                                currentLine++;
                                setTimeout(typeLine, 500 + Math.random() * 1000);
                            }
                        }, 50 + Math.random() * 100);
                    }, 200 + Math.random() * 300);
                }
            } else {
                clearInterval(typeInterval);
                currentLine++;
                setTimeout(typeLine, 500 + Math.random() * 1000);
            }
        }, 50 + Math.random() * 100);
    }
    
    // Hide all lines initially
    lines.forEach(line => {
        line.style.opacity = '0';
    });
    
    // Start typing after a delay
    setTimeout(typeLine, 1000);
}

// Tracking line glitches
function addTrackingGlitches() {
    const trackingLines = document.querySelector('.tracking-lines');
    
    setInterval(() => {
        if (Math.random() < 0.03) {
            trackingLines.style.transform = `translateY(${Math.random() * 10 - 5}px)`;
            trackingLines.style.opacity = Math.random() * 0.3 + 0.1;
            
            setTimeout(() => {
                trackingLines.style.transform = '';
                trackingLines.style.opacity = '';
            }, 100 + Math.random() * 200);
        }
    }, 1000);
}

// Scan line intensity variations
function addScanlineVariations() {
    const scanLines = document.querySelector('.scan-lines');
    
    setInterval(() => {
        const intensity = Math.random() * 0.05 + 0.02;
        scanLines.style.background = `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 255, 0, ${intensity}) 2px,
            rgba(0, 255, 0, ${intensity}) 4px
        )`;
    }, 2000);
}

// Dramatic background glitch effects
function addBackgroundGlitches() {
    const vhsContainer = document.querySelector('.vhs-container');
    
    setInterval(() => {
        if (Math.random() < 0.08) {
            // Random dramatic background distortion
            const intensity = Math.random() * 0.5 + 0.5;
            vhsContainer.style.filter = `
                contrast(${2 + intensity}) 
                brightness(${0.1 + Math.random() * 0.3}) 
                saturate(${Math.random() * 0.1}) 
                sepia(${0.8 + Math.random() * 0.2})
                hue-rotate(${Math.random() * 360}deg)
                blur(${Math.random() * 2}px)
            `;
            
            setTimeout(() => {
                vhsContainer.style.filter = '';
            }, 100 + Math.random() * 200);
        }
    }, 300);
}

// Random background displacement
function addBackgroundDisplacement() {
    const vhsContainer = document.querySelector('.vhs-container');
    
    setInterval(() => {
        if (Math.random() < 0.05) {
            const displacement = Math.random() * 10 - 5;
            vhsContainer.style.transform = `translateX(${displacement}px) skewX(${Math.random() * 2 - 1}deg)`;
            
            setTimeout(() => {
                vhsContainer.style.transform = '';
            }, 50 + Math.random() * 150);
        }
    }, 800);
}

// Initialize all effects when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎬 Initializing VHS effects...');

    addRandomGlitches();
    updateTimestamp();
    addStaticBursts();
    typeWriter();
    addTrackingGlitches();
    addScanlineVariations();
    addBackgroundGlitches();
    addBackgroundDisplacement();
    cycleBackgrounds();
    initCatModal();
    
    // Add test button functionality
    const testButton = document.getElementById('testButton');
    if (testButton) {
        testButton.addEventListener('click', function() {
            console.log('Test button clicked - triggering background glitch!');
            const vhsContainer = document.querySelector('.vhs-container');
            
            vhsContainer.style.filter = `
                contrast(4) 
                brightness(0.1) 
                saturate(0.02) 
                sepia(1.0)
                hue-rotate(${Math.random() * 360}deg)
                blur(3px)
            `;
            vhsContainer.style.transform = `translateX(${Math.random() * 40 - 20}px) skewX(${Math.random() * 8 - 4}deg)`;
            
            setTimeout(() => {
                vhsContainer.style.filter = '';
                vhsContainer.style.transform = '';
            }, 500);
        });
        
        console.log('✅ Test button initialized');
    }

    // Add toggle effects button functionality
    const toggleEffectsButton = document.getElementById('toggleEffects');
    if (toggleEffectsButton) {
        toggleEffectsButton.addEventListener('click', toggleEffects);
        console.log('✅ Accessibility toggle initialized');
    }

    // Debug: Check if links are clickable
    const allLinks = document.querySelectorAll('.vhs-text a, .vhs-text .cat-link');
    console.log(`🔗 Found ${allLinks.length} clickable elements:`, allLinks);

    allLinks.forEach((link, index) => {
        // Add visual debugging
        link.style.border = '1px solid rgba(255, 0, 0, 0.3)';

        link.addEventListener('click', function(e) {
            console.log(`🖱️ Link ${index} clicked:`, this.textContent);
            alert(`Link clicked: ${this.textContent}`);
        });

        link.addEventListener('mouseover', function() {
            console.log(`🖱️ Mouse over link: ${this.textContent}`);
        });
    });

    console.log('VHS chaos initialized... my tape ran out...');
});

// Add some keyboard interactions for fun
document.addEventListener('keydown', function(e) {
    const vhsContainer = document.querySelector('.vhs-container');
    const textElement = document.querySelector('.vhs-text');
    const staticOverlay = document.querySelector('.static-overlay');
    
    // Prevent default behavior for our custom keys
    if (['g', 'b', 'r', 'n', ' '].includes(e.key.toLowerCase())) {
        e.preventDefault();
    }
    
    switch(e.key.toLowerCase()) {
        case ' ': // Spacebar for static burst
            console.log('Static burst triggered!');
            staticOverlay.style.opacity = '0.9';
            staticOverlay.style.background = `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><filter id="noise"><feTurbulence baseFrequency="2.0" numOctaves="6" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter></defs><rect width="100%" height="100%" filter="url(%23noise)" opacity="0.3"/></svg>')`;
            setTimeout(() => {
                staticOverlay.style.opacity = '0.3';
                staticOverlay.style.background = `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><filter id="noise"><feTurbulence baseFrequency="0.9" numOctaves="4" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter></defs><rect width="100%" height="100%" filter="url(%23noise)" opacity="0.1"/></svg>')`;
            }, 300);
            break;
            
        case 'g': // 'g' for text glitch
            console.log('Text glitch triggered!');
            const glitchX = Math.random() * 20 - 10;
            const glitchY = Math.random() * 20 - 10;
            const skewAmount = Math.random() * 10 - 5;
            const hueShift = Math.random() * 360;
            const contrastBoost = 2 + Math.random() * 3;
            
            textElement.style.transform = `translate(${glitchX}px, ${glitchY}px) skew(${skewAmount}deg)`;
            textElement.style.filter = `hue-rotate(${hueShift}deg) contrast(${contrastBoost}) brightness(1.5)`;
            
            setTimeout(() => {
                textElement.style.transform = '';
                textElement.style.filter = '';
            }, 400);
            break;
            
        case 'b': // 'b' for dramatic background glitch
            console.log('DRAMATIC background glitch triggered!');
            const bgContrast = 3 + Math.random() * 2;
            const bgBrightness = 0.05 + Math.random() * 0.15;
            const bgSaturation = Math.random() * 0.05;
            const bgSepia = 0.9 + Math.random() * 0.1;
            const bgHue = Math.random() * 360;
            const bgBlur = Math.random() * 4;
            const translateX = Math.random() * 30 - 15;
            const skewX = Math.random() * 6 - 3;
            
            vhsContainer.style.filter = `
                contrast(${bgContrast}) 
                brightness(${bgBrightness}) 
                saturate(${bgSaturation}) 
                sepia(${bgSepia})
                hue-rotate(${bgHue}deg)
                blur(${bgBlur}px)
            `;
            vhsContainer.style.transform = `translateX(${translateX}px) skewX(${skewX}deg)`;
            
            // Add a second pulse effect
            setTimeout(() => {
                vhsContainer.style.filter = `
                    contrast(${bgContrast * 1.5}) 
                    brightness(${bgBrightness * 0.5}) 
                    saturate(0.01) 
                    sepia(1.0)
                    hue-rotate(${bgHue + 180}deg)
                    blur(${bgBlur * 2}px)
                `;
            }, 200);
            
            setTimeout(() => {
                vhsContainer.style.filter = '';
                vhsContainer.style.transform = '';
            }, 600);
            break;
            
        case 'n': // 'n' for next background
            console.log('Manual background change triggered!');
            triggerVHSTransition(vhsContainer, () => {
                currentBackgroundIndex = (currentBackgroundIndex + 1) % backgroundImages.length;
                const newBackground = backgroundImages[currentBackgroundIndex];
                vhsContainer.style.backgroundImage = `linear-gradient(rgba(26, 26, 46, 0.7), rgba(22, 33, 62, 0.7), rgba(15, 52, 96, 0.7)), url('${newBackground}')`;
                console.log(`📺 Manual background changed to: ${newBackground}`);
            });
            break;

        case 'r': // 'r' to reset/restart effects
            console.log('Reloading page...');
            location.reload();
            break;
    }
});

// Show controls hint on page load
window.addEventListener('load', function() {
    console.log('🎮 VHS CONTROLS:');
    console.log('SPACEBAR = Static burst');
    console.log('G = Text glitch');
    console.log('B = DRAMATIC background glitch');
    console.log('N = Next background');
    console.log('R = Reset page');
    
    // Optional: Show on-screen hint for a few seconds
    const hint = document.createElement('div');
    hint.innerHTML = `
        <div style="position: fixed; top: 20px; left: 20px; background: rgba(0,0,0,0.8); color: #00ff00; padding: 15px; font-family: 'VT323', monospace; font-size: 16px; z-index: 1000; border: 1px solid #00ff00;">
            🎮 CONTROLS:<br>
            SPACEBAR = Static<br>
            G = Text Glitch<br>
            B = BG Destroy<br>
            N = Next BG<br>
            R = Reset
        </div>
    `;
    document.body.appendChild(hint);
    
    setTimeout(() => {
        hint.style.opacity = '0';
        hint.style.transition = 'opacity 1s';
        setTimeout(() => hint.remove(), 1000);
    }, 4000);
});

// Cat Modal functionality
function initCatModal() {
    const modal = document.getElementById('catModal');
    const catImage = document.getElementById('catImage');
    const catName = document.getElementById('catName');
    const closeBtn = document.querySelector('.cat-modal-close');
    const catLinks = document.querySelectorAll('.cat-link');

    // Cat data
    const cats = {
        charlie: {
            name: 'Charlie',
            image: 'cats/charlie.jpg'
        },
        papago: {
            name: 'Papago',
            image: 'cats/papago.jpg'
        }
    };

    // Add click listeners to cat links
    catLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const catKey = this.getAttribute('data-cat');
            const cat = cats[catKey];

            if (cat) {
                // Set modal content
                catName.textContent = cat.name;
                catImage.src = cat.image;
                catImage.alt = `Photo of ${cat.name}`;

                // Add VHS loading effect
                triggerModalVHSEffect();

                // Show modal
                modal.style.display = 'block';

                console.log(`📺 Displaying ${cat.name}'s photo`);
            }
        });
    });

    // Close modal functionality
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
        }
    });
}

function triggerModalVHSEffect() {
    const modalStatic = document.querySelector('.cat-modal-static');
    const modalContent = document.querySelector('.cat-modal-content');

    // Intensify static briefly
    modalStatic.style.opacity = '0.8';
    modalContent.style.filter = 'contrast(3) brightness(0.7) saturate(0.5)';

    setTimeout(() => {
        modalStatic.style.opacity = '0.2';
        modalContent.style.filter = '';
    }, 300);
}

// Accessibility - Toggle effects for sensitive users
let effectsReduced = false;

function toggleEffects() {
    const toggleButton = document.getElementById('toggleEffects');
    const staticOverlay = document.querySelector('.static-overlay');
    const scanLines = document.querySelector('.scan-lines');
    const trackingLines = document.querySelector('.tracking-lines');
    const vhsScramble = document.querySelector('.vhs-scramble');
    const chromatic = document.querySelector('.chromatic');

    if (!effectsReduced) {
        // Reduce effects
        effectsReduced = true;
        toggleButton.textContent = 'RESTORE EFFECTS';
        toggleButton.style.color = '#00ff00';
        toggleButton.style.borderColor = '#00ff00';
        toggleButton.style.background = 'rgba(0,255,0,0.2)';

        // Hide/reduce flashing elements
        staticOverlay.style.opacity = '0.1';
        staticOverlay.style.animation = 'none';
        scanLines.style.opacity = '0.1';
        scanLines.style.animation = 'none';
        trackingLines.style.opacity = '0.05';
        trackingLines.style.animation = 'none';
        vhsScramble.style.opacity = '0.02';
        vhsScramble.style.animation = 'none';

        // Reduce chromatic aberration
        if (chromatic) {
            chromatic.style.filter = 'drop-shadow(0.5px 0 0 #ff0000) drop-shadow(-0.5px 0 0 #0000ff)';
            chromatic.style.animation = 'none';
        }

        console.log('✅ Effects reduced for accessibility');
    } else {
        // Restore effects
        effectsReduced = false;
        toggleButton.textContent = 'REDUCE EFFECTS';
        toggleButton.style.color = '#ffff00';
        toggleButton.style.borderColor = '#ffff00';
        toggleButton.style.background = 'rgba(255,255,0,0.2)';

        // Restore original effects
        staticOverlay.style.opacity = '0.3';
        staticOverlay.style.animation = 'staticFlicker 0.1s infinite';
        scanLines.style.opacity = '';
        scanLines.style.animation = 'scanlineMove 2s linear infinite';
        trackingLines.style.opacity = '';
        trackingLines.style.animation = 'trackingMove 15s linear infinite';
        vhsScramble.style.opacity = '0.1';
        vhsScramble.style.animation = 'scrambleMove 20s infinite linear';

        // Restore chromatic aberration
        if (chromatic) {
            chromatic.style.filter = '';
            chromatic.style.animation = '';
        }

        console.log('✅ Effects restored');
    }
}