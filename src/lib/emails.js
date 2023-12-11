import dotenv from "dotenv";
dotenv.config({
  path: "src/.env",
});
import nodemailer from "nodemailer";
const transport = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const emailRegister = async (userData) => {
  const { name, email, token } = userData;
  console.log(`Intentando enviar un correo electronico de activación al usuario ${email}`);
  // Envia el correo
  await transport.sendMail({
    from: "220103@utxicotepec.edu.mx", // Emitente
    to: email, // Destinatario
    subject: "As de la Limpieza: Verificar tu cuenta.", // Asunto
    text: "Bienvenido al As de la Limpieza, para activar tu cuenta haz clic en el botón de abajo:", //Cuerpo
    html: `
        <html>
        <head>
          <style>
          body {
              font-family: sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f0eae4;
              letter-spacing: 1px;
              font-size: 2em;
          }
      
          .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #ffffff;
          }
      
          header {
              text-align: center;
              background-color: #1797A6;
              color: #ffffff;
              padding: 10px 0;
          }
      
          span {
              font-size: 18px;
              font-weight: normal;
              color: #000000;
          }
      
          p {
              font-size: 14px;
              color: #000000;
              text-align: justify;
              margin: 10px 0;
          }
      
          a {
              display: block;
              width: 200px;
              margin: 0 auto;
              background-color: #F2921D;
              color: #ffffff;
              border-radius: 10px;
              padding: 10px 20px;
              text-align: center;
              font-size: 16px;
              text-decoration: none;
              margin-top: 20px;
          }
      
          a:hover {
              background-color: #F28705;
              box-shadow: 2px 2px 2px black;
          }
      
          fieldset {
            border: 10px double #1797A6;
            padding: 10px;
            border-radius: 2px;
          }
      
          footer {
              text-align: center;
              background-color: #212226;
              color: #ffffff;
              padding: 10px 0;
          }
      
          .signature {
              font-size: 14px;
              text-align: left;
              margin: 20px 0;
          }
      
          .resaltado {
              color: red;
              font-weight: bold;
          }
          </style>
        </head>
        <body>
          <div class="container">
            <header style="display: flex; justify-content: space-between; align-items: center;">
              <div style="display: flex; align-items: center;">
                <h1 style="font-size: 40px; font-weight: bold; color: #ffffff;">ㅤAs<span style="font-size: 40px; color: #ffffff">Limpieza</span></h1>
              </div>
              <div style="align-items: center; margin-bottom: 20px; margin-right: auto; margin-left: auto;">
                <a href="#https://www.facebook.com/" style="text-decoration: none; color: #bf8c2c; margin-right: 5px; display: inline-block; width: 25px; height: 25px; background-color: #F2921D;">
                  <img src="https://cdn-icons-png.flaticon.com/128/1077/1077041.png" alt="Facebook" style="width: 25px; height: 25px" />
                </a>
                <a href="#https://www.instagram.com/" style="text-decoration: none; color: #bf8c2c; margin-right: 5px; display: inline-block; width: 25px; height: 25px; background-color: #F2921D;">
                    <img src="https://cdn-icons-png.flaticon.com/128/1077/1077042.png" alt="Twitter" style="width: 25px; height: 25px" />
                </a>
                <a href="#https://twitter.com/" style="text-decoration: none; color: #bf8c2c; margin-right: 5px; display: inline-block; width: 25px; height: 25px; background-color: #F2921D;">
                    <img src="https://cdn-icons-png.flaticon.com/128/5968/5968958.png" alt="LinkedIn" style="width: 25px; height: 25px" />
                </a>
              </div>
            </header>
            <fieldset>
              <legend align="center">Nueva Cuenta</legend>      
              <p style="font-size: 18px; margin-top: 20px;">¡Bienvenido, ${name}!</p>
              <p>Para confirmar tu cuenta, haz click en el botón de abajo:</p>
              <a href = "http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/login/confirm/${token}">Haz clic aquí para activar la cuenta</a>
              <div class="signature" style="display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;">
                <p>Bienvenido a:</p>
                <iframe src="https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fphoto%2F%3Ffbid%3D195257749501674%26set%3Da.195257719501677&show_text=true&width=500" width="500" height="533" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>
                <p>El As de la Limpieza</p>
    
              </div>
              <p> <spam class="resaltado"><em>* En caso de no haber creado esta cuenta, ignora el correo.</em></spam></p>
        </div>
        </fieldset>
          <footer>
            &copy; AsLimpieza, 2023.
          </footer>
        </body>
      </html>`,
  });
};

const emailPasswordRecovery = async (userData) => {
  const { name, email, token } = userData;
  console.log(`Intentando enviar un correo electronico para la recuperación de cuenta del usuario: ${email}`);
  // ENVIO DEL CORREO
  await transport.sendMail({
    from: "220103@utxicotepec.edu.mx", // Emitente
    to: email, // Destinatario
    subject: "As de la Limpieza: Cambiar Contraseña.", // Asunto
    text: "Bienvenido de nuevo al As de la Limpieza, para cambiar tu contraseña haz clic en el botón de abajo:", //Cuerpo
    html: `
      <html>
      <head>
        <style>
        body {
            font-family: sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f0eae4;
            letter-spacing: 1px;
            font-size: 2em;
        }
    
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
        }
    
        header {
            text-align: center;
            background-color: #1797A6;
            color: #ffffff;
            padding: 10px 0;
        }
    
        span {
            font-size: 18px;
            font-weight: normal;
            color: #000000;
        }
    
        p {
            font-size: 14px;
            color: #000000;
            text-align: justify;
            margin: 10px 0;
        }
    
        a {
            display: block;
            width: 200px;
            margin: 0 auto;
            background-color: #F2921D;
            color: #ffffff;
            border-radius: 10px;
            padding: 10px 20px;
            text-align: center;
            font-size: 16px;
            text-decoration: none;
            margin-top: 20px;
        }
    
        a:hover {
            background-color: #F28705;
            box-shadow: 2px 2px 2px black;
        }
    
        fieldset {
          border: 10px double #1797A6;
          padding: 10px;
          border-radius: 2px;
        }
    
        footer {
            text-align: center;
            background-color: #212226;
            color: #ffffff;
            padding: 10px 0;
        }
    
        .signature {
            font-size: 14px;
            text-align: left;
            margin: 20px 0;
        }
    
        .resaltado {
            color: red;
            font-weight: bold;
        }
        </style>
      </head>
      <body>
        <div class="container">
          <header style="display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; align-items: center;">
              <h1 style="font-size: 40px; font-weight: bold; color: #ffffff;">ㅤAs<span style="font-size: 40px; color: #ffffff">Limpieza</span></h1>
            </div>
            <div style="align-items: center; margin-bottom: 20px; margin-right: auto; margin-left: auto;">
              <a href="#https://www.facebook.com/" style="text-decoration: none; color: #bf8c2c; margin-right: 5px; display: inline-block; width: 25px; height: 25px; background-color: #F2921D;">
                <img src="https://cdn-icons-png.flaticon.com/128/1077/1077041.png" alt="Facebook" style="width: 25px; height: 25px" />
              </a>
              <a href="#https://www.instagram.com/" style="text-decoration: none; color: #bf8c2c; margin-right: 5px; display: inline-block; width: 25px; height: 25px; background-color: #F2921D;">
                  <img src="https://cdn-icons-png.flaticon.com/128/1077/1077042.png" alt="Twitter" style="width: 25px; height: 25px" />
              </a>
              <a href="#https://twitter.com/" style="text-decoration: none; color: #bf8c2c; margin-right: 5px; display: inline-block; width: 25px; height: 25px; background-color: #F2921D;">
                  <img src="https://cdn-icons-png.flaticon.com/128/5968/5968958.png" alt="LinkedIn" style="width: 25px; height: 25px" />
              </a>
            </div>
          </header>
          <fieldset>
            <legend align="center">Cambiar Contraseña</legend>      
            <p style="font-size: 18px; margin-top: 20px;">¡Bienvenido, ${name}!</p>
            <p>Para cambiar tu contraseña, haz click en el botón de abajo:</p>
            <a href = "http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/login/update-password/${token}">Haz clic aquí para cambiar la contraseña</a>
            <div class="signature" style="display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;">
              <p>Bienvenido de nuevo a:</p>
              <iframe src="https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fphoto%2F%3Ffbid%3D195257749501674%26set%3Da.195257719501677&show_text=true&width=500" width="500" height="533" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>
              <p>El As de la Limpieza</p>

            </div>
            <p> <spam class="resaltado"><em>* En caso de no haber solicitado el cambio de contraseña, ignora el correo.</em></spam></p>
      </div>
      </fieldset>
        <footer>
          &copy; AsLimpieza, 2023.
        </footer>
      </body>
    </html>`,
  });
};

export { emailRegister, emailPasswordRecovery };
