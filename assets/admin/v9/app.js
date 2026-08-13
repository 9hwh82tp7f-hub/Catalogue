import {createSnapshot,listSnapshots,getSnapshot,removeSnapshot,clearSnapshots,compareSnapshots,fingerprint} from './state.js';
import {validateCatalogue} from './schema.js';
import {GitHubClient} from './github.js';
window.CatalogueV9={createSnapshot,listSnapshots,getSnapshot,removeSnapshot,clearSnapshots,compareSnapshots,fingerprint,validateCatalogue,GitHubClient,version:'9.0'};
