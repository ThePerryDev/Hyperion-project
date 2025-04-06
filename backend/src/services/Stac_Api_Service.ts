import axios from 'axios';
import { StacItem } from 'stac-ts';
import Stac_APIModel from '../models/Stac_Api_Model';

const STAC_BASE_URL = 'https://data.inpe.br/bdc/stac/v1';

class Stac_Api_Service {
  public async fetchFromStacApi(stac_collection: string, bbox: string, startDate: string, endDate: string): Promise<StacItem[]> {
    const url = `${STAC_BASE_URL}/collections/${stac_collection}/items?bbox=${bbox}&datetime=${startDate}/${endDate}`;
    const res = await axios.get(url);
    return res.data.features;
  }

  public async saveStacItems(items: StacItem[]): Promise<void> {
    await Stac_APIModel.insertMany(items, { ordered: false });
  }

  public async getAllStacItems(): Promise<StacItem[]> {
    return await Stac_APIModel.find();
  }

  public async getStacItemById(id: string): Promise<StacItem | null> {
    return await Stac_APIModel.findOne({ id });
  }

  public async deleteStacItemById(id: string): Promise<void> {
    await Stac_APIModel.deleteOne({ id });
  }

  public getWFISupportedCollections(): string[] {
    return [
      // CBERS-4
      'CBERS4-WFI-16D-2',
      'CBERS-WFI-8D-1',
      'CB4-WFI-L4-DN-1',
      'CB4-WFI-L4-SR-1',

      // CBERS-4A
      'CB4A-WFI-L2-DN-1',
      'CB4A-WFI-L4-DN-1',
      'CB4A-WFI-L4-SR-1',

      // AMAZÔNIA-1
      'AMZ1-WFI-L2-DN-1',
      'AMZ1-WFI-L4-DN-1',
      'AMZ1-WFI-L4-SR-1',

      // OPCIONAL: mista
      'charter-wfi-1'
    ];
  }

  public async checkCollectionExists(id: string): Promise<boolean> {
    try {
      const res = await axios.get(`${STAC_BASE_URL}/collections/${id}`);
      return !!res.data && res.status === 200;
    } catch {
      return false;
    }
  }
}

export default new Stac_Api_Service();
