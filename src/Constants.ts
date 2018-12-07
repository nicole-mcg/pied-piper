import UpdateEndpoint from './endpoints/Update';

export const DATA_DIR_PATH = __dirname + "/../data";
export const DATA_FILE_PATH = __dirname + "/../data/file.json";

export const ENDPOINTS = {
    update: new UpdateEndpoint(),
}
