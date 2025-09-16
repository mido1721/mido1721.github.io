/**
 * PIXEL GAME THEME - JavaScript Library
 * 汎用的なドット絵ゲームテーマ用JavaScriptライブラリ
 * 
 * 使用方法:
 * 1. pixel-theme.css を読み込み
 * 2. このファイルを読み込み
 * 3. PixelTheme.init() を呼び出し
 * 
 * Example:
 * <script src="pixel-theme.js"></script>
 * <script>
 *   PixelTheme.init({
 *     enableScanlines: true,
 *     enableParticles: true,
 *     particleInterval: 2000
 *   });
 * </script>
 */

class PixelTheme {
    constructor() {
        this.config = {
            enableScanlines: true,
            enableArcadeFrame: true,
            enableParticles: true,
            enableGlitchEffect: true,
            enableCounterAnimation: true,
            enableSmoothScroll: true,
            enableSoundEffects: false, // Web Audio API使用時はtrue
            particleInterval: 2000,
            glitchInterval: 3000,
            particleColors: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#00ff41'],
            debug: false
        };
        
        this.isInitialized = false;
        this.observers = [];
        this.intervals = [];
        this.audioContext = null;
    }

    /**
     * ライブラリを初期化
     * @param {Object} options - 設定オプション
     */
    init(options = {}) {
        if (this.isInitialized) {
            console.warn('PixelTheme is already initialized');
            return;
        }

        // 設定をマージ
        this.config = { ...this.config, ...options };
        
        // DOM読み込み完了を待つ
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this._initialize());
        } else {
            this._initialize();
        }
    }



    /**
     * 内部初期化メソッド
     */
    _initialize() {
        this._log('Initializing Pixel Theme...');

        // 基本エフェクトを追加
        if (this.config.enableScanlines) {
            this._addScanlines();
        }
        
        if (this.config.enableArcadeFrame) {
            this._addArcadeFrame();
        }

        // 各機能を初期化
        if (this.config.enableSmoothScroll) {
            this._initSmoothScroll();
        }
        
        if (this.config.enableGlitchEffect) {
            this._initGlitchEffect();
        }
        
        if (this.config.enableCounterAnimation) {
            this._initCounterAnimation();
        }
        
        if (this.config.enableParticles) {
            this._initParticleSystem();
        }
        
        if (this.config.enableSoundEffects) {
            this._initAudioSystem();
        }

        // ボタンエフェクトを初期化
        this._initButtonEffects();

        this.isInitialized = true;
        this._log('Pixel Theme initialized successfully');
    }

    /**
     * スキャンラインエフェクトを追加
     */
    _addScanlines() {
        if (document.querySelector('.scanlines')) return;
        
        const scanlines = document.createElement('div');
        scanlines.className = 'scanlines';
        document.body.appendChild(scanlines);
        this._log('Scanlines effect added');
    }

    /**
     * アーケードフレームを追加
     */
    _addArcadeFrame() {
        if (document.querySelector('.arcade-frame')) return;
        
        const frame = document.createElement('div');
        frame.className = 'arcade-frame';
        document.body.appendChild(frame);
        this._log('Arcade frame added');
    }

    /**
     * スムーズスクロール機能を初期化
     */
    _initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
        this._log('Smooth scroll initialized');
    }

    /**
     * グリッチエフェクトを初期化
     */
    _initGlitchEffect() {
        const applyGlitch = () => {
            const cards = document.querySelectorAll('.card-pixel, .game-card');
            if (cards.length === 0) return;
            
            const randomCard = cards[Math.floor(Math.random() * cards.length)];
            const originalFilter = randomCard.style.filter;
            
            // グリッチエフェクト適用
            randomCard.style.filter = 'hue-rotate(180deg) contrast(150%)';
            
            setTimeout(() => {
                randomCard.style.filter = originalFilter;
            }, 200);
        };

        const interval = setInterval(applyGlitch, this.config.glitchInterval);
        this.intervals.push(interval);
        this._log('Glitch effect initialized');
    }

    /**
     * カウンターアニメーションを初期化
     */
    _initCounterAnimation() {
        const counters = document.querySelectorAll('.stat-number, [data-counter]');
        if (counters.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.hasAttribute('data-animated')) {
                    this._animateCounter(entry.target);
                    entry.target.setAttribute('data-animated', 'true');
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => observer.observe(counter));
        this.observers.push(observer);
        this._log('Counter animation initialized');
    }

    /**
     * 個別のカウンターをアニメーション
     * @param {Element} element - カウンター要素
     */
    _animateCounter(element) {
        const text = element.textContent.replace(/[^\d]/g, '');
        const target = parseInt(text) || 0;
        const duration = 2000;
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // イージング関数（ease-out）
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(target * easeOut);
            
            element.textContent = current.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

    /**
     * パーティクルシステムを初期化
     */
    _initParticleSystem() {
        const interval = setInterval(() => {
            this._createParticle(); // 既存の_createParticleメソッドを使用
        }, this.config.particleInterval);
        this.intervals.push(interval);
        this._log('Particle system initialized');
    }

    /**
     * オーディオシステムを初期化
     */
    _initAudioSystem() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this._log('Audio system initialized');
        } catch (error) {
            this._log('Audio system initialization failed:', error);
        }
    }

    /**
     * ビープ音を再生
     * @param {number} frequency - 周波数
     * @param {number} duration - 持続時間（ms）
     */
    playBeep(frequency = 800, duration = 100) {
        if (!this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = 'square';

        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration / 1000);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration / 1000);
    }

    /**
     * ボタンエフェクトを初期化
     */
    _initButtonEffects() {
        const buttons = document.querySelectorAll('.btn-pixel, .btn-arcade, .play-button, .start-button');
        
        buttons.forEach(button => {
            // ホバーエフェクト
            button.addEventListener('mouseenter', () => {
                if (this.config.enableSoundEffects) {
                    this.playBeep(600, 50);
                }
                button.style.transform = 'scale(1.05)';
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'scale(1)';
            });

            // クリックエフェクト
            button.addEventListener('click', () => {
                if (this.config.enableSoundEffects) {
                    this.playBeep(400, 100);
                }
                
                // パルスエフェクト
                button.style.animation = 'pulse 0.3s ease-in-out';
                setTimeout(() => {
                    button.style.animation = '';
                }, 300);
            });
        });

        this._log('Button effects initialized');
    }

	/**
	 * 単一パーティクルを作成
	 */
	_createParticle() {
	    const particle = document.createElement('div');
	    const color = this.config.particleColors[
	        Math.floor(Math.random() * this.config.particleColors.length)
	    ];
	    
	    // パーティクルスタイル設定
	    Object.assign(particle.style, {
	        position: 'fixed',
	        width: '4px',
	        height: '4px',
	        background: color,
	        left: Math.random() * window.innerWidth + 'px',
	        top: '-10px',
	        pointerEvents: 'none',
	        zIndex: '500',
	        borderRadius: '1px'
	    });
	    
	    document.body.appendChild(particle);

	    // アニメーション
	    const fallDuration = 3000 + Math.random() * 2000;
	    const animation = particle.animate([
	        { 
	            transform: 'translateY(0px) rotate(0deg)', 
	            opacity: 1 
	        },
	        { 
	            transform: `translateY(${window.innerHeight + 20}px) rotate(360deg)`, 
	            opacity: 0 
	        }
	    ], {
	        duration: fallDuration,
	        easing: 'linear'
	    });

	    animation.onfinish = () => {
	        if (particle.parentNode) {
	            particle.remove();
	        }
	    };
	}

    /**
     * 新しいパーティクル群を一時的に生成
     * @param {number} count - パーティクル数
     */
    burst(count = 10) {
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                this._createParticle();
            }, i * 50);
        }
    }

    /**
     * グリッチエフェクトを手動で適用
     * @param {Element|string} target - 対象要素またはセレクタ
     */
    glitch(target) {
        const element = typeof target === 'string' 
            ? document.querySelector(target) 
            : target;
            
        if (!element) return;

        const originalFilter = element.style.filter;
        element.style.filter = 'hue-rotate(180deg) contrast(150%) saturate(200%)';
        
        setTimeout(() => {
            element.style.filter = originalFilter;
        }, 200);
    }

    /**
     * 設定を動的に更新
     * @param {Object} newConfig - 新しい設定
     */
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        this._log('Configuration updated');
    }

    /**
     * ライブラリを破棄
     */
    destroy() {
        // インターバルをクリア
        this.intervals.forEach(interval => clearInterval(interval));
        this.intervals = [];

        // オブザーバーを破棄
        this.observers.forEach(observer => observer.disconnect());
        this.observers = [];

        // 追加した要素を削除
        document.querySelectorAll('.scanlines, .arcade-frame').forEach(el => {
            if (el.parentNode) el.remove();
        });

        // オーディオコンテキストを閉じる
        if (this.audioContext) {
            this.audioContext.close();
            this.audioContext = null;
        }

        this.isInitialized = false;
        this._log('Pixel Theme destroyed');
    }

    /**
     * デバッグログ出力
     * @param {...any} args - ログ引数
     */
    _log(...args) {
        if (this.config.debug) {
            console.log('[PixelTheme]', ...args);
        }
    }
}

// シングルトンインスタンスを作成
const pixelThemeInstance = new PixelTheme();

// グローバルオブジェクトとして即座に公開
window.PixelTheme = {
    init: (options) => pixelThemeInstance.init(options),
    burst: (count) => pixelThemeInstance.burst(count),
    glitch: (target) => pixelThemeInstance.glitch(target),
    beep: (frequency, duration) => pixelThemeInstance.playBeep(frequency, duration),
    config: (config) => pixelThemeInstance.updateConfig(config),
    destroy: () => pixelThemeInstance.destroy(),
    getConfig: () => ({ ...pixelThemeInstance.config })
};

// 即座に利用可能であることを示すフラグ
window.PixelTheme.ready = true;

// CommonJS/ES Modules対応
if (typeof module !== 'undefined' && module.exports) {
    module.exports = window.PixelTheme;
}


document.addEventListener('DOMContentLoaded', function() {
    // Add click effect to cards
    document.querySelectorAll('.card-pixel').forEach(card => {
        card.addEventListener('click', function() {
            PixelTheme.glitch(this);
            PixelTheme.beep(800, 150);
        });
    });

    // Download page welcome effect
    setTimeout(() => {
        if (window.PixelTheme && pixelThemeInstance.isInitialized) {
            window.PixelTheme.burst(25);
        }
    }, 100);
});

/**
 * 使用例とAPI Documentation
 * 
 * === 基本的な使用方法 ===
 * 
 * // 基本初期化
 * PixelTheme.init();
 * 
 * // カスタム設定で初期化
 * PixelTheme.init({
 *   enableParticles: true,
 *   enableSoundEffects: true,
 *   particleInterval: 1000,
 *   debug: true
 * });
 * 
 * === API メソッド ===
 * 
 * // パーティクルバースト（20個のパーティクルを一気に生成）
 * PixelTheme.burst(20);
 * 
 * // 特定の要素にグリッチエフェクト適用
 * PixelTheme.glitch('.my-element');
 * PixelTheme.glitch(document.getElementById('myButton'));
 * 
 * // ビープ音再生（周波数800Hz、100ms）
 * PixelTheme.beep(800, 100);
 * 
 * // 設定の動的更新
 * PixelTheme.config({ particleInterval: 500 });
 * 
 * // 現在の設定を取得
 * const currentConfig = PixelTheme.getConfig();
 * 
 * // ライブラリの破棄
 * PixelTheme.destroy();
 * 
 * === HTMLでの使用 ===
 * 
 * <!-- CSS読み込み -->
 * <link rel="stylesheet" href="pixel-theme.css">
 * 
 * <!-- JavaScript読み込み -->
 * <script src="pixel-theme.js"></script>
 * 
 * <!-- 初期化 -->
 * <script>
 *   PixelTheme.init({
 *     enableParticles: true,
 *     enableSoundEffects: false
 *   });
 * </script>
 * 
 * === 必要なHTML要素のclass名 ===
 * 
 * - .btn-pixel, .btn-arcade: ボタンエフェクト対象
 * - .card-pixel, .game-card: グリッチエフェクト対象
 * - .stat-number, [data-counter]: カウンターアニメーション対象
 * - .scanlines: スキャンライン（自動生成可能）
 * - .arcade-frame: アーケードフレーム（自動生成可能）

 */



