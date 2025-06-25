import { useEffect, useState } from 'react';
import { Alert, Platform, SafeAreaView, StatusBar, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { setBackgroundColorAsync } from 'expo-system-ui';
import MenuInferior from '../../components/MenuInferior/MenuInferior';
import { IP, WEBPORT } from '@env';
import { getToken, saveToken } from '../../_lib/utils/secureStore';

const HomeScreen = () => {
  const [estaLogado, setEstaLogado] = useState(false);
  const url = `http://${IP}:${WEBPORT}`;

  // Verifica se há token salvo (login persistente)
  useEffect(() => {
    const verificarLogin = async () => {
      const token = await getToken('authToken');
      setEstaLogado(!!token); // true se houver token
    };

    setBackgroundColorAsync('#121212');
    verificarLogin();
  }, []);

  useEffect(() => {
    const simularMensagem = async () => {
      // Apenas para teste local, sem WebView
      const fakeEvent = {
        nativeEvent: {
          data: JSON.stringify({
            type: "SET_TOKEN",
            token: "token_ficticio",
            userId: "user_ficticio"
          })
        }
      };
      await handleWebMessage(fakeEvent);
    };
  
    simularMensagem();
  }, []);
  
  // Recebe token do WebView
  const handleWebMessage = async (event: any) => {
    try {
      console.log("📩 Mensagem recebida da WebView:", event.nativeEvent.data);
      const data = JSON.parse(event.nativeEvent.data);
      console.log('📩 Dados recebidos do WebView:', data);
      if (data.type === 'SET_TOKEN' && data.token) {
        await saveToken('authToken', data.token);

        if (data.userId) {
          await saveToken('userId', data.userId);
        }

        setEstaLogado(true); // Atualiza para mostrar o menu
        Alert.alert("Token recebido", "Usuário autenticado!");
      }
    } catch (error) {
      console.error("Erro ao processar mensagem do WebView:", error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#121212' }}>
      <StatusBar backgroundColor="#121212" barStyle="light-content" />
      <View style={{ flex: 1 }}>
        {Platform.OS === 'web' ? (
          <iframe
            src={url}
            style={{ width: '100%', height: 'calc(100vh - 100px)', border: 'none' }}
            title="WebView"
          />
        ) : (
          <WebView
            source={{ uri: url }}
            style={{ flex: 1 }}
            onMessage={handleWebMessage}
          />
        )}
      </View>

      {/* Mostra o menu apenas se logado */}
      {estaLogado && <MenuInferior />}
    </SafeAreaView>
  );
};

export default HomeScreen;
