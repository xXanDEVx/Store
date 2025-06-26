const divItems = document.getElementById('itemsStore')
const productArea = document.getElementById('productArea')
const price = document.getElementById('priceTotal')

let listItems = []
let index = 0

const states = {
    items: [],
    get getTotal() {
        return this.items.reduce((acc, cur) => acc + cur.preco, 0)
    },
    get formatedTotal() {
        const total = this.getTotal
        return formatPrice(total)
    }
}

function formatPrice(price) {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price)
};


function createItem(name, price, category, img, index) {
    const div = document.createElement('div')
    const divButton = document.createElement("div")
    const h2 = document.createElement('h2')
    const imageProduct = document.createElement('img')
    const categoryName = document.createElement('p')
    const priceName = document.createElement('p')
    const buttonBuy = document.createElement('button')
    price = formatPrice(price)

    div.classList = "col-4"
    divButton.classList = "area-buy"
    h2.innerText = name
    h2.classList = "product-name"
    imageProduct.src = img
    imageProduct.classList = `image-product`
    categoryName.innerText = category
    categoryName.classList = "product-category"
    priceName.innerText = price
    priceName.classList = "price-color"
    buttonBuy.innerText = "COMPRAR"
    buttonBuy.dataset.handler = 'addItem';
    buttonBuy.dataset.itemRef = index;


    divItems.appendChild(div)
    div.appendChild(imageProduct)
    div.appendChild(h2)
    div.appendChild(categoryName)
    div.appendChild(divButton)
    divButton.appendChild(priceName)
    divButton.appendChild(buttonBuy)
};




function renderCardList(list) {
    const fragment = document.createDocumentFragment()

    function createDomItem(item, index) {
        const div = document.createElement('div')
        const divProduct = document.createElement('div')
        const p1 = document.createElement('p')
        const h2 = document.createElement('h2')
        const buttonDelet = document.createElement('button')
        const i = document.createElement('i')

        p1.innerText = item.categoria
        p1.classList = "product-category"
        h2.innerText = item.nome
        h2.classList = "product-name"
        i.classList = "fa-solid fa-trash remove-icon"

        divProduct.classList = 'list-product'
        div.classList = 'product'

        buttonDelet.dataset.handler = 'removeItem'
        buttonDelet.dataset.itemRef = index

        divProduct.appendChild(p1)
        divProduct.appendChild(h2)
        buttonDelet.appendChild(i)
        div.appendChild(divProduct)
        div.appendChild(buttonDelet)

        return div
    }

    let index = 0
    for (const item of list) {
        const div = createDomItem(item, index)
        fragment.appendChild(div)
        index++
    }

    productArea.replaceChildren()
    productArea.append(fragment)
}



async function loadAll() {
    try {
        const response = await fetch('./assets/dataBase.json')
        const data = await response.json()
        listItems = data;
    } catch (e) {
        console.log(e)
    }

    function loadItems() {
        const items = listItems
        for (let i = 0; i < items.length; i++) {
            createItem(items[i].nome, items[i].preco, items[i].categoria, items[i].imagem, i)
        }
    }
    loadItems()
};

function addItem(index) {
    const item = listItems[index]
    states.items.push(item)
    renderCardList(states.items)
    price.innerText = states.formatedTotal
}

function removeItem(index) {
    states.items.splice(index, 1)
    price.innerText = states.formatedTotal
    renderCardList(states.items)
}

function onStart() {
    loadAll()
}

divItems.addEventListener('click', e => {
    if (e.target.dataset?.handler === "addItem") {
        addItem(e.target.dataset.itemRef)
    };
})

productArea.addEventListener('click', e => {
    if (e.target.closest('[data-handler="removeItem"]') && e.target?.dataset?.itemRef) {
        const index = Number(e.target.dataset.itemRef)
        removeItem(index)
    }
})

document.addEventListener('DOMContentLoaded', onStart())
