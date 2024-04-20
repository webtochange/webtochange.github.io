document.addEventListener('DOMContentLoaded', function() {
    
    const css = `
    #alert-container{
        position: fixed;
        flex-direction: column;
        gap: 20px;
        width: 80%;
        top: 5%;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
    }
    .alert-window{
        padding: 30px 70px 30px 30px;
        border-radius: 10px;
        position: relative;
        opacity: 1;
    }

    .alert-success{
        background-color: #6efc8d;
        color: #034918;
    }

    .alert-error{
        background-color: #fd5a72;
        color: #380000;
    }

    .alert-warning{
        background-color: #ffd396;
        color: #292816;
    }

    .alert-info{
        background-color: #859fc0;
        color: #0d2541;
    }


    #alert-close{
        opacity: 0.6;
        position: absolute;
        top: 0;
        right: 0;
        height: 100%;
        aspect-ratio: 1;
        transform: rotate(45deg);
    }
    #close-icon {
        transform: translate(-50%, -50%);
        left: 50%;
        top: 50%;
        background: #252525;
        height: 50px;
        position: absolute;
        width: 10px;
    }
    #close-icon:after {
        background: #252525;
        content: "";
        height: 10px;
        left: -20px;
        position: absolute;
        top: 20px;
        width: 50px;
    }


    @keyframes fade-out-anim {
        from { opacity: 1; }
        to { opacity: 0; }
    }

    .fade-out {
        animation: fade-out-anim 5s ease-in-out;
        opacity: 0;
    }
    `;

    const styleElement = document.createElement('style');
    styleElement.textContent = css;
    document.head.appendChild(styleElement);

    let alertContainer = document.createElement("div");
    alertContainer.id = "alert-container";
    document.body.appendChild(alertContainer);

    const Alert = (msg, type = 0, removeTime = 0, redirect = "") => {
        let alertWindow = document.createElement("div");
        alertWindow.classList.add("alert-window");
        alertWindow.textContent = msg;
        alertContainer.appendChild(alertWindow);
        let alertClose = document.createElement("div");
        alertClose.id = "alert-close";
        let closeIcon = document.createElement("div");
        closeIcon.id = "close-icon";
        alertClose.appendChild(closeIcon);
        alertWindow.appendChild(alertClose);

        alertClose.addEventListener("click", () => {
            alertWindow.remove();
            if(!redirect == ""){
                window.location.href = redirect;
            }
        });

        if(!removeTime == 0){
            setTimeout(() => {
                alertWindow.classList.add('fade-out');
                setTimeout(() => {
                    alertWindow.remove();
                }, 5000);
            }, removeTime);
        }

        switch(type){
            case 0:
                alertWindow.classList.add("alert-success");
                break;
            case 1:
                alertWindow.classList.add("alert-error");
                break;
            case 2:
                alertWindow.classList.add("alert-warning");
                break;
            case 3:
                alertWindow.classList.add("alert-info");
                break;
        }
    }

});