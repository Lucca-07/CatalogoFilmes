const protocol = "http://";
const baseURL = "localhost:3000";

async function obtemFilmes() {
    const filmesEndpoint = "/filmes";
    const URLcompleta = `${protocol}${baseURL}${filmesEndpoint}`;
    const filmes = (await axios.get(URLcompleta)).data;

    exibirTabela(".filmes", filmes);
}

async function cadastrarFilme() {
    const filmesEndpoint = "/filmes";
    const URLcompleta = `${protocol}${baseURL}${filmesEndpoint}`;
    let tituloInput = document.querySelector("#tituloinput");
    let sinopseInput = document.querySelector("#sinopseinput");
    let titulo = tituloInput.value;
    let sinopse = sinopseInput.value;
    if (titulo && sinopse) {
        tituloInput.value = "";
        sinopseInput.value = "";
        const dados = {
            titulo,
            sinopse,
        };
        const filmes = (await axios.post(URLcompleta, dados)).data;
        exibirTabela(".filmes", filmes);
        exibirAlerta(
            ".alert-filme",
            "Filme cadastrado com sucesso!",
            ["show", "alert-success"],
            ["d-none"],
            1500
        );
    } else {
        exibirAlerta(
            ".alert-filme",
            "Preencha todos os campos!",
            ["show", "alert-danger"],
            ["d-none"],
            1500
        );
    }
}

async function cadastrarUsuario() {
    let usuarioCadastroInput = document.getElementById("userCadastroInput");
    let senhaCadastroInput = document.getElementById("passCadastroInput");
    let usuarioCadastro = usuarioCadastroInput.value;
    let senhaCadastro = senhaCadastroInput.value;
    if (usuarioCadastro && senhaCadastro) {
        try {
            const usuarioEndpoint = "/auth/signup";
            const URLcompleta = `${protocol}${baseURL}${usuarioEndpoint}`;
            const dados = {
                login: usuarioCadastro,
                password: senhaCadastro,
            };
            await axios.post(URLcompleta, dados);
            usuarioCadastroInput.value = "";
            senhaCadastroInput.value = "";
            exibirAlerta(
                ".alert-cadastro",
                "Usuário cadastrado com sucesso!",
                ["show", "alert-sucess"],
                ["d-none"],
                2000
            );
            esconderModal("#modalCadastro", 2000);
        } catch (error) {
            console.error(error);
            exibirAlerta(
                ".alert",
                "Usuário já existente!",
                ["show", "alert-danger"],
                ["d-none"],
                2000
            );
            esconderModal("#modalCadastro", 2000);
        }
    } else {
        exibirAlerta(
            ".alert",
            "Preencha todos os campos!",
            ["show", "alert-danger"],
            ["d-none"],
            2000
        );
    }
}

async function logarUsuario() {
    let usuarioLoginInput = document.getElementById("userLoginInput");
    let senhaLoginInput = document.getElementById("passLoginInput");
    let usuarioLogin = usuarioLoginInput.value;
    let senhaLogin = senhaLoginInput.value;
    if (usuarioLogin && senhaLogin) {
        try {
            const usuarioEndpoint = "/auth/login";
            const URLcompleta = `${protocol}${baseURL}${usuarioEndpoint}`;
            const dados = {
                login: usuarioLogin,
                password: senhaLogin,
            };
            const response = (await axios.post(URLcompleta, dados)).data;
            localStorage.setItem("token", response.token);
            usuarioLoginInput.value = "";
            senhaLoginInput.value = "";
            exibirAlerta(
                ".alert-login",
                "Login realizado!",
                ["show", "alert-success"],
                ["d-none"],
                2000
            );
            esconderModal("#modalLogin", 2000);
            usuarioLoginInput.value = "";
            senhaLoginInput.value = "";
            atualizaEstadoLogin();
        } catch (error) {
            console.error(error);
            exibirAlerta(
                ".alert",
                "Usuário ou senha inválidos",
                ["show", "alert-danger"],
                ["d-none"],
                2000
            );
            esconderModal("#modalLogin", 2000);
            usuarioLoginInput.value = "";
            senhaLoginInput.value = "";
        }
    } else {
        exibirAlerta(
            ".alert",
            "Preencha todos os campos!",
            ["show", "alert-danger"],
            ["d-none"],
            2000
        );
    }
}

function deslogarUsuario() {
    localStorage.removeItem("token");
    atualizaEstadoLogin();
}

function loginOuLogout() {
    const textoLink = document.getElementById("anchorLogin");
    if (textoLink.innerHTML === "Login") {
        const modal = new bootstrap.Modal("#modalLogin");
        modal.show();
    } else {
        deslogarUsuario();
    }
}

function exibirAlerta(seletor, texto, classesAdd, classesRemove, timer) {
    let alert = document.querySelector(seletor);
    alert.innerHTML = texto;
    alert.classList.add(...classesAdd);
    alert.classList.remove(...classesRemove);
    setTimeout(() => {
        alert.classList.remove(...classesAdd);
        alert.classList.add(...classesRemove);
    }, timer);
}

function esconderModal(seletor, timer) {
    setTimeout(() => {
        let modal = bootstrap.Modal.getInstance(
            document.querySelector(seletor)
        );
        modal.hide();
    }, timer);
}

function exibirTabela(seletor, itens) {
    let tabela = document.querySelector(seletor);
    let corpo = tabela.getElementsByTagName("tbody")[0];
    corpo.innerHTML = "";
    itens.forEach((item) => {
        let linhaNova = corpo.insertRow(0);
        let celulaTitulo = linhaNova.insertCell(0);
        let celulaSinopse = linhaNova.insertCell(1);
        celulaTitulo.innerHTML = item.titulo;
        celulaSinopse.innerHTML = item.sinopse;
    });
}

function atualizaEstadoLogin() {
    const token = localStorage.getItem("token");
    const btnCadastrarFilme = document.getElementById("btn-cadastrar-filme");
    const anchorLogin = document.getElementById("anchorLogin");
    if (token) {
        anchorLogin.innerHTML = "Logout";
        btnCadastrarFilme.disabled = false;
    } else {
        anchorLogin.innerHTML = "Login";
        btnCadastrarFilme.disabled = true;
    }
}
