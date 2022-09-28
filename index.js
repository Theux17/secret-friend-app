const addFriend = document.querySelector('#add-friend')
const buttonsRemoveFriend = document.querySelectorAll('#remove-friend')

const containerFriend = document.querySelector('#fields-container .container-names-emails .container-friend')
const container = document.querySelector('#fields-container .container-names-emails')
let friends = document.querySelectorAll('#fields-container .container-names-emails .container-friend')
let totalFriends = friends.length
const buttonDrawFriends = document.querySelector('#draw-friends')
buttonDrawFriends.addEventListener('click', drawFriend)

addFriend.addEventListener('click', newFriend)

const newContainer = [...container.children]
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
        alert('Ação inválida! Mínimo de 4 participantes.')
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
    const result = totalFriends % 2
    if(result !== 0) {
      return alert(`O total de amigos tem que ser par, e o total foi ${totalFriends}.`)
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
            alert('Preencha todos os campos!')
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
                    setTimeout(() => {
                        alert('Erro ao realizar sorteio.')
                    }, 1000);
                }
            })
        }
    }
}