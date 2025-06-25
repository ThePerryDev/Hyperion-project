import { View, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import styles from "./styles";
import Card from "../../components/Card/Card";
import MenuInferior from "../../components/MenuInferior/MenuInferior";
import Header from "../../components/Header/Header";
import { getToken } from "../../_lib/utils/secureStore";
import { IP, WEBPORT_BACKEND } from "@env";

interface Favorito {
  id: string;
  bbox: string;
  data: string;
  thumbnail: string;
}

const MenuFavoritosScreen = () => {
  const [favoritos, setFavoritos] = useState<Favorito[]>([]);
  const url = `${IP}:${WEBPORT_BACKEND}`;

  useEffect(() => {
    async function fetchFavoritos() {
      try {
        const token = await getToken("authToken");
        const res = await fetch(`http://${IP}:${WEBPORT_BACKEND}/api/v1/favoritos`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          console.error("❌ Erro na requisição:", res.status);
          return;
        }

        const json = await res.json();
        if (json && Array.isArray(json.favoritos)) {
          setFavoritos(json.favoritos);
        } else {
          console.warn("⚠️ Estrutura de resposta inesperada:", json);
        }
      } catch (err) {
        console.error("❌ Erro ao buscar favoritos:", err);
      }
    }

    fetchFavoritos();
  }, []);

  const handleToggleFavorite = async (id: string) => {
    const token = await getToken("authToken");
    await fetch(`http://${url}/api/v1/favoritos/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setFavoritos((prev) => prev.filter((fav) => fav.id !== id));
  };

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {favoritos.map((fav) => (
          <Card
            key={fav.id}
            id={fav.id}
            bbox={fav.bbox}
            data={fav.data}
            thumbnail={fav.thumbnail}
            isFavorito={true}
            onToggleFavorite={() => handleToggleFavorite(fav.id)}
          />
        ))}
      </ScrollView>
      <MenuInferior />
    </View>
  );
};

export default MenuFavoritosScreen;
