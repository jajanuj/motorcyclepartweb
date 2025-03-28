// 產品數據
const products = {
    cylinder: [
        {
            id: 'CYL001',
            model: '1HV-11311-00',
            name: '汽缸套件',
            image: 'images/products/cylinder-1.jpg',
            stock: 1000,
            sold: 10,
            originalPrice: 2000,
            currentPrice: 1800,
            specifications: ['STD', '47MM', '48MM', '50MM']
        },
        {
            id: 'CYL002',
            model: '2GM-11311-00',
            name: '汽缸套件',
            image: 'images/products/cylinder-2.jpg',
            stock: 1000,
            sold: 2,
            originalPrice: 2200,
            currentPrice: 1900,
            specifications: ['STD', '48MM', '50MM']
        },
        {
            id: 'CYL003',
            model: '3KJ-11311-00',
            name: '汽缸套件',
            image: 'images/products/cylinder-3.jpg',
            stock: 1000,
            sold: 7,
            originalPrice: 1800,
            currentPrice: 1600,
            specifications: ['STD', '47MM', '48MM']
        }
    ],
    chain: [
        {
            id: 'CHN001',
            model: 'CH-428-120',
            name: '傳動鏈條',
            image: 'images/products/chain-1.jpg',
            stock: 500,
            sold: 15,
            originalPrice: 800,
            currentPrice: 650,
            specifications: ['428-120目']
        }
    ],
    // 其他產品類別數據...
};

// 當前選中的類別
let currentCategory = 'cylinder';
let searchTimeout = null;

// 初始化頁面
document.addEventListener('DOMContentLoaded', () => {
    // 綁定類別切換事件
    document.querySelectorAll('.product-categories a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = e.target.dataset.category;
            if (!category) return;

            // 更新當前類別
            currentCategory = category;
            window.currentCategory = category;

            // 更新活動狀態
            document.querySelectorAll('.product-categories a').forEach(a => {
                a.classList.remove('active');
            });
            e.target.classList.add('active');

            // 更新產品列表
            updateProductList(category);

            // 更新語言
            if (window.translator) {
                window.translator.handleCategoryChange(category);
            }
        });
    });

    // 綁定搜索功能
    const searchInput = document.getElementById('product-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            // 使用防抖動來優化搜索性能
            if (searchTimeout) {
                clearTimeout(searchTimeout);
            }
            searchTimeout = setTimeout(() => {
                filterProducts(e.target.value.trim());
            }, 300);
        });
    }

    // 從 URL 獲取類別
    const hash = window.location.hash.slice(1);
    if (hash && products[hash]) {
        currentCategory = hash;
        window.currentCategory = hash;
    }

    // 初始加載產品
    loadProducts(currentCategory);

    // 初始化翻譯器
    window.translator = new Translator();
});

// 加載產品
function loadProducts(category) {
    const productGrid = document.querySelector('.product-grid');
    if (!productGrid) return;

    productGrid.innerHTML = ''; // 清空現有產品

    const categoryProducts = products[category] || [];
    const lang = languages[window.translator.currentLang] || languages['zh-TW'];

    if (categoryProducts.length === 0) {
        productGrid.innerHTML = `<div class="no-products">${lang.noProducts}</div>`;
        return;
    }

    // 創建產品卡片
    categoryProducts.forEach(product => {
        const productElement = createProductElement(product);
        productGrid.appendChild(productElement);
    });

    // 更新產品類別標題
    const categoryTitle = document.querySelector('.product-header h1');
    if (categoryTitle) {
        categoryTitle.textContent = lang.categoryNames[category];
    }

    // 更新產品類別描述
    const categoryDescription = document.querySelector('.product-header p');
    if (categoryDescription && lang.categoryDescriptions && lang.categoryDescriptions[category]) {
        categoryDescription.textContent = lang.categoryDescriptions[category];
    }
}

// 創建產品元素
function createProductElement(product) {
    const lang = languages[window.translator.currentLang] || languages['zh-TW'];
    const translatedName = lang.productNames[product.name] || product.name;
    const div = document.createElement('div');
    div.className = 'product-item';
    div.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${translatedName}" onerror="this.src='images/no-image.jpg'">
        </div>
        <div class="product-info">
            <h3>${translatedName}</h3>
            <p class="model">${lang.model}：${product.model}</p>
            <p class="specs">${lang.specifications}：${product.specifications.join(', ')}</p>
            <div class="product-status">
                <span class="stock">${lang.stock}：${product.stock}</span>
                <span class="sold">${lang.sold}：${product.sold}</span>
            </div>
            <div class="product-price">
                <span class="original">${lang.originalPrice}：${lang.currency} ${product.originalPrice}</span>
                <span class="current">${lang.currentPrice}：${lang.currency} ${product.currentPrice}</span>
            </div>
            <button class="inquiry-btn" onclick="inquireProduct('${product.id}')">${lang.inquiry}</button>
        </div>
    `;
    return div;
}

// 產品搜索功能
function filterProducts(keyword) {
    const productGrid = document.querySelector('.product-grid');
    if (!productGrid) return;

    const categoryProducts = products[currentCategory] || [];
    const lang = languages[window.translator.currentLang] || languages['zh-TW'];

    if (!keyword) {
        loadProducts(currentCategory);
        return;
    }

    productGrid.innerHTML = '';
    const filteredProducts = categoryProducts.filter(product =>
        product.name.toLowerCase().includes(keyword.toLowerCase()) ||
        product.model.toLowerCase().includes(keyword.toLowerCase()) ||
        product.specifications.some(spec =>
            spec.toLowerCase().includes(keyword.toLowerCase())
        )
    );

    if (filteredProducts.length === 0) {
        productGrid.innerHTML = `<div class="no-products">${lang.noSearchResults}</div>`;
        return;
    }

    filteredProducts.forEach(product => {
        const productElement = createProductElement(product);
        productGrid.appendChild(productElement);
    });
}

// 詢價功能
function inquireProduct(productId) {
    const product = Object.values(products)
        .flat()
        .find(p => p.id === productId);

    if (!product) return;

    const lang = languages[window.translator.currentLang] || languages['zh-TW'];
    const translatedName = lang.productNames[product.name] || product.name;
    const message = `${lang.inquiryMessage}
${lang.productName}：${translatedName}
${lang.model}：${product.model}
${lang.specifications}：${product.specifications.join(', ')}

${lang.contactUs}：
${lang.phone}：0930 797 299
${lang.email}：bounerchang@gmail.com`;

    alert(message);
} 