//Google Auth
function GooglesignIn() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
        .then(function (result) {
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = result.credential.accessToken;
            // The signed-in user info.
            var user = result.user;
            // ...
            var userProfile = { email: '', name: '', photoURL: '' };
            userProfile.email = user.email;
            userProfile.name = user.displayName;
            userProfile.photoURL = user.photoURL;
            LoadMessage();


            var db = firebase.database().ref('users');
            var flag = false;
            db.on('value', function (users) {
                users.forEach(function (data) {
                    var user = data.val();
                    if (user.email === userProfile.email) {
                        flag = true;
                    }
                });
                if (flag === false) {
                    firebase.database().ref('users').push(userProfile, (error) => {
                        if (error) {
                            alert(error);
                        }

                        else {
                            document.getElementById('ChatBox').removeAttribute('style');
                            document.getElementById('loginBox').setAttribute('style', 'display:none');

                            document.getElementById("profilePic").src = user.photoURL;
                            document.getElementById("myUser").innerHTML = user.displayName;
                            document.getElementById("myEmail").innerHTML = user.email;
                        }
                    });
                }
                else {
                    document.getElementById('ChatBox').removeAttribute('style');
                    document.getElementById('loginBox').setAttribute('style', 'display:none');

                    document.getElementById("profilePic").src = user.photoURL;
                    document.getElementById("myUser").innerHTML = user.displayName;
                    document.getElementById("myEmail").innerHTML = user.email;
                }
            })



            console.log(user);
            console.log(user.displayName);
        })
        .catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            alert(errorMessage);
            // ...
        });
}


function LoadMessage() {

    var Listmessage = "";
    
    var db = firebase.database().ref('Messages').on('value', function (users) {
        users.forEach(function (data) {
            var user = data.val();
            console.log(user);

            if (user.email !== firebase.auth().currentUser.email) {
                Listmessage += `<div class="row" id="Reciever">
                                    <div class="col-md-1">
                                        <img src="${user.picture}" class="profile">
                                    </div>
                                    <div class="col-md-5 ">
                                        <p class="alert alert-success text-dark " style="display: inline-block;">${user.message}
                                            <small class="ml-5 text-muted">${user.date}</small>
                                        </p>
                                    </div>
                                </div>`;

                // console.log(userProfile);
            }
            else {
                Listmessage += `<div class="row justify-content-end" id="Sender">
                                    <div class="col-md-5">
                                        <p class="alert alert-secondary text-dark float-right" style="display: inline-block;">
                                        ${user.message}
                                        <small class="ml-5 text-muted">${user.date}</small>
                                        <small>sender</small>
                                        </p>
                                    </div>
                                    <div class="col-md-1">
                                        <img src="${user.picture}" class="profile"> 
                                    </div>
                                </div>`;
            }


            document.getElementById('messageArea').innerHTML = Listmessage;
            document.getElementById('textMessage').value = "";
            document.getElementById('textMessage').focus();

            // Scroll Down to the last Message
            document.getElementById('messageArea').scrollTo(0, document.getElementById('messageArea').clientHeight);


        });

    });

    // console.log(user);
    // console.log(userMessage);       

};


function generateList() {
    document.getElementById('listFriend').innerHTML = `<div class="text-center"> 
    <span class="spinner-border text-primary mt-5" style="width:7rem;height:7rem">
    </span></div>`;

    var list = "";

    var db = firebase.database().ref('users').on('value', function (users) {
        if (users.hasChildren()) {
            list = `<li class="list-group-item" style="background-color:#f8f8f8;">
                        <input type="text" placeholder="Search User" class="form-control form-rounded">
                    </li>`;
        }
        users.forEach(function (data) {
            var user = data.val();

            console.log(user);

            list += `<li class="list-group-item" style="background-color:#f8f8f8;">
                    <div class="row">
                        <div class="col-md-1">
                                <img src="${user.photoURL}" class="profile rounded-circle img-fluid">
                            </div>

                            <div class="col-md-11">
                                <h5 style="display: inline;" class="text-secondary">${user.name}</h5></br>
                                <small class="text-muted">${user.email}</small>
                            </div>
                    </div>
                    </li>`;
        });

        document.getElementById('listFriend').innerHTML = list;
    });
}



function signOut() {
    firebase.auth().signOut();
    console.log('success');
    document.getElementById('loginBox').removeAttribute('style');
    document.getElementById('ChatBox').setAttribute('style', 'display:none');
    location.reload();
}

function sendMessage() {

    var userMessage = {
        name:firebase.auth().currentUser.displayName,
        email: firebase.auth().currentUser.email,
        picture:firebase.auth().currentUser.photoURL,
        message: document.getElementById('textMessage').value,
        date: new Date().toLocaleString()
    };


    firebase.database().ref('Messages').push(userMessage);

    var Listmessage = "";
    
    var db = firebase.database().ref('Messages').on('value', function (users) {
        users.forEach(function (data) {
            var user = data.val();
            console.log(user);

            if (user.email !== firebase.auth().currentUser.email) {
                Listmessage += `<div class="row" id="Reciever">
                                    <div class="col-md-1">
                                        <img src="${user.picture}" class="profile">
                                    </div>
                                    <div class="col-md-5 ">
                                        <p class="alert alert-success text-dark " style="display: inline-block;">${user.message}
                                            <small class="ml-5 text-muted">${user.date}</small>
                                        </p>
                                    </div>
                                </div>`;

                // console.log(userProfile);
            }
            else {
                Listmessage += `<div class="row justify-content-end" id="Sender">
                                    <div class="col-md-5">
                                        <p class="alert alert-secondary text-dark float-right" style="display: inline-block;">
                                        ${user.message}
                                        <small class="ml-5 text-muted">${user.date}</small>
                                        <small>sender</small>
                                        </p>
                                    </div>
                                    <div class="col-md-1">
                                        <img src="${firebase.auth().currentUser.photoURL}" class="profile"> 
                                    </div>
                                </div>`;
            }


            document.getElementById('messageArea').innerHTML = Listmessage;
            document.getElementById('textMessage').value = "";
            document.getElementById('textMessage').focus();

            // Scroll Down to the last Message
            document.getElementById('messageArea').scrollTo(0, document.getElementById('messageArea').clientHeight);


        });

    });

    // console.log(user);
    // console.log(userMessage);       

};

// sendMessage();
// Email Authentication

//For SignUp
let SignUp = () => {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((result) => {
            console.log(result);
        })
        .catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;

            console.log(errorMessage);
        })

}

//For SignIn
let SignIn = () => {
    let email = document.getElementById("SignIn_email").value;
    let password = document.getElementById("SignIn_password").value;

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((result) => {
            console.log(result)
            document.getElementById('ChatBox').removeAttribute('style');
            document.getElementById('loginBox').setAttribute('style', 'display:none');
            LoadMessage();
        })
        .catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorMessage);

        });
}



// function onFirebaseStateChanged(){
//     firebase.auth().onAuthStateChanged(onStateChanged);
// }

// function onStateChanged(user){
//     alert(firebase.auth().currentUser.email+'\n'+firebase.auth().currentUser.displayName);

// }

// onFirebaseStateChanged();




// users.forEach(function (data) {
//     var user = data.val();
//     var message = `<div class="row justify-content-end" id="Sender">
//                 <div class="col-md-5">
//                     <p class="alert alert-secondary text-dark float-right" style="display: inline-block;">
//                     ${document.getElementById('textMessage').value}
//                     <small class="ml-5 text-muted">2:07</small>
//                     </p>
//                 </div>
//                 <div class="col-md-1">
//                     <img src="pp.png" class="profile"> 
//                 </div>
//             </div>`;

//     document.getElementById('messageArea').innerHTML += message;
//     document.getElementById('textMessage').value = "";
//     document.getElementById('textMessage').focus();

//     // Scroll Down to the last Message
//     document.getElementById('messageArea').scrollTo(0, document.getElementById('messageArea').clientHeight);



   //     // html += `<div class="row justify-content-end" id="Sender">
    //     //             <div class="col-md-5">
    //     //                 <p class="alert alert-secondary text-dark float-right" style="display: inline-block;">
    //     //                 ${document.getElementById('textMessage').value}
    //     //                 <small class="ml-5 text-muted">2:07</small>
    //     //                 </p>
    //     //             </div>
    //     //             <div class="col-md-1">
    //     //                 <img src="pp.png" class="profile">
    //     //             </div>
    //     //         </div>`;

    //     document.getElementById('messageArea').innerHTML += html;
    //     document.getElementById('textMessage').value = "";
    //     document.getElementById('textMessage').focus();

    //     // Scroll Down to the last Message
    //     document.getElementById('messageArea').scrollTo(0, document.getElementById('messageArea').clientHeight);


    //     // console.log(user);

    // });