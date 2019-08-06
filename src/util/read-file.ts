import * as fs from 'fs';
import * as util from 'util'

export default util.promisify(fs.readFile);