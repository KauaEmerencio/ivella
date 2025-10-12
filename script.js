// Dados dos produtos
const produtos = [
    {
        id: 1,
        nome: "Conjunto Aurora",
        referencia: "36 a 48",
        material: "",
        preco: 137.22,
        cores: ["Universal"],
        descricao: "Vestido clássico em microfibra, confortável e elegante.",
        categoria: "Feminino",
        imagem: "assets/vestido.jpeg"
    },
    {
        id: 2,
        nome: "Luna",
        referencia: "36 a 48",
        material: "",
        preco: 117.22,
        cores: ["Universal"],
        descricao: "Vestido longo perfeito para ocasiões especiais.",
        categoria: "Feminino",
        imagem: "assets/vestido2.jpeg"
    },
    {
        id: 3,
        nome: "Conjunto Maya",
        referencia: "36 a 48",
        material: "",
        preco: 117.22,
        cores: ["Universal"],
        descricao: "Vestido casual para o dia a dia.",
        categoria: "Feminino",
        imagem: "assets/vestidoazul.jpeg"
    },
    {
        id: 4,
        nome: "Vestido",
        referencia: "342",
        material: "CREPE",
        preco: 137.22,
        cores: ["Universal"],
        descricao: "Vestido elegante para festas e eventos.",
        categoria: "Feminino",
        imagem: "assets/vestido4.jpeg"
    },
];


// Carrinho de compras
let carrinho = JSON.parse(localStorage.getItem('ivella_carrinho')) || [];

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

function initApp() {
    atualizarContadorCarrinho();
    configurarMenuMobile();
    carregarConteudoPorPagina();
    configurarEventListeners();
}

function configurarMenuMobile() {
   const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
}

function carregarConteudoPorPagina() {
    const path = window.location.pathname;
    const page = path.split("/").pop();
    
    if (page === 'produtos.html') {
        carregarTodosProdutos();
    } else if (page === 'carrinho.html') {
        carregarPaginaCarrinho();
    }
}

function configurarEventListeners() {
    // Fechar modal
    const closeModal = document.querySelector('.close-modal');
    if (closeModal) {
        closeModal.addEventListener('click', fecharModalWhatsApp);
    }
    
    // Fechar modal ao clicar fora
    const modal = document.getElementById('whatsapp-modal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                fecharModalWhatsApp();
            }
        });
    }

    // Configurar select de entrega
    const deliveryOption = document.getElementById('delivery-option');
    if (deliveryOption) {
        deliveryOption.addEventListener('change', function() {
            const outraCidadeGroup = document.getElementById('outra-cidade-group');
            const enderecoGroup = document.getElementById('endereco-group');
            
            if (this.value === 'outra-cidade') {
                outraCidadeGroup.style.display = 'block';
                enderecoGroup.style.display = 'none';
            } else if (this.value === 'Entrega em domicílio - Canindé') {
                enderecoGroup.style.display = 'block';
                outraCidadeGroup.style.display = 'none';
            } else {
                enderecoGroup.style.display = 'none';
                outraCidadeGroup.style.display = 'none';
            }
        });
    }

    // Configurar select de pagamento para mostrar campo de troco
    const paymentMethod = document.getElementById('payment-method');
    if (paymentMethod) {
        paymentMethod.addEventListener('change', function() {
            const trocoGroup = document.getElementById('troco-group');
            if (this.value === 'Dinheiro') {
                trocoGroup.style.display = 'block';
            } else {
                trocoGroup.style.display = 'none';
            }
        });
    }

    // Cancelar checkout
    const cancelCheckout = document.getElementById('cancel-checkout');
    if (cancelCheckout) {
        cancelCheckout.addEventListener('click', fecharModalWhatsApp);
    }
    
    // Formulário de checkout
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', finalizarPedidoWhatsApp);
    }
    
    // Botão de finalizar pedido
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', abrirModalWhatsApp);
    }
}

// Atualizar contador do carrinho
function atualizarContadorCarrinho() {
    const cartCounts = document.querySelectorAll('#cart-count, .cart-count');
    const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0);
    
    cartCounts.forEach(count => {
        count.textContent = totalItens;
        count.style.display = totalItens > 0 ? 'inline-block' : 'none';
    });
}

// Salvar carrinho no localStorage
function salvarCarrinho() {
    localStorage.setItem('ivella_carrinho', JSON.stringify(carrinho));
    atualizarContadorCarrinho();
}

// Criar card de produto
function criarCardProduto(produto) {
    const produtoCard = document.createElement('div');
    produtoCard.className = 'product-card';
    produtoCard.innerHTML = `
        <div class="product-image">
            <img src="${produto.imagem}" alt="${produto.nome}" 
                 onerror="this.src='https://via.placeholder.com/300x300/8B5FBF/FFFFFF?text=Produto+Ivella'">
        </div>
        <div class="product-info">
            <h3 class="product-name">${produto.nome}</h3>
            <div class="product-price">R$ ${produto.preco.toFixed(2)}</div>
            <p class="product-description">${produto.descricao}</p>
            <div class="product-details">
                <strong>Ref:</strong> ${produto.referencia} | 
                <strong>Material:</strong> ${produto.material}<br>
                <strong>Cores:</strong> ${produto.cores.join(', ')}
            </div>
            <button class="add-to-cart" data-id="${produto.id}">
                Adicionar ao Carrinho
            </button>
        </div>
    `;
    
    return produtoCard;
}

// Carregar todos os produtos
function carregarTodosProdutos() {
    const allProducts = document.getElementById('all-products');
    if (!allProducts) return;
    
    allProducts.innerHTML = '';
    produtos.forEach(produto => {
        const produtoCard = criarCardProduto(produto);
        allProducts.appendChild(produtoCard);
    });
    
    configurarBotoesCarrinho();
}

// Configurar botões de adicionar ao carrinho
function configurarBotoesCarrinho() {
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const produtoId = parseInt(this.getAttribute('data-id'));
            adicionarAoCarrinho(produtoId, this);
        });
    });
}

// Adicionar produto ao carrinho com feedback visual
function adicionarAoCarrinho(produtoId, button) {
    const produto = produtos.find(p => p.id === produtoId);
    
    if (produto) {
        const itemExistente = carrinho.find(item => item.id === produtoId);
        
        if (itemExistente) {
            itemExistente.quantidade += 1;
        } else {
            carrinho.push({
                ...produto,
                quantidade: 1,
                corSelecionada: produto.cores[0]
            });
        }
        
        salvarCarrinho();
        mostrarFeedbackAdicao(button);
    }
}

// Mostrar feedback visual ao adicionar produto
function mostrarFeedbackAdicao(button) {
    const originalText = button.textContent;
    
    button.textContent = '✓ Adicionado!';
    button.classList.add('added');
    button.disabled = true;
    
    setTimeout(() => {
        button.textContent = originalText;
        button.classList.remove('added');
        button.disabled = false;
    }, 2000);
}

// Carregar página do carrinho
function carregarPaginaCarrinho() {
    const cartItems = document.getElementById('cart-items');
    const cartEmpty = document.getElementById('cart-empty');
    const cartSummary = document.getElementById('cart-summary');
    
    if (!cartItems) return;
    
    if (carrinho.length === 0) {
        cartItems.innerHTML = '';
        cartEmpty.style.display = 'block';
        cartSummary.style.display = 'none';
        return;
    }
    
    cartEmpty.style.display = 'none';
    cartSummary.style.display = 'block';
    
    let total = 0;
    let totalItens = 0;
    cartItems.innerHTML = '';
    
    carrinho.forEach(item => {
        const itemTotal = item.preco * item.quantidade;
        total += itemTotal;
        totalItens += item.quantidade;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.imagem}" alt="${item.nome}" 
                     onerror="this.src='https://via.placeholder.com/100x100/8B5FBF/FFFFFF?text=IV'">
            </div>
            <div class="cart-item-info">
                <h4>${item.nome}</h4>
                <p class="cart-item-details">
                    <strong>Ref:</strong> ${item.referencia} | 
                    <strong>Material:</strong> ${item.material}
                </p>
                <div class="cart-item-controls">
                    <button class="quantity-btn minus" data-id="${item.id}">-</button>
                    <span class="quantity-display">${item.quantidade}</span>
                    <button class="quantity-btn plus" data-id="${item.id}">+</button>
                </div>
                <div class="cart-item-price">
                    R$ ${item.preco.toFixed(2)} cada
                </div>
            </div>
            <div class="cart-item-actions">
                <div class="cart-item-total">
                    Total: R$ ${itemTotal.toFixed(2)}
                </div>
                <button class="remove-item" data-id="${item.id}">Remover</button>
            </div>
        `;
        
        cartItems.appendChild(cartItem);
    });
    
    // Atualizar resumo
    document.getElementById('subtotal').textContent = `R$ ${total.toFixed(2)}`;
    document.getElementById('total-items').textContent = totalItens;
    document.getElementById('total-price').textContent = `R$ ${total.toFixed(2)}`;
    
    // Configurar eventos dos botões de quantidade
    configurarBotoesQuantidade();
}

// Configurar botões de quantidade (+/-)
function configurarBotoesQuantidade() {
    document.querySelectorAll('.quantity-btn.plus').forEach(button => {
        button.addEventListener('click', function() {
            const produtoId = parseInt(this.getAttribute('data-id'));
            alterarQuantidade(produtoId, 1);
        });
    });
    
    document.querySelectorAll('.quantity-btn.minus').forEach(button => {
        button.addEventListener('click', function() {
            const produtoId = parseInt(this.getAttribute('data-id'));
            alterarQuantidade(produtoId, -1);
        });
    });
    
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function() {
            const produtoId = parseInt(this.getAttribute('data-id'));
            removerDoCarrinho(produtoId);
        });
    });
}
// Alterar quantidade do produto
function alterarQuantidade(produtoId, mudanca) {
    const item = carrinho.find(item => item.id === produtoId);
    
    if (item) {
        // Verifica se está tentando aumentar além do limite
        if (mudanca > 0 && item.quantidade >= 3) {
            alert("Limite máximo de 3 ´p");
            return; // Sai da função sem fazer alterações
        }
        
        item.quantidade += mudanca;
        
        if (item.quantidade <= 0) {
            removerDoCarrinho(produtoId);
        } else {
            salvarCarrinho();
            carregarPaginaCarrinho();
        }
    }
}

// Remover item do carrinho
function removerDoCarrinho(produtoId) {
    carrinho = carrinho.filter(item => item.id !== produtoId);
    salvarCarrinho();
    carregarPaginaCarrinho();
}

// Abrir modal do WhatsApp
function abrirModalWhatsApp() {
    const modal = document.getElementById('whatsapp-modal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

// Fechar modal do WhatsApp
function fecharModalWhatsApp() {
    const modal = document.getElementById('whatsapp-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Finalizar pedido via WhatsApp
function finalizarPedidoWhatsApp(e) {
    e.preventDefault();
    
    if (carrinho.length === 0) {
        alert('Adicione produtos ao carrinho antes de finalizar o pedido!');
        return;
    }
    
    const nome = document.getElementById('customer-name').value.trim();
    const localSelect = document.getElementById('delivery-option').value;
    const cidadePersonalizada = document.getElementById('cidade-personalizada').value.trim();
    const endereco = document.getElementById('endereco').value.trim();
    const pagamento = document.getElementById('payment-method').value;
    const valorTroco = document.getElementById('valor-troco').value.trim();
    const observacoes = document.getElementById('observations').value.trim();
    
    // Validar campos
    if (!nome || !localSelect || !pagamento) {
        alert('Por favor, preencha todos os campos obrigatórios!');
        return;
    }
    
    // Validar endereço se for entrega
    let localFinal = localSelect;
    if (localSelect === 'Entrega em endereço - Canindé') {
        if (!endereco) {
            alert('Por favor, digite seu endereço para entrega!');
            return;
        }
        localFinal = `Entrega em - ${endereco}`;
    }
    
    // Validar cidade personalizada
    if (localSelect === 'Outra cidade') {
        if (!cidadePersonalizada) {
            alert('Por favor, digite o nome da sua cidade!');
            return;
        }
        localFinal = `Entrega - ${cidadePersonalizada}`;
    }
    
    // Validar troco se pagamento for em dinheiro
    if (pagamento === 'Dinheiro' && !valorTroco) {
        alert('Favor, informe se precisa de troco! Se não precisar, digite "Não preciso de troco"');
        return;
    }
    
    const mensagem = gerarMensagemWhatsApp(nome, localFinal, pagamento, valorTroco, observacoes);
    const numeroWhatsApp = "5579981111957";
    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
    
    window.open(urlWhatsApp, '_blank');
    fecharModalWhatsApp();
}

// Gerar mensagem para WhatsApp
function gerarMensagemWhatsApp(nome, local, pagamento, valorTroco, observacoes) {
    const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0);
    const totalProdutos = carrinho.reduce((total, item) => total + (item.preco * item.quantidade), 0);
    
    let mensagem = `🛍️ *PEDIDO - IVELLA* 🛍️\n\n`;
    mensagem += `*Cliente:* ${nome}\n`;
    mensagem += `*Local/Endereço:* ${local}\n`;
    mensagem += `*Forma de Pagamento:* ${pagamento}\n`;
    
    if (pagamento === 'Dinheiro' && valorTroco) {
        mensagem += `*Troco para:* ${valorTroco}\n`;
    }
    
    mensagem += `\n${'═'.repeat(50)}\n\n`;
    mensagem += `*ITENS DO PEDIDO:*\n\n`;
    
    carrinho.forEach((item, index) => {
        const subtotal = item.preco * item.quantidade;
        mensagem += `*${index + 1}. ${item.nome}*\n`;
        mensagem += `   📍 Ref: ${item.referencia}\n`;
        mensagem += `   🎨 Cor: ${item.corSelecionada}\n`;
        mensagem += `   🔢 Quantidade: ${item.quantidade}\n`;
        mensagem += `   💰 Preço unitário: R$ ${item.preco.toFixed(2)}\n`;
        mensagem += `   💵 Subtotal: R$ ${subtotal.toFixed(2)}\n\n`;
    });
    
    mensagem += `${'═'.repeat(50)}\n\n`;
    mensagem += `📦 *Total de Itens:* ${totalItens}\n`;
    mensagem += `💰 *Valor Total:* R$ ${totalProdutos.toFixed(2)}\n\n`;
    
    if (observacoes) {
        mensagem += `📝 *Observações:* ${observacoes}\n\n`;
    }
    
    mensagem += `⏰ *Pedido realizado em:* ${new Date().toLocaleString('pt-BR')}\n`;
    mensagem += `\n_Aguardo a confirmação! Obrigada! 💜_`;
    
    return mensagem;
}
