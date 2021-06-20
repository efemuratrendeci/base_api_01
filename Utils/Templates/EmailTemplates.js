//
// ─── REQUIREMENTS ───────────────────────────────────────────────────────────────
//
const ApplicationInitializeInfo = require('../../ApplicationInitializeInfo');
// ────────────────────────────────────────────────────────────────────────────────


class EmailTemplates {
    static firstLogin = ({
        emailToken,
        fullname
    }) => {
        return `
        <!DOCTYPE html>
        <html lang="en">

        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Yeni Kullanıcı</title>
            <style></style>
        </head>
            
        <body>
            <div>
                <h1>Base API</h1>
                <br>
                <h5>${fullname.toUpperCase()} Hoş geldin!</h5>
                <br>
                <p> Bazı Güzel Açıklamalar ile programa başlayabiliriz! <br>
                </p>
                <br>
                <a href = "${process.env.API_URL}:${ApplicationInitializeInfo.PORT}/auth/verify_account/${emailToken}" > Buraya tıklayarak e-posta adresiniz için özel tanımlanmış
                    link ile hesabınızı doğrulayın.</a>
            </div>
        </body>
            
        </html>
        `
    };

    static resetPassword = ({
        emailToken,
        fullname
    }) => {
        return `
        <!DOCTYPE html>
        <html lang="en">

        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Yeni Kullanıcı</title>
            <style></style>
        </head>
            
        <body>
            <div>
                <h1>Base API</h1>
                <br>
                <h5>${fullname.toUpperCase()} Şireni Unuttun mu ?</h5>
                <br>
                <p> Bu işlemin sana ait olmadığını düşünüyorsan, bu maili görmezden gelebilirsin. <br>
                </p>
                <br>
                <a href = "${process.env.API_URL}:${ApplicationInitializeInfo.PORT}/auth/reset_password/${emailToken}" > Buraya tıklayarak e-posta adresiniz için özel tanımlanmış
                    link ile konfigürasyonlara başlayın!</a>
            </div>
        </body>
            
        </html>
        `
    };;
}

module.exports = EmailTemplates;