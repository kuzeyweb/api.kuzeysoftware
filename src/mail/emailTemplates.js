export const emailValidationTemplate = (name, code) => {
    return {
        from: "mailer@kuzeysoftware.com",
        subject: "Email Adresi Doğrulama",
        text: "",
        html:
            `<div style="background-color: #000;font-family: Arial, sans-serif;">
        <img src="https://kuzeysoftware.com/kuzey-logo.png" alt="">
        <h2 style="margin-bottom: 40px;text-align: center; color: #fff;">Merhaba ${name},
            e-posta adresini doğrulayabilmemiz için lütfen aşağıdaki butona tıkla!</h2>
        <div style="padding-bottom: 20px;text-align: center;">
            <a href="${process.env.PUBLIC_URL}/email-confirmation?token=${code}" style="background-color: #fff;
                border: none;
                color: 000;
                border-radius : 24px;
                padding: 15px 32px;
                text-align: center;
                text-decoration: none;
                display: inline-block;
                font-size: 16px;">
                Buraya tıklayarak e-posta adresinizi doğrulayabilirsiniz.
            </a>
        </div>
    </div>`
    }
}

export const twoFactorAuthTemplate = (name, code) => {
    return {
        from: "mailer@kuzeysoftware.com",
        subject: "2 Faktörlü Doğrulama Kodunuz",
        text: "",
        html:
            `<div style="background-color: #000;">
         <img src="https://kuzeysoftware.com/kuzey-logo.png" alt="">
         <h2 style="margin-bottom: 40px;font-family: Arial, sans-serif;text-align: center; color: #fff;">Merhaba ${name}, <br> giriş yapabilmeniz için gerekli doğrulama kodu aşağıda verilmiştir.</h2>
         <div style="padding-bottom: 20px;text-align: center;display: flex; justify-content: center;">
         <b style="font-family: Arial;border: 1px dashed #fff; padding: 10px 30px;color: #fff;font-size: 30px;">${code}</b> 
         </div>
         </div>`}
}

export const passwordResetTemplate = (name, code, to) => {
    return {
        from: "mailer@kuzeysoftware.com",
        subject: "Şifremi Unuttum",
        text: "",
        html:
            `<div style="background-color: #000;font-family: Arial, sans-serif;">
        <img src="https://kuzeysoftware.com/kuzey-logo.png" alt="">
        <h2 style="margin-bottom: 40px;text-align: center; color: #fff;">Merhaba ${name},
            şifreni yenilemek için lütfen aşağıdaki butona tıkla!</h2>
        <div style="padding-bottom: 20px;text-align: center;">
            <a href="${process.env.PUBLIC_URL}/password-reset?token=${code}&email=${to}" style="background-color: #fff;
                border: none;
                color: 000;
                border-radius : 24px;
                padding: 15px 32px;
                text-align: center;
                text-decoration: none;
                display: inline-block;
                font-size: 16px;">
                Buraya tıklayarak şifrenizi yenileyebilirsiniz.
            </a>
        </div>
    </div>`
    }
}

export const contactMessageTemplate = (fullname, email, message) => {
    return {
        from: "mailer@kuzeysoftware.com",
        subject: "Sitenizden yeni mesaj var!",
        text: "",
        html:
            `<div style="background-color: #000;font-family: Arial, sans-serif;">
        <img src="https://kuzeysoftware.com/kuzey-logo.png" alt="">
        <h2 style="margin-bottom: 40px;text-align: center; color: #fff;">Merhaba,
            sitenizden yeni mesaj var!</h2>
        <div style="padding-bottom: 20px;text-align: center;">
            <div style="margin: 0 10px; border:1px dashed #fff"> 
            <p style="text-align:center;color:#fff">${message}</p>
            <p style="margin-left:30px;text-align:left;color:#fff">
            <b>Gönderen İsmi : ${fullname}</b>
            </p>
            <p style="margin-left:30px;text-align:left;color:#fff">
            <b>Gönderen E-Mail : <a href="mailto:${email}" target="_blank">${email}</a></b> 
            </p>
            <div class="yj6qo"></div><div class="adL"> </div></div>
        </div>
    </div>`
    }
}