// Dados dos produtos
const produtos = [
    {
        id: 1,
        nome: "Body Clássico",
        referencia: "418",
        material: "MICROFIBRA",
        preco: 80.00,
        cores: ["Bege", "Branco", "Preto", "Rosa Pink"],
        descricao: "Body clássico em microfibra, confortável e elegante.",
        categoria: "Feminino",
        imagem: "assets/produtos/vestido.jpeg"
    },
    {
        id: 2,
        nome: "Vestido Longo Elegante",
        referencia: "215",
        material: "VISCOSTE",
        preco: 120.00,
        cores: ["Preto", "Vermelho", "Azul Marinho"],
        descricao: "Vestido longo perfeito para ocasiões especiais.",
        categoria: "Feminino",
        imagem: "assets/produtos/vestido2.jpeg"
    },
    {
        id: 3,
        nome: "Vestido Casual",
        referencia: "156",
        material: "ALGODÃO",
        preco: 89.90,
        cores: ["Azul Claro", "Azul Escuro", "Preto"],
        descricao: "Vestido casual para o dia a dia.",
        categoria: "Feminino",
        imagem: "assets/produtos/vestidoazul.jpeg"
    },
    {
        id: 4,
        nome: "Vestido Festa",
        referencia: "342",
        material: "CREPE",
        preco: 150.00,
        cores: ["Preto", "Vermelho", "Dourado"],
        descricao: "Vestido elegante para festas e eventos.",
        categoria: "Feminino",
        imagem: "assets/produtos/vestido4.jpeg"
    }
];

// Carrinho de compras
let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

// Função para verificar em qual página estamos
function getCurrentPage() {
    const path = window.location.pathname;
    const page = path.split("/").pop();
    return page || 'index.html';
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = getCurrentPage();
    
    // Configurações comuns para todas as páginas
    atualizarContadorCarrinho();
    configurarMenuMobile();
    
    // Configurações específicas por página
    switch(currentPage) {
        case 'index.html':
            carregarProdutosDestaque();
            break;
        case 'produtos.html':
            carregarTodosProdutos();
            break;
        case 'carrinho.html':
            carregarPaginaCarrinho();
            break;
        case 'finalizarpedido.html':
            carregarFormularioPedido();
            break;
    }
});

// Configurar menu mobile
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

// Atualizar contador do carrinho
function atualizarContadorCarrinho() {
    const carrinhoCount = document.getElementById('carrinho-count');
    if (carrinhoCount) {
        const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0);
        carrinhoCount.textContent = totalItens;
    }
}

// Salvar carrinho no localStorage
function salvarCarrinho() {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    atualizarContadorCarrinho();
}

// Criar card de produto
function criarCardProduto(produto) {
    const produtoCard = document.createElement('div');
    produtoCard.className = 'produto-card';
    produtoCard.innerHTML = `
        <div class="produto-img">
            <img src="${produto.imagem}" alt="${produto.nome}" onerror="this.src='https://via.placeholder.com/300x300?text=Imagem+Não+Encontrada'">
        </div>
        <div class="produto-info">
            <h3>${produto.nome}</h3>
            <div class="produto-preco">R$ ${produto.preco.toFixed(2)}</div>
            <p class="produto-descricao">${produto.descricao}</p>
            <p class="produto-detalhes">
                <strong>Ref:</strong> ${produto.referencia} | 
                <strong>Material:</strong> ${produto.material}<br>
                <strong>Cores:</strong> ${produto.cores.join(', ')}
            </p>
            <button class="adicionar-carrinho btn" data-id="${produto.id}">
                Adicionar ao Carrinho
            </button>
        </div>
    `;
    
    return produtoCard;
}

// Carregar produtos em destaque (página inicial)
function carregarProdutosDestaque() {
    const produtosDestaque = document.getElementById('produtos-destaque');
    if (!produtosDestaque) return;
    
    const destaque = produtos.slice(0, 4);
    produtosDestaque.innerHTML = '';
    
    destaque.forEach(produto => {
        const produtoCard = criarCardProduto(produto);
        produtosDestaque.appendChild(produtoCard);
    });
    
    configurarBotoesCarrinho();
}

// Carregar todos os produtos
function carregarTodosProdutos() {
    const produtosGrid = document.getElementById('produtos-grid');
    if (!produtosGrid) return;
    
    produtosGrid.innerHTML = '';
    produtos.forEach(produto => {
        const produtoCard = criarCardProduto(produto);
        produtosGrid.appendChild(produtoCard);
    });
    
    configurarBotoesCarrinho();
}

// Configurar botões de adicionar ao carrinho
function configurarBotoesCarrinho() {
    document.querySelectorAll('.adicionar-carrinho').forEach(button => {
        button.addEventListener('click', function() {
            const produtoId = parseInt(this.getAttribute('data-id'));
            adicionarAoCarrinho(produtoId);
        });
    });
}

// Adicionar produto ao carrinho
function adicionarAoCarrinho(produtoId) {
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
        mostrarFeedbackAdicao(produtoId);
        
        // Se estiver na página do carrinho, atualizar
        if (getCurrentPage() === 'carrinho.html') {
            carregarPaginaCarrinho();
        }
    }
}

// Mostrar feedback visual ao adicionar produto
function mostrarFeedbackAdicao(produtoId) {
    const button = document.querySelector(`[data-id="${produtoId}"]`);
    if (button) {
        const originalText = button.textContent;
        const originalBg = button.style.backgroundColor;
        
        button.textContent = '✓ Adicionado!';
        button.style.backgroundColor = '#27ae60';
        button.disabled = true;
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.backgroundColor = originalBg;
            button.disabled = false;
        }, 1500);
    }
}

// Remover item do carrinho
function removerDoCarrinho(produtoId) {
    carrinho = carrinho.filter(item => item.id !== produtoId);
    salvarCarrinho();
    
    const currentPage = getCurrentPage();
    if (currentPage === 'carrinho.html') {
        carregarPaginaCarrinho();
    } else if (currentPage === 'finalizarpedido.html') {
        carregarFormularioPedido();
    }
}

// Carregar página do carrinho
function carregarPaginaCarrinho() {
    const carrinhoItens = document.getElementById('carrinho-itens');
    const carrinhoTotal = document.getElementById('carrinho-total');
    const finalizarBtn = document.getElementById('finalizar-pedido-btn');
    
    if (!carrinhoItens) return;
    
    if (carrinho.length === 0) {
        carrinhoItens.innerHTML = `
            <div class="carrinho-vazio">
                <h3>Seu carrinho está vazio</h3>
                <p>Adicione alguns produtos para continuar.</p>
                <a href="produtos.html" class="btn">Ver Produtos</a>
            </div>
        `;
        if (carrinhoTotal) carrinhoTotal.textContent = '0.00';
        if (finalizarBtn) finalizarBtn.style.display = 'none';
        return;
    }
    
    let total = 0;
    carrinhoItens.innerHTML = '';
    
    carrinho.forEach(item => {
        const itemTotal = item.preco * item.quantidade;
        total += itemTotal;
        
        const carrinhoItem = document.createElement('div');
        carrinhoItem.className = 'carrinho-item';
        carrinhoItem.innerHTML = `
            <div class="carrinho-item-info">
                <h4>${item.nome}</h4>
                <p>Ref: ${item.referencia} | Quantidade: ${item.quantidade}</p>
                <p>Cor: ${item.corSelecionada} | Material: ${item.material}</p>
                <p class="carrinho-item-preco">R$ ${itemTotal.toFixed(2)}</p>
            </div>
            <button class="remover-item" data-id="${item.id}">Remover</button>
        `;
        
        carrinhoItens.appendChild(carrinhoItem);
    });
    
    if (carrinhoTotal) carrinhoTotal.textContent = total.toFixed(2);
    if (finalizarBtn) finalizarBtn.style.display = 'inline-block';
    
    // Event listeners para remover itens
    document.querySelectorAll('.remover-item').forEach(button => {
        button.addEventListener('click', function() {
            const produtoId = parseInt(this.getAttribute('data-id'));
            removerDoCarrinho(produtoId);
        });
    });
}

// Carregar formulário de pedido
function carregarFormularioPedido() {
    atualizarListaProdutosFormulario();
    configurarFormularioPedido();
}

// Atualizar lista de produtos no formulário
function atualizarListaProdutosFormulario() {
    const listaProdutosFormulario = document.getElementById('lista-produtos-formulario');
    if (!listaProdutosFormulario) return;
    
    listaProdutosFormulario.innerHTML = '';
    
    if (carrinho.length === 0) {
        listaProdutosFormulario.innerHTML = `
            <div class="carrinho-vazio">
                <h3>Nenhum produto no carrinho</h3>
                <p>Adicione produtos ao carrinho antes de finalizar o pedido.</p>
                <a href="produtos.html" class="btn">Ver Produtos</a>
            </div>
        `;
        const gerarBtn = document.getElementById('gerar-mensagem');
        if (gerarBtn) gerarBtn.style.display = 'none';
        return;
    }
    
    carrinho.forEach(item => {
        const produtoItem = document.createElement('div');
        produtoItem.className = 'produto-form-item';
        produtoItem.innerHTML = `
            <div class="produto-form-info">
                <h4>${item.nome} (ref ${item.referencia})</h4>
                <div class="produto-form-detalhes">
                    <div>Preço unitário: R$ ${item.preco.toFixed(2)}</div>
                    <div>
                        <label for="cor-${item.id}">Cor:</label>
                        <select id="cor-${item.id}" class="cor-select" data-id="${item.id}">
                            ${item.cores.map(cor => 
                                `<option value="${cor}" ${item.corSelecionada === cor ? 'selected' : ''}>${cor}</option>`
                            ).join('')}
                        </select>
                    </div>
                </div>
            </div>
            <div class="produto-form-quantidade">
                <input type="number" 
                       class="quantidade-input" 
                       value="${item.quantidade}" 
                       min="1" 
                       data-id="${item.id}">
                <button type="button" class="remover-produto-form" data-id="${item.id}">Remover</button>
            </div>
        `;
        
        listaProdutosFormulario.appendChild(produtoItem);
    });
    
    // Event listeners
    document.querySelectorAll('.quantidade-input').forEach(input => {
        input.addEventListener('change', function() {
            const produtoId = parseInt(this.getAttribute('data-id'));
            const novaQuantidade = parseInt(this.value);
            if (novaQuantidade > 0) {
                atualizarQuantidadeProduto(produtoId, novaQuantidade);
            }
        });
    });
    
    document.querySelectorAll('.cor-select').forEach(select => {
        select.addEventListener('change', function() {
            const produtoId = parseInt(this.getAttribute('data-id'));
            const novaCor = this.value;
            atualizarCorProduto(produtoId, novaCor);
        });
    });
    
    document.querySelectorAll('.remover-produto-form').forEach(button => {
        button.addEventListener('click', function() {
            const produtoId = parseInt(this.getAttribute('data-id'));
            removerDoCarrinho(produtoId);
        });
    });
    
    atualizarResumoPedido();
    
    const gerarBtn = document.getElementById('gerar-mensagem');
    if (gerarBtn) gerarBtn.style.display = 'block';
}

// Atualizar quantidade do produto
function atualizarQuantidadeProduto(produtoId, quantidade) {
    const item = carrinho.find(item => item.id === produtoId);
    if (item) {
        item.quantidade = quantidade;
        salvarCarrinho();
        atualizarResumoPedido();
    }
}

// Atualizar cor do produto
function atualizarCorProduto(produtoId, cor) {
    const item = carrinho.find(item => item.id === produtoId);
    if (item) {
        item.corSelecionada = cor;
        salvarCarrinho();
    }
}

// Atualizar resumo do pedido
function atualizarResumoPedido() {
    const totalProdutos = carrinho.reduce((total, item) => total + (item.preco * item.quantidade), 0);
    
    const resumoTotalProdutos = document.getElementById('resumo-total-produtos');
    const resumoTotal = document.getElementById('resumo-total');
    
    if (resumoTotalProdutos) resumoTotalProdutos.textContent = `R$ ${totalProdutos.toFixed(2)}`;
    if (resumoTotal) resumoTotal.textContent = `R$ ${totalProdutos.toFixed(2)}`;
}

// Configurar formulário de pedido
function configurarFormularioPedido() {
    const gerarMensagemBtn = document.getElementById('gerar-mensagem');
    const copiarMensagemBtn = document.getElementById('copiar-mensagem');
    const abrirWhatsappBtn = document.getElementById('abrir-whatsapp');
    const closeWhatsappModal = document.querySelector('.close-whatsapp');
    
    if (gerarMensagemBtn) {
        gerarMensagemBtn.addEventListener('click', gerarMensagemWhatsApp);
    }
    
    if (copiarMensagemBtn) {
        copiarMensagemBtn.addEventListener('click', copiarMensagem);
    }
    
    if (abrirWhatsappBtn) {
        abrirWhatsappBtn.addEventListener('click', abrirWhatsApp);
    }
    
    if (closeWhatsappModal) {
        closeWhatsappModal.addEventListener('click', fecharWhatsappModal);
    }
    
    // Fechar modal ao clicar fora
    window.addEventListener('click', function(event) {
        const whatsappModal = document.getElementById('whatsapp-modal');
        if (event.target === whatsappModal) {
            fecharWhatsappModal();
        }
    });
}

// Gerar mensagem para WhatsApp
function gerarMensagemWhatsApp() {
    if (carrinho.length === 0) {
        alert('Adicione produtos ao carrinho antes de gerar a mensagem!');
        return;
    }
    
    const nomeCliente = document.getElementById('nome-cliente');
    const telefoneCliente = document.getElementById('telefone-cliente');
    
    if (!nomeCliente || !nomeCliente.value.trim()) {
        alert('Por favor, digite seu nome!');
        nomeCliente.focus();
        return;
    }
    
    const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0);
    const totalProdutos = carrinho.reduce((total, item) => total + (item.preco * item.quantidade), 0);
    
    let mensagem = `🛍️ *PEDIDO - MODA ROXA* 🛍️\n\n`;
    mensagem += `*Cliente:* ${nomeCliente.value.trim()}\n`;
    if (telefoneCliente && telefoneCliente.value.trim()) {
        mensagem += `*Telefone:* ${telefoneCliente.value.trim()}\n`;
    }
    mensagem += `\n${'═'.repeat(40)}\n\n`;
    mensagem += `*ITENS DO PEDIDO:*\n\n`;
    
    carrinho.forEach((item, index) => {
        const subtotal = item.preco * item.quantidade;
        mensagem += `${index + 1}. ${item.quantidade}x ${item.nome}\n`;
        mensagem += `   📍 Ref: ${item.referencia}\n`;
        mensagem += `   🎨 Cor: ${item.corSelecionada}\n`;
        mensagem += `   🧵 Material: ${item.material}\n`;
        mensagem += `   💰 R$ ${subtotal.toFixed(2)}\n\n`;
    });
    
    mensagem += `${'═'.repeat(40)}\n\n`;
    mensagem += `📦 *Total de Itens:* ${totalItens}\n`;
    mensagem += `💰 *Valor Total:* R$ ${totalProdutos.toFixed(2)}\n\n`;
    mensagem += `⏰ *Pedido gerado em:* ${new Date().toLocaleString('pt-BR')}\n`;
    mensagem += `\n_Obrigada pela preferência! 💜_`;
    
    const mensagemWhatsapp = document.getElementById('mensagem-whatsapp');
    if (mensagemWhatsapp) {
        mensagemWhatsapp.value = mensagem;
    }
    
    const whatsappModal = document.getElementById('whatsapp-modal');
    if (whatsappModal) {
        whatsappModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

// Copiar mensagem
function copiarMensagem() {
    const mensagemWhatsapp = document.getElementById('mensagem-whatsapp');
    if (mensagemWhatsapp) {
        mensagemWhatsapp.select();
        mensagemWhatsapp.setSelectionRange(0, 99999);
        
        navigator.clipboard.writeText(mensagemWhatsapp.value).then(() => {
            const copiarMensagemBtn = document.getElementById('copiar-mensagem');
            const originalText = copiarMensagemBtn.textContent;
            copiarMensagemBtn.textContent = '✓ Copiado!';
            copiarMensagemBtn.style.backgroundColor = '#27ae60';
            
            setTimeout(() => {
                copiarMensagemBtn.textContent = originalText;
                copiarMensagemBtn.style.backgroundColor = '';
            }, 2000);
        });
    }
}

// Abrir WhatsApp
function abrirWhatsApp() {
    const mensagemWhatsapp = document.getElementById('mensagem-whatsapp');
    if (mensagemWhatsapp) {
        const mensagemCodificada = encodeURIComponent(mensagemWhatsapp.value);
        const numeroWhatsApp = "5511999999999"; // SUBSTITUA PELO NÚMERO REAL
        const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensagemCodificada}`;
        
        window.open(urlWhatsApp, '_blank');
        fecharWhatsappModal();
        
        // Opcional: limpar carrinho após envio
        // carrinho = [];
        // salvarCarrinho();
        // setTimeout(() => {
        //     window.location.href = 'index.html';
        // }, 1000);
    }
}

// Fechar modal WhatsApp
function fecharWhatsappModal() {
    const whatsappModal = document.getElementById('whatsapp-modal');
    if (whatsappModal) {
        whatsappModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}




// Adicionar contador de carrinho no header (adicione isso no seu HTML)
function adicionarContadorCarrinhoHeader() {
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu) {
        const carrinhoItem = navMenu.querySelector('a[href="carrinho.html"]');
        if (carrinhoItem) {
            carrinhoItem.innerHTML = `Carrinho <span id="carrinho-count" class="carrinho-count">0</span>`;
        }
    }
}






// Chamar esta função na inicialização
adicionarContadorCarrinhoHeader();