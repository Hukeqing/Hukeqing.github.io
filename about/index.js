import { createStepController, installStepInputs } from './drivers.js';
import { scenes } from './scene-config.js';
import { createTimeline } from './timeline.js';

const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');

function start() {
    const scrollSurface = document.getElementById('bg');
    const timeline = createTimeline(scenes);
    const render = (progress) => {
        timeline.setProgress(progress);
        window.scrollTo({ top: scrollSurface.offsetHeight * progress });
    };

    const controller = createStepController({
        maxProgress: timeline.totalDuration,
        render,
        // The scene sequence is unchanged; motion-sensitive visitors see the same states instantly.
        getDuration: () => motionPreference.matches ? 0 : 1000,
    });

    render(0);
    installStepInputs(controller);
}

start();
