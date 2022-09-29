const addFriend = document.querySelector('#add-friend')
const buttonsRemoveFriend = document.querySelectorAll('#remove-friend')

const containerFriend = document.querySelector('#fields-container .container-names-emails .container-friend')
const container = document.querySelector('#fields-container .container-names-emails')
let friends = document.querySelectorAll('#fields-container .container-names-emails .container-friend')
const buttonDrawFriends = document.querySelector('#draw-friends')
const errorMessage = document.querySelector('.error p');
const error = document.querySelector('.error');

let totalFriends = friends.length
buttonDrawFriends.addEventListener('click', drawFriend)

addFriend.addEventListener('click', newFriend)

const newContainer = [...container.children]

function showError (message) {
    error.style.display = 'block';
    errorMessage.innerText = message;
    setTimeout(() => {
        error.style.display = 'none';
    }, 2000);
}

function newFriend (event) {
    
    event.preventDefault()
    let newFriend = containerFriend.cloneNode(true)
    newFriend.children[0].querySelector('input').value = ""
    newFriend.children[1].querySelector('input').value = ""

    totalFriends = container.children.length + 1
    friends = container.children
    container.append(newFriend)
}

function removeFriend (element) {
    if(element.parentNode.parentNode.children.length > 4) {
        element.parentNode.remove()
    } else {
        showError('Ação inválida! Mínimo de 4 participantes.')
    }
}

const Mask = {
    apply(input, func) {

        input.value = input.value.replace(/\D/g, "")

        setTimeout(function () {
            input.value = Mask[func](input.value)
        }, 1)

    },
    formatTelephone(value) {
        value = value.replace(/\D/g, "")
        value = value.slice(0, 11)


        value = value.replace(/(\d{2})/, "($1)")
        value = value.replace(/(\d{5})(\d)/, "$1-$2")

        return value
    }

}

async function drawFriend(event) {
    event.preventDefault()

    totalFriends = friends.length
    const result = totalFriends % 2
    
    if(result !== 0) {
        showError(`O total de amigos tem que ser par, e o total foi ${totalFriends}.`)
    } else { 
        const users = []
        let error = false
        
        for (friend of friends) {
            const name = friend.querySelector(".name input").value;
            const email = friend.querySelector(".email input").value;
            
            if(!name || !email) {
                error = true
            }

            const formatFriend = {
              name,
              email,
            };
            users.push(formatFriend);
        }
        
        if(error) {
            showError('Preencha todos os campos!')
            event.stopPropagation()
        } else {
            const loader = document.querySelector('.container-loader');
            const form = document.querySelector('form');
            const success = document.querySelector('.container-success');

            form.style.opacity = 0.2;
            loader.style.display = 'flex';

            await fetch("https://secret-friends-api.herokuapp.com/users", {
            method: "POST",
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ users: users }),
            }).then((response) => {
                console.log(response)
                if(response.status === 201) {
                    loader.style.display = 'none';
                    success.style.display = 'flex';
                    
                    setTimeout(() => {
                        location.reload()
                    }, 1000);
                }

                if(response.status === 500) {
                    showError('Erro ao realizar sorteio.')
                }
            })
        }
    }
}