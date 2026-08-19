import {createSnapshot,listSnapshots,removeSnapshot,clearSnapshots,compareSnapshots,fingerprint} from './state.js';
import {validateCatalogue} from './schema.js';
window.CatalogueAdmin={createSnapshot,listSnapshots,getSnapshot,removeSnapshot,clearSnapshots,compareSnapshots,fingerprint,validateCatalogue,version:'13.0'};
