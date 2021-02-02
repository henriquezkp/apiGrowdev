import apiGrowdev from './apiGrowdev';

class App {
    constructor() {
        document.getElementById("btnLogin").onclick = () => this.loginClick();
        document.getElementById("btnCadastrar").onclick = () => this.cadastrarClick();
        document.getElementById("LoginCadastro").onclick = () => this.page();
        //this.pegarClick();
        this.divLogin = document.getElementById("divLogin");
        this.divCadastro = document.getElementById("divCadastro");
        this.divLoading = document.getElementById("divLoading");
        this.divAplicacao = document.getElementById("divAplicacao");
        this.divLista = document.getElementById("divLista");

        this.token = "";
        this.userId = "";

    }

    loginClick() {

        this.divLogin.style.display = "none";
        this.divCadastro.style.display = "none";
        this.divLoading.style.display = "block";

        const username = document.getElementById("emailLogin").value;
        const password = document.getElementById("senhaLogin").value;

        apiGrowdev.post('/login', {
            "username": username,
            "password": password
        })
            .then(r => {

                const { success, token, uid } = r.data;


                if (success) {
                    console.log(token);
                    this.token = token;
                    this.userId = uid;
                    this.aplicacao(this.token);

                }


            })
            .catch(e => alert(e.response.data.message));
    }

    cadastrarClick() {

        //document.getElementById("btnLogin").onclick = () =>{

        const name = document.getElementById("inputName").value;
        const password = document.getElementById("inputPassword").value;
        const type = document.getElementById("typeSelect").value;
        const username = document.getElementById("username").value;

        console.log(name, password, type, username);

        apiGrowdev.post('/users', {
            "name": name,
            "password": password,
            "type": type,
            "username": username
        })
            .then(r => {
                alert("Usuário cadastrado com sucesso");
                this.divCadastro.style.display = "none";
                this.divLoading.style.display = "none";
                this.divAplicacao.style.display = "none";
                this.divLogin.style.display = "block";
            })
            .catch(e => console.log("n ok", e));
    }

    page() {
        document.getElementById("divLogin").style.display = "none";
        document.getElementById("divCadastro").style.display = "block";

    }

    aplicacao(token) {

        apiGrowdev.getAutenticado('/growdevers', token)
            .then(r => {
                let html = "";
                r.data.growdevers.forEach(element => {
                    //alert(element.email);
                    html += `
                            <tr>
                                <td scope="row">${element.user.username}</td>
                                <td>${element.user.name}</td>
                                <td>${element.email}</td>
                                <td>${element.user.type}</td>
                            </tr>
                        `;
                });
                this.divLista.innerHTML = html;
                this.divLoading.style.display = "none";
                this.divAplicacao.style.display = "block";
            })
            .catch(e => {

            })


    }



}

new App();