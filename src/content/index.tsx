import { useState, useRef, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { X, Download, Copy, Paintbrush, Palette, Sun, Moon, AppWindowMac, CheckCircle, AlertCircle, Grid } from 'lucide-react';
import { toPng, toBlob } from 'html-to-image';
import { t } from './i18n';
import './content.css';

// --- Types ---
interface SubTweet {
    displayName: string;
    handle: string;
    avatar: string;
    content: string;
    media: string[];
    verificationType: 'none' | 'blue' | 'gold';
    timestamp?: string;
}

interface TweetData {
    displayName: string;
    handle: string;
    avatar: string;
    content: string;
    timestamp: string;
    media: string[];
    videoPoster?: string;
    verificationType: 'none' | 'blue' | 'gold';
    stats: {
        replies: string;
        retweets: string;
        likes: string;
        bookmarks: string;
        views: string;
    };
    quotedTweet?: SubTweet;
    parentTweet?: SubTweet;
}

// --- Icons (Official X SVGs) ---
const X_ICONS = {
    reply: <path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z" />,
    retweet: <path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z" />,
    like: <path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z" />,
    likeFilled: <path d="M20.884 13.19c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z" />,
    views: <path d="M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21l.004-10h2L6 21H4zm9.248 0v-7h2v7h-2z" />,
    bookmark: <path d="M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5zM6.5 4c-.276 0-.5.22-.5.5v14.56l6-4.29 6 4.29V4.5c0-.28-.224-.5-.5-.5h-11z" />,
    share: <path d="M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41l-3.3 3.3-1.41-1.42L12 2.59zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z" />,
    verifiedBlue: <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" fill="#1d9bf0" />,
    verifiedGold: (
        <g>
            <linearGradient gradientUnits="userSpaceOnUse" id="1-a" x1="4.411" x2="18.083" y1="2.495" y2="21.508">
                <stop offset="0" stopColor="#f4e72a"></stop>
                <stop offset=".539" stopColor="#cd8105"></stop>
                <stop offset=".68" stopColor="#cb7b00"></stop>
                <stop offset="1" stopColor="#f4ec26"></stop>
                <stop offset="1" stopColor="#f4e72a"></stop>
            </linearGradient>
            <linearGradient gradientUnits="userSpaceOnUse" id="1-b" x1="5.355" x2="16.361" y1="3.395" y2="19.133">
                <stop offset="0" stopColor="#f9e87f"></stop>
                <stop offset=".406" stopColor="#e2b719"></stop>
                <stop offset=".989" stopColor="#e2b719"></stop>
            </linearGradient>
            <g clipRule="evenodd" fillRule="evenodd">
                <path d="M13.324 3.848L11 1.6 8.676 3.848l-3.201-.453-.559 3.184L2.06 8.095 3.48 11l-1.42 2.904 2.856 1.516.559 3.184 3.201-.452L11 20.4l2.324-2.248 3.201.452.559-3.184 2.856-1.516L18.52 11l1.42-2.905-2.856-1.516-.559-3.184zm-7.09 7.575l3.428 3.428 5.683-6.206-1.347-1.247-4.4 4.795-2.072-2.072z" fill="url(#1-a)"></path>
                <path d="M13.101 4.533L11 2.5 8.899 4.533l-2.895-.41-.505 2.88-2.583 1.37L4.2 11l-1.284 2.627 2.583 1.37.505 2.88 2.895-.41L11 19.5l2.101-2.033 2.895.41.505-2.88 2.583-1.37L17.8 11l1.284-2.627-2.583-1.37-.505-2.88zm-6.868 6.89l3.429 3.428 5.683-6.206-1.347-1.247-4.4 4.795-2.072-2.072z" fill="url(#1-b)"></path>
                <path d="M6.233 11.423l3.429 3.428 5.65-6.17.038-.033-.005 1.398-5.683 6.206-3.429-3.429-.003-1.405.005.003z" fill="#d18800"></path>
            </g>
        </g>
    )
};

const XIcon = ({ type, size = 18.75, className = "", color = "currentColor" }: { type: keyof typeof X_ICONS, size?: number, className?: string, color?: string }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill={color}>
        {X_ICONS[type]}
    </svg>
);

const BACKGROUNDS = [
    'linear-gradient(135deg, #000000 0%, #434343 100%)', // Black Metal
    'linear-gradient(135deg, #09203f 0%, #537895 100%)', // Deep Ocean
    'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)', // Cyberpunk
    'linear-gradient(135deg, #0F2027 0%, #203A43 50%, #2C5364 100%)', // Nordic Sky
    'linear-gradient(135deg, #2b5876 0%, #4e4376 100%)', // Midnight Bloom
    'linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%)', // Electric Blue
    'linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%)', // Cosmic Violet
    'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', // Emerald Night
    'linear-gradient(135deg, #02aab0 0%, #00cdac 100%)', // Deep Sea
    'linear-gradient(135deg, #FAD961 0%, #F76B1C 100%)', // Juicy Orange
    'linear-gradient(135deg, #FF9A8B 0%, #FF6A88 55%, #FF99AC 100%)', // Coral Silk
    'linear-gradient(135deg, #cb2d3e 0%, #ef473a 100%)', // Firewatch
];

const TEXTURES = ['grid', 'dots', 'lines', 'wave'];

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
            const isEmoji = el.tagName === 'IMG' && (
                el.classList.contains('emoji') ||
                (el as HTMLImageElement).src.includes('emoji')
            );

            if (isEmoji) {
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

        // Extract Quoted Tweet Container early to filter media
        // Robust strategy: Find all link roles that look like tweet containers
        const allLinks = Array.from(article.querySelectorAll('div[role="link"]'));
        const quoteEl = allLinks.find(el => {
            // Must contain a user name to be a valid quote block
            const hasUserName = !!el.querySelector('[data-testid="User-Name"]');
            // Must not be a simple text wrapper inside the main tweet
            const isInsideMainText = el.closest('[data-testid="tweetText"]') !== null;
            return hasUserName && !isInsideMainText;
        });

        const media: string[] = [];
        article.querySelectorAll('[data-testid="tweetPhoto"] img').forEach(img => {
            // Skip media that belongs to the quoted tweet
            if (quoteEl && quoteEl.contains(img)) return;

            const src = img.getAttribute('src');
            if (src) media.push(src);
        });

        // Detect video poster
        // Filter out video elements inside the quoted tweet
        const findVideoPoster = () => {
            const candidates = [
                ...Array.from(article.querySelectorAll('[data-testid="videoPlayer"] img, [data-testid="videoComponent"] img')),
                ...Array.from(article.querySelectorAll('[data-testid="videoPlayer"] video'))
            ];

            for (const el of candidates) {
                if (quoteEl && quoteEl.contains(el)) continue;

                if (el.tagName === 'VIDEO') {
                    const poster = el.getAttribute('poster');
                    if (poster) return poster;
                } else {
                    const src = el.getAttribute('src');
                    if (src) return src;
                }
            }
            return undefined;
        };

        const videoPoster = findVideoPoster();

        const isGold = !!article.querySelector('svg[data-testid="icon-verified-gold"]');
        const isVerified = !!article.querySelector('svg[aria-label="Verified account"], svg[aria-label="认证账号"], svg[aria-label="Premium"]');
        const verificationType = isGold ? 'gold' : (isVerified ? 'blue' : 'none');

        // Helper to find handle
        const findHandle = (el: Element) => {
            const handleLink = Array.from(el.querySelectorAll('a')).find(a => a.textContent?.trim().startsWith('@'));
            if (handleLink) return handleLink.textContent?.trim() || '';
            const allText = el.textContent || '';
            const match = allText.match(/@\w+/);
            return match ? match[0] : '';
        };

        // Extract Quoted Tweet
        // Robust strategy: Find all link roles that look like tweet containers
        // We look for a container that has User-Name and is NOT the main tweet text container


        let quotedTweet: SubTweet | undefined;
        if (quoteEl) {
            const qDisplayName = quoteEl.querySelector('[data-testid="User-Name"] span')?.textContent || '';
            const qHandle = findHandle(quoteEl.querySelector('[data-testid="User-Name"]') || quoteEl);
            const qAvatar = quoteEl.querySelector('[data-testid="Tweet-User-Avatar"] img')?.getAttribute('src') || '';
            const qContentEl = quoteEl.querySelector('[data-testid="tweetText"]');
            const qContent = qContentEl ? qContentEl.innerHTML : '';
            const qMediaLinks = Array.from(quoteEl.querySelectorAll('[data-testid="tweetPhoto"] img, [data-testid="card.wrapper"] img'))
                .map(img => img.getAttribute('src') || '')
                .filter(Boolean);

            const qIsGold = !!quoteEl.querySelector('svg[data-testid="icon-verified-gold"]');
            const qIsVerified = !!quoteEl.querySelector('svg[aria-label="Verified account"], svg[aria-label="认证账号"], svg[aria-label="Premium"]');
            const qVerificationType = qIsGold ? 'gold' : (qIsVerified ? 'blue' : 'none');

            // Only consider it valid if we found at least a display name
            if (qDisplayName) {
                quotedTweet = {
                    displayName: qDisplayName,
                    handle: qHandle,
                    avatar: qAvatar,
                    content: qContent,
                    media: qMediaLinks,
                    verificationType: qVerificationType
                };
            }
        }

        // Extract Parent Tweet (if in conversation)
        // More strict check: must have a vertical line connection
        const timelineArticles = Array.from(document.querySelectorAll('article[data-testid="tweet"]'));
        const tweetIndex = timelineArticles.findIndex(a => a.contains(article));
        let parentTweet: SubTweet | undefined;

        if (tweetIndex > 0) {
            const parentEl = timelineArticles[tweetIndex - 1];
            // Check if there is a visual connector element between parent and current article's avatar area
            // Or if the parent element contains a vertical bar "r-1re7ezh" or similar.
            // Simplest robust check: is the current page a status page for the current tweet?
            const isThreadView = window.location.pathname.includes('/status/');

            if (isThreadView && parentEl) {
                const pDisplayName = parentEl.querySelector('[data-testid="User-Name"] span')?.textContent || '';
                const pHandle = findHandle(parentEl.querySelector('[data-testid="User-Name"]') || parentEl);

                // If we found a valid user handle, assume it's a valid parent in this thread context
                if (pDisplayName && pHandle) {
                    const pAvatar = parentEl.querySelector('[data-testid="Tweet-User-Avatar"] img')?.getAttribute('src') || '';
                    const pContentEl = parentEl.querySelector('[data-testid="tweetText"]');
                    const pContent = pContentEl ? pContentEl.innerHTML : '';
                    const pMediaLinks = Array.from(parentEl.querySelectorAll('[data-testid="tweetPhoto"] img, [data-testid="videoPlayer"] img, [data-testid="card.wrapper"] img'))
                        .map(img => img.getAttribute('src') || '')
                        .filter(Boolean);

                    // Try to get video poster if img not found in videoPlayer
                    if (pMediaLinks.length === 0) {
                        const poster = parentEl.querySelector('video')?.getAttribute('poster');
                        if (poster) pMediaLinks.push(poster);
                    }

                    const pIsGold = !!parentEl.querySelector('svg[data-testid="icon-verified-gold"]');
                    const pIsVerified = !!parentEl.querySelector('svg[aria-label="Verified account"], svg[aria-label="认证账号"], svg[aria-label="Premium"]');
                    const pVerificationType = pIsGold ? 'gold' : (pIsVerified ? 'blue' : 'none');

                    parentTweet = {
                        displayName: pDisplayName,
                        handle: pHandle,
                        avatar: pAvatar,
                        content: pContent,
                        media: pMediaLinks,
                        verificationType: pVerificationType
                    };
                }
            }
        }

        const replies = article.querySelector('[data-testid="reply"] span')?.textContent || '0';
        const retweets = article.querySelector('[data-testid="retweet"] span, [data-testid="unretweet"] span')?.textContent || '0';
        const likes = article.querySelector('[data-testid="like"] span, [data-testid="unlike"] span')?.textContent || '0';
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
            displayName, handle, avatar, content, timestamp, media, videoPoster, verificationType,
            quotedTweet, parentTweet,
            stats: { replies, retweets, likes, bookmarks, views }
        };
    } catch (err) {
        console.error('Failed to extract tweet data:', err);
        return null;
    }
}

// --- Components ---

const XCardLogoIcon = ({ size = 36, theme = 'light' }: { size?: number, theme?: 'light' | 'dark' | 'glass' }) => {
    const themeForLogo = theme === 'light' ? 'light' : 'dark';
    // @ts-ignore
    const logoSrc = chrome.runtime.getURL(themeForLogo === 'dark' ? 'src/assets/card-light.svg' : 'src/assets/card-dark.svg');

    return (
        <img
            src={logoSrc}
            alt="xCard Logo"
            style={{ width: size, height: size, objectFit: 'contain' }}
        />
    );
};

const XLogo = ({ size = 20, className = "", color = "currentColor" }: { size?: number, className?: string, color?: string }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill={color}>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

const ToggleSwitch = ({ active, onClick }: { active: boolean, onClick: () => void }) => (
    <div className={`xcard-toggle-switch ${active ? 'active' : ''}`} onClick={onClick}>
        <div className="xcard-toggle-knob" />
    </div>
);

const EditorOverlay = ({ data, onClose }: { data: TweetData, onClose: () => void }) => {
    const [background, setBackground] = useState(BACKGROUNDS[0]);
    const [padding, setPadding] = useState<keyof typeof PADDINGS>('M');
    const [theme, setTheme] = useState<'light' | 'dark' | 'glass'>(getTwitterTheme() === 'light' ? 'light' : 'dark');
    const [isExporting, setIsExporting] = useState(false);
    const [simulateLiked, setSimulateLiked] = useState(false);
    const [showContext, setShowContext] = useState(true);
    const [transparentExport, setTransparentExport] = useState(false);
    const [nativeTheme, setNativeTheme] = useState<string>('light');
    const [processedData, setProcessedData] = useState<TweetData>(data);
    const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

    // Texture State
    const [enableTexture, setEnableTexture] = useState(true);
    const [textureStyle, setTextureStyle] = useState('grid');

    // For Glass Blur Export
    const [glassBackground, setGlassBackground] = useState<string | null>(null);
    const [captureMode, setCaptureMode] = useState<'normal' | 'background-only'>('normal');

    const cardRef = useRef<HTMLDivElement>(null);

    // Initial Setup: Scroll Lock & Native Theme Detection
    useEffect(() => {
        // 1. Detect and set native theme for Modal UI
        const currentNativeTheme = getTwitterTheme();
        setNativeTheme(currentNativeTheme);
        document.documentElement.setAttribute('data-twitter-variant', currentNativeTheme);

        // 2. Prevent background scrolling while preserving position
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
            const videoPosterBase64 = data.videoPoster ? await toBase64(data.videoPoster) : undefined;

            setProcessedData({
                ...data,
                avatar: avatarBase64,
                media: mediaBase64,
                videoPoster: videoPosterBase64
            });
        };
        processImages();
    }, [data]);

    // Toast Auto-Dismiss
    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    const handleDownload = async () => {
        if (!cardRef.current) return;
        setIsExporting(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 200));

            const node = transparentExport
                ? cardRef.current.querySelector('.xcard-tweet-card') as HTMLElement
                : cardRef.current;

            if (!node) throw new Error("Node not found");

            // --- DOUBLE CAPTURE STRATEGY FOR GLASS THEME ---
            // If Glass theme (and NOT transparent export), we manually capture the background first
            if (theme === 'glass' && !transparentExport) {
                // 1. Hide Content, Show only Background
                setCaptureMode('background-only');
                await new Promise(resolve => setTimeout(resolve, 100)); // Wait for render

                // Capture the container (background only)
                const bgUrl = await toPng(cardRef.current, {
                    cacheBust: false,
                    pixelRatio: 2,
                    skipFonts: true, // Speed optimization
                });

                // 2. Set as blurred background image
                setGlassBackground(bgUrl);
                setCaptureMode('normal');
                await new Promise(resolve => setTimeout(resolve, 100)); // Wait for render
            }
            // ----------------------------------------------

            // Explicitly calculate dimensions and strip styles that might confuse clones
            const dataUrl = await toPng(node, {
                cacheBust: false,
                pixelRatio: 2,
                skipFonts: false,
                width: node.offsetWidth,
                height: node.offsetHeight,
                style: {
                    margin: '0',
                    transform: 'none',
                    left: '0',
                    top: '0',
                    boxShadow: transparentExport ? 'none' : undefined
                }
            });
            const link = document.createElement('a');
            link.download = `tweet-card-${data.handle}${transparentExport ? '-transparent' : ''}.png`;
            link.href = dataUrl;
            link.click();
            setToast({ message: t('copySuccess').replace('clipboard', 'disk'), type: 'success' });
        } catch (err) {
            console.error('Failed to export image:', err);
            setToast({ message: t('downloadFail'), type: 'error' });
        } finally {
            setIsExporting(false);
            setGlassBackground(null); // Cleanup
            setCaptureMode('normal');
        }
    };

    const handleCopy = async () => {
        if (!cardRef.current) return;
        setIsExporting(true);
        try {
            const node = transparentExport
                ? cardRef.current.querySelector('.xcard-tweet-card') as HTMLElement
                : cardRef.current;

            if (!node) throw new Error("Node not found");

            // --- DOUBLE CAPTURE STRATEGY FOR GLASS THEME ---
            if (theme === 'glass' && !transparentExport) {
                setCaptureMode('background-only');
                await new Promise(resolve => setTimeout(resolve, 100));

                const bgUrl = await toPng(cardRef.current, {
                    cacheBust: false,
                    pixelRatio: 2,
                    skipFonts: true,
                });

                setGlassBackground(bgUrl);
                setCaptureMode('normal');
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            // ----------------------------------------------

            const blob = await toBlob(node, {
                cacheBust: false,
                pixelRatio: 2,
                width: node.offsetWidth,
                height: node.offsetHeight,
                style: {
                    margin: '0',
                    transform: 'none',
                    left: '0',
                    top: '0',
                    boxShadow: transparentExport ? 'none' : undefined
                }
            });
            if (blob) {
                await navigator.clipboard.write([
                    new ClipboardItem({ 'image/png': blob })
                ]);
                setToast({ message: t('copySuccess'), type: 'success' });
            }
        } catch (err) {
            console.error('Failed to copy image:', err);
            setToast({ message: t('copyFail'), type: 'error' });
        } finally {
            setIsExporting(false);
            setGlassBackground(null);
            setCaptureMode('normal');
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
                        <XCardLogoIcon size={36} theme={nativeTheme as any} />
                        <span>{t('brandName')}</span>
                    </div>
                    <button className="xcard-close" onClick={onClose}><X size={20} /></button>
                </div>

                <div className="xcard-body">
                    <div className="xcard-preview-area">
                        <div
                            ref={cardRef}
                            className={`xcard-card-container ${isExporting ? 'xcard-exporting' : ''}`}
                            style={{ background, padding: PADDINGS[padding] }}
                        >
                            {/* Texture layer */}
                            {enableTexture && <div className="xcard-bg-texture" data-texture={textureStyle} />}
                            {/* Glow blobs */}
                            <div className={`xcard-bg-glow xcard-glow-1`} />
                            <div className={`xcard-bg-glow xcard-glow-2`} />

                            <div className={`xcard-tweet-card ${theme === 'dark' ? 'xcard-dark' : theme === 'glass' ? 'xcard-glass' : ''} ${captureMode === 'background-only' ? 'xcard-hide-content' : ''}`}>

                                {/* FAKE BLUR BACKGROUND LAYER (Only visible during 2nd pass of export) */}
                                {glassBackground && (
                                    <div className="xcard-fake-blur-bg">
                                        <img src={glassBackground} alt="" />
                                        <div className="xcard-fake-blur-overlay" />
                                    </div>
                                )}

                                <XLogo
                                    className="xcard-x-logo"
                                    size={24}
                                    color={theme === 'light' ? '#000' : '#fff'}
                                />

                                {showContext && data.parentTweet && (
                                    <div className="xcard-parent">
                                        <div className="xcard-thread-line" />
                                        <img
                                            src={data.parentTweet.avatar}
                                            className="xcard-avatar"
                                            alt={data.parentTweet.displayName}
                                        />
                                        <div className="xcard-user-info">
                                            <div className="xcard-name-row">
                                                <span className="xcard-display-name">{data.parentTweet.displayName}</span>
                                                {data.parentTweet.verificationType !== 'none' && (
                                                    <XIcon type={data.parentTweet.verificationType === 'gold' ? 'verifiedGold' : 'verifiedBlue'} size={14} />
                                                )}
                                            </div>
                                            <span className="xcard-handle">{data.parentTweet.handle}</span>
                                            <div className="xcard-tweet-content" dangerouslySetInnerHTML={{ __html: data.parentTweet.content }} />
                                        </div>
                                    </div>
                                )}

                                <div className="xcard-tweet-header">
                                    <img
                                        src={processedData.avatar}
                                        alt={data.displayName}
                                        className={`xcard-avatar ${data.verificationType === 'gold' ? 'gold' : ''}`}
                                    />
                                    <div className="xcard-user-info">
                                        <div className="xcard-name-row">
                                            <span className="xcard-display-name">{data.displayName}</span>
                                            {data.verificationType !== 'none' && (
                                                <XIcon
                                                    type={data.verificationType === 'gold' ? 'verifiedGold' : 'verifiedBlue'}
                                                    size={18.75}
                                                    className="xcard-verified-icon"
                                                />
                                            )}
                                        </div>
                                        <span className="xcard-handle">{data.handle}</span>
                                    </div>
                                </div>

                                <div className="xcard-tweet-content" dangerouslySetInnerHTML={{ __html: data.content }} />

                                {processedData.media.length > 0 && !processedData.videoPoster && (
                                    <div className={`xcard-tweet-media ${processedData.media.length > 1 ? 'multi-image' : ''}`} style={{ gridTemplateColumns: processedData.media.length > 1 ? '1fr 1fr' : '1fr' }}>
                                        {processedData.media.map((url, i) => (
                                            <img key={i} src={url} alt="media" />
                                        ))}
                                    </div>
                                )}

                                {processedData.videoPoster && (
                                    <div className="xcard-tweet-video">
                                        <img src={processedData.videoPoster} alt="video thumbnail" />
                                        <div className="xcard-video-play-btn">
                                            <svg viewBox="0 0 24 24" width="48" height="48" fill="white">
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                        </div>
                                    </div>
                                )}

                                {showContext && data.quotedTweet && (
                                    <div className="xcard-quote">
                                        <div className="xcard-tweet-header" style={{ marginBottom: '6px' }}>
                                            <img
                                                src={data.quotedTweet.avatar}
                                                className="xcard-avatar"
                                                style={{ width: '20px', height: '20px', marginRight: '4px' }}
                                                alt={data.quotedTweet.displayName}
                                            />
                                            <div className="xcard-user-info" style={{ flexDirection: 'row', alignItems: 'center', gap: '2px' }}>
                                                <span className="xcard-display-name" style={{ fontSize: '14px' }}>{data.quotedTweet.displayName}</span>
                                                {data.quotedTweet.verificationType !== 'none' && (
                                                    <XIcon type={data.quotedTweet.verificationType === 'gold' ? 'verifiedGold' : 'verifiedBlue'} size={14} />
                                                )}
                                                <span className="xcard-handle" style={{ fontSize: '12px' }}>{data.quotedTweet.handle}</span>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', gap: '12px' }}>
                                            {/* Left side: Media Thumbnail (if any) */}
                                            {data.quotedTweet.media.length > 0 && (
                                                <div className="xcard-quote-thumbnail">
                                                    <img src={data.quotedTweet.media[0]} alt="media" />
                                                    {data.quotedTweet.media.length > 1 && (
                                                        <div className="media-badge">+{data.quotedTweet.media.length - 1}</div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Right side: Content */}
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div className="xcard-tweet-content" style={{ fontSize: '14px', marginTop: '0' }} dangerouslySetInnerHTML={{ __html: data.quotedTweet.content }} />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="xcard-time-row">
                                    <span className="xcard-time">{formatTimestamp(data.timestamp)}</span>
                                </div>

                                <div className="xcard-tweet-footer">
                                    <div className="xcard-metrics">
                                        <div className="xcard-metric-item">
                                            <XIcon type="reply" size={18.75} />
                                            {data.stats.replies !== '0' && data.stats.replies}
                                        </div>
                                        <div className="xcard-metric-item">
                                            <XIcon type="retweet" size={18.75} />
                                            {data.stats.retweets !== '0' && data.stats.retweets}
                                        </div>
                                        <div className={`xcard-metric-item ${simulateLiked ? 'liked' : ''}`}>
                                            <XIcon
                                                type={simulateLiked ? "likeFilled" : "like"}
                                                size={18.75}
                                                color={simulateLiked ? '#f91880' : 'currentColor'}
                                            />
                                            {data.stats.likes !== '0' && data.stats.likes}
                                        </div>
                                        <div className="xcard-metric-item">
                                            <XIcon type="views" size={18.75} />
                                            {data.stats.views !== '0' && data.stats.views}
                                        </div>
                                        <div className="xcard-metric-item">
                                            <XIcon type="share" size={18.75} />
                                        </div>
                                    </div>
                                </div>

                                <div className={`xcard-watermark ${theme === 'dark' ? 'xcard-dark-watermark' : theme === 'glass' ? 'xcard-glass-watermark' : ''}`}>
                                    {t('createdWith')}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="xcard-controls">
                        <div className="xcard-section">
                            <label><Paintbrush size={16} /> {t('background')}</label>
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
                            <div className="xcard-toggle-item">
                                <label><Grid size={16} /> {t('texture')}</label>
                                <ToggleSwitch active={enableTexture} onClick={() => setEnableTexture(!enableTexture)} />
                            </div>

                            {enableTexture && (
                                <div className="xcard-toggle-group" style={{ marginTop: '12px' }}>
                                    {TEXTURES.map(tex => (
                                        <button
                                            key={tex}
                                            className={textureStyle === tex ? 'active' : ''}
                                            onClick={() => setTextureStyle(tex)}
                                        >
                                            {t(tex)}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="xcard-section">
                            <label><Palette size={16} /> {t('appearance')}</label>
                            <div className="xcard-toggle-group">
                                <button className={padding === 'S' ? 'active' : ''} onClick={() => setPadding('S')}>S</button>
                                <button className={padding === 'M' ? 'active' : ''} onClick={() => setPadding('M')}>M</button>
                                <button className={padding === 'L' ? 'active' : ''} onClick={() => setPadding('L')}>L</button>
                            </div>
                            <div className="xcard-toggle-group">
                                <button className={theme === 'light' ? 'active' : ''} onClick={() => setTheme('light')}>
                                    <Sun size={14} /> <span>{t('light')}</span>
                                </button>
                                <button className={theme === 'dark' ? 'active' : ''} onClick={() => setTheme('dark')}>
                                    <Moon size={14} /> <span>{t('dark')}</span>
                                </button>
                                <button className={theme === 'glass' ? 'active' : ''} onClick={() => setTheme('glass')}>
                                    <AppWindowMac size={14} /> <span>{t('glass')}</span>
                                </button>
                            </div>
                            <div className="xcard-toggle-item">
                                <div className="xcard-toggle-label">
                                    <XIcon type="likeFilled" size={14} color={simulateLiked ? '#f91880' : 'var(--xcard-text-secondary)'} />
                                    <span>{t('simulateLiked')}</span>
                                </div>
                                <ToggleSwitch active={simulateLiked} onClick={() => setSimulateLiked(!simulateLiked)} />
                            </div>

                            <div className="xcard-toggle-item">
                                <label>{t('showContext')}</label>
                                <div
                                    className={`xcard-toggle-switch ${showContext ? 'active' : ''}`}
                                    onClick={() => setShowContext(!showContext)}
                                >
                                    <div className="xcard-toggle-knob" />
                                </div>
                            </div>
                            <div className="xcard-toggle-item">
                                <label>{t('exportCardOnly')}</label>
                                <div
                                    className={`xcard-toggle-switch ${transparentExport ? 'active' : ''}`}
                                    onClick={() => setTransparentExport(!transparentExport)}
                                >
                                    <div className="xcard-toggle-knob" />
                                </div>
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

                {toast && (
                    <div className={`xcard-toast ${toast.type}`}>
                        {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                        <span>{toast.message}</span>
                    </div>
                )}
            </div>
        </div >
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
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-fullscreen-icon lucide-fullscreen">
        <path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><rect width="10" height="8" x="7" y="8" rx="1"/>
      </svg>
    </div>
    <div class="xcard-menu-item-text">${t('shareMenu')}</div>
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
