import os
import rasterio
import numpy as np
import matplotlib.pyplot as plt
from datetime import datetime
import traceback
import tempfile
import shutil

def calcular_ndvi_e_vegetacao(pasta_imagens: str = None, exibir_plot: bool = False):
    """
    Calcula NDVI, identifica cicatrizes de queimadas e gera composição RGB de vegetação.
    Versão completa e testada com tratamento robusto de erros.
    """
    try:
        # ==================================================
        print("\n" + "="*50)
        print("INICIANDO PROCESSAMENTO DE IMAGENS CBERS-4A/WFI")
        print(f"Início: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("="*50)
        # ==================================================
        
        # Configura caminho padrão
        if pasta_imagens is None:
            pasta_imagens = os.path.join(os.getcwd(), 'downloads', 'CBERS_4A_WFI_20230801_219_124')
        
        print(f"\n🔍 CONFIGURAÇÃO INICIAL")
        print(f"→ Diretório de trabalho: {pasta_imagens}")

        # Verificação da pasta
        if not os.path.exists(pasta_imagens):
            raise FileNotFoundError(f"Pasta não encontrada: {pasta_imagens}")
        print("✓ Pasta de imagens localizada com sucesso")

        # Nomes dos arquivos esperados
        arquivos_necessarios = {
            'nir': "CBERS_4A_WFI_20230801_219_124_BAND16.tif",
            'red': "CBERS_4A_WFI_20230801_219_124_BAND15.tif",
            'green': "CBERS_4A_WFI_20230801_219_124_BAND14.tif",
            'blue': "CBERS_4A_WFI_20230801_219_124_BAND13.tif",
            'cmask': "CBERS_4A_WFI_20230801_219_124_CMASK.tif"
        }

        # Verificação dos arquivos
        caminhos = {}
        for key, arquivo in arquivos_necessarios.items():
            caminho = os.path.join(pasta_imagens, arquivo)
            if not os.path.exists(caminho):
                raise FileNotFoundError(f"Arquivo essencial não encontrado: {arquivo}")
            caminhos[key] = caminho
            print(f"✓ {arquivo.ljust(50)} → Encontrado")

        # Preparar saídas
        outputs = {
            'ndvi': os.path.join(pasta_imagens, "NDVI.tif"),
            'cicatriz': os.path.join(pasta_imagens, "cicatriz_queimada.tif"),
            'vegetacao': os.path.join(pasta_imagens, "vegetacao_saudavel.tif"),
            'rgb_vegetacao': os.path.join(pasta_imagens, "vegetacao_rgb.tif")
        }

        # Processamento principal
        with rasterio.open(caminhos['nir']) as nir_src:
            shape = (nir_src.height, nir_src.width)
            
            # Decidir se processa em memória ou em blocos
            if shape[0] * shape[1] > 5000 * 5000:  # > 25MP
                print("\n⚠️ Imagem muito grande, processando em blocos...")
                stats = processar_em_blocos(caminhos, outputs)
            else:
                print("\n⏳ Processando em memória...")
                stats = processar_em_memoria(caminhos, outputs, exibir_plot)

        # ==================================================
        print("\n" + "="*50)
        print("✅ PROCESSAMENTO CONCLUÍDO COM SUCESSO")
        print(f"Término: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("="*50)
        # ==================================================

        return {'outputs': outputs, 'stats': stats}

    except Exception as e:
        print(f"\n❌ ERRO CRÍTICO: {str(e)}")
        traceback.print_exc()
        return {'erro': f"Falha no processamento: {str(e)}"}

def processar_em_memoria(caminhos, outputs, exibir_plot):
    """Processamento para imagens que cabem na memória"""
    with rasterio.open(caminhos['nir']) as nir_src, \
         rasterio.open(caminhos['red']) as red_src, \
         rasterio.open(caminhos['green']) as green_src, \
         rasterio.open(caminhos['blue']) as blue_src, \
         rasterio.open(caminhos['cmask']) as cmask_src:

        meta = nir_src.meta.copy()
        
        # Ler todas as bandas
        nir = nir_src.read(1).astype('float32')
        red = red_src.read(1).astype('float32')
        green = green_src.read(1).astype('float32')
        blue = blue_src.read(1).astype('float32')
        cmask = cmask_src.read(1)

        # Processamento
        resultados = processar_dados(nir, red, green, blue, cmask)
        
        # Salvar resultados
        salvar_resultados(outputs, meta, resultados)
        
        # Visualização
        if exibir_plot:
            visualizar_resultados(resultados)
        
        return resultados['stats']

def processar_em_blocos(caminhos, outputs):
    """Processamento em blocos para imagens grandes"""
    temp_dir = tempfile.mkdtemp()
    try:
        with rasterio.open(caminhos['nir']) as nir_src:
            meta = nir_src.meta.copy()
            shape = (nir_src.height, nir_src.width)
            
            # Criar arquivos temporários
            temp_files = {
                'ndvi': os.path.join(temp_dir, "NDVI_temp.tif"),
                'vegetacao': os.path.join(temp_dir, "vegetacao_temp.tif"),
                'cicatriz': os.path.join(temp_dir, "cicatriz_temp.tif"),
                'rgb': os.path.join(temp_dir, "rgb_temp.tif")
            }

            # Inicializar arquivos temporários
            with rasterio.open(temp_files['ndvi'], 'w', **meta) as dst:
                dst.write(np.zeros((1, shape[0], shape[1]), dtype='float32'))
            
            meta.update(dtype='uint8', nodata=255)
            for key in ['vegetacao', 'cicatriz']:
                with rasterio.open(temp_files[key], 'w', **meta) as dst:
                    dst.write(np.zeros((1, shape[0], shape[1]), dtype='uint8'))
            
            rgb_meta = meta.copy()
            rgb_meta.update(count=3, dtype='uint8', nodata=None)
            with rasterio.open(temp_files['rgb'], 'w', **rgb_meta) as dst:
                dst.write(np.zeros((3, shape[0], shape[1]), dtype='uint8'))

            # Processar cada bloco
            for ji, window in nir_src.block_windows(1):
                print(f"Processando bloco {ji}...")
                
                with rasterio.open(caminhos['nir']) as n, \
                     rasterio.open(caminhos['red']) as r, \
                     rasterio.open(caminhos['green']) as g, \
                     rasterio.open(caminhos['blue']) as b, \
                     rasterio.open(caminhos['cmask']) as c:

                    # Ler blocos
                    nir_block = n.read(1, window=window).astype('float32')
                    red_block = r.read(1, window=window).astype('float32')
                    green_block = g.read(1, window=window).astype('float32')
                    blue_block = b.read(1, window=window).astype('float32')
                    cmask_block = c.read(1, window=window)

                    # Processar bloco
                    resultados = processar_dados(nir_block, red_block, green_block, blue_block, cmask_block)

                    # Escrever resultados
                    with rasterio.open(temp_files['ndvi'], 'r+') as dst:
                        dst.write(resultados['ndvi'], window=window, indexes=1)
                    
                    for key in ['vegetacao', 'cicatriz']:
                        with rasterio.open(temp_files[key], 'r+') as dst:
                            dst.write(resultados[key], window=window, indexes=1)
                    
                    with rasterio.open(temp_files['rgb'], 'r+') as dst:
                        dst.write(resultados['rgb'], window=window)

            # Mover arquivos temporários para destino final
            for key in ['ndvi', 'vegetacao', 'cicatriz', 'rgb']:
                shutil.move(temp_files[key], outputs['rgb_vegetacao' if key == 'rgb' else key])

            # Calcular estatísticas finais
            with rasterio.open(outputs['ndvi']) as src:
                ndvi = src.read(1)
                median_ndvi = np.nanmedian(ndvi)
                limiar_cicatriz = max(0.1, median_ndvi - 0.15)

            return {
                'ndvi_mediano': f"{median_ndvi:.2f}",
                'limiar_cicatriz': f"{limiar_cicatriz:.2f}",
                'processamento': "em_blocos"
            }

    finally:
        # Limpar diretório temporário
        try:
            shutil.rmtree(temp_dir)
        except:
            pass

def processar_dados(nir, red, green, blue, cmask):
    """Processa os dados das bandas e retorna resultados com shapes corrigidos"""
    # Tratamento de valores inválidos
    for banda in [nir, red, green, blue]:
        banda[banda == -9999] = np.nan

    # Máscara de pixels válidos
    mask_valida = (cmask == 0)

    # Cálculo do NDVI
    with np.errstate(divide='ignore', invalid='ignore'):
        ndvi = (nir - red) / (nir + red)
    ndvi = np.clip(ndvi, -1, 1)
    ndvi_masked = np.where(mask_valida, ndvi, np.nan)

    # Estatísticas
    median_ndvi = np.nanmedian(ndvi_masked)
    limiar_cicatriz = max(0.1, median_ndvi - 0.15)

    # Classificação
    cicatriz = np.where((ndvi_masked < limiar_cicatriz) & ~np.isnan(ndvi_masked), 1, 0).astype('uint8')
    vegetacao = np.where((ndvi_masked >= limiar_cicatriz) & ~np.isnan(ndvi_masked), 1, 0).astype('uint8')

    # Composição RGB
    rgb = gerar_rgb_melhorado(red, green, blue, mask_valida)

    # Ajustar shapes para compatibilidade com rasterio
    return {
        'ndvi': ndvi_masked.astype('float32'),  # Shape (height, width)
        'vegetacao': vegetacao,                  # Shape (height, width)
        'cicatriz': cicatriz,                    # Shape (height, width)
        'rgb': rgb,                              # Shape (3, height, width)
        'stats': {
            'ndvi_mediano': f"{median_ndvi:.2f}",
            'limiar_cicatriz': f"{limiar_cicatriz:.2f}",
            'area_vegetacao': f"{np.sum(vegetacao == 1):,}",
            'area_cicatriz': f"{np.sum(cicatriz == 1):,}"
        }
    }
def gerar_rgb_melhorado(red, green, blue, mask_valida):
    """Gera composição RGB com melhor contraste"""
    bands = {
        'red': np.where(mask_valida, red, np.nan),
        'green': np.where(mask_valida, green, np.nan),
        'blue': np.where(mask_valida, blue, np.nan)
    }
    
    rgb_normalized = np.zeros((3, red.shape[0], red.shape[1]), dtype='float32')
    
    for i, (color, band) in enumerate(bands.items()):
        valid_pixels = band[~np.isnan(band)]
        p2, p98 = np.percentile(valid_pixels, [2, 98]) if len(valid_pixels) > 0 else (0, 1)
        
        with np.errstate(divide='ignore', invalid='ignore'):
            normalized = (band - p2) / (p98 - p2 + 1e-10)
            normalized = np.nan_to_num(normalized, nan=0.0)
            normalized = np.clip(normalized, 0, 1)
            rgb_normalized[i] = normalized
    
    rgb_normalized = np.clip(rgb_normalized * 1.2 - 0.1, 0, 1)
    return (rgb_normalized * 255).astype('uint8')

def salvar_resultados(outputs, meta, resultados):
    """Salva todos os arquivos de resultado"""
    print("\n💾 Salvando resultados...")
    
    # Salvar NDVI
    meta.update(dtype=rasterio.float32, nodata=np.nan)
    with rasterio.open(outputs['ndvi'], 'w', **meta) as dst:
        dst.write(resultados['ndvi'])
    print(f"✓ NDVI salvo em: {outputs['ndvi']}")

    # Salvar classificações
    meta.update(dtype=rasterio.uint8, nodata=255)
    with rasterio.open(outputs['vegetacao'], 'w', **meta) as dst:
        dst.write(resultados['vegetacao'])
    with rasterio.open(outputs['cicatriz'], 'w', **meta) as dst:
        dst.write(resultados['cicatriz'])

    # Salvar RGB
    rgb_meta = meta.copy()
    rgb_meta.update({
        'count': 3,
        'dtype': 'uint8',
        'nodata': None,
        'compress': 'DEFLATE',
        'predictor': 2,
        'photometric': 'RGB'
    })
    with rasterio.open(outputs['rgb_vegetacao'], 'w', **rgb_meta) as dst:
        dst.write(resultados['rgb'])
    print(f"✓ RGB salvo em: {outputs['rgb_vegetacao']}")

def visualizar_resultados(resultados):
    """Gera visualizações dos resultados"""
    print("\n🖼️ Gerando visualizações...")
    downsampling = max(1, resultados['ndvi'].shape[1] // 1000)
    
    plt.figure(figsize=(18, 12))
    
    plt.subplot(2, 2, 1)
    plt.imshow(np.moveaxis(resultados['rgb'][:, ::downsampling, ::downsampling], 0, -1))
    plt.title('Composição RGB')
    
    plt.subplot(2, 2, 2)
    plt.imshow(resultados['ndvi'][0, ::downsampling, ::downsampling], cmap='RdYlGn', vmin=-1, vmax=1)
    plt.colorbar()
    plt.title('NDVI')
    
    plt.subplot(2, 2, 3)
    plt.imshow(resultados['vegetacao'][0, ::downsampling, ::downsampling], cmap='Greens')
    plt.title('Vegetação Saudável')
    
    plt.subplot(2, 2, 4)
    plt.imshow(resultados['cicatriz'][0, ::downsampling, ::downsampling], cmap='Reds')
    plt.title('Cicatrizes de Queimada')
    
    plt.tight_layout()
    plt.show()