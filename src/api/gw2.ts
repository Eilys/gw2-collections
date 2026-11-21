import { GW2Api, ApiLanguage } from "guildwars2-ts";

export function createApi(token?: string) {
    return new GW2Api({
        token,                       // facultatif : inutile pour les endpoints publics
        language: ApiLanguage.English,
        rateLimitRetry: true,
        inBrowser: true,             // obligatoire dans un navigateur, sinon erreurs CORS
    });
}