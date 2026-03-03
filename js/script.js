// Data
const styleModifiers = {
    isometric: "Isometric 3D vector illustration, clean lines, corporate flat design aesthetics, pristine and highly detailed, professional presentation graphic, trending on Behance, digital art, sharp focus, 8k resolution, Masterpiece",
    flat: "Modern flat design illustration, minimalistic and elegant, corporate art style, clean vector graphics, ample whitespace, UI/UX aesthetics, high quality, vector art, Dribbble style",
    photo: "Cinematic photography, photorealistic, professional corporate setting, shot on 35mm lens, f/1.8, shallow depth of field, natural soft studio lighting, ultra-detailed, 8k resolution, award-winning photography",
    clay: "3D claymation style illustration, soft and cute 3D render, smooth matte clay texture, pastel tones, cozy and friendly appearance, rendered in Blender, Octane render, global illumination, highly polished",
    lineart: "Minimalist continuous line art drawing, elegant fine lines, sophisticated corporate vector graphic, clean white background, highly conceptual, modern aesthetic"
};

const colorModifiers = {
    corporate: "Color grading: corporate blue (#2563eb) and stark white, professional and trustworthy color scheme, clean gradients, studio lighting",
    monochrome: "Color grading: monochromatic, sophisticated greyscale with deep blacks and stark whites, minimal and elegant, high contrast",
    vibrant: "Color grading: vibrant, high-contrast energetic colors, dynamic and engaging, vivid saturations, neon accents",
    warm: "Color grading: warm and optimistic tones, soft oranges, gentle yellows, inviting and positive atmosphere, golden hour lighting"
};

const templates = [
    {
        icon: "fa-arrow-trend-up",
        title: "事業成長・売上拡大",
        description: "右肩上がりのグラフや階段、成長・成功を表現するポジティブな概念図。",
        baseSubject: "A diverse business team looking up at a glowing upward arrow and bar chart, representing business growth and success, celebrating achievements, futuristic and positive vibe",
        jpSubject: "輝く上昇グラフや矢印を見上げる多様なビジネスチーム、事業成長と成功の表現",
        image: "img/template_growth.png"
    },
    {
        icon: "fa-people-group",
        title: "チームワーク・議論",
        description: "複数のメンバーが協力して課題解決に取り組む様子。ダイバーシティ。",
        baseSubject: "Diverse team members actively discussing around a modern circular table, smiling, teamwork, collaboration, modern office environment",
        jpSubject: "円卓を囲んで議論する多様なチームメンバー、協力とチームワークの表現",
        image: "img/template_teamwork.png"
    },
    {
        icon: "fa-earth-americas",
        title: "グローバル・ネットワーク",
        description: "地球儀やネットワークラインを用いた繋がり・ITインフラの概念。",
        baseSubject: "A glowing holographic Earth connected by glowing digital network lines, data flow, global connectivity, cyber infrastructure",
        jpSubject: "光るネットワークラインで繋がれたホログラムの地球儀、グローバルITインフラの概念",
        image: "img/template_global.png"
    },
    {
        icon: "fa-microchip",
        title: "テクノロジー・AI導入",
        description: "業務や社会にAI・最新技術を導入して効率化するイメージ。",
        baseSubject: "Business professional interacting with floating holographic data and glowing AI interfaces, advanced technology integration, near-futuristic",
        jpSubject: "空中に浮かぶAIインターフェースやデータに触れるビジネスパーソン、近未来的",
        image: "img/template_ai.png"
    },
    {
        icon: "fa-handshake-angle",
        title: "パートナーシップ",
        description: "企業間の提携、顧客との信頼関係、握手などの協力イメージ。",
        baseSubject: "Two business professionals exchanging a firm handshake in a bright modern office, representing trust, partnership, and sincerity",
        jpSubject: "明るいオフィスで固い握手を交わす二人のビジネスパーソン、信頼感と提携",
        image: "img/template_handshake.png"
    },
    {
        icon: "fa-lightbulb",
        title: "アイデア・ひらめき",
        description: "電球のマークや、新しいソリューションを発見した時の表現。",
        baseSubject: "A business professional with an inspired expression standing next to a giant glowing lightbulb, representing creativity, innovation, and bright ideas",
        jpSubject: "巨大な光る電球の横でひらめいた表情のビジネスパーソン、イノベーションとアイデア",
        image: "img/template_idea.png"
    }
];

// Elements
const subjectInput = document.getElementById('subject-input');
const styleSelect = document.getElementById('style-select');
const colorSelect = document.getElementById('color-select');
const arSelect = document.getElementById('ar-select');
const personSelect = document.getElementById('person-select');
const demographicSelect = document.getElementById('demographic-select');
const bgSelect = document.getElementById('bg-select');
const graphSelect = document.getElementById('graph-select');
const angleSelect = document.getElementById('angle-select');
const lightingSelect = document.getElementById('lighting-select');
const generatedPromptEl = document.getElementById('generated-prompt');
const copyBtn = document.getElementById('copy-btn');
const templateGrid = document.getElementById('template-grid');
const toastEl = document.getElementById('toast');

// Initialize
function init() {
    // Generate initial prompt
    updatePrompt();

    subjectInput.addEventListener('input', () => {
        // Clear translation when user types manually
        delete subjectInput.dataset.translated;
        updatePrompt();
    });
    styleSelect.addEventListener('change', () => {
        updatePrompt();
        updateStylePreview();
    });
    colorSelect.addEventListener('change', updatePrompt);
    arSelect.addEventListener('change', updatePrompt);
    personSelect.addEventListener('change', updatePrompt);
    demographicSelect.addEventListener('change', updatePrompt);
    bgSelect.addEventListener('change', updatePrompt);
    graphSelect.addEventListener('change', updatePrompt);
    angleSelect.addEventListener('change', updatePrompt);
    lightingSelect.addEventListener('change', updatePrompt);

    const mcCopyBtn = document.getElementById('copy-btn');
    if (mcCopyBtn) {
        mcCopyBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const textToCopy = document.getElementById('generated-prompt').value;
            copyToClipboard(textToCopy);
        });
    }

    const aiBtn = document.getElementById('ai-expand-btn');
    if (aiBtn) {
        aiBtn.addEventListener('click', expandWithAI);
    }

    // Modal logic
    const settingsBtn = document.getElementById('settings-btn');
    const settingsModal = document.getElementById('settings-modal');
    const closeBtn = document.getElementById('close-modal-btn');
    const saveBtn = document.getElementById('save-key-btn');
    const apiInput = document.getElementById('api-key-input');

    if (settingsBtn && settingsModal) {
        settingsBtn.addEventListener('click', () => {
            const savedKey = localStorage.getItem('gemini_api_key');
            if (savedKey) apiInput.value = savedKey;
            settingsModal.style.display = 'flex';
        });

        closeBtn.addEventListener('click', () => {
            settingsModal.style.display = 'none';
        });

        saveBtn.addEventListener('click', () => {
            const key = apiInput.value.trim();
            if (key) {
                localStorage.setItem('gemini_api_key', key);
                showToast('APIキーを保存しました！');
            } else {
                localStorage.removeItem('gemini_api_key');
                showToast('APIキーを削除しました。');
            }
            settingsModal.style.display = 'none';
        });

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === settingsModal) {
                settingsModal.style.display = 'none';
            }
        });
    }

    // Render templates
    renderTemplates();

    // Initialize preview
    updateStylePreview();
}

function updateStylePreview() {
    const stylePreviewImg = document.getElementById('style-preview-img');
    const stylePreviewDesc = document.getElementById('style-preview-desc');
    if (!stylePreviewImg || !stylePreviewDesc) return;

    const previews = {
        'none': {
            img: 'img/maestro_mascot.png',
            desc: '指定なし（プロンプトの内容や、画像生成AIの解釈に依存し自由にお任せします）'
        },
        'flat': {
            img: 'img/style_flat.png',
            desc: '「モダンフラットデザイン」は、シンプルで洗練された資料・スライド向けのイラストです。'
        },
        'isometric': {
            img: 'img/style_isometric.png',
            desc: '「アイソメトリック」は、空間を斜め上から俯瞰した立体的でポップなイラストです。'
        },
        'photo': {
            img: 'img/style_photo.png',
            desc: '「高品質なビジネス写真」は、実写の人間やオフィス風景をリアルに美しく描写します。'
        },
        'clay': {
            img: 'img/style_clay.png',
            desc: '「3Dクレイ」は、粘土細工のような丸みと温かみのある3Dアイコン風の仕上がりです。'
        },
        'lineart': {
            img: 'img/style_lineart.png',
            desc: '「洗練された線画」は、色数を抑えたミニマルでおしゃれな手書き風の線画アートです。'
        }
    };

    const selectedStyle = styleSelect.value || 'flat';
    const previewData = previews[selectedStyle] || previews['flat'];

    // Add a simple fade animation effect
    stylePreviewImg.style.opacity = '0';
    setTimeout(() => {
        stylePreviewImg.src = previewData.img;
        stylePreviewDesc.textContent = previewData.desc;
        stylePreviewImg.style.opacity = '1';
    }, 200);
}

async function expandWithAI() {
    const rawVal = subjectInput.value.trim();
    if (!rawVal) {
        showToast('メインテーマを入力してください');
        return;
    }

    const aiBtn = document.getElementById('ai-expand-btn');
    const originalContent = aiBtn.innerHTML;

    aiBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 生成中...';
    aiBtn.disabled = true;

    try {
        const apiKey = localStorage.getItem('gemini_api_key');

        // --- 1. Attempt High-Quality Expansion via Gemini API (if key exists) ---
        if (apiKey) {
            const promptText = `
You are an expert AI image generation prompt engineer. 
Take the following user input and perform two actions:
1. Translate and expand it into a highly detailed, professional, cinematic, and descriptive English prompt for an image generator. Add relevant details for lighting, mood, framing, and texture.
2. Translate that resulting expanded English prompt back into natural Japanese so the user understands what will be generated.

Respond strictly with a valid JSON object with EXACTLY two keys: "english" and "japanese". Do not include any markdown backticks or other text.

User Input: ${rawVal}
`;

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: promptText }] }],
                    generationConfig: {
                        temperature: 0.7,
                        responseMimeType: "application/json"
                    }
                })
            });

            if (!response.ok) {
                if (response.status === 400 || response.status === 403) {
                    showToast('APIキーが無効です。簡易版（Google翻訳）を実行します。');
                }
                throw new Error(`Gemini API Error: ${response.status}`);
            }

            const data = await response.json();
            const textResult = data.candidates[0].content.parts[0].text;

            let parsed;
            try {
                parsed = JSON.parse(textResult);
            } catch (err) {
                const cleaned = textResult.replace(/^```json/g, '').replace(/```$/g, '').trim();
                parsed = JSON.parse(cleaned);
            }

            if (parsed.english && parsed.japanese) {
                subjectInput.dataset.translated = parsed.english;
                subjectInput.value = parsed.japanese;
                updatePrompt();
                showToast('Gemini APIによるプロンプトの超・詳細化が完了しました！');
                return; // Exit here on success
            }
        }

        // --- 2. FALLBACK: Simple Expansion via Google Translate (if no key or Gemini fails) ---
        const resEN = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=ja&tl=en&dt=t&q=${encodeURIComponent(rawVal)}`);
        const dataEN = await resEN.json();
        let englishText = dataEN[0].map(item => item[0]).join('');

        if (englishText.length < 3 && rawVal.length > 5) {
            throw new Error("Translation failed to generate meaningful English.");
        }

        const expandedEnglish = `${englishText}, highly detailed visualization, professional and compelling scene, cinematic storytelling, sharp focus`;
        subjectInput.dataset.translated = expandedEnglish;

        const resJA = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ja&dt=t&q=${encodeURIComponent(expandedEnglish)}`);
        const dataJA = await resJA.json();
        let formattedJapanese = dataJA[0].map(item => item[0]).join('');

        subjectInput.value = formattedJapanese;
        updatePrompt();

        if (apiKey) {
            showToast('通信エラーのため自動翻訳機能で代用しました');
        } else {
            showToast('自動翻訳機能による英語化が完了しました。');
            // If they don't have a key, suggest the upgrade modal once
            setTimeout(() => {
                const settingsModal = document.getElementById('settings-modal');
                if (settingsModal && !localStorage.getItem('gemini_api_key_prompted')) {
                    settingsModal.style.display = 'flex';
                    localStorage.setItem('gemini_api_key_prompted', 'true');
                }
            }, 1500);
        }

    } catch (e) {
        console.error("Expand Error:", e);
        // Deep fallback if both Gemini and Translate fail or network is down
        subjectInput.dataset.translated = `[Generate highly detailed prompt based on]: ${rawVal}`;
        updatePrompt();
        showToast('エラー。プロンプト側に直接指示を埋め込みました。');
    } finally {
        aiBtn.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i> AI詳細化';
        aiBtn.disabled = false;
    }
}

function updatePrompt() {
    const originalSubject = subjectInput.value.trim() || 'business professionals working';
    // Use translated subject if it exists and input wasn't changed
    const subject = subjectInput.dataset.translated || originalSubject;

    const styleVal = document.getElementById('style-select').value;
    const personVal = document.getElementById('person-select').value;
    const demoVal = document.getElementById('demographic-select').value;
    const bgVal = document.getElementById('bg-select').value;
    const graphVal = document.getElementById('graph-select').value;
    const angleVal = document.getElementById('angle-select').value;
    const lightingVal = document.getElementById('lighting-select').value;
    const colorVal = document.getElementById('color-select').value;
    const arVal = document.getElementById('ar-select').value;

    let finalPrompt = `Please generate an image based exactly on the following criteria. Adhere strictly to these parameters:\n\n`;

    finalPrompt += `**1. Core Subject & Topic**\n`;
    finalPrompt += `- Subject: ${subject}\n`;
    if (personVal !== 'none') finalPrompt += `- Character Depiction: ${personVal}\n`;
    if (demoVal !== 'none') finalPrompt += `- Demographics: ${demoVal}\n`;

    finalPrompt += `\n**2. Environment & Composition**\n`;
    if (bgVal !== 'none') finalPrompt += `- Setting: ${bgVal}\n`;
    if (graphVal !== 'none') finalPrompt += `- Graphic Elements/Props: ${graphVal}\n`;
    if (angleVal !== 'none') finalPrompt += `- Camera Angle: ${angleVal}\n`;
    if (lightingVal !== 'none') finalPrompt += `- Lighting: ${lightingVal}\n`;

    finalPrompt += `\n**3. Art Style & Rendering**\n`;
    if (styleVal !== 'none') finalPrompt += `- Base Artistic Style: ${styleModifiers[styleVal] || styleVal}\n`;
    if (colorVal !== 'none') finalPrompt += `- Color Palette: ${colorModifiers[colorVal] || colorVal}\n`;
    if (arVal !== 'none') finalPrompt += `- Aspect Ratio Requirement: ${arVal}\n`;

    finalPrompt += `- Render Quality: Masterpiece, ultra-detailed, highly meticulous composition, pristine edges.\n`;

    generatedPromptEl.value = finalPrompt;
}

function renderTemplates() {
    templateGrid.innerHTML = '';

    templates.forEach(t => {
        const card = document.createElement('div');
        card.className = 'template-card';
        card.innerHTML = `
            <div class="template-image-container">
                <img src="${t.image}" alt="${t.title}" class="template-image">
                <div class="card-icon"><i class="fa-solid ${t.icon}"></i></div>
            </div>
            <div class="template-card-content">
                <h3>${t.title}</h3>
                <p>${t.description}</p>
                <div class="card-footer">
                    <span style="font-size:0.8rem; color:#64748b;">テンプレ反映</span>
                    <button class="btn-copy-small"><i class="fa-regular fa-copy"></i> クイックコピー</button>
                </div>
            </div>
        `;

        // Card click behavior: Sync to form
        card.addEventListener('click', (e) => {
            // Check if clicking inside the button to avoid double triggering
            if (e.target.closest('.btn-copy-small')) return;

            // Apply template subject to top generator
            subjectInput.value = t.jpSubject;
            subjectInput.dataset.translated = t.baseSubject;

            // Set some default best practices for templates
            document.getElementById('style-select').value = 'flat';
            document.getElementById('color-select').value = 'corporate';

            // Generate full string with current select values
            updatePrompt();

            // Scroll to top and flash UI for feedback
            window.scrollTo({ top: 0, behavior: 'smooth' });

            const formSections = document.querySelectorAll('.form-section');
            formSections.forEach(section => {
                section.classList.remove('highlight-flash');
                void section.offsetWidth; // trigger reflow
                section.classList.add('highlight-flash');
            });

            // Highlight text output
            generatedPromptEl.style.transition = 'background-color 0.3s';
            generatedPromptEl.style.backgroundColor = '#e0e7ff';
            setTimeout(() => {
                generatedPromptEl.style.backgroundColor = 'transparent';
            }, 500);

            // Show toast
            showToast('ジェネレーターに反映しました');
        });

        // Quick copy specific behavior
        const copyBtnSmall = card.querySelector('.btn-copy-small');
        copyBtnSmall.addEventListener('click', (e) => {
            e.stopPropagation(); // prevent card click

            const style = styleModifiers['flat'];
            const color = colorModifiers['corporate'];
            const ar = '16:9 wide layout with negative space on edges for text';
            const person = 'detailed facial expressions, clear eyes, professional attire';
            const demographic = 'diverse global team with various ethnicities and genders';
            const graph = 'floating holographic sharply rising upward bar graph';
            const bg = 'modern bright corporate office, lots of natural light, glass walls';
            const angle = 'eye-level medium shot, rule of thirds composition';
            const lighting = 'soft diffuse studio lighting, highly professional';

            const fixedPrompt = `Optimized Image Generation Prompt:\n\nA highly detailed and professional visualization of: ${t.baseSubject}.\n\n[Scene & Subjects]\nThe scene features: ${person}.\nDemographic profile: ${demographic}.\nSetting environment: ${bg}.\nKey visual elements/props: ${graph}.\n\n[Composition & Camera]\nCamera framing: ${angle}.\nLighting technique: ${lighting}.\n\n[Style & Output Requirements]\nArtistic style: ${style}.\nColor scheme: ${color}.\nRender details: masterpiece quality, ultra-detailed, highly meticulous composition, pristine edges, unblemished background elements, 8K resolution.\nAspect ratio: ${ar}.`;

            copyToClipboard(fixedPrompt);
        });

        templateGrid.appendChild(card);
    });
}

function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showToast('クリップボードにコピーしました！');
        }).catch(err => {
            console.error('Failed to copy: ', err);
            fallbackCopyTextToClipboard(text);
        });
    } else {
        fallbackCopyTextToClipboard(text);
    }
}

function fallbackCopyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        var successful = document.execCommand('copy');
        if (successful) {
            showToast('クリップボードにコピーしました！');
        } else {
            showToast('コピーに失敗しました');
        }
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
}

function showToast(message) {
    const toastMascot = toastEl.querySelector('.toast-mascot');
    const toastMsg = document.getElementById('toast-message');

    // Only show mascot icon for success messages
    if (toastMascot && toastMsg) {
        if (message.includes('コピー') || message.includes('完了') || message.includes('反映')) {
            toastMascot.style.display = 'inline-block';
        } else {
            toastMascot.style.display = 'none';
        }
        toastMsg.textContent = message;
    } else {
        toastEl.textContent = message; // Fallback
    }

    toastEl.classList.add('show');

    // Trigger full celebration animation on copy success
    if (message.includes('コピー') || message.includes('完了')) {
        triggerCelebration();
    }

    setTimeout(() => {
        toastEl.classList.remove('show');
    }, 3000);
}

function triggerCelebration() {
    const mascot = document.getElementById('celebration-mascot');
    if (!mascot) return;

    // Reset any ongoing animation
    mascot.style.transition = 'none';
    mascot.style.bottom = '-200px';
    mascot.style.opacity = '0';

    // Force reflow
    void mascot.offsetWidth;

    // Animate up
    mascot.style.transition = 'all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
    mascot.style.bottom = '2rem';
    mascot.style.opacity = '1';

    // Animate down after 2.5 seconds
    setTimeout(() => {
        mascot.style.bottom = '-200px';
        mascot.style.opacity = '0';
    }, 2500);
}

// Run
document.addEventListener('DOMContentLoaded', init);
