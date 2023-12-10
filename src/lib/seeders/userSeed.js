import bcrypt from "bcrypt";

const usersData = [
    {
        name: "Admin As Limpieza",
        email: "admin.as.limpieza@gmail.com",
        address: "Admin As de la Limpieza",
        password: "adminaslimpieza123", // Deja este campo vacío por ahora
        token: "",
        verified: true,
    },
];

// Hashear las contraseñas antes de exportar los datos
const saltRounds = 10;

usersData.forEach((user) => {
    const hashedPassword = bcrypt.hashSync(user.password, saltRounds);
    user.password = hashedPassword;
});

export default usersData;
