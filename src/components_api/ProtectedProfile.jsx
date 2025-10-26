import { Navigate } from "react-router-dom";

export default function ProtectedProfile({ children }) {
  // Aqui você pega o valor real (pode ser token, id ou flag de login)
  const adm = localStorage.getItem("userAdm"); // Exemplo: salva '0' ou '1' no login

  // Se não tiver nada salvo → manda pro login
  if (adm === null) {
    return <Navigate to="/login" replace />;
  }

  // Se for usuário comum (adm = 0) → libera o acesso
  if (adm === "0") {
    return children;
  }

  // Caso contrário (adm = 1, por exemplo) → redireciona pra página do dev
  return <Navigate to="/dev" replace />;
}
