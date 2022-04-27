import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Axios } from 'axios';

export interface IApiResponse {
  results: any[];
  info: object;
}

export interface IListParams {
  page: string;
  limit: string;
  name: string;
}

export interface IListByIdParams {
  charactersIds: string;
}

export interface IListCharacterEpisodesParams {
  characterId: string;
}

@Injectable()
export class CharacterService {
  private baseURL: string;

  private request: Axios;

  constructor() {
    this.baseURL = 'https://rickandmortyapi.com/api';

    this.request = axios.create({
      baseURL: this.baseURL,
    });
  }

  async list(params: IListParams) {
    try {
      const { data } = await this.request.get<IApiResponse>('/character');

      const { results } = data;

      const parsedLimit = parseInt(params.limit);

      let totalResults = results.length;

      const totalToFilter =
        totalResults >= parsedLimit ? parsedLimit : totalResults;

      const filteredResults = this.filters(results, {
        name: params.name,
      });

      totalResults = filteredResults.length;

      const limitedResults = filteredResults.slice(0, totalToFilter);

      const pageDivision = totalResults / parsedLimit;

      const pages = Math.ceil(pageDivision);

      const info = {
        count: totalResults,
        pages,
      };

      return {
        info,
        results: limitedResults,
      };
    } catch (err) {
      console.log(err);

      throw err;
    }
  }

  async listByIds(params: IListByIdParams) {
    try {
      const { data } = await this.request.get(
        `/character/${params.charactersIds}`,
      );

      return data;
    } catch (err) {
      console.log(err);

      throw err;
    }
  }

  async listCharacterEpisodes(params: IListCharacterEpisodesParams) {
    try {
      const character = await this.listByIds({
        charactersIds: params.characterId,
      });

      const { episode: episodes } = character;

      const episodesInfo = await Promise.all(
        episodes.map(async (ep) => {
          const { data: episodeInfo } = await this.request.get(ep);

          const { name, air_date, episode: episode_number } = episodeInfo;

          return {
            name,
            air_date,
            episode_number,
          };
        }),
      );

      return episodesInfo;
    } catch (err) {
      console.log(err);

      throw err;
    }
  }

  private filters(results: any[], params: { name?: string }) {
    const keys = Object.keys(params);

    let filteredResults = results;

    keys.map((key) => {
      const value = params[key];

      if (!value) {
        return null;
      }

      filteredResults = filteredResults.filter((result) =>
        result[key].includes(params[key]),
      );
    });

    return filteredResults;
  }
}
