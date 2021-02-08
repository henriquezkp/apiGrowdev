import apiGrowdev from './apiGrowdev';

class App {
    constructor() {
        //DOM botões
        document.getElementById("btnLogin").onclick = () => this.loginClick();
        document.getElementById("btnCadastrar").onclick = () => this.cadastrarUser();
        document.getElementById("btnCadastrarGrowdever").onclick = () => this.incluirGrowdever();
        document.getElementById("LoginCadastro").onclick = () => this.page();
        document.getElementById("btnListarGrowdevers").onclick = () => {
            this.listaGrowdevers.style.display = "block";
            this.addGrowdever.style.display = "none";
        };
        document.getElementById("btnListarUsers").onclick = () => {
            this.listaUsers.style.display = "block";
            this.listaGrowdevers.style.display = "none";
            this.listarUsers(this.token);
        };
        document.getElementById("btnSair").onclick = () => {
            this.token = "";
            this.userId = "";
            this.listaDeGrowdevers = [];
            this.divLogin.style.display = "block";
            this.divAplicacao.style.display = "none";
            this.divCadastro.style.display = "none";
        };



        //DOM divs
        this.listaGrowdevers = document.getElementById("listaGrowdevers");
        this.listaUsers = document.getElementById("listaUsers");
        this.addGrowdever = document.getElementById("addGrowdever");
        this.growdeverProgram = document.getElementById("growdeverProgram");
        this.growdeverPhone = document.getElementById("growdeverPhone");
        this.growdeverEmail = document.getElementById("growdeverEmail");
        this.growdeverBtn = document.getElementById("growdeverBtn");
        this.divLogin = document.getElementById("divLogin");
        this.divCadastro = document.getElementById("divCadastro");
        this.divLoading = document.getElementById("divLoading");
        this.divAplicacao = document.getElementById("divAplicacao");
        this.divListaG = document.getElementById("divListaG");
        this.divListaU = document.getElementById("divListaU");
        this.editGrowdever = document.getElementById("editGrowdever");
        this.token = "";
        this.userId = "";
        this.listaDeGrowdevers = [];
        this.listaDeUsers = [];


    }

    loginClick() {

        //manipula SPA
        this.divLogin.style.display = "none";
        this.divCadastro.style.display = "none";
        this.divAplicacao.style.display = "none";
        this.divLoading.style.display = "block";

        const username = document.getElementById("emailLogin").value;
        const password = document.getElementById("senhaLogin").value;

        apiGrowdev.post('/login', {
            "username": username,
            "password": password
        })
            .then(r => {
                const { success, token } = r.data;

                if (success) {
                    this.token = token;
                    this.userId = r.data.user.uid;
                    this.listarGrowdevers(this.token);

                }


            })
            .catch(e => alert(e.response.data.message));
    }

    cadastrarUser() {

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

    excluirUser(event) {

        let uid = event.path[0].dataset.excluir;

        apiGrowdev.deleteAutenticado(`/users/${uid}`, this.token)
            .then(r => {
                this.listarUsers(this.token);
                alert("Growdever excluído com sucesso!");
            })
            .catch(e => {
                alert(e.response.data.message);
            })

    }

    listarUsers(token) {
        //manipula SPA
        this.divLoading.style.display = "block";
        this.editGrowdever.style.display = "none";
        this.divLogin.style.display = "none";
        this.divCadastro.style.display = "none";
        this.addGrowdever.style.display = "none";


        apiGrowdev.getAutenticado('/users', token)
            .then(r => {
                console.log(r);
                let html = "";
                r.data.users.forEach(element => {
                    this.listaDeUsers.push(element);
                    html += `
                    <tr>
                        <td scope="row">
                            <button type="button" class="btn btn-secondary page-edit" data-edit="${element.uid}">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-tools" viewBox="0 0 16 16">
                                <path d="M1 0L0 1l2.2 3.081a1 1 0 0 0 .815.419h.07a1 1 0 0 1 .708.293l2.675 2.675-2.617 2.654A3.003 3.003 0 0 0 0 13a3 3 0 1 0 5.878-.851l2.654-2.617.968.968-.305.914a1 1 0 0 0 .242 1.023l3.356 3.356a1 1 0 0 0 1.414 0l1.586-1.586a1 1 0 0 0 0-1.414l-3.356-3.356a1 1 0 0 0-1.023-.242L10.5 9.5l-.96-.96 2.68-2.643A3.005 3.005 0 0 0 16 3c0-.269-.035-.53-.102-.777l-2.14 2.141L12 4l-.364-1.757L13.777.102a3 3 0 0 0-3.675 3.68L7.462 6.46 4.793 3.793a1 1 0 0 1-.293-.707v-.071a1 1 0 0 0-.419-.814L1 0zm9.646 10.646a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708zM3 11l.471.242.529.026.287.445.445.287.026.529L5 13l-.242.471-.026.529-.445.287-.287.445-.529.026L3 15l-.471-.242L2 14.732l-.287-.445L1.268 14l-.026-.529L1 13l.242-.471.026-.529.445-.287.287-.445.529-.026L3 11z"/>
                                
                            </button>
                            <button type="button" class="btn btn-secondary page-excluir" data-excluir="${element.uid}">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                                    <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                                
                            </button>
                        </td>
                        <td>${element.name}</td>
                        <td>${element.type}</td>
                        <td>${element.username}</td>
                    </tr>
                             `;
                });

                this.divListaU.innerHTML = html;
                //manipula SPA
                this.divLoading.style.display = "none";
                this.divAplicacao.style.display = "block";
                this.listaUsers.style.display = "block";

                document.querySelectorAll('.page-edit').forEach((el) => {
                    el.onclick = (event) => this.editarUser(event);
                });
                document.querySelectorAll('.page-excluir').forEach((el) => {
                    el.onclick = (event) => this.excluirUser(event);
                });
            })
            .catch(e => {

            })
    }

    excluirUser(event) {

        let uid = event.path[0].dataset.excluir;

        apiGrowdev.deleteAutenticado(`/growdevers/${uid}`, this.token)
            .then(r => {
                this.listarGrowdevers(this.token);
                alert("User excluído com sucesso!");
            })
            .catch(e => {
                alert(e.response.data.message);
            })

    }

    editarUser(event) {

        let uid = event.path[0].dataset.edit;

        this.divLoading.style.display = "none";
        this.listaUsers.style.display = "none";
        this.editUsers.style.display = "block";


        this.listaDeGrowdevers.forEach(gd => {

            if (gd.uid === uid) {

                console.log("certo");


                document.getElementById("editEmail").value = gd.email;
                document.getElementById("editPhone").value = gd.phone;
                document.getElementById("editProgram").value = gd.program;


                document.getElementById("confirmaEditBtn").onclick = () => {
                    let email = document.getElementById("editEmail").value;
                    let phone = document.getElementById("editPhone").value;
                    let program = document.getElementById("editProgram").value;

                    apiGrowdev.putAutenticado(`/growdevers/${uid}`, {
                        "email": email,
                        "phone": phone,
                        "program": program
                    }, this.token)
                        .then(r => {
                            console.log("ok")
                            this.listarGrowdevers(this.token);
                            alert("Growdever editado com sucesso!");
                            this.editGrowdever.style.display = "none"
                        })
                        .catch(e => {
                            alert(e.response.data.message);
                        })
                }
            }
        });


    }

    page() {
        document.getElementById("divLogin").style.display = "none";
        document.getElementById("divCadastro").style.display = "block";

    }

    listarGrowdevers(token) {
        //manipula SPA
        this.divLoading.style.display = "block";
        this.editGrowdever.style.display = "none";
        this.divLogin.style.display = "none";
        this.divCadastro.style.display = "none";
        this.addGrowdever.style.display = "none";


        apiGrowdev.getAutenticado('/growdevers', token)
            .then(r => {
                let html = "";
                r.data.growdevers.forEach(element => {
                    this.listaDeGrowdevers.push(element);
                    html += `
                            <tr>
                                <td scope="row">
                                    <button type="button" class="btn btn-secondary page-edit" data-edit="${element.uid}">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-tools" viewBox="0 0 16 16">
                                        <path d="M1 0L0 1l2.2 3.081a1 1 0 0 0 .815.419h.07a1 1 0 0 1 .708.293l2.675 2.675-2.617 2.654A3.003 3.003 0 0 0 0 13a3 3 0 1 0 5.878-.851l2.654-2.617.968.968-.305.914a1 1 0 0 0 .242 1.023l3.356 3.356a1 1 0 0 0 1.414 0l1.586-1.586a1 1 0 0 0 0-1.414l-3.356-3.356a1 1 0 0 0-1.023-.242L10.5 9.5l-.96-.96 2.68-2.643A3.005 3.005 0 0 0 16 3c0-.269-.035-.53-.102-.777l-2.14 2.141L12 4l-.364-1.757L13.777.102a3 3 0 0 0-3.675 3.68L7.462 6.46 4.793 3.793a1 1 0 0 1-.293-.707v-.071a1 1 0 0 0-.419-.814L1 0zm9.646 10.646a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708zM3 11l.471.242.529.026.287.445.445.287.026.529L5 13l-.242.471-.026.529-.445.287-.287.445-.529.026L3 15l-.471-.242L2 14.732l-.287-.445L1.268 14l-.026-.529L1 13l.242-.471.026-.529.445-.287.287-.445.529-.026L3 11z"/>
                                        
                                    </button>
                                    <button type="button" class="btn btn-secondary page-excluir" data-excluir="${element.uid}">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                                            <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                                        
                                    </button>
                                </td>
                                <td>${element.email}</td>
                                <td>${element.phone}</td>
                                <td>${element.program}</td>
                            </tr>
                        `;
                });

                this.divListaG.innerHTML = html;
                //manipula SPA
                this.divLoading.style.display = "none";
                this.divAplicacao.style.display = "block";
                this.listaGrowdevers.style.display = "block";

                document.querySelectorAll('.page-edit').forEach((el) => {
                    el.onclick = (event) => this.editarGrowdever(event);
                });
                document.querySelectorAll('.page-excluir').forEach((el) => {
                    el.onclick = (event) => this.excluirGrowdever(event);
                });
            })
            .catch(e => {

            })


    }

    incluirGrowdever() {
        //deixa os campos vazios
        this.growdeverEmail.value = "";
        this.growdeverPhone.value = "";
        this.growdeverProgram.value = "";

        //manipula SPA
        this.listaGrowdevers.style.display = "none";
        this.addGrowdever.style.display = "block";

        this.growdeverBtn.onclick = () => {

            let email = this.growdeverEmail.value;
            let phone = this.growdeverPhone.value;
            let program = this.growdeverProgram.value;

            apiGrowdev.postAutenticado('/growdevers', {
                "email": email,
                "phone": phone,
                "program": program,
                "user_uid": this.userId
            }, this.token)
                .then(r => {
                    alert("Growdever cadastrado com sucesso");
                    //manipula SPA
                    this.addGrowdever.style.display = "none";
                    this.divAplicacao.style.display = "block";
                    this.listaGrowdevers.style.display = "block";
                    this.listarGrowdevers(this.token);

                })
                .catch(e => console.log("n ok", e));
        }
    }

    excluirGrowdever(event) {

        let uid = event.path[0].dataset.excluir;

        apiGrowdev.deleteAutenticado(`/growdevers/${uid}`, this.token)
            .then(r => {
                this.listarGrowdevers(this.token);
                alert("Growdever excluído com sucesso!");
            })
            .catch(e => {
                alert(e.response.data.message);
            })

    }

    editarGrowdever(event) {

        let uid = event.path[0].dataset.edit;

        this.divLoading.style.display = "none";
        this.listaGrowdevers.style.display = "none";
        this.editGrowdever.style.display = "block";


        this.listaDeGrowdevers.forEach(gd => {

            if (gd.uid === uid) {

                console.log("certo");


                document.getElementById("editEmail").value = gd.email;
                document.getElementById("editPhone").value = gd.phone;
                document.getElementById("editProgram").value = gd.program;


                document.getElementById("confirmaEditBtn").onclick = () => {
                    let email = document.getElementById("editEmail").value;
                    let phone = document.getElementById("editPhone").value;
                    let program = document.getElementById("editProgram").value;

                    apiGrowdev.putAutenticado(`/growdevers/${uid}`, {
                        "email": email,
                        "phone": phone,
                        "program": program
                    }, this.token)
                        .then(r => {
                            console.log("ok")
                            this.listarGrowdevers(this.token);
                            alert("Growdever editado com sucesso!");
                            this.editGrowdever.style.display = "none"
                        })
                        .catch(e => {
                            alert(e.response.data.message);
                        })
                }
            }
        });


    }
}

new App();