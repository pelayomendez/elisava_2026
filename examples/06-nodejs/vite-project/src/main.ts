import './style.css'
import confetti from "@hiseb/confetti";

confetti({
    position: { x: 0, y: 0 },	// Origin position
    count: 100,			// Number of particles
    size: 1,			// Size of the particles
    velocity: 200,		// Initial particle velocity
    fade: false			// Particles fall off the screen, or fade out
});

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `<p>Hello Vite!</p>`
