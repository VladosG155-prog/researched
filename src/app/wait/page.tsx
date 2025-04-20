'use client';

import { useEffect, useRef, useState } from 'react';

const COLOR = '#FFFFFF';
const HIT_COLOR = '#333333';
const BACKGROUND_COLOR = '#000000';
const BALL_COLOR = '#FFFFFF';
const PADDLE_COLOR = '#FFFFFF';
const LETTER_SPACING = 1;
const WORD_SPACING = 3;

// Target date: April 17, 2025, 13:00 Moscow time (UTC+3)
const TARGET_DATE = new Date('2025-04-22T21:00:00+03:00');

// Power-up types
enum PowerUpType {
    EXPAND_PADDLE = 0,
    SLOW_BALL = 1,
    EXTRA_LIFE = 2,
    ORANGE_BALL = 3 // New power-up type
}

// Power-up colors
const POWER_UP_COLORS = {
    [PowerUpType.EXPAND_PADDLE]: '#4CAF50', // Green
    [PowerUpType.SLOW_BALL]: '#2196F3', // Blue
    [PowerUpType.EXTRA_LIFE]: '#4CAF50', // Changed to green to match heart icon
    [PowerUpType.ORANGE_BALL]: '#FF9800' // Orange for the new power-up
};

// Game states
enum GameState {
    NOT_STARTED = 0,
    PLAYING = 1,
    GAME_OVER = 2,
    VICTORY = 3
}

const PIXEL_MAP = {
    R: [
        [1, 1, 1, 1],
        [1, 0, 0, 1],
        [1, 1, 1, 1],
        [1, 0, 1, 0],
        [1, 0, 0, 1]
    ],
    E: [
        [1, 1, 1, 1],
        [1, 0, 0, 0],
        [1, 1, 1, 1],
        [1, 0, 0, 0],
        [1, 1, 1, 1]
    ],
    S: [
        [1, 1, 1, 1],
        [1, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 1],
        [1, 1, 1, 1]
    ],
    A: [
        [0, 1, 1, 0],
        [1, 0, 0, 1],
        [1, 1, 1, 1],
        [1, 0, 0, 1],
        [1, 0, 0, 1]
    ],
    C: [
        [1, 1, 1, 1],
        [1, 0, 0, 0],
        [1, 0, 0, 0],
        [1, 0, 0, 0],
        [1, 1, 1, 1]
    ],
    H: [
        [1, 0, 0, 1],
        [1, 0, 0, 1],
        [1, 1, 1, 1],
        [1, 0, 0, 1],
        [1, 0, 0, 1]
    ],
    D: [
        [1, 1, 1, 0],
        [1, 0, 0, 1],
        [1, 0, 0, 1],
        [1, 0, 0, 1],
        [1, 1, 1, 0]
    ],
    '.': [[0], [0], [0], [0], [1]],
    X: [
        [1, 0, 0, 1],
        [0, 1, 1, 0],
        [0, 1, 1, 0],
        [0, 1, 1, 0],
        [1, 0, 0, 1]
    ],
    Y: [
        [1, 0, 0, 0, 1],
        [0, 1, 0, 1, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0]
    ],
    Z: [
        [1, 1, 1, 1],
        [0, 0, 0, 1],
        [0, 0, 1, 0],
        [0, 1, 0, 0],
        [1, 1, 1, 1]
    ],
    '0': [
        [0, 1, 1, 0],
        [1, 0, 0, 1],
        [1, 0, 0, 1],
        [1, 0, 0, 1],
        [0, 1, 1, 0]
    ],
    '1': [
        [0, 1, 0],
        [1, 1, 0],
        [0, 1, 0],
        [0, 1, 0],
        [1, 1, 1]
    ],
    '2': [
        [1, 1, 1, 0],
        [0, 0, 0, 1],
        [0, 1, 1, 0],
        [1, 0, 0, 0],
        [1, 1, 1, 1]
    ],
    '3': [
        [1, 1, 1, 0],
        [0, 0, 0, 1],
        [0, 1, 1, 0],
        [0, 0, 0, 1],
        [1, 1, 1, 0]
    ],
    '4': [
        [1, 0, 0, 1],
        [1, 0, 0, 1],
        [1, 1, 1, 1],
        [0, 0, 0, 1],
        [0, 0, 0, 1]
    ],
    '5': [
        [1, 1, 1, 1],
        [1, 0, 0, 0],
        [1, 1, 1, 0],
        [0, 0, 0, 1],
        [1, 1, 1, 0]
    ],
    '6': [
        [0, 1, 1, 0],
        [1, 0, 0, 0],
        [1, 1, 1, 0],
        [1, 0, 0, 1],
        [0, 1, 1, 0]
    ],
    '7': [
        [1, 1, 1, 1],
        [0, 0, 0, 1],
        [0, 0, 1, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0]
    ],
    '8': [
        [0, 1, 1, 0],
        [1, 0, 0, 1],
        [0, 1, 1, 0],
        [1, 0, 0, 1],
        [0, 1, 1, 0]
    ],
    '9': [
        [0, 1, 1, 0],
        [1, 0, 0, 1],
        [0, 1, 1, 1],
        [0, 0, 0, 1],
        [0, 1, 1, 0]
    ],
    ':': [[0], [1], [0], [1], [0]],
    ' ': [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ]
};

interface Pixel {
    x: number;
    y: number;
    size: number;
    hit: boolean;
    specialPowerUp?: boolean; // Flag for pixels that will drop power-ups
}

interface Ball {
    x: number;
    y: number;
    dx: number;
    dy: number;
    radius: number;
    active: boolean;
    baseSpeed: number; // Base speed to calculate from
    currentSpeed: number; // Current speed factor
}

interface Paddle {
    x: number;
    y: number;
    width: number;
    height: number;
    originalWidth: number; // Store original width for power-ups
}

interface PowerUp {
    x: number;
    y: number;
    dy: number;
    size: number;
    type: PowerUpType;
    active: boolean;
}

// Particle for victory celebration
interface Particle {
    x: number;
    y: number;
    dx: number;
    dy: number;
    radius: number;
    color: string;
    alpha: number;
    life: number;
    maxLife: number;
    isFirework?: boolean; // Is it an initial firework rocket?
    exploded?: boolean; // Has the firework exploded?
    gravity?: number; // Gravity effect for explosion particles
}

export function Page() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const pixelsRef = useRef<Pixel[]>([]);
    const timerPixelsRef = useRef<Pixel[]>([]);
    const ballRef = useRef<Ball>({
        x: 0,
        y: 0,
        dx: 0,
        dy: 0,
        radius: 0,
        active: false,
        baseSpeed: 0,
        currentSpeed: 0.7
    });
    const paddleRef = useRef<Paddle>({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        originalWidth: 0
    });
    const powerUpsRef = useRef<PowerUp[]>([]);
    const scaleRef = useRef(1);
    const countdownTimeRef = useRef('00:00:00');
    const requestRef = useRef<number | null>(null); // Fixed linter error: initialized with null
    const timerPositionRef = useRef({ startX: 0, startY: 0, pixelSize: 0 });
    const gameInitializedRef = useRef(false);
    const canvasSizeRef = useRef({ width: 0, height: 0 });
    const [gameState, setGameState] = useState<GameState>(GameState.NOT_STARTED);
    const [isMobile, setIsMobile] = useState(isMobileCheck());
    const touchPositionRef = useRef(0);
    const [lives, setLives] = useState(3);
    const lastTimeRef = useRef(0);
    const speedIncreaseIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const powerUpTimersRef = useRef<{ [key: string]: NodeJS.Timeout | null }>({
        expandPaddle: null,
        slowBall: null
    });
    const totalPowerUpsRef = useRef(0); // Counter for total power-ups spawned
    const heartImageRef = useRef<HTMLImageElement | null>(null);
    const orangeBallCollectedRef = useRef(false);
    const orangeBallImageRef = useRef<HTMLImageElement | null>(null);
    const lastPowerUpTimeRef = useRef(0);
    const particlesRef = useRef<Particle[]>([]);
    const victoryTimeRef = useRef(0);
    const audioContextRef = useRef<AudioContext | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isMusicPlaying, setIsMusicPlaying] = useState(false);
    const [isMusicLoaded, setIsMusicLoaded] = useState(false);
    const [musicError, setMusicError] = useState<string | null>(null);
    const [showMusicButton, setShowMusicButton] = useState(true);
    const [musicVolume, setMusicVolume] = useState(0.5);
    const victoryAnimationProgressRef = useRef(0);
    const initialTimerYRef = useRef(0);
    const targetTimerYRef = useRef(0);
    const animatedTimerYRef = useRef(0);
    const victoryButtonRectRef = useRef({ x: 0, y: 0, width: 0, height: 0 });
    const victoryEffectsIntervalRef = useRef<NodeJS.Timeout | null>(null);
    // Ref to hold the current game state for access in intervals/timeouts
    const gameStateRef = useRef(gameState);

    function isMobileCheck() {
        if (typeof window === 'undefined') {
            return false;
        }
        return window.matchMedia('(max-width: 768px)').matches;
    }

    // Preload heart and orange ball images, initialize AudioContext for effects
    useEffect(() => {
        // Load images...
        const heartImage = new Image();
        heartImage.src = '/green-heart.png';
        heartImage.crossOrigin = 'anonymous';
        heartImage.onload = () => {
            heartImageRef.current = heartImage;
        };

        // Load the orange ball power-up image
        const orangeBallImage = new Image();
        orangeBallImage.src = '/pirazhok.webp';
        orangeBallImage.crossOrigin = 'anonymous';
        orangeBallImage.onload = () => {
            orangeBallImageRef.current = orangeBallImage;
        };

        // Initialize AudioContext for sound effects
        try {
            if (typeof window !== 'undefined' && window.AudioContext) {
                audioContextRef.current = new AudioContext();
            }
        } catch (e) {
            console.log('Web Audio API not supported.');
        }
    }, []);

    // Check if device is mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.matchMedia('(max-width: 768px)').matches);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => {
            window.removeEventListener('resize', checkMobile);
        };
    }, []);

    // Function to play sound effects
    const playSound = (type: 'hit' | 'powerup' | 'victory' | 'gameover') => {
        if (!audioContextRef.current) return;

        const ctx = audioContextRef.current;
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        switch (type) {
            case 'hit':
                oscillator.type = 'square';
                oscillator.frequency.setValueAtTime(220, ctx.currentTime);
                gainNode.gain.setValueAtTime(0.3, ctx.currentTime); // Увеличено с 0.1 до 0.3
                gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
                oscillator.start();
                oscillator.stop(ctx.currentTime + 0.2);
                break;
            case 'powerup':
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(440, ctx.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.2);
                gainNode.gain.setValueAtTime(0.4, ctx.currentTime); // Увеличено с 0.2 до 0.4
                gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
                oscillator.start();
                oscillator.stop(ctx.currentTime + 0.3);
                break;
            case 'victory':
                // Play a victory fanfare
                const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
                notes.forEach((note, i) => {
                    const o = ctx.createOscillator();
                    const g = ctx.createGain();
                    o.connect(g);
                    g.connect(ctx.destination);
                    o.type = 'sine';
                    o.frequency.setValueAtTime(note, ctx.currentTime + i * 0.2);
                    g.gain.setValueAtTime(0.4, ctx.currentTime + i * 0.2); // Увеличено с 0.2 до 0.4
                    g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.2 + 0.3);
                    o.start(ctx.currentTime + i * 0.2);
                    o.stop(ctx.currentTime + i * 0.2 + 0.3);
                });
                break;
            case 'gameover':
                oscillator.type = 'sawtooth';
                oscillator.frequency.setValueAtTime(220, ctx.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.5);
                gainNode.gain.setValueAtTime(0.4, ctx.currentTime); // Увеличено с 0.2 до 0.4
                gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
                oscillator.start();
                oscillator.stop(ctx.currentTime + 0.5);
                break;
        }
    };

    // Create fireworks particles
    const createFireworks = (count = 10) => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const colors = ['#FF9800', '#4CAF50', '#2196F3', '#F44336', '#FFEB3B', '#9C27B0', '#FFFFFF'];

        for (let i = 0; i < count; i++) {
            const startX = Math.random() * canvas.width * 0.8 + canvas.width * 0.1; // Avoid edges
            const startY = canvas.height + Math.random() * 50; // Start below screen
            const targetY = Math.random() * canvas.height * 0.3 + canvas.height * 0.1; // Explode in upper part

            const initialDy = -(Math.random() * 4 + 8) * scaleRef.current; // Calculate dy once
            particlesRef.current.push({
                x: startX,
                y: startY,
                dx: (Math.random() - 0.5) * 2, // Slight horizontal drift
                dy: initialDy, // Use calculated dy
                radius: Math.max(2 * scaleRef.current, 2),
                color: colors[Math.floor(Math.random() * colors.length)],
                alpha: 1,
                life: 0,
                // Corrected: Use the particle's dy property consistent calculation
                maxLife: (startY - targetY) / Math.abs(initialDy), // Use calculated dy
                isFirework: true,
                exploded: false
            });
        }
    };

    // Explode a firework particle
    const explodeFirework = (firework: Particle) => {
        if (!canvasRef.current) return;
        const explosionParticles = 30 + Math.random() * 20; // 30-50 particles per explosion
        const colors = ['#FF9800', '#4CAF50', '#2196F3', '#F44336', '#FFEB3B', '#9C27B0', '#FFFFFF'];

        for (let i = 0; i < explosionParticles; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 4 + 2 * scaleRef.current;
            const dx = Math.cos(angle) * speed;
            const dy = Math.sin(angle) * speed;
            const radius = Math.random() * 2 + 1 * scaleRef.current;
            const color = colors[Math.floor(Math.random() * colors.length)];
            // Increased lifespan for explosion particles
            const maxLife = 60 + Math.random() * 60;

            particlesRef.current.push({
                x: firework.x,
                y: firework.y,
                dx: dx,
                dy: dy,
                radius: radius,
                color: color,
                alpha: 1,
                life: 0,
                maxLife: maxLife,
                isFirework: false, // Not a rocket
                exploded: true,
                gravity: 0.1 * scaleRef.current // Add gravity effect
            });
        }
    };

    // Reset game state
    const resetGame = () => {
        setLives(3);
        setGameState(GameState.NOT_STARTED);
        gameInitializedRef.current = false;
        totalPowerUpsRef.current = 0; // Reset power-up counter
        orangeBallCollectedRef.current = false; // Reset orange ball collected flag
        particlesRef.current = []; // Clear particles
        victoryAnimationProgressRef.current = 0; // Reset victory animation

        // Clear any active power-up timers
        Object.values(powerUpTimersRef.current).forEach((timer) => {
            if (timer) clearTimeout(timer);
        });

        // Clear speed increase interval
        if (speedIncreaseIntervalRef.current) {
            clearInterval(speedIncreaseIntervalRef.current);
            speedIncreaseIntervalRef.current = null;
        }

        // Reset power-ups
        powerUpsRef.current = [];

        // Reset pixels (will be re-initialized)
        pixelsRef.current.forEach((pixel) => {
            pixel.hit = false;
        });
    };

    // Check if all pixels are hit (victory condition)
    const checkVictory = () => {
        if (gameState !== GameState.PLAYING) return false;

        // const hitCount = pixelsRef.current.filter(pixel => pixel.hit).length;
        // const allHit = hitCount >= 2; // Победа засчитывается, если есть хотя бы 2 попадания
        const allHit = pixelsRef.current.every((pixel) => pixel.hit);

        if (allHit) {
            // Player has won!
            setGameState(GameState.VICTORY);
            ballRef.current.active = false;
            victoryTimeRef.current = Date.now();
            victoryAnimationProgressRef.current = 0; // Start animation
            initialTimerYRef.current = timerPositionRef.current.startY;
            targetTimerYRef.current = (canvasRef.current?.height || 0) * 0.4; // Target position for timer
            animatedTimerYRef.current = initialTimerYRef.current; // Start at initial position

            // Play victory sound
            playSound('victory');

            // PAUSE music on victory
            if (audioRef.current && !audioRef.current.paused) {
                audioRef.current.pause();
                // Let event listener handle setIsMusicPlaying(false)
                console.log('Music paused on Victory.');
            }

            // Stop any active power-up timers
            Object.values(powerUpTimersRef.current).forEach((timer) => {
                if (timer) clearTimeout(timer);
            });
            powerUpTimersRef.current = {}; // Clear the object

            // Stop speed increase interval
            if (speedIncreaseIntervalRef.current) {
                clearInterval(speedIncreaseIntervalRef.current);
                speedIncreaseIntervalRef.current = null;
            }

            // Clear existing particles and create initial fireworks burst
            particlesRef.current = [];
            createFireworks(isMobile ? 15 : 30); // Larger initial burst

            // Set up interval to launch more fireworks during celebration
            // Store interval ID to clear it later (e.g., in resetGame or cleanup)
            if (victoryEffectsIntervalRef.current) {
                clearInterval(victoryEffectsIntervalRef.current);
            }
            victoryEffectsIntervalRef.current = setInterval(() => {
                // Check gameState again in case user restarts quickly
                // Use a local variable or check against the current state from React
                const currentGameState = gameStateRef.current; // Assuming we add a gameStateRef

                if (currentGameState === GameState.VICTORY) {
                    createFireworks(isMobile ? 3 : 6); // Subsequent smaller bursts
                } else {
                    if (victoryEffectsIntervalRef.current) {
                        clearInterval(victoryEffectsIntervalRef.current);
                        victoryEffectsIntervalRef.current = null;
                    }
                }
            }, 700); // Launch new fireworks every 700ms

            return true;
        }

        return false;
    };

    // Update the toggleMusic function to include more debugging for the .ogg file
    const toggleMusic = async () => {
        console.log(
            'Toggle music called, current state:',
            isMusicPlaying,
            'audio format:',
            audioRef.current?.src.includes('.ogg') ? 'OGG' : 'MP3',
            `isMusicLoaded=${isMusicLoaded}` // Add loaded state to log
        );

        if (!audioRef.current) {
            // Check if the element ref is set
            console.error('Audio object ref not initialized');
            setMusicError('Audio object ref not initialized');
            return;
        }

        if (!isMusicLoaded) {
            console.warn('toggleMusic: Audio not loaded yet.');
            setMusicError('Музыка еще не загружена');
            return;
        }

        try {
            // Ensure AudioContext is active before playing/pausing
            if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
                console.log('toggleMusic: Resuming suspended AudioContext...');
                await audioContextRef.current.resume();
            }

            if (isMusicPlaying) {
                audioRef.current.pause();
                // setIsMusicPlaying(false) // Let the 'pause' event listener handle state
                console.log('toggleMusic: Pause requested.');
            } else {
                // Play only if paused
                if (audioRef.current.paused) {
                    console.log('toggleMusic: Attempting to play Audio object via button:', audioRef.current.src);
                    const playPromise = audioRef.current.play();
                    if (playPromise !== undefined) {
                        playPromise
                            .then(() => {
                                console.log("toggleMusic: Play request successful (waiting for 'playing' event).");
                                // setIsMusicPlaying(true) // Let the 'play' event listener handle state
                                setMusicError(null);
                            })
                            .catch((error) => {
                                console.error('toggleMusic: Error playing music:', error);
                                setMusicError(`Ошибка воспроизведения: ${error.message}`);
                                // setIsMusicPlaying(false) // Let the 'error' or 'pause' event listener handle state
                            });
                    } else {
                        // If playPromise is undefined, assume sync play might have worked or failed silently
                        setIsMusicPlaying(!audioRef.current.paused);
                    }
                } else {
                    console.log('toggleMusic: Already playing, correcting state.');
                    setIsMusicPlaying(true); // Correct state if it was somehow false
                }
            }
        } catch (error) {
            console.error('Exception in toggleMusic:', error);
            setMusicError(`Exception in toggleMusic: ${error}`);
            setIsMusicPlaying(false);
        }
    };

    // Main game initialization and animation loop
    useEffect(() => {
        const canvasElement = canvasRef.current;
        if (!canvasElement) return;

        const ctx = canvasElement.getContext('2d');
        if (!ctx) return;

        const resizeCanvas = () => {
            canvasElement.width = window.innerWidth;
            canvasElement.height = window.innerHeight;

            // Only reinitialize if the size actually changed
            if (canvasSizeRef.current.width !== canvasElement.width || canvasSizeRef.current.height !== canvasElement.height) {
                canvasSizeRef.current = { width: canvasElement.width, height: canvasElement.height };
                scaleRef.current = Math.min(canvasElement.width / 1000, canvasElement.height / 1000);
                gameInitializedRef.current = false; // Force re-initialization after resize
            }
        };

        const initializeGame = () => {
            if (gameInitializedRef.current) return;

            const scale = scaleRef.current;
            const LARGE_PIXEL_SIZE = Math.min(8 * scale, canvasElement.width * 0.01);
            const SMALL_PIXEL_SIZE = isMobile
                ? Math.min(10 * scale, canvasElement.width * 0.015)
                : Math.min(4 * scale, canvasElement.width * 0.006);
            const BALL_SPEED = 12 * scale;

            pixelsRef.current = [];
            const mainText = 'RESEARCHED.XYZ';

            const calculateWordWidth = (word: string, pixelSize: number) => {
                return (
                    word.split('').reduce((width, letter) => {
                        const letterWidth = PIXEL_MAP[letter as keyof typeof PIXEL_MAP]?.[0]?.length ?? 0;
                        return width + letterWidth * pixelSize + LETTER_SPACING * pixelSize;
                    }, 0) -
                    LETTER_SPACING * pixelSize
                );
            };

            const totalWidthLarge = calculateWordWidth(mainText, LARGE_PIXEL_SIZE);
            // Use a sample time format for calculation
            const sampleTime = '00:00:00';
            const totalWidthSmall = calculateWordWidth(sampleTime, SMALL_PIXEL_SIZE);
            const totalWidth = Math.max(totalWidthLarge, totalWidthSmall);
            const scaleFactor = (canvasElement.width * 0.8) / totalWidth;

            const adjustedLargePixelSize = LARGE_PIXEL_SIZE * scaleFactor;
            const adjustedSmallPixelSize = SMALL_PIXEL_SIZE * scaleFactor;

            const largeTextHeight = 5 * adjustedLargePixelSize;
            const smallTextHeight = 5 * adjustedSmallPixelSize;
            const spaceBetweenLines = 5 * adjustedLargePixelSize;
            const totalTextHeight = largeTextHeight + spaceBetweenLines + smallTextHeight;

            const startY = (canvasElement.height - totalTextHeight) / 2;

            // Render main text
            const totalWidthMain = calculateWordWidth(mainText, adjustedLargePixelSize);
            let startX = (canvasElement.width - totalWidthMain) / 2;

            mainText.split('').forEach((letter) => {
                const pixelMap = PIXEL_MAP[letter as keyof typeof PIXEL_MAP];
                if (!pixelMap) return;

                for (let i = 0; i < pixelMap.length; i++) {
                    for (let j = 0; j < pixelMap[i].length; j++) {
                        if (pixelMap[i][j]) {
                            const x = startX + j * adjustedLargePixelSize;
                            const y = startY + i * adjustedLargePixelSize;

                            // Умеренная вероятность для специальных пикселей (15% вместо 25%)
                            const isSpecial = Math.random() < 0.15;

                            pixelsRef.current.push({
                                x,
                                y,
                                size: adjustedLargePixelSize,
                                hit: false,
                                specialPowerUp: isSpecial
                            });
                        }
                    }
                }
                startX += (pixelMap[0].length + LETTER_SPACING) * adjustedLargePixelSize;
            });

            // Store timer position information for later use
            timerPositionRef.current = {
                startY: startY + largeTextHeight + spaceBetweenLines,
                startX: (canvasElement.width - calculateWordWidth(sampleTime, adjustedSmallPixelSize)) / 2,
                pixelSize: adjustedSmallPixelSize
            };

            // Initialize ball position in the center
            const ballStartX = canvasElement.width / 2;
            const ballStartY = canvasElement.height / 2;

            ballRef.current = {
                x: ballStartX,
                y: ballStartY,
                dx: 0, // Initially stationary
                dy: 0, // Initially stationary
                radius: Math.max(adjustedLargePixelSize / 2, Math.min(canvasElement.width, canvasElement.height) * 0.01),
                active: false,
                baseSpeed: BALL_SPEED,
                currentSpeed: 1.0
            };

            // Initialize paddle
            const paddleWidth = Math.min(15 * adjustedLargePixelSize, canvasElement.width * 0.25);
            const paddleHeight = adjustedLargePixelSize;

            const paddleY = isMobile
                ? canvasElement.height - Math.min(200 * scale, canvasElement.height * 0.25) // Responsive position on mobile
                : canvasElement.height - Math.min(50 * scale, canvasElement.height * 0.08); // Responsive position on desktop

            paddleRef.current = {
                x: canvasElement.width / 2 - paddleWidth / 2,
                y: paddleY,
                width: paddleWidth,
                height: paddleHeight,
                originalWidth: paddleWidth
            };

            // Make sure AudioContext is resumed on first user interaction
            if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
                const resumeAudioContext = () => {
                    audioContextRef.current?.resume().then(() => {
                        console.log('AudioContext resumed successfully');
                        document.removeEventListener('click', resumeAudioContext);
                        document.removeEventListener('touchstart', resumeAudioContext);
                    });
                };

                document.addEventListener('click', resumeAudioContext);
                document.addEventListener('touchstart', resumeAudioContext);
            }

            // Initial timer rendering
            renderTimer();

            gameInitializedRef.current = true;
        };

        const startGame = () => {
            if (gameState === GameState.NOT_STARTED) {
                const BALL_SPEED = ballRef.current.baseSpeed;

                // Set initial ball direction
                ballRef.current.dx = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
                ballRef.current.dy = -BALL_SPEED; // Always start moving upward
                ballRef.current.active = true;
                ballRef.current.currentSpeed = 1; // Reduced from 1.0 to 0.7

                setGameState(GameState.PLAYING);

                // Start gradually increasing ball speed
                if (speedIncreaseIntervalRef.current) {
                    clearInterval(speedIncreaseIntervalRef.current);
                }

                speedIncreaseIntervalRef.current = setInterval(() => {
                    if (ballRef.current.currentSpeed < 2.0) {
                        // Cap at 2x speed
                        ballRef.current.currentSpeed += 0.05;
                    }
                }, 10000); // Increase every 10 seconds
            }
        };

        const createPowerUp = (x: number, y: number, size: number) => {
            // Увеличим максимальное количество бонусов до 8 (было 10)
            if (totalPowerUpsRef.current >= 8) {
                return;
            }

            // Защита от наводнения: если недавно выпал бонус, уменьшаем шанс выпадения следующего
            const timeSinceLastPowerUp = Date.now() - lastPowerUpTimeRef.current;
            let dropChance = 0.7; // Базовый шанс 70%

            // Если прошло менее 3 секунд с момента последнего бонуса, уменьшаем шанс
            if (timeSinceLastPowerUp < 3000) {
                dropChance = 0.3; // Уменьшаем до 30%
            }
            // Защита от засухи: если долго не было бонусов, увеличиваем шанс
            else if (timeSinceLastPowerUp > 10000) {
                dropChance = 0.9; // Увеличиваем до 90%
            }

            // Проверяем, должен ли выпасть бонус
            if (Math.random() > dropChance) {
                return;
            }

            // Обновляем время последнего бонуса
            lastPowerUpTimeRef.current = Date.now();

            // Увеличиваем счетчик
            totalPowerUpsRef.current++;

            // Определяем тип бонуса
            let powerUpType: PowerUpType;

            // Check if we've already seen an orange ball power-up in this game
            const orangeBallAlreadySpawned =
                powerUpsRef.current.some((p) => p.type === PowerUpType.ORANGE_BALL) || orangeBallCollectedRef.current;

            if (!orangeBallAlreadySpawned && Math.random() < 0.8) {
                // If we haven't seen an orange ball yet, give it a high chance (80%)
                powerUpType = PowerUpType.ORANGE_BALL;
            } else {
                // Choose from other power-up types with different probabilities
                const rand = Math.random();
                if (rand < 0.5) {
                    // 50% chance for paddle expansion
                    powerUpType = PowerUpType.EXPAND_PADDLE;
                } else if (rand < 0.7) {
                    // 20% chance for ball slowdown
                    powerUpType = PowerUpType.SLOW_BALL;
                } else {
                    // 30% chance for extra life
                    powerUpType = PowerUpType.EXTRA_LIFE;
                }
            }

            powerUpsRef.current.push({
                x,
                y,
                dy: 1.5 * scaleRef.current,
                size: size * 1.5,
                type: powerUpType,
                active: true
            });
        };

        const applyPowerUp = (type: PowerUpType) => {
            const paddle = paddleRef.current;
            const ball = ballRef.current;

            // Play power-up sound
            playSound('powerup');

            switch (type) {
                case PowerUpType.EXPAND_PADDLE:
                    // Expand paddle width by 50%
                    paddle.width = paddle.originalWidth * 1.5;

                    // Clear any existing timer
                    if (powerUpTimersRef.current.expandPaddle) {
                        clearTimeout(powerUpTimersRef.current.expandPaddle);
                    }

                    // Set timer to revert after 10 seconds
                    powerUpTimersRef.current.expandPaddle = setTimeout(() => {
                        paddle.width = paddle.originalWidth;
                    }, 10000);
                    break;

                case PowerUpType.SLOW_BALL:
                    // Slow ball by reducing speed factor
                    ball.currentSpeed = 0.6;

                    // Clear any existing timer
                    if (powerUpTimersRef.current.slowBall) {
                        clearTimeout(powerUpTimersRef.current.slowBall);
                    }

                    // Set timer to revert after 8 seconds
                    powerUpTimersRef.current.slowBall = setTimeout(() => {
                        // Don't immediately jump back to high speed
                        ball.currentSpeed = Math.min(ball.currentSpeed + 0.4, 1.0);
                    }, 8000);
                    break;

                case PowerUpType.EXTRA_LIFE:
                    // Add an extra life
                    setLives((prev) => Math.min(prev + 1, 5)); // Cap at 5 lives
                    break;

                case PowerUpType.ORANGE_BALL:
                    // Mark as collected so it doesn't appear again
                    orangeBallCollectedRef.current = true;
                    // No need to set a timer as this is permanent
                    break;
            }
        };

        const updateGame = () => {
            const ball = ballRef.current;
            const paddle = paddleRef.current;

            // Update particles (including fireworks)
            particlesRef.current = particlesRef.current
                .map((particle, index) => {
                    particle.x += particle.dx;
                    particle.y += particle.dy;
                    particle.life += 1;
                    particle.alpha = 1 - particle.life / particle.maxLife;

                    // Apply gravity to explosion particles
                    if (particle.gravity) {
                        particle.dy += particle.gravity;
                    }

                    // Handle firework explosion
                    if (particle.isFirework && !particle.exploded && particle.life >= particle.maxLife) {
                        explodeFirework(particle);
                        particle.exploded = true;
                        particle.alpha = 0; // Make the original rocket disappear
                    }

                    // Keep particle if it's still alive
                    return particle.life < particle.maxLife && particle.alpha > 0 ? particle : null;
                })
                .filter((p): p is Particle => p !== null); // Type assertion to filter out nulls

            // Update victory animation
            if (gameState === GameState.VICTORY) {
                if (victoryAnimationProgressRef.current < 1) {
                    victoryAnimationProgressRef.current += 0.02; // Adjust speed as needed
                    victoryAnimationProgressRef.current = Math.min(victoryAnimationProgressRef.current, 1);

                    // Smooth interpolation (e.g., ease-out)
                    const easedProgress = 1 - Math.pow(1 - victoryAnimationProgressRef.current, 3);
                    animatedTimerYRef.current =
                        initialTimerYRef.current + (targetTimerYRef.current - initialTimerYRef.current) * easedProgress;
                }
                // No ball/paddle/power-up updates needed in victory state
                return; // Skip rest of game logic
            }

            if (ball.active) {
                // Calculate actual speed based on base speed and current speed factor
                const actualSpeedX = ball.dx * ball.currentSpeed;
                const actualSpeedY = ball.dy * ball.currentSpeed;

                // Update ball position
                ball.x += actualSpeedX;
                ball.y += actualSpeedY;

                // Ball collision with walls
                if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvasElement.width) {
                    ball.dx = -ball.dx;
                    playSound('hit');
                }

                // Ball collision with top
                if (ball.y - ball.radius < 0) {
                    ball.dy = -ball.dy;
                    playSound('hit');
                }

                // Ball collision with bottom
                if (ball.y + ball.radius > canvasElement.height) {
                    // Lose a life
                    setLives((prev) => {
                        const newLives = prev - 1;

                        if (newLives <= 0) {
                            // Game over
                            ball.active = false;
                            setGameState(GameState.GAME_OVER);
                            playSound('gameover');

                            // Clear speed increase interval
                            if (speedIncreaseIntervalRef.current) {
                                clearInterval(speedIncreaseIntervalRef.current);
                                speedIncreaseIntervalRef.current = null;
                            }

                            // PAUSE music on game over
                            if (audioRef.current && !audioRef.current.paused) {
                                audioRef.current.pause();
                                setIsMusicPlaying(false);
                                console.log('Music paused on Game Over.');
                            }

                            return 0;
                        } else {
                            // Reset ball
                            ball.x = canvasElement.width / 2;
                            ball.y = canvasElement.height / 2;
                            ball.dx = ball.baseSpeed * (Math.random() > 0.5 ? 1 : -1);
                            ball.dy = -ball.baseSpeed;
                            ball.currentSpeed = 1.0; // Reset speed

                            return newLives;
                        }
                    });
                }

                // Ball collision with paddle
                if (
                    ball.y + ball.radius > paddle.y &&
                    ball.y - ball.radius < paddle.y + paddle.height &&
                    ball.x + ball.radius > paddle.x &&
                    ball.x - ball.radius < paddle.x + paddle.width
                ) {
                    // Calculate where the ball hit the paddle (0 to 1)
                    const hitPosition = (ball.x - paddle.x) / paddle.width;

                    // Change angle based on where the ball hit the paddle
                    const angle = (hitPosition - 0.5) * Math.PI * 0.7;

                    const speed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
                    ball.dx = Math.sin(angle) * speed;
                    ball.dy = -Math.abs(Math.cos(angle) * speed); // Always bounce up

                    // Ensure ball is above paddle (prevent sticking)
                    ball.y = paddle.y - ball.radius;

                    playSound('hit');
                }

                // Check collision with pixels
                pixelsRef.current.forEach((pixel) => {
                    if (
                        !pixel.hit &&
                        ball.x + ball.radius > pixel.x &&
                        ball.x - ball.radius < pixel.x + pixel.size &&
                        ball.y + ball.radius > pixel.y &&
                        ball.y - ball.radius < pixel.y + pixel.size
                    ) {
                        pixel.hit = true;
                        playSound('hit');

                        // Create power-up if this was a special pixel and we haven't reached the limit
                        if (pixel.specialPowerUp && totalPowerUpsRef.current < 8) {
                            createPowerUp(pixel.x + pixel.size / 2, pixel.y + pixel.size / 2, pixel.size);
                        }

                        // Determine bounce direction based on collision side
                        const centerX = pixel.x + pixel.size / 2;
                        const centerY = pixel.y + pixel.size / 2;

                        if (Math.abs(ball.x - centerX) > Math.abs(ball.y - centerY)) {
                            ball.dx = -ball.dx;
                        } else {
                            ball.dy = -ball.dy;
                        }

                        // Check if all pixels are hit (victory condition)
                        checkVictory();
                    }
                });
            }

            // Update power-ups
            powerUpsRef.current.forEach((powerUp, index) => {
                if (powerUp.active) {
                    // Move power-up down
                    powerUp.y += powerUp.dy;

                    // Check if power-up is out of bounds
                    if (powerUp.y > canvasElement.height) {
                        powerUp.active = false;
                    }

                    // Check collision with paddle
                    if (
                        powerUp.y + powerUp.size > paddle.y &&
                        powerUp.y < paddle.y + paddle.height &&
                        powerUp.x + powerUp.size > paddle.x &&
                        powerUp.x < paddle.x + paddle.width
                    ) {
                        // Apply power-up effect
                        applyPowerUp(powerUp.type);
                        powerUp.active = false;
                    }
                }
            });

            // Remove inactive power-ups
            powerUpsRef.current = powerUpsRef.current.filter((p) => p.active);
        };

        const renderTimer = () => {
            if (!ctx || !canvasElement || !gameInitializedRef.current) return;

            // Clear previous timer pixels
            timerPixelsRef.current = [];

            const { startY, pixelSize } = timerPositionRef.current;
            // Use animated Y position if in victory state, otherwise use initial position
            const currentStartY = gameState === GameState.VICTORY ? animatedTimerYRef.current : startY;

            const currentTime = countdownTimeRef.current;

            // Calculate the width of the current time
            const calculateWordWidth = (word: string, pixelSize: number) => {
                return (
                    word.split('').reduce((width, letter) => {
                        const letterWidth = PIXEL_MAP[letter as keyof typeof PIXEL_MAP]?.[0]?.length ?? 0;
                        return width + letterWidth * pixelSize + LETTER_SPACING * pixelSize;
                    }, 0) -
                    LETTER_SPACING * pixelSize
                );
            };

            const timerWidth = calculateWordWidth(currentTime, pixelSize);
            let currentX = (canvasElement.width - timerWidth) / 2;

            // Render each character of the timer
            currentTime.split('').forEach((digit) => {
                const pixelMap = PIXEL_MAP[digit as keyof typeof PIXEL_MAP];
                if (!pixelMap) return;

                for (let i = 0; i < pixelMap.length; i++) {
                    for (let j = 0; j < pixelMap[i].length; j++) {
                        if (pixelMap[i][j]) {
                            const x = currentX + j * pixelSize;
                            const y = currentStartY + i * pixelSize;
                            timerPixelsRef.current.push({ x, y, size: pixelSize, hit: false });
                        }
                    }
                }
                currentX += (pixelMap[0].length + LETTER_SPACING) * pixelSize;
            });

            // Re-render timer pixels if victory animation is in progress
            if (gameState === GameState.VICTORY) {
                // This forces the timer to redraw in its new position during animation
                // The main drawGame function will handle the actual drawing
            }
        };

        const drawGame = () => {
            if (!ctx || !canvasElement) return;

            // 1. Draw background (always)
            ctx.fillStyle = BACKGROUND_COLOR;
            ctx.fillRect(0, 0, canvasElement.width, canvasElement.height);

            // --- State-Specific Drawing ---
            switch (gameState) {
                case GameState.VICTORY:
                    // Draw timer at animated position
                    timerPixelsRef.current.forEach((pixel) => {
                        ctx.fillStyle = COLOR;
                        // Adjust pixel Y position based on animatedTimerYRef relative to initial startY
                        const yOffset = animatedTimerYRef.current - initialTimerYRef.current;
                        ctx.fillRect(pixel.x, pixel.y + yOffset, pixel.size, pixel.size);
                    });

                    // Draw victory particles (fireworks)
                    particlesRef.current.forEach((particle) => {
                        ctx.globalAlpha = particle.alpha;
                        ctx.fillStyle = particle.color;
                        ctx.beginPath();
                        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                        ctx.fill();
                    });
                    ctx.globalAlpha = 1.0;

                    // Draw Victory Message and Button once animation is somewhat complete
                    if (victoryAnimationProgressRef.current > 0.5) {
                        // Calculate fade-in and slide-up based on progress beyond the halfway point
                        const messageAnimationProgress = Math.max(0, (victoryAnimationProgressRef.current - 0.5) * 2);
                        const messageOpacity = messageAnimationProgress;
                        // Start slightly lower and slide up
                        const messageOffsetY = (1 - messageAnimationProgress) * 30 * scaleRef.current;

                        // Calculate positions based on animated timer
                        const timerHeight = 5 * timerPositionRef.current.pixelSize; // Approximate height
                        const messageBaseY = animatedTimerYRef.current + timerHeight + (isMobile ? 40 : 60) * scaleRef.current;
                        const fontSize = isMobile
                            ? Math.min(24 * scaleRef.current, canvasElement.width * 0.05)
                            : Math.min(24 * scaleRef.current, canvasElement.width * 0.03);
                        const buttonFontSize = isMobile
                            ? Math.min(26 * scaleRef.current, canvasElement.width * 0.06)
                            : Math.min(28 * scaleRef.current, canvasElement.width * 0.04);
                        const lineSpacing = fontSize * 1.5;

                        ctx.font = `bold ${fontSize}px 'Press Start 2P', Arial, sans-serif`;
                        ctx.textAlign = 'center';
                        ctx.fillStyle = COLOR;
                        ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
                        ctx.shadowBlur = 8;
                        ctx.shadowOffsetX = 2;
                        ctx.shadowOffsetY = 2;

                        // Apply animation effects
                        ctx.globalAlpha = messageOpacity;

                        const messageLines = [
                            '',
                            'Молодец!',
                            '',
                            'А теперь заходи в наш телеграм канал.',
                            '', // Empty line for spacing
                            'После таймера сможешь получить 500$'
                        ];

                        let currentY = messageBaseY;
                        messageLines.forEach((line) => {
                            ctx.fillText(line, canvasElement.width / 2, currentY + messageOffsetY);
                            currentY += lineSpacing;
                        });

                        // Draw Telegram Button
                        const buttonText = 'TG канал';
                        const buttonPadding = 20 * scaleRef.current;
                        const buttonHeight = buttonFontSize + buttonPadding;
                        ctx.font = `bold ${buttonFontSize}px 'Press Start 2P', Arial, sans-serif`; // Use pixel font if available later
                        const textMetrics = ctx.measureText(buttonText);
                        const buttonWidth = textMetrics.width + buttonPadding * 2;
                        const buttonX = canvasElement.width / 2 - buttonWidth / 2;
                        const buttonY = currentY + 30 * scaleRef.current + messageOffsetY; // Apply offset

                        // Store button rect for click detection
                        victoryButtonRectRef.current = { x: buttonX, y: buttonY, width: buttonWidth, height: buttonHeight };

                        // Draw button background (Orange)
                        ctx.fillStyle = '#42aaff'; // Orange color
                        // Simple rect for now, pixel style can be added later if needed
                        ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);

                        // Draw button text (White)
                        ctx.fillStyle = '#FFFFFF';
                        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'; // Slight shadow for text on button
                        ctx.shadowBlur = 4;
                        ctx.fillText(buttonText, canvasElement.width / 2, buttonY + buttonHeight / 2 + buttonFontSize / 3); // Adjust vertical alignment

                        // Reset shadow
                        ctx.shadowColor = 'transparent';
                        ctx.shadowBlur = 0;
                        // Reset alpha
                        ctx.globalAlpha = 1.0;
                    }
                    // End Victory State Drawing
                    break; // Exit switch after drawing victory state

                case GameState.PLAYING:
                    // Render main text pixels
                    pixelsRef.current.forEach((pixel) => {
                        ctx.fillStyle = pixel.hit ? HIT_COLOR : COLOR;
                        ctx.fillRect(pixel.x, pixel.y, pixel.size, pixel.size);
                    });

                    // Render timer pixels
                    timerPixelsRef.current.forEach((pixel) => {
                        ctx.fillStyle = COLOR;
                        ctx.fillRect(pixel.x, pixel.y, pixel.size, pixel.size);
                    });

                    // Draw power-ups
                    powerUpsRef.current.forEach((powerUp) => {
                        ctx.fillStyle = POWER_UP_COLORS[powerUp.type];
                        switch (powerUp.type) {
                            // ... (cases for drawing different power-up shapes)
                            case PowerUpType.EXPAND_PADDLE:
                                const radius = powerUp.size / 4;
                                ctx.beginPath();
                                ctx.moveTo(powerUp.x - powerUp.size + radius, powerUp.y - powerUp.size / 3);
                                ctx.lineTo(powerUp.x + powerUp.size - radius, powerUp.y - powerUp.size / 3);
                                ctx.arcTo(
                                    powerUp.x + powerUp.size,
                                    powerUp.y - powerUp.size / 3,
                                    powerUp.x + powerUp.size,
                                    powerUp.y - powerUp.size / 3 + radius,
                                    radius
                                );
                                ctx.lineTo(powerUp.x + powerUp.size, powerUp.y + powerUp.size / 3 - radius);
                                ctx.arcTo(
                                    powerUp.x + powerUp.size,
                                    powerUp.y + powerUp.size / 3,
                                    powerUp.x + powerUp.size - radius,
                                    powerUp.y + powerUp.size / 3,
                                    radius
                                );
                                ctx.lineTo(powerUp.x - powerUp.size + radius, powerUp.y + powerUp.size / 3);
                                ctx.arcTo(
                                    powerUp.x - powerUp.size,
                                    powerUp.y + powerUp.size / 3,
                                    powerUp.x - powerUp.size,
                                    powerUp.y + powerUp.size / 3 - radius,
                                    radius
                                );
                                ctx.lineTo(powerUp.x - powerUp.size, powerUp.y - powerUp.size / 3 + radius);
                                ctx.arcTo(
                                    powerUp.x - powerUp.size,
                                    powerUp.y - powerUp.size / 3,
                                    powerUp.x - powerUp.size + radius,
                                    powerUp.y - powerUp.size / 3,
                                    radius
                                );
                                ctx.fill();
                                ctx.fillStyle = '#FFFFFF';
                                ctx.fillRect(powerUp.x - powerUp.size / 2, powerUp.y - powerUp.size / 6, powerUp.size, powerUp.size / 3);
                                break;
                            case PowerUpType.SLOW_BALL:
                                ctx.beginPath();
                                ctx.arc(powerUp.x, powerUp.y, powerUp.size, 0, Math.PI * 2);
                                ctx.fill();
                                ctx.strokeStyle = '#FFFFFF';
                                ctx.lineWidth = powerUp.size / 6;
                                ctx.beginPath();
                                ctx.moveTo(powerUp.x, powerUp.y);
                                ctx.lineTo(powerUp.x, powerUp.y - powerUp.size / 2);
                                ctx.stroke();
                                ctx.beginPath();
                                ctx.moveTo(powerUp.x, powerUp.y);
                                ctx.lineTo(powerUp.x + powerUp.size / 3, powerUp.y);
                                ctx.stroke();
                                break;
                            case PowerUpType.EXTRA_LIFE:
                                if (heartImageRef.current) {
                                    const heartSize = powerUp.size * 1.5;
                                    ctx.drawImage(
                                        heartImageRef.current,
                                        powerUp.x - heartSize / 2,
                                        powerUp.y - heartSize / 2,
                                        heartSize,
                                        heartSize
                                    );
                                }
                                break;
                            case PowerUpType.ORANGE_BALL:
                                if (orangeBallImageRef.current) {
                                    const iconSize = powerUp.size * 3.0;
                                    ctx.drawImage(
                                        orangeBallImageRef.current,
                                        powerUp.x - iconSize / 2,
                                        powerUp.y - iconSize / 2,
                                        iconSize,
                                        iconSize
                                    );
                                }
                                break;
                        }
                    });

                    // Draw ball
                    ctx.fillStyle = orangeBallCollectedRef.current ? '#FF9800' : BALL_COLOR;
                    ctx.beginPath();
                    ctx.arc(ballRef.current.x, ballRef.current.y, ballRef.current.radius, 0, Math.PI * 2);
                    ctx.fill();

                    // Draw paddle
                    ctx.fillStyle = PADDLE_COLOR;
                    ctx.fillRect(paddleRef.current.x, paddleRef.current.y, paddleRef.current.width, paddleRef.current.height);

                    // Draw lives
                    if (heartImageRef.current) {
                        const lifeSize = isMobile
                            ? Math.min(60 * scaleRef.current, canvasElement.width * 0.08)
                            : Math.min(45 * scaleRef.current, canvasElement.width * 0.05);
                        const lifeSpacing = isMobile
                            ? Math.min(30 * scaleRef.current, canvasElement.width * 0.04)
                            : Math.min(25 * scaleRef.current, canvasElement.width * 0.03);
                        const marginLeft = isMobile
                            ? Math.min(50 * scaleRef.current, canvasElement.width * 0.06)
                            : Math.min(40 * scaleRef.current, canvasElement.width * 0.04);
                        const lifeY = isMobile
                            ? Math.min(70 * scaleRef.current, canvasElement.height * 0.1)
                            : Math.min(50 * scaleRef.current, canvasElement.height * 0.08);

                        for (let i = 0; i < lives; i++) {
                            const lifeX = marginLeft + i * (lifeSize + lifeSpacing);
                            ctx.drawImage(heartImageRef.current, lifeX - lifeSize / 2, lifeY - lifeSize / 2, lifeSize, lifeSize);
                        }
                    }
                    break; // End Playing State Drawing

                case GameState.NOT_STARTED:
                case GameState.GAME_OVER:
                    // Render main text pixels
                    pixelsRef.current.forEach((pixel) => {
                        ctx.fillStyle = pixel.hit ? HIT_COLOR : COLOR;
                        ctx.fillRect(pixel.x, pixel.y, pixel.size, pixel.size);
                    });

                    // Render timer pixels
                    timerPixelsRef.current.forEach((pixel) => {
                        ctx.fillStyle = COLOR;
                        ctx.fillRect(pixel.x, pixel.y, pixel.size, pixel.size);
                    });

                    // Draw game state message
                    const fontSize = isMobile
                        ? Math.min(26 * scaleRef.current, canvasElement.width * 0.05)
                        : Math.min(24 * scaleRef.current, canvasElement.width * 0.03);
                    ctx.font = `bold ${fontSize}px 'Press Start 2P', Arial, sans-serif`;
                    ctx.textAlign = 'center';

                    // Add stronger shadow
                    ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
                    ctx.shadowBlur = isMobile ? 15 : 10;
                    ctx.shadowOffsetX = isMobile ? 3 : 2;
                    ctx.shadowOffsetY = isMobile ? 3 : 2;

                    const timerBottom = timerPositionRef.current.startY + 5 * timerPositionRef.current.pixelSize;
                    const textY = timerBottom + (isMobile ? 100 : 150) * scaleRef.current;

                    let message = '';
                    if (gameState === GameState.GAME_OVER) {
                        message = 'Игра окончена! Нажмите чтобы начать заново';
                    } else {
                        // Must be GameState.NOT_STARTED
                        message = 'Нажмите или коснитесь, чтобы начать';
                    }

                    // Optional: Add text background for better visibility on mobile
                    if (isMobile) {
                        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
                        const textMetrics = ctx.measureText(message);
                        const textWidth = textMetrics.width;
                        const textHeight = 22;
                        ctx.fillRect(
                            canvasElement.width / 2 - textWidth / 2 - 20,
                            textY - textHeight - 10,
                            textWidth + 40,
                            textHeight + 20
                        );
                    }

                    ctx.fillStyle = COLOR;
                    if (message === 'Игра окончена! Нажмите чтобы начать заново') {
                        ctx.fillText('Игра окончена!', canvasElement.width / 2, textY);
                        ctx.fillText('Нажмите чтобы начать заново', canvasElement.width / 2, textY + 20);
                    } else {
                        ctx.fillText(message, canvasElement.width / 2, textY);
                    }

                    // Reset shadow
                    ctx.shadowColor = 'transparent';
                    ctx.shadowBlur = 0;
                    ctx.shadowOffsetX = 0;
                    ctx.shadowOffsetY = 0;
                    break; // End Not Started / Game Over State Drawing
            }

            // --- Draw elements common to non-Victory states ---
            if (gameState !== GameState.VICTORY) {
                // Draw music button if audio is available
                const buttonSize = Math.min(40 * scaleRef.current, canvasElement.width * 0.05);
                const buttonX = canvasElement.width - buttonSize - 20;
                const buttonY = 20;

                if (showMusicButton && audioRef.current) {
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
                    ctx.beginPath();
                    ctx.arc(buttonX, buttonY, buttonSize, 0, Math.PI * 2);
                    ctx.fill();

                    ctx.fillStyle = '#FFFFFF';

                    // Draw music status text if there's an error
                    if (musicError) {
                        ctx.font = `${Math.min(12 * scaleRef.current, canvasElement.width * 0.015)}px 'Press Start 2P', Arial, sans-serif`;
                        ctx.fillStyle = '#FF5555';
                        ctx.textAlign = 'right';
                        ctx.fillText('Music error', buttonX - buttonSize - 10, buttonY + 5);
                    }

                    // Draw volume slider if music is playing
                    if (isMusicPlaying) {
                        // Draw volume slider
                        const sliderX = buttonX - buttonSize * 3;
                        const sliderY = buttonY;
                        const sliderWidth = buttonSize * 2;

                        // Draw slider background
                        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                        ctx.fillRect(sliderX, sliderY - 2, sliderWidth, 4);

                        // Draw slider position
                        ctx.fillStyle = '#FFFFFF';
                        ctx.fillRect(sliderX, sliderY - 4, sliderWidth * musicVolume, 8);
                    }
                }
            }
        };

        const gameLoop = () => {
            resizeCanvas();
            initializeGame();
            updateGame();
            drawGame();
            requestRef.current = requestAnimationFrame(gameLoop);
        };

        // Mouse move handler
        const handleMouseMove = (e: MouseEvent) => {
            // Игнорировать движение мыши в состоянии победы или если игра не инициализирована или не в процессе
            if (gameStateRef.current !== GameState.PLAYING || !gameInitializedRef.current) {
                return;
            }

            const paddle = paddleRef.current;
            const mouseX = e.clientX;

            // Center paddle on mouse position
            paddle.x = mouseX - paddle.width / 2;

            // Keep paddle within canvas bounds
            paddle.x = Math.max(0, Math.min(canvasElement.width - paddle.width, paddle.x));
        };

        // Touch handlers for mobile
        const handleTouchStart = (e: TouchEvent) => {
            // Игнорировать начало касания в состоянии победы или если игра не инициализирована или не в процессе
            if (gameStateRef.current !== GameState.PLAYING || !gameInitializedRef.current) {
                return;
            }

            e.preventDefault();
            if (e.touches.length > 0) {
                touchPositionRef.current = e.touches[0].clientX;
            }
        };

        const handleTouchMove = (e: TouchEvent) => {
            // Игнорировать движение касания в состоянии победы или если игра не инициализирована или не в процессе
            if (gameStateRef.current !== GameState.PLAYING || !gameInitializedRef.current) {
                return;
            }

            e.preventDefault();
            if (e.touches.length > 0) {
                const touchX = e.touches[0].clientX;
                const paddle = paddleRef.current;

                // Center paddle on touch position
                paddle.x = touchX - paddle.width / 2;

                // Keep paddle within canvas bounds
                paddle.x = Math.max(0, Math.min(canvasElement.width - paddle.width, paddle.x));

                touchPositionRef.current = touchX;
            }
        };

        const handleClick = async (e: MouseEvent) => {
            // Try to resume AudioContext on first interaction (to handle autoplay restrictions)
            if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
                console.log('handleClick: Resuming suspended AudioContext on initial interaction...');
                await audioContextRef.current.resume();
            }

            // --- Handle Victory State Clicks ---
            if (gameStateRef.current === GameState.VICTORY) {
                const { x, y, width, height } = victoryButtonRectRef.current;
                // Check if click is INSIDE the Telegram button
                if (e.clientX >= x && e.clientX <= x + width && e.clientY >= y && e.clientY <= y + height) {
                    // Clicked the button - proceed with opening link
                    window.open('https://t.me/researchedxyz', '_blank');
                    // Don't reset the game
                }
                // If NOT inside the button, do nothing in Victory state
                return; // Exit function if in Victory state (unless button was clicked)
            }

            // --- Handle Clicks in Other States (NOT_STARTED, PLAYING, GAME_OVER) ---
            // Check if music button was clicked
            if (showMusicButton && audioRef.current) {
                const buttonSize = Math.min(40 * scaleRef.current, canvasElement.width * 0.05);
                const buttonX = canvasElement.width - buttonSize - 20;
                const buttonY = 20;

                const dx = e.clientX - buttonX;
                const dy = e.clientY - buttonY;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance <= buttonSize) {
                    // Music button clicked
                    console.log('Music button clicked');
                    toggleMusic();
                    return;
                }

                // Check if volume slider was clicked (only if music is playing)
                if (isMusicPlaying) {
                    const sliderX = buttonX - buttonSize * 3;
                    const sliderY = buttonY;
                    const sliderWidth = buttonSize * 2;

                    if (e.clientX > sliderX && e.clientX < sliderX + sliderWidth && e.clientY > sliderY - 10 && e.clientY < sliderY + 10) {
                        // Calculate new volume
                        const newVolume = Math.max(0, Math.min(1, (e.clientX - sliderX) / sliderWidth));
                        setMusicVolume(newVolume);
                        if (audioRef.current) {
                            audioRef.current.volume = newVolume;
                        }
                        return;
                    }
                }
            }

            // Handle game start/restart
            // This block handles GAME_OVER reset and NOT_STARTED start.
            // Since we already handled VICTORY above and returned, this logic
            // only runs in NOT_STARTED or GAME_OVER.
            if (gameStateRef.current === GameState.GAME_OVER) {
                resetGame();
            } else if (gameStateRef.current === GameState.NOT_STARTED && gameInitializedRef.current) {
                startGame(); // This sets gameState to PLAYING

                // Try to play music when game starts if it's not already playing AND loaded
                if (audioRef.current && isMusicLoaded && !isMusicPlaying && audioRef.current.paused) {
                    console.log('handleClick: Attempting to start music on game start (audio loaded).');
                    try {
                        if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
                            console.log('handleClick: Resuming suspended AudioContext before game start play...');
                            await audioContextRef.current.resume();
                        }

                        const playPromise = audioRef.current.play();
                        if (playPromise !== undefined) {
                            playPromise
                                .then(() => {
                                    console.log("handleClick: Play request successful (waiting for 'playing' event).");
                                    setMusicError(null);
                                    if (audioRef.current) {
                                        console.log(
                                            `handleClick: Post-play check: paused=${audioRef.current.paused}, volume=${audioRef.current.volume}, muted=${audioRef.current.muted}, currentTime=${audioRef.current.currentTime}`
                                        );
                                    }
                                })
                                .catch((err) => {
                                    console.warn('handleClick: Could not play music on game start:', err);
                                });
                        }
                    } catch (err) {
                        console.warn('handleClick: Error trying to play music with game start:', err);
                    }
                } else if (!isMusicLoaded) {
                    console.warn('handleClick: Cannot start music, audio not loaded yet.');
                } else if (!audioRef.current?.paused) {
                    console.log('handleClick: Music already playing, correcting state.');
                    setIsMusicPlaying(true);
                }
            }
        };

        // Add event listeners
        window.addEventListener('resize', resizeCanvas);
        canvasElement.addEventListener('mousemove', handleMouseMove);
        canvasElement.addEventListener('touchstart', handleTouchStart);
        canvasElement.addEventListener('touchmove', handleTouchMove);
        canvasElement.addEventListener('click', handleClick);
        canvasElement.addEventListener('touchend', (e) => {
            // Convert touch end to click for button handling
            if (e.changedTouches.length > 0) {
                const touch = e.changedTouches[0];
                const clickEvent = new MouseEvent('click', {
                    clientX: touch.clientX,
                    clientY: touch.clientY
                });
                handleClick(clickEvent);
            }
        });

        requestRef.current = requestAnimationFrame(gameLoop);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            canvasElement.removeEventListener('mousemove', handleMouseMove);
            canvasElement.removeEventListener('touchstart', handleTouchStart);
            canvasElement.removeEventListener('touchmove', handleTouchMove);
            canvasElement.removeEventListener('click', handleClick);
            canvasElement.removeEventListener('touchend', handleClick);

            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }

            // Stop music
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }

            // Clear any active timers
            Object.values(powerUpTimersRef.current).forEach((timer) => {
                if (timer) clearTimeout(timer);
            });

            if (speedIncreaseIntervalRef.current) {
                clearInterval(speedIncreaseIntervalRef.current);
            }

            // Clear the firework interval specifically if it exists
            if (powerUpTimersRef.current.fireworks) {
                clearInterval(powerUpTimersRef.current.fireworks as unknown as number);
            }
        };
    }, [gameState, lives, isMobile, isMusicPlaying, showMusicButton, musicVolume]); // Dependencies

    // Separate effect for countdown timer calculation
    useEffect(() => {
        const calculateCountdown = () => {
            const now = new Date();
            const diff = TARGET_DATE.getTime() - now.getTime();

            if (diff <= 0) {
                // Countdown finished
                countdownTimeRef.current = '00:00:00';
                return;
            }

            // Calculate hours, minutes, seconds
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            // Format as HH:MM:SS
            const formattedHours = hours.toString().padStart(2, '0');
            const formattedMinutes = minutes.toString().padStart(2, '0');
            const formattedSeconds = seconds.toString().padStart(2, '0');

            countdownTimeRef.current = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
        };

        // Initial calculation
        calculateCountdown();

        // Update every second
        const intervalId = setInterval(() => {
            calculateCountdown();

            // Only re-render the timer if the game is initialized AND NOT in victory animation
            // (Timer rendering during victory is handled by the main draw loop)
            if (gameInitializedRef.current && canvasRef.current && gameState !== GameState.VICTORY) {
                const ctx = canvasRef.current.getContext('2d');
                if (ctx) {
                    const renderTimer = () => {
                        // Clear previous timer pixels
                        timerPixelsRef.current = [];

                        const { startY, pixelSize } = timerPositionRef.current;
                        const currentTime = countdownTimeRef.current;

                        // Calculate the width of the current time
                        const calculateWordWidth = (word: string, pixelSize: number) => {
                            return (
                                word.split('').reduce((width, letter) => {
                                    const letterWidth = PIXEL_MAP[letter as keyof typeof PIXEL_MAP]?.[0]?.length ?? 0;
                                    return width + letterWidth * pixelSize + LETTER_SPACING * pixelSize;
                                }, 0) -
                                LETTER_SPACING * pixelSize
                            );
                        };

                        const timerWidth = calculateWordWidth(currentTime, pixelSize);
                        let currentX = (canvasRef.current!.width - timerWidth) / 2;

                        // Render each character of the timer
                        currentTime.split('').forEach((digit) => {
                            const pixelMap = PIXEL_MAP[digit as keyof typeof PIXEL_MAP];
                            if (!pixelMap) return;

                            for (let i = 0; i < pixelMap.length; i++) {
                                for (let j = 0; j < pixelMap[i].length; j++) {
                                    if (pixelMap[i][j]) {
                                        const x = currentX + j * pixelSize;
                                        const y = startY + i * pixelSize;
                                        timerPixelsRef.current.push({ x, y, size: pixelSize, hit: false });
                                    }
                                }
                            }
                            currentX += (pixelMap[0].length + LETTER_SPACING) * pixelSize;
                        });
                    };

                    renderTimer();
                }
            }
        }, 1000);

        return () => clearInterval(intervalId);
    }, [isMobile, gameState]); // Added gameState to dependencies

    // Update audio volume when musicVolume changes
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = musicVolume;
            console.log('Updated music volume (HTML element) to:', musicVolume);
        }
    }, [musicVolume]);

    // Add useEffect to attach listeners directly to the audio element
    useEffect(() => {
        const audioElement = audioRef.current;
        if (audioElement) {
            console.log('Attaching event listeners to HTMLAudioElement.');

            const handlePlay = () => {
                console.log('Audio Event: play triggered');
                setIsMusicPlaying(true); // Sync state
            };
            const handlePause = () => {
                console.log('Audio Event: pause triggered');
                setIsMusicPlaying(false); // Sync state
            };
            const handlePlaying = () => console.log('Audio Event: playing triggered');
            const handleVolumeChange = () => console.log(`Audio Event: volumechange triggered, volume=${audioElement.volume}`);
            const handleError = (e: Event | string) => {
                console.error('Audio Event: error triggered', e);
                // Maybe set music loaded/playing to false on error?
                setIsMusicPlaying(false);
                setIsMusicLoaded(false); // Assume error means we can't play
                setMusicError('Audio element error');
            };
            const handleCanPlay = () => {
                console.log('Audio Event: canplaythrough triggered');
                setIsMusicLoaded(true);
                setMusicError(null);
            };

            // Check initial state
            setIsMusicPlaying(!audioElement.paused);
            if (!audioElement.readyState || audioElement.readyState < 3) {
                // Ready state 3 (HAVE_FUTURE_DATA) or 4 (HAVE_ENOUGH_DATA)
                setIsMusicLoaded(false);
                console.log('Audio initial state: Not ready yet.');
            } else {
                setIsMusicLoaded(true);
                console.log('Audio initial state: Ready.');
            }

            audioElement.addEventListener('play', handlePlay);
            audioElement.addEventListener('pause', handlePause);
            audioElement.addEventListener('playing', handlePlaying);
            audioElement.addEventListener('volumechange', handleVolumeChange);
            audioElement.addEventListener('error', handleError);
            audioElement.addEventListener('canplaythrough', handleCanPlay);

            // Initial volume sync
            audioElement.volume = musicVolume;

            // Cleanup
            return () => {
                console.log('Removing event listeners from HTMLAudioElement.');
                audioElement.removeEventListener('play', handlePlay);
                audioElement.removeEventListener('pause', handlePause);
                audioElement.removeEventListener('playing', handlePlaying);
                audioElement.removeEventListener('volumechange', handleVolumeChange);
                audioElement.removeEventListener('error', handleError);
                audioElement.removeEventListener('canplaythrough', handleCanPlay);
            };
        }
        // Dependency should be audioRef.current to run when the element is available
    }, [audioRef.current]);

    // Check if device is mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.matchMedia('(max-width: 768px)').matches);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => {
            window.removeEventListener('resize', checkMobile);
        };
    }, []);

    // Keep gameStateRef updated
    useEffect(() => {
        gameStateRef.current = gameState;
    }, [gameState]);

    return (
        <>
            {/* Use ref, keep loop and autoplay as per user's working version */}
            <audio ref={audioRef} id="autoplay-music" loop style={{ display: 'none' }} controls={false} autoPlay>
                <source src="/videoplayback-bg.mp3" type="audio/mpeg" />
            </audio>
            <canvas
                ref={canvasRef}
                className="fixed top-0 left-0 w-full h-full"
                aria-label="RESEARCHED.XYZ: Breakout game with pixel text and countdown timer"
            />
        </>
    );
}

export default Page;
