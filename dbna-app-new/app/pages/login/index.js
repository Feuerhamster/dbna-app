$("#login-form").submit(function(event){

    $("#login-form").css("display", "none");

    $("#loader").children("img")[0].src="assets/dbna-logo-animated-4.gif";

    $("#loader").css("display", "flex");

    event.preventDefault();

    $.ajax({
        type: 'POST',
        url: 'https://www.dbna.com/json/user/login/',
        data: $(this).serialize(),
        success: function(data, status, xhr){

            setTimeout(()=>{
                pages.pages.login = false;
                pages.pages.loader = true;
                webviewelement.reload();
            },1000);

            ipcRenderer.send("dbna-successful-login", true);

        },
        error: function(xhr, options, thrownError){

            var data = JSON.parse(xhr.responseText);
            $("#error-response").html('<span class="err-msg">'+data.error.msg+'</span>');
            $("#login-form").css("display", "flex");
            $("#loader").css("display", "none");

        }

    });

    $('#login-form')[0].reset();

});