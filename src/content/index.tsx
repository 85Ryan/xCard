import { useState, useRef, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Sparkles, X, Download, Copy, Palette, Maximize } from 'lucide-react';
import { toPng, toBlob } from 'html-to-image';
import './content.css';

// --- Types ---
interface TweetData {
    displayName: string;
    handle: string;
    avatar: string;
    content: string;
    timestamp: string;
    media: string[];
    isVerified: boolean;
    stats: {
        replies: string;
        retweets: string;
        likes: string;
        bookmarks: string;
        views: string;
    };
}

// --- Icons (Official X SVGs) ---
const X_ICONS = {
    reply: <path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z" />,
    retweet: <path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z" />,
    like: <path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z" />,
    views: <path d="M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21l.004-10h2L6 21H4zm9.248 0v-7h2v7h-2z" />,
    bookmark: <path d="M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5zM6.5 4c-.276 0-.5.22-.5.5v14.56l6-4.29 6 4.29V4.5c0-.28-.224-.5-.5-.5h-11z" />,
    share: <path d="M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41l-3.3 3.3-1.41-1.42L12 2.59zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z" />,
    verified: <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" />
};

const XIcon = ({ type, size = 18.75, className = "" }: { type: keyof typeof X_ICONS, size?: number, className?: string }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor">
        {X_ICONS[type]}
    </svg>
);

const BACKGROUNDS = [
    'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
    'linear-gradient(135deg, #f43f5e 0%, #fb923c 100%)',
    'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
    'linear-gradient(135deg, #22c55e 0%, #10b981 100%)',
    'linear-gradient(135deg, #3b82f6 0%, #2dd4bf 100%)',
    'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
    '#000000',
    '#1c1c1c',
];

const PADDINGS = {
    S: '30px',
    M: '60px',
    L: '100px'
};

// --- Utilities ---
const processTweetContent = (contentEl: Element | null): string => {
    if (!contentEl) return '';

    let html = '';
    const nodes = Array.from(contentEl.childNodes);

    nodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
            // Text node: escape and add
            const div = document.createElement('div');
            div.textContent = node.textContent || '';
            html += div.innerHTML;
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            const el = node as HTMLElement;

            if (el.tagName === 'BR') {
                html += '<br>';
                return;
            }

            // Check if it's a link (anchor) or a mention/hashtag (often spans with specific color or role)
            const isLink = el.tagName === 'A' || el.getAttribute('role') === 'link';
            const text = el.innerText;

            // Emoji support
            if (el.tagName === 'IMG' && el.classList.contains('emoji')) {
                html += (el as HTMLImageElement).alt || '';
                return;
            }

            // Normal text spans or anchors
            if (isLink || text.startsWith('@') || text.startsWith('#')) {
                const div = document.createElement('div');
                // Clean up link text: remove protocols and newlines to match X's visual display
                let cleanText = text.replace(/\r?\n|\r/g, '').trim();
                if (isLink) {
                    cleanText = cleanText.replace(/^https?:\/\//, '');
                }
                div.textContent = cleanText;
                html += `<span class="xcard-highlight">${div.innerHTML}</span>`;
            } else {
                html += processTweetContent(el);
            }
        }
    });

    return html;
};

const getTwitterTheme = () => {
    // Check for theme-specific background colors or data-twitter-variant
    const bodyStyle = window.getComputedStyle(document.body);
    const bgColor = bodyStyle.backgroundColor;

    // Explicitly check common colors to avoid lag
    if (bgColor === 'rgb(0, 0, 0)' || bgColor === 'black') return 'dark';
    if (bgColor === 'rgb(21, 32, 43)') return 'dim';
    return 'light';
};

const toBase64 = async (url: string): Promise<string> => {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (e) {
        console.error('Failed to convert image to base64:', e);
        return url;
    }
};

// --- Scraper ---
function extractTweetData(article: Element): TweetData | null {
    try {
        const userNameContainer = article.querySelector('[data-testid="User-Name"]');
        if (!userNameContainer) return null;

        const displayName = userNameContainer.querySelector('span')?.textContent || '';
        let handle = '';
        const handleLinks = article.querySelectorAll('a[role="link"]');
        for (const link of handleLinks) {
            const text = link.textContent || '';
            if (text.startsWith('@')) {
                handle = text;
                break;
            }
        }
        if (!handle) handle = userNameContainer.querySelector('div[dir="ltr"] span')?.textContent || '';
        if (handle && !handle.startsWith('@')) handle = `@${handle}`;

        const avatar = article.querySelector('[data-testid="Tweet-User-Avatar"] img')?.getAttribute('src') || '';
        const contentEl = article.querySelector('[data-testid="tweetText"]');

        // Check for "Show More" and try to find full text if truncated
        let targetContentEl = contentEl;
        const showMoreBtn = article.querySelector('[data-testid="tweet-text-show-more"]');
        if (showMoreBtn) {
            const potentialFullText = Array.from(article.querySelectorAll('div[dir="auto"]')).find(d =>
                (d as HTMLElement).innerText.length > ((contentEl as HTMLElement | null)?.innerText.length || 0) &&
                (d as HTMLElement).innerText.includes((contentEl as HTMLElement | null)?.innerText.substring(0, 20) || '')
            );
            if (potentialFullText) targetContentEl = potentialFullText;
        }

        // Use the new DOM processor for content
        const content = processTweetContent(targetContentEl);

        const timestamp = article.querySelector('time')?.getAttribute('datetime') || '';

        const media: string[] = [];
        article.querySelectorAll('[data-testid="tweetPhoto"] img').forEach(img => {
            const src = img.getAttribute('src');
            if (src) media.push(src);
        });

        const isVerified = !!article.querySelector('svg[aria-label="Verified account"], svg[aria-label="认证账号"], svg[aria-label="Premium"]');

        const replies = article.querySelector('[data-testid="reply"] span')?.textContent || '0';
        const retweets = article.querySelector('[data-testid="retweet"] span')?.textContent || '0';
        const likes = article.querySelector('[data-testid="like"] span')?.textContent || '0';
        const bookmarks = article.querySelector('[data-testid="bookmark"] span')?.textContent || '0';

        // Context-aware views scraping
        let views = '0';
        const analyticsEl = article.querySelector('[href*="/analytics"] span, [aria-label*="views"] span, [aria-label*="浏览"] span');
        if (analyticsEl) {
            views = analyticsEl.textContent || '0';
        } else {
            const detailSpans = article.querySelectorAll('span');
            for (const span of detailSpans) {
                const text = span.textContent || '';
                if ((text.includes('Views') || text.includes('浏览') || text.includes('查看')) && /^\s*[1-9]/.test(text)) {
                    views = text.replace(/[^0-9.万KMB]/g, '');
                    break;
                }
            }
        }

        return {
            displayName, handle, avatar, content, timestamp, media, isVerified,
            stats: { replies, retweets, likes, bookmarks, views }
        };
    } catch (err) {
        console.error('Failed to extract tweet data:', err);
        return null;
    }
}

// --- Components ---

const XLogo = ({ size = 20, className = "" }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

const EditorOverlay = ({ data, onClose }: { data: TweetData, onClose: () => void }) => {
    const [background, setBackground] = useState(BACKGROUNDS[0]);
    const [padding, setPadding] = useState<keyof typeof PADDINGS>('M');
    const [darkMode, setDarkMode] = useState(getTwitterTheme() !== 'light');
    const [isExporting, setIsExporting] = useState(false);
    const [processedData, setProcessedData] = useState<TweetData>(data);
    const cardRef = useRef<HTMLDivElement>(null);

    // Set the theme on the overlay root for consistency
    useEffect(() => {
        const theme = getTwitterTheme();
        document.documentElement.setAttribute('data-twitter-variant', theme);

        // Prevent background scrolling while preserving position
        const scrollY = window.scrollY;
        const originalStyle = {
            position: document.body.style.position,
            top: document.body.style.top,
            width: document.body.style.width,
            height: document.body.style.height,
            overflow: document.body.style.overflow
        };

        // Apply fixed position to lock scroll
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = '100%';
        document.body.style.overflow = 'hidden';

        return () => {
            // Restore original styles
            document.body.style.position = originalStyle.position;
            document.body.style.top = originalStyle.top;
            document.body.style.width = originalStyle.width;
            document.body.style.height = originalStyle.height;
            document.body.style.overflow = originalStyle.overflow;
            // Scroll back to the original position
            window.scrollTo(0, scrollY);
        };
    }, []);

    // Pre-process images to base64 to avoid CORS issues in export
    useEffect(() => {
        const processImages = async () => {
            const avatarBase64 = await toBase64(data.avatar);
            const mediaBase64 = await Promise.all(data.media.map(url => toBase64(url)));
            setProcessedData({
                ...data,
                avatar: avatarBase64,
                media: mediaBase64
            });
        };
        processImages();
    }, [data]);

    const handleDownload = async () => {
        if (!cardRef.current) return;
        setIsExporting(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 200));
            const dataUrl = await toPng(cardRef.current, {
                cacheBust: true,
                pixelRatio: 2,
                skipFonts: false
            });
            const link = document.createElement('a');
            link.download = `tweet-card-${data.handle}.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error('Failed to export image:', err);
            alert('Failed to download image. Try copying to clipboard instead.');
        } finally {
            setIsExporting(false);
        }
    };

    const handleCopy = async () => {
        if (!cardRef.current) return;
        setIsExporting(true);
        try {
            const blob = await toBlob(cardRef.current, { cacheBust: true, pixelRatio: 2 });
            if (blob) {
                await navigator.clipboard.write([
                    new ClipboardItem({ 'image/png': blob })
                ]);
                alert('Copied to clipboard!');
            }
        } catch (err) {
            console.error('Failed to copy image:', err);
        } finally {
            setIsExporting(false);
        }
    };

    const formatTimestamp = (ts: string) => {
        const date = new Date(ts);
        // Use local time format as requested
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
    };

    return (
        <div className="xcard-overlay" onClick={onClose}>
            <div className="xcard-modal" onClick={e => e.stopPropagation()}>
                <div className="xcard-header">
                    <div className="xcard-brand">
                        <Sparkles size={20} className="xcard-sparkle" />
                        <span>xCard Studio</span>
                    </div>
                    <button className="xcard-close" onClick={onClose}><X size={20} /></button>
                </div>

                <div className="xcard-body">
                    <div className="xcard-preview-area">
                        <div
                            ref={cardRef}
                            className="xcard-card-container"
                            style={{ background, padding: PADDINGS[padding] }}
                        >
                            <div className={`xcard-tweet-card ${darkMode ? 'xcard-dark' : ''}`}>
                                <XLogo className="xcard-x-logo" size={24} />

                                <div className="xcard-tweet-header">
                                    <img src={processedData.avatar} alt={data.displayName} className="xcard-avatar" />
                                    <div className="xcard-user-info">
                                        <div className="xcard-name-row">
                                            <span className="xcard-display-name">{data.displayName}</span>
                                            {data.isVerified && (
                                                <XIcon type="verified" size={18} className="xcard-verified-icon" />
                                            )}
                                        </div>
                                        <span className="xcard-handle">{data.handle}</span>
                                    </div>
                                </div>

                                <div className="xcard-tweet-content" dangerouslySetInnerHTML={{ __html: data.content }} />

                                {processedData.media.length > 0 && (
                                    <div className="xcard-tweet-media" style={{ gridTemplateColumns: data.media.length > 1 ? '1fr 1fr' : '1fr' }}>
                                        {processedData.media.map((url, i) => (
                                            <img key={i} src={url} alt="media" />
                                        ))}
                                    </div>
                                )}

                                <div className="xcard-time-row">
                                    <span className="xcard-time">{formatTimestamp(data.timestamp)}</span>
                                </div>

                                <div className="xcard-tweet-footer">
                                    <div className="xcard-metrics">
                                        <div className="xcard-metric-item"><XIcon type="reply" size={18.75} /> {data.stats.replies}</div>
                                        <div className="xcard-metric-item"><XIcon type="retweet" size={18.75} /> {data.stats.retweets}</div>
                                        <div className="xcard-metric-item"><XIcon type="like" size={18.75} /> {data.stats.likes}</div>
                                        <div className="xcard-metric-item"><XIcon type="views" size={18.75} /> {data.stats.views}</div>
                                        <div className="xcard-metric-item"><XIcon type="share" size={18.75} /></div>
                                    </div>
                                </div>

                                <div className="xcard-watermark">
                                    Created with xCard
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="xcard-controls">
                        <div className="xcard-section">
                            <label><Palette size={16} /> Background</label>
                            <div className="xcard-grid">
                                {BACKGROUNDS.map(bg => (
                                    <button
                                        key={bg}
                                        className={`xcard-swatch ${background === bg ? 'active' : ''}`}
                                        style={{ background: bg }}
                                        onClick={() => setBackground(bg)}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="xcard-section">
                            <label><Maximize size={16} /> Padding</label>
                            <div className="xcard-toggle-group">
                                {(['S', 'M', 'L'] as const).map(p => (
                                    <button
                                        key={p}
                                        className={padding === p ? 'active' : ''}
                                        onClick={() => setPadding(p)}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="xcard-section">
                            <label><Maximize size={16} /> Theme</label>
                            <div className="xcard-toggle-group">
                                <button className={!darkMode ? 'active' : ''} onClick={() => setDarkMode(false)}>Light</button>
                                <button className={darkMode ? 'active' : ''} onClick={() => setDarkMode(true)}>Dark</button>
                            </div>
                        </div>

                        <div className="xcard-actions">
                            <button className="xcard-btn-secondary" onClick={handleCopy} disabled={isExporting}>
                                <Copy size={18} /> {isExporting ? 'Processing...' : 'Copy'}
                            </button>
                            <button className="xcard-btn-primary" onClick={handleDownload} disabled={isExporting}>
                                <Download size={18} /> {isExporting ? 'Exporting...' : 'Download'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Main Injection ---

function injectMenuItem() {
    const menu = document.querySelector('[role="menu"]');
    if (!menu || menu.querySelector('.xcard-menu-item')) return;

    // Only inject in the Share menu as per request
    const menuText = menu.textContent || '';
    const isShareMenu = menuText.includes('Copy link') || menuText.includes('复制链接') || menuText.includes('Share post via');

    if (!isShareMenu) return;

    const activeArticle = document.querySelector('article:hover') ||
        Array.from(document.querySelectorAll('article')).find(a => a.contains(document.activeElement));

    if (!activeArticle) return;

    const itemContainer = document.createElement('div');
    itemContainer.className = 'xcard-menu-item';
    itemContainer.setAttribute('role', 'menuitem');

    // Set theme variant on the container itself for immediate styling
    const theme = getTwitterTheme();
    document.documentElement.setAttribute('data-twitter-variant', theme);

    itemContainer.innerHTML = `
    <div class="xcard-menu-item-icon">
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
      </svg>
    </div>
    <div class="xcard-menu-item-text">Create xCard</div>
  `;

    itemContainer.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const backdrop = document.querySelector('[data-testid="mask"]');
        if (backdrop) (backdrop as HTMLElement).click();

        const data = extractTweetData(activeArticle);
        if (data) showEditor(data);
    });

    menu.appendChild(itemContainer);
}

function showEditor(data: TweetData) {
    const overlayContainer = document.createElement('div');
    overlayContainer.id = 'xcard-overlay-root';
    document.body.appendChild(overlayContainer);

    const root = createRoot(overlayContainer);
    const handleClose = () => {
        root.unmount();
        overlayContainer.remove();
    };

    root.render(<EditorOverlay data={data} onClose={handleClose} />);
}

const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.addedNodes.length > 0) {
            injectMenuItem();
        }
    });
});

observer.observe(document.body, {
    childList: true,
    subtree: true,
});
