export type LanguageCode = 'en' | 'zh-CN' | 'zh-TW' | 'es' | 'pt' | 'it';

const TRANSLATIONS: Record<string, Record<string, string>> = {
    'en': {
        createdWith: 'Created with xCard',
        background: 'Background',
        appearance: 'Appearance',
        light: 'Light',
        dark: 'Dark',
        glass: 'Glass',
        simulateLiked: 'Simulate Liked',
        showContext: 'Show Context',
        exportCardOnly: 'Export Card Only',
        copySuccess: 'Copied to clipboard!',
        copyFail: 'Failed to copy image...',
        downloadFail: 'Failed to download image...',
        brandName: 'xCard Studio',
        shareMenu: 'Share with xCard',
        extensionActive: 'Your X.com extension is active!',
        feature1: 'Button injected on every tweet',
        feature2: 'Custom backgrounds & padding',
        feature3: 'Dark mode support',
        feature4: 'One-click PNG export',
        ready: 'Ready to go',
        footer: 'Go to X.com to start creating cards.'
    },
    'zh-CN': {
        createdWith: 'Created with xCard',
        background: '背景风格',
        appearance: '外观设置',
        light: '浅色',
        dark: '深色',
        glass: '玻璃',
        simulateLiked: '模拟点赞',
        showContext: '显示上下文',
        exportCardOnly: '仅导出卡片',
        copySuccess: '已复制到剪贴板！',
        copyFail: '复制失败...',
        downloadFail: '下载失败...',
        brandName: 'xCard 工作室',
        shareMenu: '使用 xCard 分享',
        extensionActive: '您的 X.com 扩展已激活！',
        feature1: '已在每条推文中注入按钮',
        feature2: '自定义背景与边距',
        feature3: '支持深色模式',
        feature4: '一键导出 PNG',
        ready: '准备就绪',
        footer: '前往 X.com 开始制作卡片。'
    },
    'zh-TW': {
        createdWith: 'Created with xCard',
        background: '背景風格',
        appearance: '外觀設定',
        light: '淺色',
        dark: '深色',
        glass: '玻璃',
        simulateLiked: '模擬按讚',
        showContext: '顯示上下文',
        exportCardOnly: '僅導出卡片',
        copySuccess: '已複製到剪貼簿！',
        copyFail: '複製失敗...',
        downloadFail: '下載失敗...',
        brandName: 'xCard 工作室',
        shareMenu: '使用 xCard 分享',
        extensionActive: '您的 X.com 擴充功能已啟用！',
        feature1: '已在每條推文中注入按鈕',
        feature2: '自定義背景與邊距',
        feature3: '支援深色模式',
        feature4: '一鍵導出 PNG',
        ready: '準備就緒',
        footer: '前往 X.com 開始製作卡片。'
    },
    'es': {
        createdWith: 'Creado con xCard',
        background: 'Fondo',
        appearance: 'Apariencia',
        light: 'Claro',
        dark: 'Oscuro',
        glass: 'Vidrio',
        simulateLiked: 'Simular Me gusta',
        showContext: 'Mostrar contexto',
        exportCardOnly: 'Exportar solo tarjeta',
        copySuccess: '¡Copiado al portapapeles!',
        copyFail: 'Error al copiar...',
        downloadFail: 'Error al descargar...',
        brandName: 'xCard Studio',
        shareMenu: 'Compartir con xCard',
        extensionActive: '¡Tu extensión de X.com está activa!',
        feature1: 'Botón inyectado en cada tweet',
        feature2: 'Fondos y márgenes personalizados',
        feature3: 'Soporte para modo oscuro',
        feature4: 'Exportación PNG con un clic',
        ready: 'Listo para usar',
        footer: 'Ve a X.com para crear tarjetas.'
    },
    'pt': {
        createdWith: 'Criado com xCard',
        background: 'Fundo',
        appearance: 'Aparência',
        light: 'Claro',
        dark: 'Escuro',
        glass: 'Vidro',
        simulateLiked: 'Simular Curtida',
        showContext: 'Mostrar contexto',
        exportCardOnly: 'Exportar apenas cartão',
        copySuccess: 'Copiado para a área de transferência!',
        copyFail: 'Falha ao copiar...',
        downloadFail: 'Falha ao baixar...',
        brandName: 'xCard Studio',
        shareMenu: 'Compartilhar com xCard',
        extensionActive: 'Sua extensão X.com está ativa!',
        feature1: 'Botão injetado em cada tweet',
        feature2: 'Fundos e margens personalizados',
        feature3: 'Suporte ao modo escuro',
        feature4: 'Exportação PNG com um clique',
        ready: 'Pronto para usar',
        footer: 'Vá para X.com para criar cartões.'
    },
    'it': {
        createdWith: 'Creato con xCard',
        background: 'Sfondo',
        appearance: 'Aspetto',
        light: 'Chiaro',
        dark: 'Scuro',
        glass: 'Vetro',
        simulateLiked: 'Simula "Mi piace"',
        showContext: 'Mostra contesto',
        exportCardOnly: 'Esporta solo scheda',
        copySuccess: 'Copiato negli appunti!',
        copyFail: 'Copia fallita...',
        downloadFail: 'Download fallito...',
        brandName: 'xCard Studio',
        shareMenu: 'Condividi con xCard',
        extensionActive: 'La tua estensione X.com è attiva!',
        feature1: 'Pulsante inserito in ogni tweet',
        feature2: 'Sfondi e margini personalizzati',
        feature3: 'Supporto modalità scura',
        feature4: 'Esportazione PNG con un clic',
        ready: 'Pronto all\'uso',
        footer: 'Vai su X.com per creare schede.'
    }
};

export const getTranslation = (key: string): string => {
    const lang = navigator.language;
    // Simple matching: check full match first, then primary subtag
    let targetLang = 'en';

    if (TRANSLATIONS[lang]) {
        targetLang = lang;
    } else {
        const primary = lang.split('-')[0];
        // Special case handling for Chinese
        if (primary === 'zh') {
            // Default generic 'zh' to CN, or check if it matches common variants
            targetLang = lang.toLowerCase().includes('tw') || lang.toLowerCase().includes('hk') ? 'zh-TW' : 'zh-CN';
        } else if (TRANSLATIONS[primary]) {
            targetLang = primary;
        }
    }

    return TRANSLATIONS[targetLang]?.[key] || TRANSLATIONS['en'][key] || key;
};

// Alias for convenience
export const t = getTranslation;
