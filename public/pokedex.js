let todosPokemons = [];

const pesquisa = document.getElementById("pesquisa");
const filtroTipo = document.getElementById("filtro-tipo");
const lista = document.getElementById("lista-pokemon");
const contador = document.getElementById("contador");

// Busca os Pokémon no JSON Server.
async function carregarPokemon() {
    try {
        const resposta = await fetch("/pokemon");

        if (!resposta.ok) {
            throw new Error("Não foi possível carregar os Pokémon.");
        }

        todosPokemons = await resposta.json();
        filtrarPokemon();
    } catch (erro) {
        contador.textContent = erro.message;
        contador.setAttribute("role", "alert");
        console.error(erro);
    }
}

// Busca os tipos e preenche o select.
async function carregarTipos() {
    try {
        const resposta = await fetch("/types");

        if (!resposta.ok) {
            throw new Error("Não foi possível carregar os tipos.");
        }

        const tipos = await resposta.json();

        for (const tipo of tipos) {
            const opcao = document.createElement("option");
            opcao.value = tipo.name;
            opcao.textContent = tipo.name;

            filtroTipo.appendChild(opcao);
        }
    } catch (erro) {
        filtroTipo.disabled = true;
        contador.textContent = erro.message;
        console.error(erro);
    }
}

// Cria os cards da lista recebida.
function mostrarPokemon(pokemons) {
    lista.innerHTML = "";

    contador.textContent =
        `${pokemons.length} de ${todosPokemons.length} Pokémon`;

    if (pokemons.length === 0) {
        const mensagem = document.createElement("p");
        mensagem.textContent = "Nenhum Pokémon encontrado.";
        lista.appendChild(mensagem);
        return;
    }

    for (const pokemon of pokemons) {
        const coluna = document.createElement("div");
        coluna.className = "col-12 col-sm-6 col-md-4 col-lg-3";

        const card = document.createElement("article");
        card.className = "card pokemon-card h-100 text-center";

        const imagem = document.createElement("img");
        imagem.src =
            `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;
        imagem.alt = pokemon.name;
        imagem.width = 120;
        imagem.height = 120;
        imagem.loading = "lazy";
        imagem.className = "pokemon-imagem mx-auto mt-3";

        const corpo = document.createElement("div");
        corpo.className = "card-body";

        const numero = document.createElement("p");
        numero.className = "pokemon-numero";
        numero.textContent =
            `#${String(pokemon.id).padStart(3, "0")}`;

        const nome = document.createElement("h2");
        nome.className = "card-title fs-5";
        nome.textContent = pokemon.name;

        const tipos = document.createElement("div");
        tipos.className = "pokemon-tipos";

        for (const tipo of pokemon.types) {
            const etiqueta = document.createElement("span");
            etiqueta.className = "badge text-bg-secondary";
            etiqueta.textContent = tipo.name;

            tipos.appendChild(etiqueta);
        }

        corpo.appendChild(numero);
        corpo.appendChild(nome);
        corpo.appendChild(tipos);

        const botaoDetalhes = document.createElement("button");
        botaoDetalhes.type = "button";
        botaoDetalhes.className = "btn botao-detalhes w-100";
        botaoDetalhes.textContent = "Ver detalhes";
        botaoDetalhes.setAttribute(
            "aria-label",
            `Ver detalhes de ${pokemon.name}`
        );

        botaoDetalhes.addEventListener("click", function () {
            abrirDetalhes(pokemon);
        });

        corpo.appendChild(botaoDetalhes);

        card.appendChild(imagem);
        card.appendChild(corpo);

        coluna.appendChild(card);
        lista.appendChild(coluna);
    }
}

// Aplica pesquisa e tipo ao mesmo tempo.
function filtrarPokemon() {
    const texto = pesquisa.value.trim().toLowerCase();
    const tipoSelecionado = filtroTipo.value;

    const filtrados = todosPokemons.filter(function (pokemon) {
        const correspondeNome =
            pokemon.name.toLowerCase().includes(texto);

        const correspondeTipo =
            tipoSelecionado === "" ||
            pokemon.types.some(function (tipo) {
                return tipo.name === tipoSelecionado;
            });

        return correspondeNome && correspondeTipo;
    });

    mostrarPokemon(filtrados);
}

// Atualiza os cards quando o usuário interage.
pesquisa.addEventListener("input", filtrarPokemon);
filtroTipo.addEventListener("change", filtrarPokemon);

const janelaDetalhes = document.getElementById("detalhes-pokemon");
const conteudoDetalhes = document.getElementById("conteudo-detalhes");
const fecharDetalhes = document.getElementById("fechar-detalhes");

const atributos = [
    { chave: "hp", nome: "HP" },
    { chave: "attack", nome: "Ataque" },
    { chave: "defense", nome: "Defesa" },
    { chave: "specialAttack", nome: "Ataque especial" },
    { chave: "specialDefense", nome: "Defesa especial" },
    { chave: "speed", nome: "Velocidade" }
];

function abrirDetalhes(pokemon) {
    conteudoDetalhes.innerHTML = "";

    const numero = document.createElement("p");
    numero.className = "ficha-numero text-center mb-1";
    numero.textContent = `#${String(pokemon.id).padStart(3, "0")}`;

    const nome = document.createElement("h2");
    nome.id = "ficha-nome";
    nome.className = "text-center";
    nome.textContent = pokemon.name;

    janelaDetalhes.setAttribute("aria-labelledby", nome.id);

    const imagem = document.createElement("img");
    imagem.className = "ficha-imagem";
    imagem.src =
        `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;
    imagem.alt = pokemon.name;
    imagem.width = 220;
    imagem.height = 220;

    const tipos = document.createElement("div");
    tipos.className = "ficha-tipos";

    for (const tipo of pokemon.types) {
        const etiqueta = document.createElement("span");
        etiqueta.className = "badge text-bg-secondary";
        etiqueta.textContent = tipo.name;

        tipos.appendChild(etiqueta);
    }

    const tituloAtributos = document.createElement("h3");
    tituloAtributos.className = "fs-5 mb-3";
    tituloAtributos.textContent = "Atributos base";

    conteudoDetalhes.appendChild(numero);
    conteudoDetalhes.appendChild(nome);
    conteudoDetalhes.appendChild(imagem);
    conteudoDetalhes.appendChild(tipos);
    conteudoDetalhes.appendChild(tituloAtributos);

    let total = 0;

    for (const atributo of atributos) {
        const valor = Number(pokemon.stats[atributo.chave] ?? 0);
        total += valor;

        const linha = document.createElement("div");
        linha.className = "atributo";

        const informacoes = document.createElement("div");
        informacoes.className = "atributo-info";

        const rotulo = document.createElement("span");
        rotulo.textContent = atributo.nome;

        const numeroAtributo = document.createElement("span");
        numeroAtributo.textContent = valor;

        const barra = document.createElement("div");
        barra.className = "atributo-barra";
        barra.setAttribute("aria-hidden", "true");

        const preenchimento = document.createElement("div");
        preenchimento.className = "atributo-preenchimento";

        const porcentagem = Math.min(100, Math.max(0, valor / 255 * 100));
        preenchimento.style.width = `${porcentagem}%`;

        informacoes.appendChild(rotulo);
        informacoes.appendChild(numeroAtributo);
        barra.appendChild(preenchimento);

        linha.appendChild(informacoes);
        linha.appendChild(barra);

        conteudoDetalhes.appendChild(linha);
    }

    const resumoTotal = document.createElement("div");
    resumoTotal.className = "ficha-total";

    const rotuloTotal = document.createElement("span");
    rotuloTotal.textContent = "Total";

    const valorTotal = document.createElement("span");
    valorTotal.textContent = total;

    resumoTotal.appendChild(rotuloTotal);
    resumoTotal.appendChild(valorTotal);
    conteudoDetalhes.appendChild(resumoTotal);

    janelaDetalhes.showModal();
    conteudoDetalhes.scrollTop = 0;
    fecharDetalhes.focus();
}

fecharDetalhes.addEventListener("click", function () {
    janelaDetalhes.close();
});

// Inicia o carregamento dos dados.
carregarPokemon();
carregarTipos();