import { Request, Response } from 'express';
import { Stac_Api_Service } from '../services';

class Stac_Api_Controller {
  public async fetchAndSaveItems(req: Request, res: Response): Promise<any> {
    try {
      const { stac_collection, bbox, startDate, endDate } = req.query as any;

      if (!stac_collection || !bbox || !startDate || !endDate) {
        return res.status(400).json({
          error: 'Parâmetros obrigatórios: stac_collection, bbox, startDate, endDate'
        });
      }

      const allowedCollections = Stac_Api_Service.getWFISupportedCollections();

      if (!allowedCollections.includes(stac_collection)) {
        return res.status(400).json({
          error: 'Coleção inválida. Apenas coleções WFI dos satélites CBERS-4, CBERS-4A e Amazônia-1 são aceitas.',
          valid_collections: allowedCollections
        });
      }

      const items = await Stac_Api_Service.fetchFromStacApi(stac_collection, bbox, startDate, endDate);

      const updatedItems = items.map(item => ({
        ...item,
        stac_collection: item.collection
      }));

      await Stac_Api_Service.saveStacItems(updatedItems);

      res.status(201).json(updatedItems);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ error: 'Erro ao buscar ou salvar os dados', message: error.message });
      } else {
        res.status(500).json({ error: 'Erro desconhecido', message: String(error) });
      }
    }
  }

  public async listItems(req: Request, res: Response): Promise<void> {
    const items = await Stac_Api_Service.getAllStacItems();
    res.json(items);
  }

  public async getItem(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const item = await Stac_Api_Service.getStacItemById(id);
    if (!item) {
      res.status(404).json({ message: 'Item não encontrado' });
    } else {
      res.json(item);
    }
  }

  public async deleteItem(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    await Stac_Api_Service.deleteStacItemById(id);
    res.json({ message: 'Item deletado com sucesso' });
  }

  public listSupportedCollections(req: Request, res: Response): void {
    const collections = Stac_Api_Service.getWFISupportedCollections();
    res.json(collections);
  }
}

export default new Stac_Api_Controller();
